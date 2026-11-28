// いじめ79万件で過去最多、性的いじめ初調査8158件（文部科学省 2025年度調査、2026年11月26日公表）
import React from 'react';
import { Sequence } from 'remotion';
import { makeTime } from '../time';
import timing from './ijime.timing.json';
import { F, NewsFrame, Shot } from '../frame';
import { BigNumber, BigQuestion, C, Card, Clipping, HBars, Headline, K, Label, Reporter, SANS, SERIF, Stamp, YearBars } from '../kit';

const time = makeTime(timing);
const { s, e, at } = time;
const MEXT = '文部科学省「児童生徒の問題行動・不登校等調査」（2026年11月26日公表）';
const I = (n: string) => `ijime/${n}.jpg`;

const SHOTS: Shot[] = [
  // ── Hook: ảnh lớp học trống + 「79万件」「過去最多」 hiện ngay từ khung hình đầu ──
  {
    from: 0, to: s(1), src: 'adire.jp（イメージ写真）',
    draw: (d) => (
      <Sequence from={-10} layout="none">
        <Clipping src={I('bully')} dur={d + 10} caption="学校のいじめ 79万件" angle={-2} zoom={[1.0, 1.1]} focus={[0.3, 0.45]} />
        <Stamp text="79万件" x={560} y={K.y + 50} size={100} angle={6} />
        <Stamp text="過去最多" x={500} y={K.y + 580} size={96} angle={-8} />
      </Sequence>
    ),
  },
  {
    from: s(1), to: s(2), src: 'ABCニュース（2026年11月26日）',
    draw: (d) => (
      <>
        <Clipping src={I('abc')} dur={d} fit="contain" zoom={[1.0, 1.04]} caption="「性的いじめ」を初めて調査" angle={1.5} />
        <Sequence from={F(at(1, '8000件') - s(1))}>
          <Stamp text="8000件超" x={460} y={K.y + 600} size={88} />
        </Sequence>
      </>
    ),
  },
  // ── 79万1784件 ──
  {
    from: s(2), to: at(2, '79万'), src: 'NHK NEWS WEB（2026年11月26日）',
    draw: (d) => <Clipping src={I('mext')} dur={d} caption="文部科学省の調査（11月26日公表）" angle={-1.5} />,
  },
  {
    from: at(2, '79万'), to: s(3), src: MEXT,
    draw: () => (
      <Card>
        <Label text="2025年度 いじめの認知件数" top={110} />
        <BigNumber to={791784} unit="件" sub="小・中・高・特別支援学校" top={300} size={150} dur={30} />
      </Card>
    ),
  },
  {
    from: s(3), to: s(4), src: MEXT,
    draw: (d) => (
      <Card>
        <Label text="いじめの認知件数" top={60} />
        <YearBars
          dur={d}
          top={290}
          data={[
            { label: '2021', value: 615351 },
            { label: '2022', value: 681948 },
            { label: '2023', value: 732568 },
            { label: '2024', value: 769022 },
            { label: '2025', value: 791784 },
          ]}
        />
        <Sequence from={14}>
          <Stamp text="5年連続 過去最多" x={170} y={150} size={60} angle={-4} />
        </Sequence>
      </Card>
    ),
  },
  // ── 重大事態 1798件 ──
  {
    from: s(4), to: at(4, '1798'), src: '日テレNEWS（2026年11月26日）',
    draw: (d) => <Clipping src={I('ntv')} dur={d} fit="contain" zoom={[1.0, 1.04]} caption="「重大事態」も過去最多" angle={1.5} />,
  },
  {
    from: at(4, '1798'), to: s(5), src: MEXT,
    draw: () => (
      <Card>
        <Label text="いじめの重大事態" top={110} />
        <BigNumber to={1798} unit="件" sub="これまでで最多" top={300} size={190} dur={22} />
      </Card>
    ),
  },
  // ── ネットいじめ ──
  {
    from: s(5), to: at(5, '初めて'), src: 'qreon.jp（イメージ）',
    draw: (d) => <Clipping src={I('phone')} dur={d} caption="スマホなどでの悪口" angle={-2} />,
  },
  {
    from: at(5, '初めて'), to: s(6), src: '朝日新聞（2026年11月26日）',
    draw: () => (
      <Card>
        <Label text="ネットいじめ" top={110} />
        <BigNumber to={30471} unit="件" sub="前年度比 +11.4%" top={300} size={180} dur={20} />
        <Stamp text="初の3万件超え" x={220} y={650} size={62} angle={-5} />
      </Card>
    ),
  },
  // ── 性的いじめ ──
  {
    from: s(6), to: s(7), src: MEXT,
    draw: () => (
      <Card>
        <Label text="性的いじめ（初めての調査）" top={110} />
        <BigNumber to={8158} unit="件" top={320} size={210} dur={22} />
        <Sequence from={F(at(6, '8158') - s(6)) + 10}>
          <Stamp text="初調査" x={330} y={650} size={76} angle={-6} />
        </Sequence>
      </Card>
    ),
  },
  {
    from: s(7), to: s(8), src: '朝日新聞・中日新聞（2026年11月）',
    draw: (d) => (
      <Card>
        <Label text="性的いじめ 学校別" top={90} />
        <HBars
          dur={d}
          top={240}
          data={[
            { label: '小学校', value: 4852 },
            { label: '中学校', value: 2738 },
            { label: '高校', value: 453 },
            { label: '特別支援', value: 115 },
          ]}
        />
        <Sequence from={F(at(7, '小学校') - s(7))}>
          <Stamp text="半分以上が小学校" x={150} y={680} size={58} angle={-5} />
        </Sequence>
      </Card>
    ),
  },
  // ── AI 偽画像 ──
  {
    from: s(8), to: s(9), src: '朝日新聞（図解）',
    draw: (d) => (
      <>
        <Clipping src={I('deepfake')} dur={d} fit="contain" zoom={[1.0, 1.05]} caption="AIで作られる偽の性的な画像" angle={1.5} />
        <Sequence from={F(at(8, '危機感') - s(8))}>
          <Stamp text="危機感" x={560} y={K.y + 560} size={88} />
        </Sequence>
      </>
    ),
  },
  // ── 不登校 ──
  {
    from: s(9), to: at(9, '35万'), src: 'cizucu（イメージ）',
    draw: (d) => <Clipping src={I('window')} dur={d} caption="不登校の子ども" angle={-1.5} />,
  },
  {
    from: at(9, '35万'), to: s(10), src: MEXT,
    draw: () => (
      <Card>
        <Label text="不登校の児童生徒" top={110} />
        <BigNumber to={359424} unit="人" sub="13年連続で増加" top={300} size={160} dur={26} />
      </Card>
    ),
  },
  // ── Lời giải thích của Bộ ──
  {
    from: s(10), to: s(11), src: MEXT,
    draw: () => (
      <Card>
        <Label text="文部科学省の説明" top={80} />
        <Headline text={'小さなサインも\n{見逃さず}\n数えた結果でもある'} size={84} top={190} align="left" />
        <Reporter x={600} y={470} mood="think" />
      </Card>
    ),
  },
  // ── Kết ──
  {
    from: s(11), to: s(12), src: 'rand-land.com（イメージ）',
    draw: (d) => <Clipping src={I('randsel')} dur={d} caption="数字の向こうに、一人ひとりの子ども" angle={-1.5} />,
  },
  {
    from: s(12), to: 999, src: '文部科学省',
    draw: () => (
      <Card>
        <div style={{ position: 'absolute', top: 120, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 64, color: C.ink, lineHeight: 1.3 }}>
          ひとりで悩まないで
        </div>
        <div style={{ position: 'absolute', top: 280, width: '100%', textAlign: 'center' }}>
          <span style={{ fontFamily: SANS, fontWeight: 900, fontSize: 46, color: '#fff', background: C.ink, padding: '8px 24px 12px' }}>24時間子供SOSダイヤル</span>
        </div>
        <div style={{ position: 'absolute', top: 400, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 900, fontSize: 110, color: C.red, letterSpacing: -2 }}>
          0120-0-78310
        </div>
        <div style={{ position: 'absolute', top: 560, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 48, color: C.ink }}>
          なやみ言おう・通話無料
        </div>
        <Reporter x={360} y={620} scale={0.7} mood="point" />
      </Card>
    ),
  },
];

const HOT = ['79万件', '過去最多', '性的いじめ', '8000件', '79万1784件', '5年連続', '重大事態', '1798件', '3万件', '8158件', '4852件', '小学校', '危機感', '35万9424人', '13年連続', '小さなサイン', '一人ひとり', '0120-0-78310'];

export const Ijime: React.FC = () => (
  <NewsFrame
    title={"学校のいじめ{79万件} {過去最多}\n「性的いじめ」初調査で{8158件}"} tag="社会" date="2026年11月28日"
    time={time}
    shots={SHOTS}
    hot={HOT}
    glyphs="学校のいじめ万件過去最多性的初めて調査超文部科学省月日公表年度認知小中高特別支援重大事態これまでで最多ネットスマホなどでの悪口前年比初の万件超え学校別半分以上が小学校中学校高校特別支援危機感で作られる偽の画像不登校児童生徒連続で増加説明さなサインも見逃さず数えた結果でもある数字の向こうに一人ひとりの子どもひとりで悩まないで時間子供ダイヤルなやみ言おう通話無料朝日新聞中日新聞児童生徒の問題行動・不登校等調査（）+%"
  />
);
