// 目が見えなくなっていく友のために — Miyake Seiichi and the tactile paving, drawn with Remotion (28/11/2026). One picture
// or more for every part of a sentence, timed on the voice (src/timings/tenji-block.json, from doodle/voice.py).
import React from 'react';
import {
  W, H, INK, RED, HAND, MARK, SKIN, clamp, prog, lerp, easeOut, easeInOut, pop, hash, makeT, Timing, Shot, Movie, lineOn, Shadow, Paper, Sky, Cloud,
  Label, Tag, Stamp, Person, PersonProps, Calendar, Bulb, Car,
} from './kit';
import {YearFlip, QMark, XMark, Check, Balloon, Flowers, Auto, Sparkles} from './parts';
import timing from './timings/tenji-block.json';

const T = makeT(timing as Timing);
export const TENJI_SECONDS = T.total;
const N = 17;

const S = (o: Record<string, unknown> = {}) => ({stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const, ...o});
const YEL = '#f2c230', YEL_D = '#c4921a', YEL_L = '#ffe27e';

// the people: Miyake (olive jacket), his friend Iwahashi (dark glasses, white cane), his brother (blue work clothes)
const MIYAKE: Partial<PersonProps> = {suit: '#5d6b45', pants: '#3f4a30', tie: '#b3372b', hairStyle: 'short'};
const FRIEND: Partial<PersonProps> = {suit: '#3b4560', pants: '#2a3350', tie: '#7a9cc6', hairStyle: 'part', shades: true};
const BRO: Partial<PersonProps> = {suit: '#4f7fa8', pants: '#3a5f80', tie: '#4f7fa8', shirt: '#dfe8ef', hairStyle: 'short', glasses: true};
const PASSER: Partial<PersonProps> = {suit: '#6b5a48', pants: '#4a3d30', tie: '#3e7c6a', hairStyle: 'grey', shades: true};

