# anim — bản thử hai kiểu video bản đồ (chưa phải một phần của máy dựng)

Chủ kênh, 26/11/2026, cho **một kênh mới, "kênh bản đồ"** (chưa có trong sổ 14 kênh `docs/KENH-NHAT.md`; chưa có
tên, chưa có repo). Thư mục này là hai bản thử, **chưa được duyệt**: máy dựng (`news/`), workflow và kênh 10 không
dùng tới nó.

1. **Kiểu khung (`layout` mặc định, `stage/index.html`)**: theo video TikTok của @otona_study (「大人の教養」): tiêu
   đề đứng yên ở trên, khung hình động ở giữa (bản đồ vẽ, biểu đồ, nhân vật), phụ đề chữ vàng ở dưới. Chủ kênh:
   "Video dạng này m dựng đc ko", rồi gửi 6 hình samurai trên nền xanh: "Dùng tạm hình này". Bản thử
   `trials/moshimo-ww2` (20 giây).
2. **Kiểu bản đồ kín màn hình (`"layout": "map"`, `stage/map.html`)**: theo video TikTok của @nekosukizugi
   (「同じ愛知県なのに？」): ảnh vệ tinh làm nền, một tỉnh nổi lên và được tô màu từng vùng, đường ranh, nhãn, bong
   bóng lời; chữ to đổi theo từng ý ở trên, phụ đề nhỏ ở dưới. Chủ kênh: "Dạng này có làm đc ko, cũng là bản đồ". Bản
   thử `trials/aichi-owari-mikawa` (21 giây).

## Cách chạy
```
cd anim && npm install            # bản đồ thế giới (world-atlas), d3-geo, phông Noto Sans JP và Shippori Mincho B1
docker run -d --network host voicevox/voicevox_engine:cpu-0.26.1     # giọng đọc, cổng 50021
python anim/voice.py anim/trials/<tên>.json <out>                    # <out>/voice.wav, timing.json
node anim/render.cjs <tên> <out> --sheet 12                          # 12 ảnh tĩnh để soát, <out>/stills/
node anim/render.cjs <tên> <out>                                     # <out>/video.mp4 (1080×1920, 30 hình/giây)
```
Cần Chromium của Playwright (`require('playwright')`), ffmpeg, và `pip install -r requirements.txt` (voice.py dùng
`news/voice.py` để biết giọng đọc tới chữ nào lúc nào). 20 giây vẽ mất khoảng 1,5 phút (kiểu khung) hoặc 3 phút (kiểu
bản đồ kín màn hình).

Kiểu bản đồ kín màn hình cần thêm, trước khi vẽ (ví dụ của bản thử Aichi):
```
python anim/tiles.py <out>/map japan:9:128.6,30.2,146.4,45.9:2 mid:9:134.5,32.5,140.5,37.5 near:11:136.2,34.0,138.4,36.0
mkdir -p <out>/geo && B=https://raw.githubusercontent.com/smartnews-smri/japan-topography/main/data/municipality/topojson/s0010
curl -s -o <out>/geo/aichi.json $B/N03-21_23_210101.json && curl -s -o <out>/geo/prefectures.json $B/prefectures.json
```
- `tiles.py` tải ảnh vệ tinh của **国土地理院** (`cyberjapandata.gsi.go.jp`, lớp seamlessphoto) cho từng vùng: cả nước
  Nhật (mức 9, thu nhỏ một nửa), miền trung, và tỉnh cần nói (mức 11). Mức 8 trở xuống là ảnh ghép cả thế giới, màu
  khác và biển loang: đừng dùng. Phiên Claude trên mây phải dùng môi trường **`japan-map-channel`** (chủ kênh duyệt
  26/11/2026) mới tải được; môi trường Default bị chặn. Máy GitHub tải được.
- Ranh giới tỉnh và thành phố: `smartnews-smri/japan-topography` (làm từ 国土数値情報 行政区域 của Bộ Đất đai Nhật, mỗi
  tỉnh một file `N03-21_<số tỉnh>_210101.json`). Vùng cũ (尾張, 三河…) là gộp các thành phố lại, danh sách ghi trong
  file cảnh.
