// 雪の日にやりがちな、危ない行動3選 — từng cảnh bám theo giọng đọc (time.ts).
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { useFonts } from './fonts';
import { at, chunks, e, FPS, s, to, LINES } from './time';
import {
  Arrow, Board, Buddy, C, COMeter, Crack, FrozenLock, Impact, NavyLabel, P, Photo, Pill, Progress, RankCard, Refreeze,
  SectionTag, Snow, Source, Stamp, SubtitleBar, TempClash,
} from './kit';

type Shot = { from: number; to: number; tag?: string; rank?: number | null; card?: boolean; draw: (dur: number) => React.ReactNode };

// Thẻ xếp hạng hiện từ lúc câu trước đọc xong tới lúc giọng đọc nói tới tên mục.
const SHOTS: Shot[] = [
  // ── Hook ──
  {
    from: 0, to: at(0, 'わずか'), tag: '雪の日の危険', rank: null,
    draw: (d) => (
      <>
        <Photo src="hook.jpg" dur={d} zoom={[1.0, 1.1]} />
        <Snow />
        <Impact text={'雪に埋もれた車で\n{エンジン}をかけると'} size={96} />
      </>
    ),
  },
  {
    from: at(0, 'わずか'), to: s(1), tag: '雪の日の危険', rank: null,
    draw: (d) => (
      <>
        <Photo src="hook.jpg" dur={d} zoom={[1.1, 1.16]} blur={6} />
        <COMeter clock={[0, 84]} ppm={[0, 50]} dur={d} y={P.y + 120} />
        <Impact text={'わずか{1分24秒}で\n{警報レベル}に'} size={96} />
      </>
    ),
  },
  // ── Tiêu đề ──
  {
    from: s(1), to: e(1) + 0.05, tag: '雪の日の危険', rank: null,
    draw: (d) => (
      <>
        <Photo src="title.jpg" dur={d} />
        <Snow amount={30} />
        <NavyLabel text="雪の日のNG行動" y={P.y + 40} size={60} />
        <Impact text={'やりがちだけど\n{危ない行動} 3選'} size={100} maxW={700} />
        <Buddy mood="point" />
      </>
    ),
  },
  // ── 第3位 ──
  { from: e(1) + 0.05, to: at(2, '凍った'), rank: 3, card: true, draw: (d) => <RankCard rank={3} title="凍ったガラスにお湯" dur={d} /> },
  {
    from: at(2, '凍った'), to: s(3), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="hotwater.jpg" dur={d} />
        <Pill text="凍ったフロントガラスに" />
        <Impact text={'{お湯}をかける'} size={110} />
        <Sequence from={Math.round((at(2, 'お湯') - at(2, '凍った')) * FPS)}>
          <Stamp kind="ng" x={800} y={P.y + 560} />
        </Sequence>
      </>
    ),
  },
  {
    from: s(3), to: at(3, 'JAF'), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="frost.jpg" dur={d} />
        <Pill text="急いでいる朝ほど" />
        <Impact text={'ついやりがち'} size={104} />
        <Buddy mood="point" />
      </>
    ),
  },
  {
    from: at(3, 'JAF'), to: at(3, '割れる'), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="frost.jpg" dur={d} blur={5} zoom={[1.14, 1.18]} />
        <NavyLabel text="JAFによると" y={P.y + 40} />
        <TempClash y={P.y + 200} />
        <Source text="JAF" />
      </>
    ),
  },
  {
    from: at(3, '割れる'), to: at(3, '溶けた'), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="crack.jpg" dur={d} zoom={[1.05, 1.15]} />
        <Crack x={430} y={P.y + 360} />
        <Impact text={'ガラスが\n{割れる}ことも'} size={104} />
      </>
    ),
  },
  {
    from: at(3, '溶けた'), to: s(4), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="refreeze.jpg" dur={d} zoom={[1.0, 1.12]} />
        <Refreeze dur={d} />
        <Impact text={'溶けた水が\n{すぐまた凍る}'} size={104} />
      </>
    ),
  },
  {
    from: s(4), to: at(4, '解氷'), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="hotwater.jpg" dur={d} zoom={[1.2, 1.26]} />
        <Pill text="ぬるま湯でも" />
        <Impact text={'{同じくNG}'} size={110} />
        <Stamp kind="ng" x={800} y={P.y + 520} />
      </>
    ),
  },
  {
    from: at(4, '解氷'), to: at(4, 'プラスチック'), tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="spray.jpg" dur={d} focus={[0.78, 0.5]} />
        <Pill text="正しいのは" color={C.green} />
        <Impact text={'{解氷スプレー}'} size={110} hot={C.green} />
      </>
    ),
  },
  {
    from: at(4, 'プラスチック'), to: e(4) + 0.05, tag: '第3位｜お湯', rank: 3,
    draw: (d) => (
      <>
        <Photo src="scraper.jpg" dur={d} />
        <Pill text="ガラスを傷つけない" color={C.green} />
        <Impact text={'{プラスチックのヘラ}'} size={100} hot={C.green} />
        <Stamp kind="ok" x={800} y={P.y + 500} />
      </>
    ),
  },
  // ── 第2位 ──
  { from: e(4) + 0.05, to: at(5, '雪国'), rank: 2, card: true, draw: (d) => <RankCard rank={2} title="サイドブレーキで駐車" dur={d} /> },
  {
    from: at(5, '雪国'), to: s(6), tag: '第2位｜サイドブレーキ', rank: 2,
    draw: (d) => (
      <>
        <Photo src="handbrake.jpg" dur={d} />
        <Pill text="雪国で駐車するとき" />
        <Impact text={'{サイドブレーキ}を\nかけたまま'} size={100} />
        <Sequence from={Math.round((at(5, '駐車') - at(5, '雪国')) * FPS)}>
          <Stamp kind="ng" x={800} y={P.y + 440} />
        </Sequence>
      </>
    ),
  },
  {
    from: s(6), to: at(6, '朝'), tag: '第2位｜サイドブレーキ', rank: 2,
    draw: (d) => (
      <>
        <Photo src="frozenwheel.jpg" dur={d} />
        <Pill text="寒い夜は" />
        <FrozenLock x={760} y={P.y + 420} />
        <Impact text={'ワイヤーが\n{凍りつく}'} size={104} />
      </>
    ),
  },
  {
    from: at(6, '朝'), to: s(7), tag: '第2位｜サイドブレーキ', rank: 2,
    draw: (d) => (
      <>
        <Photo src="handbrake.jpg" dur={d} zoom={[1.15, 1.22]} />
        <Pill text="朝になると" />
        <Impact text={'{解除できない}'} size={110} />
        <Buddy mood="warn" />
      </>
    ),
  },
  {
    from: s(7), to: at(7, 'Pに'), tag: '第2位｜サイドブレーキ', rank: 2,
    draw: (d) => (
      <>
        <Photo src="parking.jpg" dur={d} />
        <Pill text="正しい止め方" color={C.green} />
        <Impact text={'{平らな場所}に止める'} size={96} hot={C.green} />
      </>
    ),
  },
  {
    from: at(7, 'Pに'), to: at(7, '輪留め'), tag: '第2位｜サイドブレーキ', rank: 2,
    draw: (d) => (
      <>
        <Photo src="shift.jpg" dur={d} />
        <Impact text={'ギアは{P}に'} size={116} hot={C.green} />
      </>
    ),
  },
  {
    from: at(7, '輪留め'), to: e(7) + 0.05, tag: '第2位｜サイドブレーキ', rank: 2,
    draw: (d) => (
      <>
        <Photo src="chock.jpg" dur={d} />
        <Impact text={'{輪留め}をしておく'} size={104} hot={C.green} />
        <Stamp kind="ok" x={800} y={P.y + 440} />
      </>
    ),
  },
  // ── 第1位 ──
  { from: e(7) + 0.05, to: at(8, 'マフラー'), rank: 1, card: true, draw: (d) => <RankCard rank={1} title="雪に埋まったままエンジン" dur={d} /> },
  {
    from: at(8, 'マフラー'), to: s(9), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="muffler.jpg" dur={d} focus={[0.55, 0.8]} zoom={[1.45, 1.55]} lift={260} />
        <Pill text="マフラーが雪に埋まったまま" size={48} />
        <Impact text={'{エンジン}を\nかけ続ける'} size={104} />
        <Sequence from={Math.round((at(8, 'エンジン') - at(8, 'マフラー')) * FPS)}>
          <Stamp kind="ng" x={800} y={P.y + 460} />
        </Sequence>
      </>
    ),
  },
  {
    from: s(9), to: at(9, 'テスト'), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="jaf.jpg" dur={d} focus={[0.5, 0.2]} zoom={[1.22, 1.3]} />
        <NavyLabel text="JAFの実験" y={P.y + 40} />
        <Impact text={'車を{雪に埋めて}\n測ったテスト'} size={92} />
        <Source text="JAF" />
      </>
    ),
  },
  {
    from: at(9, 'テスト'), to: at(9, 'さらに'), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="hook.jpg" dur={d} blur={6} zoom={[1.12, 1.18]} />
        <COMeter clock={[0, 84]} ppm={[0, 50]} dur={d} y={P.y + 120} />
        <Impact text={'{1分24秒}で\n警報レベル'} size={96} />
        <Source text="JAFユーザーテスト（2021年）" />
      </>
    ),
  },
  {
    from: at(9, 'さらに'), to: s(10), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="hook.jpg" dur={d} blur={6} zoom={[1.18, 1.24]} />
        <COMeter clock={[84, 18 * 60]} ppm={[50, null]} dur={d} y={P.y + 120} />
        <Impact text={'さらに{20分足らず}で'} size={96} />
        <Source text="JAFユーザーテスト（2021年）" />
      </>
    ),
  },
  {
    from: s(10), to: at(10, 'こまめ'), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="window.jpg" dur={d} />
        <Pill text="窓を少し開けるだけでは" size={48} />
        <Impact text={'{防げない}'} size={116} />
        <Stamp kind="ng" x={800} y={P.y + 460} />
      </>
    ),
  },
  {
    from: at(10, 'こまめ'), to: at(10, 'できるだけ'), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="shovel.jpg" dur={d} />
        <Pill text="こまめに" color={C.green} />
        <Impact text={'マフラーのまわりを\n{除雪}する'} size={96} hot={C.green} />
        <Arrow x={760} y={P.y + 600} angle={120} />
      </>
    ),
  },
  {
    from: at(10, 'できるだけ'), to: s(11), tag: '第1位｜マフラー', rank: 1,
    draw: (d) => (
      <>
        <Photo src="stuck.jpg" dur={d} />
        <Pill text="できるだけ" color={C.green} />
        <Impact text={'{エンジンを切る}'} size={110} hot={C.green} />
        <Stamp kind="ok" x={800} y={P.y + 460} />
      </>
    ),
  },
  // ── Kết ──
  {
    from: s(11), to: 999, tag: '雪の日の危険', rank: null,
    draw: (d) => (
      <>
        <Photo src="road.jpg" dur={d} />
        <Snow />
        <Impact text={'雪の日の{ヒヤッと}体験\nコメントで教えてね'} size={78} maxW={700} />
        <Buddy mood="happy" x={70} />
      </>
    ),
  },
];

