// Bộ khung hình của video mẹo xe: nền bảng xanh, khung ảnh, chữ, thẻ xếp hạng, đồ họa vẽ bằng code.
import React from 'react';
import { AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';

export const W = 1080;
export const H = 1920;
// Khung ảnh
export const P = { x: 40, y: 290, w: 1000, h: 1000 };
// Không đặt chữ quan trọng ở x > 940 hay y > 1560 (nút và chữ của TikTok).
export const FONT = '"Noto Sans JP", sans-serif';

export const C = {
  board: '#24493b',
  boardDark: '#183429',
  red: '#e8202a',
  green: '#10b84c',
  gold: '#f6c445',
  navy: '#1c2a6b',
  ink: '#111',
  ice: '#9fd8ff',
};

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

/** Nảy vào: 0 → 1 từ frame `from`. */
export const usePop = (from: number, damping = 12) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - from, fps, config: { damping, stiffness: 180, mass: 0.6 } });
};

/** Nền bảng xanh có vân phấn và góc tối. */
export const Board: React.FC = () => (
  <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 35%, ${C.board} 0%, ${C.boardDark} 100%)` }}>
    <svg width={W} height={H} style={{ position: 'absolute', opacity: 0.18 }}>
      <filter id="chalk">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
        <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0" />
      </filter>
      <rect width={W} height={H} filter="url(#chalk)" />
    </svg>
    {/* vệt phấn trang trí */}
    <svg width={W} height={H} style={{ position: 'absolute', opacity: 0.12 }}>
      <path d="M60 1300 C 300 1280, 700 1320, 1020 1290" stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M80 1620 C 380 1600, 640 1640, 980 1610" stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />
    </svg>
  </AbsoluteFill>
);

/** Thẻ mục ở góc trên trái (ví dụ 「第3位｜お湯」). */
export const SectionTag: React.FC<{ text: string }> = ({ text }) => {
  const p = usePop(0, 16);
  return (
    <div
      style={{
        position: 'absolute', left: 40, top: 196, height: 76, display: 'flex', alignItems: 'center',
        background: 'rgba(10,20,16,0.85)', border: '3px solid rgba(255,255,255,0.35)', borderRadius: 14,
        padding: '0 30px 0 20px', transform: `translateX(${(1 - p) * -60}px)`, opacity: p,
      }}
    >
      <div style={{ width: 12, height: 44, background: '#ff7a1a', borderRadius: 4, marginRight: 18 }} />
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 44, color: '#fff' }}>{text}</span>
    </div>
  );
};

/** Ảnh thật trong khung, zoom chậm (Ken Burns). */
export const Photo: React.FC<{
  src: string; dur: number; focus?: [number, number]; zoom?: [number, number]; pan?: number; tint?: string; blur?: number; lift?: number;
}> = ({ src, dur, focus = [0.5, 0.5], zoom = [1.04, 1.14], pan = 0, tint, blur = 0, lift = 0 }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, dur], [0, 1], clamp);
  const ease = Easing.out(Easing.quad)(k);
  const z = zoom[0] + (zoom[1] - zoom[0]) * ease;
  const enter = interpolate(f, [0, 6], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 26, overflow: 'hidden', boxShadow: '0 18px 40px rgba(0,0,0,0.45)', opacity: enter }}>
      <Img
        src={staticFile(`images/${src}`)}
        style={{
          width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`,
          transform: `translateY(${-lift}px) scale(${z}) translateX(${pan * ease}px)`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%`,
          filter: blur ? `blur(${blur}px) brightness(0.7)` : undefined,
        }}
      />
      {tint && <AbsoluteFill style={{ background: tint }} />}
      {/* bóng tối nhẹ ở đáy để chữ lớn dễ đọc */}
      <AbsoluteFill style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0) 62%, rgba(0,0,0,0.45) 100%)' }} />
    </div>
  );
};

/** Ô trắng bo góc ở trên ảnh, chữ đỏ (NG) hoặc xanh (cách đúng). */
export const Pill: React.FC<{ text: string; color?: string; x?: number; y?: number; size?: number }> = ({ text, color = C.red, x = P.x + 30, y = P.y + 30, size = 52 }) => {
  const p = usePop(0, 14);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, background: 'rgba(255,255,255,0.94)', borderRadius: 18,
        padding: '10px 26px 14px', boxShadow: '0 6px 16px rgba(0,0,0,0.3)', maxWidth: 860,
        transform: `scale(${0.6 + 0.4 * p})`, transformOrigin: 'left center', opacity: Math.min(1, p * 1.5),
      }}
    >
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color, letterSpacing: 1 }}>{text}</span>
    </div>
  );
};

/** Nhãn nền xanh navy, chữ vàng (từ khóa, thuật ngữ). */
export const NavyLabel: React.FC<{ text: string; x?: number; y?: number; size?: number }> = ({ text, x = P.x + 30, y = P.y + 140, size = 54 }) => {
  const p = usePop(0, 14);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: y, background: `linear-gradient(${C.navy}, #10184a)`, border: `4px solid ${C.gold}`,
        borderRadius: 14, padding: '8px 26px 12px', opacity: p, transform: `translateY(${(1 - p) * 30}px)`,
      }}
    >
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: size, color: C.gold }}>{text}</span>
    </div>
  );
};

