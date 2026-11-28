// Bộ đồ của video giải thích sức khỏe: nền phòng thí nghiệm, thẻ trắng có ảnh thật, kính lúp (ảnh hiển vi trong
// vòng tròn), nhãn chỉ, huy hiệu, và các hình vẽ bằng code (chuỗi tinh bột, đồ thị đường huyết, cột số liệu, bong
// bóng axit béo). Kiểu riêng của mình (không chép nền mây, khung, bác sĩ của kênh mẫu).
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

export const W = 1080;
export const H = 1920;
export const SANS = '"Noto Sans JP", sans-serif';
export const C = {
  bg1: '#081521',
  bg2: '#0f2f40',
  teal: '#17b3a3',
  tealDark: '#0c7d72',
  tealSoft: '#d9f3ef',
  amber: '#f6b73c',
  orange: '#ef6c35',
  red: '#d9412f',
  card: '#fbfaf6',
  ink: '#13212e',
  grey: '#6b7a86',
  faint: '#e6eef0',
  blue: '#3d8fd6',
  yellow: '#ffd84a',
};

/** Thẻ trắng (tiêu đề, ảnh, lời giải thích). Chữ quan trọng không ra ngoài x 60–930, y < 1540 (nút và chữ TikTok). */
export const CARD = { x: 44, y: 262, w: 992, h: 1066 };
/** Vùng ảnh trong thẻ. */
export const PIC = { x: 70, y: 412, w: 940, h: 690 };
/** Vùng ảnh khi cảnh không có lời giải thích: ảnh kéo xuống gần chân thẻ. */
export const PIC_TALL = { x: 70, y: 412, w: 940, h: 880 };
/** Lời giải thích dưới ảnh. */
export const EXP = { x: 84, y: 1114, w: 846, h: 186 };

export const clamp = { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' } as const;

export const usePop = (from = 0, damping = 13) => {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: f - from, fps, config: { damping, stiffness: 170, mass: 0.6 } });
};

/** Nền: xanh đêm, hai quầng sáng trôi chậm, lưới chấm mờ, hạt nhỏ bay lên. */
export const Lab: React.FC = () => {
  const f = useCurrentFrame();
  const a = f / 30;
  const dots = Array.from({ length: 26 }, (_, i) => {
    const x = (i * 397) % W;
    const speed = 14 + ((i * 53) % 23);
    const y = H - ((a * speed + i * 211) % (H + 80));
    const r = 2 + ((i * 7) % 4);
    return <circle key={i} cx={x + 18 * Math.sin(a * 0.6 + i)} cy={y} r={r} fill="#9ff2e6" opacity={0.18 + ((i * 13) % 10) / 60} />;
  });
  return (
    <AbsoluteFill style={{ background: `radial-gradient(120% 80% at 50% 30%, ${C.bg2} 0%, ${C.bg1} 70%)` }}>
      <div style={{ position: 'absolute', left: 200 + 160 * Math.sin(a * 0.21), top: 120 + 90 * Math.cos(a * 0.17), width: 820, height: 820, borderRadius: 410, background: 'radial-gradient(circle, rgba(23,179,163,0.30), rgba(23,179,163,0) 70%)' }} />
      <div style={{ position: 'absolute', left: -220 + 140 * Math.cos(a * 0.15), top: 1120 + 120 * Math.sin(a * 0.19), width: 900, height: 900, borderRadius: 450, background: 'radial-gradient(circle, rgba(246,183,60,0.16), rgba(246,183,60,0) 70%)' }} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="dotgrid" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="1.6" fill="#ffffff" opacity="0.07" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#dotgrid)" />
        {dots}
      </svg>
    </AbsoluteFill>
  );
};

