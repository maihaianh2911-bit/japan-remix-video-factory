// The drawing kit of the Remotion trial (27/11/2026): flat illustration with outlines, soft shadows, a paper grain.
// Everything is SVG in a 1080 × 1920 frame; a component draws the same thing for the same props.
import React from 'react';
import {spring} from 'remotion';
import timing from './timing.json';

export const W = 1080, H = 1920;
export const INK = '#2a2420';
export const SKIN = '#f4c99b';
export const RED = '#cf2e23';
export const HAND = '"Zen Maru Gothic", sans-serif';
export const MARK = '"Yusei Magic", "Zen Maru Gothic", sans-serif';

// ---------- numbers ----------
export const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const prog = (t: number, a: number, d: number) => clamp((t - a) / d);
export const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
export const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
export const hash = (s: string) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) / 4294967296; };
// a spring from 0 to 1 that starts at moment a (seconds)
export const pop = (t: number, a: number, stiff = 170) => (t < a ? 0 : spring({frame: (t - a) * 30, fps: 30, config: {damping: 12, stiffness: stiff, mass: 0.6}}));
export const blinkAt = (t: number, key: string) => ((t * 1000 + hash(key) * 3100) % 3100) < 120;

// ---------- the voice's moments ----------
type Line = {text: string; start: number; end: number; chars: number[][]};
const L = (timing as {lines: Line[]}).lines;
const find = (i: number, w: string) => { const at = L[i].text.indexOf(w); if (at < 0) throw new Error(`line ${i} does not say ${w}`); return at; };
export const T = {
  s: (i: number) => L[i].start, e: (i: number) => L[i].end,
  at: (i: number, w: string) => L[i].start + L[i].chars[find(i, w)][0],
  to: (i: number, w: string) => L[i].start + L[i].chars[find(i, w) + w.length - 1][1],
};

// ---------- the paper, the light, the shadows ----------
export const Defs: React.FC = () => (
  <defs>
    <filter id="grain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={3} stitchTiles="stitch" />
      <feColorMatrix type="matrix" values="0 0 0 0 0.30  0 0 0 0 0.22  0 0 0 0 0.12  0 0 0 0.85 0" />
    </filter>
    <filter id="mottle" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.004 0.007" numOctaves={3} seed={11} />
      <feColorMatrix type="matrix" values="0 0 0 0 0.45  0 0 0 0 0.33  0 0 0 0 0.18  0 0 0 0.9 -0.2" />
    </filter>
    <filter id="drop" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="12" floodColor="#3a2a14" floodOpacity="0.30" />
    </filter>
    <filter id="dropS" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#3a2a14" floodOpacity="0.28" />
    </filter>
    <filter id="blur8"><feGaussianBlur stdDeviation="8" /></filter>
    <filter id="blur20"><feGaussianBlur stdDeviation="20" /></filter>
    <filter id="sepia"><feColorMatrix type="matrix" values="0.40 0.72 0.18 0 0.02  0.35 0.66 0.16 0 0.01  0.27 0.52 0.13 0 0  0 0 0 1 0" /></filter>
    <radialGradient id="vig" cx="50%" cy="54%" r="72%">
      <stop offset="62%" stopColor="#3c2814" stopOpacity="0" />
      <stop offset="100%" stopColor="#3c2814" stopOpacity="0.30" />
    </radialGradient>
    <linearGradient id="lamp" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#fff9e8" stopOpacity="0.16" />
      <stop offset="55%" stopColor="#fff9e8" stopOpacity="0" />
    </linearGradient>
    <radialGradient id="glow"><stop offset="0%" stopColor="#fff2b0" stopOpacity="0.95" /><stop offset="100%" stopColor="#fff2b0" stopOpacity="0" /></radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fff2b0" stopOpacity="0.8" /><stop offset="100%" stopColor="#fff2b0" stopOpacity="0" /></linearGradient>
    <pattern id="bricks" width="60" height="30" patternUnits="userSpaceOnUse">
      <path d="M 0 0 H 60 M 0 15 H 60 M 15 0 V 15 M 45 15 V 30" stroke="#000" strokeOpacity="0.16" strokeWidth="2" fill="none" />
    </pattern>
    <pattern id="tiles" width="48" height="24" patternUnits="userSpaceOnUse">
      <rect width="48" height="24" fill="#f3efe3" /><path d="M 0 0 H 48 M 0 0 V 24" stroke="#bdb6a4" strokeWidth="2" />
    </pattern>
    <pattern id="stripes" width="44" height="44" patternUnits="userSpaceOnUse">
      <rect width="22" height="44" fill="#c8402f" /><rect x="22" width="22" height="44" fill="#f6efe0" />
    </pattern>
    <pattern id="stripesG" width="44" height="44" patternUnits="userSpaceOnUse">
      <rect width="22" height="44" fill="#3e7c6a" /><rect x="22" width="22" height="44" fill="#f6efe0" />
    </pattern>
    <pattern id="soil" width="90" height="90" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="24" r="6" fill="#8a6440" /><circle cx="64" cy="60" r="9" fill="#8a6440" /><circle cx="70" cy="18" r="4" fill="#a07650" /><circle cx="30" cy="72" r="4" fill="#a07650" />
    </pattern>
  </defs>
);
// over every frame: the paper's grain and mottling, a light from above, darker corners
export const Finish: React.FC = () => (
  <g pointerEvents="none">
    <rect width={W} height={H} filter="url(#mottle)" opacity={0.10} style={{mixBlendMode: 'multiply'}} />
    <rect width={W} height={H} filter="url(#grain)" opacity={0.13} style={{mixBlendMode: 'multiply'}} />
    <rect width={W} height={H} fill="url(#lamp)" />
    <rect width={W} height={H} fill="url(#vig)" />
  </g>
);
export const Shadow: React.FC<{x: number; y: number; w: number; o?: number}> = ({x, y, w, o = 0.24}) => (
  <ellipse cx={x} cy={y} rx={w / 2} ry={w * 0.085} fill="#3a2a14" opacity={o} filter="url(#blur8)" />
);
export const Paper: React.FC<{c?: string; y0?: number; y1?: number}> = ({c = '#efe5cc', y0 = 0, y1 = H}) => <rect x={0} y={y0} width={W} height={y1 - y0} fill={c} />;
export const Sky: React.FC<{top?: string; bottom?: string; y1?: number}> = ({top = '#a9cfe6', bottom = '#e8f1ec', y1 = H}) => {
  const id = 'sky' + top.slice(1) + bottom.slice(1);
  return (<g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={top} /><stop offset="1" stopColor={bottom} /></linearGradient></defs><rect width={W} height={y1} fill={`url(#${id})`} /></g>);
};
export const Cloud: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#fbfdfc'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.95}>
    <path d="M -150 30 C -170 -10, -120 -40, -90 -26 C -80 -70, -10 -80, 10 -44 C 30 -80, 110 -70, 110 -24 C 160 -30, 180 20, 140 30 Z" fill={c} stroke={INK} strokeWidth={4} strokeOpacity={0.35} />
  </g>
);