/** Chữ lớn viền đen. `{…}` = tô đỏ. Dòng mới bằng \n. */
export const Impact: React.FC<{ text: string; bottom?: number; size?: number; maxW?: number; hot?: string; align?: 'left' | 'center' }> = ({
  text, bottom = 66, size = 92, maxW = 900, hot = C.red, align = 'left',
}) => {
  const f = useCurrentFrame();
  const rows = text.split('\n');
  return (
    <div style={{ position: 'absolute', left: align === 'center' ? 0 : P.x + 30, width: align === 'center' ? 980 : maxW, bottom: H - (P.y + P.h) + bottom, textAlign: align, whiteSpace: 'nowrap' }}>
      {rows.map((row, r) => {
        const appear = interpolate(f, [r * 4, r * 4 + 7], [0, 1], clamp);
        const parts = row.split(/(\{[^}]*\})/).filter(Boolean);
        return (
          <div key={r} style={{ opacity: appear, transform: `translateY(${(1 - appear) * 24}px) scale(${0.9 + 0.1 * appear})`, transformOrigin: 'left bottom', lineHeight: 1.12 }}>
            {parts.map((part, i) => {
              const isHot = part.startsWith('{');
              const t = isHot ? part.slice(1, -1) : part;
              return (
                <span
                  key={i}
                  style={{
                    fontFamily: FONT, fontWeight: 900, fontSize: size, color: isHot ? hot : '#fff',
                    WebkitTextStroke: isHot ? '0px' : '0px',
                    textShadow: isHot
                      ? '0 0 0 #fff, 4px 4px 0 #fff, -4px -4px 0 #fff, 4px -4px 0 #fff, -4px 4px 0 #fff, 0 5px 0 #fff, 0 -5px 0 #fff, 5px 0 0 #fff, -5px 0 0 #fff, 0 10px 14px rgba(0,0,0,0.5)'
                      : '4px 4px 0 #000, -4px -4px 0 #000, 4px -4px 0 #000, -4px 4px 0 #000, 0 5px 0 #000, 0 -5px 0 #000, 5px 0 0 #000, -5px 0 0 #000, 0 10px 14px rgba(0,0,0,0.5)',
                  }}
                >
                  {t}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

/** Dải phụ đề dưới khung ảnh. */
export const SubtitleBar: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: 0, top: P.y + P.h + 30, width: W, height: 150, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ position: 'absolute', left: 30, right: 30, top: 8, bottom: 8, background: 'rgba(8,14,11,0.82)', borderRadius: 18, borderTop: '3px solid #ff7a1a' }} />
    <div style={{ position: 'relative', width: 880, marginRight: 60, textAlign: 'center', fontFamily: FONT, fontWeight: 700, fontSize: text.length > 15 ? 50 : 56, color: '#fff', lineHeight: 1.25 }}>{text}</div>
  </div>
);

/** Dòng nguồn nhỏ ở đáy ảnh. */
export const Source: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: P.x + 24, top: P.y + P.h - 48, fontFamily: FONT, fontWeight: 700, fontSize: 26, color: '#fff', background: 'rgba(0,0,0,0.55)', padding: '4px 14px', borderRadius: 8 }}>
    出典：{text}
  </div>
);

/** Dấu ✗ đỏ hoặc ◯ xanh rơi xuống. */
export const Stamp: React.FC<{ kind: 'ng' | 'ok'; x: number; y: number; size?: number }> = ({ kind, x, y, size = 220 }) => {
  const p = usePop(0, 9);
  const s = 1.8 - 0.8 * p;
  const col = kind === 'ng' ? C.red : C.green;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, transform: `scale(${s}) rotate(${(1 - p) * -20}deg)`, opacity: Math.min(1, p * 2), filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.45))' }}>
      {kind === 'ng' ? (
        <g stroke={col} strokeWidth={16} strokeLinecap="round">
          <line x1="18" y1="18" x2="82" y2="82" stroke="#fff" strokeWidth={26} />
          <line x1="82" y1="18" x2="18" y2="82" stroke="#fff" strokeWidth={26} />
          <line x1="18" y1="18" x2="82" y2="82" />
          <line x1="82" y1="18" x2="18" y2="82" />
        </g>
      ) : (
        <g fill="none">
          <circle cx="50" cy="50" r="36" stroke="#fff" strokeWidth={24} />
          <circle cx="50" cy="50" r="36" stroke={col} strokeWidth={14} />
        </g>
      )}
    </svg>
  );
};

