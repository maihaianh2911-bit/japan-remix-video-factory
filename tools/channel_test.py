"""Offline checks of the channel layer (news/channels.py): no network, no voice engine.

- the channel files and the tags of the issue titles ("[K8]", "[k10]", never "[K1]" for "[K10] …"), and that
  every channel has its issue form, its label (.github/), its sample story and its sample caption;
- what holds for several channels is checked on the channels of the repository together with the stand-in
  channels of tests/fixtures/channels (k8, k9 and k11: the channels the owner dropped on 26/11/2026, kept there
  for the tests only);
- the story file names (<channel>-<YYYY-MM-DD>-<short>, mau-<channel>) and the refusal of a story without a channel
  or with a name of another channel;
- the defaults a story inherits from its channel, key by key, without changing the channel;
- the Tin Nhật edit every channel follows ("edit": "tin-nhat"): what a story leaves out of it is warned about
  (news/custom.py edit_warnings: hook line, music, two pictures for a scene over 6 s, moves, cuts, whys, review…), and every
  sample story carries all of it;
- the voice comes from the channel file, not from the code: a stand-in channel with another VOICEVOX speaker is
  voiced (against a stand-in engine) and credited (on the frame, in both layouts) with that speaker;
- the posting caption must carry the channel's hashtags and be named after its story, and may carry a ※ correction note;
- the lists of each channel's videos on the renders branch (tools/channel_lists.py);
- iron rule 2 in the machine: a story whose voice is under 61 seconds is refused before its video is made, a trial
  ("trial": true) is made all the same (a second of video: needs ffmpeg).
Usage: python tools/channel_test.py"""
from contextlib import contextmanager
from io import BytesIO
import json
import os
import re
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import wave

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from news import captions, channels, render, voice   # noqa: E402
from news.custom import StoryError, edit_warnings, load_story, read, validate   # noqa: E402
from news.story import voice_credit   # noqa: E402

REPO = Path(__file__).resolve().parent.parent
STAND_INS = REPO / "tests" / "fixtures" / "channels"   # k8, k9, k11: dropped by the owner, stand-ins of the tests
STORY = {"channel": "k8", "title": "見本", "date": "2026-11-19", "scenes": [{"headline": "見出し", "lines": ["一行目です。"]}]}


def problems(change=None, name="k8-2026-11-19-test"):
    story = json.loads(json.dumps(STORY))
    if change:
        change(story)
    return "\n".join(validate(story, name))


@contextmanager
def with_stand_ins():
    """The channels of the repository and the stand-in channels of the tests in one folder: the tags of the titles,
    the names, the lists, a voice and defaults of a channel's own are checked on several channels."""
    real = channels.FOLDER
    with tempfile.TemporaryDirectory(prefix="channel-stand-ins-") as scratch:
        for path in (*sorted(real.glob("*.json")), *sorted(STAND_INS.glob("*.json"))):
            shutil.copy(path, Path(scratch) / path.name)
        try:
            channels.FOLDER = Path(scratch)
            channels.channels.cache_clear()
            yield
        finally:
            channels.FOLDER = real
            channels.channels.cache_clear()


def files_and_titles():
    assert channels.check() == [], channels.check()
    assert channels.ids() == ["k8", "k9", "k10", "k11"], channels.ids()
    for cid in channels.ids():
        data = channels.get(cid)
        assert data["tag"] == f"[K{data['number']}]" and "#shorts" in data["hashtags"], data
        assert data["defaults"]["style"] == "story" and all(data["defaults"]["fx"].values()), data
    titles = {"[K8] 実は東大卒の芸能人3人 — 3 nghệ sĩ": "k8", "[k10] エリザベス女王": "k10", "  [K11] なぜ": "k11",
              "[K9]炎上": "k9", "[K1] x": None, "[K12] x": None, "[Tin Nhật] x": None, "K8 x": None, "": None}
    for title, expected in titles.items():
        found = channels.of_title(title)
        assert (found or {}).get("id") == expected, (title, found)
    names = {"k8-2026-11-19-todai": "k8", "k10-2026-01-02-x.y_z": "k10", "mau-k11": "k11", "mau-k9-edits": "k9",
             "2026-11-19-todai": None, "k8-todai": None, "mau-boj": None, "K8-2026-11-19-x": None}
    for name, expected in names.items():
        assert channels.of_name(name) == expected, (name, channels.of_name(name))