// ---------- text ----------
const charW = (ch: string) => (/[ -~]/.test(ch) ? 0.58 : 1.0);
export const textWidth = (s: string, size: number) => [...s.replace(/[{}]/g, '')].reduce((w, ch) => w + charW(ch), 0) * size;
// "ひとつの{ウソ}から" → spans, the ones in braces red
const spans = (text: string) => text.split(/(\{[^}]*\})/).filter(Boolean).map(p => (p[0] === '{' ? {s: p.slice(1, -1), red: true} : {s: p, red: false}));
// A label: its box springs in at a, its text is typed from a to b (no b: all of it at once)
export const Label: React.FC<{t: number; text: string; x: number; y: number; size: number; a: number; b?: number; font?: string; fill?: string; color?: string; bold?: boolean; rot?: number; still?: boolean}> = ({t, text, x, y, size, a, b, font = HAND, fill = '#fbf6ea', color = INK, bold, rot = 0, still}) => {
  if (t < a - 0.12) return null;
  const full = text.replace(/[{}]/g, '');
  const w = textWidth(text, size) + size * 0.9, h = size * 1.62;
  const k = still ? 1 : pop(t, a - 0.12, 220);
  const n = b == null || still ? [...full].length : Math.ceil([...full].length * clamp((t - a) / Math.max(0.05, b - a)));
  let left = n;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${k})`} filter="url(#dropS)">
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={size * 0.22} fill={fill} stroke={INK} strokeWidth={bold ? 6 : 4.5} />
      <text x={-w / 2 + size * 0.45} y={size * 0.36} fontFamily={font} fontWeight={700} fontSize={size} fill={color}>
        {spans(text).map((p, i) => { const chars = [...p.s]; const shown = chars.slice(0, Math.max(0, left)).join(''); left -= chars.length; return <tspan key={i} fill={p.red ? RED : color}>{shown}</tspan>; })}
      </text>
    </g>
  );
};
export const Tag: React.FC<{t: number; text: string; a: number}> = ({t, text, a}) => {
  const size = 46, w = textWidth(text, size) + size * 0.9;
  return <Label t={t} text={text} x={60 + w / 2} y={150} size={size} a={a} b={a + 0.25} fill="#f3ead2" />;
};
// a red rubber stamp thumped on at a
export const Stamp: React.FC<{t: number; text: string; x: number; y: number; size: number; a: number; rot?: number; fill?: string; color?: string}> = ({t, text, x, y, size, a, rot = -8, fill = 'rgba(251,246,234,0.94)', color = RED}) => {
  if (t < a) return null;
  const p = prog(t, a, 0.16), s = lerp(2.2, 1, easeOut(p));
  const w = textWidth(text, size) + size * 0.8, h = size * 1.5;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={clamp(p * 1.6)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={fill} stroke={color} strokeWidth={size * 0.1} rx={8} />
      <rect x={-w / 2 + size * 0.13} y={-h / 2 + size * 0.13} width={w - size * 0.26} height={h - size * 0.26} fill="none" stroke={color} strokeWidth={size * 0.04} rx={5} />
      <text x={0} y={size * 0.36} textAnchor="middle" fontFamily={MARK} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

// ---------- people ----------
type Mood = 'ok' | 'smile' | 'laugh' | 'stern' | 'wow' | 'sad' | 'doubt';
export type PersonProps = {
  x: number; y: number; s?: number; flip?: boolean; t?: number; id?: string;
  suit?: string; pants?: string; tie?: string; shirt?: string; hair?: string; hairStyle?: 'part' | 'grey' | 'short' | 'none';
  hat?: 'bowler' | 'boater' | null; hatColor?: string; glasses?: boolean; mustache?: boolean; mood?: Mood;
  armL?: [number, number]; armR?: [number, number]; legs?: [number, number]; lean?: number; look?: number; bob?: number;
  noShadow?: boolean; holdR?: React.ReactNode; holdL?: React.ReactNode; vest?: boolean; pointR?: boolean;
};
const rad = (d: number) => (d * Math.PI) / 180;
// arms and legs: angles in degrees from straight down, positive away from the body (for an arm) or forward (for a leg)
const limb = (sx: number, sy: number, side: number, a1: number, a2: number, l1: number, l2: number) => {
  const ex = sx + Math.sin(rad(a1)) * l1 * side, ey = sy + Math.cos(rad(a1)) * l1;
  const hx = ex + Math.sin(rad(a2)) * l2 * side, hy = ey + Math.cos(rad(a2)) * l2;
  return {ex, ey, hx, hy};
};
export const Person: React.FC<PersonProps> = (p) => {
  const {x, y, s = 1, flip, t = 0, id = 'p', suit = '#33415e', pants = '#2a3350', tie = '#b3372b', shirt = '#fbfaf4', hair = '#2b2622', hairStyle = 'part', hat = null, hatColor = '#2b2826', glasses, mustache, mood = 'ok', armL = [12, 8], armR = [12, 8], legs = [4, -4], lean = 0, look = 0, bob = 0, noShadow, holdR, holdL, vest, pointR} = p;
  const blink = mood !== 'laugh' && blinkAt(t, id);
  const arm = (side: number, a: [number, number], key: string, hold?: React.ReactNode, point?: boolean) => {
    const {ex, ey, hx, hy} = limb(70 * side, -424, side, a[0], a[1], 104, 94);
    return (
      <g key={key}>
        <polyline points={`${70 * side},-424 ${ex},${ey} ${hx},${hy}`} fill="none" stroke={INK} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={`${70 * side},-424 ${ex},${ey} ${hx},${hy}`} fill="none" stroke={suit} strokeWidth={36} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={hx} cy={hy} r={13} fill={shirt} stroke={INK} strokeWidth={3} />
        {hold ? <g transform={`translate(${hx} ${hy})`}>{hold}</g> : null}
        {point && <line x1={hx} y1={hy} x2={hx + Math.sin(rad(a[1])) * 44 * side} y2={hy + Math.cos(rad(a[1])) * 44} stroke={INK} strokeWidth={17} strokeLinecap="round" />}
        {point && <line x1={hx} y1={hy} x2={hx + Math.sin(rad(a[1])) * 44 * side} y2={hy + Math.cos(rad(a[1])) * 44} stroke={SKIN} strokeWidth={9} strokeLinecap="round" />}
        <circle cx={hx + Math.sin(rad(a[1])) * 10 * side} cy={hy + Math.cos(rad(a[1])) * 10} r={20} fill={SKIN} stroke={INK} strokeWidth={4} />
      </g>
    );
  };
  const leg = (side: number, a: number, key: string) => {
    const {ex, ey, hx, hy} = limb(28 * side, -246, 1, a, a * 0.4, 116, 108);
    return (
      <g key={key}>
        <polyline points={`${28 * side},-246 ${ex},${ey} ${hx},${hy}`} fill="none" stroke={INK} strokeWidth={52} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={`${28 * side},-246 ${ex},${ey} ${hx},${hy}`} fill="none" stroke={pants} strokeWidth={42} strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${hx - 22} ${hy + 4} Q ${hx - 24} ${hy - 22} ${hx} ${hy - 20} L ${hx + 26} ${hy - 12} Q ${hx + 42} ${hy - 2} ${hx + 34} ${hy + 6} Z`} fill="#2b2420" stroke={INK} strokeWidth={4} />
      </g>
    );
  };
  // the face
  const eyes = () => {
    if (mood === 'laugh') return <path d="M -40 -526 Q -27 -540 -14 -526 M 14 -526 Q 27 -540 40 -526" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
    if (blink) return <path d="M -40 -524 H -14 M 14 -524 H 40" stroke={INK} strokeWidth={6} strokeLinecap="round" />;
    const r = mood === 'wow' ? 16 : 13;
    return (
      <g>
        {[-27, 27].map(ex => <ellipse key={ex} cx={ex} cy={-524} rx={r * 0.9} ry={r} fill="#fff" stroke={INK} strokeWidth={3.5} />)}
        {[-27, 27].map(ex => <circle key={'p' + ex} cx={ex + look} cy={-522} r={mood === 'wow' ? 6 : 7} fill={INK} />)}
      </g>
    );
  };
  const brows = {
    ok: 'M -42 -552 Q -27 -560 -12 -552 M 12 -552 Q 27 -560 42 -552', smile: 'M -42 -552 Q -27 -562 -12 -552 M 12 -552 Q 27 -562 42 -552',
    laugh: 'M -42 -556 Q -27 -566 -12 -556 M 12 -556 Q 27 -566 42 -556', stern: 'M -44 -560 L -12 -548 M 44 -560 L 12 -548',
    wow: 'M -44 -566 Q -27 -580 -10 -566 M 10 -566 Q 27 -580 44 -566', sad: 'M -42 -548 L -12 -558 M 42 -548 L 12 -558', doubt: 'M -42 -552 H -12 M 12 -566 L 42 -558',
  }[mood];
  const my = mustache ? 8 : 0;
  const mouth = () => {
    if (mood === 'laugh') return <g><path d={`M -30 ${-482 + my} Q 0 ${-430 + my} 30 ${-482 + my} Z`} fill="#7a2a22" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" /><path d={`M -14 ${-458 + my} Q 0 ${-446 + my} 14 ${-458 + my} Q 0 ${-466 + my} -14 ${-458 + my} Z`} fill="#e88a7c" /></g>;
    if (mood === 'wow') return <ellipse cx={0} cy={-470 + my} rx={11} ry={15} fill="#7a2a22" stroke={INK} strokeWidth={4} />;
    if (mood === 'stern') return <path d={`M -18 ${-472 + my} L 18 ${-474 + my}`} stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    if (mood === 'sad') return <path d={`M -20 ${-466 + my} Q 0 ${-482 + my} 20 ${-466 + my}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    if (mood === 'doubt') return <path d={`M -18 ${-470 + my} Q 0 ${-478 + my} 20 ${-468 + my}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
    return <path d={`M -22 ${-480 + my} Q 0 ${-458 + my} 22 ${-480 + my}`} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />;
  };
  const hairPath = () => {
    if (hairStyle === 'part') return <path d="M -76 -520 C -82 -612, 80 -618, 76 -520 C 70 -548, 50 -566, 8 -566 L 0 -548 L -10 -566 C -44 -566, -68 -550, -76 -520 Z" fill={hair} stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />;
    if (hairStyle === 'short') return <path d="M -76 -522 C -80 -606, 78 -608, 76 -522 C 60 -560, -60 -560, -76 -522 Z" fill={hair} stroke={INK} strokeWidth={4.5} />;
    if (hairStyle === 'grey') return <g><path d="M -76 -506 C -86 -548, -70 -576, -48 -580 C -60 -560, -66 -536, -64 -506 Z" fill="#d8d6d0" stroke={INK} strokeWidth={4} /><path d="M 76 -506 C 86 -548, 70 -576, 48 -580 C 60 -560, 66 -536, 64 -506 Z" fill="#d8d6d0" stroke={INK} strokeWidth={4} /><path d="M -30 -590 Q 0 -600 30 -590" fill="none" stroke="#bdbab2" strokeWidth={5} /></g>;
    return null;
  };
  const hatPath = () => {
    if (hat === 'bowler') return <g><path d="M -64 -566 C -66 -656, 66 -656, 64 -566 Z" fill={hatColor} stroke={INK} strokeWidth={4.5} /><rect x={-64} y={-584} width={128} height={14} fill="#4a4540" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={-566} rx={94} ry={15} fill={hatColor} stroke={INK} strokeWidth={4.5} /></g>;
    if (hat === 'boater') return <g><rect x={-62} y={-616} width={124} height={50} rx={6} fill="#e9d59a" stroke={INK} strokeWidth={4.5} /><rect x={-62} y={-590} width={124} height={16} fill="#2b3a5a" stroke={INK} strokeWidth={3} /><ellipse cx={0} cy={-566} rx={98} ry={14} fill="#e9d59a" stroke={INK} strokeWidth={4.5} /></g>;
    return null;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {!noShadow && <ellipse cx={0} cy={4} rx={96} ry={16} fill="#3a2a14" opacity={0.22} />}
      <g transform={`rotate(${lean} 0 -246)`}>
        {leg(-1, legs[0], 'll')}{leg(1, legs[1], 'lr')}
        <g transform={`translate(0 ${bob})`}>
          {arm(-1, armL, 'al', holdL)}
          {/* the jacket */}
          <path d="M -74 -440 C -90 -360, -84 -280, -70 -214 L 70 -214 C 84 -280, 90 -360, 74 -440 C 30 -462, -30 -462, -74 -440 Z" fill={suit} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
          <path d="M -30 -452 L 0 -356 L 30 -452 Z" fill={shirt} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {vest && <path d="M -22 -420 L 0 -356 L 22 -420 L 26 -300 L -26 -300 Z" fill="#5a4636" stroke={INK} strokeWidth={3.5} />}
          <path d="M -10 -446 L 10 -446 L 14 -388 L 0 -360 L -14 -388 Z" fill={tie} stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <path d="M -32 -452 L -6 -330 M 32 -452 L 6 -330" stroke={INK} strokeWidth={4} fill="none" />
          <circle cx={0} cy={-312} r={6} fill={INK} /><circle cx={0} cy={-270} r={6} fill={INK} />
          <path d="M -56 -320 L -30 -320" stroke={INK} strokeWidth={3.5} />
          {arm(1, armR, 'ar', holdR, pointR)}
          {/* the head */}
          <rect x={-18} y={-470} width={36} height={30} fill={SKIN} stroke={INK} strokeWidth={4} />
          <ellipse cx={-72} cy={-516} rx={13} ry={19} fill={SKIN} stroke={INK} strokeWidth={4} />
          <ellipse cx={72} cy={-516} rx={13} ry={19} fill={SKIN} stroke={INK} strokeWidth={4} />
          <ellipse cx={0} cy={-520} rx={74} ry={78} fill={SKIN} stroke={INK} strokeWidth={5} />
          {hairPath()}
          <circle cx={-46} cy={-490} r={12} fill="#f08f80" opacity={0.35} /><circle cx={46} cy={-490} r={12} fill="#f08f80" opacity={0.35} />
          {eyes()}
          <path d={brows} fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <path d="M -3 -510 Q 8 -500 -1 -494" fill="none" stroke={INK} strokeWidth={4} strokeLinecap="round" />
          {glasses && <g fill="rgba(255,255,255,0.12)" stroke={INK} strokeWidth={4.5}><circle cx={-27} cy={-524} r={23} /><circle cx={27} cy={-524} r={23} /><path d="M -4 -526 Q 0 -530 4 -526 M -50 -528 L -70 -532 M 50 -528 L 70 -532" fill="none" /></g>}
          {mustache && <path d="M -30 -486 Q -14 -500 0 -490 Q 14 -500 30 -486 Q 14 -482 0 -485 Q -14 -482 -30 -486 Z" fill={hair === '#2b2622' ? '#2b2622' : '#8d8a84'} stroke={INK} strokeWidth={2.5} />}
          {mouth()}
          {hatPath()}
        </g>
      </g>
    </g>
  );
};

