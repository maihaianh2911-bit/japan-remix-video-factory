# doodle — drawn videos (a trial, 26/11/2026)

A second way to make a video, beside the photo engine `news/`: every picture is **drawn by code** in a hand-sketch
style (paper, little people, things, labels typed with the voice), after a Vietnamese TikTok the owner sent on
26/11/2026 (@hoangnhat.bds, how Đà Nẵng's fireworks contest was born) with the question "dựng đc hình ảnh dạng này
ko?". No photographs, no pictures of an image generator: shapes drawn by `rough.js` on a canvas, so there is no
picture copyright and nothing of another channel in the video. **It is a trial**: the owner has seen one video
(`stories/shinkansen-uso`) and has not yet said which channel the format is for; it lives on the session branch, not
on `main`, and no workflow runs it.

## What the owner said about the script of such a video (26/11/2026)
- The model video's script is "hay hơn của m nhiều": **learn its way of writing, do not copy it** ("học cách viết chứ
  k phải sao chép") and **keep our length, about 65 s** ("của mình chỉ 65s thôi"; the model is 2 min 44).
- What to learn from it: short sentences, one idea each, each one a picture that can be drawn; a question asked early
  and answered by the story; a few numbers only; the last line speaks to the viewer in our own way. Not its frame
  (stages, "do you remember what I said at the start", "comment below").
- So a big story is told through one thread only; a second thread is another video (the World Bank loan was left out
  of `shinkansen-uso` for that).
- **The kind of story that works** (owner, 26/11/2026): after `shinkansen-uso` ("hay rồi đấy") a script on Inō Tadataka
  and his map was turned down ("ko hay, có loại nào như kịch bản 1 vừa rồi ko"). What script 1 has and a plain life
  of a great man lacks: a thing the Japanese use every day (the Shinkansen, the subway), a surprise at its birth (a
  lie, beans in a pocket), and the one who made it paying for it (not invited, pushed out). Offer stories of that kind.
- **The hook carries the wrong done, not the cute detail** (owner, 26/11/2026, on "日本で最初の地下鉄は、ポケットの豆から
  生まれました": "hook chưa hay lắm"; the owner then wrote the hook: the man everyone laughed at built Japan's first
  subway in the middle of Tokyo, and 13 years later he was thrown out of it). A hook the owner writes is put into
  Japanese word for word.
- The iron rules of the repo hold: Japanese, not under 61 s, vertical; the script is shown in the chat first (Japanese
  in one piece, then the Vietnamese meaning) and the video is made only when the owner says so.

## What the owner said about the pictures (26/11/2026)
After the two first videos: "hình ảnh video rất sơ sài, k thể hiện đc nội dung". The fault was in the way of drawing,
not in the look: a man beside a label and a stamp shows a noun, not what the sentence says. The second way was
tried on the first 20 seconds of `chikatetsu-horafuki`; the owner approved it ("Ok đc đó"), and both stories were
drawn again whole that way (34 and 36 pictures). **Every drawn video is made this way**:
- **One big picture for every part of a sentence**, changed every 2–3 seconds (the model video: about 2.5 s a
  picture; the first way: 4 s and nothing moving inside). `shots(t, [[start, draw], …])` in that `scenes.js` holds the
  pictures of one line; the labels of the line stay across them (`D.shots` in the kit, with `D.skyline`, `D.haha`,
  `D.confetti`, `D.yearFlip`, `D.beam`, `D.tower`).
- **The picture must say the idea with the labels off**: a pin dropped on a target for "the very middle of Tokyo", a
  medal 日本初 on the train, the years flying on a calendar, the man pushed out of his own train which leaves without
  him, his idea as the same tunnel under Tokyo in a thought cloud, the soft ground as a block of tofu in which the
  tunnel sinks, the plan crumpled into a bin while three faces laugh.
- **One thing at a time, large, in the middle** (a face close up with `D.face`, a train 400 px high), no small
  figures scattered over an empty frame; the best image of the story (here the beans) gets the whole frame.
- **A thing that comes back** ties the video together: the egg 「ウソ」 the train comes out of and the rock 「責任」 Sogo
  carries (`shinkansen-uso`); the beans, the yellow car and the paper tag 「ほら吹き」 struck out for 「地下鉄の父」 at the
  end (`chikatetsu-horafuki`).
- A real person is still a simple figure: no likeness.
- **The finish** (27/11/2026, the owner: "kiểm tra lại 2 video m vừa dựng xem có dựng đẹp hơn đc ko"): people stand on a
  soft shadow, with hands and shoes; big things (the monument, a tower of coins) have a shadow too; a warm light from
  above and darker corners are laid over every frame (`page.html`), and the video gets a little more colour and
  contrast (`COLOUR` in `render.js`, the stills too); every picture drifts in slowly while it is shown (`D.shots`).
  No calendar alone on empty paper: a date stands over a picture of its time (the train running in its tunnel while
  the years fly, the first Shinkansen passing under 1964年10月1日). Look for those faults first in a new story.

## Making a video
A story is a folder `doodle/stories/<name>/` with `story.json` (the lines, the voice, the pace, the small sounds, the
music), `scenes.js` (what is drawn while each line is spoken) and `caption.txt` (the posting caption). From the root
of the repo, with VOICEVOX answering on 127.0.0.1:50021 (engine 0.26.1, as the workflow; the Linux build is on its
GitHub release page and runs without Docker: `./run --host 127.0.0.1 --port 50021`):

    (cd doodle && npm install)                     # rough.js and the typefaces (Yomogi, Yusei Magic, Klee One: OFL)
    python -m doodle.voice doodle/stories/<name>   # out/voice.wav, out/timing.json (when every character is said)
    node doodle/render.js doodle/stories/<name> stills   # out/stills/sheet*.jpg: three frames of every scene
    node doodle/render.js doodle/stories/<name> video    # out/picture.mp4 (about 3 minutes for 70 s)
    python -m doodle.sound doodle/stories/<name>   # out/video.mp4, out/subtitles.srt, out/cover.jpg

- `voice.py` reads the lines exactly as `news/voice.py` does (same settings) and refuses a voice under 61 s unless the
  story carries `"trial": true`. Look at the `kana` it prints into `timing.json` for names: give a line a `"say"` in
  kana when the reading is wrong.
- `scenes.js` gives `window.SCENES(T)`: a list of scenes, each with its start and a `draw(t, u)`. `T.s(i)`, `T.e(i)`:
  when line i starts and ends; `T.at(i, "words")`, `T.to(i, "words")`: when the voice reaches and ends those words. A
  label is typed between two such moments, a stamp falls on one: the picture follows the voice, never a guess.
- `lib.js` is the kit (`D.…`): `label`, `tag`, `stamp`, `balloon`, `person` (old, helmet, moods), `train` (the first
  Shinkansen), `steam`, `car`, `plane`, `fuji`, `diet` (the Diet building), `moneybag`, `coins`, `sheet`, `calendar`,
  `pyramid`, `wall`, `battleship`, `card`, `tv`, `monument`, `platform`, `mappin`, `cross`, `burst`. A new story draws
  its new things in its `scenes.js`, or adds them here when another story will use them.
- Keep what matters above y = 1560 and left of x = 960: TikTok and Shorts cover the foot and the right edge.
- The hook is on screen, big, from the very first frame (the owner's hook rule), and the first picture is a thing the
  Japanese audience knows at once (here the Shinkansen passing Mount Fuji).
- Look at every still before the video is made, and at a frame every 1.5 s of the finished video.
- Sound: the music about 17 dB under the voice, the small sounds (pop, thud, whoosh) well under it. They are made by
  code and were never heard by Claude: ask the owner how they sound.

## Videos made
| Date | Story | Title | Idea (Vietnamese) |
| --- | --- | --- | --- |
| 26/11/2026 | `shinkansen-uso` | 新幹線は、ひとつのウソから生まれた | Ông Sogō Shinji nói dối về ngân sách để làm được Shinkansen, rồi không được mời tới lễ xuất phát |
| 26/11/2026 | `chikatetsu-horafuki` | 「ほら吹き」と笑われた男が、日本で最初の地下鉄をつくった | Ông Hayakawa Noritsugu bị cười là nói khoác, đếm người bằng hạt đậu, làm tàu điện ngầm đầu tiên, rồi bị đẩy khỏi nó |

## Remotion: the way of the drawn videos since 27/11/2026 (`doodle/remotion/`)
The owner saw the trial below and said "ổn hơn r, dựng lại 2 video kia theo cách này đi": both stories are drawn again
whole with Remotion: `src/Subway.tsx` (`chikatetsu-horafuki`, 34 pictures) and `src/Shinkansen.tsx`
(`shinkansen-uso`, 36 pictures), on the shared kit `src/kit.tsx` (people, Ginza, trains, labels, the finish, the
`Movie` runner) and `src/parts.tsx` (the Shinkansen, the Diet, the egg and the rock, the three follies, the monument,
the platform, calendars, confetti…). Each story file holds its pictures (`shots`, each starting at a moment of the
voice from `src/timings/<story>.json`, copied from `doodle/stories/<story>/out/timing.json`) and its words (`words`).
Render, then add the sound as before:

    cd doodle/remotion && npx remotion render src/index.ts Subway ../stories/chikatetsu-horafuki/out/picture.mp4 --muted \
      --concurrency=4 --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
    cd ../.. && python -m doodle.sound doodle/stories/chikatetsu-horafuki      # (Shinkansen: composition Shinkansen)

Publishing (owner, 27/11/2026: "Như video khác"): copy `out/video.mp4`, `subtitles.srt`, `cover.jpg` and the story's
`caption.txt` with a `credits.txt` and a `status.json` into `ve-<story>/` on the `renders` branch, add its line to
`renders/ve.md`, push `renders`, and open an issue `[Vẽ] <Japanese title> — <idea in Vietnamese>` that links them.

About 4 minutes for 70 s here. The canvas kit of `doodle/` (`lib.js`, `page.html`, `render.js`, each story's
`scenes.js`) made the first versions and stays as their record.

### The trial (27/11/2026)
The owner asked whether the drawn videos are made with Remotion on GitHub (they were not: `doodle/` draws with
rough.js on a canvas in this session) and whether a richer, more concrete look is possible: "nếu đc thì dựng thử 15s".
`doodle/remotion/` draws the first four lines of `chikatetsu-horafuki` (16.5 s) with Remotion 4.0.290 and React
18.3.1, the versions of `japan-3d-video-factory`: flat illustration in SVG with outlines, people with hair, hats,
glasses, jointed arms and legs, pointing fingers, faces that blink; old Ginza's brick shops with hanging signboards,
a streetcar, the street cut open over pipes and the tunnel; London 1914 with the clock tower, an open-top bus and the
Underground roundel; an old photograph in sepia; a paper grain and a light over every frame (`src/kit.tsx`, the
shots in `src/Trial.tsx`). The voice, the music and the small sounds are the same as the drawn video's
(`doodle/stories/chikatetsu-remotion-thu`: its `out/voice.wav` is the first 16.5 s of the full voice).

    (cd doodle/remotion && npm install)
    cd doodle/remotion && npx remotion render src/index.ts Trial out/picture.mp4 --muted --concurrency=4 \
      --browser-executable=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
    # then, from the root: copy out/picture.mp4 to doodle/stories/chikatetsu-remotion-thu/out/ and
    python -m doodle.sound doodle/stories/chikatetsu-remotion-thu

About a minute for 16.5 s here. It is not on GitHub yet: Remotion renders on GitHub Actions in the 3D repo
(`video.yml`), the same can be done here once the owner chooses this look.
