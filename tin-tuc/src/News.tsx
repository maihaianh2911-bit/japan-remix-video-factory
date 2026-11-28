// 訪日客、中国半減でも過去最多 — từng cảnh bám theo giọng đọc (time.ts).
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { useFonts } from './fonts';
import { at, chunks, e, FPS, LINES, s } from './time';
import {
  BigNumber, BigQuestion, C, Card, Clipping, GoalBar, Grid, Headline, K, Label, Masthead, NewsWindow, Paper, Reporter, SANS,
  Source, Stamp, VSBars,
} from './kit';

type Shot = { from: number; to: number; src?: string; draw: (dur: number) => React.ReactNode };
const F = (sec: number) => Math.round(sec * FPS);
const JNTO = '日本政府観光局（JNTO）2026年11月18日発表';

const SHOTS: Shot[] = [
  // ── Hook: chữ lớn từ frame 0, rồi ảnh đám đông + tem 過去最多 ──
  {
    from: 0, to: at(0, '10月'),
    draw: () => (
      <Card>
        <Label text="2026年10月 訪日外国人" top={80} />
        <Headline text={'中国からの客\n{ほぼ半減}'} size={120} top={210} />
        <div style={{ position: 'absolute', left: 0, width: '100%', top: 560, textAlign: 'center', fontFamily: '"Noto Serif JP"', fontWeight: 900, fontSize: 170, color: C.red }}>▼</div>
      </Card>
    ),
  },
  {
    from: at(0, '10月'), to: s(1),
    draw: (d) => (
      <>
        <Clipping src="crowd.jpg" dur={d} caption="それでも訪日客は…" />
        <Sequence from={F(at(0, '過去最多') - at(0, '10月'))}>
          <Stamp text="過去最多" x={470} y={K.y + 560} size={84} />
        </Sequence>
      </>
    ),
  },
  // ── 391万2500人 ──
  {
    from: s(1), to: at(1, '今年'), src: JNTO,
    draw: () => (
      <Card>
        <NewsWindow title={'10月の訪日客\n{過去最多}を更新'} outlet="日本政府観光局" />
        <Reporter x={560} y={470} mood="point" />
      </Card>
    ),
  },
  {
    from: at(1, '今年'), to: at(1, '391'), src: 'トラベルボイス（JNTO資料より）',
    draw: (d) => <Clipping src="chart1.jpg" dur={d} fit="contain" zoom={[1, 1.04]} caption="月別の訪日客（赤が2026年）" angle={1.5} />,
  },
  {
    from: at(1, '391'), to: s(2), src: JNTO,
    draw: () => (
      <Card>
        <Label text="2026年10月 訪日外国人" top={110} />
        <BigNumber to={3912500} unit="人" sub="単月で過去最多" top={300} size={150} dur={34} />
      </Card>
    ),
  },
  // ── chênh lệch 3,000 người ──
  {
    from: s(2), to: s(3), src: JNTO,
    draw: (d) => (
      <Card>
        <VSBars a={{ label: '2025年4月', value: 3909128 }} b={{ label: '2026年10月', value: 3912500 }} dur={d} max={3912500} unit="人" />
        <Sequence from={F(at(2, 'わずか') - s(2))}>
          <Stamp text="差 わずか3,372人" x={150} y={640} size={58} angle={-6} tone="ink" />
        </Sequence>
      </Card>
    ),
  },
  // ── Trung Quốc −47% ──
  {
    from: s(3), to: at(3, '37万'), src: JNTO,
    draw: (d) => <Clipping src="china.jpg" dur={d} caption="中国からの旅行者は…" angle={2} />,
  },
  {
    from: at(3, '37万'), to: s(4), src: JNTO,
    draw: (d) => (
      <Card>
        <VSBars a={{ label: '2025年10月', value: 715804, text: '71万5804' }} b={{ label: '2026年10月', value: 379500, text: '37万9500' }} dur={d} unit="人" />
        <Sequence from={F(at(3, '47') - at(3, '37万'))}>
          <Stamp text="−47%" x={520} y={470} size={110} angle={-10} />
        </Sequence>
      </Card>
    ),
  },
  {
    from: s(4), to: s(5), src: 'JNTO、報道各社',
    draw: (d) => (
      <>
        <Clipping src="airport.jpg" dur={d} caption="渡航の注意喚起・航空便の減便" angle={-1.5} />
      </>
    ),
  },
  // ── Câu hỏi ──
  {
    from: s(5), to: s(6),
    draw: () => (
      <Card>
        <BigQuestion />
        <Headline text={'その穴を\n埋めたのは{誰}？'} size={104} top={120} />
        <Reporter x={330} y={430} mood="think" />
      </Card>
    ),
  },
  {
    from: s(6), to: e(6) + 0.08,
    draw: () => (
      <Card tone="red">
        <div style={{ position: 'absolute', top: 250, width: '100%', textAlign: 'center', fontFamily: '"Noto Serif JP"', fontWeight: 900, fontSize: 300, color: '#fff' }}>韓国</div>
      </Card>
    ),
  },
  // ── Hàn Quốc 103万 ──
  {
    from: e(6) + 0.08, to: at(7, 'ひと月'), src: JNTO,
    draw: (d) => <Clipping src="korea.jpg" dur={d} caption="韓国からの旅行者" angle={-2} />,
  },
  {
    from: at(7, 'ひと月'), to: s(8), src: JNTO,
    draw: () => (
      <Card>
        <Label text="2026年10月 韓国から" top={110} />
        <BigNumber to={1035800} unit="人" sub="前年比 +19.4%" top={300} size={150} dur={26} />
        <Sequence from={F(at(7, '100万人') - at(7, 'ひと月'))}>
          <Stamp text="100万人突破" x={210} y={640} size={66} angle={-5} />
        </Sequence>
      </Card>
    ),
  },
  // ── 20/23 ──
  {
    from: s(8), to: s(9), src: JNTO,
    draw: (d) => (
      <Card>
        <Label text="主な23の国・地域" top={90} />
        <Grid total={23} n={20} dur={d} />
        <div style={{ position: 'absolute', top: 690, width: '100%', textAlign: 'center', fontFamily: '"Noto Serif JP"', fontWeight: 900, fontSize: 64, color: C.ink }}>
          <span style={{ color: C.red, fontSize: 110 }}>20</span>で10月の過去最多
        </div>
      </Card>
    ),
  },
  // ── Mùa lá đỏ ──
  {
    from: s(9), to: s(10), src: JNTO,
    draw: (d) => (
      <>
        <Clipping src="koyo.jpg" dur={d} caption="紅葉シーズンも追い風" angle={1.5} />
      </>
    ),
  },
  // ── Tổng 10 tháng −2.5% ──
  {
    from: s(10), to: at(10, '去年'), src: 'トラベルボイス（JNTO資料より）',
    draw: (d) => <Clipping src="chart2.jpg" dur={d} fit="contain" zoom={[1, 1.04]} caption="1〜10月の累計" angle={-1.5} />,
  },
  {
    from: at(10, '去年'), to: s(11), src: JNTO,
    draw: () => (
      <Card>
        <Label text="1〜10月の累計" top={110} />
        <BigNumber to={2.5} prefix="−" unit="%" decimals={1} sub="前年同期比" top={300} size={200} dur={16} color={C.ink} />
        <Sequence from={F(at(10, '少ない') - at(10, '去年'))}>
          <Stamp text="まだ前年割れ" x={230} y={650} size={66} angle={-6} tone="ink" />
        </Sequence>
      </Card>
    ),
  },
  {
    from: s(11), to: s(12), src: JNTO,
    draw: (d) => (
      <Card>
        <Label text="年間記録まで" top={110} />
        <GoalBar have={3464} goal={4268} dur={d} />
        <Sequence from={F(at(11, '残り') - s(11))}>
          <Stamp text="残り2か月" x={50} y={640} size={50} angle={-6} />
        </Sequence>
      </Card>
    ),
  },
  // ── Kết ──
  {
    from: s(12), to: s(13),
    draw: (d) => <Clipping src="street.jpg" dur={d} caption="人の波は止まらなかった" angle={-1.5} />,
  },
  {
    from: s(13), to: 999,
    draw: () => (
      <Card>
        <BigQuestion />
        <Headline text={'あなたの街でも\n{増えた}と\n感じますか？'} size={92} top={110} align="left" />
        <Reporter x={560} y={470} mood="ask" />
        <div style={{ position: 'absolute', left: 60, top: 720, fontFamily: SANS, fontWeight: 900, fontSize: 44, color: '#fff', background: C.red, padding: '8px 24px 12px' }}>コメントで教えて</div>
      </Card>
    ),
  },
];