/** Mũi tên đỏ chỉ vào một điểm (dx, dy: hướng mũi tên đi tới). */
export const Arrow: React.FC<{ x: number; y: number; angle?: number; size?: number }> = ({ x, y, angle = 135, size = 150 }) => {
  const f = useCurrentFrame();
  const p = usePop(0, 10);
  const bob = Math.sin(f / 4) * 10;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, opacity: p, transform: `rotate(${angle}deg) translateX(${bob - (1 - p) * 40}px)`, filter: 'drop-shadow(0 4px 4px rgba(0,0,0,0.5))' }}>
      <path d="M10 42 L62 42 L62 24 L94 50 L62 76 L62 58 L10 58 Z" fill={C.red} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
    </svg>
  );
};

/** Nhân vật que của kênh: mũ bảo hộ cam, cầm que chỉ. */
export const Buddy: React.FC<{ x?: number; y?: number; scale?: number; mood?: 'point' | 'warn' | 'happy' }> = ({ x = 760, y = P.y + 150, scale = 1, mood = 'point' }) => {
  const f = useCurrentFrame();
  const p = usePop(0, 12);
  const sway = Math.sin(f / 9) * 3;
  const arm = mood === 'warn' ? -60 + Math.sin(f / 3) * 8 : -25 + Math.sin(f / 7) * 6;
  return (
    <svg width={200 * scale} height={330 * scale} viewBox="0 0 200 330" style={{ position: 'absolute', left: x, top: y, transform: `translateY(${(1 - p) * 120}px) rotate(${sway}deg)`, transformOrigin: '50% 100%', opacity: p, filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.45))' }}>
      <ellipse cx="100" cy="322" rx="60" ry="8" fill="rgba(0,0,0,0.35)" />
      <g stroke="#111" strokeWidth={7} strokeLinecap="round" fill="none">
        <line x1="100" y1="150" x2="100" y2="250" stroke="#fff" strokeWidth={15} />
        <line x1="100" y1="250" x2="72" y2="318" stroke="#fff" strokeWidth={15} />
        <line x1="100" y1="250" x2="128" y2="318" stroke="#fff" strokeWidth={15} />
        <line x1="100" y1="150" x2="100" y2="250" />
        <line x1="100" y1="250" x2="72" y2="318" />
        <line x1="100" y1="250" x2="128" y2="318" />
        {/* tay trái chống hông */}
        <polyline points="100,175 140,205 112,230" stroke="#fff" strokeWidth={15} />
        <polyline points="100,175 140,205 112,230" />
        {/* tay phải cầm que */}
        <g transform={`rotate(${arm} 100 175)`}>
          <line x1="100" y1="175" x2="40" y2="175" stroke="#fff" strokeWidth={15} />
          <line x1="100" y1="175" x2="40" y2="175" />
          <line x1="42" y1="175" x2="-40" y2="175" stroke="#7a4a1f" strokeWidth={6} />
          <circle cx="-42" cy="175" r="6" fill="#e8202a" stroke="none" />
        </g>
      </g>
      {/* đầu */}
      <circle cx="100" cy="95" r="58" fill="#fff" stroke="#111" strokeWidth={6} />
      {/* mũ bảo hộ cam */}
      <path d="M44 82 A56 56 0 0 1 156 82 Z" fill="#ff7a1a" stroke="#111" strokeWidth={6} strokeLinejoin="round" />
      <rect x="36" y="78" width="128" height="12" rx="6" fill="#ff7a1a" stroke="#111" strokeWidth={5} />
      <rect x="94" y="44" width="12" height="34" rx="5" fill="#ffd2a8" />
      {/* mặt */}
      <circle cx="80" cy="112" r="7" fill="#111" />
      <circle cx="120" cy="112" r="7" fill="#111" />
      {mood === 'warn' ? (
        <ellipse cx="100" cy="136" rx="11" ry="9" fill="#111" />
      ) : (
        <path d="M82 132 Q100 150 118 132" stroke="#111" strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
      <circle cx="68" cy="126" r="8" fill="#ffb3a7" opacity={0.7} />
      <circle cx="132" cy="126" r="8" fill="#ffb3a7" opacity={0.7} />
    </svg>
  );
};

/** Thẻ chuyển cảnh xếp hạng: nền tối, tia sáng cam, chữ 「第N位」 và tên mục. */
export const RankCard: React.FC<{ rank: number; title: string; dur: number }> = ({ rank, title, dur }) => {
  const f = useCurrentFrame();
  const p = usePop(2, 10);
  const t = usePop(12, 14);
  const out = interpolate(f, [dur - 6, dur], [1, 0], clamp);
  const rays = Array.from({ length: 28 }, (_, i) => i);
  return (
    <AbsoluteFill style={{ opacity: out, background: 'radial-gradient(circle at 50% 42%, #23314f 0%, #0b1020 70%)' }}>
      <svg width={W} height={H} style={{ position: 'absolute' }}>
        <g transform={`translate(540 760) rotate(${f * 0.6})`}>
          {rays.map((i) => (
            <path key={i} d={`M0 0 L${Math.cos((i / 28) * Math.PI * 2) * 1400} ${Math.sin((i / 28) * Math.PI * 2) * 1400} L${Math.cos(((i + 0.35) / 28) * Math.PI * 2) * 1400} ${Math.sin(((i + 0.35) / 28) * Math.PI * 2) * 1400} Z`} fill={i % 2 ? 'rgba(255,122,26,0.16)' : 'rgba(255,255,255,0.05)'} />
          ))}
        </g>
        <circle cx={540} cy={760} r={260 + Math.sin(f / 5) * 6} fill="none" stroke="rgba(255,160,60,0.55)" strokeWidth={6} />
      </svg>
      <div style={{ position: 'absolute', top: 600, width: W, textAlign: 'center', transform: `scale(${0.4 + 0.6 * p})`, opacity: p }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 230, color: '#fff', textShadow: '0 0 30px rgba(255,140,40,0.8), 6px 6px 0 #ff7a1a' }}>
          第<span style={{ color: C.gold, fontSize: 290 }}>{rank}</span>位
        </span>
      </div>
      <div style={{ position: 'absolute', top: 1060, left: 60, width: 880, textAlign: 'center', opacity: t, transform: `translateY(${(1 - t) * 40}px)` }}>
        <span style={{ display: 'inline-block', fontFamily: FONT, fontWeight: 900, fontSize: 66, color: '#fff', background: C.red, padding: '10px 34px 16px', borderRadius: 16, lineHeight: 1.25, boxShadow: '0 8px 20px rgba(0,0,0,0.5)' }}>
          {title}
        </span>
      </div>
    </AbsoluteFill>
  );
};

/** Đồng hồ đo khí CO trong xe (đồ họa, số liệu theo thử nghiệm JAF 2021). */
export const COMeter: React.FC<{
  /** giây đồng hồ hiện lúc bắt đầu / lúc kết thúc */ clock: [number, number];
  /** ppm hiện lúc bắt đầu / kết thúc (null = "上限超え") */ ppm: [number, number | null];
  dur: number; y?: number;
}> = ({ clock, ppm, dur, y = P.y + 250 }) => {
  const f = useCurrentFrame();
  const p = usePop(0, 13);
  const k = interpolate(f, [4, dur - 10], [0, 1], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const sec = Math.round(clock[0] + (clock[1] - clock[0]) * k);
  const over = ppm[1] === null && k > 0.92;
  const val = ppm[1] === null ? ppm[0] + (999 - ppm[0]) * k : ppm[0] + (ppm[1] - ppm[0]) * k;
  const shown = over ? '上限超え' : `${Math.round(val)}`;
  const alarm = val >= 50;
  const flash = alarm && Math.floor(f / 5) % 2 === 0;
  const mm = Math.floor(sec / 60);
  const ss = String(sec % 60).padStart(2, '0');
  const bar = Math.min(1, ppm[1] === null ? 0.18 + 0.82 * k : val / 60);
  return (
    <div style={{ position: 'absolute', left: 110, top: y, width: 780, opacity: p, transform: `scale(${0.85 + 0.15 * p})` }}>
      <div style={{ background: 'rgba(12,16,22,0.92)', border: `6px solid ${flash ? C.red : '#5b6472'}`, borderRadius: 30, padding: '26px 36px 30px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: FONT, fontWeight: 700, fontSize: 40, color: '#b8c2d0' }}>
          <span>車内の一酸化炭素</span>
          <span style={{ color: '#fff' }}>⏱ {mm}:{ss}</span>
        </div>
        <div style={{ fontFamily: FONT, fontWeight: 900, fontSize: over ? 120 : 150, color: alarm ? C.red : '#7CFC9A', textAlign: 'center', lineHeight: 1.2, textShadow: alarm ? '0 0 24px rgba(232,32,42,0.7)' : '0 0 20px rgba(124,252,154,0.5)' }}>
          {shown}
          {!over && <span style={{ fontSize: 60, marginLeft: 12 }}>ppm</span>}
        </div>
        <div style={{ position: 'relative', height: 34, background: '#2a313b', borderRadius: 17, overflow: 'hidden', marginTop: 6 }}>
          <div style={{ width: `${bar * 100}%`, height: '100%', background: `linear-gradient(90deg, #36c46a, #f6c445 55%, ${C.red} 85%)` }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 16, height: 70 }}>
          {alarm && (
            <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 54, color: '#fff', background: flash ? C.red : '#8a0f15', padding: '4px 26px 10px', borderRadius: 12 }}>
              {over ? '測定器の上限を超えた' : '⚠ 警報レベル'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/** Vết nứt trên kính, vẽ dần. */
export const Crack: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, 10], [0, 1], clamp);
  const paths = [
    'M0 0 L-90 -40 L-200 -30 L-330 -90 L-430 -70',
    'M0 0 L60 -90 L80 -200 L150 -290',
    'M0 0 L110 30 L240 10 L360 70 L470 60',
    'M0 0 L-40 110 L-120 190 L-140 300',
    'M0 0 L70 120 L60 230',
    'M-200 -30 L-230 40',
    'M240 10 L270 -70',
  ];
  return (
    <svg width={1000} height={700} style={{ position: 'absolute', left: x - 500, top: y - 350, overflow: 'visible' }}>
      <g transform="translate(500 350)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {paths.map((d, i) => (
          <g key={i}>
            <path d={d} stroke="rgba(0,0,0,0.55)" strokeWidth={9} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
            <path d={d} stroke="#fff" strokeWidth={4} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - k} />
          </g>
        ))}
        <circle r={14 * k} fill="#fff" />
      </g>
    </svg>
  );
};