def repository_files():
    """Every channel of the repository has its issue form (title = its tag), its label, its sample story and its
    sample caption; the step labels exist (labels.yml)."""
    labels = (REPO / ".github" / "workflows" / "labels.yml").read_text(encoding="utf-8")
    names = {line.strip().split("|", 1)[0] for line in labels.splitlines() if line.count("|") == 2}
    steps = {f"remix-{step}" for step in ("plan", "find", "pick", "render", "check", "done", "fix", "failed", "busy")}
    assert {"remix", *steps} <= names, sorted({"remix", *steps} - names)
    for cid in channels.ids():
        form = REPO / ".github" / "ISSUE_TEMPLATE" / f"{cid}.yml"
        assert form.exists() and f'title: "{channels.get(cid)["tag"]} "' in form.read_text(encoding="utf-8"), form
        assert cid in names, f"labels.yml has no label {cid}"
        for sample in (REPO / "stories" / f"mau-{cid}.json", REPO / "captions" / f"mau-{cid}.txt"):
            assert sample.exists(), f"{sample} is missing"
    workflow = (REPO / ".github" / "workflows" / "remix-video.yml").read_text(encoding="utf-8")
    assert "startsWith(github.event.issue.title, '[K')" in workflow and "jnews" not in workflow


def names_and_channel():
    assert problems() == "" and problems(name="mau-k8") == "" and problems(name=None) == ""
    assert '"channel" is missing' in problems(lambda story: story.pop("channel"))
    assert '"channel" must be one of k8, k9, k10, k11' in problems(lambda story: story.update(channel="k99"))
    assert "names channel k9" in problems(name="k9-2026-11-19-test")
    assert "names channel k10" in problems(name="mau-k10")
    assert "is named k8-<YYYY-MM-DD>-<short name>" in problems(name="2026-11-19-test")
    assert "'2026-13-45' is not a date" in problems(name="k8-2026-13-45-test")
    assert "use only ASCII letters" in problems(name="k8-2026-11-19-テスト")
    assert '"trial" must be true or false' in problems(lambda story: story.update(trial="yes"))
    assert problems(lambda story: story.update(trial=True)) == ""
    with tempfile.TemporaryDirectory(prefix="channel-test-") as scratch:   # read() refuses, with every problem listed
        path = Path(scratch) / "k9-2026-11-19-test.json"
        path.write_text(json.dumps(STORY, ensure_ascii=False), encoding="utf-8")
        try:
            read(path)
            raise AssertionError("a story whose name names another channel must be refused")
        except StoryError as error:
            assert "names channel k9" in str(error), error


def defaults():
    k8 = channels.get("k8")["defaults"]
    merged = channels.inherit(STORY)
    assert {key: merged[key] for key in ("style", "kicker", "pace", "fx")} == k8, merged
    assert "style" not in STORY, "inherit() must not change the story it is given"
    merged["fx"]["depth"] = False
    assert channels.get("k8")["defaults"]["fx"]["depth"] is True, "inherit() must not change the channel"
    own = channels.inherit({**STORY, "style": "paper", "pace": {"speed": 1.0}, "fx": {"depth": False}})
    assert own["style"] == "paper" and own["kicker"] == "芸能人3人", own
    assert own["pace"] == {"speed": 1.0, "line_pause": 0.1, "scene_pause": 0.2}, own["pace"]
    assert own["fx"] == {"motion": True, "depth": False, "text": True, "face": True}, own["fx"]
    assert channels.inherit({**STORY, "fx": None})["fx"] is None   # null: nothing inherited, no effects
    assert channels.inherit({"title": "no channel"}) == {"title": "no channel"}
    assert '"style" must be one of' in problems(lambda story: story.update(style="neon"))


