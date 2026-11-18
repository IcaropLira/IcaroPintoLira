import { useState } from 'react';
import type { ReleaseState } from '../lib/release';

function Cmd({ code }: { code: string }) {
  const [ok, setOk] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setOk(true);
      setTimeout(() => setOk(false), 1600);
    });
  };
  return (
    <div className="ig-cmd">
      <pre><code>{code}</code></pre>
      <button type="button" onClick={copy} aria-label="Copiar comando">{ok ? 'copiado ✓' : 'copiar'}</button>
    </div>
  );
}

interface Props {
  state: ReleaseState;
  appName: string;
  /** Nome do pacote no dnf e do arquivo instalado (ex.: hiraku-setup-manager). */
  packageName: string;
  dnfRepo?: string;
}

/** Passo a passo do AppImage (baixar, chmod, abrir e instalar no menu) e, se houver, do repositório dnf. */
export default function LinuxInstallGuide({ state, appName, packageName, dnfRepo }: Props) {
  const files = state.status === 'ok' ? state.release.files.filter((f) => f.kind === 'AppImage') : [];
  const appimage = files.find((f) => f.arch === 'x64') ?? files[0];
  const file = appimage?.name ?? `${appName.replace(/\s+/g, '.')}_*.AppImage`;
  const dest = `~/.local/bin/${packageName}.AppImage`;

  const desktop = `mkdir -p ~/.local/bin ~/.local/share/applications
mv ~/Downloads/${file} ${dest}
cat > ~/.local/share/applications/${packageName}.desktop <<EOF
[Desktop Entry]
Name=${appName}
Exec=$HOME/.local/bin/${packageName}.AppImage
Icon=utilities-terminal
Type=Application
Categories=Utility;Settings;
EOF`;

  return (
    <div className="ig">
      <h3>AppImage <span>(qualquer Linux)</span></h3>
      <ol className="ig-steps">
        <li>
          <b>Baixe</b>
          <p>
            {appimage
              ? <>Clique para baixar <a href={appimage.url} rel="noopener noreferrer">{appimage.name}</a>. Ele vai para a pasta <code>Downloads</code>.</>
              : <>Baixe o arquivo <code>.AppImage</code> na lista acima. Ele vai para a pasta <code>Downloads</code>.</>}
          </p>
        </li>
        <li>
          <b>Dê permissão de execução</b>
          <p>Sem isso o sistema não deixa abrir o arquivo.</p>
          <Cmd code={`cd ~/Downloads\nchmod +x ${file}`} />
        </li>
        <li>
          <b>Abra</b>
          <p>Já funciona assim, sem instalar nada. Se reclamar de <code>FUSE</code>, instale a <code>libfuse2</code> (Ubuntu 24.04: <code>sudo apt install libfuse2t64</code>; Fedora: <code>sudo dnf install fuse-libs</code>).</p>
          <Cmd code={`./${file}`} />
        </li>
        <li>
          <b>Instale no menu (opcional)</b>
          <p>Move o AppImage para <code>~/.local/bin</code> e cria o atalho no menu de aplicativos. O app continua se atualizando sozinho.</p>
          <Cmd code={desktop} />
        </li>
      </ol>

      {dnfRepo && (
        <>
          <h3>Fedora pelo dnf <span>(recomendado no Fedora)</span></h3>
          <p className="ig-p">Adiciona o repositório uma vez; depois as versões novas chegam junto com o <code>sudo dnf upgrade</code> do sistema.</p>
          <Cmd code={`sudo curl -fsSL -o /etc/yum.repos.d/${dnfRepo.split('/').pop()} ${dnfRepo}\nsudo dnf install ${packageName}`} />
        </>
      )}
    </div>
  );
}