- **Ghi nguồn trong video và caption**: `地図: 国土地理院` (ảnh nền) và `国土数値情報（行政区域）` (ranh giới).

## Các phần
- `trials/<tên>.json`: lời đọc. Mỗi `chunks` là một phụ đề; `[...]` là chữ vàng (`[o|...]` cam, `[g|...]` xanh lá,
  `[b|...]` xanh dương), `\n` là xuống dòng. `tag`, `title`: dòng nhỏ và tiêu đề ở trên (kiểu khung). `heads`: chữ to
  ở trên của kiểu bản đồ kín màn hình. `says`: cách đọc của một phụ đề khi máy đọc sai chữ (豊田 → とよた). `voice`,
  `pace`: giọng VOICEVOX và tốc độ.
- `trials/<tên>.js`: các cảnh, tức là vẽ gì trong lúc mỗi câu được đọc. Mọi mốc thời gian lấy từ giọng đọc
  (`L.<câu>.start`, `L.<câu>.chunks[n].start`), không gõ tay số giây.
- `stage/engine.js`: dòng thời gian (`seek(t)` dựng lại toàn bộ hình ở giây t, nên hình nào cũng giống nhau trên mọi
  máy), tiêu đề, phụ đề, nhân vật (đứng thở nhẹ, nhún khi đổi tư thế, chui xuống rồi nhô lên khi đổi chỗ).
- `stage/satmap.js` (kiểu bản đồ kín màn hình): ảnh vệ tinh chỉ giữ phần đất (biển là màu nền, có quầng sáng ven
  bờ), máy quay bay từ cả nước xuống một tỉnh (`cam = {lon, lat, z}`), vùng nổi lên có bóng và đổi màu (`region`,
  `tint`), đường ranh vẽ dần (`line`), nhãn có vạch chỉ (`pin`), bong bóng lời và con dấu tên nước cũ (`say`), màn
  đêm cho đoạn kể chuyện xưa (`night`). Chữ to ở trên là `heads` trong file lời, mỗi phụ đề một cái.
- `stage/parts.js` (kiểu khung): các món vẽ sẵn: bản đồ có máy quay (tô màu nước, gắn nhãn, vòng sáng), hình hai nước cùng một tỉ
  lệ, cột so sánh, biểu đồ vòng, thùng dầu, tàu chiến, máy bay, đồng hồ xăng.
- `char/samurai-<tư thế>.webp`: 6 tư thế chủ kênh gửi (odoroki ngạc nhiên, shoukai chìa tay, udegumi khoanh tay,
  yubi giơ ngón tay, good giơ ngón cái, tachi đứng), đã tách nền bằng `python anim/key.py`.
- `render.cjs`: mở trang trong Chromium, chụp từng hình, ffmpeg ghép với giọng đọc.

## Điều còn thiếu so với một video thật
- Mỗi cảnh đang được viết tay cho đúng nội dung của nó; chưa có dạng kịch bản chung như `stories/*.json`.
- Kiểu bản đồ kín màn hình: chưa có các hình nhỏ nổi 3D (lâu đài, nhà máy) và người hoạt hình nói chuyện như video
  gốc; ranh giới thành phố là bản đã làm thưa (1%), sát bờ biển có chỗ lệch nhẹ so với ảnh; sông, đường sắt, ranh
  giới thời xưa phải tìm dữ liệu riêng cho từng video.
- Chưa có nhạc, tiếng động, caption đăng bài, credits; chưa chạy trên GitHub (mới dựng trong phiên làm việc).
- 6 hình nhân vật không giống hệt nhau (tóc nâu và tóc đen, một hình có áo choàng, thắt lưng trắng và đỏ): chủ
  kênh nói là hình tạm.
- Số liệu của bản thử (GDP Mỹ khoảng 5 lần Nhật năm 1941 theo Maddison Project; Nhật nhập khoảng 9 phần 10 dầu) lấy
  theo video gốc và khớp với số liệu quen dùng; khi làm video thật phải soát lại từng số.