// ---------- things ----------
// the white cane, held in a hand (0, 0), its tip on the ground
const Cane: React.FC<{dx?: number; dy?: number}> = ({dx = 44, dy = 236}) => (
  <g>
    <line x1={0} y1={-8} x2={dx} y2={dy} stroke={INK} strokeWidth={17} strokeLinecap="round" />
    <line x1={0} y1={-8} x2={dx} y2={dy} stroke="#fbfbf6" strokeWidth={9} strokeLinecap="round" />
    <line x1={dx * 0.84} y1={dy * 0.84} x2={dx} y2={dy} stroke={RED} strokeWidth={9} strokeLinecap="round" />
  </g>
);
// one tactile block seen from above: (x, y) its middle; rise 0–1: how many of its dots have come up
const Block: React.FC<{x: number; y: number; size: number; kind?: 'dot' | 'line'; rot?: number; rise?: number; fill?: string}> = ({x, y, size, kind = 'dot', rot = 0, rise = 1, fill = YEL}) => {
  const n = 5, d = size / n, r = size * 0.068, sw = Math.max(1.5, size * 0.008);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-size / 2 + size * 0.02} y={-size / 2 + size * 0.04} width={size} height={size} rx={size * 0.03} fill="#3a2a14" opacity={0.25} />
      <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={size * 0.03} fill={fill} {...S({strokeWidth: Math.max(2.5, size * 0.012)})} />
      {kind === 'dot'
        ? Array.from({length: n * n}).map((_, i) => {
          const k = clamp(rise * n * n - i);
          if (k <= 0) return null;
          const cx = -size / 2 + d * ((i % n) + 0.5), cy = -size / 2 + d * (Math.floor(i / n) + 0.5);
          return (
            <g key={i} transform={`translate(${cx} ${cy}) scale(${easeOut(k)})`}>
              <circle cx={r * 0.2} cy={r * 0.3} r={r} fill={YEL_D} opacity={0.55} />
              <circle r={r} fill={YEL_L} stroke={YEL_D} strokeWidth={sw} />
              <circle cx={-r * 0.32} cy={-r * 0.32} r={r * 0.3} fill="#fff7d2" />
            </g>
          );
        })
        : [0, 1, 2, 3].map(i => {
          const k = clamp(rise * 4 - i);
          if (k <= 0) return null;
          const cx = -size / 2 + size * (0.2 + i * 0.2);
          return <rect key={i} x={cx - size * 0.045} y={-size * 0.4} width={size * 0.09} height={size * 0.8 * easeOut(k)} rx={size * 0.045} fill={YEL_L} stroke={YEL_D} strokeWidth={sw} />;
        })}
    </g>
  );
};
// the ground seen in perspective: a camera at height h over the ground, the horizon at hz, f its focal length
type Cam = {cx: number; hz: number; f: number; h: number};
const P = (c: Cam, X: number, Z: number, Y = 0) => [c.cx + (c.f * X) / Z, c.hz + (c.f * (c.h - Y)) / Z];
const quad = (c: Cam, pts: number[][]) => pts.map(([X, Z, Y]) => P(c, X, Z, Y || 0).join(',')).join(' ');
// a line of tactile blocks on the ground, cols wide from X = x0, from depth z0 to z1 (only the rows nearer than upto)
const Road: React.FC<{c: Cam; x0: number; cols: number; z0: number; z1: number; upto?: number; kinds?: ('dot' | 'line')[]; fill?: string}> = ({c, x0, cols, z0, z1, upto = Infinity, kinds = ['dot'], fill = YEL}) => {
  const out: React.ReactNode[] = [], g = 0.035;
  for (let Z = Math.ceil(z1) - 1; Z >= Math.floor(z0); Z--) {
    if (Z >= upto) continue;
    for (let j = 0; j < cols; j++) {
      const X = x0 + j, kind = kinds[j % kinds.length];
      out.push(<polygon key={`${Z}-${j}`} points={quad(c, [[X + g, Z + g], [X + 1 - g, Z + g], [X + 1 - g, Z + 1 - g], [X + g, Z + 1 - g]])} fill={fill} stroke={YEL_D} strokeWidth={Math.max(1, 3 * 4 / Z)} />);
      const rx = (c.f * 0.068) / (Z + 0.5);
      if (rx < 1.4) continue;
      if (kind === 'dot') {
        for (let i = 0; i < 25; i++) {
          const dX = X + g + ((i % 5) + 0.5) * (1 - 2 * g) / 5, dZ = Z + g + (Math.floor(i / 5) + 0.5) * (1 - 2 * g) / 5;
          const [px, py] = P(c, dX, dZ), ry = Math.max(0.8, rx * c.h / dZ);
          out.push(<g key={`${Z}-${j}-${i}`}><ellipse cx={px} cy={py + ry * 0.35} rx={rx} ry={ry} fill={YEL_D} opacity={0.6} /><ellipse cx={px} cy={py} rx={rx} ry={ry} fill={YEL_L} stroke={YEL_D} strokeWidth={Math.max(0.6, rx * 0.12)} /></g>);
        }
      } else {
        for (let i = 0; i < 4; i++) {
          const bX = X + 0.2 + i * 0.2;
          out.push(<polygon key={`${Z}-${j}-b${i}`} points={quad(c, [[bX - 0.045, Z + 0.1], [bX + 0.045, Z + 0.1], [bX + 0.045, Z + 0.9], [bX - 0.045, Z + 0.9]])} fill={YEL_L} stroke={YEL_D} strokeWidth={Math.max(0.6, rx * 0.12)} />);
        }
      }
    }
  }
  return <g>{out}</g>;
};
// the fronts of houses along a street, seen in perspective: wall plane X, from depth z0 to z1
const Houses: React.FC<{c: Cam; X: number; z0: number; z1: number; seed: string; night?: boolean}> = ({c, X, z0, z1, seed, night}) => {
  const out: React.ReactNode[] = [];
  let Z = z0, i = 0;
  const cols = ['#8a6b4c', '#a07c58', '#7b5e44', '#b59670', '#94704e'];
  const segs: number[][] = [];
  while (Z < z1) { const len = 2.6 + hash(seed + i) * 2.2; segs.push([Z, Math.min(z1, Z + len), 4.6 + hash(seed + 'h' + i) * 2.4, i]); Z += len; i++; }
  segs.reverse().forEach(([a, b, hh, k]) => {
    out.push(
      <g key={k}>
        <polygon points={quad(c, [[X, a, 0], [X, b, 0], [X, b, hh], [X, a, hh]])} fill={night ? '#3d3a48' : cols[k % cols.length]} stroke={INK} strokeWidth={3} />
        <polygon points={quad(c, [[X, a, 0.4], [X, b, 0.4], [X, b, 2.2], [X, a, 2.2]])} fill={night ? '#5a5466' : '#e9dcc0'} stroke={INK} strokeWidth={2} opacity={0.9} />
        <polygon points={quad(c, [[X, a, 2.9], [X, b, 2.9], [X, b, 3.8], [X, a, 3.8]])} fill={night ? '#f2d98a' : '#f3ead4'} stroke={INK} strokeWidth={2} />
        <polygon points={quad(c, [[X, a, hh - 0.7], [X, b, hh - 0.7], [X, b, hh + 0.2], [X, a, hh + 0.2]])} fill="#4f545c" stroke={INK} strokeWidth={3} />
      </g>,
    );
  });
  return <g>{out}</g>;
};
// a utility pole of the 1960s
const Pole: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-10} y={-620} width={20} height={620} fill="#6a5a4a" {...S({strokeWidth: 3})} />
    <rect x={-70} y={-580} width={140} height={14} fill="#5a4a3a" {...S({strokeWidth: 3})} />
    {[-60, 0, 60].map(ix => <circle key={ix} cx={ix} cy={-588} r={7} fill="#e9e5d8" {...S({strokeWidth: 2})} />)}
  </g>
);
// the がま口 purse; open 0–1; rot 180 to pour it out
const Purse: React.FC<{x: number; y: number; s: number; rot?: number; open?: number; empty?: boolean}> = ({x, y, s, rot = 0, open = 0, empty}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} filter="url(#dropS)">
    {open > 0 && <path d={`M -112 -6 C -112 ${-6 - 150 * open}, 112 ${-6 - 150 * open}, 112 -6 Z`} fill="#9a4430" {...S()} />}
    {open > 0 && <path d={`M -104 -6 C -100 ${-6 - 110 * open}, 100 ${-6 - 110 * open}, 104 -6 Z`} fill="#2a1c14" />}
    {open > 0 && !empty && <g>{[-40, 0, 40].map(cx => <circle key={cx} cx={cx} cy={-30 * open} r={22} fill="#e9c24a" {...S({strokeWidth: 3})} />)}</g>}
    <path d="M -122 -8 C -160 70, -122 160, 0 164 C 122 160, 160 70, 122 -8 Z" fill="#b5553c" {...S()} />
    <path d="M -84 40 C -60 100, 60 100, 84 40" fill="none" stroke="#8e3b28" strokeWidth={6} />
    {[[-70, 70], [-20, 110], [40, 90], [80, 50]].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r={7} fill="#d6764e" />)}
    <path d="M -126 -8 C -110 -26, 110 -26, 126 -8" fill="none" stroke={INK} strokeWidth={20} strokeLinecap="round" />
    <path d="M -126 -8 C -110 -26, 110 -26, 126 -8" fill="none" stroke="#d7b54e" strokeWidth={12} strokeLinecap="round" />
    {open <= 0 && <g><circle cx={-12} cy={-36} r={14} fill="#e8c95a" {...S({strokeWidth: 3.5})} /><circle cx={12} cy={-36} r={14} fill="#e8c95a" {...S({strokeWidth: 3.5})} /></g>}
    {open > 0 && <g><circle cx={-14} cy={-36} r={14} fill="#e8c95a" {...S({strokeWidth: 3.5})} /><circle cx={14} cy={-36 - 150 * open * 0.75} r={14} fill="#e8c95a" {...S({strokeWidth: 3.5})} /></g>}
  </g>
);
const Coin: React.FC<{x: number; y: number; r?: number; rot?: number; silver?: boolean}> = ({x, y, r = 30, rot = 0, silver}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(1 ${0.55 + 0.45 * Math.abs(Math.cos(rot / 30))})`}>
    <circle r={r} fill={silver ? '#cfd1d4' : '#e9c24a'} {...S({strokeWidth: 3.5})} /><circle r={r * 0.6} fill="none" stroke={silver ? '#a4a7ab' : '#b88d1e'} strokeWidth={3} />
  </g>
);
const Bill: React.FC<{x: number; y: number; rot?: number}> = ({x, y, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <rect x={-80} y={-40} width={160} height={80} rx={6} fill="#cfdcc0" {...S({strokeWidth: 3.5})} />
    <circle cx={40} cy={0} r={24} fill="#b9caa6" stroke="#7d9468" strokeWidth={3} />
    <text x={-30} y={16} textAnchor="middle" fontFamily={MARK} fontSize={44} fill="#4f6a42">千</text>
  </g>
);
// falling coins and bills from (x, y) after moment a
const MoneyRain: React.FC<{t: number; a: number; x: number; y: number; floor: number; n?: number; id: string}> = ({t, a, x, y, floor, n = 14, id}) => (
  <g>{Array.from({length: n}).map((_, i) => {
    const st = a + i * 0.09, k = t - st;
    if (k <= 0) return null;
    const dx = (hash(id + i) - 0.5) * 420, vy = 1500 + hash(id + 'v' + i) * 500;
    const yy = Math.min(floor - (i % 4) * 14, y + 0.5 * vy * k * k), xx = x + dx * Math.min(1, k * 2.2);
    const rot = (hash(id + 'r' + i) - 0.5) * 60 + k * 400;
    return i % 4 === 3 ? <Bill key={i} x={xx} y={yy} rot={yy >= floor - 60 ? 8 : rot} /> : <Coin key={i} x={xx} y={yy} rot={yy >= floor - 60 ? 0 : rot} silver={i % 3 === 0} />;
  })}</g>
);
// Okayama Castle, the black castle 烏城
const Castle: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => {
  const roof = (w: number, yy: number) => <path d={`M ${-w / 2 - 40} ${yy} Q ${-w / 2 - 10} ${yy - 8} ${-w / 2 + 10} ${yy - 34} L ${w / 2 - 10} ${yy - 34} Q ${w / 2 + 10} ${yy - 8} ${w / 2 + 40} ${yy} L ${w / 2} ${yy + 6} L ${-w / 2} ${yy + 6} Z`} fill="#5a5f68" {...S()} />;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shadow x={0} y={4} w={640} />
      <path d="M -320 0 L -260 -170 L 260 -170 L 320 0 Z" fill="#b3ad9f" {...S()} />
      {Array.from({length: 4}).map((_, r) => <path key={r} d={`M ${-312 + r * 15} ${-34 - r * 34} H ${312 - r * 15}`} stroke="#8d877a" strokeWidth={4} />)}
      {Array.from({length: 8}).map((_, k) => <path key={k} d={`M ${-260 + k * 74} -170 L ${-280 + k * 80} 0`} stroke="#8d877a" strokeWidth={3} />)}
      <rect x={-240} y={-330} width={480} height={160} fill="#232127" {...S()} />
      {[-180, -90, 0, 90, 180].map(wx => <rect key={wx} x={wx - 18} y={-280} width={36} height={44} fill="#e9e2cc" {...S({strokeWidth: 3})} />)}
      {roof(480, -330)}
      <rect x={-180} y={-470} width={360} height={136} fill="#232127" {...S()} />
      {[-110, 0, 110].map(wx => <rect key={wx} x={wx - 16} y={-430} width={32} height={40} fill="#e9e2cc" {...S({strokeWidth: 3})} />)}
      <path d="M -70 -470 L 0 -540 L 70 -470 Z" fill="#5a5f68" {...S()} />
      {roof(360, -470)}
      <rect x={-120} y={-610} width={240} height={110} fill="#232127" {...S()} />
      {[-50, 50].map(wx => <rect key={wx} x={wx - 16} y={-580} width={32} height={40} fill="#e9e2cc" {...S({strokeWidth: 3})} />)}
      {roof(240, -610)}
      <path d="M -140 -644 Q 0 -700 140 -644" fill="none" stroke={INK} strokeWidth={4} />
      {[-116, 116].map(sx => <g key={sx} transform={`translate(${sx} -652) scale(${sx > 0 ? 1 : -1} 1)`}><path d="M 0 0 C -4 -14, 0 -26, 10 -30 C 6 -22, 10 -16, 16 -14 C 8 -8, 6 -2, 0 0 Z" fill="#e3b23c" {...S({strokeWidth: 2.5})} /></g>)}
    </g>
  );
};
// a school building of the 1960s, its foot at (x, y), with its gate and sign 県立岡山盲学校
const School: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={380} y={6} w={820} o={0.2} />
    <rect x={0} y={-360} width={780} height={360} fill="#ece4cf" {...S()} />
    <rect x={-10} y={-380} width={800} height={28} fill="#d2c8ae" {...S({strokeWidth: 4})} />
    {[0, 1].map(f => Array.from({length: 7}).map((_, i) => <g key={f + '-' + i}><rect x={34 + i * 106} y={-320 + f * 160} width={78} height={92} fill="#a9c9d6" {...S({strokeWidth: 3.5})} /><path d={`M ${73 + i * 106} ${-320 + f * 160} V ${-228 + f * 160}`} stroke={INK} strokeWidth={3} /></g>))}
    <rect x={330} y={-120} width={120} height={120} fill="#6b5a48" {...S({strokeWidth: 4})} />
    <circle cx={390} cy={-400} r={0} />
    {/* the gate */}
    <rect x={-170} y={-260} width={48} height={260} fill="#bdb6a4" {...S({strokeWidth: 4})} />
    <g transform="translate(-240 -330)" filter="url(#dropS)">
      <rect x={-34} y={0} width={68} height={7 * 50 + 30} fill="#fbf7ee" {...S({strokeWidth: 4})} />
      {[...'県立岡山盲学校'].map((ch, i) => <text key={i} x={0} y={52 + i * 50} textAnchor="middle" fontFamily={MARK} fontSize={42} fill={INK}>{ch}</text>)}
    </g>
  </g>
);
// the world, turning slowly; pins: yellow blocks on it from moment a, one every gap seconds; flags instead of blocks
const Globe: React.FC<{x: number; y: number; r: number; t: number; a?: number; gap?: number; n?: number; flags?: boolean; dim?: number}> = ({x, y, r, t, a = Infinity, gap = 0.08, n = 26, flags, dim = 0}) => {
  const id = 'globe' + Math.round(x) + Math.round(y) + Math.round(r);
  const off = ((t * 0.05) % 2) * r;   // the map strip, two globes wide, scrolls
  const land = (k: number) => (
    <g key={k} transform={`translate(${k * 2 * r} 0) scale(${r / 100})`}>
      <path d="M -150 -70 C -170 -90, -130 -98, -112 -84 C -96 -74, -80 -64, -84 -40 C -86 -20, -104 -8, -100 12 C -96 32, -80 44, -86 70 C -90 86, -104 90, -110 74 C -116 52, -124 30, -128 6 C -132 -20, -140 -40, -150 -70 Z" fill="#8cc07a" {...S({strokeWidth: 2.5})} />
      <path d="M -40 -80 C -10 -96, 50 -92, 70 -74 C 84 -60, 70 -46, 50 -40 C 30 -34, 20 -24, 14 -4 C 8 18, -10 40, -20 30 C -28 20, -24 0, -34 -16 C -44 -32, -60 -50, -40 -80 Z" fill="#a9c97f" {...S({strokeWidth: 2.5})} />
      <path d="M -20 -6 C 0 -10, 10 4, 6 24 C 2 44, -8 70, -22 72 C -34 70, -36 40, -34 20 C -32 6, -30 -2, -20 -6 Z" fill="#d8c07a" {...S({strokeWidth: 2.5})} />
      <path d="M 56 30 C 74 24, 92 30, 94 44 C 96 58, 80 64, 66 60 C 54 56, 46 40, 56 30 Z" fill="#d8b070" {...S({strokeWidth: 2.5})} />
      <path d="M 78 -52 C 82 -60, 88 -58, 86 -50 C 84 -42, 80 -36, 76 -38 C 72 -40, 74 -46, 78 -52 Z" fill="#e6574a" {...S({strokeWidth: 2})} />
    </g>
  );
  const spots: number[][] = [[-130, -70], [-100, 0], [-112, 60], [-30, -70], [0, -84], [30, -80], [60, -66], [-20, -40], [0, 10], [-20, 50], [70, 44], [80, -48], [40, -50], [-120, -30], [-90, 40], [10, -60], [-6, 40], [84, 50], [-140, -50], [20, -30], [-60, -60], [50, -76], [-104, 20], [66, 34], [-26, 64], [82, -40]];
  return (
    <g>
      <circle cx={x} cy={y + r * 1.02} r={r * 0.9} fill="#3a2a14" opacity={0.18} filter="url(#blur20)" />
      <clipPath id={id}><circle cx={x} cy={y} r={r} /></clipPath>
      <circle cx={x} cy={y} r={r} fill="#6fb1d8" />
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${x - off} ${y})`}>
          {[-1, 0, 1, 2].map(k => land(k))}
          {[-1, 0, 1, 2].map(k => spots.slice(0, n).map(([sx, sy], i) => {
            const q = pop(t, a + i * gap, 240);
            if (q <= 0) return null;
            const px = k * 2 * r + (sx * r) / 100, py = (sy * r) / 100;
            if (flags) {
              const cs = [['#d6453a', '#fbfbf8', '#3d74c4'], ['#2e8b57', '#fbfbf8', '#d6453a'], ['#f6c543', '#2a2a2e', '#d6453a'], ['#3d74c4', '#fbfbf8', '#3d74c4']][i % 4];
              return <g key={k + '-' + i} transform={`translate(${px} ${py}) scale(${q})`}><path d="M 0 0 V -54" stroke={INK} strokeWidth={4} />{cs.map((cc, j) => <rect key={j} x={0} y={-54 + j * 11} width={44} height={11} fill={cc} />)}<rect x={0} y={-54} width={44} height={33} fill="none" stroke={INK} strokeWidth={3} /></g>;
            }
            return <g key={k + '-' + i} transform={`translate(${px} ${py}) scale(${q})`}><rect x={-15} y={-15} width={30} height={30} rx={3} fill={YEL} stroke={INK} strokeWidth={3} />{[0, 1, 2].map(rr => [0, 1, 2].map(cc => <circle key={rr + '' + cc} cx={-8 + cc * 8} cy={-8 + rr * 8} r={2.6} fill={YEL_L} stroke={YEL_D} strokeWidth={1} />))}</g>;
          }))}
        </g>
      </g>
      <circle cx={x - r * 0.3} cy={y - r * 0.35} r={r * 0.75} fill="#fff" opacity={0.12} />
      <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={7} />
      {dim > 0 && <circle cx={x} cy={y} r={r} fill="#efe5cc" opacity={dim} />}
    </g>
  );
};
// Japan from real coordinates (longitude, latitude); dy moves it down; spread 0–1: the yellow lines going out from Okayama
const geo = (lon: number, lat: number) => [80 + (lon - 129.5) * 56, 1560 - (lat - 30.8) * 68.3];
const outline = (pts: number[][]) => {
  const p = pts.map(([lon, lat]) => geo(lon, lat));
  return 'M ' + p.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L ') + ' Z';
};
const HONSHU = outline([[130.9, 33.95], [131.4, 34.4], [132.1, 35.0], [132.7, 35.45], [133.4, 35.55], [134.2, 35.55], [135.0, 35.7], [135.4, 35.55], [136.0, 35.75], [136.2, 36.2], [136.7, 36.75], [136.75, 37.2], [137.3, 37.5], [137.1, 37.0], [137.3, 36.8], [138.0, 37.0], [138.6, 37.5], [139.1, 37.95], [139.6, 38.4], [139.85, 38.9], [140.05, 39.6], [139.75, 39.95], [140.0, 40.3], [139.9, 40.7], [140.3, 41.15], [140.65, 41.2], [140.9, 40.9], [141.2, 41.25], [141.0, 41.45], [141.45, 41.4], [141.5, 40.6], [141.85, 40.1], [142.05, 39.55], [141.85, 38.9], [141.5, 38.35], [141.0, 38.2], [140.95, 37.7], [140.95, 37.1], [140.65, 36.55], [140.85, 35.75], [140.35, 35.2], [139.85, 34.95], [139.9, 35.35], [139.65, 35.25], [139.15, 35.2], [138.85, 34.65], [138.75, 35.0], [138.3, 34.75], [137.6, 34.65], [137.0, 34.65], [136.85, 34.35], [136.2, 34.15], [135.8, 33.5], [135.35, 33.75], [135.1, 34.25], [135.35, 34.6], [134.9, 34.7], [134.3, 34.7], [133.9, 34.5], [133.3, 34.35], [132.6, 34.25], [132.2, 33.95], [131.7, 34.0], [131.2, 33.95]]);
const KYUSHU = outline([[130.95, 33.88], [131.15, 33.6], [131.65, 33.6], [131.75, 33.25], [132.0, 33.2], [131.7, 32.6], [131.5, 31.9], [131.35, 31.4], [131.0, 31.2], [130.7, 31.0], [130.55, 31.25], [130.2, 31.25], [130.15, 31.8], [130.35, 32.15], [130.55, 32.65], [130.25, 32.95], [129.85, 32.7], [129.7, 33.1], [129.85, 33.45], [130.2, 33.55], [130.4, 33.65], [130.6, 33.9]]);
const SHIKOKU = outline([[132.05, 33.35], [132.7, 33.85], [133.0, 34.05], [133.6, 34.2], [134.05, 34.35], [134.6, 34.2], [134.75, 33.85], [134.3, 33.6], [134.15, 33.25], [133.6, 33.5], [133.2, 33.3], [132.95, 32.75], [132.6, 33.0], [132.5, 33.2]]);
const HOKKAIDO = outline([[140.05, 41.45], [140.7, 41.75], [141.2, 41.8], [140.95, 42.3], [141.6, 42.6], [142.5, 42.2], [143.25, 41.95], [143.4, 42.6], [144.4, 42.95], [145.6, 43.3], [145.3, 43.6], [145.3, 44.3], [144.3, 44.0], [143.3, 44.35], [142.4, 45.0], [141.7, 45.45], [141.65, 44.6], [141.6, 43.95], [141.4, 43.3], [141.0, 43.2], [140.4, 43.35], [140.3, 42.85], [139.85, 42.6], [140.1, 42.2], [140.0, 41.8]]);
const routes = [
  [[133.93, 34.66], [134.69, 34.83], [135.5, 34.69], [136.88, 35.17], [138.38, 34.97], [139.7, 35.68], [140.88, 38.27], [141.15, 39.7], [140.74, 40.82], [141.35, 43.06]],
  [[133.93, 34.66], [132.46, 34.4], [130.94, 33.95], [130.42, 33.59], [130.71, 32.8], [130.56, 31.6]],
  [[133.93, 34.66], [134.05, 34.34], [133.53, 33.56]],
  [[135.5, 34.69], [135.77, 35.01], [136.66, 36.56], [139.04, 37.92]],
].map(r => r.map(([lon, lat]) => geo(lon, lat)));
const OKA = geo(133.93, 34.66);
const JapanMap: React.FC<{dy?: number; spread: number; t: number}> = ({dy = 0, spread, t}) => (
  <g transform={`translate(0 ${dy})`}>
    {[HOKKAIDO, HONSHU, SHIKOKU, KYUSHU].map((d, i) => <path key={i} d={d} fill={i === 1 ? '#b8d48a' : '#a9c97f'} {...S()} />)}
    {routes.map((r, i) => {
      const len = r.length - 1, k = clamp(spread * 1.4 - i * 0.16) * len;
      const pts: number[][] = [];
      for (let j = 0; j <= Math.floor(k); j++) pts.push(r[j]);
      if (k < len && k > 0) { const j = Math.floor(k), f = k - j; pts.push([lerp(r[j][0], r[j + 1][0], f), lerp(r[j][1], r[j + 1][1], f)]); }
      const line = pts.map(p => p.join(',')).join(' ');
      return pts.length > 1 ? <g key={i}><polyline points={line} fill="none" stroke={INK} strokeWidth={24} strokeLinecap="round" strokeLinejoin="round" /><polyline points={line} fill="none" stroke={YEL} strokeWidth={15} strokeLinecap="round" strokeLinejoin="round" /><polyline points={line} fill="none" stroke={YEL_L} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 12" /></g> : null;
    })}
    <circle cx={OKA[0]} cy={OKA[1]} r={22 + Math.sin(t * 6) * 3} fill={RED} {...S({strokeWidth: 4})} />
    <text x={OKA[0] - 20} y={OKA[1] - 44} textAnchor="middle" fontFamily={MARK} fontSize={48} fill={INK} stroke="#f6efdc" strokeWidth={10} paintOrder="stroke">岡山</text>
  </g>
);
// a portrait with the black ribbons of mourning (遺影)
const Portrait: React.FC<{x: number; y: number; s: number; t: number; id: string}> = ({x, y, s, t, id}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#drop)">
    <rect x={-240} y={-310} width={480} height={620} rx={8} fill="#2b2420" {...S({strokeWidth: 6})} />
    <rect x={-210} y={-280} width={420} height={560} fill="#e9dcc0" />
    <clipPath id={id}><rect x={-200} y={-270} width={400} height={540} /></clipPath>
    <g clipPath={`url(#${id})`} filter="url(#sepia)">
      <rect x={-200} y={-270} width={400} height={540} fill="#d9c7a0" />
      <Person id={id + 'p'} t={t} x={0} y={640} s={1.25} {...MIYAKE} mood="smile" noShadow armL={[6, 6]} armR={[6, 6]} />
    </g>
    <path d="M -240 -170 L -100 -310 L -40 -310 L -240 -110 Z" fill="#141216" />
    <path d="M 240 -170 L 100 -310 L 40 -310 L 240 -110 Z" fill="#141216" />
  </g>
);
// a man seen from behind, standing: (x, y) his feet
const Back: React.FC<{x: number; y: number; s: number; suit: string; hair?: string; cane?: boolean; t: number; walk?: number; armToward?: number}> = ({x, y, s, suit, hair = '#2b2622', cane, t, walk = 0, armToward = 0}) => {
  const sw = Math.sin(t * 5) * walk;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={90} ry={14} fill="#3a2a14" opacity={0.25} />
      {[-1, 1].map(k => <g key={k}><path d={`M ${k * 28} -250 L ${k * 30 + sw * k * 10} -40`} stroke={INK} strokeWidth={52} strokeLinecap="round" /><path d={`M ${k * 28} -250 L ${k * 30 + sw * k * 10} -40`} stroke="#2a3350" strokeWidth={42} strokeLinecap="round" /><ellipse cx={k * 30 + sw * k * 10} cy={-14} rx={28} ry={20} fill="#2b2420" {...S({strokeWidth: 4})} /></g>)}
      <path d="M -78 -440 C -92 -360, -86 -280, -72 -214 L 72 -214 C 86 -280, 92 -360, 78 -440 C 30 -462, -30 -462, -78 -440 Z" fill={suit} {...S()} />
      <path d="M 0 -450 V -216" stroke={INK} strokeWidth={3} opacity={0.5} />
      {/* arms: the left one hangs, the right one reaches toward armToward (px to the right) or holds the cane */}
      <path d={`M -74 -424 L -96 -320 L -92 -232`} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M -74 -424 L -96 -320 L -92 -232`} fill="none" stroke={suit} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
      {armToward > 0
        ? <g><path d={`M 74 -424 L ${74 + armToward * 0.55} -440 L ${74 + armToward} -432`} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" /><path d={`M 74 -424 L ${74 + armToward * 0.55} -440 L ${74 + armToward} -432`} fill="none" stroke={suit} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" /><circle cx={74 + armToward + 6} cy={-432} r={20} fill={SKIN} {...S({strokeWidth: 4})} /></g>
        : <g><path d={`M 74 -424 L 104 -330 L 120 -250`} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" /><path d={`M 74 -424 L 104 -330 L 120 -250`} fill="none" stroke={suit} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" /><circle cx={124} cy={-240} r={20} fill={SKIN} {...S({strokeWidth: 4})} />{cane && <g transform="translate(124 -240)"><Cane dx={70 + Math.sin(t * 5) * 30} dy={236} /></g>}</g>}
      <rect x={-18} y={-470} width={36} height={30} fill={SKIN} {...S({strokeWidth: 4})} />
      <ellipse cx={-72} cy={-516} rx={13} ry={19} fill={SKIN} {...S({strokeWidth: 4})} /><ellipse cx={72} cy={-516} rx={13} ry={19} fill={SKIN} {...S({strokeWidth: 4})} />
      <ellipse cx={0} cy={-520} rx={74} ry={78} fill={SKIN} {...S()} />
      <path d="M -75 -508 C -82 -604, 82 -608, 75 -508 C 70 -476, 40 -458, 0 -458 C -40 -458, -70 -476, -75 -508 Z" fill={hair} {...S({strokeWidth: 4})} />
    </g>
  );
};
// a black telephone of the 1960s
const Phone: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shadow x={0} y={6} w={420} />
    <path d="M -190 0 L -150 -160 C -140 -190, 140 -190, 150 -160 L 190 0 Z" fill="#232127" {...S()} />
    <circle cx={0} cy={-90} r={78} fill="#e9e5d8" {...S({strokeWidth: 4})} />
    {Array.from({length: 10}).map((_, i) => { const a = -Math.PI / 2 + 0.5 + (i / 10) * Math.PI * 1.7; return <circle key={i} cx={Math.cos(a) * 52} cy={-90 + Math.sin(a) * 52} r={14} fill="#232127" />; })}
    <circle cx={0} cy={-90} r={24} fill="#fbf7ee" {...S({strokeWidth: 3})} />
    <path d="M -230 -200 C -230 -250, -160 -262, -120 -240 L 120 -240 C 160 -262, 230 -250, 230 -200 C 230 -176, 190 -170, 170 -190 L -170 -190 C -190 -170, -230 -176, -230 -200 Z" fill="#2c2a30" {...S()} />
    <path d="M 190 -20 C 260 20, 300 60, 330 40" fill="none" stroke="#232127" strokeWidth={10} />
  </g>
);
// a shoe seen from the side, its sole at (x, y), the trouser leg going up
const Shoe: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 -150 L -50 -900 L 90 -900 L 80 -150 Z" fill="#3f4a30" {...S()} />
    <path d="M -110 -10 C -120 -60, -90 -130, -40 -150 L 80 -150 C 120 -120, 200 -90, 250 -60 C 290 -40, 290 -10, 270 0 L -100 0 Z" fill="#4a2f22" {...S()} />
    <path d="M -108 0 H 272" stroke="#1e1612" strokeWidth={22} strokeLinecap="round" />
    <path d="M 30 -140 C 60 -110, 120 -96, 150 -96" fill="none" stroke="#6e4a36" strokeWidth={6} />
  </g>
);
// a sneaker of today seen from above, its toe up
const Sneaker: React.FC<{x: number; y: number; s: number; rot?: number}> = ({x, y, s, rot = 0}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={8} cy={14} rx={92} ry={196} fill="#3a2a14" opacity={0.25} filter="url(#blur8)" />
    <path d="M 0 -200 C 70 -200, 92 -120, 88 -40 C 86 40, 80 140, 60 180 C 40 210, -40 210, -60 180 C -80 140, -86 40, -88 -40 C -92 -120, -70 -200, 0 -200 Z" fill="#fbfbf8" {...S()} />
    <path d="M -50 -60 C -30 -120, 30 -120, 50 -60 L 46 90 L -46 90 Z" fill="#3d74c4" {...S({strokeWidth: 4})} />
    {[-30, 0, 30, 60].map(ly => <path key={ly} d={`M -30 ${ly} L 30 ${ly + 8} M 30 ${ly} L -30 ${ly + 8}`} stroke="#fbfbf8" strokeWidth={6} />)}
    <path d="M -60 120 C -20 140, 20 140, 60 120" fill="none" stroke="#cf2e23" strokeWidth={8} />
  </g>
);
// moss and earth: the ground of a Japanese garden, the border between them at x = 540
const MossEarth: React.FC<{y0: number; y1: number; glow?: number}> = ({y0, y1, glow = 0}) => (
  <g>
    <rect x={0} y={y0} width={540} height={y1 - y0} fill="#5f8f3a" />
    {Array.from({length: 90}).map((_, i) => <circle key={i} cx={hash('m' + i) * 540} cy={y0 + hash('my' + i) * (y1 - y0)} r={14 + hash('mr' + i) * 16} fill={i % 2 ? '#6fa046' : '#517d30'} />)}
    <rect x={540} y={y0} width={540} height={y1 - y0} fill="#a77b4f" />
    {Array.from({length: 40}).map((_, i) => <ellipse key={i} cx={560 + hash('e' + i) * 520} cy={y0 + hash('ey' + i) * (y1 - y0)} rx={8 + hash('er' + i) * 10} ry={6 + hash('er' + i) * 6} fill={i % 2 ? '#8d6440' : '#c39a6a'} />)}
    <path d={`M 540 ${y0} C 520 ${y0 + (y1 - y0) * 0.3}, 566 ${y0 + (y1 - y0) * 0.6}, 540 ${y1}`} fill="none" stroke="#3f6a24" strokeWidth={16} />
    {glow > 0 && <path d={`M 540 ${y0} C 520 ${y0 + (y1 - y0) * 0.3}, 566 ${y0 + (y1 - y0) * 0.6}, 540 ${y1}`} fill="none" stroke={RED} strokeWidth={10} strokeDasharray="26 18" opacity={glow} />}
  </g>
);
// a thought cloud
const Thought: React.FC<{x: number; y: number; w: number; h: number; k: number; fx: number; fy: number; children?: React.ReactNode}> = ({x, y, w, h, k, fx, fy, children}) => (k <= 0 ? null :
  <g transform={`translate(${x} ${y}) scale(${k}) translate(${-x} ${-y})`} filter="url(#drop)">
    {[0.25, 0.5, 0.75].map((f, i) => <circle key={i} cx={lerp(fx, x - w * 0.2, f)} cy={lerp(fy, y + h / 2, f)} r={12 + i * 10} fill="#fffdf6" {...S({strokeWidth: 4})} />)}
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.38} fill="#fffdf6" {...S({strokeWidth: 6})} />
    {children}
  </g>
);
// a station platform of today: the train behind, the floor in front with its line of yellow blocks
const Station: React.FC<{t: number; v: number; trainX: number; people?: boolean}> = ({t, v, trainX, people = true}) => (
  <g>
    <Paper c="#dfe3e2" />
    <rect x={0} y={560} width={W} height={60} fill="#8b9aa5" {...S({strokeWidth: 4})} />
    {[180, 540, 900].map(lx => <g key={lx}><rect x={lx - 110} y={620} width={220} height={16} fill="#fbfbf6" {...S({strokeWidth: 3})} /><circle cx={lx} cy={650} r={120} fill="url(#glow)" opacity={0.35} /></g>)}
    <g filter="url(#dropS)"><rect x={340} y={690} width={400} height={110} rx={10} fill="#2f5fa8" {...S({strokeWidth: 5})} /><text x={540} y={765} textAnchor="middle" fontFamily={MARK} fontSize={58} fill="#fbfbf6">のりば</text></g>
    <Car x={trainX} y={1360} s={1.55} body="#d9dde0" roof="#9aa3a8" id="mod" lit people={false} light={false} />
    <rect x={trainX} y={1250} width={1000} height={22} fill="#2e8b57" opacity={0} />
    <rect x={0} y={1300} width={W} height={620} fill="#c9c6bd" {...S({strokeWidth: 4})} />
    <rect x={0} y={1300} width={W} height={18} fill="#e9e6de" />
    {/* the line of blocks along the edge, seen from the side */}
    <rect x={0} y={1330} width={W} height={56} fill={YEL} stroke={YEL_D} strokeWidth={3} />
    {Array.from({length: 54}).map((_, i) => <g key={i}>{[0, 1].map(r => <ellipse key={r} cx={10 + i * 20 + r * 10} cy={1342 + r * 24} rx={6} ry={3.6} fill={YEL_L} stroke={YEL_D} strokeWidth={1.2} />)}</g>)}
    {Array.from({length: 11}).map((_, i) => <path key={i} d={`M ${i * 100} 1330 V 1386`} stroke={YEL_D} strokeWidth={2} />)}
    {people && <g>
      <Person id="st1" t={t} x={230} y={1560} s={0.58} suit="#d6453a" pants="#2a3350" tie="#d6453a" hairStyle="short" />
      <Person id="st2" t={t} x={860} y={1570} s={0.6} suit="#2f5fa8" pants="#2a2a2e" tie="#fbfbf6" hairStyle="part" mood="smile" />
      <Person id="st3" t={t} x={lerp(380, 640, prog(v, 0, 4))} y={1384} s={0.56} {...PASSER} hairStyle="short" suit="#5a6a5a" legs={[Math.sin(t * 6) * 16, -Math.sin(t * 6) * 16]} armR={[24, 18]} holdR={<Cane dx={60} dy={230} />} />
    </g>}
  </g>
);

// ---------- pictures used more than once ----------
// the street of the hook: the line of blocks running away, houses on both sides
const STREET: Cam = {cx: 480, hz: 1010, f: 900, h: 3.2};
const HookStreet: React.FC<{t: number; v: number; sun?: boolean}> = ({t, v, sun}) => (
  <g>
    {sun ? <Sky top="#f0a86a" bottom="#fbe3b0" y1={1010} /> : <Sky top="#bcd9ea" bottom="#f3ecd8" y1={1010} />}
    {sun && <g><circle cx={480} cy={1000} r={260} fill="url(#glow)" /><circle cx={480} cy={1000} r={90} fill="#fff1c4" /></g>}
    {!sun && <g><Cloud x={230 + v * 14} y={720} s={0.8} /><Cloud x={860 - v * 10} y={650} s={0.6} /></g>}
    <rect x={0} y={1010} width={W} height={H - 1010} fill="#d9d0bd" />
    <polygon points={quad(STREET, [[2.4, 3], [9, 3], [9, 60], [2.4, 60]])} fill="#9a968e" />
    <polygon points={quad(STREET, [[2.25, 3], [2.4, 3], [2.4, 60], [2.25, 60]])} fill="#efe9dc" />
    {[4, 6, 9, 13, 18, 25].map(z => <polyline key={z} points={quad(STREET, [[-4, z], [2.25, z]])} fill="none" stroke="#c6bca7" strokeWidth={3} />)}
    <Houses c={STREET} X={-4} z0={4.2} z1={60} seed="L" />
    <Houses c={STREET} X={9} z0={6} z1={60} seed="R" />
    {[7, 14, 24].map(z => { const [px, py] = P(STREET, 2.6, z); return <Pole key={z} x={px} y={py} s={(STREET.f / z) / 120} />; })}
    <Road c={STREET} x0={-1} cols={2} z0={2.6} z1={60} />
  </g>
);
// the crossing of the car: the blind man at the curb, the road, Miyake on the other side; car 0–1 its run
const Crossing: React.FC<{t: number; v: number; car: number; scared: boolean}> = ({t, v, car, scared}) => (
  <g>
    <Sky top="#bcd9ea" bottom="#f3ecd8" y1={1040} />
    {[[-40, 260, '#a07c58'], [230, 300, '#8a6b4c'], [540, 240, '#b59670'], [790, 330, '#7b5e44']].map(([hx, hw, hc], i) => <g key={i}><rect x={hx as number} y={1040 - 330} width={hw as number} height={330} fill={hc as string} {...S({strokeWidth: 4})} /><rect x={(hx as number) + 20} y={1040 - 230} width={(hw as number) - 40} height={70} fill="#f3ead4" {...S({strokeWidth: 3})} /><path d={`M ${(hx as number) - 14} ${1040 - 330} H ${(hx as number) + (hw as number) + 14} L ${(hx as number) + (hw as number) - 10} ${1040 - 380} H ${(hx as number) + 10} Z`} fill="#4f545c" {...S({strokeWidth: 4})} /></g>)}
    <rect x={0} y={1040} width={W} height={50} fill="#d9d0bd" {...S({strokeWidth: 4})} />
    <rect x={0} y={1090} width={W} height={400} fill="#8e8a82" />
    {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${130 + i * 100} 1092 L ${80 + i * 116} 1488 L ${150 + i * 116} 1488 L ${190 + i * 100} 1092 Z`} fill="#f1ede2" />)}
    <rect x={0} y={1488} width={W} height={H - 1488} fill="#d9d0bd" {...S({strokeWidth: 4})} />
    <Person id="mi5" t={t} x={840} y={1084} s={0.62} {...MIYAKE} mood={scared ? 'wow' : 'ok'} armL={scared ? [150, 160] : [10, 8]} armR={scared ? [150, 160] : [10, 8]} look={-5} />
    {/* he steps onto the crossing; the car rushes past right in front of him, from left to right */}
    <Person id="bl5" t={t} x={330} y={1330} s={0.95} {...PASSER} mood={scared ? 'wow' : 'flat'} legs={scared ? [4, -4] : [24, -14]} lean={scared ? -6 : 3} armR={[34, 28]} holdR={<Cane dx={90} dy={250} />} armL={scared ? [60, 120] : [12, 10]} />
    {car > 0 && car < 1 && <g>
      {[0, 1, 2, 3].map(i => <path key={i} d={`M ${lerp(-700, 1800, car) - 340} ${1300 + i * 40} h ${-(220 + i * 70)}`} stroke="#fbfbf8" strokeWidth={10} strokeLinecap="round" opacity={0.85} />)}
      <Auto x={lerp(-700, 1800, car)} y={1500} s={2.0} c="#2f5fa8" />
    </g>}
    {scared && <Sparkles x={330} y={860} r={130} t={t} c="#e0702a" n={7} />}
  </g>
);

