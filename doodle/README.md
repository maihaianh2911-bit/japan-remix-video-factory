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
- The iron rules of the repo hold: Japanese, not under 61 s, vertical; the script is shown in the chat first (Japanese
  in one piece, then the Vietnamese meaning) and the video is made only when the owner says so.

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