def edit_rules():
    """The Tin Nhật edit ("edit": "tin-nhat"): a story with all of it has no warning, each part left out is named, a
    story still at stage find is only checked for its script, and every sample story carries the whole edit."""
    from news.custom import edit_warnings

    def scene(number):
        made = {"headline": "見出し", "lines": ["一行目です。"], "why": "lý do",
                "photo": [{"pick": "1-1", "move": "push-in"}, {"pick": "1-2", "focus": [0.5, 0.4], "move": "pull-back"}]}
        if number > 1:
            made["cut"] = "fade"
        return made
    full = {"channel": "k9", "title": "t", "date": "2026-11-19", "stage": "render", "review": "4/4",
            "searches": ["web:x", "music:Satie piano"], "music": {"pick": "2-1"}, "scenes": [scene(1), scene(2)]}
    full["scenes"][0]["lines"] = [{"text": "たった一枚の写真が、一晩で何万人もの批判を集めました。", "quote": True}, "二行目です。"]
    assert validate(full, "k9-2026-11-19-x") == [], validate(full, "k9-2026-11-19-x")

    def warned(change, **options):
        story = json.loads(json.dumps(full))
        change(story)
        return "\n".join(edit_warnings(channels.inherit(story), **options))
    assert warned(lambda story: None) == "", warned(lambda story: None)
    # owner, 19/11/2026: the ending is free, and a scene under 6 seconds of words may have one picture
    assert warned(lambda story: story["scenes"][-1]["lines"].append("あなたはどう感じますか？")) == ""

    def short_with_one(story):   # "一行目です。": about a second of words
        story["scenes"][1]["photo"].pop()
        story["review"] = "3/3"
    assert warned(short_with_one) == "", warned(short_with_one)

    def long_with_one(story):   # about 9 seconds of words (60 written characters at 6.4 a second) on one picture
        story["scenes"][1]["lines"] = ["あ" * 30 + "、", "い" * 30 + "。"]
        story["scenes"][1]["photo"].pop()
    cases = (
        (lambda story: story.pop("music"), 'no "music" chosen'),
        (lambda story: story.update(searches=["web:x", "web:y"]), 'no "music:" search'),
        (long_with_one, "scene 2: 1 picture for about 9 s of words; a scene over 6 seconds has 2"),
        (lambda story: story["scenes"][1]["photo"][0].pop("move"), 'scene 2: picture 1 without a "move"'),
        (lambda story: story["scenes"][1].pop("cut"), 'scene 2: no "cut"'),
        (lambda story: story["scenes"][0].pop("why"), 'scene 1: no "why"'),
        (lambda story: story["scenes"][0]["lines"][0].pop("quote"), "the hook: line 1 of scene 1 must be printed big"),
        (lambda story: story["scenes"][0]["lines"][0].update(text="あ" * 60), "the hook: line 1 has 60 characters"),
        (lambda story: story["scenes"][0].pop("photo"), "the hook: scene 1 has no picture"),
        (lambda story: story.update(fx={"depth": False}), "picture effects off: depth"),
        (lambda story: story.update(style="paper"), "\"style\" is 'paper'"),
        (lambda story: story.update(pace={"speed": 0.9}), '"pace" is'),
        (lambda story: story["scenes"][1].pop("photo"), "scene 2: no picture (a text card only for a pure figure"),
        (lambda story: story.pop("review"), 'no "review": run tools/review_picks.py'),
        (lambda story: story.update(review="3/4"), "\"review\" is '3/4'"),
        (lambda story: story.update(review="3/3"), "every one of the 4 pictures must pass"),
    )
    for change, expected in cases:
        assert expected in warned(change), (expected, warned(change))

    def before_the_pictures(story):   # stage find: no pictures, edits, music or review yet
        story.update(stage="find")
        for key in ("music", "review"):
            story.pop(key)
        for each in story["scenes"]:
            for key in ("photo", "cut", "why"):
                each.pop(key, None)
    assert warned(before_the_pictures) == "", warned(before_the_pictures)
    assert warned(lambda story: story.pop("review"), sample=True) == ""   # a sample's pictures are stand-ins

    def figure_card(story):   # a text card with a figure is part of the edit
        story["scenes"][1].pop("photo")
        story["scenes"][1]["value"] = "70年"
        story["review"] = "2/2"
    assert warned(figure_card) == "", warned(figure_card)
    assert '"review" must be "<pictures that passed>/<pictures>"' in problems(lambda story: story.update(review="all"))
    for path in sorted((REPO / "stories").glob("mau-*.json")):
        assert edit_warnings(read(path), sample=True) == [], (path.name, edit_warnings(read(path), sample=True))