// ---------- the shots ----------
const shots: Shot[] = [
  // 0a  the hook: the line of yellow blocks down the street; his friend walks on it with his white cane; Miyake holds the next block
  {a: 0, draw: (t, v) => {
    const fz = lerp(10.5, 9.4, prog(v, 0, 3)), [fx, fy] = P(STREET, 0, fz), fs = (STREET.f * 5.6 / fz) / 640, st = Math.sin(t * 5.5);
    return (
      <g>
        <HookStreet t={t} v={v} />
        <Person id="fr0" t={t} x={fx} y={fy} s={fs} {...FRIEND} mood="smile" legs={[st * 14, -st * 14]} armR={[26, 22]} holdR={<Cane dx={70 + st * 20} dy={236} />} />
        <Person id="mi0" t={t} x={790} y={1660} s={1.42} {...MIYAKE} mood="smile" look={-6} armL={[10, -70]} armR={[10, -70]} holdR={<g transform="translate(0 10) rotate(-6)"><Block x={0} y={0} size={180} /></g>} />
      </g>
    );
  }},
  // 0b  with his own money: the purse turned over, the coins falling on the blocks
  {a: T.at(0, '一人の男') - 0.08, draw: (t, v) => {
    const turn = easeOut(prog(t, T.at(0, '自腹') - 0.25, 0.3));
    return (
      <g>
        <Paper c="#e8dcc0" />
        <rect x={0} y={1400} width={W} height={520} fill="#d9d0bd" />
        <Road c={{cx: 540, hz: 1180, f: 620, h: 2.4}} x0={-1.5} cols={3} z0={1.4} z1={7} />
        <Person id="mi0b" t={t} x={330} y={1860} s={2.0} {...MIYAKE} mood={turn > 0.5 ? 'stern' : 'ok'} armL={[10, 10]} armR={[120, lerp(150, 170, turn)]} />
        <Purse x={lerp(600, 640, turn)} y={lerp(860, 800, turn)} s={1.25} rot={lerp(0, 180, turn)} open={turn} />
        <MoneyRain t={t} a={T.at(0, '自腹') + 0.05} x={640} y={760} floor={1480} id="r0" />
        <Stamp t={t} text="自腹" x={780} y={1200} size={110} a={T.at(0, '自腹')} rot={-8} />
      </g>
    );
  }},
  // 0c  the bumps come up, one by one, and the blocks are laid in a row
  {a: T.at(0, 'でこぼこ') - 0.08, draw: (t, v) => {
    const a = T.at(0, 'でこぼこ'), b = T.to(0, 'でこぼこ') + 0.25, lay = easeOut(prog(t, T.at(0, '並べ'), 0.45));
    return (
      <g>
        <Paper c="#a8a49c" />
        {Array.from({length: 60}).map((_, i) => <circle key={i} cx={hash('as' + i) * W} cy={hash('ay' + i) * H} r={3 + hash('ar' + i) * 4} fill={i % 2 ? '#8f8b83' : '#bcb8b0'} />)}
        <Block x={540} y={lerp(2200, 1620, lay)} size={500} />
        <Block x={540} y={lerp(-400, 480, lay)} size={500} />
        <Block x={540} y={1050} size={540} rise={prog(t, a, b - a)} />
      </g>
    );
  }},
  // 1a  today they are at the stations of the whole world
  {a: T.s(1) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#e9e1cc" />
      {Array.from({length: 14}).map((_, i) => <circle key={i} cx={hash('st' + i) * W} cy={620 + hash('sty' + i) * 1000} r={4} fill="#c9bf9f" />)}
      <Globe x={540} y={1090} r={430} t={t + 3} a={T.s(1) + 0.1} gap={0.06} />
      <g transform="translate(540 1620)"><rect x={-290} y={-38} width={580} height={76} fill={YEL} stroke={INK} strokeWidth={5} />{Array.from({length: 22}).map((_, i) => <circle key={i} cx={-276 + i * 26.3} cy={0} r={8} fill={YEL_L} stroke={YEL_D} strokeWidth={2} />)}</g>
    </g>
  )},
  // 1b  but he died without seeing it
  {a: T.at(1, '彼は') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#d9d2c2" />
      <Globe x={540} y={1060} r={460} t={t + 3} a={-10} gap={0} dim={0.55} />
      <Portrait x={540} y={1080} s={lerp(0.9, 1, easeOut(prog(v, 0, 0.5)))} t={t} id="ie1" />
      <Flowers x={200} y={1560} s={1.1} /><Flowers x={880} y={1560} s={1.1} />
    </g>
  )},
  // 2  who he was: a card with an old photograph
  {a: T.s(2) - 0.08, draw: (t, v) => {
    const a = T.at(2, '三宅精一'), b = T.to(2, '三宅精一'), n = Math.ceil(4 * clamp((t - a) / (b - a)));
    return (
      <g>
        <Paper c="#9a6b3d" />
        {Array.from({length: 9}).map((_, i) => <path key={i} d={`M 0 ${620 + i * 150} C 300 ${600 + i * 150}, 700 ${650 + i * 150}, 1080 ${615 + i * 150}`} stroke="#7d5530" strokeWidth={5} fill="none" opacity={0.6} />)}
        <g transform={`translate(540 1110) rotate(-2) scale(${pop(t, T.s(2) - 0.05, 160)})`} filter="url(#drop)">
          <rect x={-450} y={-440} width={900} height={880} rx={10} fill="#fbf6ea" {...S({strokeWidth: 6})} />
          <rect x={-410} y={-400} width={400} height={500} fill="#e7d9b6" {...S({strokeWidth: 6})} />
          <clipPath id="photo2"><rect x={-400} y={-390} width={380} height={480} /></clipPath>
          <g clipPath="url(#photo2)" filter="url(#sepia)">
            <rect x={-400} y={-390} width={380} height={480} fill="#d9c7a0" />
            <Person id="ph2" t={t} x={-210} y={360} s={1.0} {...MIYAKE} mood="smile" noShadow armL={[8, 8]} armR={[8, 8]} />
          </g>
          <rect x={-410} y={-400} width={400} height={500} fill="none" stroke="#fbf6ea" strokeWidth={10} />
          {t > a - 0.1 && <g>
            <text x={20} y={-300} fontFamily={HAND} fontWeight={700} fontSize={40} fill="#6a5f50">みやけ せいいち</text>
            <text x={10} y={-190} fontFamily={MARK} fontSize={118} fill={INK}>{'三宅精一'.slice(0, Math.max(0, n))}</text>
            <path d="M 10 -160 H 420" stroke={RED} strokeWidth={7} />
          </g>}
          {t > b && <g opacity={prog(t, b, 0.25)}><text x={20} y={-80} fontFamily={HAND} fontWeight={700} fontSize={50} fill={INK}>1926年</text><text x={20} y={-10} fontFamily={HAND} fontWeight={700} fontSize={50} fill={INK}>岡山県生まれ</text></g>}
          {[-330, -110, 110, 330].map((bx, i) => <g key={bx} opacity={prog(t, a + 0.2 + i * 0.12, 0.2)}><Block x={bx} y={300} size={180} /></g>)}
        </g>
      </g>
    );
  }},
  // 3a  Okayama: the black castle by the river; Miyake lived there
  {a: T.s(3) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#eef2e6" y1={1220} />
      <Cloud x={250 + v * 16} y={720} s={0.9} /><Cloud x={820 - v * 10} y={660} s={0.7} />
      <path d="M 0 1120 C 200 1080, 400 1100, 600 1090 C 800 1080, 960 1100, 1080 1090 V 1240 H 0 Z" fill="#7fae6a" {...S({strokeWidth: 4})} />
      <Castle x={620} y={1150} s={0.92} />
      <rect x={0} y={1240} width={W} height={160} fill="#7fb6d6" {...S({strokeWidth: 4})} />
      {[0, 1, 2, 3].map(k => <path key={k} d={`M ${((v * 50 + k * 300) % 1300) - 200} ${1280 + (k % 2) * 50} q 30 -14 60 0 t 60 0`} fill="none" stroke="#e3f1f8" strokeWidth={5} />)}
      <rect x={0} y={1400} width={W} height={520} fill="#d9d0bd" {...S({strokeWidth: 4})} />
      <Person id="mi3" t={t} x={280} y={1640} s={1.15} {...MIYAKE} mood="smile" armR={[150, 160]} armL={[10, 10]} bob={Math.sin(t * 3) * 3} />
    </g>
  )},
  // 3b  his friend, losing the light of his eyes: the dark closes in
  {a: T.at(3, '目の病気') - 0.08, draw: (t, v) => {
    const a = T.at(3, '目の病気'), b = T.to(3, '失っていく'), q = easeInOut(prog(t, a, b - a + 0.3));
    const r = lerp(1000, 330, q), cx = 540, cy = 1080;
    return (
      <g>
        <Sky top="#f6dc9a" bottom="#f3ecd8" />
        <circle cx={760} cy={760} r={lerp(220, 120, q)} fill="url(#glow)" />
        <circle cx={760} cy={760} r={70} fill="#fff3c2" opacity={1 - q * 0.6} />
        <Person id="fr3" t={t} x={540} y={2300} s={2.3} {...FRIEND} mood="flat" armL={[10, 10]} armR={[10, 10]} />
        <path d={`M 0 0 H ${W} V ${H} H 0 Z M ${cx + r} ${cy} A ${r} ${r * 1.1} 0 1 0 ${cx - r} ${cy} A ${r} ${r * 1.1} 0 1 0 ${cx + r} ${cy} Z`} fill="#17151c" fillRule="evenodd" opacity={0.82} />
      </g>
    );
  }},
  // 3c  his friend, Iwahashi Hideyuki
  {a: T.at(3, '岩橋英行') - 0.08, draw: (t, v) => {
    const a = T.at(3, '岩橋英行'), b = T.to(3, '岩橋英行');
    return (
      <g>
        <Sky top="#bcd9ea" bottom="#f3ecd8" y1={1400} />
        <Cloud x={240 + v * 14} y={760} s={0.8} />
        <rect x={0} y={1400} width={W} height={520} fill="#d9d0bd" {...S({strokeWidth: 4})} />
        <path d="M 0 1300 C 260 1260, 520 1290, 800 1270 C 900 1262, 1000 1272, 1080 1268 V 1400 H 0 Z" fill="#9cc48a" {...S({strokeWidth: 4})} />
        <Person id="fr3c" t={t} x={680} y={1640} s={1.25} {...FRIEND} mood="smile" armL={[10, 10]} armR={[28, 22]} holdR={<Cane dx={60} dy={236} />} />
        <Person id="mi3c" t={t} x={370} y={1640} s={1.25} {...MIYAKE} mood="smile" armL={[10, 10]} armR={[30, 150]} />
        <text x={680} y={640} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={38} fill="#5a5347" opacity={prog(t, a, 0.2)}>いわはし ひでゆき</text>
        <Label t={t} text="岩橋英行" x={680} y={730} size={80} a={a} b={b} font={MARK} bold />
      </g>
    );
  }},
  // 4a  how can a blind man walk safely? the street, the cars, the questions
  {a: T.s(4) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#bcd9ea" bottom="#f3ecd8" y1={1100} />
      {[[-40, 300, '#a07c58'], [260, 260, '#8a6b4c'], [520, 300, '#b59670'], [820, 300, '#7b5e44']].map(([hx, hw, hc], i) => <g key={i}><rect x={hx as number} y={1100 - 360} width={hw as number} height={360} fill={hc as string} {...S({strokeWidth: 4})} /><rect x={(hx as number) + 20} y={1100 - 250} width={(hw as number) - 40} height={80} fill="#f3ead4" {...S({strokeWidth: 3})} /><path d={`M ${(hx as number) - 14} ${1100 - 360} H ${(hx as number) + (hw as number) + 14} L ${(hx as number) + (hw as number) - 10} ${1100 - 410} H ${(hx as number) + 10} Z`} fill="#4f545c" {...S({strokeWidth: 4})} /></g>)}
      <rect x={0} y={1100} width={W} height={320} fill="#8e8a82" />
      <path d="M 0 1260 H 1080" stroke="#f1ede2" strokeWidth={8} strokeDasharray="60 40" />
      <Auto x={lerp(1300, -300, prog(v, 0, 2.4))} y={1240} s={1.3} c="#d5503b" />
      <Auto x={lerp(-300, 1400, prog(v, 0.4, 2.2))} y={1400} s={1.4} c="#3e7c6a" />
      <rect x={0} y={1420} width={W} height={500} fill="#d9d0bd" {...S({strokeWidth: 4})} />
      <Person id="bl4" t={t} x={420} y={1680} s={1.15} {...PASSER} mood="doubt" armR={[30, 26 + Math.sin(t * 6) * 8]} holdR={<Cane dx={80 + Math.sin(t * 6) * 30} dy={250} />} armL={[14, 10]} />
      {[[250, 870, -14, 0.1], [600, 820, 12, 0.35], [700, 1000, 8, 0.6]].map(([qx, qy, qr, qa], i) => { const k = pop(t, T.s(4) + (qa as number), 200); return k > 0 ? <QMark key={i} x={qx} y={qy + Math.sin(t * 4 + i) * 8} s={0.7 * k} rot={qr} /> : null; })}
    </g>
  )},
  // 4b  could a road be made, safe to walk on? Miyake thinks
  {a: T.at(4, '安全に') - 0.08, draw: (t, v) => {
    const k = pop(t, T.at(4, '安全に'), 150);
    return (
      <g>
        <Paper c="#efe5cc" />
        <rect x={0} y={1560} width={W} height={360} fill="#d9d0bd" />
        <Person id="mi4" t={t} x={300} y={1720} s={1.4} {...MIYAKE} mood="doubt" armL={[10, 10]} armR={[40, 168]} look={4} />
        <Thought x={650} y={930} w={600} h={460} k={k} fx={420} fy={980}>
          <rect x={390} y={760} width={520} height={340} rx={150} fill="#9a968e" />
          <g transform="translate(650 930) scale(0.4)"><Block x={-300} y={0} size={280} kind="line" /><Block x={0} y={0} size={280} kind="line" /><Block x={300} y={0} size={280} kind="line" /></g>
          <QMark x={650} y={900} s={0.9} rot={8} />
        </Thought>
      </g>
    );
  }},
  // 5a  one day, a man with a white cane steps on the crossing
  {a: T.s(5) - 0.08, draw: (t, v) => <Crossing t={t} v={v} car={0} scared={false} />},
  // 5b  and a car rushes right past in front of him
  {a: T.at(5, '車が') - 0.08, draw: (t, v) => <Crossing t={t} v={v} car={prog(t, T.at(5, '車が') - 0.05, T.to(5, '走り抜け') - T.at(5, '車が') + 0.3)} scared={t > T.at(5, '車が') + 0.15} />},
  // 6a  the hint: what his friend said, in the garden
  {a: T.s(6) - 0.08, draw: (t, v) => {
    const k = pop(t, T.s(6) + 0.1, 150);
    return (
      <g>
        <Sky top="#cfe3d2" bottom="#eef2e6" y1={1350} />
        <rect x={0} y={1080} width={W} height={60} fill="#7b5e44" {...S({strokeWidth: 4})} />
        <path d="M 0 1140 H 1080 V 1350 H 0 Z" fill="#6fa046" />
        {[160, 480, 860].map(px => <ellipse key={px} cx={px} cy={1250} rx={80} ry={40} fill="#8d877a" {...S({strokeWidth: 4})} />)}
        <MossEarth y0={1350} y1={H} />
        <Person id="fr6" t={t} x={360} y={1700} s={1.2} {...FRIEND} mood="smile" armL={[10, 10]} armR={[28, 22]} holdR={<Cane dx={60} dy={236} />} />
        <Person id="mi6" t={t} x={820} y={1700} s={1.15} {...MIYAKE} mood="wow" look={-6} armL={[10, 10]} armR={[10, 10]} />
        <Balloon x={600} y={800} w={560} h={330} tx={430} ty={1020} k={k}>
          <clipPath id="ball6"><circle cx={600} cy={800} r={120} /></clipPath>
          <g clipPath="url(#ball6)"><rect x={480} y={680} width={120} height={240} fill="#5f8f3a" /><rect x={600} y={680} width={120} height={240} fill="#a77b4f" /></g>
          <circle cx={600} cy={800} r={120} fill="none" stroke={INK} strokeWidth={5} />
          <path d="M 600 680 V 920" stroke={RED} strokeWidth={7} strokeDasharray="16 10" />
        </Balloon>
      </g>
    );
  }},
  // 6b  the border of the moss and the earth, under the foot
  {a: T.at(6, 'コケ') - 0.08, draw: (t, v) => {
    const step = easeInOut(prog(t, T.at(6, 'コケ') + 0.2, 1.4)), lift = Math.sin(step * Math.PI) * 120;
    return (
      <g>
        <MossEarth y0={560} y1={H} glow={prog(t, T.at(6, '境'), 0.3)} />
        <Shoe x={lerp(260, 640, step)} y={1320 - lift} s={1.05} rot={-Math.sin(step * Math.PI) * 8} />
        <text x={300} y={1520} textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#fbf6ea" stroke={INK} strokeWidth={10} paintOrder="stroke" opacity={prog(t, T.at(6, 'コケ'), 0.2)}>コケ</text>
        <text x={800} y={1520} textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#fbf6ea" stroke={INK} strokeWidth={10} paintOrder="stroke" opacity={prog(t, T.at(6, '土'), 0.2)}>土</text>
      </g>
    );
  }},
  // 6c  the foot feels it
  {a: T.at(6, '足の') - 0.08, draw: (t, v) => (
    <g>
      <MossEarth y0={560} y1={H} glow={1} />
      {[0, 1, 2].map(i => { const f = ((t - T.at(6, '足の')) * 0.9 + i / 3) % 1; return <ellipse key={i} cx={560} cy={1330} rx={lerp(120, 520, f)} ry={lerp(30, 130, f)} fill="none" stroke="#fff3c2" strokeWidth={10} opacity={1 - f} />; })}
      <Shoe x={460} y={1320} s={1.2} />
      <Sparkles x={560} y={1200} r={300} t={t} c="#fff3c2" n={8} />
    </g>
  )},
  // 6d  the friend's word lights the idea
  {a: T.at(6, 'という') - 0.08, draw: (t, v) => {
    const k = pop(t, T.at(6, 'という'), 170);
    return (
      <g>
        <Paper c="#efe5cc" />
        <rect x={0} y={1560} width={W} height={360} fill="#d9d0bd" />
        <Person id="fr6d" t={t} x={300} y={1700} s={1.2} {...FRIEND} mood="smile" armL={[10, 10]} armR={[28, 22]} holdR={<Cane dx={60} dy={236} />} />
        <Person id="mi6d" t={t} x={720} y={1700} s={1.3} {...MIYAKE} mood="wow" armL={[10, 10]} armR={[150, 170]} pointR />
        {k > 0 && <Bulb x={720} y={760} s={1.1 * k} t={t} />}
      </g>
    );
  }},
  // 7a  braille, read with a finger…
  {a: T.s(7) - 0.08, draw: (t, v) => {
    const fx = lerp(220, 840, prog(v, 0.1, 1.2));
    return (
      <g>
        <Paper c="#c9b892" />
        <g transform="rotate(-4 540 1080)" filter="url(#drop)">
          <rect x={120} y={700} width={840} height={760} rx={8} fill="#fbf6ea" {...S({strokeWidth: 5})} />
          {Array.from({length: 5}).map((_, r) => Array.from({length: 10}).map((_, c) => [0, 1, 2, 3, 4, 5].map(d => (hash(`b${r}-${c}-${d}`) > 0.45 ? <circle key={`${r}${c}${d}`} cx={180 + c * 76 + (d % 2) * 24} cy={790 + r * 140 + Math.floor(d / 2) * 26} r={8} fill="#efe6cc" stroke="#b8ab88" strokeWidth={3} /> : null))))}
          <g transform={`translate(${fx} 960) rotate(-12)`}>
            <path d="M -60 640 L -70 330 C -74 280, -40 250, -10 262 L 40 270 C 80 280, 96 320, 90 360 L 70 640 Z" fill="#5d6b45" {...S()} />
            <path d="M -76 200 C -90 150, -60 120, -30 130 L 70 150 C 110 160, 120 220, 100 270 L 80 300 C 40 316, -50 310, -70 280 Z" fill={SKIN} {...S()} />
            <path d="M -22 140 L -26 10 C -26 -24, 18 -24, 20 10 L 26 146 Z" fill={SKIN} {...S()} />
            <ellipse cx={-2} cy={4} rx={14} ry={10} fill="#f6dcc0" stroke={INK} strokeWidth={3} />
            {[0, 1, 2].map(k => <ellipse key={k} cx={40 + k * 22} cy={160 + k * 10} rx={20} ry={28} fill={SKIN} {...S({strokeWidth: 4})} />)}
          </g>
        </g>
      </g>
    );
  }},
  // 7b  …and, for the foot, braille on the road
  {a: T.at(7, '道の点字') - 0.08, draw: (t, v) => {
    const g = easeOut(prog(t, T.at(7, '道の点字'), 0.5)), lay = prog(t, T.at(7, '点字') + 0.2, 0.9);
    return (
      <g>
        <Paper c="#9a968e" />
        {Array.from({length: 60}).map((_, i) => <circle key={i} cx={hash('rs' + i) * W} cy={hash('ry' + i) * H} r={3 + hash('rr' + i) * 4} fill={i % 2 ? '#8a867e' : '#aeaaa2'} />)}
        <rect x={0} y={0} width={180} height={H} fill="#d9d0bd" /><rect x={900} y={0} width={180} height={H} fill="#d9d0bd" />
        {[0, 1, 2, 3, 4].map(i => (lay * 5 > i || i === 2 ? <Block key={i} x={540} y={1840 - i * 380} size={360} kind={i === 2 ? 'dot' : 'line'} rise={i === 2 ? g : clamp(lay * 5 - i)} /> : null))}
      </g>
    );
  }},
  // 8a  with his brother, over the drawings of the bumps
  {a: T.s(8) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#e3d6b8" />
      {[[140, 640], [880, 700]].map(([hx, hy], i) => <g key={i}><rect x={hx - 60} y={hy} width={120} height={10} fill="#7b5e44" />{[0, 1, 2].map(k => <rect key={k} x={hx - 50 + k * 36} y={hy - 80} width={16} height={80} fill={['#8d877a', '#b5553c', '#3e7c6a'][k]} {...S({strokeWidth: 3})} />)}</g>)}
      <Person id="mi8" t={t} x={300} y={1600} s={1.15} {...MIYAKE} mood="stern" armL={[10, 10]} armR={[60, 120]} look={6} />
      <Person id="br8" t={t} x={790} y={1600} s={1.15} {...BRO} mood="ok" armL={[60, 120]} armR={[10, 10]} look={-6} />
      <rect x={60} y={1260} width={960} height={50} fill="#9a6b3d" {...S()} />
      <rect x={90} y={1310} width={40} height={260} fill="#7b5530" {...S({strokeWidth: 4})} /><rect x={950} y={1310} width={40} height={260} fill="#7b5530" {...S({strokeWidth: 4})} />
      <g transform="translate(540 1200) rotate(-2)" filter="url(#dropS)">
        <rect x={-300} y={-130} width={600} height={190} fill="#3f6ea8" {...S({strokeWidth: 4})} />
        <g transform="translate(-170 -35)">{Array.from({length: 25}).map((_, i) => <circle key={i} cx={-60 + (i % 5) * 30} cy={-60 + Math.floor(i / 5) * 30} r={11} fill="none" stroke="#e9f0fa" strokeWidth={3} />)}<rect x={-80} y={-80} width={160} height={160} fill="none" stroke="#e9f0fa" strokeWidth={3} /></g>
        <g transform="translate(120 -35)">{[0, 1, 2, 3].map(i => <rect key={i} x={-60 + i * 36} y={-70} width={14} height={140} rx={7} fill="none" stroke="#e9f0fa" strokeWidth={3} />)}<rect x={-80} y={-80} width={160} height={160} fill="none" stroke="#e9f0fa" strokeWidth={3} /></g>
        <path d="M -270 40 H 270" stroke="#e9f0fa" strokeWidth={3} strokeDasharray="10 8" />
      </g>
      <Label t={t} text="弟" x={790} y={880} size={60} a={T.at(8, '弟')} fill="#fff3c8" color={RED} />
    </g>
  )},
  // 8b  try after try: one shape after another crossed out, until one is right
  {a: T.at(8, '何度も') - 0.08, draw: (t, v) => {
    const a = T.at(8, '何度も'), items: [number, number, string][] = [[220, 820, 'big'], [540, 820, 'tiny'], [860, 820, 'bars'], [220, 1240, 'ring'], [540, 1240, 'cross'], [860, 1240, 'ok']];
    return (
      <g>
        <Paper c="#cfc6b2" />
        {items.map(([x, y, kind], i) => {
          const k = pop(t, a - 0.05 + i * 0.07, 220);
          const size = 250;
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${k})`}>
              <rect x={-size / 2 + 6} y={-size / 2 + 10} width={size} height={size} rx={8} fill="#3a2a14" opacity={0.2} />
              <rect x={-size / 2} y={-size / 2} width={size} height={size} rx={8} fill={kind === 'ok' ? YEL : '#e7d58e'} {...S({strokeWidth: 4})} />
              {kind === 'big' && [0, 1, 2].map(r => [0, 1, 2].map(c => <circle key={r + '' + c} cx={-70 + c * 70} cy={-70 + r * 70} r={28} fill="#f3e6b0" stroke={YEL_D} strokeWidth={3} />))}
              {kind === 'tiny' && Array.from({length: 49}).map((_, j) => <circle key={j} cx={-90 + (j % 7) * 30} cy={-90 + Math.floor(j / 7) * 30} r={6} fill="#f3e6b0" stroke={YEL_D} strokeWidth={2} />)}
              {kind === 'bars' && [0, 1, 2, 3].map(j => <rect key={j} x={-90} y={-80 + j * 46} width={180} height={22} rx={11} fill="#f3e6b0" stroke={YEL_D} strokeWidth={3} />)}
              {kind === 'ring' && [0, 1].map(r => [0, 1].map(c => <circle key={r + '' + c} cx={-50 + c * 100} cy={-50 + r * 100} r={34} fill="none" stroke={YEL_D} strokeWidth={10} />))}
              {kind === 'cross' && [0, 1, 2].map(j => <g key={j}><rect x={-90} y={-70 + j * 60} width={180} height={16} fill="#f3e6b0" stroke={YEL_D} strokeWidth={3} /><rect x={-70 + j * 60} y={-90} width={16} height={180} fill="#f3e6b0" stroke={YEL_D} strokeWidth={3} /></g>)}
              {kind === 'ok' && <g transform={`scale(${size / 540})`}><Block x={0} y={0} size={500} /></g>}
            </g>
          );
        })}
        {items.slice(0, 5).map(([x, y], i) => <XMark key={i} x={x} y={y} r={100} t={t} a={a + 0.25 + i * 0.22} />)}
        {t > a + 0.25 + 5 * 0.22 && <Check x={860} y={1240} s={0.8 * pop(t, a + 0.25 + 5 * 0.22, 200)} />}
      </g>
    );
  }},
  // 9a  1967: the school for the blind of Okayama, and the road in front of it
  {a: T.s(9) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#bcd9ea" bottom="#f3ecd8" y1={1150} />
      <Cloud x={720 + v * 12} y={700} s={0.7} />
      <rect x={0} y={1140} width={W} height={110} fill="#9cc48a" />
      <School x={290} y={1250} s={1.0} />
      <rect x={0} y={1250} width={W} height={60} fill="#d9d0bd" {...S({strokeWidth: 4})} />
      <rect x={0} y={1310} width={W} height={250} fill="#8e8a82" />
      {Array.from({length: 6}).map((_, i) => <rect key={i} x={120 + i * 150} y={1325} width={90} height={220} fill="#f1ede2" />)}
      <rect x={0} y={1560} width={W} height={360} fill="#d9d0bd" {...S({strokeWidth: 4})} />
      <Calendar x={720} y={760} s={0.72} year="1967" top="3月18日" />
    </g>
  )},
  // 9b  230 blocks laid, the students walk on them
  {a: T.at(9, '230枚') - 0.08, draw: (t, v) => {
    const a = T.at(9, '230枚'), q = easeOut(prog(t, a, T.e(9) - a + 0.4)), c: Cam = {cx: 470, hz: 1000, f: 900, h: 3.2};
    const n = Math.round(230 * q);
    return (
      <g>
        <Sky top="#bcd9ea" bottom="#f3ecd8" y1={1000} />
        <School x={560} y={1000} s={0.45} />
        <rect x={0} y={1000} width={W} height={H - 1000} fill="#d9d0bd" />
        <polygon points={quad(c, [[2.4, 3], [12, 3], [12, 60], [2.4, 60]])} fill="#8e8a82" />
        <Road c={c} x0={-1} cols={2} z0={2.6} z1={60} upto={lerp(2.6, 60, q)} />
        {[[0, 14, 'a'], [0.1, 22, 'b']].map(([X, Z, id]) => { const [px, py] = P(c, X as number, Z as number), s = (c.f * 5.4 / (Z as number)) / 640, st = Math.sin(t * 5 + (Z as number)); return q > 0.5 ? <Person key={id as string} id={'s9' + id} t={t} x={px} y={py} s={s} {...FRIEND} suit="#4a5a7a" hairStyle="short" legs={[st * 14, -st * 14]} armR={[24, 22]} holdR={<Cane dx={60} dy={236} />} /> : null; })}
        <g transform="translate(250 760)" filter="url(#drop)"><rect x={-170} y={-80} width={340} height={150} rx={14} fill="#fbf6ea" {...S({strokeWidth: 6})} /><text x={0} y={36} textAnchor="middle" fontFamily={MARK} fontSize={100} fill={RED}>{n}<tspan fontSize={60} fill={INK}>枚</tspan></text></g>
      </g>
    );
  }},
  // 10  all of it with his own money
  {a: T.s(10) - 0.08, draw: (t, v) => {
    const turn = easeOut(prog(t, T.s(10) + 0.1, 0.3)), sh = Math.sin(t * 30) * 6 * clamp(turn * 2 - 1);
    return (
      <g>
        <Paper c="#e8dcc0" />
        <rect x={0} y={1460} width={W} height={460} fill="#d9d0bd" />
        {[0, 1, 2, 3, 4, 5].map(i => <g key={i}><rect x={460} y={1440 - i * 46} width={480} height={46} fill={YEL} {...S({strokeWidth: 4})} />{Array.from({length: 12}).map((_, k) => <ellipse key={k} cx={480 + k * 40} cy={1446 - i * 46} rx={12} ry={5} fill={YEL_L} stroke={YEL_D} strokeWidth={2} />)}</g>)}
        <Person id="mi10" t={t} x={260} y={1760} s={1.6} {...MIYAKE} mood="stern" armL={[10, 10]} armR={[120, lerp(150, 165, turn)]} />
        <Purse x={620 + sh} y={lerp(860, 820, turn)} s={1.15} rot={lerp(0, 180, turn)} open={turn} />
        <MoneyRain t={t} a={T.s(10) + 0.35} x={640} y={780} floor={1170} n={16} id="r10" />
        <Stamp t={t} text="自腹" x={760} y={1340} size={110} a={T.at(10, '自腹')} rot={-8} />
      </g>
    );
  }},
  // 11a  he gives them away for free, and nobody wants them
  {a: T.s(11) - 0.08, draw: (t, v) => {
    const no = Math.sin(t * 9) * 18;
    return (
      <g>
        <Paper c="#e6e1d3" />
        <g filter="url(#dropS)"><rect x={420} y={640} width={420} height={120} rx={8} fill="#fbf7ee" {...S({strokeWidth: 5})} /><text x={630} y={725} textAnchor="middle" fontFamily={MARK} fontSize={70} fill={INK}>市役所</text></g>
        <Person id="of1" t={t} x={600} y={1500} s={1.05} suit="#55606e" pants="#3a414c" tie="#3a414c" hairStyle="part" glasses mood="flat" armL={[10, 10]} armR={[120 + no, 150 + no]} />
        <Person id="of2" t={t} x={880} y={1500} s={1.0} suit="#6e5e55" pants="#4a3f38" tie="#2e6b4f" hairStyle="grey" mood="doubt" armL={[10, 10]} armR={[10, 10]} look={-6} />
        <rect x={380} y={1180} width={700} height={60} fill="#9a6b3d" {...S()} />
        <rect x={400} y={1240} width={680} height={330} fill="#b07a48" {...S()} />
        <Person id="mi11" t={t} x={230} y={1720} s={1.35} {...MIYAKE} mood="smile" armL={[50, 100]} armR={[50, 100]} holdR={<g transform="translate(-50 -40)"><Block x={0} y={0} size={170} /><g transform="translate(0 -100)"><rect x={-70} y={-30} width={140} height={60} rx={8} fill="#fbf6ea" stroke={RED} strokeWidth={5} /><text y={18} textAnchor="middle" fontFamily={MARK} fontSize={44} fill={RED}>無料</text></g></g>} />
      </g>
    );
  }},
  // 11b  the telephone never rings: no orders
  {a: T.at(11, '注文は') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#d9d2c2" />
      <rect x={0} y={1280} width={W} height={640} fill="#9a6b3d" {...S({strokeWidth: 4})} />
      <path d="M 0 0 L 380 0 M 0 0 L 0 420 M 0 0 L 300 260 M 160 0 Q 120 100 0 160 M 300 0 Q 220 200 0 300 M 380 0 Q 300 300 0 420" fill="none" stroke="#fbfbf8" strokeWidth={3} opacity={0.7} />
      <Phone x={480} y={1260} s={1.3} />
      <path d="M 420 1010 L 300 700 M 560 1000 L 640 600" stroke="#fbfbf8" strokeWidth={3} opacity={0.75} />
      <path d={`M 640 600 V ${760 + Math.sin(t * 3) * 20}`} stroke="#fbfbf8" strokeWidth={2} />
      <circle cx={640} cy={770 + Math.sin(t * 3) * 20} r={14} fill={INK} />
      <g transform="translate(820 1440) rotate(6)" filter="url(#dropS)"><rect x={-150} y={-110} width={300} height={220} rx={6} fill="#fbf8ef" {...S({strokeWidth: 4})} /><text x={0} y={-50} textAnchor="middle" fontFamily={MARK} fontSize={46} fill={INK}>注文</text><text x={0} y={50} textAnchor="middle" fontFamily={MARK} fontSize={80} fill={RED}>0</text></g>
    </g>
  )},
  // 12a  the purse is empty
  {a: T.s(12) - 0.08, draw: (t, v) => {
    const m = prog(t, T.s(12) + 0.4, 1.6);
    return (
      <g>
        <Paper c="#e8dcc0" />
        <rect x={0} y={1480} width={W} height={440} fill="#d9d0bd" />
        <Purse x={540} y={1180} s={2.0} open={1} empty />
        {m > 0 && <g transform={`translate(${540 + Math.sin(m * 9) * 120} ${1000 - m * 420}) rotate(${Math.sin(m * 20) * 20})`}><path d="M 0 0 C -50 -40, -70 10, -10 10 Z M 0 0 C 50 -40, 70 10, 10 10 Z" fill="#c9bfa8" {...S({strokeWidth: 3})} /><ellipse cx={0} cy={4} rx={6} ry={14} fill="#8d877a" /></g>}
        <Stamp t={t} text="底をつく" x={540} y={1560} size={80} a={T.to(12, '底をつき') - 0.1} rot={-6} color="#5a4a3a" />
      </g>
    );
  }},
  // 12b  alone at night by the blocks nobody wanted
  {a: T.at(12, '何度も') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#1f2a48" bottom="#3d4a6a" />
      <circle cx={820} cy={720} r={80} fill="#f6efc8" /><circle cx={820} cy={720} r={160} fill="url(#glow)" opacity={0.35} />
      {Array.from({length: 18}).map((_, i) => <circle key={i} cx={hash('n' + i) * W} cy={600 + hash('ny' + i) * 500} r={3} fill="#f6efc8" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />)}
      <rect x={0} y={1460} width={W} height={460} fill="#3a3a48" />
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <g key={i}><rect x={560} y={1430 - i * 46} width={420} height={46} fill="#b89a3e" {...S({strokeWidth: 4})} />{Array.from({length: 10}).map((_, k) => <ellipse key={k} cx={582 + k * 42} cy={1436 - i * 46} rx={12} ry={5} fill="#d6bc66" stroke="#8a7230" strokeWidth={2} />)}</g>)}
      <Person id="mi12" t={t} x={360} y={1640} s={1.3} {...MIYAKE} mood="sad" lean={6} armL={[10, 10]} armR={[50, 60]} look={4} />
      <circle cx={360} cy={1060} r={300} fill="#3d4a6a" opacity={0.18} />
    </g>
  )},
  // 13a  1982: the yellow lines have only begun to spread over Japan
  {a: T.s(13) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#cfe3ec" />
      {Array.from({length: 8}).map((_, i) => <path key={i} d={`M 0 ${640 + i * 140} q 60 -16 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0 t 120 0`} fill="none" stroke="#b6d4e2" strokeWidth={4} />)}
      <JapanMap dy={0} spread={lerp(0.12, 0.55, easeInOut(prog(t, T.s(13), T.at(13, '三宅は') - T.s(13))))} t={t} />
      <YearFlip t={t} a={T.s(13) - 0.05} b={T.to(13, '1982年') + 0.1} from={1967} to={1982} x={250} y={780} s={0.68} />
    </g>
  )},
  // 13b  he died at 56
  {a: T.at(13, '三宅は') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#d9d2c2" />
      <g opacity={0.35}><JapanMap dy={0} spread={0.55 + 0.1 * prog(v, 0, 3)} t={t} /></g>
      <Portrait x={540} y={1050} s={lerp(0.92, 1, easeOut(prog(v, 0, 0.5)))} t={t} id="ie13" />
      <Flowers x={200} y={1560} s={1.1} /><Flowers x={880} y={1560} s={1.1} />
      {[0, 1, 2].map(i => <path key={i} d={`M ${520 + i * 20} 1560 C ${480 + i * 20 + Math.sin(t * 2 + i) * 30} 1480, ${580 + i * 20 + Math.sin(t * 2.4 + i) * 30} 1420, ${540 + i * 20} 1340`} fill="none" stroke="#fbfbf8" strokeWidth={5} opacity={0.6} />)}
      <rect x={470} y={1540} width={140} height={30} rx={6} fill="#8d877a" {...S({strokeWidth: 4})} />
    </g>
  )},
  // 14a  today: the yellow line on the platform
  {a: T.s(14) - 0.08, draw: (t, v) => <Station t={t} v={v} trainX={lerp(1200, -20, easeOut(prog(v, 0, 1.6)))} />},
  // 14b  in more than seventy countries
  {a: T.at(14, '世界の') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#e9e1cc" />
      <Globe x={540} y={1090} r={440} t={t + 3} a={T.at(14, '世界の')} gap={0.05} flags />
      <g transform="translate(540 1620)" filter="url(#drop)" opacity={prog(t, T.at(14, '70'), 0.2)}><rect x={-230} y={-70} width={460} height={130} rx={14} fill="#fbf6ea" {...S({strokeWidth: 6})} /><text x={0} y={30} textAnchor="middle" fontFamily={MARK} fontSize={80} fill={RED}>70<tspan fontSize={56} fill={INK}>か国以上</tspan></text></g>
    </g>
  )},
  // 15a  next time your foot steps on it
  {a: T.s(15) - 0.08, draw: (t, v) => {
    const st = easeInOut(prog(t, T.at(15, 'ふんだら') - 0.3, 0.45));
    return (
      <g>
        <Paper c="#c9c6bd" />
        {Array.from({length: 10}).map((_, i) => <path key={i} d={`M 0 ${560 + i * 140} H 1080`} stroke="#b4b1a8" strokeWidth={3} />)}
        {[0, 1, 2, 3].map(i => <Block key={i} x={540} y={600 + i * 400} size={390} kind={i === 1 ? 'dot' : 'line'} />)}
        <Sneaker x={360} y={1470} s={1.05} rot={-6} />
        <Sneaker x={lerp(700, 560, st)} y={lerp(1560, 1050, st)} s={lerp(1.15, 1.05, st)} rot={4} />
        {st >= 1 && [0, 1].map(i => { const f = ((t - T.at(15, 'ふんだら') - 0.15) * 1.2 + i / 2) % 1; return <circle key={i} cx={560} cy={1050} r={lerp(200, 420, f)} fill="none" stroke="#fff3c2" strokeWidth={8} opacity={1 - f} />; })}
      </g>
    );
  }},
  // 15b  remember: the two friends, in an old photograph rising from it
  {a: T.at(15, '思い出して') - 0.08, draw: (t, v) => {
    const k = pop(t, T.at(15, '思い出して'), 140);
    return (
      <g>
        <Paper c="#c9c6bd" />
        {[0, 1, 2, 3].map(i => <Block key={i} x={540} y={600 + i * 400} size={390} kind={i === 1 ? 'dot' : 'line'} />)}
        <circle cx={540} cy={1000} r={520} fill="url(#glow)" opacity={0.7} />
        <Sneaker x={560} y={1050} s={1.05} rot={4} /><Sneaker x={360} y={1470} s={1.05} rot={-6} />
        {k > 0 && <g transform={`translate(540 1060) scale(${k}) translate(-540 -1060)`} filter="url(#drop)">
          <circle cx={540} cy={1060} r={400} fill="#fbf6ea" {...S({strokeWidth: 8})} />
          <clipPath id="mem15"><circle cx={540} cy={1060} r={380} /></clipPath>
          <g clipPath="url(#mem15)" filter="url(#sepia)">
            <rect x={140} y={660} width={800} height={800} fill="#bcd9ea" />
            <rect x={140} y={1180} width={800} height={300} fill="#d9d0bd" />
            <Road c={{cx: 540, hz: 1180, f: 700, h: 3}} x0={-1} cols={2} z0={3} z1={40} />
            <Person id="m15" t={t} x={380} y={1360} s={0.78} {...MIYAKE} mood="smile" armL={[10, 10]} armR={[30, 150]} noShadow />
            <Person id="f15" t={t} x={600} y={1360} s={0.78} {...FRIEND} mood="smile" armL={[10, 10]} armR={[28, 22]} holdR={<Cane dx={60} dy={236} />} noShadow />
          </g>
        </g>}
      </g>
    );
  }},
  // 16  the road one man laid for his friend: the two walk away on it, into the evening
  {a: T.s(16) - 0.08, draw: (t, v) => {
    const z = lerp(9.2, 10.4, prog(v, 0, 3.5)), s = (STREET.f * 5.6 / z) / 640;
    const [fx, fy] = P(STREET, 0.7, z), [mx, my] = P(STREET, -1.3, z);
    return (
      <g>
        <HookStreet t={t} v={v} sun />
        <Back x={fx} y={fy} s={s} suit={FRIEND.suit as string} t={t} walk={1} cane />
        <Back x={mx} y={my} s={s} suit={MIYAKE.suit as string} t={t + 0.6} walk={1} armToward={((fx - 30 * s) - mx) / s - 74} />
        <rect width={W} height={H} fill="#f0a86a" opacity={0.12} style={{mixBlendMode: 'multiply'}} />
      </g>
    );
  }},
];

// ---------- the words ----------
const words = (t: number) => (
  <g>
    {lineOn(t, T, 0, N) && <g>
      <Label t={t} text="目が見えなくなっていく{友}のために" x={540} y={300} size={56} a={0} still bold font={MARK} />
      <Label t={t} text="男は{自腹}で道に{でこぼこ}を並べた" x={540} y={440} size={58} a={0} still bold font={MARK} />
    </g>}
    {lineOn(t, T, 1, N) && <g>
      <Label t={t} text="それがいま{世界中の駅}にあることを" x={540} y={330} size={54} a={T.s(1)} b={T.to(1, 'ことを')} />
      <Label t={t} text="彼は{見ずに}亡くなった" x={540} y={455} size={66} a={T.at(1, '彼は')} b={T.e(1)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 2, N) && <Label t={t} text="その男の名は…" x={540} y={380} size={62} a={T.s(2)} b={T.to(2, '名は')} />}
    {lineOn(t, T, 3, N) && <g>
      <Tag t={t} text="岡山" a={T.s(3)} />
      <Label t={t} text="岡山に住む三宅には" x={540} y={330} size={58} a={T.s(3)} b={T.to(3, '三宅には')} />
      <Label t={t} text="目の病気で{光を失っていく}友がいた" x={540} y={455} size={56} a={T.at(3, '目の病気')} b={T.to(3, '友')} />
    </g>}
    {lineOn(t, T, 4, N) && <g>
      <Label t={t} text="目の見えない人が" x={540} y={330} size={60} a={T.s(4)} b={T.to(4, '人が')} />
      <Label t={t} text="{安全に歩ける道}は、つくれないのか" x={540} y={455} size={56} a={T.at(4, '安全に')} b={T.e(4)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 5, N) && <g>
      <Tag t={t} text="ある日" a={T.s(5)} />
      <Label t={t} text="白い杖の人の目の前を" x={540} y={330} size={60} a={T.at(5, '白い杖')} b={T.to(5, '目の前を')} />
      <Label t={t} text="{車}が走り抜けた！" x={540} y={455} size={70} a={T.at(5, '車が')} b={T.e(5)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 6, N) && <g>
      {t < T.at(6, 'コケ') - 0.1
        ? <Label t={t} text="ヒントは…" x={540} y={300} size={62} a={T.s(6)} b={T.to(6, 'ヒントは')} />
        : <Label t={t} text="「コケと土の{境}は" x={540} y={300} size={60} a={T.at(6, 'コケ')} b={T.to(6, '境は')} bold font={MARK} />}
      <Label t={t} text="{足の感覚}を通して分かる」" x={540} y={415} size={60} a={T.at(6, '足の')} b={T.to(6, '分かる')} bold font={MARK} />
      <Label t={t} text="友のひと言だった…といいます" x={540} y={520} size={46} a={T.at(6, 'という')} b={T.e(6)} />
    </g>}
    {lineOn(t, T, 7, N) && <g>
      <Label t={t} text="{足の裏}で読める" x={540} y={330} size={64} a={T.s(7)} b={T.to(7, '読める')} />
      <Label t={t} text="道の{点字}をつくればいい" x={540} y={455} size={66} a={T.at(7, '道の点字')} b={T.e(7)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 8, N) && <g>
      <Label t={t} text="三宅は{弟}と二人で" x={540} y={330} size={60} a={T.s(8)} b={T.to(8, '二人で')} />
      <Label t={t} text="でこぼこの形を{何度も}ためした" x={540} y={455} size={58} a={T.at(8, 'でこぼこ')} b={T.e(8)} />
    </g>}
    {lineOn(t, T, 9, N) && <g>
      <Tag t={t} text="1967年3月18日" a={T.s(9)} />
      <Label t={t} text="岡山の{盲学校}の近くに" x={540} y={330} size={60} a={T.at(9, '岡山')} b={T.to(9, '近くに')} />
      <Label t={t} text="{230枚}のブロックが並んだ" x={540} y={455} size={62} a={T.at(9, '230枚')} b={T.e(9)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 10, N) && <g>
      <Label t={t} text="お金は、すべて" x={540} y={330} size={62} a={T.s(10)} b={T.to(10, 'すべて')} />
      <Label t={t} text="三宅の{自腹}" x={540} y={465} size={80} a={T.at(10, '三宅')} b={T.e(10)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 11, N) && <g>
      <Label t={t} text="けれど、{ただ}で配っても" x={540} y={330} size={60} a={T.s(11)} b={T.to(11, '配っても')} />
      <Label t={t} text="注文は{ほとんど来ない}" x={540} y={455} size={64} a={T.at(11, '注文は')} b={T.e(11)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 12, N) && <g>
      <Label t={t} text="お金は{底をつき}" x={540} y={330} size={62} a={T.s(12)} b={T.to(12, '底をつき')} />
      <Label t={t} text="何度も{あきらめかけた}そうです" x={540} y={455} size={58} a={T.at(12, '何度も')} b={T.e(12)} />
    </g>}
    {lineOn(t, T, 13, N) && <g>
      <Tag t={t} text="1982年" a={T.to(13, '1982年')} />
      <Label t={t} text="ブロックが{広がりきる前に}" x={540} y={330} size={60} a={T.at(13, 'ブロック')} b={T.to(13, '前に')} />
      <Label t={t} text="三宅は{56歳}で世を去った" x={540} y={455} size={64} a={T.at(13, '三宅は')} b={T.e(13)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 14, N) && <g>
      <Tag t={t} text="いま" a={T.s(14)} />
      <Label t={t} text="いま、この{黄色い道}は" x={540} y={330} size={60} a={T.s(14)} b={T.to(14, '道は')} />
      <Label t={t} text="世界の{70をこえる国}に" x={540} y={455} size={64} a={T.at(14, '世界の')} b={T.e(14)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 15, N) && <g>
      <Label t={t} text="次に駅でこの{でこぼこ}を" x={540} y={330} size={58} a={T.s(15)} b={T.to(15, 'でこぼこを')} />
      <Label t={t} text="ふんだら、{思い出して}ください" x={540} y={455} size={58} a={T.at(15, 'ふんだら')} b={T.e(15)} />
    </g>}
    {lineOn(t, T, 16, N) && <g>
      <Label t={t} text="それは一人の男が" x={540} y={330} size={60} a={T.s(16)} b={T.to(16, '男が')} />
      <Label t={t} text="{友}のために敷いた道" x={540} y={465} size={74} a={T.at(16, '友の')} b={T.e(16)} bold font={MARK} />
    </g>}
  </g>
);

export const TenjiVideo: React.FC = () => <Movie shots={shots} words={words} credit="声：VOICEVOX:青山龍星　／　音楽：竹笛" end={T.e(16)} />;
