// 冷やご飯の秘密（レジスタントスターチ）— bản thử 28/11/2026, theo kịch bản tiếng Việt của kênh Y Học Tâm Trí, đã gọn lại
// và sửa cho đúng nghiên cứu: Sonia et al., Asia Pac J Clin Nutr 2015;24(4):620-5 (0.64 → 1.65 g/100 g, 15 người, AUC
// 152 → 125); ALIC「でん粉情報」(RS → 短鎖脂肪酸・酪酸); 農林水産省「セレウス菌」(小分けしてすぐ冷蔵).
import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { makeTime } from '../time';
import timing from './hiyagohan.timing.json';
import { ExplainFrame, F, Shot } from '../frame';
import { Badge, Bars, BigText, Board, Bubbles, C, Check, clamp, Lens, Pic, PIC, PIC_TALL, Starch, Step, SugarGraph, Tag, Warning } from '../kit';

const time = makeTime(timing);
const { s, at } = time;
const END = timing.duration + 0.8;
const I = (n: string) => `images/hiyagohan/${n}.jpg`;
const STUDY = '出典：Sonia S, et al. Asia Pac J Clin Nutr. 2015;24(4):620-5';
const ALIC = '出典：農畜産業振興機構「でん粉情報」ほか';
const MAFF = '出典：農林水産省「セレウス菌による食中毒」';

/** Giá trị chạy từ 0 → 1 giữa hai giây (tính từ đầu cảnh). */
const useRamp = (a: number, b: number) => {
  const f = useCurrentFrame();
  return interpolate(f, [F(a), Math.max(F(a) + 1, F(b))], [0, 1], clamp);
};

const StarchSwell: React.FC<{ t0: number; tFree: number; tEnd: number }> = ({ t0, tFree, tEnd }) => {
  const swell = useRamp(0, tFree - t0 - 0.2);
  const free = useRamp(tFree - t0, tEnd - t0);
  return <Starch swell={swell} free={free} />;
};

const StarchPack: React.FC<{ len: number }> = ({ len }) => {
  const pack = useRamp(0.3, len);
  return <Starch swell={1} pack={pack} tone="#e9b949" />;
};

const Graph: React.FC<{ both?: boolean; len: number }> = ({ both = false, len }) => {
  const draw = useRamp(0, both ? 0.01 : Math.min(2.2, len));
  const cool = useRamp(0.2, Math.min(2.4, len));
  return <SugarGraph draw={both ? 1 : draw} cool={cool} showCool={both} />;
};

const RSBars: React.FC = () => {
  const grow = useRamp(0.1, 1.6);
  return (
    <Bars
      grow={grow}
      max={1.9}
      title="レジスタントスターチの量（ごはん100gあたり）"
      data={[
        { label: '炊きたて', value: 0.64, color: '#f3a35f', text: '0.64g' },
        { label: '冷やして温め直し', sub: '4℃で24時間', value: 1.65, color: C.teal, text: '1.65g' },
      ]}
    />
  );
};

// ── Đường đi của tinh bột kháng trên hình hệ tiêu hóa (File:Appendix-ar.png, CC0, 1920×1920) ──
const GUT = { size: 1920, zoom: 1.4, focus: [0.5, 0.668] as [number, number] };
/** Điểm (x, y) trên ảnh gốc → điểm trên màn hình (ảnh phủ kín PIC, phóng to GUT.zoom quanh GUT.focus). */
const gutPt = (x: number, y: number): [number, number] => {
  const s0 = Math.max(PIC.w, PIC.h) / GUT.size;
  const shown = GUT.size * s0;
  const px = x * s0 + (PIC.w - shown) * GUT.focus[0];
  const py = y * s0 + (PIC.h - shown) * GUT.focus[1];
  const ox = GUT.focus[0] * PIC.w;
  const oy = GUT.focus[1] * PIC.h;
  return [PIC.x + ox + GUT.zoom * (px - ox), PIC.y + oy + GUT.zoom * (py - oy)];
};
const ROUTE: [number, number][] = [
  [1035, 939], [896, 1067], [832, 1237], [1152, 1280], [790, 1408], [1131, 1472], [853, 1557], [725, 1536],
  [672, 1365], [672, 1152], [939, 1099], [1216, 1067], [1280, 1280], [1259, 1470],
].map(([x, y]) => gutPt(x, y));
const INTO_COLON = 7; // từ điểm này là ruột già

