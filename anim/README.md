# anim — bản thử kiểu video hoạt hình (chưa phải một phần của máy dựng)

Chủ kênh, 26/11/2026: gửi một video TikTok của @otona_study (「大人の教養」: tiêu đề đứng yên ở trên, khung hình
động ở giữa với bản đồ, biểu đồ và một nhân vật hoạt hình, phụ đề chữ vàng ở dưới) và hỏi "Video dạng này m dựng đc
ko", rồi gửi 6 hình samurai trên nền xanh: "Dùng tạm hình này". Thư mục này là bản thử 20 giây của kiểu đó.
**Chưa được duyệt, chưa gắn với kênh nào**: máy dựng (`news/`), workflow và các kịch bản của kênh 10 không dùng tới nó.

## Cách chạy
```
cd anim && npm install            # bản đồ thế giới (world-atlas), d3-geo, phông Noto Sans JP và Shippori Mincho B1
docker run -d --network host voicevox/voicevox_engine:cpu-0.26.1     # giọng đọc, cổng 50021
python anim/voice.py anim/trials/moshimo-ww2.json <out>              # <out>/voice.wav, timing.json
node anim/render.cjs moshimo-ww2 <out> --sheet 12                    # 12 ảnh tĩnh để soát, <out>/stills/
node anim/render.cjs moshimo-ww2 <out>                               # <out>/video.mp4 (1080×1920, 30 hình/giây)
```
Cần Chromium của Playwright (`require('playwright')`), ffmpeg, và `pip install -r requirements.txt` (voice.py dùng
`news/voice.py` để biết giọng đọc tới chữ nào lúc nào). 20 giây vẽ mất khoảng 1,5 phút.

## Các phần
- `trials/<tên>.json`: lời đọc. Mỗi `chunks` là một phụ đề; `[...]` là chữ vàng, `\n` là xuống dòng. `tag`, `title`:
  dòng nhỏ và tiêu đề ở trên. `voice`, `pace`: giọng VOICEVOX và tốc độ.
- `trials/<tên>.js`: các cảnh, tức là vẽ gì trong lúc mỗi câu được đọc. Mọi mốc thời gian lấy từ giọng đọc
  (`L.<câu>.start`, `L.<câu>.chunks[n].start`), không gõ tay số giây.
- `stage/engine.js`: dòng thời gian (`seek(t)` dựng lại toàn bộ hình ở giây t, nên hình nào cũng giống nhau trên mọi
  máy), tiêu đề, phụ đề, nhân vật (đứng thở nhẹ, nhún khi đổi tư thế, chui xuống rồi nhô lên khi đổi chỗ).
- `stage/parts.js`: các món vẽ sẵn: bản đồ có máy quay (tô màu nước, gắn nhãn, vòng sáng), hình hai nước cùng một tỉ
  lệ, cột so sánh, biểu đồ vòng, thùng dầu, tàu chiến, máy bay, đồng hồ xăng.
- `char/samurai-<tư thế>.webp`: 6 tư thế chủ kênh gửi (odoroki ngạc nhiên, shoukai chìa tay, udegumi khoanh tay,
  yubi giơ ngón tay, good giơ ngón cái, tachi đứng), đã tách nền bằng `python anim/key.py`.
- `render.cjs`: mở trang trong Chromium, chụp từng hình, ffmpeg ghép với giọng đọc.

## Điều còn thiếu so với một video thật
- Mỗi cảnh đang được viết tay cho đúng nội dung của nó; chưa có dạng kịch bản chung như `stories/*.json`.
- Chưa có nhạc, tiếng động, caption đăng bài, credits; chưa chạy trên GitHub (mới dựng trong phiên làm việc).
- 6 hình nhân vật không giống hệt nhau (tóc nâu và tóc đen, một hình có áo choàng, thắt lưng trắng và đỏ): chủ
  kênh nói là hình tạm.
- Số liệu của bản thử (GDP Mỹ khoảng 5 lần Nhật năm 1941 theo Maddison Project; Nhật nhập khoảng 9 phần 10 dầu) lấy
  theo video gốc và khớp với số liệu quen dùng; khi làm video thật phải soát lại từng số.