// ---------- buildings, streets ----------
// a western brick shop of old Ginza: (x, y) its foot on the left, sign = the hanging board's text (vertical)
export const Shop: React.FC<{x: number; y: number; w: number; h: number; c: string; trim?: string; sign?: string; signC?: string; awning?: string; floors?: number; lit?: boolean}> = ({x, y, w, h, c, trim = '#efe3c6', sign, signC = '#fbf6ea', awning = 'url(#stripes)', floors = 2, lit}) => {
  const fh = (h - 60) / floors, win = Math.max(2, Math.floor(w / 110));
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={0} y={-h} width={w} height={h} fill={c} stroke={INK} strokeWidth={5} />
      <rect x={0} y={-h} width={w} height={h} fill="url(#bricks)" />
      <rect x={-10} y={-h - 26} width={w + 20} height={30} fill={trim} stroke={INK} strokeWidth={4.5} />
      {Array.from({length: Math.floor((w + 10) / 26)}).map((_, i) => <rect key={i} x={-4 + i * 26} y={-h + 4} width={12} height={12} fill={trim} stroke={INK} strokeWidth={2} />)}
      {Array.from({length: floors - 1}).map((_, f) => Array.from({length: win}).map((_, i) => {
        const wx = (w / win) * (i + 0.5) - 26, wy = -h + 40 + f * fh;
        return (<g key={f + '-' + i}>
          <path d={`M ${wx} ${wy + 100} V ${wy + 26} Q ${wx + 26} ${wy - 6} ${wx + 52} ${wy + 26} V ${wy + 100} Z`} fill={lit ? '#ffe9a8' : '#4f6a80'} stroke={trim} strokeWidth={6} />
          <path d={`M ${wx} ${wy + 100} V ${wy + 26} Q ${wx + 26} ${wy - 6} ${wx + 52} ${wy + 26} V ${wy + 100} Z`} fill="none" stroke={INK} strokeWidth={3} />
          <path d={`M ${wx + 4} ${wy + 30} Q ${wx + 18} ${wy + 60} ${wx + 6} ${wy + 96} Z`} fill="#f3ead2" opacity={0.85} />
          <rect x={wx - 6} y={wy + 100} width={64} height={10} fill={trim} stroke={INK} strokeWidth={2.5} />
        </g>);
      }))}
      {/* the shop on the ground floor */}
      <rect x={16} y={-fh + 20} width={w - 32} height={fh - 20} fill="#3a3330" stroke={INK} strokeWidth={4} />
      <rect x={28} y={-fh + 36} width={w * 0.55} height={fh - 56} fill="#d9e8ea" stroke={INK} strokeWidth={3} />
      <rect x={w * 0.66} y={-fh + 36} width={w * 0.24} height={fh - 36} fill="#6b4a32" stroke={INK} strokeWidth={3} />
      <path d={`M 6 ${-fh + 18} L ${w - 6} ${-fh + 18} L ${w + 14} ${-fh + 70} L -14 ${-fh + 70} Z`} fill={awning} stroke={INK} strokeWidth={4} />
      {sign && (<g transform={`translate(${w - 34} ${-h + 60})`} filter="url(#dropS)">
        <rect x={-30} y={0} width={60} height={[...sign].length * 54 + 30} fill={signC} stroke={INK} strokeWidth={4} />
        {[...sign].map((ch, i) => <text key={i} x={0} y={52 + i * 54} textAnchor="middle" fontFamily={MARK} fontSize={46} fill={INK}>{ch}</text>)}
      </g>)}
    </g>
  );
};
export const Street: React.FC<{y: number; h?: number}> = ({y, h = 220}) => (
  <g>
    <rect x={0} y={y} width={W} height={40} fill="#cfc3a8" stroke={INK} strokeWidth={4} />
    <rect x={0} y={y + 40} width={W} height={h - 40} fill="#b9b0a0" />
    <path d={`M 0 ${y + 40} H ${W}`} stroke={INK} strokeWidth={3} />
    {[0.38, 0.62].map(f => <path key={f} d={`M 0 ${y + 40 + (h - 40) * f} H ${W}`} stroke="#8d877c" strokeWidth={6} />)}
  </g>
);
export const Lamp: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-7} y={-300} width={14} height={300} fill="#3a4040" stroke={INK} strokeWidth={3} />
    <path d="M -26 -300 L 26 -300 L 18 -350 L -18 -350 Z" fill="#fff3c2" stroke={INK} strokeWidth={4} />
    <path d="M -30 -350 L 30 -350 L 0 -374 Z" fill="#3a4040" stroke={INK} strokeWidth={4} />
  </g>
);
// a Tokyo streetcar of the 1920s, its front to the right
export const Tram: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 160 -230 L 230 -330 M 190 -230 L 250 -330" stroke={INK} strokeWidth={4} />
    <rect x={0} y={-236} width={430} height={22} rx={8} fill="#7a6a58" stroke={INK} strokeWidth={4} />
    <rect x={0} y={-214} width={430} height={86} fill="#efe3c0" stroke={INK} strokeWidth={4.5} />
    {Array.from({length: 6}).map((_, i) => <rect key={i} x={24 + i * 66} y={-202} width={48} height={60} fill="#cfe6f0" stroke={INK} strokeWidth={3} />)}
    <rect x={0} y={-128} width={430} height={88} fill="#3e7c6a" stroke={INK} strokeWidth={4.5} />
    <rect x={0} y={-40} width={430} height={14} fill="#2b2826" />
    {[80, 350].map(wx => <circle key={wx} cx={wx} cy={-18} r={22} fill="#3a3a3a" stroke={INK} strokeWidth={4} />)}
  </g>
);

