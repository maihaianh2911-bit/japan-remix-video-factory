// Mốc thời gian của giọng đọc (copy từ story/out/timing.json sau khi thu giọng).
import timing from './timing.json';

export const FPS = 30;

type Line = { text: string; start: number; end: number; chars: [number, number][] };
const lines = timing.lines as unknown as Line[];

export const DURATION = timing.duration as number;
export const LINES = lines;

/** Giây bắt đầu / kết thúc câu i. */
export const s = (i: number) => lines[i].start;
export const e = (i: number) => lines[i].end;

/** Giây giọng đọc bắt đầu nói cụm `words` trong câu i (lần xuất hiện thứ `nth`). */
export const at = (i: number, words: string, nth = 0): number => {
  const l = lines[i];
  let idx = -1;
  for (let k = 0; k <= nth; k++) idx = l.text.indexOf(words, idx + 1);
  if (idx < 0) throw new Error(`"${words}" không có trong câu ${i}: ${l.text}`);
  return l.start + l.chars[idx][0];
};

/** Giây giọng đọc nói xong cụm `words` trong câu i. */
export const to = (i: number, words: string, nth = 0): number => {
  const l = lines[i];
  let idx = -1;
  for (let k = 0; k <= nth; k++) idx = l.text.indexOf(words, idx + 1);
  if (idx < 0) throw new Error(`"${words}" không có trong câu ${i}: ${l.text}`);
  return l.start + l.chars[idx + words.length - 1][1];
};

/** Các cụm phụ đề: cắt câu ở 、。 rồi gộp cụm ngắn, mỗi cụm có giây bắt đầu/kết thúc. */
export type Chunk = { text: string; start: number; end: number; li: number; b: number };
export const chunks: Chunk[] = (() => {
  const out: Chunk[] = [];
  lines.forEach((l, li) => {
    let cur = '';
    let b = -1;
    const flush = (endIdx: number) => {
      const t = cur.replace(/[、。]$/, '');
      if (t) out.push({ text: t, start: l.start + l.chars[b][0], end: l.start + l.chars[endIdx][1], li, b });
      cur = '';
      b = -1;
    };
    [...l.text].forEach((ch, k) => {
      if (b < 0) b = k;
      cur += ch;
      const plain = cur.replace(/[、。]/g, '');
      if ((ch === '、' || ch === '。') && (plain.length >= 9 || ch === '。')) flush(k);
    });
    if (cur) flush(l.text.length - 1);
  });
  // nối liền: cụm sau bắt đầu thì cụm trước tắt, cụm cuối của câu giữ tới câu sau
  return out;
})();
