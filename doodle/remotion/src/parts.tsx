// More things to draw, shared by the stories (27/11/2026). Same style as kit.tsx: outlines, flat colours, soft shadows.
import React from 'react';
import {INK, SKIN, RED, HAND, MARK, W, clamp, prog, lerp, easeOut, easeInOut, pop, hash, Calendar, Shadow} from './kit';

const S = (o: Record<string, unknown> = {}) => ({stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const, ...o});

// ---------- time ----------
// a calendar whose year runs from one to the other between a and b, its pages flying off
export const YearFlip: React.FC<{t: number; a: number; b: number; from: number; to: number; x: number; y: number; s: number; small?: string}> = ({t, a, b, from, to, x, y, s, small}) => {
  const q = easeInOut(prog(t, a, b - a));
  return (
    <g>
      {Array.from({length: 7}).map((_, i) => { const f = clamp(q * 1.3 - i * 0.12); return f > 0 && f < 1 ? <g key={i} transform={`translate(${lerp(x + 80, x + 620, f)} ${lerp(y - 160, y - 460 - i * 30, f)}) rotate(${f * 150}) scale(${0.55 * s})`}><rect x={-160} y={-120} width={320} height={240} fill="#fbf7ee" {...S()} /></g> : null; })}
      <Calendar x={x} y={y} s={s} year={String(Math.round(lerp(from, to, q)))} top={q >= 1 ? small : ''} />
    </g>
  );
};
export const Confetti: React.FC<{t: number; n?: number; y0?: number; h?: number; id?: string}> = ({t, n = 28, y0 = 600, h = 900, id = 'cf'}) => (
  <g>{Array.from({length: n}).map((_, i) => { const x = hash(id + i) * W, y = y0 + ((hash(id + 'y' + i) * h + t * (120 + hash(id + 's' + i) * 90)) % h); return <rect key={i} x={-11} y={-6} width={22} height={12} rx={2} fill={['#d6453a', '#f6c543', '#3d74c4', '#2e8b57', '#f08fb0'][i % 5]} transform={`translate(${x} ${y}) rotate(${t * 200 + i * 40})`} />; })}</g>
);
export const Sparkles: React.FC<{x: number; y: number; r: number; t: number; c?: string; n?: number}> = ({x, y, r, t, c = '#f6c543', n = 6}) => (
  <g>{Array.from({length: n}).map((_, i) => { const a = (i / n) * Math.PI * 2 + t * 1.6; const k = 0.7 + 0.3 * Math.sin(t * 8 + i); return <path key={i} transform={`translate(${x + Math.cos(a) * r} ${y + Math.sin(a) * r * 0.8}) scale(${k})`} d="M 0 -22 L 6 -6 L 22 0 L 6 6 L 0 22 L -6 6 L -22 0 L -6 -6 Z" fill={c} stroke={INK} strokeWidth={3} />; })}</g>
);
export const QMark: React.FC<{x: number; y: number; s: number; rot?: number; c?: string}> = ({x, y, s, rot = 0, c = '#e0702a'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><text textAnchor="middle" y={60} fontFamily={MARK} fontSize={180} fill={c} stroke={INK} strokeWidth={10} paintOrder="stroke">？</text></g>
);
export const XMark: React.FC<{x: number; y: number; r: number; t: number; a: number; c?: string}> = ({x, y, r, t, a, c = RED}) => {
  const p = prog(t, a, 0.14), q = prog(t, a + 0.1, 0.14);
  return <g stroke={c} strokeWidth={r * 0.16} strokeLinecap="round">{p > 0 && <line x1={x - r} y1={y - r} x2={x - r + 2 * r * p} y2={y - r + 2 * r * p} />}{q > 0 && <line x1={x + r} y1={y - r} x2={x + r - 2 * r * q} y2={y - r + 2 * r * q} />}</g>;
};
export const Check: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#dropS)"><circle r={110} fill="#e7f3df" stroke="#2e8b57" strokeWidth={10} /><path d="M -50 0 L -12 40 L 56 -46" fill="none" stroke="#2e8b57" strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" /></g>
);
export const Arrow: React.FC<{x1: number; y1: number; x2: number; y2: number; p?: number; c?: string; w?: number}> = ({x1, y1, x2, y2, p = 1, c = RED, w = 16}) => {
  const ex = lerp(x1, x2, p), ey = lerp(y1, y2, p), a = Math.atan2(y2 - y1, x2 - x1);
  return <g><line x1={x1} y1={y1} x2={ex} y2={ey} stroke={c} strokeWidth={w} strokeLinecap="round" />{p >= 1 && <path d={`M ${x2 + Math.cos(a) * w} ${y2 + Math.sin(a) * w} L ${x2 - Math.cos(a - 0.5) * w * 3.4} ${y2 - Math.sin(a - 0.5) * w * 3.4} L ${x2 - Math.cos(a + 0.5) * w * 3.4} ${y2 - Math.sin(a + 0.5) * w * 3.4} Z`} fill={c} />}</g>;
};
export const Balloon: React.FC<{x: number; y: number; w: number; h: number; tx: number; ty: number; k?: number; children?: React.ReactNode}> = ({x, y, w, h, tx, ty, k = 1, children}) => (
  <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} filter="url(#drop)">
    <path d={`M ${x - w / 2 + 40} ${y - h / 2} H ${x + w / 2 - 40} Q ${x + w / 2} ${y - h / 2} ${x + w / 2} ${y - h / 2 + 40} V ${y + h / 2 - 40} Q ${x + w / 2} ${y + h / 2} ${x + w / 2 - 40} ${y + h / 2} H ${clamp(tx, x - w / 2 + 120, x + w / 2 - 60) + 40} L ${tx} ${ty} L ${clamp(tx, x - w / 2 + 120, x + w / 2 - 60) - 30} ${y + h / 2} H ${x - w / 2 + 40} Q ${x - w / 2} ${y + h / 2} ${x - w / 2} ${y + h / 2 - 40} V ${y - h / 2 + 40} Q ${x - w / 2} ${y - h / 2} ${x - w / 2 + 40} ${y - h / 2} Z`} fill="#fffdf6" {...S({strokeWidth: 6})} />
    {children}
  </g>
);

