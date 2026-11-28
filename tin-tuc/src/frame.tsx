// Khung chung của mọi video tin: giấy, tên kênh, các cảnh theo giọng đọc, dòng nguồn, phụ đề tô đỏ.
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { useFonts } from './fonts';
import { FPS, Time } from './time';
import { C, K, Masthead, Paper, SANS, Source } from './kit';

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
    <div style={{ position: 'absolute', top: K.y + K.h + 80, left: 70, width: 860, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.text.length > 16 ? 50 : 56, lineHeight: 1.35 }}>
      {[...c.text].map((ch, i) => {
        const said = t >= line.start + line.chars[c.b + i][0];
        return (
          <span key={i} style={{ color: said ? (hot.has(i) ? C.red : C.ink) : '#a39a8c' }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const NewsFrame: React.FC<{ time: Time; shots: Shot[]; hot: string[]; glyphs: string }> = ({ time, shots, hot, glyphs }) => {
  useFonts(time.LINES.map((l) => l.text).join('') + '数字で読むニュース報出典' + glyphs);
  const t = useCurrentFrame() / FPS;
  const shot = shots.find((x) => t >= x.from && t < x.to);
  return (
    <AbsoluteFill>
      <Paper />
      <Masthead />
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