/** Hai khối nóng / lạnh đối nhau: 「お湯」 vs 「凍ったガラス」, giữa là 急な温度差. */
export const TempClash: React.FC<{ y?: number }> = ({ y = P.y + 330 }) => {
  const f = useCurrentFrame();
  const a = usePop(0, 12);
  const b = usePop(5, 12);
  const m = usePop(12, 10);
  const shake = m > 0.9 ? Math.sin(f * 2.2) * 4 : 0;
  const box = (label: string, sub: string, col: string, p: number, left: number) => (
    <div style={{ position: 'absolute', left, top: y, width: 380, height: 300, borderRadius: 30, background: col, border: '6px solid #fff', boxShadow: '0 16px 30px rgba(0,0,0,0.5)', opacity: p, transform: `scale(${0.6 + 0.4 * p}) translateX(${shake}px)`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 92, color: '#fff', textShadow: '0 4px 0 rgba(0,0,0,0.3)' }}>{label}</span>
      <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 46, color: '#fff' }}>{sub}</span>
    </div>
  );
  return (
    <>
      {box('お湯', '♨ 熱い', 'linear-gradient(160deg,#ff8a3d,#e8202a)', a, 70)}
      {box('ガラス', '❄ 氷点下', 'linear-gradient(160deg,#7cc8ff,#2563eb)', b, 530)}
      <div style={{ position: 'absolute', left: 300, top: y + 330, width: 400, textAlign: 'center', opacity: m, transform: `scale(${0.5 + 0.5 * m})` }}>
        <span style={{ fontFamily: FONT, fontWeight: 900, fontSize: 64, color: C.gold, textShadow: '3px 3px 0 #000, -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000' }}>⚡急な温度差⚡</span>
      </div>
    </>
  );
};

