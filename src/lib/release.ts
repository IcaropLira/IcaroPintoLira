import { useEffect, useState } from 'react';
import { GITHUB_USER } from '../data/profile';

export type Platform = 'windows' | 'macos' | 'linux';
export type Arch = 'x64' | 'arm64' | 'universal' | '';

export interface DownloadFile {
  name: string;
  url: string;
  size: number;
  downloads: number;
  platform: Platform;
  /** Nome curto do formato, como "Instalador" ou "AppImage". */
  kind: string;
  /** Texto de apoio, como "Recomendado para a maioria". */
  hint: string;
  arch: Arch;
}

export interface LatestRelease {
  tag: string;
  name: string;
  date: string;
  url: string;
  files: DownloadFile[];
  totalDownloads: number;
}

export type ReleaseState =
  | { status: 'loading' }
  | { status: 'ok'; release: LatestRelease }
  | { status: 'none' }
  | { status: 'error' };

interface ApiAsset { name: string; size: number; download_count: number; browser_download_url: string }
interface ApiRelease { tag_name: string; name: string | null; published_at: string; html_url: string; assets: ApiAsset[] }

const IGNORED = /\.(sig|json|zip|gz|blockmap|yml|yaml|txt|md5|sha256)$/i;

function detectArch(name: string): Arch {
  const n = name.toLowerCase();
  if (/aarch64|arm64/.test(n)) return 'arm64';
  if (/universal/.test(n)) return 'universal';
  if (/x64|x86_64|amd64|x86-64/.test(n)) return 'x64';
  return '';
}

/** Converte o nome de um arquivo da release em uma opção de download. Devolve null para o que não é instalador. */
export function classify(asset: ApiAsset): DownloadFile | null {
  const n = asset.name.toLowerCase();
  if (IGNORED.test(n) || n.endsWith('.app.tar.gz')) return null;
  const base = { name: asset.name, url: asset.browser_download_url, size: asset.size, downloads: asset.download_count, arch: detectArch(asset.name) };

  if (n.endsWith('.exe')) return { ...base, platform: 'windows', kind: 'Instalador', hint: 'NSIS, cria os atalhos no menu' };
  if (n.endsWith('.msi')) return { ...base, platform: 'windows', kind: 'MSI', hint: 'Para instalação gerenciada' };
  if (n.endsWith('.dmg')) return { ...base, platform: 'macos', kind: 'DMG', hint: 'Arraste o app para Aplicativos' };
  if (n.endsWith('.deb')) return { ...base, platform: 'linux', kind: 'DEB', hint: 'Debian, Ubuntu e derivados' };
  if (n.endsWith('.rpm')) return { ...base, platform: 'linux', kind: 'RPM', hint: 'Fedora e derivados' };
  if (n.endsWith('.appimage')) return { ...base, platform: 'linux', kind: 'AppImage', hint: 'Portátil, qualquer distribuição' };
  return null;
}

export const ARCH_LABEL: Record<Platform, Record<Arch, string>> = {
  windows: { x64: '64 bits', arm64: 'ARM64', universal: '', '': '' },
  macos: { x64: 'Intel', arm64: 'Apple Silicon', universal: 'Intel e Apple Silicon', '': '' },
  linux: { x64: 'x86_64', arm64: 'ARM64', universal: '', '': '' },
};

const PLATFORM_ORDER: Record<Platform, number> = { windows: 0, macos: 1, linux: 2 };
const KIND_ORDER = ['Instalador', 'MSI', 'DMG', 'DEB', 'RPM', 'AppImage'];

function toRelease(r: ApiRelease): LatestRelease {
  const files = r.assets
    .map(classify)
    .filter((f): f is DownloadFile => f !== null)
    .sort((a, b) => PLATFORM_ORDER[a.platform] - PLATFORM_ORDER[b.platform]
      || KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)
      || a.arch.localeCompare(b.arch));
  return {
    tag: r.tag_name,
    name: r.name?.trim() || r.tag_name,
    date: r.published_at,
    url: r.html_url,
    files,
    totalDownloads: r.assets.reduce((sum, a) => sum + a.download_count, 0),
  };
}

const TTL_MS = 10 * 60 * 1000;
const inflight = new Map<string, Promise<ReleaseState>>();

function readCache(key: string): LatestRelease | undefined {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;
    const { at, release } = JSON.parse(raw) as { at: number; release: LatestRelease };
    return Date.now() - at < TTL_MS ? release : undefined;
  } catch { return undefined; }
}

function writeCache(key: string, release: LatestRelease): void {
  try { sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), release })); } catch { /* armazenamento indisponível */ }
}

/** Busca a release mais recente publicada (ignora rascunhos e pré-lançamentos). */
function fetchLatest(repo: string): Promise<ReleaseState> {
  const key = `release:${GITHUB_USER}/${repo}`;
  const cached = readCache(key);
  if (cached) return Promise.resolve({ status: 'ok', release: cached });

  let p = inflight.get(key);
  if (!p) {
    p = fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } })
      .then(async (res): Promise<ReleaseState> => {
        if (res.status === 404) return { status: 'none' };
        if (!res.ok) return { status: 'error' };
        const release = toRelease((await res.json()) as ApiRelease);
        writeCache(key, release);
        return { status: 'ok', release };
      })
      .catch((): ReleaseState => ({ status: 'error' }));
    inflight.set(key, p);
    void p.then((s) => { if (s.status !== 'ok') inflight.delete(key); });
  }
  return p;
}

export function useLatestRelease(repo: string): ReleaseState {
  const [state, setState] = useState<ReleaseState>({ status: 'loading' });
  useEffect(() => {
    let alive = true;
    void fetchLatest(repo).then((s) => { if (alive) setState(s); });
    return () => { alive = false; };
  }, [repo]);
  return state;
}

/** Sistema do visitante, para destacar o download certo. Devolve null em celulares e quando não dá para saber. */
export function detectPlatform(): Platform | null {
  if (typeof navigator === 'undefined') return null;
  const nav = navigator as Navigator & { userAgentData?: { platform?: string } };
  const ua = `${nav.userAgentData?.platform ?? ''} ${navigator.platform} ${navigator.userAgent}`.toLowerCase();
  if (/android|iphone|ipad|ipod|cros/.test(ua)) return null;
  if (/win/.test(ua)) return 'windows';
  if (/mac/.test(ua)) return 'macos';
  if (/linux|x11|ubuntu|debian|fedora/.test(ua)) return 'linux';
  return null;
}

/** O arquivo que a maioria das pessoas de cada sistema quer. */
export function pickRecommended(files: DownloadFile[], platform: Platform): DownloadFile | undefined {
  const mine = files.filter((f) => f.platform === platform);
  const order = platform === 'windows' ? ['Instalador', 'MSI'] : platform === 'macos' ? ['DMG'] : ['AppImage', 'DEB', 'RPM'];
  for (const kind of order) {
    const hits = mine.filter((f) => f.kind === kind);
    const best = hits.find((f) => f.arch === 'arm64' && platform === 'macos') ?? hits.find((f) => f.arch === 'x64' || f.arch === 'universal') ?? hits[0];
    if (best) return best;
  }
  return mine[0];
}

export function formatSize(bytes: number): string {
  return `${(bytes / 1048576).toFixed(bytes >= 10485760 ? 0 : 1).replace('.', ',')} MB`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export const PLATFORM_LABEL: Record<Platform, string> = { windows: 'Windows', macos: 'macOS', linux: 'Linux' };