// ---------- the trains ----------
// the first car of the Tokyo subway (yellow), its back at x, its rail at y, its front to the right
export const Car: React.FC<{x: number; y: number; s?: number; body?: string; roof?: string; lit?: boolean; open?: number; people?: boolean; light?: boolean; id?: string}> = ({x, y, s = 1, body = '#f0c23a', roof = '#5b4a3c', lit = true, open = 0, people = true, light = true, id = 'c'}) => {
  const Lc = 640, doors = [118, 300, 482];
  const windows: number[] = [24, 68, 198, 242, 380, 424, 562];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {light && <path d={`M ${Lc - 8} -236 L ${Lc + 520} -330 L ${Lc + 520} -110 Z`} fill="url(#beam)" opacity={0.75} />}
      {[60, 128, 512, 580].map(wx => <g key={wx}><circle cx={wx} cy={-22} r={26} fill="#3b3b3d" stroke={INK} strokeWidth={4} /><circle cx={wx} cy={-22} r={8} fill="#9a9894" /></g>)}
      <rect x={34} y={-58} width={120} height={22} rx={6} fill="#2e2d2c" /><rect x={486} y={-58} width={120} height={22} rx={6} fill="#2e2d2c" />
      <path d={`M 0 -262 Q 0 -290 30 -292 L ${Lc - 34} -292 Q ${Lc} -290 ${Lc} -262 Z`} fill={roof} stroke={INK} strokeWidth={5} />
      <path d={`M 0 -264 L ${Lc - 24} -264 Q ${Lc} -264 ${Lc} -240 L ${Lc} -76 Q ${Lc} -56 ${Lc - 20} -56 L 0 -56 Z`} fill={body} stroke={INK} strokeWidth={5} />
      <path d={`M 0 -120 H ${Lc}`} stroke="#c49a22" strokeWidth={6} />
      {windows.map(wx => (
        <g key={wx}>
          <rect x={wx} y={-226} width={38} height={70} rx={5} fill={lit ? '#fff2c4' : '#bcd6df'} stroke={INK} strokeWidth={3.5} />
          {people && lit && hash(id + wx) > 0.35 && <g><circle cx={wx + 19} cy={-176} r={11} fill="#5a4a3e" /><path d={`M ${wx + 4} -156 Q ${wx + 19} -176 ${wx + 34} -156 Z`} fill="#5a4a3e" /></g>}
        </g>
      ))}
      {doors.map((dx, i) => (
        <g key={dx}>
          <rect x={dx} y={-238} width={64} height={182} fill={open > 0 && i === 1 ? '#2a2620' : body} stroke={INK} strokeWidth={4} />
          {!(open > 0 && i === 1) && <g><rect x={dx + 8} y={-224} width={20} height={64} rx={3} fill={lit ? '#fff2c4' : '#bcd6df'} stroke={INK} strokeWidth={3} /><rect x={dx + 36} y={-224} width={20} height={64} rx={3} fill={lit ? '#fff2c4' : '#bcd6df'} stroke={INK} strokeWidth={3} /><path d={`M ${dx + 32} -238 V -56`} stroke={INK} strokeWidth={3} /></g>}
          {open > 0 && i === 1 && <g>{[0, 1].map(k => <rect key={k} x={k ? dx + 64 - 6 : dx - 6} y={-238} width={12} height={182} fill={body} stroke={INK} strokeWidth={3} />)}</g>}
        </g>
      ))}
      <rect x={Lc - 52} y={-226} width={40} height={70} rx={6} fill={lit ? '#fff2c4' : '#bcd6df'} stroke={INK} strokeWidth={3.5} />
      <ellipse cx={Lc - 4} cy={-278} rx={14} ry={10} fill="#fff6c8" stroke={INK} strokeWidth={3} />
      {light && <circle cx={Lc - 4} cy={-278} r={36} fill="url(#glow)" />}
    </g>
  );
};
// a 0-series Shinkansen is not needed here; London's tube train: dark red, a lower roof
export const Tube: React.FC<{x: number; y: number; s?: number}> = ({x, y, s = 1}) => <Car x={x} y={y} s={s} body="#8e2f2a" roof="#3a2a26" id="tube" />;

