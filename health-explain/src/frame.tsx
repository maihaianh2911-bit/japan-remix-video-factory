// Khung chung của video giải thích sức khỏe: nền xanh đêm, tên loạt + tên video + thanh tiến độ ở trên, thẻ trắng
// (tiêu đề cảnh, ảnh hoặc hình vẽ, lời giải thích, nguồn), phụ đề chạy theo giọng (chữ trắng viền, từ khóa vàng).
import React from 'react';
import { AbsoluteFill, Easing, interpolate, Sequence, useCurrentFrame } from 'remotion';
import { useFonts } from './fonts';
import { FPS, Time } from './time';
import { C, CARD, clamp, EXP, Lab, PIC, SANS } from './kit';

export type Shot = {
  from: number;
  to: number;
  /** Tiêu đề cảnh trên đầu thẻ (giữ nguyên cho các cảnh sau nếu bỏ trống). `{chữ}` = tô màu. */
  title?: string;
  titleSize?: number;
  /** Lời giải thích dưới ảnh (giữ nguyên cho các cảnh sau nếu bỏ trống, '' = không có). `{chữ}` = tô màu, `\n` = xuống dòng. */
  explain?: string;
  /** Dòng nguồn nhỏ ở chân thẻ. */
  src?: string;
  draw: (dur: number) => React.ReactNode;
};
export const F = (sec: number) => Math.round(sec * FPS);

const Marked: React.FC<{ text: string; hot: string }> = ({ text, hot }) => (
  <>
    {text.split('\n').map((row, r) => (
      <div key={r} style={{ whiteSpace: 'nowrap' }}>
        {row.split(/(\{[^}]*\})/).map((part, i) =>
          part.startsWith('{') ? (
            <span key={i} style={{ color: hot }}>{part.slice(1, -1)}</span>
          ) : (
            <span key={i}>{part}</span>
          ),
        )}
      </div>
    ))}
  </>
);

const plainLen = (s: string) => Math.max(...s.split('\n').map((r) => [...r.replace(/[{}]/g, '')].length));

