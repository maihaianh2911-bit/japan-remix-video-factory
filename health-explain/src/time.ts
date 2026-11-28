// Mốc thời gian của giọng đọc: mỗi video có file timing riêng (src/videos/<tên>.timing.json,
// chép từ stories/<tên>/out/timing.json sau khi thu giọng).
export const FPS = 30;

export type Line = { text: string; start: number; end: number; chars: [number, number][] };
export type Chunk = { text: string; start: number; end: number; li: number; b: number };
export type Timing = { duration: number; lines: Line[] };

export const makeTime = (timing: { duration: number; lines: unknown[] }) => {
  const lines = timing.lines as Line[];
  const find = (i: number, words: string, nth: number) => {
    const l = lines[i];
    let idx = -1;
    for (let k = 0; k <= nth; k++) idx = l.text.indexOf(words, idx + 1);
    if (idx < 0) throw new Error(`"${words}" không có trong câu ${i}: ${l.text}`);
    return idx;
  };
  /** Giây bắt đầu / kết thúc câu i. */
  const s = (i: number) => lines[i].start;
  const e = (i: number) => lines[i].end;
  /** Giây giọng đọc bắt đầu nói cụm `words` trong câu i. */
  const at = (i: number, words: string, nth = 0) => lines[i].start + lines[i].chars[find(i, words, nth)][0];
  /** Giây giọng đọc nói xong cụm `words` trong câu i. */
  const to = (i: number, words: string, nth = 0) => {
    const idx = find(i, words, nth);
    return lines[i].start + lines[i].chars[idx + words.length - 1][1];
  };
  /** Các cụm phụ đề: cắt câu ở 、。 rồi gộp cụm ngắn. */
  const chunks: Chunk[] = [];
  lines.forEach((l, li) => {
    let cur = '';
    let b = -1;
    const flush = (endIdx: number) => {
      const t = cur.replace(/[、。]$/, '');
      if (t) chunks.push({ text: t, start: l.start + l.chars[b][0], end: l.start + l.chars[endIdx][1], li, b });
      cur = '';
      b = -1;
    };
    [...l.text].forEach((ch, k) => {
      if (b < 0) b = k;
      cur += ch;
      const plain = cur.replace(/[、。]/g, '');
      if ((ch === '、' || ch === '。') && (plain.length >= 7 || ch === '。' || ch === '？')) flush(k);
    });
    if (cur) flush(l.text.length - 1);
  });
  return { s, e, at, to, chunks, LINES: lines, DURATION: timing.duration };
};

export type Time = ReturnType<typeof makeTime>;