// a box tunnel of the Ginza line kind: lamps on its roof, steel columns, a rail
export const Tunnel: React.FC<{y1: number; y2: number}> = ({y1, y2}) => (
  <g>
    <defs><linearGradient id={'tn' + y1} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3e3b44" /><stop offset="1" stopColor="#24222a" /></linearGradient></defs>
    <rect x={0} y={y1} width={W} height={y2 - y1} fill={`url(#tn${y1})`} />
    <rect x={0} y={y1} width={W} height={18} fill="#6e6a72" stroke={INK} strokeWidth={4} />
    <rect x={0} y={y2 - 16} width={W} height={16} fill="#6e6a72" stroke={INK} strokeWidth={4} />
    {[120, 360, 600, 840].map(lx => <g key={lx}><circle cx={lx} cy={y1 + 44} r={70} fill="url(#glow)" opacity={0.55} /><rect x={lx - 16} y={y1 + 18} width={32} height={16} fill="#8a8690" /><ellipse cx={lx} cy={y1 + 42} rx={16} ry={10} fill="#fff3c2" stroke={INK} strokeWidth={3} /></g>)}
    {[0, 1, 2].map(k => <path key={k} d={`M 0 ${y1 + 70 + k * 12} H ${W}`} stroke="#55525c" strokeWidth={5} />)}
    <rect x={0} y={y2 - 38} width={W} height={22} fill="#4a4640" />
    {Array.from({length: 24}).map((_, i) => <rect key={i} x={i * 48 + 6} y={y2 - 34} width={28} height={12} fill="#6d5236" />)}
    <path d={`M 0 ${y2 - 38} H ${W}`} stroke="#b9b6ae" strokeWidth={6} />
  </g>
);
export const Columns: React.FC<{y1: number; y2: number; xs: number[]}> = ({y1, y2, xs}) => (
  <g>{xs.map(cx => <g key={cx}><rect x={cx - 16} y={y1 + 18} width={32} height={y2 - y1 - 34} fill="#3a4a4c" stroke={INK} strokeWidth={4} /><rect x={cx - 30} y={y1 + 18} width={60} height={14} fill="#2f3c3e" stroke={INK} strokeWidth={3} /><rect x={cx - 30} y={y2 - 30} width={60} height={14} fill="#2f3c3e" stroke={INK} strokeWidth={3} /></g>)}</g>
);
export const Soil: React.FC<{y1: number; y2: number}> = ({y1, y2}) => (
  <g>
    <rect x={0} y={y1} width={W} height={y2 - y1} fill="#b9895a" />
    <rect x={0} y={y1} width={W} height={y2 - y1} fill="url(#soil)" opacity={0.55} />
    <path d={`M 0 ${y1 + (y2 - y1) * 0.45} C 200 ${y1 + (y2 - y1) * 0.38}, 420 ${y1 + (y2 - y1) * 0.55}, 700 ${y1 + (y2 - y1) * 0.44} S 1000 ${y1 + (y2 - y1) * 0.5}, 1080 ${y1 + (y2 - y1) * 0.42}`} stroke="#a3784c" strokeWidth={8} fill="none" />
  </g>
);