const GutRoute: React.FC<{ len: number }> = ({ len }) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [F(0.3), F(Math.max(0.8, len - 0.4))], [0, 1], clamp);
  const seg = ROUTE.slice(1).map((pt, i) => Math.hypot(pt[0] - ROUTE[i][0], pt[1] - ROUTE[i][1]));
  const total = seg.reduce((a, b) => a + b, 0);
  let left = p * total;
  const done: [number, number][] = [ROUTE[0]];
  let head = ROUTE[0];
  let k = 0;
  for (; k < seg.length; k++) {
    if (left <= seg[k]) {
      const u = left / seg[k];
      head = [ROUTE[k][0] + (ROUTE[k + 1][0] - ROUTE[k][0]) * u, ROUTE[k][1] + (ROUTE[k + 1][1] - ROUTE[k][1]) * u];
      done.push(head);
      break;
    }
    left -= seg[k];
    done.push(ROUTE[k + 1]);
  }
  const inColon = k >= INTO_COLON;
  const glow = 0.6 + 0.4 * Math.sin(f / 3);
  return (
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <clipPath id="picclip">
          <rect x={PIC.x} y={PIC.y} width={PIC.w} height={PIC.h} rx={22} />
        </clipPath>
      </defs>
      <g clipPath="url(#picclip)">
        <polyline points={done.map((q) => q.join(',')).join(' ')} fill="none" stroke="#fff" strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" opacity={0.9} />
        <polyline points={done.map((q) => q.join(',')).join(' ')} fill="none" stroke={C.orange} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 14" />
        <circle cx={head[0]} cy={head[1]} r={30 * glow} fill={inColon ? C.teal : C.yellow} opacity={0.35} />
        <circle cx={head[0]} cy={head[1]} r={17} fill={inColon ? C.teal : C.yellow} stroke="#fff" strokeWidth={5} />
      </g>
    </svg>
  );
};

