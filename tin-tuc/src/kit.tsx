// Bộ khung của kênh tin tức: giấy kem, khung vuông viền đen đổ bóng, chữ kiểu báo, số chạy, cột VS,
// mẩu báo cắt (ảnh thật), tem đỏ, nhân vật que đội mũ phóng viên. Kiểu riêng của mình.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const W = 1080;
export const H = 1920;
/** Khung chính. Chữ quan trọng không ra ngoài x 60–940, y < 1560 (nút và chữ của TikTok). */
export const K = { x: 70, y: 480, w: 900, h: 900 };

export const SERIF = '"Noto Serif JP", serif';
export const SANS = '"Noto Sans JP", sans-serif';
export const C = { paper: '#ebe3d3', card: '#f7f2e7', ink: '#161412', red: '#b8231f', grey: '#8f877b', faint: '#d9cfbd' };

const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const usePop = (from = 0, damping = 13) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - from, fps, config: { damping, stiffness: 170, mass: 0.6 } });
};

/** Nền giấy có hạt. */
export const Paper: React.FC = () => (
  <AbsoluteFill style={{ background: C.paper }}>
    <svg width={W} height={H} style={{ position: 'absolute', opacity: 0.22 }}>
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
        <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.6 0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  </AbsoluteFill>
);

/** Tên kênh nhỏ ở góc trên trái. */
export const Masthead: React.FC = () => (
  <div style={{ position: 'absolute', left: K.x, top: 236, display: 'flex', alignItems: 'center', gap: 14 }}>
    <div style={{ width: 54, height: 54, borderRadius: 27, background: C.red, border: `3px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 30, color: '#fff' }}>報</span>
    </div>
    <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 34, color: C.ink, letterSpacing: 2 }}>数字で読むニュース</span>
  </div>
);

/** Khung vuông chính: viền đen dày, bóng đổ cứng. Nảy nhẹ khi đổi cảnh. */
export const Card: React.FC<{ children?: React.ReactNode; tone?: 'card' | 'red' | 'ink'; pop?: boolean }> = ({ children, tone = 'card', pop = true }) => {
  const p = usePop(0, 16);
  const f = useCurrentFrame();
  // Khung chữ cũng không đứng yên: tiến lại rất chậm (khoảng 4 % trong 12 giây).
  const s = (pop ? 0.94 + 0.06 * p : 1) * (1 + Math.min(f, 360) * 0.00011);
  const bg = tone === 'red' ? C.red : tone === 'ink' ? C.ink : C.card;
  return (
    <div style={{ position: 'absolute', left: K.x, top: K.y, width: K.w, height: K.h, transform: `scale(${s})` }}>
      <div style={{ position: 'absolute', left: 16, top: 16, width: K.w, height: K.h, background: C.ink }} />
      <div style={{ position: 'absolute', inset: 0, background: bg, border: `8px solid ${C.ink}`, overflow: 'hidden' }}>{children}</div>
    </div>
  );
};

/** Dòng nguồn nhỏ dưới khung. */
export const Source: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ position: 'absolute', left: K.x, top: K.y + K.h + 30, fontFamily: SANS, fontWeight: 500, fontSize: 24, color: C.grey }}>出典：{text}</div>
);

/** Nhãn đen chữ trắng ở đầu khung (ví dụ 「2026年10月 訪日外国人」). */
export const Label: React.FC<{ text: string; top?: number }> = ({ text, top = 90 }) => (
  <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
    <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 38, color: '#fff', background: C.ink, padding: '6px 22px 10px' }}>{text}</span>
  </div>
);

/** Tiêu đề kiểu báo, `{…}` = tô đỏ, \n = xuống dòng. */
export const Headline: React.FC<{ text: string; size?: number; top?: number; color?: string; align?: 'center' | 'left' }> = ({ text, size = 100, top = 120, color = C.ink, align = 'center' }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', top, left: 50, right: 50, textAlign: align, lineHeight: 1.22 }}>
      {text.split('\n').map((row, r) => {
        const a = interpolate(f, [r * 4, r * 4 + 8], [0, 1], clamp);
        return (
          <div key={r} style={{ opacity: a, transform: `translateY(${(1 - a) * 20}px)` }}>
            {row.split(/(\{[^}]*\})/).filter(Boolean).map((part, i) => (
              <span key={i} style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: part.startsWith('{') ? C.red : color }}>
                {part.startsWith('{') ? part.slice(1, -1) : part}
              </span>
            ))}
          </div>
        );
      })}
    </div>
  );
};

/** Số to chạy từ `from` lên `to`, phân cách hàng nghìn bằng dấu phẩy. */
export const BigNumber: React.FC<{ to: number; from?: number; unit?: string; sub?: string; dur?: number; top?: number; size?: number; prefix?: string; decimals?: number; color?: string }> = ({
  to, from = 0, unit = '', sub, dur = 24, top = 300, size = 170, prefix = '', decimals = 0, color = C.red,
}) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [2, dur], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const v = from + (to - from) * k;
  const shown = decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString('ja-JP');
  const line = interpolate(f, [dur - 4, dur + 8], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', top, left: 0, width: '100%', textAlign: 'center' }}>
      <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color, lineHeight: 1.1, letterSpacing: -2 }}>
        {prefix}
        {shown}
        <span style={{ fontSize: size * 0.42, marginLeft: 6 }}>{unit}</span>
      </div>
      <div style={{ margin: '14px auto 0', width: `${70 * line}%`, height: 7, background: C.ink }} />
      {sub && <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 46, color: C.ink, marginTop: 22, opacity: line }}>{sub}</div>}
    </div>
  );
};

/** Tem đỏ nghiêng, viền đôi. */
export const Stamp: React.FC<{ text: string; x: number; y: number; size?: number; angle?: number; tone?: 'red' | 'ink' }> = ({ text, x, y, size = 64, angle = -8, tone = 'red' }) => {
  const p = usePop(0, 9);
  const col = tone === 'red' ? C.red : C.ink;
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `rotate(${angle}deg) scale(${1.9 - 0.9 * p})`, opacity: Math.min(1, p * 2), transformOrigin: 'center' }}>
      <div style={{ background: col, padding: '8px 26px 12px', border: `4px solid ${col}`, outline: `3px solid ${col}`, outlineOffset: 5, boxShadow: '0 6px 0 rgba(0,0,0,0.25)' }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: size, color: '#fff', whiteSpace: 'nowrap', letterSpacing: 3 }}>{text}</span>
      </div>
    </div>
  );
};

/** Ảnh thật dán như mẩu báo cắt: viền trắng + viền đen, hơi nghiêng, băng dính ở góc, zoom chậm. */
export const Clipping: React.FC<{ src: string; dur: number; focus?: [number, number]; angle?: number; caption?: string; zoom?: [number, number]; fit?: 'cover' | 'contain' }> = ({
  src, dur, focus = [0.5, 0.5], angle = -2, caption, zoom = [1.02, 1.12], fit = 'cover',
}) => {
  const f = useCurrentFrame();
  const p = usePop(0, 14);
  // Ảnh luôn chuyển động rõ (chủ kênh: "lại dính lỗi ảnh đứng yên"): phóng to ít nhất 22 % (ảnh để nguyên khung: 14 %)
  // trong suốt cảnh, và trượt ngang 4 % về một phía (phía đổi theo tên ảnh, để hai ảnh liền nhau không trôi cùng chiều).
  const span = Math.max(zoom[1] - zoom[0], fit === 'contain' ? 0.14 : 0.22);
  const t = interpolate(f, [0, Math.max(1, dur)], [0, 1], clamp);
  const z = zoom[0] + span * Easing.inOut(Easing.sin)(t);
  const dir = [...src].reduce((a, ch) => a + ch.charCodeAt(0), 0) % 2 === 0 ? 1 : -1;
  const pan = dir * (t - 0.5) * 4;
  const ih = caption ? K.h - 150 : K.h - 70;
  return (
    <div style={{ position: 'absolute', left: K.x - 10, top: K.y - 10, width: K.w + 20, height: K.h + 20, transform: `rotate(${angle * p}deg) translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.6) }}>
      <div style={{ position: 'absolute', left: 14, top: 14, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)' }} />
      <div style={{ position: 'absolute', inset: 0, background: '#fbf8f1', border: `6px solid ${C.ink}`, padding: 26 }}>
        <div style={{ width: '100%', height: ih, overflow: 'hidden', border: `3px solid ${C.ink}`, background: '#ddd' }}>
          <Img src={staticFile(`images/${src}`)} style={{ width: '100%', height: '100%', objectFit: fit, objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%`, transform: `scale(${z}) translateX(${pan}%)`, transformOrigin: `${focus[0] * 100}% ${focus[1] * 100}%` }} />
        </div>
        {caption && <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 48, color: C.ink, marginTop: 18, lineHeight: 1.2 }}>{caption}</div>}
      </div>
      {/* băng dính */}
      <div style={{ position: 'absolute', left: -30, top: 10, width: 150, height: 44, background: 'rgba(230,214,170,0.85)', transform: 'rotate(-35deg)' }} />
      <div style={{ position: 'absolute', right: -30, top: 10, width: 150, height: 44, background: 'rgba(230,214,170,0.85)', transform: 'rotate(35deg)' }} />
    </div>
  );
};

/** Hai cột so sánh đen (trước) và đỏ (sau), giữa có VS. */
export const VSBars: React.FC<{ a: { label: string; value: number; text?: string }; b: { label: string; value: number; text?: string }; dur: number; max?: number; unit?: string }> = ({ a, b, dur, max, unit = '' }) => {
  const f = useCurrentFrame();
  const m = max ?? Math.max(a.value, b.value);
  const ka = interpolate(f, [2, 18], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const kb = interpolate(f, [10, 28], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const vs = usePop(24, 10);
  const col = (side: typeof a, k: number, color: string, left: number) => {
    const hgt = 520 * (side.value / m) * k;
    return (
      <div style={{ position: 'absolute', left, top: 40, width: 380, height: 800, background: C.card, border: `6px solid ${C.ink}` }}>
        <div style={{ textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 38, marginTop: 22, color: C.ink }}>{side.label}</div>
        <div style={{ textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 58, marginTop: 10, color }}>
          {side.text ?? Math.round(side.value * k).toLocaleString('ja-JP')}
          <span style={{ fontSize: 30 }}>{unit}</span>
        </div>
        <div style={{ position: 'absolute', left: 80, bottom: 30, width: 220, height: hgt, background: color }} />
      </div>
    );
  };
  return (
    <>
      {col(a, ka, C.ink, 40)}
      {col(b, kb, C.red, 466)}
      <div style={{ position: 'absolute', left: 390, top: 470, width: 110, height: 110, borderRadius: 55, background: C.red, border: `5px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${vs})` }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 46, color: '#fff' }}>VS</span>
      </div>
    </>
  );
};

/** Cửa sổ 「速報」 giả trang tin: thanh đen, tiêu đề kiểu báo, vài dòng xám. */
export const NewsWindow: React.FC<{ tag?: string; title: string; outlet: string }> = ({ tag = '速報', title, outlet }) => {
  const f = useCurrentFrame();
  const p = usePop(0, 14);
  const lines = [0.92, 0.86, 0.9, 0.6];
  return (
    <div style={{ position: 'absolute', left: 50, top: 70, width: 800, opacity: p, transform: `translateY(${(1 - p) * 40}px)` }}>
      <div style={{ background: C.ink, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 32, color: '#fff', background: C.red, padding: '2px 14px 6px' }}>{tag}</span>
        <span style={{ fontFamily: SANS, fontWeight: 700, fontSize: 26, color: '#ddd' }}>{outlet}</span>
      </div>
      <div style={{ background: '#fffdf8', border: `6px solid ${C.ink}`, borderTop: 'none', padding: '30px 34px 34px' }}>
        <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 70, lineHeight: 1.22, color: C.ink, whiteSpace: 'pre-line' }}>
          {title.split(/(\{[^}]*\})/).filter(Boolean).map((part, i) => (
            <span key={i} style={{ color: part.startsWith('{') ? C.red : C.ink }}>{part.startsWith('{') ? part.slice(1, -1) : part}</span>
          ))}
        </div>
        {lines.map((w, i) => (
          <div key={i} style={{ height: 14, width: `${w * 100 * interpolate(f, [8 + i * 3, 18 + i * 3], [0, 1], clamp)}%`, background: C.faint, marginTop: i ? 14 : 30 }} />
        ))}
      </div>
    </div>
  );
};

/** Lưới 23 ô, `n` ô tô đỏ lần lượt. */
export const Grid: React.FC<{ total: number; n: number; dur: number }> = ({ total, n, dur }) => {
  const f = useCurrentFrame();
  const lit = Math.floor(interpolate(f, [6, Math.max(8, dur * 0.6)], [0, n], clamp));
  return (
    <div style={{ position: 'absolute', left: 102, top: 230, width: 700, display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {Array.from({ length: total }, (_, i) => (
        <div key={i} style={{ width: 100, height: 82, border: `5px solid ${C.ink}`, background: i < lit ? C.red : C.card, transform: i === lit - 1 ? 'scale(1.08)' : 'none' }} />
      ))}
    </div>
  );
};

/** Thanh tiến độ: đã có / còn thiếu so với mốc năm ngoái. */
export const GoalBar: React.FC<{ have: number; goal: number; dur: number }> = ({ have, goal, dur }) => {
  const f = useCurrentFrame();
  const k = interpolate(f, [4, Math.min(30, dur * 0.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const miss = interpolate(f, [Math.min(30, dur * 0.5), Math.min(44, dur * 0.7)], [0, 1], clamp);
  const wHave = 760 * (have / goal) * k;
  return (
    <div style={{ position: 'absolute', left: 70, top: 330, width: 760 }}>
      <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 38, color: C.ink, textAlign: 'right' }}>去年の年間 {goal.toLocaleString('ja-JP')}万人 ▼</div>
      <div style={{ position: 'relative', height: 110, border: `6px solid ${C.ink}`, background: C.card, marginTop: 10 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: wHave, background: C.ink }} />
        <div style={{ position: 'absolute', left: wHave, top: 0, bottom: 0, width: (760 - wHave - 12) * miss, background: `repeating-linear-gradient(45deg, ${C.red}, ${C.red} 14px, #d8615c 14px, #d8615c 28px)` }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 44, color: C.ink }}>1〜10月 {have.toLocaleString('ja-JP')}万人</span>
      </div>
      <div style={{ textAlign: 'right', marginTop: 34, opacity: miss }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 76, color: C.red }}>あと{(goal - have).toLocaleString('ja-JP')}万人</span>
      </div>
    </div>
  );
};