/** Ảnh thật trong vùng PIC (hoặc một khung tùy ý): phủ kín, zoom chậm; `contain` = cả ảnh trên nền mờ của chính nó. */
export const Pic: React.FC<{
  src: string;
  dur: number;
  focus?: [number, number];
  zoom?: [number, number];
  fit?: 'cover' | 'contain';
  box?: { x: number; y: number; w: number; h: number };
  radius?: number;
  pan?: [number, number];
}> = ({ src, dur, focus = [0.5, 0.5], zoom = [1.0, 1.08], fit = 'cover', box = PIC, radius = 22, pan = [0, 0] }) => {
  const f = useCurrentFrame();
  const z = interpolate(f, [0, Math.max(1, dur)], zoom, { ...clamp, easing: Easing.inOut(Easing.sin) });
  const px = interpolate(f, [0, Math.max(1, dur)], [0, pan[0]], clamp);
  const py = interpolate(f, [0, Math.max(1, dur)], [0, pan[1]], clamp);
  const origin = `${focus[0] * 100}% ${focus[1] * 100}%`;
  return (
    <div style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: radius, overflow: 'hidden', background: '#dfe7ea' }}>
      {fit === 'contain' && (
        <Img src={staticFile(src)} style={{ position: 'absolute', inset: -40, width: box.w + 80, height: box.h + 80, objectFit: 'cover', filter: 'blur(26px) brightness(1.08) saturate(0.9)', opacity: 0.75 }} />
      )}
      <Img
        src={staticFile(src)}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: fit,
          objectPosition: origin,
          transform: `translate(${px}px, ${py}px) scale(${z})`,
          transformOrigin: origin,
        }}
      />
    </div>
  );
};

/** Vùng vẽ sáng (giấy kẻ ô nhạt) trong PIC cho hình vẽ bằng code. */
export const Board: React.FC<{ children?: React.ReactNode; tint?: string; tall?: boolean }> = ({ children, tint = '#f1f7f7', tall = false }) => {
  const b = tall ? PIC_TALL : PIC;
  return (
  <div style={{ position: 'absolute', left: b.x, top: b.y, width: b.w, height: b.h, borderRadius: 22, overflow: 'hidden', background: tint }}>
    <svg width={b.w} height={b.h} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <pattern id="sq" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M40 0H0V40" fill="none" stroke="#cfe0e2" strokeWidth="1.2" />
        </pattern>
      </defs>
      <rect width={b.w} height={b.h} fill="url(#sq)" />
    </svg>
    {children}
  </div>
  );
};

/** Kính lúp: vòng tròn (ảnh hiển vi hoặc hình vẽ) nối với một điểm trên ảnh. Tọa độ theo cả khung 1080×1920. */
export const Lens: React.FC<{
  at?: number;
  cx: number;
  cy: number;
  r?: number;
  from?: [number, number];
  src?: string;
  focus?: [number, number];
  zoom?: [number, number];
  label?: string;
  dur?: number;
  children?: React.ReactNode;
}> = ({ at = 0, cx, cy, r = 170, from, src, focus = [0.5, 0.5], zoom = [1.05, 1.25], label, dur = 150, children }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 12);
  const line = interpolate(f, [at, at + 10], [0, 1], clamp);
  const z = interpolate(f, [at, at + dur], zoom, clamp);
  if (f < at) return null;
  const origin = `${focus[0] * 100}% ${focus[1] * 100}%`;
  return (
    <>
      {from && (
        <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <line x1={from[0]} y1={from[1]} x2={from[0] + (cx - from[0]) * line} y2={from[1] + (cy - from[1]) * line} stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity={0.95} />
          <circle cx={from[0]} cy={from[1]} r={22 * Math.min(1, p)} fill="none" stroke="#fff" strokeWidth="5" />
        </svg>
      )}
      <div
        style={{
          position: 'absolute',
          left: cx - r,
          top: cy - r,
          width: 2 * r,
          height: 2 * r,
          borderRadius: r,
          overflow: 'hidden',
          transform: `scale(${p})`,
          border: '10px solid #fff',
          boxShadow: `0 0 0 5px ${C.teal}, 0 18px 40px rgba(0,0,0,0.35)`,
          background: '#eef5f5',
        }}
      >
        {src && <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: origin, transform: `scale(${z})`, transformOrigin: origin }} />}
        {children}
      </div>
      {label && (
        <div
          style={{
            position: 'absolute',
            left: cx - 220,
            width: 440,
            top: cy + r + 4,
            textAlign: 'center',
            opacity: Math.min(1, p),
          }}
        >
          <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 28, color: '#fff', background: C.tealDark, padding: '4px 16px 7px', borderRadius: 12 }}>{label}</span>
        </div>
      )}
    </>
  );
};

