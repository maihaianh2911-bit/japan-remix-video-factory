# japan-remix-video-factory — notes for Claude

## Iron rules (owner, 16/11/2026) — they come before everything else in this file
1. **The video is in the channel's language: Japanese (tiếng Nhật).** The voice is the channel's Japanese VOICEVOX voice (`voice` in `channels/<id>.json`: **もち子さん for k10** since 25/11/2026: the owner
   first chose a female voice after a trial, 冥鳴ひまり ("Giọng nữ nào cg ổn"), then the same day the voice chosen for
   the imperial-family videos of `japan-news-video-factory`, もち子さん: "tao vừa chốt voice ở chat hoàng gia nhật, m
   có lấy voice nữ đó luôn đc ko"), and the script lines, subtitles and
   on-screen text are in Japanese (tiếng Nhật). A script that arrives in another language is translated faithfully into Japanese (tiếng Nhật)
   first. Never a voice or text of another language: check the language of `lines` and the voice before the voice
   step, and again on the finished video. A video in the wrong language is not delivered: fix it and render again.
2. **No video under 61 seconds** (owner, 19/11/2026: "luật chỉ còn tối thiểu 61s thôi"). Before the voice step,
   estimate the length from the script (use the seconds per line of this channel's earlier videos); after the voice
   step, read the real length of the speech (the machine comment gives it). If the video would be under 61 seconds,
   **write the script longer** (more true facts and detail on the same subject, in the owner's tone, nothing
   invented) until it passes 61 seconds, tell the owner on the issue what was added, and only then go on (a script
   may be changed for this as for any improvement, see the rule changes of 19/11/2026). Never render or deliver a video under 61 seconds. Only
   exception: a trial or sample video — the owner says so, or the issue title or notes say `thử`, `mẫu`, `test` or
   `demo`.
3. **Every video is vertical (1080×1920) and short: a little over 61 seconds** (owner, 19/11/2026: "làm video ít
   nhất 61s thôi, cuốn hút vào", then for every video "tất cả video, giảm xuống, luật chỉ còn tối thiểu 61s thôi";
   this replaces the 80–160 s of 18/11/2026). Write the script for about 63–70 s (a margin over 61 s for the
   estimate): keep the story's thread and its most gripping details, cut the rest; never pad. There is no upper
   limit in the machine, but a script that runs long is cut, not delivered long. Trial or sample videos are the
   exception, as in rule 2.

The machine holds to rule 2 too: `python -m news` refuses a voice under 61 s (the run fails and the issue says why)
unless the story carries `"trial": true` (a trial or sample, as rule 2 says).

**"Viết kịch bản" means the script only** (owner, 24/11/2026, after Claude opened issues and started the picture
search on "viết tiếp 2 kịch bản": "tìm ảnh làm … gì? viết kịch bản cơ mà"): when the owner asks for scripts, write
them in the chat (Japanese, then the Vietnamese meaning) and stop there. No issue, no story file, no picture search,
no video until the owner says to make the video ("làm đi", "làm video").

## The owner's rule changes of 19/11/2026 — they win over any older sentence in this file or in `AGENT_REMIX.md`
The owner read the list of the hard rules and said of six of them "mấy cái này ko hợp lí", then chose what replaces
each (the same in every repo of the owner's Japanese channels):
1. **A script the owner sends may be improved** (owner: "Sửa cả kịch bản tao gửi"): Claude may cut, add and rewrite
   it so that it is better and more gripping, keeping the owner's story and main idea. It is no longer translated
   sentence by sentence and left as it is. Say in the chat or on the issue what was changed.
   **Narrowed on 21/11/2026 for a script the owner writes and sends as text** (owner, after a Diana script was
   tightened: "ko sửa gì cả, nếu thêm thì thêm ở đoạn gần cuối cho đủ 61s thôi, k sửa nhiều", then "nếu sai tên
   hoặc sai chữ thì cũng đc sửa nhé"): keep it word for word, its hook line too (the hook-length warning is then
   left as it is and the closing comment says why); fix only a wrong name, a wrong fact or a wrong character; if it
   would be under 61 s, add a true line or two near the end, no more. A source video the owner sends is still
   retold in our own words, as before.
2. **Rumours and unconfirmed details may be told on every channel** (owner: "Dùng tin đồn ở mọi kênh"; k10 since
   the morning of 19/11): framed as told at the key line (「…と噂されています」, 「…といいます」, 「週刊誌によると」), and the
   posting caption says so in a ※ note (which part is a rumour, what is known).
3. **The telling may be dramatised** (owner: "Thêm thắt cho kịch tính"): feelings, a narrator's lead-in, suspense,
   the order of the telling. The one line that stays: an event or a quote of a real person is never made up and
   told as a fact.
4. **The ending is free** (owner: "Tự do, miễn hay"): whatever ends this story best — a line that stays, a last
   surprising detail, a return to the opening, a question to the viewer, a lead to the next video. No fixed form,
   and not the same one on every video.
5. **The voice and the music of a video the owner sends may be used**, as its pictures and footage are (owner:
   "Được dùng cả nhạc và giọng"). The owner was told the risk: music under copyright is recognised by YouTube
   (a muted video, lost revenue, a strike), and the more of the source a video carries, the more it counts as
   reused content. The engine cannot put a sound of the source into a video yet (its music comes from a `music:`
   search, its voice from VOICEVOX): like moving footage, that needs new code and a trial the owner approves.
6. **Pictures a scene** (owner: "nếu nội dung quá 6s thì phải tìm 2 ảnh, dưới 6s thì 1 ảnh cũng đc, tự do"): a
   scene whose words last over 6 seconds has at least two pictures; under 6 seconds one is enough; more is free.
   `python -m news.custom` warns of a scene over 6 seconds (estimated from its characters) with one picture.

## The picture rules of the edit (owner, 19/11/2026: "hook 5s đầu phải là ảnh đẹp, rồi ảnh k bị mất mặt") — approved one by one
Each rule is a question a look at the picture answers with yes or no. A picture that fails one is not used as it
is: frame it again, pick another, or search again.

**The first picture (the hook, about the first 5 seconds)**
1. It is the best picture of the whole video: sharp, bright, not blurred, not grainy.
2. It shows the face of the main person clearly, or a place or a thing the Japanese audience recognises at once.
3. It matches the hook line: the right person, the story being told.
4. It is a photograph: not a newspaper page, a document, a collage with text or a picture with a logo.
5. The face is in the upper half of the frame, clear of the hook line printed on the foot of the picture.

**Faces (every scene)**
6. The whole face, forehead to chin, stays inside the frame for as long as the picture is shown, while it zooms or
   pans too.
7. The text on the picture (the headline of the scene, a quote, the captions) does not lie over a face.
8. In a picture of several people, the one being spoken of is the clearest; if not, frame that person or change
   the picture.
9. A scene about one person does not use a picture in which that person's face is very small.

**Every picture**
10. When no picture passes, search again (`web:`, `page:`, the owner's video); if there is still none, tell the
    owner which scene lacks one. A poor picture is never taken just to be done.

The owner turned down two more that were proposed, so they are **not** rules: "a picture is used only once in a
video, and two near-identical pictures are not put side by side", and "the last picture must be a fine one too".
A picture may be used again where it fits.

**What the machine watches** (the preview `python -m news --story … --stills …` prints a `warning:` for each; settle
every one before the render): the first picture under 900 px on one side, or shown whole / marked flat (rules 1 and
4); a face cut by the frame or leaving it during the move, with the `"focus"` that keeps it when there is one
(rule 6); a face under the headline or the hook line, or in the lower half of the first picture (rules 5 and 7).
The faces are found by `news/faces.py` (YuNet of OpenCV Zoo, the model is `news/face_yunet.onnx`); it needs
`pip install opencv-python-headless numpy`, and without it the preview says `note: faces not checked`: then look
at every face yourself. The machine does not see rules 2, 3, 8 and 9: those are for your eyes, at the review.
(`bash tools/check.sh` prints such warnings for the sample stories too: their pictures are small stand-ins.)

The owner is Vietnamese and not technical: answer in short, simple Vietnamese, no jargon. They write "tao" (I) and
"mày" (you); answer the same way, "tao" for yourself and "mày" for them. Their standing decisions are in
`maihaianh2911-bit/japan-video-factory` → `docs/HANDOVER.md`, and the plan of their 14 Japanese channels with the
decisions and risks of each, the script lessons and the hook rules in `docs/KENH-NHAT.md` of that repo (18/11/2026):
read it before any work on a channel of this repo. Real pictures only (never AI pictures), Claude looks at every
picture, quality is not traded for usage. **A colourised (restored) copy of a real black-and-white photo is a real
picture and is welcome** (owner, 26/11/2026, after asking why the pictures were all black and white: "tìm ảnh phục
dựng có màu đc ko", then "ảnh có màu ko tính là ảnh AI, ảnh AI tao nói đến là ảnh do chatgpt tạo ấy"): an "AI
picture" is one an image generator made up (ChatGPT and the like), never used. For the old years search the
colourised copy too (`web:… colorized`, `カラー化`) and prefer it when it is as sharp and shows the same moment.

## What this repo makes
Vertical Japanese shorts (1080×1920, a little over 61 s) for **one channel, k10 (世界の王室)**. Until 26/11/2026 it made
four (k8 芸能人3人, k9 ネット炎上, k10, k11 歴史のなぜ); the owner dropped three of them (26/11/2026: "tao đã bỏ cả 8 9 10
rồi, xoá phần này đi", and asked which, since k10 had two videos that day: "8, 9, 11 — giữ kênh 10"). Their channel
files, issue forms, labels, samples, stories and captions were taken out; the three channel files live on in
`tests/fixtures/channels/` as stand-in channels of `tools/channel_test.py` only. Never make a video for k8, k9 or
k11, and do not bring them back unless the owner asks. How a video is made:
the owner sends someone else's short or video, Claude retells it in its own words in Japanese (the same story and
facts, a better telling), finds real pictures, the machine voices it with VOICEVOX and renders it, and Claude checks
every scene. One issue `[K10] …` = one video of the channel. The machine steps
run in `.github/workflows/remix-video.yml` (results on the `renders` branch); Claude's steps at each label are in
`AGENT_REMIX.md`. The engine (`news/`, `tools/`) is the one of `maihaianh2911-bit/japan-news-video-factory` (Tin Nhật,
which retells the owner's morning source videos the same way), changed only for the channels: a fix to the engine is
made in both repos, by hand.

**The list of the videos made: `DA-LAM.md`** (owner, 26/11/2026: "xoá tất cả video đi (t đã lưu cả rồi), nhưng lưu cái
gì lại để khỏi dựng nhầm 1 video 2 lần"). The videos on the `renders` branch are deleted once the owner has saved
them (all of them on 26/11/2026), so the list at the root of `main` is the record: date, Japanese title, the idea in
Vietnamese, the story's name. **Before writing a script or opening an issue, read it**: a story that is already
there (the same people and the same story; the same people in another story is fine) is not made again — tell the
owner first. **In the push that sets `stage: "render"`, add the story's line** at the foot of the table (the story's
name between backticks): `python -m news.custom` warns of a story at stage render that is not in the list. Trials
and samples are not listed as videos. The story files stay in `stories/` as the scripts of the videos made.
**The chosen pictures stay too** (owner, 26/11/2026: "kho ảnh đã đc chọn thì để lại nhé"): the reviewed picks of the
eleven k10 videos made to 26/11/2026 are in `stories/media/library/<story>/` (175 pictures; `credits.txt` says for
each the scene it showed, its search, its page and author; a `.txt` on purpose: the workflow takes every
`.json` under `stories/` for a story). A new video about the same people looks there first and
takes a picture with a search `file:stories/media/library/<story>/<file>`; its credit is written by hand from
`credits.txt` (this engine credits a `file:` picture as 元動画: correct it in the caption's credit line and say so in
the closing comment). From now on, before a video is deleted from `renders`, its reviewed picks are saved there the
same way.

| Kênh | id, issue tag | What a video is | Reference channel (its videos are the sources) |
| --- | --- | --- | --- |
| 10 | `k10`, `[K10]` | 世界の王室: world royals, above all the British royal family and the old Chinese dynasties | 皇室の記憶 (@ImperialEcho-v1c) |

Each channel is a file `channels/<id>.json` (`news/channels.py`): its names, its issue tag, its VOICEVOX voice, the
hashtags every caption of it carries, `"edit": "tin-nhat"` (it edits as Tin Nhật does, below), and the defaults its
stories inherit (`style` `story`, the `kicker` 世界の王室, `pace` speed 1.2 with pauses of 0.1 and 0.2 s, the four
picture effects `fx`, and k10's own music and sound, below). **Looks and voices
of their own come later**: each channel may get additions on top of the Tin Nhật edit (a persistent title, its colours,
another voice) only after the owner approves a 20-second trial of it (owner, 18/11/2026).
Until then do not add any: the channel keeps the Tin Nhật edit, and its voice is もち子さん (owner 25/11/2026, the voice chosen
for the imperial-family videos of `japan-news-video-factory` from a sampler of 13 voices; 冥鳴ひまり before it that day;
on 26/11/2026 the owner turned that voice down for the imperial-family videos and went back to 青山龍星 there: for k10
the owner has not said so yet). A new look or voice is a change of the
channel file (and of the frame code when the look is new), never of each story.

### The rules and risks of the channel (`docs/KENH-NHAT.md`, told to the owner)
- **The channel retells** another channel's video: YouTube penalises reused content, so rewrite in our own words, add
  value (a clear meaning, our own angle). **The pictures and the footage of the video the owner sends may be
  used, and its voice and music too** (owner, 19/11/2026: "nếu repo nào đc dựng bằng cách remix video hoặc tao có gửi
  video, có thể sử dụng hình ảnh/video trong video tao gửi", then "Được dùng cả nhạc và giọng"; before that: a few
  pictures only, never the voice or the music): clean ones (a
  frame with the source's caption, logo or watermark over the picture is cropped clean or left), credited `元動画`.
  The more of the source's pictures a video shows, the higher the reused-content risk (told to the owner again on
  19/11): our own words, our own order and pictures of our own search beside them stay the rule.
  Never two channels on the same story: k10's Chinese side borders on channel 7 (the dark side of history,
  `japan-dark-history-video-factory`); k10 is never the Japanese imperial family (`japan-news-video-factory`).
- **k10 (世界の王室):** **rumours may be told**, tabloid ones too (owner, 19/11/2026: "đc dùng tin đồn, sẽ đính chính
  ở caption"; e.g. "Camilla plotted against Kate's parents"): the narration frames each one as told, once, at its key
  line (「…と噂されています」, 「…と報じられています」, 「週刊誌によると」), never as a fact; and **the posting caption corrects
  it** with a ※ note (section "Posting caption"): which part is a rumour, and what is known (denied by the palace,
  proven false, never confirmed). British royal photos are mostly press photos (copyright risk, as Tin
  Nhật's, accepted by the owner); Qing pictures are mostly out of copyright. The Chinese side is the old dynasties
  (Cixi, Wanrong, Puyi…), never a story channel 7 tells.
  **What got views** (owner, 25/11/2026: of the first nine k10 videos only one had views, `k10-2026-11-24-philip-elizabeth`,
  464 likes, 55 saves, 12 comments in 17 hours on TikTok): a lifelong love story of the royal best known in Japan
  (Elizabeth II and Philip), told on one arc from first meeting to death and the shared grave; a hook of 48
  characters with two numbers that make the contrast (13 years old, 73 years together) and one poignant image (alone
  at his funeral); the first picture the 1947 wedding portrait, the two looking at each other and smiling, faces
  large in the upper half; a real quote of the Queen; an ending that comes back to the opening; music that moves
  (Elgar's Nimrod; 青山龍星 then). The videos about prices, scandals, a trap, a little-known grandson or a king the
  Japanese audience does not know (Edward VIII, a love story too) had none. The same lesson as `masako-rikon` on Tin
  Nhật: a couple's love, with a famous face, an emotional moment in the first line. **From 26/11/2026 every k10
  video follows it** (owner, 25/11/2026: "Oke từ ngày mai hãy cải thiện"):
  1. The topic: a love or family story (a couple, a parent and a child) of a royal the Japanese audience knows at once
     (Elizabeth II, Diana, William and Kate, Grace Kelly, Victoria and Albert…); not prices, scandals or a person
     nobody knows. When the owner sends a source on another topic, find its love or family side and lead with it.
  2. One arc of a life: a first meeting or a beginning, a sacrifice or a test, the emotional moment, what became of
     them; a real quote of one of them when there is one.
  3. The hook: about 45–50 characters, the famous name, two numbers or two moments that make the contrast, and one
     poignant image (「13歳で恋した人と73年連れ添ったエリザベス女王は、その人の葬儀で、たった一人で座っていました。」).
  4. The first picture: the couple (or the parent and child) together, looking at each other or smiling, faces large
     in the upper half, sharp; their best-known photograph.
  5. The ending comes back to the opening (the ending is free on the other channels; for k10 this is what worked).
  When suggesting scripts, offer topics of this kind. The voice and the music stay the channel's (もち子さん and the
  flute, chosen after the hit video was made with 青山龍星 and Nimrod): if the next three or four k10 love stories get
  no views, say so to the owner and offer a trial with the male voice again.

## The edit: the channel edits as Tin Nhật does
Owner, 18/11/2026: "cho 4 kênh này học cách edit của kênh tin nhật đi, học tốt vào" — the channels of this repo (k10 alone since 26/11/2026) edit exactly as
the Tin Nhật channel (`japan-news-video-factory`) does now, with every one of its decisions:
- **The `story` frame** (trial of 15/11/2026, used for every source video since): the old-newspaper page, the picture
  filling most of it, the scene's `era` at the top, the headline on the foot of the picture, the captions printed on
  the page.
- **The four picture effects on** (17/11/2026): the camera's rhythm, a light depth in the pictures, text that comes
  in with the voice and a caption that darkens as it is read, the display typeface; a **flat picture** (a document, a
  newspaper page, a collage, a chart, a screenshot, a banknote) gets `"depth": false`, or it bends.
- **Music under the voice** in every video: a `music:` search and a quiet recording picked from it (a free licence on
  Wikimedia Commons, about 17 dB under the voice, credited on screen and in credits.txt). **k10 has its own music**
  (owner, 25/11/2026, after a trial: "dùng sáo trúc này", a bamboo-flute recording the owner sent, kept as
  `music/k10-sao-truc.mp3`: the 58.7-second piece joined three times with 4-second cross-fades, 168 s, as in
  `japan-news-video-factory`, so that it never jumps where it would loop): the channel's `defaults` give it, `{"file": "music/k10-sao-truc.mp3", "title": "竹笛",
  "volume": 0.84}` (1.2 at first, then 30 % quieter: owner, 25/11/2026, "giảm nhạc nền đi 30%"), so a k10 story needs no `music:` search and no `"music"`; a story's own `"music"` replaces it whole.
  Its source and licence are not known (the owner's file): YouTube may recognise it if it is under copyright, a risk
  the owner took for the music of their own videos on 19/11/2026.
  **k10's sound is louder** (owner, 26/11/2026: "Tăng âm thanh lên 60%, tăng riêng voice lên 30%"): the channel's
  `defaults` give `"audio": {"loudness": 1.6, "voice": 1.3}`: the whole sound brought to about -12 LUFS instead of
  -16 (`news/render.py` `loudness`), and the voice 30 % louder over the music before the mix. A story may set its
  own `"audio"` (merged key by key, each 0.5–2.5, 1 = as before); the other channels stay at 1 and 1.
- **Read fast like the source** (16/11/2026: "đọc nhanh như video gốc"): speed 1.2, short pauses (inherited).
- **Two pictures for a scene over 6 seconds, one is enough under that** (19/11/2026: "nếu nội dung quá 6s thì phải
  tìm 2 ảnh, dưới 6s thì 1 ảnh cũng đc, tự do"; before: two a scene) and **every scene its own fitting picture**
  (12/11/2026: "a video with only a few pictures is not acceptable"); a text card only for a pure figure.
- **Every picture a `move`, every scene a `cut` and a `why`**, chosen by the meaning of its lines from the catalogue
  (14/11/2026; table "Bảng cách edit" in `AGENT_REMIX.md`).
- **The hook** (next section): line 1 printed big on the first picture while it is spoken.
- **One flowing narration**, shown to the owner as one continuous text (18/11/2026), with a meaning; the ending is
  free, and nothing about a real person is made up and told as a fact (the script rules, "When the owner sends a
  source video", and the rule changes of 19/11/2026).
- **The picture review before the render** (18/11/2026: "đọc lại hình ảnh đã chọn xem đã phù hợp với nội dung cần thể
  hiện chưa, chưa thì chọn lại, duyệt lại, khi nào ổn mới lấy"), recorded in the story as `"review": "<n>/<n>"`.
- **Delivery:** only the finished video, with its posting caption (16/11/2026: every video comes with its caption;
  18/11/2026: "gửi video cuối cùng đã xong thôi, không cần gửi nhiều").

The machine knows this list: `python -m news.custom stories/<name>.json` (and the preview, and the workflow's check
of a pushed story) prints a warning for each part a story leaves out — the frame, the effects, the pace, the hook
line, the `music:` search; and from stage `render` the music pick, a scene without a picture or with one picture for
more than 6 seconds of words, a picture without `move`, a scene without `cut` or `why`, the review. Push a story for its
render only when it prints none; a trial may leave something out on purpose, and the closing comment then says what
and why.

## The hook (owner, 18/11/2026: "phần hook cũng có luật")
The owner's hook rules, common to every new channel (mirrored from `docs/KENH-NHAT.md`, "Luật hook"):
1. **The first spoken line, about 5 seconds, says the whole story and what it means, plainly** (17/11/2026, the Tin
   Nhật channel). Example: 「離婚を申し出た雅子さまに、皇太子さまが返した答えは、『僕は、皇太子である前に、君の夫だ』。」
   About 45–50 characters at speed 1.2 (`python -m news.custom` warns above 55).
2. **Someone who has never heard of the story must understand it** (18/11/2026, after a script that opened on two dogs
   nobody knew: "5s đầu ko giữ chân đc những ng ko biết đến câu chuyện, đọc k hiểu đang nói đến cái gì"): the situation
   in plain words (who, what, where); a name the audience does not know comes later; a name everyone knows (雅子さま,
   木村拓哉) may come at once. Then the surprise, then that it is a true story.
3. **A story with a love, couple or mother-and-child side puts that side in the first line** (17/11/2026: the love
   story `masako-rikon` was the only video with views), and the story is built on it (true facts only).
4. **The hook is on screen from the very first frame, big** (18/11/2026, on the legends channel: "cải thiện phần hook"
   → a hook of at most 20 characters printed huge on the first picture). In this engine: line 1 is a `"quote": true`
   line, printed big on the foot of the first picture over a soft dark band while it is spoken; the faces above stay
   bright, the whole picture is never darkened, and the hook is never printed on the paper under the picture
   (17/11/2026 and 18/11/2026: "kiểu này thì hợp lí hơn"). `python -m news.custom` warns when line 1 is not a quote.
   *Open item:* here the hook is the spoken line itself, its rows come in one after the other over about the first
   second (frame 0 shows the picture alone; `cover.jpg` shows the whole hook), and there is no separate short hook
   title shown from frame 0 as on the legends channel; that would be a new look, made only after the owner approves
   it in a trial.
5. **The hook picture is one the Japanese audience recognises at once, and it matches the hook line** (18/11/2026):
   the best-known face of the person the hook names, or a famous place or thing, sharp, and right for what the line
   says. The picture review checks it first (`AGENT_REMIX.md` §2 step 5). On 19/11/2026 the owner made this
   concrete: rules 1–5 of "The picture rules of the edit" above.

The owner took two older rules out of the hook (18/11/2026): the video's meaning with its ending coming back to the
opening, and never inventing. On 19/11/2026 the owner changed both in the script rules too: the ending is free, and
only made-up events or quotes of real people told as facts stay forbidden (the rule changes above).

## When you were started by GitHub (a Claude task, nobody in the chat)
The prompt may be as short as "Làm việc đang chờ trong repo này" ("do the work waiting in this repo"), and GitHub
adds a line such as "Phiếu kênh 10 số 3: ảnh đã tìm xong, chờ chọn ảnh". Then: follow `AGENT_REMIX.md` from §0 (its
first check lists the `remix-*` issues waiting for you). Nobody answers questions, so do not ask; comments go on the
issues (🤖, Vietnamese). This repo's own Claude task (its prompt: "Làm theo AGENT_REMIX.md của repo
maihaianh2911-bit/japan-remix-video-factory.") or the owner's shared task "japan-video-factory" once its
`AGENT_NIGHTLY.md` lists this repo (not yet on 18/11/2026) does these steps; either needs the secrets
`CLAUDE_TASK_URL` and `CLAUDE_TASK_TOKEN` in this repo. There is no hourly run: a missed call waits for the button
"Gọi Claude ngay" (`wake.yml`) or a chat.

## When the owner sends a source video in a chat (the usual way)
The owner sends someone else's short or video (a file or a link) for channel 10 (the only channel of this repo since
26/11/2026). A video that is not about world royals: say so and ask which repo it is for (in a chat you may).
1. **Read the source.** Every word is the content; the narration starts at 0 s, so an opening title is spoken too.
   - Burnt-in captions (most shorts): sheets of one frame a second,
     `ffmpeg -i <video> -vf "fps=1,crop=1080:500:0:700,scale=540:-1,drawtext=text='%{pts\:hms}':x=5:y=5:fontcolor=yellow:fontsize=24,tile=3x10" cap%02d.jpg`
     (move the crop to where the captions are), and look at every sheet.
   - A long source (a 20–30-minute horizontal video) or one without captions: its voice. Take its subtitle
     file when the platform has one (`pip install -q yt-dlp`, then
     `yt-dlp --skip-download --write-subs --write-auto-subs --sub-langs ja -o src <link>`), else transcribe its
     sound (`ffmpeg -i <video> -vn -ac 1 -ar 16000 src.wav`, then a speech-to-text model such as
     `pip install faster-whisper`, model `small`, language `ja`). Neither was tried in this repo yet: if both fail,
     say so in one line and ask the owner for the words. From a long source keep one story, its main thread.
   - A source too thin for a story (a few captions, no events): tell the owner before making it.
2. **Rewrite it in Japanese** (the script rules; owner, 16–18/11/2026, and the lessons of `docs/KENH-NHAT.md`):
   - Decide the meaning first, in one sentence (what the viewer keeps); the whole story leads to it. A story that
     only lists events is not enough (owner, 18/11/2026: "chả thấy có tí ý nghĩa gì").
   - Open with the hook (section "The hook"): the first line says the whole story and its meaning to a stranger, its
     love or family side first when it has one, printed big (`"quote": true`). The source's opening is often a list
     title (「実は血筋がヤバすぎる芸能人3人」): ours says in one plain sentence what the three share.
   - **One flowing narration** (17/11/2026, after finding the scripts of that morning dull): sentences linked by
     connectives (けれど, そんなある深夜, その言葉が本物だったことを…), the warm narrator's です/ます, no chopped fragments
     such as 「1993年。ハーバード、東大。」. **Show the owner a script as one continuous text** (the Japanese in one piece,
     then its Vietnamese meaning in one piece), never cut into numbered scenes or bullet points (owner, 18/11/2026:
     "Kịch bản phải liền mạch, nói bao nhiêu lần rồi, đừng bao giờ chia đoạn ra như thế"). The scenes exist only for
     the pictures.
   - **The ending is free** (owner, 19/11/2026: "Tự do, miễn hay"; before: back to the opening, never a question):
     the line that ends this story best, not the same form on every video.
   - **Never make up an event or a quote of a real person and tell it as a fact**; the telling itself may be
     dramatised and a rumour told as one (19/11/2026). The same story and facts, our own sentences, more gripping (owner,
     16/11/2026: "chỉnh sửa nhẹ kịch bản, giữ khung nội dung nhưng làm cho hay hơn, cuốn hơn, có thể thêm bớt"); keep
     the people's quotes as they are; cut repetition; add a few true, well-known details of the same subject (dates,
     ages, what became of a person). A story the sources do not confirm is framed **once**
     (「…と伝えられています」, 「…と口にしたといいます」 at the key line), not on every line.
   - **Keep the source's colourful details** (owner, 18/11/2026, after a k8 script that dropped every detail the press
     had not confirmed: "nếu m cứ kiểm tra rồi chỉ ghi y như báo chí thì kịch bản sẽ chán hơn rất nhiều luôn"): a
     nickname, a quote, a rumour the source tells, its cliffhanger (「画面を2回タップ！」) all stay; one that is not
     confirmed is framed as told (「…といいます」, 「…だとか」, 「…と噂されています」, 「週刊誌によると」), never cut for that
     alone. Leave out only what could really harm someone or is known to be false: a crime or a serious accusation
     against a private person stated as fact, mocking words of our own about
     someone's body. A rumour about a royal (k10) stays, framed as told, and is corrected in the caption. Check the facts to frame them right, not to strip the
     story to what a newspaper would print.
   - Length (iron rules 2 and 3): a little over 61 s, about 63–70 s. Estimate about 6.4 written characters a second
     at the channels' speed 1.2, pauses included (the k8 video of 18/11/2026: 607 characters, 94.7 s; punctuation
     and spaces not counted). Under 61 s add true details of the same story (never encyclopedic padding such as
     numbers of trees or treaty years); longer, cut to the main thread and its most gripping details.
   - Tell the owner in the chat what you added or left out, and why.
3. **Open the issue** in this repo: title `[K<n>] <Japanese title> — <main idea in Vietnamese>`, body with the
   sections of the channel's issue form (`.github/ISSUE_TEMPLATE/k<n>.yml`): `### Video gốc (bắt buộc)` = the link,
   or "đã gửi trong chat"; `### Lời của video gốc (không bắt buộc)` = the source words as you read them;
   `### Ghi chú (không bắt buộc)` = the owner's wishes and "kịch bản đã viết lại bằng lời của mình (biến tấu)"
   (`_No response_` when empty). No labels: the workflow adds `remix`, the channel label and `remix-plan`. **Right
   after creating it, add `remix-busy`** (the workflow wakes the Claude task at the same time; the label keeps it off
   this issue), then do the steps of `AGENT_REMIX.md` for that issue right away. Keep `remix-busy` while you work and
   wait in the chat: for an issue with a fresh `remix-busy` (added less than 2 hours ago) the workflow does not call
   the Claude task after a machine step. On a longer chat remove and add it again; remove it after the closing
   comment. While a machine step runs, say so in one line and wait; if the owner does not want to wait, stop right
   after one of your pushes (once the workflow has moved the step label, see "Claim" in `AGENT_REMIX.md` §0) and
   remove `remix-busy`: the Claude task continues from the labels when GitHub calls it after that step.
4. **Delivery:** send the owner the finished video file and its caption file in the chat (they want them there, not
   only as links), and the links (video, subtitles, caption, credits, the channel's list). Send only the finished
   video: no previews, stills or progress pictures (owner, 18/11/2026).

The workflow only runs for files on `main`: story files and their picks are pushed to `main` (the owner's way of
working since 12/11/2026). If the session may only push to its own branch, say so in one line and ask the owner to
allow `main`.

## Story format, pictures and preview (used by `AGENT_REMIX.md`)
1. Write `stories/<channel>-<YYYY-MM-DD>-<short-name>.json` (e.g. `stories/k10-2026-11-24-philip-elizabeth.json`; ASCII
   letters, digits, `.`, `_`, `-` only; the sample `stories/mau-k10.json` shows the whole edit) and
   push it to `main`. Every story file added, changed or renamed in a push gets its own run.
   - `"channel": "k10"` (required; the file name starts with it, `python -m news.custom` refuses another), `title`
     (not shown in the video), `date` (shown at the top of a scene without `era`), `source` (shown as 出典; usually
     left out: the source video is not credited as a news source), `stage: "find"`, `issue` (the issue number: the
     workflow then moves its labels, comments and calls Claude after each step).
   - **Inherited from the channel** (`defaults` of `channels/<id>.json`) when the story leaves them out: `style`,
     `kicker`, `pace`, `fx`. A story may set any of them (the edit warnings then say what departs from the Tin Nhật
     edit); a dict is merged key by key (`"fx": {"depth": false}` keeps the three other effects); `null` inherits
     nothing. The voice is always the channel's; only a trial (`"trial": true`) may set `"voice": {"speaker": …,
     "style": …}` to try another VOICEVOX voice before the owner chooses it for the channel (owner, 25/11/2026: "thử
     thay voice thành voice nữ"), and the channel file changes only once the owner approves it. `"trial": true` marks a trial or sample
     video (iron rule 2's exception: the machine renders it even under 61 s). `"review": "<n>/<n>"` records the
     picture review (step 3).
   - `scenes`: one idea each. `label` (short tag), `headline` (≤ 2 lines, `\n` between; longer ones get a smaller
     font, up to 3 lines), `lines` (a list: the script, in Japanese, sentence by sentence), optional `era` (the year
     of the scene at the top: `"1952年"`, `"江戸時代"`), `value` (a big figure such as `70年`) and `evidence` (small
     text). A scene without a picture is a text card: headline, value, then evidence (only for a pure figure, with a
     `value`). A line the voice may misread is written `{"text": "caption", "say": "reading in kana"}`; a line
     `{"text": …, "quote": true}` is printed big on the foot of the picture, over a soft dark band, while it is
     spoken (the hook; see "The hook").
   - Pictures and music: a picture `"tone": "sepia"` / `"mono"` / `"color"` (sepia for the old years, colour as the
     story reaches today). `"music": {"pick": "<k>-<n>", "volume": 1}` from a search `music:<words>` (recordings on
     Wikimedia Commons with a free licence, e.g. `music:Schumann Träumerei piano`, `music:Gymnopédie Satie piano`;
     index.json gives title, `seconds` and licence; the piece loops, fades in and out, about 17 dB under the voice,
     credited on screen and in credits.txt). (`"style": "news"` and `"paper"`, the other frames of the engine, are
     not part of the edit of these channels.)
   - `"fx"` (inherited, all four on): `motion` (the camera starts quick and settles), `depth` (a picture that fills
     the frame gets a light depth from a depth map, Depth Anything V2 Small; **a flat picture gets `"depth": false`**
     in its picture entry; a picture with `"fit": "contain"` never gets it), `text` (the tag, the headline and a
     quote come in piece by piece; the caption is there from the start, paler, and darkens as the voice reads it, at
     the real moment of each sound VOICEVOX gives), `face` (the large text in Shippori Mincho B1 ExtraBold, SIL Open
     Font License; the workflow fetches it into `fonts/`, not kept in the repository). `motion` and `depth` act on
     pictures that carry a `move`, so give every picture one. If the effects cannot be installed on GitHub the video
     is still made, flat or in the usual typeface, and the run log says `warning: depth effect off` or
     `warning: display font … not found`: say so in the closing comment. To preview with the effects here:
     `pip install numpy opencv-python-headless onnxruntime`, the typeface in `fonts/ShipporiMinchoB1-ExtraBold.ttf`
     (or `NEWS_DISPLAY_FONT=<file>`); the depth model is downloaded on first use (99 MB, or `DEPTH_MODEL=<file>`).
   - `searches`, numbered from 1 in order; only append to the list later (the picks use the numbers, and a pick
     whose search text changed is refused):
     - `wiki:<name or Wikidata item>`: every picture **about one thing** (a person, a place, a building, an event)
       through its Wikidata item: the item's own pictures, the pictures of its Japanese and English Wikipedia
       articles, its Commons category, photos taken at its coordinates; up to 24, free licences with author and
       licence for `credits.txt`. `"wiki:エリザベス2世"`, `"wiki:日本銀行"`; the name is the title of its Wikipedia
       article, or the item itself (`"wiki:Q9682"`) when a name fits several things; `index.json` says which item
       was found (`"wikidata"`): check it. **Write one `wiki:` search for every person and place of a story, before
       the `web:` searches**.
     - `geo:<lat>,<lon> <metres>`: Commons photos taken around a point, nearest first (up to 12; 500 m by default).
     - `web:<words>`: a free web image search (Yahoo! JAPAN, else Bing, else DuckDuckGo; Japanese words work; stock
       sites with watermarks are left out); 2–3 per scene, for the moments of the story and for living people, of
       whom Commons has little. Their licence is unknown and the site is credited (owner, 14/11/2026: pictures may
       come from anywhere on the web; the copyright risk was told and accepted). **Wider since 19/11/2026** (owner:
       "có cách nào để tìm hình ảnh mở rộng ra ko"): three result pages of Yahoo! JAPAN (about 55 candidates, 20
       before) and **20 pictures kept** (12 before; with a wish, the best 20 of 45); a picture its own site will
       not give is taken from the search engine's own full-size copy, still credited to its site.
     - `page:<address of one article>` (19/11/2026): **the pictures that article shows** (up to 20): the page's own
       picture first, then the pictures in the order of the page, each in its largest version, without the page's
       header, footer, menus, side columns and furniture. For a press article or a photo page found by a `web:`
       search (the `page` of a result in `index.json`) that has more pictures of the same event. Credited to the
       site, licence unknown, as `web:`; a page the site refuses is `"unusable"`.
     - `jps:<Japanese words>` (19/11/2026): **Japan Search** (jpsearch.go.jp), the shared catalogue of Japan's
       archives, libraries and museums (the National Diet Library, city libraries and archives, university
       collections, the cultural-heritage sites): old prints, paintings, photographs, objects, the records
       catalogued as pictures first. Only records whose rights allow use (public domain, CC0, CC BY, CC BY-SA), up
       to 12, credited to the holding site with the licence. For the old side of k10 (`"jps:紫禁城"`,
       `"jps:関東大震災"`). **Search a thing, a place or an event, not a person**: a name brings mostly books about
       that person, whose cover scans are left out. **A modest source**: tried on GitHub (19/11/2026), of six
       searches two brought 12 pictures (`関東大震災`, `土偶`), two brought 1–2 (`富士山 浮世絵`, `紫禁城`) and two
       names of people none; the pictures of ColBase (the national museums) and of the Tokyo museums cannot be
       loaded at present (404 and 403), so those records are passed over. Use it beside `wiki:` and `web:`, not
       instead. A wish ` => …` works on `page:` and `jps:` as on `web:`.
     - `music:<words>`: at least one in every story (the edit).
     - Commons words without a prefix (English works best; `incategory:"…"`), `url:<picture> [<page>]` (one
       picture), `file:stories/media/<story>/<name>.jpg` (a picture kept in the repository, credited 元動画: a clean
       moment cut out of the source video, without its blurred background or burnt-in caption; prefer a web copy of
       the same picture when it is larger). **The video the owner sent is a picture source like the searches**
       (owner, 19/11/2026): `python tools/video_frames.py <video> <story>` lays out one frame of every shot on a
       numbered sheet (look at it), `… --keep 3,7 [--crop x,y,w,h]` saves the chosen ones as
       `stories/media/<story>/v-<m>m<ss>s.jpg` and prints the `file:` searches to append (`--crop`, fractions of
       the frame, cuts off a burnt-in caption or takes an inset picture out of its blurred background). Moving
       footage (a clip inside a scene) is allowed by the owner too, but the frames of this engine show still
       pictures only: a clip needs new frame code and a trial the owner approves first; until then take stills.
     - A wish: ` => <what the picture must show, in English>` at the end of a `wiki:`, `geo:`, Commons or `web:`
       search (`"web:エリザベス女王 戴冠式 1953 => a young queen crowned in Westminster Abbey"`): the machine looks
       at more pictures than it keeps, scores each against the wish (CLIP) and keeps the best, best first; pictures
       that do not show it (score under 0.18) or look unsuitable are left out, so a group can come back small or
       empty: then ask with other words. The score is `match` in `index.json` and `~0.31` on the contact sheet
       (about 0.30 and more: it shows the thing; near 0.20: doubtful). The wish is always English; never add one to
       a search that was already run (append a new search instead).
   - Check before pushing: `python -m news.custom stories/<name>.json` lists every problem (a missing or wrong
     `channel`, a file name of another channel, unknown keys, bad `focus`/`fit`), the scenes without a picture, and
     the edit warnings.
2. The push runs the workflow (find stage, ~2 min). Check that the run for your commit succeeded (the session's
   GitHub tools `actions_list` / `actions_get`); then `git fetch --depth 1 origin +refs/heads/renders:refs/remotes/origin/renders`
   and check that `<name>/find/status.json` has your commit before trusting the folder. Look at
   `<name>/find/sheet_<k>.jpg` yourself. A search with no usable picture has no sheet (0 results in `index.json`).
   Two things can go wrong with a search, and they are not handled the same (19/11/2026, as in Tin Nhật):
   - **Its source did not answer** (network, Wikimedia refusing, no web search engine answering): `"error"` in
     `index.json` and the run is red (`"outcome": "partial"`): run it again (Run workflow → `story` + the name)
     and only the failed searches are tried again.
   - **It cannot work as written**: a `wiki:` name that names nothing, a `url:` picture the site refuses (403,
     404), that is too small (under 400 px), is not a picture, or did not load in two tries. It has `"unusable"`
     (the reason) in `index.json`, is **never tried again**, and the run stays **green** (the issue comment and
     the run's summary name it): running the find again changes nothing. Append another search instead: the exact
     title of the Wikipedia article or the item `Q…`, a `web:` search, another address of the picture.
   A `url:` picture that another search already found is kept all the same (`"same_as": "<k>-<n>"` names the pick
   it repeats): they are the same picture. Wikimedia refuses requests from Claude's cloud session
   (429), which is why the search runs on GitHub.
3. Put the picks in the scenes: `"photo": "<k>-<n>"`, `{"pick": "<k>-<n>", "focus": [x, y]}` (the point kept in the
   frame, 0–1), `{"pick": …, "fit": "contain"}` (the whole picture: portraits, documents), or a list of 1–4 of these
   shown one after the other: two for a scene over 6 seconds of words, one is enough under that (the edit). The move of each picture and the cut of each scene are yours,
   by the meaning of the lines: `"move"` in a picture entry, `"cut"` and `"why"` (one short Vietnamese sentence) in
   the scene, from the table "Bảng cách edit" in `AGENT_REMIX.md`. Pick the music. Preview before rendering:
   `python -m news --story stories/<name>.json --pictures <find folder> --stills <out>` and look at `sheet.jpg`
   (needs `sudo apt-get update -qq && sudo apt-get install -y fonts-noto-cjk` and `pip install -r requirements.txt`;
   `<find folder>`: `git archive origin/renders <name>/find | tar -x -C <dir>`). Then **review the pictures** (owner,
   18/11/2026): `python tools/review_picks.py stories/<name>.json <find folder> <stills folder>` puts every pick
   beside the words spoken while it is on screen and its source title; check each row as `AGENT_REMIX.md` §2 step 5
   says (the hook picture first), re-pick and review again until every row passes, then write `"review": "<n>/<n>"`.
   Only then set `stage: "render"` and push.
4. The render (~3–6 min) replaces `renders/<name>/` (keeping `find/`): `video.mp4`, `subtitles.srt`, `sources.json`,
   `credits.txt` (for the video description), `caption.txt`, `stills/sheet.jpg`, `status.json`, and writes the list
   of the channel's videos again (`renders/kenh-<n>.md`, newest first, with the links to each video, caption,
   subtitles and credits: the page the owner downloads from). Check the run succeeded and that `status.json` has
   your commit (an old video stays there when a render fails). Links:
   `https://github.com/maihaianh2911-bit/japan-remix-video-factory/blob/renders/<name>/video.mp4` (and
   `subtitles.srt`, `credits.txt`, `caption.txt`), the list `…/blob/renders/kenh-<n>.md`. GitHub refuses a file over
   100 MB, so the video is kept under about 88 MB (`news/render.py`). Old videos are deleted from `renders` every
   week (`renders-cleanup.yml`: issue closed for 2 days, or no activity for 14 days), so tell the owner to download
   the video.

### Posting caption (owner, 16/11/2026: every video comes with its caption)
`captions/<name>.txt` beside the story (UTF-8, Japanese, ≤ 2000 characters; example `captions/mau-k10.txt`): line 1 a hook title (≤ 80 characters, true to the script), then 2–4 short sentences on the video, a
blank line, one line of 5–8 hashtags **that include every hashtag of the channel** (`hashtags` in
`channels/<id>.json`: k10 `#世界の王室 #王室 #shorts`), a blank line, and the credit line
`画像出典: <元動画 when source-video pictures are used>、<main sites> ほか（写真・音楽の全出典は credits.txt）`. Only
facts of the script. **A video that tells a rumour gets a correction note** (owner, 19/11/2026, k10: "đc dùng tin
đồn, sẽ đính chính ở caption"; every k10 video with a rumour, and any other channel's): 1–3 lines starting with ※,
its own block between the sentences and the hashtags, saying which part is a rumour and what is known, e.g.
`※カミラ夫人がケイト妃の両親に対して画策したという話は、一部で噂として伝えられているもので、事実とは確認されていません。`
(and 「王室は否定しています」 when the palace denied it). `python -m news.captions captions/<name>.txt` checks it (`python -m news.custom` too). The
render publishes it as `renders/<name>/caption.txt`; a push that changes only the caption publishes only the
caption (no new render). Write it before the closing comment and link it there.

## Drawn videos (`doodle/`): a trial of 26/11/2026, not a channel yet
On 26/11/2026 the owner sent a hand-drawn explainer (a Vietnamese TikTok) and asked "dựng đc hình ảnh dạng này ko?",
then chose a history story and had two videos made in that look: `doodle/stories/shinkansen-uso` (新幹線は、ひとつのウソから
生まれた; 69.7 s) and `doodle/stories/chikatetsu-horafuki` (the first subway; 66.9 s), voice 青山龍星, the flute as music; since
27/11/2026 they are drawn with Remotion (`doodle/remotion/`, the owner: "ổn hơn r, dựng lại 2 video kia theo cách này đi"). Its pictures are drawn by code (no photographs, no
pictures of an image generator), its voice is VOICEVOX as everywhere. **Read `doodle/README.md` before a second one**:
the owner's words about the script of such a video ("học cách viết chứ k phải sao chép", "của mình chỉ 65s thôi"), how
a video is made, and the list of the drawn videos (a story that is there is not made again). Open points: the owner
has not said which channel the format is for, nor approved the look, the voice or the sounds; the code is on the
session branch only (no workflow runs it), and such a video is delivered in the chat, not on `renders`.

## Changing the pipeline
Before pushing a change of `news/`, `tools/`, `channels/` or `tests/`: `bash tools/check.sh <out folder>` (add
`--fx` when the effects' libraries, model and typeface are installed, see `fx` above), and look at
`<out>/mau-k10/sheet.jpg`, `<out>/moves.jpg`, `<out>/cuts.jpg` (and `<out>/fx/sheet.jpg`).
It needs no network: it compiles the code, checks the channel files (`python -m news.channels`), every story and
caption, runs `tools/find_test.py` (the picture search on made-up answers) and `tools/channel_test.py` (on k10 together with the
stand-in channels k8, k9 and k11 of `tests/fixtures/channels/`, which exist for this test only: story names,
inherited defaults, the edit warnings, the voice taken from the channel file, caption hashtags, issue titles, the
channel lists, the 60-second refusal), draws the stills of every sample story from `tests/fixtures/pictures/`
(Wikimedia Commons pictures of the Bank of Japan, banknotes, supermarkets and Edo-period boxes, and 20 seconds of
Schumann's Träumerei, all under free licences, downsized; authors and licences in its `index.json`: the samples'
pictures are stand-ins, so samples carry no `review`), encodes 3 seconds of video in the three frames and every move
and cut of the catalogue (`tools/encode_test.py`, `tools/edits_test.py`), and with `--fx` checks the effects
(`tools/fx_test.py`). A push of code to `main` runs the same with `--fx` on GitHub (the stills are in the run's
Artifacts); a change of a sample story `stories/mau-*.json` or its caption runs it too (samples are never voiced or
published). A new channel: `channels/k<n>.json`, `.github/ISSUE_TEMPLATE/k<n>.yml`, its label in `labels.yml`,
`stories/mau-k<n>.json` and `captions/mau-k<n>.txt` (`tools/channel_test.py` checks that they exist).
`tools/publish.sh` replaces a folder of `renders` as a whole, writes `status.json` and the channel lists. Never touch
secrets. Comments posted on GitHub start with 🤖 (they come from the owner's account). No pull requests unless asked.
The session cannot delete branches or tags.