/** Dấu hỏi lớn nhạt sau lưng. */
export const BigQuestion: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <div style={{ position: 'absolute', right: 40, top: 40, fontFamily: SERIF, fontWeight: 900, fontSize: 620, color: 'rgba(184,35,31,0.16)', transform: `rotate(${8 + Math.sin(f / 12) * 2}deg)`, lineHeight: 1 }}>?</div>
  );
};

/** Nhân vật que phóng viên: nét đen, đầu trắng, mũ nồi đỏ, thẻ PRESS, cầm que chỉ. */
export const Reporter: React.FC<{ x?: number; y?: number; scale?: number; mood?: 'point' | 'think' | 'ask' }> = ({ x = 600, y = 460, scale = 1, mood = 'point' }) => {
  const f = useCurrentFrame();
  const p = usePop(0, 12);
  const arm = mood === 'point' ? -18 + Math.sin(f / 7) * 5 : mood === 'ask' ? -70 + Math.sin(f / 5) * 6 : 40;
  return (
    <svg width={220 * scale} height={380 * scale} viewBox="0 0 220 380" style={{ position: 'absolute', left: x, top: y, opacity: p, transform: `translateY(${(1 - p) * 80}px)` }}>
      <g stroke={C.ink} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1="110" y1="175" x2="110" y2="285" />
        <line x1="110" y1="285" x2="80" y2="365" />
        <line x1="110" y1="285" x2="140" y2="365" />
        <line x1="66" y1="365" x2="86" y2="365" />
        <line x1="134" y1="365" x2="154" y2="365" />
        {mood === 'think' ? <polyline points="110,200 150,235 125,150" /> : <polyline points="110,200 150,240 128,262" />}
        <g transform={`rotate(${arm} 110 200)`}>
          <line x1="110" y1="200" x2="50" y2="200" />
          {mood === 'point' && <line x1="50" y1="200" x2="-30" y2="200" stroke="#7a4a1f" strokeWidth={6} />}
        </g>
      </g>
      {/* thẻ PRESS */}
      <rect x="117" y="215" width="40" height="26" fill="#fff" stroke={C.ink} strokeWidth={3} />
      <text x="137" y="233" fontSize="11" fontWeight="900" textAnchor="middle" fill={C.red} fontFamily="sans-serif">PRESS</text>
      {/* đầu + mũ nồi đỏ */}
      <circle cx="110" cy="115" r="56" fill="#fff" stroke={C.ink} strokeWidth={7} />
      <path d="M56 98 Q72 50 128 54 Q172 60 168 92 Q120 82 56 98 Z" fill={C.red} stroke={C.ink} strokeWidth={6} strokeLinejoin="round" />
      <circle cx="128" cy="52" r="7" fill={C.ink} />
      <circle cx="92" cy="125" r="7" fill={C.ink} />
      <circle cx="130" cy="125" r="7" fill={C.ink} />
      {mood === 'ask' ? <circle cx="111" cy="150" r="8" fill={C.ink} /> : <path d="M94 146 Q111 158 128 146" stroke={C.ink} strokeWidth={6} fill="none" strokeLinecap="round" />}
    </svg>
  );
};

