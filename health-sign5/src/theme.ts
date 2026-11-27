/**
 * Màu, font, kích thước và chuyển động dùng chung cho mọi video của kênh.
 * Muốn đổi "bộ nhận diện" của kênh thì chỉ sửa file này.
 */
export const theme = {
  video: {
    width: 1080,
    height: 1920,
    fps: 30,
  },

  /**
   * Vùng an toàn TikTok (px). Chữ quan trọng không được nằm trong các dải này:
   * - bottom 380px: caption, tên kênh, thanh nhạc
   * - right 140px: cột nút tim / bình luận / chia sẻ
   * - top 150px: thanh "Đang follow / Dành cho bạn"
   */
  safe: {
    top: 150,
    bottom: 380,
    left: 60,
    right: 140,
  },

  colors: {
    accent: '#FFD60A', // vàng: huy hiệu, từ khóa
    accentDark: '#1A1300', // chữ trên nền vàng
    text: '#FFFFFF',
    stroke: '#000000',
    textDim: 'rgba(255,255,255,0.34)', // cụm chưa được đọc
    boxBg: 'rgba(8, 12, 20, 0.66)',
    boxBorder: 'rgba(255,255,255,0.16)',
    source: 'rgba(255,255,255,0.86)',
    dotOff: 'rgba(255,255,255,0.42)',
  },

  font: {
    family: '"Noto Sans JP", sans-serif',
    title: 900,
    body: 700,
    small: 500,
  },

  size: {
    headline: 136, // chữ chính của cảnh サイン (tự thu nhỏ nếu dòng quá dài)
    hook: 112,
    title: 156,
    titleSub: 52,
    explain: 50,
    badge: 56,
    source: 27,
    headlineStroke: 20, // bề dày viền đen (px, tính cả hai phía)
  },

  motion: {
    transitionFrames: 10, // mờ + trượt ngang giữa hai cảnh
    slidePx: 64,
    kenBurnsFrom: 1.0,
    kenBurnsTo: 1.08,
    // spring "bật nảy" cho chữ chính
    pop: { damping: 10, stiffness: 170, mass: 0.7 },
    // spring êm cho hộp giải thích, huy hiệu
    soft: { damping: 16, stiffness: 140, mass: 0.8 },
  },
} as const;

export type Theme = typeof theme;