def stand_in_engine(asked, seconds=0.5):
    """VOICEVOX as far as narration() asks it: two voices, a reading without sounds (the captions are then
    estimated), and `seconds` of silence a line."""
    def engine(path, *, params=None, data=None):
        asked.append((path, dict(params or {})))
        if path == "/speakers":
            return json.dumps([{"name": "青山龍星", "styles": [{"name": "ノーマル", "id": 13}]},
                               {"name": "四国めたん", "styles": [{"name": "ノーマル", "id": 2},
                                                             {"name": "あまあま", "id": 0}]}]).encode()
        if path == "/audio_query":
            return json.dumps({"accent_phrases": [], "speedScale": 1.0}).encode()
        sound = BytesIO()
        with wave.open(sound, "wb") as output:
            output.setparams((1, 2, 24000, 0, "NONE", "not compressed"))
            output.writeframes(b"\x00\x00" * round(24000 * seconds))
        return sound.getvalue()
    return engine


def voice_of_channel():
    """A stand-in channel k8 with another speaker: the story is voiced and credited with it."""
    real_folder, real_request, real_text = channels.FOLDER, voice.request, render.text
    with tempfile.TemporaryDirectory(prefix="channel-voice-") as scratch:
        scratch = Path(scratch)
        (scratch / "channels").mkdir()
        k8 = json.loads((real_folder / "k8.json").read_text(encoding="utf-8"))
        k8["voice"] = {"speaker": "四国めたん", "style": "あまあま"}
        (scratch / "channels" / "k8.json").write_text(json.dumps(k8, ensure_ascii=False), encoding="utf-8")
        path = scratch / "k8-2026-11-19-voice.json"
        path.write_text(json.dumps(STORY, ensure_ascii=False), encoding="utf-8")
        asked, drawn = [], []
        try:
            channels.FOLDER = scratch / "channels"
            channels.channels.cache_clear()
            release, beats, photos = load_story(path)
            assert release.voice == ("四国めたん", "あまあま") and release.channel == "k8", release
            assert voice_credit(release) == "VOICEVOX:四国めたん", voice_credit(release)
            voice.request = stand_in_engine(asked)
            intervals, said = voice.narration(beats, scratch / "voice.wav", 1.2, voice=release.voice)
            assert intervals and said and asked[0][0] == "/speakers", asked
            assert {params.get("speaker") for path, params in asked[1:]} == {0}, asked   # 四国めたん/あまあま
            try:
                voice.narration(beats, scratch / "none.wav", 1.2, voice=("ずんだもん", "ノーマル"))
                raise AssertionError("a voice the engine does not have must be refused")
            except RuntimeError as error:
                assert "ずんだもん/ノーマル not found" in str(error), error
            try:
                voice.narration(beats, scratch / "none.wav", 1.2, voice=())
                raise AssertionError("a narration without the channel's voice must be refused")
            except ValueError:
                pass
            render.text = lambda draw, x, y, value, *args, **kwargs: drawn.append(value) or real_text(
                draw, x, y, value, *args, **kwargs)
            for name in ("news", "story"):
                render.use_style(name)
                drawn.clear()
                render.layout(beats[0], release, False, False)
                assert "VOICEVOX:四国めたん" in drawn and "VOICEVOX:青山龍星" not in drawn, (name, drawn)
        finally:
            channels.FOLDER, voice.request, render.text = real_folder, real_request, real_text
            channels.channels.cache_clear()
            render.use_style("news")
    assert channels.get("k8")["voice"]["speaker"] == "青山龍星"
    # a trial may try another voice (owner, 25/11/2026), a real video may not
    with tempfile.TemporaryDirectory(prefix="channel-trial-voice-") as scratch:
        path = Path(scratch) / "k8-2026-11-25-voice.json"
        tried = dict(STORY, trial=True, voice={"speaker": "冥鳴ひまり", "style": "ノーマル"})
        path.write_text(json.dumps(tried, ensure_ascii=False), encoding="utf-8")
        release, beats, photos = load_story(path)
        assert release.voice == ("冥鳴ひまり", "ノーマル") and voice_credit(release) == "VOICEVOX:冥鳴ひまり", release
        assert not [p for p in validate(tried, path.stem) if '"voice"' in p], validate(tried, path.stem)
        real = dict(STORY, voice={"speaker": "冥鳴ひまり", "style": "ノーマル"})
        assert any('"voice" is only for a trial' in p for p in validate(real, path.stem)), \
            validate(real, path.stem)
    # k10's own music (owner, 25/11/2026: "dùng sáo trúc này"): a recording kept in music/, inherited whole
    with tempfile.TemporaryDirectory(prefix="channel-music-") as scratch:
        path = Path(scratch) / "k10-2026-11-25-music.json"
        story = dict(STORY, channel="k10")
        path.write_text(json.dumps(story, ensure_ascii=False), encoding="utf-8")
        release, beats, photos = load_story(path)
        assert release.music and release.music.path.endswith("music/k10-sao-truc.mp3"), release.music
        assert release.music.title == "竹笛" and release.music.volume == 0.84, release.music
        assert release.voice == ("もち子さん", "ノーマル"), release.voice
        merged = channels.inherit(dict(story, music={"pick": "3-1"}))
        assert merged["music"] == {"pick": "3-1"}, merged["music"]   # a story's own music replaces it whole
        assert not [w for w in edit_warnings(channels.inherit(story)) if 'no "music' in w]
        bad = dict(story, music={"file": "music/none.mp3", "title": "x"})
        assert any("not in the repository" in p for p in validate(bad, path.stem)), validate(bad, path.stem)
        both = dict(story, music={"file": "music/k10-sao-truc.mp3", "title": "x", "pick": "1-1"})
        assert any("not both" in p for p in validate(both, path.stem)), validate(both, path.stem)
    # k10's sound (owner, 26/11/2026: "Tăng âm thanh lên 60%, tăng riêng voice lên 30%"): inherited key by key
    with tempfile.TemporaryDirectory(prefix="channel-audio-") as scratch:
        path = Path(scratch) / "k10-2026-11-26-audio.json"
        story = dict(STORY, channel="k10")
        path.write_text(json.dumps(story, ensure_ascii=False), encoding="utf-8")
        release, beats, photos = load_story(path)
        assert render.audio_levels(release) == (1.6, 1.3), release.audio
        assert "loudnorm=I=-11.9:" in render.loudness(1.6) and render.loudness() == render.LOUDNESS, render.loudness(1.6)
        assert render.LOUDNESS == "loudnorm=I=-16.0:TP=-1.5:LRA=7", render.LOUDNESS   # the other channels: as before
        assert render.loudness(1.6).startswith("acompressor="), render.loudness(1.6)
        inputs, mapping = render.music_args(release.music, 60.0, 1.6, 1.3)
        graph = mapping[mapping.index("-filter_complex") + 1]
        assert "mono,volume=1.300[voice]" in graph and "loudnorm=I=-11.9:" in graph, graph
        assert channels.inherit(dict(story, audio={"voice": 1.0}))["audio"] == {"loudness": 1.6, "voice": 1.0}
        other = dict(STORY, channel="k8")
        path.with_name("k8-2026-11-26-audio.json").write_text(json.dumps(other, ensure_ascii=False), encoding="utf-8")
        release, beats, photos = load_story(path.with_name("k8-2026-11-26-audio.json"))
        assert render.audio_levels(release) == (1.0, 1.0), release.audio   # the other channels: as before
        bad = dict(story, audio={"loudness": 5, "bass": 1})
        found = validate(bad, path.stem)
        assert any('"loudness" must be a number' in p for p in found) and any("bass" in p for p in found), found