/** Cột đứng theo năm (số tăng dần), cột cuối màu đỏ. */
export const YearBars: React.FC<{ data: { label: string; value: number }[]; dur: number; unit?: string; top?: number }> = ({ data, dur, unit = '', top = 230 }) => {
  const f = useCurrentFrame();
  const max = Math.max(...data.map((d) => d.value));
  const bw = 120;
  const gap = (760 - bw * data.length) / (data.length - 1);
  return (
    <div style={{ position: 'absolute', left: 70, top, width: 760, height: 560 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 60, height: 6, background: C.ink }} />
      {data.map((d, i) => {
        const k = interpolate(f, [4 + i * 5, 18 + i * 5], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const h = 420 * (d.value / max) * k;
        const last = i === data.length - 1;
        return (
          <div key={i} style={{ position: 'absolute', left: i * (bw + gap), bottom: 66, width: bw }}>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: last ? 34 : 28, color: last ? C.red : C.ink, textAlign: 'center', marginBottom: 6, opacity: k }}>
              {(d.value / 10000).toFixed(1)}万
            </div>
            <div style={{ height: h, background: last ? C.red : C.ink }} />
            <div style={{ position: 'absolute', top: '100%', marginTop: 14, width: bw, textAlign: 'center', fontFamily: SANS, fontWeight: 700, fontSize: 28, color: C.ink }}>{d.label}</div>
          </div>
        );
      })}
      {unit && <div style={{ position: 'absolute', right: 0, top: -40, fontFamily: SANS, fontWeight: 700, fontSize: 26, color: C.grey }}>{unit}</div>}
    </div>
  );
};