const SHOTS: Shot[] = [
  // ── Hook: chữ lớn từ khung hình đầu ──
  {
    from: 0, to: s(1), title: '冷蔵庫に残った、{昨日の冷やご飯}', explain: '',
    draw: (d) => (
      <>
        <Pic src={I('fridge-rice')} dur={d} zoom={[1.0, 1.1]} box={PIC_TALL} focus={[0.45, 0.6]} />
        <Tag at={F(at(0, '栄養'))} x={PIC.x + 280} y={PIC.y + 470} dx={0} dy={-250} text="栄養がない？" tone="ink" size={40} />
        <Tag at={F(at(0, 'おなか'))} x={PIC.x + 640} y={PIC.y + 560} dx={20} dy={-200} text="おなかが冷える？" tone="ink" size={40} />
        <BigText text={'その冷やご飯、\n{捨てていませんか？}'} y={PIC_TALL.y + PIC_TALL.h - 290} size={92} />
      </>
    ),
  },
  {
    from: s(1), to: s(2), title: 'その一杯に、\n{腸を変える秘密}', explain: '秘密のカギは {でんぷん}',
    draw: (d) => (
      <>
        <Pic src={I('rice-close')} dur={d} zoom={[1.05, 1.2]} />
        <Lens at={F(at(1, '腸')) - F(s(1))} cx={PIC.x + PIC.w - 220} cy={PIC.y + 250} r={190} from={[PIC.x + 330, PIC.y + 470]} src={I('starch-sem')} label="顕微鏡で見たでんぷん" dur={d} />
      </>
    ),
  },
  // ── 炊きたて ──
  {
    from: s(2), to: at(2, 'すぐに'), title: '{炊きたて}のごはん', explain: 'でんぷんが {水を吸ってふくらむ}',
    draw: (d) => (
      <>
        <Board>
          <StarchSwell t0={s(2)} tFree={at(2, 'すぐに')} tEnd={at(2, '血糖値')} />
        </Board>
        <Tag at={F(at(2, 'でんぷん') - s(2))} x={PIC.x + 190} y={PIC.y + 120} dx={30} dy={-60} text="でんぷん" tone="orange" />
        <Tag at={F(at(2, '水') - s(2))} x={PIC.x + 520} y={PIC.y + 300} dx={40} dy={-70} text="水" tone="teal" />
        <Lens at={2} cx={PIC.x + PIC.w - 150} cy={PIC.y + PIC.h - 150} r={130} src={I('fresh-rice')} label="炊きたて" dur={d} />
      </>
    ),
  },
  {
    from: at(2, 'すぐに'), to: at(2, '血糖値'), explain: 'すぐに {糖} に変わる',
    draw: () => (
      <>
        <Board>
          <StarchSwell t0={at(2, 'すぐに') - 2} tFree={at(2, 'すぐに')} tEnd={at(2, '血糖値')} />
        </Board>
        <Tag at={F(0.5)} x={PIC.x + 470} y={PIC.y + 350} dx={0} dy={-260} text="糖（ブドウ糖）" tone="orange" />
      </>
    ),
  },
  {
    from: at(2, '血糖値'), to: s(3), explain: '血糖値が {一気に上がる}',
    draw: (d) => (
      <Board>
        <Graph len={d / 30} />
      </Board>
    ),
  },
  // ── 冷やすと ──
  {
    from: s(3), to: at(3, '消化'), title: '冷蔵庫で{冷やす}と', explain: 'でんぷんが {ぎゅっと縮む}',
    draw: (d) => (
      <>
        <Board tint="#eef4fb">
          <StarchPack len={d / 30 - 0.3} />
        </Board>
        <Lens at={2} cx={PIC.x + PIC.w - 150} cy={PIC.y + 150} r={130} src={I('fridge')} label="冷蔵庫で冷やす" dur={d} />
      </>
    ),
  },
  {
    from: at(3, '消化'), to: s(4), explain: '{消化されにくい} でんぷんに変身',
    draw: () => (
      <>
        <Board tint="#eef4fb">
          <Starch swell={1} pack={1} tone="#e9b949" />
        </Board>
        <Badge at={F(at(3, 'レジスタント') - at(3, '消化'))} x={PIC.x + PIC.w / 2} y={PIC.y + PIC.h - 110} text="レジスタントスターチ" tone="teal" size={60} angle={-3} />
      </>
    ),
  },
  // ── 研究 ──
  {
    from: s(4), to: at(4, 'これが'), title: 'インドネシアの{研究}', explain: '{4℃で24時間} 冷やし、温め直したごはんで調べると', src: STUDY,
    draw: () => (
      <>
        <Board />
        <Step at={F(0.2)} n={1} x={PIC.x + 40} y={PIC.y + 70} w={270} h={540} src={I('fresh-rice')} text="炊く" />
        <Step at={F(at(4, '4度') - s(4))} n={2} x={PIC.x + 340} y={PIC.y + 70} w={270} h={540} src={I('fridge')} text="4℃で24時間" focus={[0.5, 0.45]} />
        <Step at={F(at(4, '温め') - s(4))} n={3} x={PIC.x + 640} y={PIC.y + 70} w={250} h={540} src={I('microwave')} text="温め直す" focus={[0.35, 0.5]} />
      </>
    ),
  },
  {
    from: at(4, 'これが'), to: s(5), explain: '{レジスタントスターチ} が約2.5倍に',
    draw: () => (
      <>
        <Board>
          <RSBars />
        </Board>
        <Badge at={F(at(4, '約') - at(4, 'これが'))} x={PIC.x + 300} y={PIC.y + 260} text="約2.5倍" tone="orange" size={84} angle={-6} />
      </>
    ),
  },
  {
    from: s(5), to: s(6), title: '食後の{血糖値}', explain: '15人で食べ比べると、上がり方が {2割近く低い}',
    draw: (d) => (
      <>
        <Board>
          <Graph both len={d / 30} />
        </Board>
        <Badge at={F(at(5, '2割') - s(5))} x={PIC.x + 640} y={PIC.y + 200} text="2割近く低い" tone="teal" size={60} angle={-4} />
      </>
    ),
  },
  // ── 大腸へ ──
  {
    from: s(6), to: at(6, '腸内'), title: '小腸を{素通り}して大腸へ', explain: '{小腸で消化されず}、大腸まで届く', src: ALIC,
    draw: (d) => (
      <>
        <Pic src={I('gut')} dur={d} zoom={[GUT.zoom, GUT.zoom]} focus={GUT.focus} />
        <GutRoute len={d / 30} />
        <Tag at={F(0.1)} x={gutPt(1035, 939)[0]} y={gutPt(1035, 939)[1]} dx={150} dy={-40} text="胃" tone="ink" size={32} />
        <Tag at={F(at(6, '小腸') - s(6))} x={gutPt(1000, 1380)[0]} y={gutPt(1000, 1380)[1]} dx={330} dy={0} text="小腸：素通り" tone="orange" size={32} />
        <Tag at={F(at(6, '大腸') - s(6))} x={gutPt(672, 1250)[0]} y={gutPt(672, 1250)[1]} dx={-150} dy={-150} text="大腸へ" tone="teal" size={32} />
      </>
    ),
  },
  {
    from: at(6, '腸内'), to: s(7), explain: '{腸内細菌} のえさになる',
    draw: (d) => (
      <>
        <Pic src={I('bacteria')} dur={d} zoom={[1.0, 1.12]} />
        <Tag at={F(0.3)} x={PIC.x + 470} y={PIC.y + 380} dx={0} dy={-220} text="腸内細菌（電子顕微鏡写真）" tone="teal" />
      </>
    ),
  },
  {
    from: s(7), to: s(8), title: '細菌がつくる{酪酸}', explain: '大腸の細胞の {エネルギー} になり、\n腸を守ると考えられている',
    draw: (d) => (
      <>
        <Pic src={I('colon')} dur={d} zoom={[1.05, 1.2]} />
        <Tag at={F(at(7, '大腸') - s(7))} x={PIC.x + 300} y={PIC.y + 520} dx={0} dy={110} text="大腸の粘膜（顕微鏡写真）" tone="ink" size={28} />
        <Bubbles from={F(0.2)} />
        <Lens at={F(at(7, '酪酸') - s(7))} cx={PIC.x + PIC.w - 190} cy={PIC.y + 190} r={160} src={I('butyrate')} label="酪酸（らくさん）" dur={d} zoom={[1.0, 1.1]} />
      </>
    ),
  },
  // ── やり方 ──
  {
    from: s(8), to: s(9), title: 'やり方は{かんたん}', explain: '', src: '',
    draw: () => (
      <>
        <Board tall />
        <Step at={F(at(8, 'ごはん') - s(8))} n={1} x={PIC.x + 40} y={PIC.y + 80} w={270} h={720} src={I('cooker')} text="多めに炊く" focus={[0.45, 0.5]} />
        <Step at={F(at(8, '小分け') - s(8))} n={2} x={PIC.x + 340} y={PIC.y + 80} w={270} h={720} src={I('portions')} text="小分け" />
        <Step at={F(at(8, 'すぐ') - s(8))} n={3} x={PIC.x + 640} y={PIC.y + 80} w={250} h={720} src={I('fridge')} text="すぐ冷蔵庫" focus={[0.5, 0.45]} />
      </>
    ),
  },
  {
    from: s(9), to: s(10), title: 'ここだけは{注意}', explain: '食中毒の菌が増えることも。\n{小分けして、すぐ冷蔵庫へ}', src: MAFF,
    draw: (d) => (
      <>
        <Pic src={I('left-rice')} dur={d} zoom={[1.0, 1.08]} />
        <Warning at={F(0.15)} text="室温に長く置かない" />
        <Lens at={F(at(9, '食中毒') - s(9))} cx={PIC.x + PIC.w - 200} cy={PIC.y + 330} r={170} src={I('cereus')} focus={[0.45, 0.45]} label="セレウス菌（電子顕微鏡写真）" dur={d} />
      </>
    ),
  },
  {
    from: s(10), to: s(11), title: 'レンジで{温め直してOK}', explain: '研究のごはんも {温め直したもの}', src: STUDY,
    draw: (d) => (
      <>
        <Pic src={I('microwave')} dur={d} zoom={[1.0, 1.08]} />
        <Check at={F(at(10, 'OK') - s(10))} x={PIC.x + PIC.w - 170} y={PIC.y + 170} size={170} />
      </>
    ),
  },
  {
    from: s(11), to: s(12), title: '冷やご飯を嫌がる家族にも\n{教えてあげて}', explain: '', src: '',
    draw: (d) => <Pic src={I('family')} dur={d} zoom={[1.0, 1.08]} box={PIC_TALL} focus={[0.5, 0.4]} />,
  },
  {
    from: s(12), to: END, title: 'おなかへの\n{小さな贈りもの}',
    draw: (d) => <Pic src={I('onigiri')} dur={d} zoom={[1.0, 1.1]} box={PIC_TALL} focus={[0.5, 0.45]} />,
  },
];

const HOT = ['冷やご飯', '秘密', '腸を変える', 'でんぷん', '血糖値', 'レジスタントスターチ', '約2.5倍', '2割', '大腸', '腸内細菌', '酪酸', 'エネルギー', '小分け', '冷蔵庫', '注意', '食中毒', 'OK', '贈りもの', '家族'];

export const HiyaGohan: React.FC = () => (
  <ExplainFrame time={time} shots={SHOTS} hot={HOT} glyphs="0123456789.g％％（）：「」…？ポイ栄養顕微鏡" series="からだの科学" name="冷やご飯の秘密" />
);