def caption_checks():
    good = ("なぜ日本銀行は日本橋にあるのか\n日本銀行の本店は、金座の跡地に建っています。\n本館は重要文化財です。\n\n"
            "#歴史 #歴史のなぜ #日本銀行 #金座 #shorts\n\n画像出典: Wikimedia Commons ほか")
    required = channels.get("k11")["hashtags"]
    assert captions.problems(good, required) == [], captions.problems(good, required)
    missing = captions.problems(good.replace("#歴史のなぜ ", "#江戸 "), required)
    assert len(missing) == 1 and "#歴史のなぜ" in missing[0], missing
    # the correction note of a video that tells a rumour (owner, 19/11/2026): lines starting with ※, own block
    noted = good.replace("\n\n#歴史", "\n\n※この話の一部は噂として伝えられているもので、事実とは確認されていません。\n\n#歴史", 1)
    assert captions.problems(noted, required) == [], captions.problems(noted, required)
    bad_note = noted.replace("※この話", "この話")
    assert captions.problems(bad_note, required), "a fourth block without ※ must be refused"
    with tempfile.TemporaryDirectory(prefix="channel-caption-") as scratch:
        for name, ok in (("k11-2026-11-19-nihonbashi", True), ("mau-k11", True), ("k8-2026-11-19-x", False),
                         ("2026-11-19-nihonbashi", False)):
            path = Path(scratch) / f"{name}.txt"
            path.write_text(good, encoding="utf-8")
            found = captions.check(path)
            assert (found == []) == ok, (name, found)
        assert "is named after its story" in captions.check(Path(scratch) / "2026-11-19-nihonbashi.txt")[0]