// ---------- Japan ----------
export const Fuji: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -300 0 C -170 -50, -100 -210, -56 -262 L 56 -262 C 100 -210, 170 -50, 300 0 Z" fill="#6f8fb8" {...S()} />
    <path d="M -300 0 C -170 -50, -100 -210, -56 -262 L -20 -262 C -60 -200, -130 -60, -220 0 Z" fill="#5f7ea8" opacity={0.6} />
    <path d="M -56 -262 L 56 -262 C 70 -244, 82 -226, 94 -204 L 64 -220 L 34 -192 L 2 -222 L -30 -190 L -60 -218 L -94 -204 C -82 -226, -70 -244, -56 -262 Z" fill="#fbfbf6" {...S({strokeWidth: 4})} />
  </g>
);
// the first Shinkansen (0 series), seen from the side, its nose to the left at x, its rail at y
export const Shinkansen: React.FC<{x: number; y: number; s: number; len?: number; flip?: boolean; lit?: boolean}> = ({x, y, s, len = 1300, flip, lit = true}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {Array.from({length: Math.floor((len - 120) / 260)}).map((_, i) => [150 + i * 260, 210 + i * 260].map(wx => <g key={wx}><circle cx={wx} cy={-18} r={22} fill="#3b3b3d" {...S({strokeWidth: 3.5})} /><circle cx={wx} cy={-18} r={7} fill="#9a9894" /></g>))}
    <path d={`M 10 -80 C 10 -150, 110 -205, 250 -210 L ${len} -210 L ${len} -34 L 80 -34 C 36 -36, 10 -56, 10 -80 Z`} fill="#fbfaf4" {...S()} />
    <path d={`M 268 -170 L ${len} -170 L ${len} -122 L 196 -122 C 214 -142, 238 -162, 268 -170 Z`} fill="#2f5fa8" {...S({strokeWidth: 3.5})} />
    <path d={`M 40 -62 L ${len} -62 L ${len} -34 L 80 -34 C 62 -36, 48 -46, 40 -62 Z`} fill="#2f5fa8" {...S({strokeWidth: 3.5})} />
    <ellipse cx={44} cy={-96} rx={30} ry={26} fill="#e9e5d8" {...S({strokeWidth: 4})} />
    <ellipse cx={100} cy={-132} rx={18} ry={11} fill="#fff3c2" {...S({strokeWidth: 3})} />
    <path d="M 172 -192 L 252 -200 L 252 -172 L 142 -172 Z" fill="#bfe0f0" {...S({strokeWidth: 3.5})} />
    {Array.from({length: Math.floor((len - 330) / 72)}).map((_, i) => <rect key={i} x={300 + i * 72} y={-160} width={46} height={30} rx={4} fill={lit ? '#fff4cc' : '#e3f3fb'} {...S({strokeWidth: 2.5})} />)}
    {Array.from({length: Math.floor(len / 520)}).map((_, i) => <g key={i}><path d={`M ${560 + i * 520} -210 L ${600 + i * 520} -256 L ${640 + i * 520} -210`} fill="none" {...S({strokeWidth: 4})} /><path d={`M ${572 + i * 520} -258 H ${628 + i * 520}`} {...S({strokeWidth: 5})} /></g>)}
  </g>
);
// the National Diet Building, (x, y) the middle of its foot
export const Diet: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#dropS)">
    <rect x={-360} y={-160} width={720} height={160} fill="#e4dccb" {...S()} />
    {Array.from({length: 14}).map((_, i) => { const wx = -330 + i * 48; return Math.abs(wx + 10) < 110 ? null : <g key={i}><rect x={wx} y={-134} width={24} height={44} fill="#8fa3ad" {...S({strokeWidth: 2.5})} /><rect x={wx} y={-74} width={24} height={44} fill="#8fa3ad" {...S({strokeWidth: 2.5})} /></g>; })}
    <rect x={-104} y={-250} width={208} height={250} fill="#ece5d6" {...S()} />
    {[-70, -24, 24, 70].map(cx => <rect key={cx} x={cx - 8} y={-156} width={16} height={146} fill="#f6f1e6" {...S({strokeWidth: 3})} />)}
    <path d="M -104 -160 H 104" {...S({strokeWidth: 4})} />
    <rect x={-24} y={-74} width={48} height={74} fill="#6b5a44" {...S({strokeWidth: 3.5})} />
    <rect x={-66} y={-340} width={132} height={90} fill="#ece5d6" {...S()} />
    {[-34, 0, 34].map(cx => <rect key={cx} x={cx - 9} y={-322} width={18} height={54} fill="#8fa3ad" {...S({strokeWidth: 2.5})} />)}
    <rect x={-80} y={-364} width={160} height={26} fill="#d8cfbc" {...S({strokeWidth: 4})} />
    <rect x={-60} y={-390} width={120} height={26} fill="#d8cfbc" {...S({strokeWidth: 4})} />
    <rect x={-40} y={-416} width={80} height={26} fill="#d8cfbc" {...S({strokeWidth: 4})} />
    <path d="M -24 -416 L 24 -416 L 0 -460 Z" fill="#d8cfbc" {...S({strokeWidth: 4})} />
  </g>
);
export const CoinTower: React.FC<{x: number; y: number; n: number; s?: number}> = ({x, y, n, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={0} w={220} />
    {Array.from({length: n}).map((_, i) => <g key={i} transform={`translate(${Math.sin(i * 1.7) * 5} ${-i * 18 - 14})`}><ellipse rx={78} ry={22} fill={i % 2 ? '#f0c64a' : '#e6b638'} {...S({strokeWidth: 3.5})} /><path d="M -78 0 V -6 M 78 0 V -6" {...S({strokeWidth: 3.5})} /></g>)}
  </g>
);
export const Egg: React.FC<{x: number; y: number; s: number; rot?: number; text?: string}> = ({x, y, s, rot = 0, text = 'ウソ'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -210 C 130 -210, 196 -20, 196 66 C 196 176, 104 236, 0 236 C -104 236, -196 176, -196 66 C -196 -20, -130 -210, 0 -210 Z" fill="#fbf4e2" {...S({strokeWidth: 6})} />
    <path d="M 110 -60 C 150 0, 160 80, 130 150" fill="none" stroke="#e3d4ae" strokeWidth={16} strokeLinecap="round" />
    {text && <text y={92} textAnchor="middle" fontFamily={MARK} fontSize={130} fill={RED}>{text}</text>}
  </g>
);
export const Rock: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -200 70 C -226 -40, -158 -150, -40 -170 C 70 -190, 186 -140, 210 -30 C 228 60, 180 146, 60 156 C -60 166, -180 156, -200 70 Z" fill="#9b9ea4" {...S({strokeWidth: 6})} />
    <path d="M -160 -40 C -120 -110, -40 -140, 40 -140" fill="none" stroke="#c3c6cb" strokeWidth={16} strokeLinecap="round" />
    <path d="M -130 -50 L -80 -20 M 120 40 L 160 10 M -40 110 L 0 90" stroke="#6f7378" strokeWidth={5} strokeLinecap="round" />
    <text y={36} textAnchor="middle" fontFamily={MARK} fontSize={118} fill={INK}>責任</text>
  </g>
);
// the memorial at the end of platforms 18 and 19 of Tokyo Station: a brick wall, a bronze plate with a face
export const Monument: React.FC<{x: number; y: number; s: number; words?: boolean; look?: number}> = ({x, y, s, words = true, look = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={0} w={420} o={0.3} />
    <rect x={-170} y={-36} width={340} height={36} fill="#b9b3a6" {...S()} />
    <rect x={-150} y={-440} width={300} height={404} fill="#b5553c" {...S()} />
    <rect x={-150} y={-440} width={300} height={404} fill="url(#bricks)" />
    <rect x={-116} y={-400} width={232} height={300} rx={6} fill="#8c7a4a" {...S()} />
    <circle cx={0} cy={-292} r={84} fill="#a8955c" {...S({strokeWidth: 4})} />
    <path d="M -64 -206 C -60 -250, 60 -250, 64 -206 Z" fill="#77673c" {...S({strokeWidth: 3.5})} />
    <ellipse cx={0} cy={-300} rx={46} ry={50} fill="#c2ad6e" {...S({strokeWidth: 4})} />
    <path d="M -44 -312 C -50 -336, -30 -352, -16 -350 M 44 -312 C 50 -336, 30 -352, 16 -350" fill="none" stroke="#4a3f22" strokeWidth={5} />
    <g stroke="#4a3f22" strokeWidth={4} fill="none"><circle cx={-17} cy={-304} r={13} /><circle cx={17} cy={-304} r={13} /><path d="M -4 -304 H 4" /><path d="M -14 -276 Q 0 -268 14 -276" /></g>
    <circle cx={-17 + look} cy={-304} r={3.5} fill="#4a3f22" /><circle cx={17 + look} cy={-304} r={3.5} fill="#4a3f22" />
    {words && <text x={0} y={-130} textAnchor="middle" fontFamily={MARK} fontSize={34} fill="#3a3018">一花開天下春</text>}
  </g>
);
// a Shinkansen platform seen from the side: a roof on pillars, a floor at y with its yellow line
export const Platform: React.FC<{y: number; roof?: number; yellow?: boolean}> = ({y, roof = 640, yellow = true}) => (
  <g>
    <rect x={0} y={roof - 50} width={W} height={50} fill="#8b9aa5" {...S()} />
    <rect x={0} y={roof} width={W} height={20} fill="#6d7a84" />
    {[140, 540, 940].map(px => <g key={px}><rect x={px - 18} y={roof + 20} width={36} height={y - roof - 20} fill="#a9b4bb" {...S({strokeWidth: 4})} /><path d={`M ${px - 60} ${roof + 20} L ${px - 18} ${roof + 70} M ${px + 60} ${roof + 20} L ${px + 18} ${roof + 70}`} {...S({strokeWidth: 6})} /></g>)}
    <rect x={0} y={y} width={W} height={120} fill="#cfc8ba" {...S({strokeWidth: 4})} />
    {yellow && <rect x={0} y={y + 6} width={W} height={18} fill="#f2c230" {...S({strokeWidth: 2.5})} />}
  </g>
);
// a television set of the 1960s on legs; children draws in its screen (0, 0) to (300, 210)
export const TV: React.FC<{x: number; y: number; s: number; children?: React.ReactNode}> = ({x, y, s, children}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={110} w={420} />
    <path d="M -120 0 L -150 110 M 120 0 L 150 110" stroke="#5a3d22" strokeWidth={12} strokeLinecap="round" />
    <path d="M -40 -300 L -110 -410 M 40 -300 L 110 -410" {...S({strokeWidth: 5})} />
    <rect x={-230} y={-310} width={460} height={310} rx={22} fill="#9a6b3d" {...S({strokeWidth: 6})} />
    <rect x={-200} y={-280} width={330} height={250} rx={34} fill="#3a3330" {...S({strokeWidth: 4})} />
    <clipPath id="tvscreen"><rect x={-190} y={-270} width={310} height={230} rx={30} /></clipPath>
    <g clipPath="url(#tvscreen)"><rect x={-190} y={-270} width={310} height={230} fill="#cfdad8" /><g transform="translate(-190 -270)">{children}</g>
      {Array.from({length: 29}).map((_, i) => <rect key={i} x={-190} y={-270 + i * 8} width={310} height={2} fill="#2a3a40" opacity={0.08} />)}</g>
    <circle cx={180} cy={-220} r={24} fill="#e8e0cc" {...S({strokeWidth: 4})} /><circle cx={180} cy={-150} r={24} fill="#e8e0cc" {...S({strokeWidth: 4})} />
    {[0, 1, 2, 3].map(i => <path key={i} d={`M 158 ${-96 + i * 16} H 202`} {...S({strokeWidth: 3})} />)}
  </g>
);
// a Japanese room: paper window, a hanging scroll, tatami
export const Room: React.FC<{floor?: number}> = ({floor = 1560}) => (
  <g>
    <rect x={0} y={0} width={W} height={floor} fill="#e9dcbc" />
    <rect x={0} y={floor - 30} width={W} height={30} fill="#8a6440" {...S({strokeWidth: 4})} />
    <rect x={0} y={floor} width={W} height={400} fill="#c9c58e" />
    {[0, 1, 2, 3].map(i => <path key={i} d={`M ${i * 300 - 60} ${floor} L ${i * 300 - 160} 1920`} stroke="#4f6a3a" strokeWidth={6} />)}
    <rect x={70} y={640} width={400} height={560} fill="#fbf8ef" {...S({strokeWidth: 7})} />
    {[1, 2].map(i => <path key={i} d={`M ${70 + i * 133} 640 V 1200`} {...S({strokeWidth: 4})} />)}
    {[1, 2, 3].map(i => <path key={'h' + i} d={`M 70 ${640 + i * 140} H 470`} {...S({strokeWidth: 4})} />)}
  </g>
);
export const Zabuton: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}><ellipse rx={190} ry={40} fill="#8d5a8f" {...S()} /><path d="M -140 -6 Q 0 -30 140 -6" fill="none" stroke="#a978ab" strokeWidth={8} /></g>
);

