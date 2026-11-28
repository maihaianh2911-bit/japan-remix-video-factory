// 「第3子生まれたら1000万円」自民党が政府に提言へ（自民党人口戦略本部 2026年11月27日）
import React from 'react';
import { Sequence } from 'remotion';
import { makeTime } from '../time';
import timing from './daisanshi.timing.json';
import { F, NewsFrame, Shot } from '../frame';
import { BigNumber, BigQuestion, C, Card, Clipping, Headline, K, Label, Reporter, SERIF, Stamp, YearBars } from '../kit';

const time = makeTime(timing);
const { s, at } = time;
const I = (n: string) => `daisanshi/${n}.jpg`;
const ANN = 'テレ朝NEWS・ABEMA（2026年11月27〜28日）';
const MHLW = '厚生労働省 人口動態統計（2025年）';

const SHOTS: Shot[] = [
  // ── Hook: ảnh em bé + tem 「1000万円」 từ khung hình đầu ──
  {
    from: 0, to: s(1), src: 'ぱくたそ（イメージ写真）',
    draw: (d) => (
      <Sequence from={-10} layout="none">
        <Clipping src={I('baby')} dur={d + 10} caption="3人目が生まれたら" angle={-2} zoom={[1.0, 1.1]} focus={[0.5, 0.45]} />
        <Stamp text="1000万円" x={430} y={K.y + 40} size={110} angle={6} />
        <Sequence from={F(at(0, '自民党')) + 4} layout="none">
          <Stamp text="自民が提言" x={60} y={K.y + 580} size={84} angle={-6} />
        </Sequence>
      </Sequence>
    ),
  },
  {
    from: s(1), to: s(2), src: 'FNNプライムオンライン（2026年11月27日）',
    draw: (d) => (
      <>
        <Clipping src={I('news')} dur={d} fit="contain" zoom={[1.0, 1.04]} caption="自民党 人口戦略本部（11月27日）" angle={1.5} />
        <Sequence from={F(at(1, '1000万円') - s(1))}>
          <Stamp text="第3子以降" x={500} y={K.y + 560} size={84} angle={-6} />
        </Sequence>
      </>
    ),
  },
  {
    from: s(2), to: s(3), src: '戸塚共立レディースクリニック（イメージ）',
    draw: (d) => <Clipping src={I('ward')} dur={d} caption="止まらない少子化" angle={-1.5} />,
  },
  // ── Số trẻ sinh ra ──
  {
    from: s(3), to: at(3, '10年'), src: MHLW,
    draw: () => (
      <Card>
        <Label text="2025年に生まれた日本人" top={110} />
        <BigNumber to={671236} unit="人" sub="統計がある1899年以降で最少" top={300} size={150} dur={24} />
      </Card>
    ),
  },
  {
    from: at(3, '10年'), to: s(4), src: MHLW,
    draw: (d) => (
      <Card>
        <Label text="出生数の推移" top={60} />
        <YearBars
          dur={d}
          top={290}
          data={[
            { label: '2021', value: 811622 },
            { label: '2022', value: 770759 },
            { label: '2023', value: 727288 },
            { label: '2024', value: 686173 },
            { label: '2025', value: 671236 },
          ]}
        />
        <Stamp text="10年連続 過去最少" x={170} y={150} size={60} angle={-4} />
      </Card>
    ),
  },
  {
    from: s(4), to: s(5), src: MHLW,
    draw: () => (
      <Card>
        <Label text="合計特殊出生率（1人の女性が産む子どもの数）" top={110} />
        <BigNumber to={1.14} decimals={2} from={1.5} unit="" sub="過去最低" top={300} size={230} dur={24} />
      </Card>
    ),
  },
  // ── Đề xuất khác ──
  {
    from: s(5), to: at(5, '婚活'), src: '西葛西おひさま保育園（イメージ）',
    draw: (d) => <Clipping src={I('hoiku')} dur={d} caption="保育の無償化を もっと小さな年齢へ" angle={1.5} />,
  },
  {
    from: at(5, '婚活'), to: s(6), src: 'STORY（イメージ）',
    draw: (d) => <Clipping src={I('konkatsu')} dur={d} caption="婚活アプリへの支援" angle={-1.5} />,
  },
  {
    from: s(6), to: s(7), src: 'kinezuka.jp（イメージ）',
    draw: (d) => <Clipping src={I('senior')} dur={d} caption="定年の引き上げ・「高齢者」の見直し" angle={1.5} />,
  },
  {
    from: s(7), to: s(8), src: ANN,
    draw: () => (
      <Card>
        <Label text="会合に出た担当大臣" top={90} />
        <Headline text={'「大変示唆に富む\n{充実した内容だ}」'} size={78} top={250} />
        <Reporter x={620} y={500} mood="point" scale={0.8} />
      </Card>
    ),
  },
  {
    from: s(8), to: s(9), src: '東京新聞（資料写真）',
    draw: (d) => <Clipping src={I('takaichi')} dur={d} caption="来週にも高市総理に申し入れ" angle={-1.5} focus={[0.5, 0.35]} />,
  },
  {
    from: s(9), to: s(10), src: ANN,
    draw: () => (
      <Card>
        <Headline text={'一方で\n{懸念の声}も'} size={110} top={230} />
        <Reporter x={600} y={500} mood="think" />
      </Card>
    ),
  },
  {
    from: s(10), to: s(11),
    draw: () => (
      <Card>
        <Label text="1000万円 ÷ 20年 ÷ 12か月" top={110} />
        <BigNumber to={4} unit="万円" prefix="月 約" sub="子どもが20歳になるまで" top={300} size={200} dur={18} />
      </Card>
    ),
  },
  {
    from: s(11), to: 999, src: 'grapee（イメージ）',
    draw: (d) => (
      <>
        <Clipping src={I('family')} dur={d} caption="1000万円で 3人目を考えますか？" angle={-1.5} />
        <Stamp text="あなたなら？" x={480} y={K.y + 40} size={84} angle={6} />
      </>
    ),
  },
];

const HOT = ['1000万円', '3人目', '第3子', '少子化', '67万1236人', '10年連続', '過去最少', '1.14', '過去最低', '無償化', '婚活アプリ', '定年', '高齢者', '充実した内容', '高市総理', '懸念の声', '4万円'];

export const Daisanshi: React.FC = () => (
  <NewsFrame
    title={'第3子が生まれたら\n{1000万円}給付案'}
    tag="社会"
    date="2026年11月28日"
    time={time}
    shots={SHOTS}
    hot={HOT}
    glyphs="第3子が生まれたら万円給付案人目自民が提言人口戦略本部月日以降止まらない少子化年に生まれた日本人統計がある以降で最少出生数の推移連続過去合計特殊率1人の女性が産む子どもの数最低保育無償化をもっと小さな年齢へ婚活アプリへの支援定年引き上げ高齢者見直し会合に出た担当大臣大変示唆に富む充実した内容だ来週にも高市総理に申し入れ一方で懸念の声も÷20か約歳になるまで考えますかあなたなら？テレ朝厚生労働省動態（）「」・〜"
  />
);