const Subtitles: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let cur = '';
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i];
    const next = chunks[i + 1];
    if (t >= c.start - 0.05 && t < (next ? next.start - 0.05 : c.end + 2)) cur = c.text;
  }
  return cur ? <SubtitleBar text={cur} /> : null;
};

export const CarTips: React.FC = () => {
  useFonts(LINES.map((l) => l.text).join('') + '第位選雪の日危険NG行動お湯サイドブレーキマフラー測定器上限超え警報レベル車内一酸化炭素出典JAFユーザーテスト年正しい止め方プラスチックヘラ解氷スプレー窓少開防除雪切ヒヤッと体験コメント教え急温度差熱ガラス氷点下');
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = SHOTS.find((x) => t >= x.from && t < x.to);
  return (
    <AbsoluteFill style={{ backgroundColor: C.boardDark }}>
      <Board />
      {SHOTS.map((x, i) => {
        const from = Math.round(x.from * FPS);
        const dur = Math.max(1, Math.round(Math.min(x.to, 999) * FPS) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            {x.draw(dur)}
          </Sequence>
        );
      })}
      {shot && !shot.card && shot.tag && (() => {
        // thẻ mục chỉ nảy vào khi đổi mục, không nảy lại ở mỗi cảnh
        let k = SHOTS.indexOf(shot);
        while (k > 0 && SHOTS[k - 1].tag === shot.tag && !SHOTS[k - 1].card) k--;
        return (
          <Sequence from={Math.round(SHOTS[k].from * FPS)} layout="none">
            <SectionTag text={shot.tag} />
          </Sequence>
        );
      })()}
      {shot && !shot.card && <Progress current={shot.rank ?? null} />}
      <Subtitles />
    </AbsoluteFill>
  );
};