// ---------- the 1950s ----------
export const Steam: React.FC<{x: number; y: number; s: number; t: number; webs?: boolean}> = ({x, y, s, t, webs}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map(i => { const ph = (t * 0.35 + i / 3) % 1; return <circle key={i} cx={250 + ph * 70} cy={-270 - ph * 160} r={40 + ph * 60} fill="#b4b0a8" opacity={0.8 * (1 - ph)} {...S({strokeWidth: 3})} />; })}
    <rect x={-130} y={-200} width={160} height={170} fill="#3a3a3c" {...S()} />
    <rect x={-100} y={-170} width={74} height={56} fill="#cfe6f3" {...S({strokeWidth: 3.5})} />
    <path d="M -150 -200 H 50" {...S({strokeWidth: 8})} />
    <rect x={30} y={-160} width={260} height={130} rx={16} fill="#2d2d30" {...S()} />
    <rect x={226} y={-226} width={42} height={70} fill="#2d2d30" {...S()} />
    <path d="M 290 -30 L 346 -30 L 290 -84 Z" fill="#8c2f25" {...S({strokeWidth: 4})} />
    <ellipse cx={120} cy={-168} rx={32} ry={18} fill="#c9a13b" {...S({strokeWidth: 4})} />
    {[-80, 44, 136, 228].map(wx => <g key={wx}><circle cx={wx} cy={-28} r={wx < 0 ? 30 : 36} fill="#8c2f25" {...S({strokeWidth: 4.5})} /><circle cx={wx} cy={-28} r={8} fill="#d9d4c8" /></g>)}
    <path d="M 44 -28 H 228" stroke="#77797d" strokeWidth={8} strokeLinecap="round" />
    {webs && <path d="M 200 -150 Q 240 -120 250 -60 M 180 -140 Q 230 -110 250 -60 M 220 -158 Q 250 -110 250 -60 M 190 -120 Q 230 -116 244 -90" fill="none" stroke="#e8e4da" strokeWidth={3} />}
  </g>
);
export const Plane: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 0 L -120 90 L -70 90 L 50 0 Z" fill="#c9d3da" {...S({strokeWidth: 4})} />
    <path d="M -200 -4 C -200 -32, -160 -36, -128 -36 L 150 -36 C 200 -34, 226 -14, 226 0 C 226 16, 200 30, 150 30 L -160 30 C -186 28, -200 16, -200 -4 Z" fill="#f4f4ee" {...S()} />
    <path d="M -196 -20 L -232 -104 L -184 -104 L -132 -36 Z" fill="#3d74c4" {...S({strokeWidth: 4})} />
    <path d="M -30 4 L -110 -96 L -66 -96 L 64 4 Z" fill="#dfe6ea" {...S({strokeWidth: 4})} />
    {[-90, -50].map(ex => <g key={ex}><rect x={ex - 14} y={-58} width={44} height={18} rx={8} fill="#9aa4aa" {...S({strokeWidth: 3})} /><path d={`M ${ex + 32} -66 V -32`} stroke={INK} strokeWidth={4} /></g>)}
    {Array.from({length: 7}).map((_, i) => <circle key={i} cx={-100 + i * 34} cy={-12} r={8} fill="#bfe0f0" stroke={INK} strokeWidth={2.5} />)}
    <path d="M 164 -28 L 200 -20 L 192 -6 L 160 -6 Z" fill="#bfe0f0" {...S({strokeWidth: 3})} />
  </g>
);
export const Auto: React.FC<{x: number; y: number; s: number; c?: string}> = ({x, y, s, c = '#d5503b'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={0} w={320} />
    <path d="M -160 -30 L -160 -72 C -160 -88, -126 -92, -100 -94 L -62 -138 C -54 -146, 46 -146, 60 -138 L 100 -94 C 136 -92, 160 -86, 160 -66 L 160 -30 Z" fill={c} {...S()} />
    <path d="M -54 -130 L -8 -130 L -8 -96 L -82 -96 Z" fill="#dff1fa" {...S({strokeWidth: 3.5})} /><path d="M 8 -130 L 52 -130 L 82 -96 L 8 -96 Z" fill="#dff1fa" {...S({strokeWidth: 3.5})} />
    <path d="M -160 -52 H 160" stroke="#f3ead2" strokeWidth={6} />
    {[-92, 92].map(wx => <g key={wx}><circle cx={wx} cy={-28} r={30} fill="#3b3b3d" {...S()} /><circle cx={wx} cy={-28} r={11} fill="#d9d4c8" /></g>)}
    <circle cx={154} cy={-70} r={10} fill="#fff3c2" {...S({strokeWidth: 3})} />
  </g>
);

// ---------- the three follies ----------
export const Pyramid: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={140} cy={-230} r={46} fill="#f6c543" {...S({strokeWidth: 4})} />
    <path d="M -200 0 L 0 -260 L 200 0 Z" fill="#e2b96b" {...S()} />
    <path d="M 0 -260 L 200 0 L 70 0 Z" fill="#c99a4e" {...S({strokeWidth: 4})} />
    {[1, 2, 3, 4, 5].map(i => <path key={i} d={`M ${-200 + i * 38} ${-i * 44} L ${70 - i * 13} ${-i * 44}`} stroke="#8a6a35" strokeWidth={3} />)}
  </g>
);
export const GreatWall: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -230 0 C -150 -130, -70 -140, 0 -70 C 70 -10, 140 -140, 230 -170 L 230 0 Z" fill="#9fbf7a" {...S()} />
    <path d="M -230 -24 C -150 -158, -70 -168, 0 -98 C 70 -38, 140 -168, 230 -198 L 230 -160 C 140 -130, 70 0, 0 -60 C -70 -128, -150 -118, -230 18 Z" fill="#c2baa8" {...S({strokeWidth: 4})} />
    {[[-110, -140], [120, -150]].map(([tx, ty]) => <g key={tx}><rect x={tx - 34} y={ty - 72} width={68} height={84} fill="#cfc7b6" {...S({strokeWidth: 4})} />{[-26, -6, 14].map(dx => <rect key={dx} x={tx + dx} y={ty - 88} width={14} height={16} fill="#cfc7b6" {...S({strokeWidth: 3})} />)}<rect x={tx - 10} y={ty - 40} width={20} height={30} fill="#3a3330" /></g>)}
  </g>
);
export const Yamato: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -250 -70 L 260 -70 L 220 -6 L -210 -6 Z" fill="#6d737a" {...S()} />
    <rect x={-50} y={-170} width={86} height={100} fill="#868d94" {...S({strokeWidth: 4})} />
    <rect x={-32} y={-232} width={50} height={62} fill="#868d94" {...S({strokeWidth: 4})} />
    <path d="M -7 -232 V -290" {...S({strokeWidth: 5})} />
    <path d="M 60 -140 L 100 -140 L 94 -70 L 66 -70 Z" fill="#4c5157" {...S({strokeWidth: 4})} />
    {[[-170, -1], [-110, -1], [150, 1]].map(([gx, d]) => <g key={gx}><rect x={gx - 28} y={-104} width={56} height={34} rx={6} fill="#868d94" {...S({strokeWidth: 3.5})} /><path d={`M ${gx + d * 24} -92 L ${gx + d * 96} -112`} {...S({strokeWidth: 8})} /></g>)}
    <path d={`M -280 -6 C -230 ${-22 + Math.sin(t * 3) * 4}, -180 8, -130 -8 C -80 -22, -30 8, 20 -8 C 70 -22, 120 8, 170 -8 C 210 -20, 250 2, 280 -6 L 280 40 L -280 40 Z`} fill="#6fa8d6" {...S({strokeWidth: 4})} />
  </g>
);
// a card holding one drawing, with a number
export const Card: React.FC<{x: number; y: number; w: number; h: number; k: number; rot?: number; n?: string; children?: React.ReactNode}> = ({x, y, w, h, k, rot = 0, n, children}) => (k <= 0 ? null :
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} filter="url(#drop)">
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill="#fbf8ef" {...S({strokeWidth: 6})} />
    {children}
    {n && <g transform={`translate(${-w / 2 + 50} ${-h / 2 + 50})`}><circle r={40} fill="#fff3c8" {...S({strokeWidth: 5})} /><text y={22} textAnchor="middle" fontFamily={MARK} fontSize={62} fill={RED}>{n}</text></g>}
  </g>
);