/** Nhãn chỉ: chấm trên ảnh + chữ trong hộp. Tọa độ theo cả khung. */
export const Tag: React.FC<{ at?: number; x: number; y: number; text: string; dx?: number; dy?: number; tone?: 'teal' | 'orange' | 'ink' | 'red'; size?: number }> = ({
  at = 0,
  x,
  y,
  text,
  dx = 0,
  dy = -90,
  tone = 'teal',
  size = 34,
}) => {
  const f = useCurrentFrame();
  const p = usePop(at, 12);
  if (f < at) return null;
  const bg = tone === 'orange' ? C.orange : tone === 'ink' ? C.ink : tone === 'red' ? C.red : C.tealDark;
  return (
    <>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1={x} y1={y} x2={x + dx * p} y2={y + dy * p} stroke="#fff" strokeWidth="4" />
        <circle cx={x} cy={y} r={10 * p} fill={bg} stroke="#fff" strokeWidth="4" />
      </svg>
      <div style={{ position: 'absolute', left: x + dx, top: y + dy, transform: `translate(-50%, -50%) scale(${p})` }}>
        <span style={{ display: 'inline-block', whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 900, fontSize: size, color: '#fff', background: bg, padding: '6px 18px 9px', borderRadius: 14, boxShadow: '0 6px 14px rgba(0,0,0,0.25)' }}>{text}</span>
      </div>
    </>
  );
};