// Từ khóa tô đỏ trong phụ đề khi giọng đọc tới.
const HOT = ['ほぼ半分', '過去最多', '391万2500人', '3000人', '47パーセント', '韓国', '103万5800人', '100万人', '19パーセント', '20', '紅葉シーズン', '2.5パーセント', '804万人', '止まりませんでした'];

const Subtitles: React.FC = () => {
  const t = useCurrentFrame() / FPS;
  let cur = -1;
  for (let i = 0; i < chunks.length; i++) {
    const next = chunks[i + 1];
    if (t >= chunks[i].start - 0.05 && t < (next ? next.start - 0.05 : chunks[i].end + 3)) cur = i;
  }
  if (cur < 0) return null;
  const c = chunks[cur];
  const line = LINES[c.li];
  const hot = new Set<number>();
  for (const w of HOT) {
    let k = c.text.indexOf(w);
    while (k >= 0) {
      for (let j = 0; j < w.length; j++) hot.add(k + j);
      k = c.text.indexOf(w, k + 1);
    }
  }
  return (
    <div style={{ position: 'absolute', top: K.y + K.h + 80, left: 70, width: 860, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: c.text.length > 16 ? 50 : 56, lineHeight: 1.35 }}>
      {[...c.text].map((ch, i) => {
        const said = t >= line.start + line.chars[c.b + i][0];
        return (
          <span key={i} style={{ color: said ? (hot.has(i) ? C.red : C.ink) : '#a39a8c' }}>
            {ch}
          </span>
        );
      })}
    </div>
  );
};

export const News: React.FC = () => {
  useFonts(
    LINES.map((l) => l.text).join('') +
      '数字で読むニュース報出典日本政府観光局JNTO発表年月日訪日外国人中国客ほぼ半減それでも訪日客は過去最多単月更新差わずか人旅行者渡航注意喚起航空便減便報道各社その穴を埋めたのは誰韓国から前年比突破主な国地域紅葉シーズン追い風累計同期比まだ前年割れ年間記録まで去年残りか月あと万人波止まらなかったあなたの街でも増えたと感じますかコメントで教えてVS−%▼？…・、〜',
  );
  const f = useCurrentFrame();
  const t = f / FPS;
  const shot = SHOTS.find((x) => t >= x.from && t < x.to);
  return (
    <AbsoluteFill>
      <Paper />
      <Masthead />
      {SHOTS.map((x, i) => {
        const from = F(x.from);
        const dur = Math.max(1, F(Math.min(x.to, 999)) - from);
        return (
          <Sequence key={i} from={from} durationInFrames={dur} layout="none">
            {x.draw(dur)}
          </Sequence>
        );
      })}
      {shot?.src && <Source text={shot.src} />}
      <Subtitles />
    </AbsoluteFill>
  );
};