// ---------- money, paper ----------
export const Sheet: React.FC<{x: number; y: number; w: number; h: number; title?: string; rot?: number; fill?: string; size?: number; lines?: boolean}> = ({x, y, w, h, title, rot = 0, fill = '#fbf8ef', size = 54, lines = true}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#dropS)">
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill={fill} {...S({strokeWidth: 5})} />
    {title && <text y={-h / 2 + size * 1.1} textAnchor="middle" fontFamily={MARK} fontSize={size} fill={INK}>{title}</text>}
    {lines && Array.from({length: Math.max(0, Math.floor((h - (title ? size * 1.8 : 40) - 30) / 36))}).map((_, i) => <path key={i} d={`M ${-w / 2 + 30} ${-h / 2 + (title ? size * 1.8 : 40) + i * 36} H ${w / 2 - 30 - (i % 3 === 2 ? w * 0.25 : 0)}`} stroke="#a3acb5" strokeWidth={3} />)}
  </g>
);
export const Scissors: React.FC<{x: number; y: number; s: number; open?: number; rot?: number}> = ({x, y, s, open = 0.3, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <g transform={`rotate(${-open * 20})`}><path d="M -6 0 L 10 -170 L 22 -168 L 10 0 Z" fill="#c9ccd1" {...S({strokeWidth: 4})} /><circle cx={-30} cy={58} r={36} fill="none" stroke={RED} strokeWidth={14} /></g>
    <g transform={`rotate(${open * 20})`}><path d="M 6 0 L -10 -170 L -22 -168 L -10 0 Z" fill="#dfe2e6" {...S({strokeWidth: 4})} /><circle cx={30} cy={58} r={36} fill="none" stroke={RED} strokeWidth={14} /></g>
    <circle r={8} fill={INK} />
  </g>
);
export const Mic: React.FC<{x: number; y: number; s?: number; rot?: number}> = ({x, y, s = 1, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}><path d="M 0 0 L 0 300" stroke="#3a3a3c" strokeWidth={10} /><rect x={-26} y={-60} width={52} height={80} rx={24} fill="#5b5f66" {...S({strokeWidth: 4})} />{[0, 1, 2].map(i => <path key={i} d={`M -20 ${-40 + i * 18} H 20`} stroke="#9aa0a6" strokeWidth={3} />)}</g>
);
// a ceremony chair; name on its back
export const Chair: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={0} w={240} />
    <path d="M -96 -150 L -96 -380 Q -96 -420 -56 -420 L 56 -420 Q 96 -420 96 -380 L 96 -150 Z" fill="#8c2f25" {...S()} />
    <rect x={-110} y={-160} width={220} height={46} rx={10} fill="#a33a2e" {...S()} />
    <path d="M -96 -114 L -96 0 M 96 -114 L 96 0" {...S({strokeWidth: 10})} />
  </g>
);
export const Kusudama: React.FC<{x: number; y: number; s: number; open: number; t: number}> = ({x, y, s, open, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -200 V -100" {...S({strokeWidth: 5})} />
    {[-1, 1].map(d => <g key={d} transform={`translate(${d * open * 60} 0) rotate(${d * open * 30} 0 -100)`}><path d={d < 0 ? 'M 0 -100 A 90 90 0 0 0 0 80 Z' : 'M 0 -100 A 90 90 0 0 1 0 80 Z'} fill="#f6c543" {...S()} />{[0, 1, 2].map(i => <path key={i} d={`M ${d * 20} ${-60 + i * 40} H ${d * 70}`} stroke="#e0a020" strokeWidth={6} />)}</g>)}
    {open > 0.3 && <g>{[-40, -20, 0, 20, 40].map((dx, i) => <path key={dx} d={`M ${dx} 70 Q ${dx + Math.sin(t * 5 + i) * 14} ${70 + open * 150} ${dx * 1.4} ${80 + open * 300}`} fill="none" stroke={['#d6453a', '#3d74c4', '#f6c543', '#2e8b57', '#d6453a'][i]} strokeWidth={8} />)}
      <rect x={-60} y={90} width={120} height={260 * open} fill="#fbf7ee" {...S({strokeWidth: 4})} />
      {open > 0.95 && <g><text y={170} textAnchor="middle" fontFamily={MARK} fontSize={80} fill={RED}>祝</text><text y={260} textAnchor="middle" fontFamily={MARK} fontSize={52} fill={RED}>開業</text></g>}</g>}
  </g>
);
export const Bunting: React.FC<{y: number; sag?: number}> = ({y, sag = 50}) => (
  <g>
    <path d={`M -10 ${y} Q 540 ${y + sag * 2} 1090 ${y}`} fill="none" stroke={INK} strokeWidth={3} />
    {Array.from({length: 14}).map((_, i) => { const x = 10 + i * 78, yy = y + Math.sin((i / 13) * Math.PI) * sag; return <path key={i} d={`M ${x} ${yy} L ${x + 56} ${yy + 2} L ${x + 28} ${yy + 64} Z`} fill={['#d6453a', '#fbf7ee', '#f6c543', '#3d74c4'][i % 4]} {...S({strokeWidth: 3})} />; })}
  </g>
);
export const Flag: React.FC<{x: number; y: number; t: number; i?: number}> = ({x, y, t, i = 0}) => (
  <g transform={`translate(${x} ${y + Math.sin(t * 10 + i) * 8}) rotate(${Math.sin(t * 6 + i) * 8})`}><path d="M 0 0 V -220" {...S({strokeWidth: 6})} /><rect x={0} y={-220} width={110} height={74} fill="#fbfbf8" {...S({strokeWidth: 4})} /><circle cx={55} cy={-183} r={20} fill={RED} /></g>
);
export const Flowers: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-56} y={-170} width={112} height={170} rx={8} fill="#7fb0d6" {...S()} />
    {[[-34, -330], [0, -390], [36, -320]].map(([dx, fy], i) => <g key={i}><path d={`M ${dx} -170 L ${dx} ${fy}`} stroke="#4f7f4a" strokeWidth={6} />{Array.from({length: 6}).map((_, k) => <circle key={k} cx={dx + Math.cos(k * 1.05) * 24} cy={fy + Math.sin(k * 1.05) * 24} r={15} fill="#fbfbf8" {...S({strokeWidth: 2.5})} />)}<circle cx={dx} cy={fy} r={12} fill="#f6c543" {...S({strokeWidth: 2.5})} /></g>)}
  </g>
);
export const Bean: React.FC<{x: number; y: number; dark?: boolean; s?: number}> = ({x, y, dark, s = 1}) => (
  <g transform={`translate(${x} ${y}) rotate(28) scale(${s})`}><ellipse rx={18} ry={13} fill={dark ? '#3a2c22' : '#f6efdc'} {...S({strokeWidth: 3.5})} /><path d="M -8 -2 Q 0 4 8 -2" fill="none" stroke={dark ? '#6a5442' : '#c8b88f'} strokeWidth={3} /></g>
);
export const Glove: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-200} y={-60} width={130} height={120} fill="#1c1c20" {...S({strokeWidth: 4})} />
    {[[-58, 104], [-20, 120], [20, 112], [56, 90]].map(([fy, l]) => <rect key={fy} x={0} y={fy - 18} width={l + 40} height={36} rx={18} fill="#2a2a2e" {...S({strokeWidth: 4})} />)}
    <path d="M -40 -60 C 10 -110, 40 -120, 60 -90 L 20 -40 Z" fill="#2a2a2e" {...S({strokeWidth: 4})} />
    <ellipse cx={-10} cy={0} rx={86} ry={86} fill="#2a2a2e" {...S({strokeWidth: 4})} />
  </g>
);
// the rival: a dark figure with a hat, his back to us; (x, y) the middle of his head
export const Shade: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -240 380 C -240 220, -140 170, -62 150 L 62 150 C 140 170, 240 220, 240 380 Z" fill="#2a2a2e" {...S()} />
    <circle r={150} fill="#2a2a2e" {...S()} />
    <path d="M -132 -100 C -132 -280, 132 -280, 132 -100 Z" fill="#1c1c20" {...S()} />
    <ellipse cx={0} cy={-100} rx={200} ry={24} fill="#1c1c20" {...S()} />
  </g>
);
export const Cake: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={0} w={460} />
    <ellipse cx={0} cy={-4} rx={230} ry={30} fill="#e9eef2" {...S()} />
    <rect x={-190} y={-170} width={380} height={160} fill="#f6e3c2" {...S()} />
    <path d="M -190 -170 Q -150 -106 -110 -170 Q -70 -106 -30 -170 Q 10 -106 50 -170 Q 90 -106 130 -170 Q 160 -120 190 -170 L 190 -200 L -190 -200 Z" fill="#fbfbf8" {...S({strokeWidth: 4})} />
    <rect x={-120} y={-310} width={240} height={110} fill="#f6e3c2" {...S()} />
    <path d="M -120 -310 Q -80 -266 -40 -310 Q 0 -266 40 -310 Q 80 -266 120 -310 L 120 -332 L -120 -332 Z" fill="#fbfbf8" {...S({strokeWidth: 4})} />
    {[-160, -90, 90, 160].map(sx => <circle key={sx} cx={sx} cy={-190} r={14} fill="#d6453a" {...S({strokeWidth: 3})} />)}
    {[-66, 0, 66].map(cx => <g key={cx}><rect x={cx - 8} y={-400} width={16} height={68} fill="#d6453a" {...S({strokeWidth: 3})} /><ellipse cx={cx} cy={-420 + Math.sin(t * 12 + cx) * 2} rx={10} ry={17} fill="#f6a623" {...S({strokeWidth: 3})} /><circle cx={cx} cy={-420} r={30} fill="url(#glow)" /></g>)}
    <text y={-62} textAnchor="middle" fontFamily={MARK} fontSize={104} fill={RED}>100</text>
  </g>
);
// the lines of Tokyo's subway today, drawn as far as p (0 → 1)
const NET: [string, number[][]][] = [
  ['#f39700', [[60, 760], [420, 760], [640, 980], [1020, 980]]], ['#e60012', [[60, 1240], [300, 1000], [620, 1000], [860, 760], [1020, 760]]],
  ['#9caeb7', [[200, 660], [200, 900], [520, 1220], [1020, 1220]]], ['#00a7db', [[60, 900], [760, 900], [900, 1040], [900, 1380]]],
  ['#009944', [[60, 1100], [380, 1100], [560, 1280], [1020, 1280]]], ['#d7c447', [[420, 660], [420, 1380]]],
  ['#9b7cb6', [[60, 1340], [660, 1340], [780, 1220], [780, 660]]], ['#00ada9', [[620, 660], [620, 1160], [1020, 1160]]], ['#bb641d', [[60, 1000], [200, 1000], [540, 660]]],
];
export const MetroNet: React.FC<{p: number; o?: number}> = ({p, o = 1}) => (
  <g opacity={o}>
    {NET.map(([c, pts], i) => {
      const q = clamp(p * 1.6 - i * 0.07); if (q <= 0) return null;
      const seg = pts.slice(1).map((pt, j) => Math.hypot(pt[0] - pts[j][0], pt[1] - pts[j][1])); const total = seg.reduce((a, b) => a + b, 0);
      let left = total * q; const path = [pts[0]];
      for (let j = 1; j < pts.length && left > 0; j++) { const f = Math.min(1, left / seg[j - 1]); path.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)]); left -= seg[j - 1]; }
      const d = 'M ' + path.map(pt => pt.join(' ')).join(' L ');
      return <g key={i}><path d={d} fill="none" stroke={INK} strokeWidth={32} strokeLinecap="round" strokeLinejoin="round" /><path d={d} fill="none" stroke={c} strokeWidth={22} strokeLinecap="round" strokeLinejoin="round" />{path.slice(0, q >= 1 ? path.length : path.length - 1).map((pt, k) => <circle key={k} cx={pt[0]} cy={pt[1]} r={14} fill="#fbf7ee" stroke={INK} strokeWidth={4} />)}</g>;
    })}
  </g>
);
export {SKIN, HAND};