/** Huy hiệu lớn (con số, kết luận) nảy vào. */
export const Badge: React.FC<{ at?: number; x: number; y: number; text: string; sub?: string; tone?: 'orange' | 'teal' | 'red' | 'yellow'; size?: number; angle?: number }> = ({
  at = 0,
  x,
  y,
  text,
  sub,
  tone = 'orange',
  size = 72,
  angle = -4,
}) => {
  const f = useCurrentFrame();
  const p = usePop(at, 10);
  if (f < at) return null;
  const bg = tone === 'teal' ? C.teal : tone === 'red' ? C.red : tone === 'yellow' ? C.yellow : C.orange;
  const ink = tone === 'yellow' ? C.ink : '#fff';
  return (
    <div style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) rotate(${angle}deg) scale(${p})` }}>
      <div style={{ background: bg, borderRadius: 26, padding: sub ? '10px 34px 16px' : '10px 34px 18px', border: '6px solid #fff', boxShadow: '0 12px 28px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        {sub && <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size * 0.38, color: ink, whiteSpace: 'nowrap' }}>{sub}</div>}
        <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.05, color: ink, whiteSpace: 'nowrap' }}>{text}</div>
      </div>
    </div>
  );
};

/** Một hạt glucose (lục giác). */
const Hex: React.FC<{ x: number; y: number; r: number; fill: string; rot?: number; opacity?: number }> = ({ x, y, r, fill, rot = 0, opacity = 1 }) => {
  const pts = Array.from({ length: 6 }, (_, k) => {
    const a = (Math.PI / 3) * k + (rot * Math.PI) / 180;
    return `${x + r * Math.cos(a)},${y + r * Math.sin(a)}`;
  }).join(' ');
  return <polygon points={pts} fill={fill} stroke="#ffffff" strokeWidth={3} opacity={opacity} />;
};

const rnd = (i: number) => {
  const s = Math.sin(i * 12.9898) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * Chuỗi tinh bột vẽ bằng code (trong Board, tọa độ của Board).
 * swell: 0 → 1 chuỗi giãn ra, nước len vào; free: 0 → 1 hạt rời khỏi chuỗi (thành đường);
 * pack: 0 → 1 chuỗi duỗi thẳng và ép sát nhau, nước thoát ra (レジスタントスターチ).
 */
export const Starch: React.FC<{ swell?: number; free?: number; pack?: number; tone?: string }> = ({ swell = 0, free = 0, pack = 0, tone = '#f0c75e' }) => {
  const f = useCurrentFrame();
  const rows = 5;
  const n = 11;
  const gap = 78 + 40 * swell - 62 * pack;
  const amp = 8 + 26 * swell - 34 * pack;
  const cy0 = PIC.h / 2 - ((rows - 1) * gap) / 2 - 10;
  const beads: React.ReactNode[] = [];
  const bonds: React.ReactNode[] = [];
  const water: React.ReactNode[] = [];
  for (let i = 0; i < rows; i++) {
    let prev: [number, number] | null = null;
    for (let j = 0; j < n; j++) {
      const k = i * n + j;
      const wob = Math.sin(j * 0.95 + i * 1.7 + f / 22) * Math.max(0, amp);
      let x = 120 + j * 70;
      let y = cy0 + i * gap + wob;
      const go = Math.max(0, Math.min(1, free * 1.6 - rnd(k) * 0.6));
      x += go * (rnd(k + 3) - 0.5) * 520;
      y += go * (rnd(k + 7) - 0.5) * 520;
      const rot = go * 180 * (rnd(k + 11) - 0.5) + j * 4;
      if (prev && go < 0.05) bonds.push(<line key={`b${k}`} x1={prev[0]} y1={prev[1]} x2={x} y2={y} stroke="#b98a2c" strokeWidth={6} opacity={1 - go * 10} />);
      beads.push(<Hex key={`h${k}`} x={x} y={y} r={24} fill={go > 0.05 ? '#f59e3b' : tone} rot={rot} />);
      prev = [x, y];
    }
  }
  // giọt nước giữa các chuỗi: vào khi swell, ra khi pack
  for (let i = 0; i < 26; i++) {
    const row = i % (rows - 1);
    const x0 = 140 + rnd(i + 40) * 680;
    const inside = cy0 + row * gap + gap / 2 + (rnd(i + 50) - 0.5) * 20;
    const outY = rnd(i) > 0.5 ? -60 : PIC.h + 60;
    const show = Math.min(swell * 1.4, 1) * (1 - pack);
    const y = interpolate(show, [0, 1], [outY, inside]);
    water.push(
      <path
        key={`w${i}`}
        d={`M ${x0} ${y - 16} C ${x0 + 12} ${y - 2}, ${x0 + 12} ${y + 10}, ${x0} ${y + 10} C ${x0 - 12} ${y + 10}, ${x0 - 12} ${y - 2}, ${x0} ${y - 16} Z`}
        fill={C.blue}
        opacity={0.85 * Math.min(1, show * 1.3)}
      />,
    );
  }
  return (
    <svg width={PIC.w} height={PIC.h} style={{ position: 'absolute', inset: 0 }}>
      {bonds}
      {beads}
      {water}
    </svg>
  );
};

/** Đồ thị đường huyết sau ăn (hình minh họa): đường cam = cơm mới nấu, đường xanh = cơm nguội. */
export const SugarGraph: React.FC<{ draw: number; cool?: number; showCool?: boolean }> = ({ draw, cool = 0, showCool = false }) => {
  const ox = 120;
  const oy = 600;
  const gw = 760;
  const gh = 470;
  const curve = (amp: number, tau: number, prog: number) => {
    const pts: string[] = [];
    const steps = 80;
    for (let i = 0; i <= steps * prog; i++) {
      const t = (i / steps) * 150; // phút
      const v = 0.12 + amp * (t / tau) * Math.exp(1 - t / tau);
      pts.push(`${ox + (t / 150) * gw},${oy - v * gh}`);
    }
    return pts.join(' ');
  };
  const hot = curve(0.78, 32, draw);
  const cold = curve(0.55, 36, cool); // diện tích dưới đường thấp hơn khoảng 2 phần 10
  const peakHot = 0.12 + 0.78;
  return (
    <svg width={PIC.w} height={PIC.h} style={{ position: 'absolute', inset: 0 }}>
      <line x1={ox} y1={oy} x2={ox + gw + 20} y2={oy} stroke={C.ink} strokeWidth={5} />
      <line x1={ox} y1={oy} x2={ox} y2={oy - gh - 40} stroke={C.ink} strokeWidth={5} />
      <polygon points={`${ox + gw + 34},${oy} ${ox + gw + 12},${oy - 11} ${ox + gw + 12},${oy + 11}`} fill={C.ink} />
      <polygon points={`${ox},${oy - gh - 54} ${ox - 11},${oy - gh - 32} ${ox + 11},${oy - gh - 32}`} fill={C.ink} />
      <text x={ox + 14} y={oy - gh - 40} fontFamily={SANS} fontWeight={900} fontSize={34} fill={C.ink}>血糖値</text>
      <text x={ox + gw - 150} y={oy + 52} fontFamily={SANS} fontWeight={900} fontSize={32} fill={C.ink}>食後の時間</text>
      <polyline points={hot} fill="none" stroke={C.orange} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      {showCool && <polyline points={cold} fill="none" stroke={C.teal} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />}
      {draw > 0.35 && (
        <text x={ox + (36 / 150) * gw + 30} y={oy - peakHot * gh - 14} fontFamily={SANS} fontWeight={900} fontSize={36} fill={C.orange}>炊きたて</text>
      )}
      {showCool && cool > 0.4 && (
        <text x={ox + (36 / 150) * gw - 40} y={oy - 0.67 * gh + 70} fontFamily={SANS} fontWeight={900} fontSize={36} fill={C.tealDark}>冷やご飯</text>
      )}
      <text x={PIC.w - 30} y={44} textAnchor="end" fontFamily={SANS} fontWeight={700} fontSize={24} fill={C.grey}>※グラフはイメージ</text>
    </svg>
  );
};

/** Cột số liệu (trong Board). */
export const Bars: React.FC<{ data: { label: string; sub?: string; value: number; color: string; text: string }[]; grow: number; max: number; title?: string }> = ({ data, grow, max, title }) => {
  const base = 560;
  const hMax = 380;
  const bw = 210;
  const xs = data.length === 2 ? [230, 560] : data.map((_, i) => 140 + i * 250);
  return (
    <svg width={PIC.w} height={PIC.h} style={{ position: 'absolute', inset: 0 }}>
      {title && (
        <text x={PIC.w / 2} y={74} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={C.ink}>{title}</text>
      )}
      <line x1={80} y1={base} x2={PIC.w - 80} y2={base} stroke={C.ink} strokeWidth={5} />
      {data.map((d, i) => {
        const g = Math.max(0, Math.min(1, grow * 1.5 - i * 0.5));
        const h = (d.value / max) * hMax * Easing.out(Easing.cubic)(g);
        return (
          <g key={i}>
            <rect x={xs[i]} y={base - h} width={bw} height={h} rx={14} fill={d.color} />
            {g > 0.6 && (
              <text x={xs[i] + bw / 2} y={base - h - 22} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={50} fill={C.ink}>{d.text}</text>
            )}
            <text x={xs[i] + bw / 2} y={base + 52} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={34} fill={C.ink}>{d.label}</text>
            {d.sub && (
              <text x={xs[i] + bw / 2} y={base + 92} textAnchor="middle" fontFamily={SANS} fontWeight={700} fontSize={26} fill={C.grey}>{d.sub}</text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

/** Bong bóng axit béo (酪酸) bay lên trên ảnh hiển vi vi khuẩn. Tọa độ của PIC. */
export const Bubbles: React.FC<{ from: number; label?: string }> = ({ from, label = '酪酸' }) => {
  const f = useCurrentFrame() - from;
  if (f < 0) return null;
  const items = Array.from({ length: 16 }, (_, i) => {
    const t = f - i * 5;
    if (t < 0) return null;
    const x = 80 + rnd(i + 90) * (PIC.w - 160);
    const y = PIC.h - 60 - t * (3.2 + rnd(i + 3) * 2.4);
    const r = 16 + rnd(i + 5) * 20;
    const o = interpolate(y, [-40, 120, PIC.h - 60], [0, 1, 1], clamp);
    const pop = Math.min(1, t / 8);
    return (
      <g key={i} opacity={o}>
        <circle cx={x + 14 * Math.sin(t / 10 + i)} cy={y} r={r * pop} fill="rgba(255,216,74,0.9)" stroke="#fff" strokeWidth={4} />
        {i % 4 === 0 && r > 24 && (
          <text x={x + 14 * Math.sin(t / 10 + i)} y={y + 9} textAnchor="middle" fontFamily={SANS} fontWeight={900} fontSize={22} fill={C.ink}>{label}</text>
        )}
      </g>
    );
  });
  return (
    <svg width={PIC.w} height={PIC.h} style={{ position: 'absolute', left: PIC.x, top: PIC.y, overflow: 'hidden', borderRadius: 22 }}>
      {items}
    </svg>
  );
};

/** Hộp cảnh báo (băng vàng) trên đầu ảnh. */
export const Warning: React.FC<{ at?: number; text: string }> = ({ at = 0, text }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 14);
  if (f < at) return null;
  return (
    <div style={{ position: 'absolute', left: PIC.x + 30, top: PIC.y + 28, transform: `scale(${p})`, transformOrigin: 'left top' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: C.yellow, border: `6px solid ${C.ink}`, borderRadius: 18, padding: '8px 24px 12px', boxShadow: '0 10px 24px rgba(0,0,0,0.3)' }}>
        <svg width={56} height={50} viewBox="0 0 56 50">
          <polygon points="28,3 54,47 2,47" fill={C.ink} />
          <rect x={25} y={17} width={6} height={17} rx={3} fill={C.yellow} />
          <circle cx={28} cy={40} r={3.6} fill={C.yellow} />
        </svg>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: C.ink, whiteSpace: 'nowrap' }}>{text}</span>
      </div>
    </div>
  );
};

/** Dấu tích tròn xanh. */
export const Check: React.FC<{ at?: number; x: number; y: number; size?: number; text?: string }> = ({ at = 0, x, y, size = 150, text }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 10);
  if (f < at) return null;
  const draw = interpolate(f, [at + 4, at + 16], [0, 1], clamp);
  return (
    <div style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, transform: `scale(${p})` }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={46} fill={C.teal} stroke="#fff" strokeWidth={6} />
        <path d="M27 52 L44 68 L74 35" fill="none" stroke="#fff" strokeWidth={11} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={80} strokeDashoffset={80 * (1 - draw)} />
      </svg>
      {text && (
        <div style={{ position: 'absolute', top: size + 6, left: -100, width: size + 200, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 34, color: '#fff', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>{text}</div>
      )}
    </div>
  );
};

/** Ô bước (①②③) có ảnh nhỏ. Tọa độ theo cả khung. */
export const Step: React.FC<{ at?: number; n: number; x: number; y: number; w: number; h: number; src: string; text: string; focus?: [number, number] }> = ({ at = 0, n, x, y, w, h, src, text, focus = [0.5, 0.5] }) => {
  const f = useCurrentFrame();
  const p = usePop(at, 13);
  if (f < at) return null;
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, transform: `translateY(${(1 - p) * 60}px)`, opacity: Math.min(1, p * 1.4) }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 20, overflow: 'hidden', border: '5px solid #fff', boxShadow: '0 10px 22px rgba(0,0,0,0.25)' }}>
        <Img src={staticFile(src)} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: `${focus[0] * 100}% ${focus[1] * 100}%` }} />
      </div>
      <div style={{ position: 'absolute', left: -16, top: -18, width: 76, height: 76, borderRadius: 38, background: C.orange, border: '5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 42, color: '#fff' }}>{n}</div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center' }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 34, color: '#fff', background: 'rgba(19,33,46,0.86)', padding: '4px 16px 8px', borderRadius: 12, whiteSpace: 'nowrap' }}>{text}</span>
      </div>
    </div>
  );
};

/** Chữ rất lớn trên ảnh (hook): trắng, viền đậm, có mặt từ khung hình đầu. Tọa độ theo cả khung. */
export const BigText: React.FC<{ text: string; y: number; size?: number; hot?: string }> = ({ text, y, size = 96, hot = C.yellow }) => {
  const f = useCurrentFrame();
  const s = 1 + 0.03 * Math.sin(f / 9);
  return (
    <div style={{ position: 'absolute', left: 60, width: 880, top: y, textAlign: 'center', transform: `scale(${s})` }}>
      {text.split('\n').map((row, r) => (
        <div key={r} style={{ whiteSpace: 'nowrap', fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.15 }}>
          {row.split(/(\{[^}]*\})/).map((part, i) => (
            <span key={i} style={{ color: part.startsWith('{') ? hot : '#fff', WebkitTextStroke: `${Math.round(size / 5)}px ${C.ink}`, paintOrder: 'stroke fill' }}>
              {part.replace(/[{}]/g, '')}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