const Subtitles: React.FC<{ time: Time; hot: string[] }> = ({ time, hot: HOT }) => {
  const t = useCurrentFrame() / FPS;
  const { chunks, LINES } = time;
  let cur = -1;
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    if ((t >= chunks[i].start - 0.05 || i === 0) && t < (next ? next.start - 0.05 : chunks[i].end + 3)) cur = i;
  }
  if (cur < 0) return null;
  const c = chunks[cur];
  const line = LINES[c.li];
  const hot = new Set<number>();
  for (const w of HOT) {
    let k = c.text.indexOf(w);
    while (k >= 0) {
      for (let j = 0; j < w.length; j++) hot.add(k + j);
      k = c.text.indexOf(w, k + 1);
    }
  }
  // một dòng khi vừa; dài hơn thì hai dòng, ngắt ở 、 gần giữa nhất (hoặc giữa câu)
  const chars = [...c.text];
  const n = chars.length;
  let rows: number[][] = [chars.map((_, i) => i)];
  if (n > 17) {
    const mid = n / 2;
    let cut = Math.ceil(mid);
    let best = 99;
    chars.forEach((ch, i) => {
      if ((ch === '、' || ch === '」') && Math.abs(i + 1 - mid) < best && i + 1 >= 5 && n - i - 1 >= 5) {
        best = Math.abs(i + 1 - mid);
        cut = i + 1;
      }
    });
    rows = [chars.slice(0, cut).map((_, i) => i), chars.slice(cut).map((_, i) => i + cut)];
  }
  const longest = Math.max(...rows.map((r) => r.length));
  const size = Math.min(64, Math.floor(880 / longest));
  return (
    <div style={{ position: 'absolute', top: 1362, left: 50, width: 880, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1.28 }}>
      {rows.map((r, ri) => (
        <div key={ri} style={{ whiteSpace: 'nowrap' }}>
          {r.map((i) => {
            const said = t >= line.start + line.chars[c.b + i][0];
            return (
              <span key={i} style={{ color: said ? (hot.has(i) ? C.yellow : '#fff') : '#9fb3bf', WebkitTextStroke: `12px ${C.bg1}`, paintOrder: 'stroke fill' }}>
                {chars[i]}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
};

const Header: React.FC<{ series: string; name: string; time: Time }> = ({ series, name, time }) => {
  const f = useCurrentFrame();
  const prog = Math.min(1, f / FPS / time.DURATION);
  return (
    <>
      <div style={{ position: 'absolute', left: 60, top: 160, display: 'flex', alignItems: 'center', gap: 18 }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: C.bg1, background: C.teal, padding: '4px 18px 8px', borderRadius: 30, letterSpacing: 2 }}>{series}</span>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 42, color: '#fff', letterSpacing: 1 }}>{name}</span>
      </div>
      <div style={{ position: 'absolute', left: CARD.x, top: 236, width: CARD.w, height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.14)' }}>
        <div style={{ width: `${prog * 100}%`, height: '100%', borderRadius: 4, background: C.teal }} />
      </div>
    </>
  );
};

export const ExplainFrame: React.FC<{ time: Time; shots: Shot[]; hot: string[]; glyphs: string; series: string; name: string }> = ({ time, shots, hot, glyphs, series, name }) => {
  const all = shots.map((s) => (s.title ?? '') + (s.explain ?? '') + (s.src ?? '')).join('');
  useFonts(time.LINES.map((l) => l.text).join('') + series + name + all + glyphs);
  const f = useCurrentFrame();
  const t = f / FPS;
  // tiêu đề / lời giải thích có hiệu lực của từng cảnh, và lúc chúng xuất hiện
  const eff: { title: string; titleSize?: number; tFrom: number; explain: string; eFrom: number; src?: string }[] = [];
  shots.forEach((s, i) => {
    const prev = eff[i - 1];
    const title = s.title ?? prev?.title ?? '';
    const explain = s.explain ?? prev?.explain ?? '';
    eff.push({
      title,
      titleSize: s.title !== undefined ? s.titleSize : prev?.titleSize,
      tFrom: prev && prev.title === title ? prev.tFrom : s.from,
      explain,
      eFrom: prev && prev.explain === explain ? prev.eFrom : s.from,
      src: s.src ?? prev?.src,
    });
  });
  let k = shots.findIndex((x) => t >= x.from && t < x.to);
  if (k < 0) k = t < shots[0].from ? 0 : shots.length - 1;
  const cur = eff[k];
  // cảnh đầu (hook): mọi chữ có mặt ngay từ khung hình đầu
  const tIn = cur.tFrom === 0 ? 1 : interpolate(f, [F(cur.tFrom), F(cur.tFrom) + 9], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const eIn = interpolate(f, [F(cur.eFrom) + 4, F(cur.eFrom) + 14], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const tSize = cur.titleSize ?? Math.min(56, Math.floor(820 / Math.max(1, plainLen(cur.title))));
  const eSize = Math.min(42, Math.floor(830 / Math.max(1, plainLen(cur.explain))));
  return (
    <AbsoluteFill>
      <Lab />
      <Header series={series} name={name} time={time} />
      {/* thẻ trắng */}
      <div style={{ position: 'absolute', left: CARD.x, top: CARD.y, width: CARD.w, height: CARD.h, borderRadius: 36, background: C.card, boxShadow: '0 24px 60px rgba(0,0,0,0.45)' }} />
      <div style={{ position: 'absolute', left: CARD.x + 26, top: CARD.y + 22, width: 12, height: PIC.y - CARD.y - 46, borderRadius: 6, background: C.teal }} />
      <div
        style={{
          position: 'absolute',
          left: CARD.x + 56,
          top: CARD.y + 14,
          width: 860,
          height: PIC.y - CARD.y - 28,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: tSize,
          lineHeight: 1.16,
          color: C.ink,
          opacity: tIn,
          transform: `translateX(${(1 - tIn) * -30}px)`,
        }}
      >
        <Marked text={cur.title} hot={C.orange} />
      </div>
      {shots.map((x, i) => {
        const from = F(x.from);
        const dur = Math.max(1, F(x.to) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            {x.from === 0 ? <AbsoluteFill>{x.draw(dur)}</AbsoluteFill> : <ShotIn>{x.draw(dur)}</ShotIn>}
          </Sequence>
        );
      })}
      {cur.explain && (
        <div
          style={{
            position: 'absolute',
            left: EXP.x,
            top: EXP.y,
            width: EXP.w,
            height: EXP.h - 30,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: SANS,
            fontWeight: 700,
            fontSize: eSize,
            lineHeight: 1.45,
            color: C.ink,
            opacity: eIn,
            transform: `translateY(${(1 - eIn) * 16}px)`,
          }}
        >
          <Marked text={cur.explain} hot={C.tealDark} />
        </div>
      )}
      {cur.src && (
        <div style={{ position: 'absolute', left: EXP.x, width: EXP.w, top: CARD.y + CARD.h - 42, textAlign: 'center', fontFamily: SANS, fontWeight: 500, fontSize: 21, color: C.grey, whiteSpace: 'nowrap', overflow: 'hidden' }}>
          {cur.src}
        </div>
      )}
      <Subtitles time={time} hot={hot} />
    </AbsoluteFill>
  );
};

/** Cảnh mới hiện ra: mờ → rõ, hơi thu lại. */
const ShotIn: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [0, 7], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  return <AbsoluteFill style={{ opacity: p, transform: `scale(${1.02 - 0.02 * p})` }}>{children}</AbsoluteFill>;
};
