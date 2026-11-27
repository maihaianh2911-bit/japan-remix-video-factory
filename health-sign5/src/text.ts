/** Tiện ích xử lý chữ: tách {từ khóa}, ngắt dòng, tự co cỡ chữ cho vừa bề ngang. */

export type Segment = { text: string; accent: boolean };
export type Line = Segment[];

/** "休日に{長く}\n{寝て}しまう" → [[休日に, 長く*], [寝て*, しまう]] */
export const parseRich = (raw: string): Line[] =>
  raw.split('\n').map((line) => {
    const segments: Segment[] = [];
    const re = /\{([^}]*)\}|([^{]+)/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(line)) !== null) {
      if (m[1] !== undefined) segments.push({ text: m[1], accent: true });
      else if (m[2]) segments.push({ text: m[2], accent: false });
    }
    return segments;
  });

export const plainText = (raw: string): string => raw.replace(/[{}]/g, '');

/**
 * Bề ngang ước lượng của một dòng, tính bằng "em".
 * Chữ Nhật / dấu toàn chiều = 1em, chữ số & Latin ≈ 0.62em (Noto Sans JP đậm).
 */
export const lineWidthEm = (line: string): number => {
  let em = 0;
  for (const ch of line) {
    const code = ch.codePointAt(0) ?? 0;
    em += code < 0x2000 ? 0.62 : 1;
  }
  return em;
};

/**
 * Cỡ chữ lớn nhất không vượt `base` mà dòng dài nhất vẫn nằm gọn trong `maxWidth`.
 * Nhờ vậy đổi chủ đề, chữ dài hơn cũng không tràn khỏi vùng an toàn.
 */
export const fitFontSize = (raw: string, base: number, maxWidth: number): number => {
  const widest = Math.max(...plainText(raw).split('\n').map(lineWidthEm), 1);
  return Math.floor(Math.min(base, maxWidth / widest));
};