// ---------- things ----------
export const Calendar: React.FC<{x: number; y: number; s?: number; year: string; top?: string}> = ({x, y, s = 1, year, top}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#drop)">
    <rect x={-170} y={-160} width={340} height={330} rx={10} fill="#fbf7ee" stroke={INK} strokeWidth={6} />
    <path d="M -170 -86 V -150 Q -170 -160 -160 -160 H 160 Q 170 -160 170 -150 V -86 Z" fill="#c9372b" stroke={INK} strokeWidth={6} />
    {[-96, 96].map(rx => <rect key={rx} x={rx - 9} y={-190} width={18} height={56} rx={9} fill="#6d6b68" stroke={INK} strokeWidth={4} />)}
    {top && <text x={0} y={-104} textAnchor="middle" fontFamily={MARK} fontSize={48} fill="#fbf7ee">{top}</text>}
    <text x={0} y={top ? 92 : 86} textAnchor="middle" fontFamily={MARK} fontSize={year.length > 4 ? 90 : 130} fill={INK}>{year}</text>
  </g>
);
export const Medal: React.FC<{x: number; y: number; s: number; text: string; t: number}> = ({x, y, s, text, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#drop)">
    <path d="M -70 50 L -118 220 L -58 180 L -16 232 L 4 70 Z" fill="#c9372b" stroke={INK} strokeWidth={5} />
    <path d="M 70 50 L 118 220 L 58 180 L 16 232 L -4 70 Z" fill="#2f5fa8" stroke={INK} strokeWidth={5} />
    {Array.from({length: 12}).map((_, i) => { const a = (i / 12) * Math.PI * 2 + t * 0.6; return <path key={i} d={`M ${Math.cos(a) * 140} ${Math.sin(a) * 140} L ${Math.cos(a) * 190} ${Math.sin(a) * 190}`} stroke="#f0a020" strokeWidth={9} strokeLinecap="round" />; })}
    <circle r={128} fill="#f3c440" stroke={INK} strokeWidth={6} />
    <circle r={100} fill="none" stroke="#b8860b" strokeWidth={5} strokeDasharray="10 9" />
    <text y={24} textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#6e4310">{text}</text>
  </g>
);
export const Pin: React.FC<{x: number; y: number; s?: number; c?: string}> = ({x, y, s = 1, c = '#d6453a'}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} filter="url(#drop)">
    <path d="M 0 0 C -44 -58, -48 -80, -48 -100 C -48 -160, 48 -160, 48 -100 C 48 -80, 44 -58, 0 0 Z" fill={c} stroke={INK} strokeWidth={5} />
    <circle cx={0} cy={-102} r={20} fill="#fbf6ea" stroke={INK} strokeWidth={4} />
  </g>
);
export const Bulb: React.FC<{x: number; y: number; s: number; t: number}> = ({x, y, s, t}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-20} r={150} fill="url(#glow)" opacity={0.7 + Math.sin(t * 9) * 0.2} />
    {Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2 + 0.2; return <path key={i} d={`M ${Math.cos(a) * 96} ${-20 + Math.sin(a) * 96} L ${Math.cos(a) * 132} ${-20 + Math.sin(a) * 132}`} stroke="#f0a020" strokeWidth={9} strokeLinecap="round" />; })}
    <path d="M -40 30 C -80 -10, -66 -86, 0 -86 C 66 -86, 80 -10, 40 30 Z" fill="#f8d24a" stroke={INK} strokeWidth={5} />
    <rect x={-34} y={28} width={68} height={44} rx={8} fill="#a9a9ad" stroke={INK} strokeWidth={5} />
    <path d="M -16 -6 L -2 -40 L 6 -8 L 18 -38" fill="none" stroke="#c9772a" strokeWidth={5} strokeLinecap="round" />
  </g>
);
export const Haha: React.FC<{x: number; y: number; t: number; a: number; rot?: number; s?: number}> = ({x, y, t, a, rot = 0, s = 1}) => {
  const k = pop(t, a, 240);
  if (k <= 0) return null;
  return <g transform={`translate(${x} ${y + Math.sin(t * 12) * 5}) rotate(${rot}) scale(${k * s})`}><text textAnchor="middle" fontFamily={MARK} fontSize={72} fill="#e0702a" stroke="#fbf6ea" strokeWidth={14} paintOrder="stroke">ハハハ</text></g>;
};
