# health-sign5 — video dọc 「〜のサイン5選」 (Remotion)

Khuôn video TikTok cho kênh sức khỏe tiếng Nhật: ảnh thật phủ kín màn hình + chữ, huy hiệu, hộp giải thích dựng bằng code.
Bản đang có: 20 giây đầu của 「睡眠不足のサイン5選」 (hook → tiêu đề → サイン1 → サイン2), 1080×1920, 30 fps, H.264 CRF 18.

Đây là **bản thử**, chưa phải một kênh của repo (không qua issue, không qua workflow dựng video).

## Chạy

```bash
cd health-sign5
npm install
npm run stills        # chụp 4 frame kiểm tra → out/stills/
npm run render        # → out/intro.mp4
npm run studio        # xem và tua từng frame trong trình duyệt
```

Trong phiên Claude trên mây, Remotion không tự tải được trình duyệt, phải chỉ tới Chrome có sẵn:

```bash
export REMOTION_FLAGS="--browser-executable=/usr/bin/google-chrome --chrome-mode=chrome-for-testing"
bash scripts/stills.sh
npx remotion render Intro out/intro.mp4 --codec=h264 --crf=18 $REMOTION_FLAGS
```

## Các file

| File | Việc của nó |
| --- | --- |
| `src/script.ts` | **Kịch bản**: lời đọc, chữ trên màn hình, mốc thời gian, nguồn, ảnh của từng cảnh |
| `src/theme.ts` | Màu, font, cỡ chữ, vùng an toàn TikTok, độ nảy của chữ |
| `src/scenes/` | Ba kiểu cảnh: `HookScene`, `TitleScene`, `SignScene` |
| `src/components/` | Ảnh zoom chậm, lớp tối, huy hiệu + chấm tiến độ, chữ chính, hộp giải thích, dòng nguồn, chuyển cảnh, âm thanh |
| `public/images/` | Ảnh của từng cảnh (`<id cảnh>.jpg`) |
| `public/sfx/` | Tiếng "pop" và "whoosh" (tạo lại bằng `npm run sfx`, dùng ffmpeg) |
| `credits.md` | Tên file, tác giả, link gốc của từng ảnh |
| `scripts/use-picks.mjs` | Chép ảnh đã chọn vào `public/images/` và ghi `credits.md` |

## Đổi chủ đề: chỉ sửa `src/script.ts` và thay ảnh

1. **Sửa `src/script.ts`.** Mỗi cảnh là một mục trong `scenes`:
   - `headline`: chữ chính. `{từ khóa}` = tô vàng, `\n` = xuống dòng (tự ngắt dòng cho đẹp, mỗi dòng khoảng 5–8 chữ).
   - `explain`: hộp giải thích, chia thành từng cụm; `at` là giây cụm đó được đọc (cụm sáng lên lúc ấy). Cụm kết thúc bằng `\n` thì xuống dòng.
   - `narration`: lời đọc (để thu giọng), không hiện trên màn hình.
   - `start`, `end`: giây bắt đầu và kết thúc cảnh. Thêm サイン3–5: chép một mục `type: 'sign'`, đổi `number`, `id`, `image`, mốc thời gian.
   - `source`: dòng nguồn nhỏ. `totalSigns`: số chấm tiến độ.
   - Chữ dài quá thì tự thu nhỏ cho vừa bề ngang, không tràn khỏi vùng an toàn.
2. **Tìm ảnh bằng máy tìm ảnh của repo** (Pexels và các trang ảnh chặn phiên Claude trên mây, nên việc tìm chạy trên GitHub):
   - Viết một story chỉ để tìm ảnh, như `stories/k10-2026-11-27-thu-suimin-sign5.json` (`"stage": "find"`, `"trial": true`), mỗi cảnh 1–2 câu trong `searches`, ví dụ
     `"web:pexels asian woman tired rubbing eyes => an Asian woman rubbing her tired eyes, photograph"`.
     Thêm chữ `pexels` vào câu tìm để ra ảnh Pexels (dùng tự do).
   - Đẩy lên `main`, chờ khoảng 5–8 phút, rồi lấy kết quả ở nhánh `renders`, thư mục `<tên story>/find/`
     (`git archive origin/renders <tên story>/find | tar -x -C <thư mục>`). Xem các tờ `sheet_<k>.jpg` để chọn.
   - Ảnh từ trang tìm kiếm của Pexels chỉ là bản nhỏ (500×750): thêm một câu
     `"url:https://images.pexels.com/photos/<số ảnh>/pexels-photo-<số ảnh>.jpeg?auto=compress&cs=tinysrgb&h=2400 https://www.pexels.com/photo/<số ảnh>/"` để lấy bản lớn.
