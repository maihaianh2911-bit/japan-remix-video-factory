// 関文科相の問責決議案、4票差で否決（参院本会議 2026年11月27日）。政治のニュース: 事実と双方の発言だけ、意見は入れない。
import React from 'react';
import { Sequence } from 'remotion';
import { makeTime } from '../time';
import timing from './seki.timing.json';
import { F, NewsFrame, Shot } from '../frame';
import { BigNumber, BigQuestion, C, Card, Clipping, Headline, K, Label, Reporter, SANS, SERIF, Stamp, VoteLine, VSBars } from '../kit';

const time = makeTime(timing);
const { s, at } = time;
const I = (n: string) => `seki/${n}.jpg`;
const KYODO = '共同通信・ロイター（2026年11月27日）';
const PARTY = '共同通信（2026年11月13〜18日）';

const SHOTS: Shot[] = [
  // ── Hook: ảnh thật phiên Thượng viện + tem 「4票差」 từ khung hình đầu ──
  {
    from: 0, to: s(1), src: '朝日新聞（2026年11月27日）',
    draw: (d) => (
      <Sequence from={-10} layout="none">
        <Clipping src={I('hook')} dur={d + 10} caption="関文科相の問責決議案" angle={-2} zoom={[1.0, 1.1]} focus={[0.5, 0.4]} />
        <Stamp text="4票差" x={560} y={K.y + 50} size={110} angle={6} />
        <Sequence from={F(at(0, '否決')) + 10} layout="none">
          <Stamp text="否決" x={480} y={K.y + 560} size={110} angle={-8} />
        </Sequence>
      </Sequence>
    ),
  },
  {
    from: s(1), to: s(2), src: 'auone（2026年11月）',
    draw: (d) => <Clipping src={I('party')} dur={d} fit="contain" zoom={[1.0, 1.04]} caption="官僚を呼んだ政治資金パーティー" angle={1.5} />,
  },
  // ── Tiệc ở tòa nhà nghị sĩ, vé 9 vạn yên ──
  {
    from: s(2), to: at(2, '会費'), src: '衆議院第一議員会館（Yuukokusya, CC BY-SA 3.0）',
    draw: (d) => <Clipping src={I('kaikan')} dur={d} caption="議員会館（2024年6月）" angle={-1.5} />,
  },
  {
    from: at(2, '会費'), to: s(3), src: PARTY,
    draw: () => (
      <Card>
        <Label text="パーティーの会費（1人）" top={110} />
        <BigNumber to={90000} unit="円" sub="9人が参加" top={300} size={170} dur={20} />
      </Card>
    ),
  },
  {
    from: s(3), to: s(4), src: PARTY,
    draw: () => (
      <Card>
        <Label text="衆議院の決まり" top={90} />
        <Headline text={'議員会館での\nパーティーは\n{禁止}'} size={96} top={200} />
        <Sequence from={F(at(3, '厳重注意') - s(3))}>
          <Stamp text="厳重注意" x={250} y={640} size={84} angle={-6} />
        </Sequence>
      </Card>
    ),
  },
  // ── Ai dự, ai giải thích ──
  {
    from: s(4), to: s(5), src: PARTY,
    draw: () => (
      <Card>
        <Label text="2024年6月 議員会館" top={80} />
        <BigNumber to={9} unit="人" sub="バイオ医薬品などの企業" top={170} size={170} dur={14} />
        <Sequence from={F(at(4, '厚生労働省') - s(4))}>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 560, border: `6px solid ${C.ink}`, background: '#fff', padding: '22px 26px' }}>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 34, color: C.red }}>説明したのは</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink, marginTop: 6 }}>厚生労働省の担当者</div>
            <div style={{ fontFamily: SERIF, fontWeight: 700, fontSize: 40, color: C.ink, marginTop: 6 }}>テーマ：治験の制度</div>
          </div>
        </Sequence>
      </Card>
    ),
  },
  {
    from: s(5), to: s(6), src: PARTY,
    draw: () => (
      <Card>
        <Label text="2024年3月 都内のホテル" top={80} />
        <BigNumber to={11} unit="人" sub="バイオ医薬品などの企業" top={170} size={170} dur={14} />
        <Sequence from={F(at(5, '経済産業省') - s(5))}>
          <div style={{ position: 'absolute', left: 60, right: 60, top: 560, border: `6px solid ${C.ink}`, background: '#fff', padding: '22px 26px' }}>
            <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 34, color: C.red }}>呼ばれたのは</div>
            <div style={{ fontFamily: SERIF, fontWeight: 900, fontSize: 56, color: C.ink, marginTop: 6 }}>経済産業省の課長</div>
          </div>
        </Sequence>
      </Card>
    ),
  },
  // ── Lời ông Seki ──
  {
    from: s(6), to: s(7), src: '東京新聞（2026年11月）',
    draw: (d) => (
      <>
        <Clipping src={I('kaiken')} dur={d} caption="「法的な問題はない」" angle={1.5} focus={[0.55, 0.35]} />
        <Sequence from={F(at(6, '謝罪') - s(6))}>
          <Stamp text="謝罪" x={600} y={K.y + 520} size={100} angle={-8} />
        </Sequence>
      </>
    ),
  },
  // ── Bỏ phiếu ──
  {
    from: s(7), to: s(8), src: '東京新聞（2026年11月27日）',
    draw: (d) => <Clipping src={I('honkaigi')} dur={d} caption="11月27日 参議院本会議" angle={-1.5} />,
  },
  {
    from: s(8), to: at(8, '可決'), src: KYODO,
    draw: (d) => (
      <Card>
        <VSBars a={{ label: '賛成', value: 120 }} b={{ label: '反対', value: 124 }} dur={d} max={124} unit="票" />
      </Card>
    ),
  },
  {
    from: at(8, '可決'), to: s(9), src: KYODO,
    draw: (d) => (
      <Card>
        <Label text="問責決議案（投票244票）" top={90} />
        <VoteLine have={120} need={123} dur={d} max={130} />
      </Card>
    ),
  },
  {
    from: s(9), to: s(10), src: 'ロイター（2026年11月27日）',
    draw: () => (
      <Card>
        <Label text="反対討論の自民党議員も" top={90} />
        <Headline text={'関大臣に\n{「猛省を}\n{促したい」}'} size={100} top={200} align="left" />
        <Reporter x={600} y={470} mood="think" />
      </Card>
    ),
  },
  {
    from: s(10), to: s(11), src: '東京新聞（資料写真）',
    draw: (d) => <Clipping src={I('takaichi')} dur={d} caption="「本人が説明責任を果たすべき」" angle={1.5} focus={[0.5, 0.35]} />,
  },
  {
    from: s(11), to: s(12), src: KYODO,
    draw: () => (
      <Card>
        <Label text="大臣のいすを守った差" top={110} />
        <BigNumber to={4} unit="票" top={280} size={300} dur={16} />
      </Card>
    ),
  },
  {
    from: s(12), to: 999,
    draw: () => (
      <Card>
        <BigQuestion />
        <Headline text={'この{4票差}\nどう見ますか？'} size={96} top={260} />
        <div style={{ position: 'absolute', top: 560, width: '100%', textAlign: 'center', fontFamily: SERIF, fontWeight: 700, fontSize: 44, color: C.ink }}>コメントで教えてください</div>
        <Reporter x={380} y={640} scale={0.7} mood="ask" />
      </Card>
    ),
  },
];

const HOT = ['4票差', '否決', '9万円', '禁止', '厳重注意', '9人', '治験', '11人', '法的な問題はない', '謝罪', '124票', '120票', '123票', '3票', '猛省', '続投', '説明責任', '4票'];

export const Seki: React.FC = () => (
  <NewsFrame
    title={'関文科相の問責決議案\n{4票差}で{否決}'}
    tag="政治"
    date="2026年11月28日"
    time={time}
    shots={SHOTS}
    hot={HOT}
    glyphs="関文科相の問責決議案票差否決官僚を呼んだ政治資金パーティー議員会館年月会費人ふつうは万円ほど衆議院の決まりでは禁止厳重注意バイオ医薬品などの企業説明したのは厚生労働省担当者テーマ治験制度都内ホテル呼ばれたのは経済産業省課長法的な問題はない謝罪日参議院本会議賛成反対投票可決ラインあと討論自民党議員も大臣に猛省を促したい本人が説明責任を果たすべきいすを守った差この見ますかコメントで教えてください共同通信ロイター〜（）「」▼？"
  />
);