/** Lớp băng phủ dần lên ảnh (nước tan rồi đóng băng lại). */
export const Refreeze: React.FC<{ dur: number }> = ({ dur }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [0, Math.min(dur, 40)], [0, 1], clamp);
  const flakes = Array.from({ length: 14 }, (_, i) => i);
  return (
    <div style={{ position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 26, overflow: 'hidden', pointerEvents: 'none' }}>
      <AbsoluteFill style={{ background: `rgba(190,230,255,${0.42 * k})`, backdropFilter: `blur(${4 * k}px)` }} />
      <svg width={P.w} height={P.h} style={{ position: 'absolute' }}>
        {flakes.map((i) => {
          const x = (i * 137) % P.w;
          const yy = ((i * 251) % P.h) + Math.sin(f / 10 + i) * 8;
          return (
            <text key={i} x={x} y={yy} fontSize={40 + (i % 3) * 18} fill="#fff" opacity={k * 0.85} style={{ fontFamily: FONT }}>
              ❄
            </text>
          );
        })}
      </svg>
    </div>
  );
};

/** Biểu tượng bông tuyết + khóa (dây phanh đông cứng). */
export const FrozenLock: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const p = usePop(0, 11);
  const shake = Math.sin(f * 1.7) * (p > 0.95 ? 3 : 0);
  return (
    <div style={{ position: 'absolute', left: x - 150, top: y - 150, width: 300, height: 300, opacity: p, transform: `scale(${0.5 + 0.5 * p}) translateX(${shake}px)` }}>
      <div style={{ width: 300, height: 300, borderRadius: 150, background: 'radial-gradient(circle,#e8f6ff,#7cc8ff)', border: '8px solid #fff', boxShadow: '0 14px 30px rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 170, lineHeight: 1 }}>🔒</span>
      </div>
      <span style={{ position: 'absolute', right: -20, top: -30, fontSize: 110, color: '#fff', textShadow: '0 0 10px #2563eb' }}>❄</span>
    </div>
  );
};

/** Hiệu ứng tuyết rơi nhẹ trên toàn khung. */
export const Snow: React.FC<{ amount?: number }> = ({ amount = 40 }) => {
  const f = useCurrentFrame();
  const flakes = Array.from({ length: amount }, (_, i) => i);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', pointerEvents: 'none' }}>
      {flakes.map((i) => {
        const speed = 2 + (i % 5) * 0.8;
        const x = ((i * 97) % W) + Math.sin((f + i * 20) / 25) * 30;
        const y = (((i * 173) % H) + f * speed) % H;
        return <circle key={i} cx={x} cy={y} r={3 + (i % 4)} fill="#fff" opacity={0.55} />;
      })}
    </svg>
  );
};

/** Dải tiến độ 3 → 2 → 1 dưới phụ đề. */
export const Progress: React.FC<{ current: number | null }> = ({ current }) => {
  const items = [3, 2, 1];
  return (
    <div style={{ position: 'absolute', top: P.y + P.h + 196, left: 0, width: 960, display: 'flex', justifyContent: 'center', gap: 26 }}>
      {items.map((r) => {
        const on = current === r;
        const done = current !== null && r > current;
        return (
          <div key={r} style={{ fontFamily: FONT, fontWeight: 900, fontSize: 38, color: on ? '#111' : '#fff', background: on ? C.gold : done ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.35)', border: '3px solid rgba(255,255,255,0.5)', borderRadius: 40, padding: '6px 26px 10px', opacity: current === null ? 0.5 : 1 }}>
            第{r}位
          </div>
        );
      })}
    </div>
  );
};