def lists():
    """kenh-<n>.md of a made-up renders branch: the videos of each channel, newest first, with their files."""
    def folder(name, files):
        for file, content in files.items():
            (tree / name / file).parent.mkdir(parents=True, exist_ok=True)
            (tree / name / file).write_text(content, encoding="utf-8")
    with tempfile.TemporaryDirectory(prefix="channel-lists-") as scratch:
        tree = Path(scratch)
        folder("k8-2026-11-19-a", {"video.mp4": "v", "caption.txt": "実は[東大]卒の芸能人3人\n文。\n", "subtitles.srt": "",
                                   "credits.txt": "", "sources.json": '{"duration_seconds": 92.4}'})
        folder("k8-2026-11-20-b", {"video.mp4": "v", "sources.json": '{"release": {"title": "題"}, "duration_seconds": 100, '
                                                                     '"trial": true}'})
        folder("k8-2026-11-18-c", {"find/index.json": "[]"})   # pictures found, no video yet: not listed
        folder("k10-2026-11-19-d", {"video.mp4": "v"})
        folder("mau-k8", {"video.mp4": "v"})                    # not a story of a channel: not listed
        (tree / "kenh-9.md").write_text("old", encoding="utf-8")
        result = subprocess.run([sys.executable, str(REPO / "tools" / "channel_lists.py"), str(tree),
                                 str(channels.FOLDER)], capture_output=True, text=True, check=True)
        k8, k9, k10 = ((tree / f"kenh-{n}.md").read_text(encoding="utf-8") for n in (8, 9, 10))
        assert k8.startswith("# Kênh 8 · 芸能人3人 (3 nghệ sĩ…)"), k8
        rows = [row for row in k8.splitlines() if row.startswith("- ")]
        assert len(rows) == 2 and rows[0].startswith("- 2026-11-20 · **題** (1:40) · *thử* — [video](k8-2026-11-20-b/video.mp4)"), rows
        assert rows[1] == ("- 2026-11-19 · **実は\\[東大\\]卒の芸能人3人** (1:32) — [video](k8-2026-11-19-a/video.mp4) · "
                           "[caption](k8-2026-11-19-a/caption.txt) · [phụ đề](k8-2026-11-19-a/subtitles.srt) · "
                           "[nguồn ảnh](k8-2026-11-19-a/credits.txt)"), rows[1]
        assert "_Chưa có video nào._" in k9 and "k10-2026-11-19-d/video.mp4" in k10 and "kenh-11.md: 0" in result.stdout


