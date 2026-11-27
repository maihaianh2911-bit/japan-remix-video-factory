/**
 * ─────────────────────────────────────────────────────────────
 *  KỊCH BẢN VIDEO — đổi chủ đề thì CHỈ sửa file này + thay ảnh.
 * ─────────────────────────────────────────────────────────────
 *
 * Quy ước viết chữ trên màn hình:
 *   {từ khóa}  → tô vàng
 *   \n         → xuống dòng (tiếng Nhật nên tự ngắt dòng cho đẹp)
 *
 * Mọi mốc thời gian tính bằng GIÂY, tính từ đầu video.
 * File này là dữ liệu thuần (không import React/Remotion).
 */

export type SceneBase = {
  /** Tên ngắn, cũng là tên file ảnh: public/images/<id>.jpg */
  id: string;
  /** Giây bắt đầu / kết thúc cảnh */
  start: number;
  end: number;
  /** Đường dẫn ảnh trong public/ */
  image: string;
  /** Câu tìm ảnh đã dùng (dán vào "searches" của một story để máy tìm ảnh của repo chạy; xem README) */
  imageQuery: string[];
  /** Điểm giữ lại khi cắt dọc + tâm zoom (CSS object-position), mặc định "50% 40%" */
  imagePosition?: string;
  /**
   * Phóng to ảnh sẵn từ đầu (mặc định 1). Dùng cùng imagePosition để đẩy người trong ảnh
   * lên nửa trên màn hình: vd imagePosition "50% 100%" + imageZoom 1.3 = giữ mép dưới, cắt bớt phía trên.
   */
  imageZoom?: number;
  /** Lời đọc (để thu giọng / đưa vào TTS). Không hiển thị trên màn hình. */
  narration: string;
};

export type HookScene = SceneBase & {
  type: 'hook';
  headline: string;
};

export type TitleScene = SceneBase & {
  type: 'title';
  headline: string;
  /** Dòng phụ trên nền vàng */
  sub: string;
  /** Giây dòng phụ bật vào */
  subAt: number;
};

export type ExplainPhrase = {
  /** Một cụm trong hộp giải thích; kết thúc bằng \n nếu muốn xuống dòng sau cụm */
  text: string;
  /** Giây cụm này bắt đầu được đọc → sáng lên */
  at: number;
};

export type SignScene = SceneBase & {
  type: 'sign';
  /** Số thứ tự hiện trên huy hiệu 「サイン1」 */
  number: number;
  headline: string;
  /** Giây chữ chính bật vào (mặc định: start + 0.35) */
  headlineAt?: number;
  explain: ExplainPhrase[];
};

export type Scene = HookScene | TitleScene | SignScene;

export type VideoScript = {
  /** Số dấu hiệu của cả video (số chấm tiến độ) */
  totalSigns: number;
  /** Dòng nguồn nhỏ dưới mỗi cảnh */
  source: string;
  /**
   * File giọng đọc trong public/ (vd 'voice.mp3'). Để null khi chưa có.
   * Xem README mục "Thêm giọng đọc".
   */
  voiceFile: string | null;
  /** Âm lượng giọng đọc và hiệu ứng (0–1) */
  voiceVolume: number;
  sfxVolume: number;
  scenes: Scene[];
};

export const script: VideoScript = {
  totalSigns: 5,
  source: '出典:厚生労働省「健康づくりのための睡眠ガイド2023」',
  voiceFile: null,
  voiceVolume: 1,
  sfxVolume: 0.55,

  scenes: [
    {
      type: 'hook',
      id: 'hook',
      start: 0,
      end: 3.5,
      image: 'images/hook.jpg',
      imageQuery: ['web:pexels asian woman tired rubbing eyes => an Asian woman rubbing her tired eyes, photograph'],
      imagePosition: '50% 100%',
      imageZoom: 1.15,
      headline: 'その眠気、\n{ただの疲れ}\nじゃないかも…?',
      narration: 'その眠気、ただの疲れじゃないかも…?',
    },
    {
      type: 'title',
      id: 'title',
      start: 3.5,
      end: 7,
      image: 'images/title.jpg',
      imageQuery: ['web:眠れない 夜 ベッド 女性 フリー写真素材 => an Asian woman lying awake in bed at night, photograph'],
      imagePosition: '50% 100%',
      imageZoom: 1.18,
      headline: '{睡眠不足}の\nサイン{5選}',
      sub: 'あなたはいくつ当てはまる?',
      subAt: 5.0,
      narration: '睡眠不足のサイン5選。あなたはいくつ当てはまる?',
    },
    {
      type: 'sign',
      id: 'sign1',
      number: 1,
      start: 7,
      end: 13.5,
      image: 'images/sign1.jpg',
      imageQuery: ['web:pexels asian woman sleeping in bed morning sunlight => an Asian person sleeping in bed in a bright sunlit bedroom, photograph'],
      imagePosition: '50% 30%',
      headline: '休日に{長く}\n{寝て}しまう',
      headlineAt: 7.35,
      explain: [
        { text: 'この“寝だめ”は、\n', at: 9.9 },
        { text: '慢性的な睡眠不足の', at: 10.9 },
        { text: 'サイン', at: 12.2 },
      ],
      narration:
        'サイン1。休日に長く寝てしまう。この“寝だめ”は、慢性的な睡眠不足のサイン。',
    },
    {
      type: 'sign',
      id: 'sign2',
      number: 2,
      start: 13.5,
      end: 20,
      image: 'images/sign2.jpg',
      imageQuery: ['web:pexels asian office worker sleepy at desk laptop => an Asian office worker dozing at a desk with a laptop, photograph'],
      imagePosition: '50% 35%',
      headline: '日中に{強い}\n{眠気}がある',
      headlineAt: 13.85,
      explain: [
        { text: '強い眠気が続くときは\n', at: 16.4 },
        { text: '医療機関に相談を', at: 17.9 },
      ],
      narration:
        'サイン2。日中に強い眠気がある。強い眠気が続くときは医療機関に相談を。',
    },
  ],
};

/** Tổng thời lượng (giây) = mốc kết thúc của cảnh cuối. */
export const totalSeconds = script.scenes[script.scenes.length - 1].end;
