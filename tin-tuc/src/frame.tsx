// Khung chung của mọi video tin: đầu bản tin (tên kênh, ngày, tiêu đề lớn đứng suốt video), giấy, các cảnh theo giọng
// đọc, dòng nguồn, phụ đề kiểu テロップ (chữ trắng viền đen, từ khóa vàng).
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { useFonts } from './fonts';
import { FPS, Time } from './time';
import { C, K, Paper, SANS, SERIF, Source } from './kit';

export type Shot = { from: number; to: number; src?: string; draw: (dur: number) => React.ReactNode };
export const F = (sec: number) => Math.round(sec * FPS);

const Subtitles: React.FC<{ time: Time; hot: string[] }> = ({ time, hot: HOT }) => {
  const t = useCurrentFrame() / FPS;
  const { chunks, LINES } = time;
  let cur = -1;
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    if (t >= chunks[i].start - 0.05 && t < (next ? next.start - 0.05 : chunks[i].end + 3)) cur = i;
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
  return (
    <div style={{ position: 'absolute', top: K.y + K.h + 78, left: 50, width: 980, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.text.length > 16 ? 54 : 60, lineHeight: 1.3 }}>
      {[...c.text].map((ch, i) => {
        const said = t >= line.start + line.chars[c.b + i][0];
        return (
          <span key={i} style={{ color: said ? (hot.has(i) ? '#ffd23f' : '#fff') : '#c9c1b3', WebkitTextStroke: '12px #161412', paintOrder: 'stroke fill' }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

/** Tiêu đề: `{chữ}` là chữ đỏ, `\n` xuống dòng. Cỡ chữ tự co theo dòng dài nhất. */
const TitleLine: React.FC<{ text: string; size: number }> = ({ text, size }) => (
  <div style={{ whiteSpace: 'nowrap', lineHeight: 1.18 }}>
    {text.split(/(\{[^}]*\})/).map((part, i) =>
      part.startsWith('{') ? (
        <span key={i} style={{ color: C.red }}>{part.slice(1, -1)}</span>
      ) : (
        <span key={i}>{part}</span>
      ),
    )}
  </div>
);

const Header: React.FC<{ title: string; tag: string; date: string }> = ({ title, tag, date }) => {
  const lines = title.split('\n');
  const longest = Math.max(...lines.map((l) => [...l.replace(/[{}]/g, '')].length));
  const size = Math.min(78, Math.floor(830 / longest));
  const f = useCurrentFrame();
  const blink = Math.floor(f / 15) % 2 === 0;
  return (
    <>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 1080, height: 446, background: C.ink }} />
      <div style={{ position: 'absolute', left: 0, top: 446, width: 1080, height: 8, background: C.red }} />
      {/* tên kênh và ngày */}
      <div style={{ position: 'absolute', left: 40, top: 178, display: 'flex', alignItems: 'center', gap: 16 }}>
        <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 30, color: '#fff', background: C.red, padding: '2px 14px 6px', letterSpacing: 2 }}>NEWS</span>
        <span style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 32, color: '#fff', letterSpacing: 2 }}>数字で読むニュース</span>
      </div>
      <div style={{ position: 'absolute', right: 40, top: 184, display: 'flex', alignItems: 'center', gap: 10, fontFamily: SANS, fontWeight: 700, fontSize: 28, color: '#d8d0c2' }}>
        <span style={{ width: 14, height: 14, borderRadius: 7, background: blink ? '#ff3b30' : '#5a1512' }} />
        {date}
      </div>
      {/* khung tiêu đề */}
      <div style={{ position: 'absolute', left: 40, top: 242, width: 1000, height: 182, background: '#fff', display: 'flex' }}>
        <div style={{ width: 92, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 44, color: '#fff', writingMode: 'vertical-rl', letterSpacing: 6 }}>{tag}</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 26, fontFamily: SANS, fontWeight: 900, fontSize: size, color: C.ink }}>
          {lines.map((l, i) => (
            <TitleLine key={i} text={l} size={size} />
          ))}
        </div>
      </div>
    </>
  );
};

export const NewsFrame: React.FC<{ time: Time; shots: Shot[]; hot: string[]; glyphs: string; title: string; tag: string; date: string }> = ({ time, shots, hot, glyphs, title, tag, date }) => {
  useFonts(time.LINES.map((l) => l.text).join('') + '数字で読むニュース報出典NEWS' + title + tag + date + glyphs);
  const t = useCurrentFrame() / FPS;
  const shot = shots.find((x) => t >= x.from && t < x.to);
  return (
    <AbsoluteFill>
      <Paper />
      <Header title={title} tag={tag} date={date} />
      {shots.map((x, i) => {
        const from = F(x.from);
        const dur = Math.max(1, F(Math.min(x.to, 999)) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            {x.draw(dur)}
          </Sequence>
        );
      })}
      {shot?.src && <Source text={shot.src} />}
      <Subtitles time={time} hot={hot} />
    </AbsoluteFill>
  );
};