/** Thanh ngang theo nhóm (ví dụ cấp học), thanh đầu màu đỏ. */
export const HBars: React.FC<{ data: { label: string; value: number }[]; dur: number; top?: number; unit?: string }> = ({ data, top = 230, unit = '件' }) => {
  const f = useCurrentFrame();
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ position: 'absolute', left: 60, top, width: 780 }}>
      {data.map((d, i) => {
        const k = interpolate(f, [4 + i * 6, 20 + i * 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
        const first = i === 0;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 34, opacity: Math.min(1, k * 2) }}>
            <div style={{ width: 190, fontFamily: SERIF, fontWeight: 900, fontSize: 40, color: C.ink }}>{d.label}</div>
            <div style={{ height: 70, width: 340 * (d.value / max) * k + 6, background: first ? C.red : C.ink }} />
            <div style={{ marginLeft: 16, fontFamily: SERIF, fontWeight: 900, fontSize: first ? 52 : 40, color: first ? C.red : C.ink, whiteSpace: 'nowrap' }}>
              {Math.round(d.value * k).toLocaleString('ja-JP')}
              <span style={{ fontSize: 26 }}>{unit}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

/** Thanh phiếu: số phiếu có được, vạch đỏ ở mức cần để thông qua, phần thiếu sọc đỏ, chữ 「あとN票」. */
export const VoteLine: React.FC<{ have: number; need: number; dur: number; label?: string; max?: number }> = ({ have, need, dur, label = '賛成', max }) => {
  const f = useCurrentFrame();
  const m = max ?? Math.ceil(need * 1.08);
  const k = interpolate(f, [4, Math.min(30, dur * 0.5)], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const miss = interpolate(f, [Math.min(30, dur * 0.5), Math.min(44, dur * 0.7)], [0, 1], clamp);
  const W = 760;
  const wHave = W * (have / m) * k;
  const xNeed = W * (need / m);
  return (
    <div style={{ position: 'absolute', left: 70, top: 300, width: W }}>
      <div style={{ position: 'relative', height: 60 }}>
        <div style={{ position: 'absolute', right: Math.max(0, W - xNeed - 40), whiteSpace: 'nowrap', textAlign: 'right', fontFamily: SERIF, fontWeight: 900, fontSize: 38, color: C.red }}>可決ライン {need}票 ▼</div>
      </div>
      <div style={{ position: 'relative', height: 120, border: `6px solid ${C.ink}`, background: C.card, marginTop: 10 }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: wHave, background: C.ink }} />
        <div style={{ position: 'absolute', left: wHave, top: 0, bottom: 0, width: Math.max(0, xNeed - wHave - 6) * miss, background: `repeating-linear-gradient(45deg, ${C.red}, ${C.red} 14px, #d8615c 14px, #d8615c 28px)` }} />
        <div style={{ position: 'absolute', left: xNeed - 9, top: -16, bottom: -16, width: 6, background: C.red }} />
      </div>
      <div style={{ marginTop: 18, fontFamily: SERIF, fontWeight: 900, fontSize: 50, color: C.ink }}>
        {label} {Math.round(have * k)}票
      </div>
      <div style={{ textAlign: 'right', marginTop: 30, opacity: miss }}>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 96, color: C.red }}>あと{need - have}票</span>
      </div>
    </div>
  );
};