def length_rules():
    """python -m news on a two-line story, against the stand-in engine (1.6 seconds a line, so that the loudness
    filter has the 3 seconds it measures): refused under 61 s, with the reason for the issue in $GITHUB_ENV and no
    video; as a trial it is voiced, made and credited with the channel's voice."""
    from news import __main__ as make
    names = ("GITHUB_ENV", "GITHUB_OUTPUT", "GITHUB_STEP_SUMMARY")
    real = voice.request, sys.argv, {name: os.environ.get(name) for name in (*names, "GITHUB_ACTIONS")}
    with tempfile.TemporaryDirectory(prefix="channel-length-") as scratch:
        scratch = Path(scratch)
        try:
            for name in names:   # never the files of the run this test may be part of
                os.environ[name] = str(scratch / name.lower())
            os.environ.pop("GITHUB_ACTIONS", None)   # its edit warnings are not annotations of that run
            voice.request = stand_in_engine([], 1.6)
            story = json.loads(json.dumps(STORY))
            story["scenes"][0]["lines"].append("二行目です。")
            short = scratch / "k8-2026-11-19-short.json"
            short.write_text(json.dumps(story, ensure_ascii=False), encoding="utf-8")
            sys.argv = ["news", "--story", str(short), "--out", str(scratch / "out")]
            try:
                make.main()
                raise AssertionError("a story under 61 seconds must be refused")
            except SystemExit as stop:
                assert "under 61 s (iron rule 2)" in str(stop.code), stop.code
            why = (scratch / "github_env").read_text(encoding="utf-8")
            assert re.search(r"WHY=lời đọc chỉ dài \d+\.\d giây, dưới 61 giây", why), why
            assert not (scratch / "out" / "video.mp4").exists()
            trial = scratch / "k8-2026-11-19-trial.json"
            trial.write_text(json.dumps({**story, "trial": True}, ensure_ascii=False), encoding="utf-8")
            sys.argv = ["news", "--story", str(trial), "--out", str(scratch / "out")]
            make.main()
            report = json.loads((scratch / "out" / "sources.json").read_text(encoding="utf-8"))
            assert (report["channel"], report["trial"], report["voice_credit"]) == ("k8", True, "VOICEVOX:青山龍星"), report
            assert report["voice"] == {"speaker": "青山龍星", "style": "ノーマル"}, report
            assert (scratch / "out" / "video.mp4").stat().st_size > 1000 and "ready=true" in (
                scratch / "github_output").read_text(encoding="utf-8")
        finally:
            voice.request, sys.argv = real[0], real[1]
            for name, value in real[2].items():
                if value is None:
                    os.environ.pop(name, None)
                else:
                    os.environ[name] = value
            render.use_fx(None)
            render.use_style("news")


def main():
    assert channels.check() == [], channels.check()
    real = channels.ids()
    assert real, "channels/ holds no channel"
    repository_files()
    with with_stand_ins():
        files_and_titles()
        names_and_channel()
        defaults()
        edit_rules()
        voice_of_channel()
        caption_checks()
        lists()
        length_rules()
    tags = ", ".join(cid + " " + channels.get(cid)["tag"] for cid in real)
    print(f"channel checks OK ({tags}; with the stand-in channels of the tests)")


if __name__ == "__main__":
    main()