3. **Chọn ảnh** (tự xem từng ảnh):
   - Người châu Á nếu có; không phải người nổi tiếng; không phải ảnh triệu chứng gây sốc.
   - **Mặt người nằm ở nửa trên của ảnh**: nửa dưới là chỗ của chữ.
   - Ảnh dọc từ 1080×1920 trở lên, hoặc ảnh ngang cao từ 1600 px.
4. **Đưa ảnh vào project**:
   ```bash
   node scripts/use-picks.mjs <thư mục find> hook=12-1 title=18-1 sign1=15-1 sign2=10-5
   ```
   Lệnh này chép ảnh thành `public/images/<id cảnh>.jpg` và ghi `credits.md`.
   Tên tác giả: mở link gốc của ảnh, rồi thêm một dòng vào `scripts/authors.json` và chạy lại lệnh.
5. **Canh ảnh** trong `script.ts` nếu mặt bị chữ che hoặc bị cắt:
   - `imagePosition`: điểm được giữ lại khi cắt dọc (ảnh ngang: `'30% 50%'` = lấy phần bên trái).
   - `imageZoom`: phóng to sẵn. `imagePosition: '50% 100%'` + `imageZoom: 1.15` = giữ mép dưới, cắt bớt phía trên, người trong ảnh được đẩy lên.
6. **Kiểm tra rồi mới render**: `npm run stills`, mở 4 ảnh trong `out/stills/`.
   `SAFE=1 npm run stills` tô đỏ vùng cấm đặt chữ (380 px dưới cùng, 140 px mép phải). Chụp frame khác: `bash scripts/stills.sh 100 420`.

## Thêm giọng đọc

1. Đặt file giọng vào `public/voice.mp3` (đọc theo các dòng `narration` trong `script.ts`).
2. Trong `src/script.ts` đổi `voiceFile: null` thành `voiceFile: 'voice.mp3'`. Âm lượng: `voiceVolume`; tiếng pop/whoosh: `sfxVolume`.
3. **Chỉnh mốc thời gian theo giọng.** Tìm giây bắt đầu của từng câu bằng một trong hai cách:
   - `npm run studio`, tua và nghe, ghi lại giây;
   - hoặc liệt kê các chỗ ngắt giọng:
     ```bash
     ffmpeg -i public/voice.mp3 -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1 | grep silence_end
     ```
     mỗi `silence_end` là giây một câu (hoặc một cụm) bắt đầu.
4. Ghi các giây đó vào `script.ts`:
   - `start` của cảnh = lúc câu đầu của cảnh bắt đầu (trừ đi khoảng 0.2 giây để ảnh kịp hiện); `end` = `start` của cảnh sau.
   - `headlineAt` = lúc đọc chữ chính; `subAt` (cảnh tiêu đề) = lúc đọc dòng phụ.
   - `explain[].at` = lúc đọc từng cụm trong hộp giải thích.
   - `end` của cảnh cuối = độ dài video (video tự dài đúng bằng mốc này).
5. `npm run stills` ở vài frame, rồi `npm run render`.

## Ghi chú

- Font: Noto Sans JP (`@fontsource/noto-sans-jp`), chữ tiêu đề weight 900.
- Mỗi cảnh: ảnh zoom chậm 1.0 → 1.08, lớp tối từ giữa xuống dưới, chữ chính bật nảy bằng `spring()`, chuyển cảnh mờ + trượt ngang 10 frame.
- Nội dung bản 睡眠不足: theo tờ hướng dẫn của 厚生労働省 「健康づくりのための睡眠ガイド2023」 (bản cho người lớn):
  buồn ngủ nhiều ban ngày và thói quen ngủ bù cuối tuần là dấu hiệu thiếu ngủ kéo dài — https://www.mhlw.go.jp/content/001288005.pdf
- Ảnh hiện có đều từ Pexels (giấy phép Pexels: dùng tự do, không bắt buộc ghi nguồn); tác giả và link ở `credits.md`.
