import { useMemo } from 'react';
import {
  ARCH_LABEL, detectPlatform, formatDate, formatSize, pickRecommended, PLATFORM_LABEL,
  type DownloadFile, type LatestRelease, type Platform, type ReleaseState,
} from '../lib/release';

const PLATFORMS: Platform[] = ['windows', 'macos', 'linux'];

function PlatformIcon({ platform }: { platform: Platform }) {
  const common = { viewBox: '0 0 24 24', width: 26, height: 26, 'aria-hidden': true, fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  if (platform === 'windows') {
    return <svg {...common}><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.2" /><rect x="13" y="3.5" width="7.5" height="7.5" rx="1.2" /><rect x="3.5" y="13" width="7.5" height="7.5" rx="1.2" /><rect x="13" y="13" width="7.5" height="7.5" rx="1.2" /></svg>;
  }
  if (platform === 'macos') {
    return <svg {...common}><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></svg>;
  }
  return <svg {...common}><rect x="3" y="4" width="18" height="16" rx="2.5" /><path d="m7.5 9.5 3 2.5-3 2.5M13 15h3.5" /></svg>;
}

function FileRow({ file, recommended, tag }: { file: DownloadFile; recommended: boolean; tag: string }) {
  const arch = ARCH_LABEL[file.platform][file.arch];
  return (
    <a className={`dl-row${recommended ? ' rec' : ''}`} href={file.url} rel="noopener noreferrer"
      aria-label={`Baixar ${file.kind}${arch ? ` ${arch}` : ''} da versão ${tag}`}>
      <span className="dl-main">
        <b>{file.kind}{arch ? <i> · {arch}</i> : null}</b>
        <span>{file.hint}</span>
      </span>
      <span className="dl-side">
        <span className="dl-size">{formatSize(file.size)}</span>
        <span className="dl-go" aria-hidden="true">↓</span>
      </span>
    </a>
  );
}

function PlatformCard({ platform, release, mine }: { platform: Platform; release: LatestRelease; mine: boolean }) {
  const files = release.files.filter((f) => f.platform === platform);
  const rec = pickRecommended(release.files, platform);
  return (
    <div className={`dl-card${mine ? ' mine' : ''}`}>
      <div className="dl-head">
        <span className="dl-ic"><PlatformIcon platform={platform} /></span>
        <h3>{PLATFORM_LABEL[platform]}</h3>
        {mine && <span className="badge dl-badge">seu sistema</span>}
      </div>
      {files.length === 0
        ? <p className="dl-empty">Esta versão não traz instalador para {PLATFORM_LABEL[platform]}. Veja a página da release.</p>
        : <div className="dl-list">{files.map((f) => <FileRow key={f.name} file={f} recommended={f === rec} tag={release.tag} />)}</div>}
    </div>
  );
}

export default function ReleaseDownloads({ state, releasesUrl }: { state: ReleaseState; releasesUrl: string }) {
  const mine = useMemo(detectPlatform, []);

  if (state.status === 'loading') {
    return (
      <div aria-busy="true" aria-live="polite">
        <div className="dl-bar skel" />
        <div className="dl-grid">{PLATFORMS.map((p) => <div key={p} className="dl-card skel" style={{ minHeight: 230 }} />)}</div>
      </div>
    );
  }

  if (state.status !== 'ok') {
    return (
      <div className="dl-fallback">
        <h3>{state.status === 'none' ? 'Ainda não há versão publicada' : 'Não consegui carregar a lista agora'}</h3>
        <p>
          {state.status === 'none'
            ? 'Assim que a primeira release for publicada, os instaladores aparecem aqui.'
            : 'O GitHub não respondeu (às vezes ele limita muitas consultas seguidas). Os instaladores continuam disponíveis direto na página das releases.'}
        </p>
        <div className="btns"><a className="btn p" href={releasesUrl} target="_blank" rel="noopener noreferrer">Abrir as releases ↗</a></div>
      </div>
    );
  }

  const { release } = state;
  const ordered = mine ? [mine, ...PLATFORMS.filter((p) => p !== mine)] : PLATFORMS;
  return (
    <div>
      <div className="dl-bar">
        <div className="dl-ver">
          <span className="dl-tag">{release.tag}</span>
          <span className="dl-date">publicada em {formatDate(release.date)}</span>
        </div>
        <div className="dl-links">
          {release.totalDownloads > 0 && <span className="dl-count">{release.totalDownloads.toLocaleString('pt-BR')} downloads</span>}
          <a href={release.url} target="_blank" rel="noopener noreferrer">Notas da versão ↗</a>
          <a href={releasesUrl} target="_blank" rel="noopener noreferrer">Versões anteriores ↗</a>
        </div>
      </div>
      <div className="dl-grid">
        {ordered.map((p) => <PlatformCard key={p} platform={p} release={release} mine={p === mine} />)}
      </div>
    </div>
  );
}
