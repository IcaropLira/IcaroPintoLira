import { useEffect, useRef } from 'react';

export interface Photo { src: string; alt: string; caption: string; w: number; h: number }

interface Props { photos: Photo[]; index: number | null; onChange: (i: number | null) => void }

/** Visualizador de fotos em tela cheia: Esc fecha, setas trocam de foto. */
export default function Lightbox({ photos, index, onChange }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;

  useEffect(() => {
    if (index === null) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const go = (d: number) => onChange((index + d + photos.length) % photos.length);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onChange(null);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [index, photos.length, onChange]);

  if (!open) return null;
  const p = photos[index];
  if (!p) return null;
  const go = (d: number) => onChange((index + d + photos.length) % photos.length);

  return (
    <div className="lb" role="dialog" aria-modal="true" aria-label="Galeria de fotos" onClick={() => onChange(null)}>
      <button ref={closeRef} type="button" className="lb-x" aria-label="Fechar" onClick={() => onChange(null)}>×</button>
      <button type="button" className="lb-n prev" aria-label="Foto anterior" onClick={(e) => { e.stopPropagation(); go(-1); }}>‹</button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={`/assets/conquistas/${p.src}`} width={p.w} height={p.h} alt={p.alt} />
        <figcaption>{p.caption}<span>{index + 1} / {photos.length}</span></figcaption>
      </figure>
      <button type="button" className="lb-n next" aria-label="Próxima foto" onClick={(e) => { e.stopPropagation(); go(1); }}>›</button>
    </div>
  );
}
