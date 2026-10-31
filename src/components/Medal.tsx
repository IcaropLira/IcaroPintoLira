import { useId } from 'react';

interface Props { size?: number; label?: string; className?: string }

/** Medalha de prata desenhada em SVG, com fita e um brilho que passa de tempos em tempos. */
export default function Medal({ size = 150, label = 'PRATA', className }: Props) {
  const id = useId().replace(/:/g, '');
  const w = size;
  const h = Math.round(size * 1.45);
  return (
    <svg className={`medal ${className ?? ''}`} width={w} height={h} viewBox="0 0 160 232" role="img" aria-label={`Medalha de ${label.toLowerCase()}`}>
      <defs>
        <linearGradient id={`${id}rA`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e23a52" /><stop offset="1" stopColor="#a8142b" /></linearGradient>
        <linearGradient id={`${id}rB`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#c21f3b" /><stop offset="1" stopColor="#7e0e20" /></linearGradient>
        <radialGradient id={`${id}face`} cx=".3" cy=".25" r="1.05">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".35" stopColor="#dfe3ec" /><stop offset=".75" stopColor="#a4adbf" /><stop offset="1" stopColor="#7b859a" />
        </radialGradient>
        <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f6f8fc" /><stop offset=".5" stopColor="#8e98ad" /><stop offset="1" stopColor="#e6e9f1" /></linearGradient>
        <linearGradient id={`${id}ink`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6a7490" /><stop offset="1" stopColor="#434b63" /></linearGradient>
        <linearGradient id={`${id}shine`} x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".85" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
        <clipPath id={`${id}clip`}><circle cx="80" cy="150" r="56" /></clipPath>
      </defs>
      <polygon points="30,0 68,0 104,100 66,100" fill={`url(#${id}rB)`} />
      <polygon points="92,0 130,0 94,100 56,100" fill={`url(#${id}rA)`} />
      <polygon points="78,0 86,0 70,100 62,100" fill="#fff" opacity=".9" />
      <circle cx="80" cy="150" r="64" fill="#0d0817" opacity=".35" />
      <circle cx="80" cy="150" r="60" fill={`url(#${id}rim)`} />
      <circle cx="80" cy="150" r="54" fill={`url(#${id}face)`} />
      <circle cx="80" cy="150" r="46" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="1.2" strokeDasharray="2 4" />
      <circle cx="80" cy="150" r="40" fill="none" stroke="#5d667d" strokeOpacity=".35" strokeWidth="1" />
      <path transform="translate(60 124) scale(1.67)" fill={`url(#${id}ink)`} d="M12,0Q13,11 24,12Q13,13 12,24Q11,13 0,12Q11,11 12,0Z" />
      <text x="80" y="188" textAnchor="middle" fontFamily="'Fira Code',monospace" fontWeight="500" fontSize="10.5" letterSpacing="3.2" fill={`url(#${id}ink)`}>{label}</text>
      <g clipPath={`url(#${id}clip)`}><rect className="medal-shine" x="-60" y="90" width="46" height="120" fill={`url(#${id}shine)`} transform="skewX(-20)" /></g>
    </svg>
  );
}
