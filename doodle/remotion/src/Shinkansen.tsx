// 新幹線は、ひとつのウソから生まれた — drawn with Remotion (27/11/2026). Two things come back through the video: the egg
// 「ウソ」 the train comes out of, and the rock 「責任」 Sogo carries. Timed on the voice (src/timings/shinkansen-uso.json).
import React from 'react';
import {
  W, H, INK, RED, HAND, MARK, SKIN, clamp, prog, lerp, easeOut, easeInOut, pop, makeT, Timing, Shot, Movie, lineOn, Shadow, Paper, Sky, Cloud,
  Label, Tag, Stamp, Person, Calendar, Pin, PersonProps,
} from './kit';
import {
  YearFlip, Confetti, Sparkles, QMark, XMark, Check, Arrow, Balloon, Fuji, Shinkansen as Train, Diet, CoinTower, Egg, Rock, Monument, Platform, TV, Room,
  Zabuton, Steam, Plane, Auto, Pyramid, GreatWall, Yamato, Card, Sheet, Scissors, Mic, Chair, Kusudama, Bunting, Flag,
} from './parts';
import timing from './timings/shinkansen-uso.json';

const T = makeT(timing as Timing);
export const SHINKANSEN_SECONDS = T.total;

// Sogo Shinji: grey hair on the sides, round glasses, a dark suit
const SOGO: Partial<PersonProps> = {suit: '#2b3550', pants: '#232b42', tie: '#b03a2e', hairStyle: 'grey', glasses: true};
const ENG: Partial<PersonProps> = {suit: '#4f7fa8', pants: '#3a5f80', tie: '#4f7fa8', shirt: '#4f7fa8', hat: 'helmet', hairStyle: 'short'};
const S = (o: Record<string, unknown> = {}) => ({stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, ...o});

// the estimate: a sheet with a tower of coins drawn on it
const Estimate: React.FC<{x: number; y: number; w: number; h: number; rot?: number; title?: string}> = ({x, y, w, h, rot = 0, title = '見積もり'}) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`} filter="url(#drop)">
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={8} fill="#fbf8ef" {...S({strokeWidth: 6})} />
    {title && <text y={-h / 2 + 70} textAnchor="middle" fontFamily={MARK} fontSize={58} fill={INK}>{title}</text>}
    <g transform={`translate(0 ${h / 2 - 30}) scale(${Math.min(1, w / 330)})`}>{Array.from({length: Math.max(1, Math.round((h - (title ? 140 : 60)) / 18 / Math.min(1, w / 330)))}).map((_, i) => <ellipse key={i} cx={Math.sin(i * 1.7) * 4} cy={-i * 18 - 14} rx={78} ry={22} fill={i % 2 ? '#f0c64a' : '#e6b638'} {...S({strokeWidth: 3.5})} />)}</g>
  </g>
);
// Sogo bent under the rock 「責任」; (x, y) his feet
const Carrying: React.FC<{x: number; y: number; s: number; t: number; drop?: number; bow?: number; mood?: 'stern' | 'sad' | 'flat'}> = ({x, y, s, t, drop = 1, bow = 0, mood = 'stern'}) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${bow * 30} 0 -246)`}>
    <Person id="carry" t={t} x={0} y={0} s={1} {...SOGO} mood={mood} lean={10} armL={[168, 150]} armR={[168, 150]} />
    <g transform={`translate(${lerp(0, 40, 1)} ${lerp(-1200, -720, drop)}) rotate(${bow * 6})`}><Rock x={0} y={0} s={0.9} /></g>
  </g>
);
// an old man seen from behind, sitting: (x, y) where he sits
const BackView: React.FC<{x: number; y: number; s: number}> = ({x, y, s}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -130 0 C -150 -120, -110 -240, 0 -250 C 110 -240, 150 -120, 130 0 Z" fill="#2b3550" {...S({strokeWidth: 6})} />
    <path d="M -24 -250 L 24 -250 L 18 -226 L -18 -226 Z" fill={SKIN} {...S({strokeWidth: 4})} />
    <ellipse cx={0} cy={-320} rx={78} ry={82} fill={SKIN} {...S({strokeWidth: 6})} />
    <path d="M -78 -310 C -86 -360, -60 -392, -20 -396 C 20 -400, 66 -380, 80 -330 C 60 -300, 30 -290, 0 -290 C -40 -290, -66 -296, -78 -310 Z" fill="#d8d6d0" {...S({strokeWidth: 4})} />
    <ellipse cx={-80} cy={-318} rx={12} ry={18} fill={SKIN} {...S({strokeWidth: 4})} /><ellipse cx={80} cy={-318} rx={12} ry={18} fill={SKIN} {...S({strokeWidth: 4})} />
  </g>
);
const eggD = (ex: number, ey: number, es: number) => `M ${ex} ${ey - 210 * es} C ${ex + 130 * es} ${ey - 210 * es}, ${ex + 196 * es} ${ey - 20 * es}, ${ex + 196 * es} ${ey + 66 * es} C ${ex + 196 * es} ${ey + 176 * es}, ${ex + 104 * es} ${ey + 236 * es}, ${ex} ${ey + 236 * es} C ${ex - 104 * es} ${ey + 236 * es}, ${ex - 196 * es} ${ey + 176 * es}, ${ex - 196 * es} ${ey + 66 * es} C ${ex - 196 * es} ${ey - 20 * es}, ${ex - 130 * es} ${ey - 210 * es}, ${ex} ${ey - 210 * es} Z`;

const shots: Shot[] = [
  // 0   the hook: the first Shinkansen bursts out of an egg 「ウソ」
  {a: 0, draw: (t, v) => {
    const ex = 720, ey = 1150, es = 1.75;
    const crack = [[ex - 40, ey - 372], [ex - 110, ey - 280], [ex - 70, ey - 200], [ex - 150, ey - 110], [ex - 100, ey - 20], [ex - 170, ey + 70], [ex - 120, ey + 160], [ex - 190, ey + 250], [ex - 150, ey + 330], [ex - 200, ey + 420]];
    const nose = lerp(330, 20, easeOut(prog(v, 0, 1.6)));
    return (
      <g>
        <Sky top="#9fc8e2" bottom="#f1e9d4" y1={1430} />
        <Cloud x={200 + v * 16} y={690} /><Cloud x={930 - v * 10} y={760} s={0.7} />
        <Fuji x={260} y={1430} s={1.5} />
        <rect x={0} y={1430} width={W} height={490} fill="#d9cba8" /><path d="M 0 1430 H 1080" stroke={INK} strokeWidth={4} />
        <path d="M 0 1424 H 1080" stroke="#8d8a84" strokeWidth={8} />
        <Shadow x={ex} y={ey + 413} w={600} o={0.26} />
        <defs><radialGradient id="eggIn" cx="60%" cy="58%" r="60%"><stop offset="0" stopColor="#d8caa2" /><stop offset="1" stopColor="#ad9a6c" /></radialGradient>
          <clipPath id="eggClip"><path d={eggD(ex, ey, es)} /></clipPath>
          <clipPath id="shellClip"><path d={`M ${ex - 40} ${ey - 460} ${crack.map(p => `L ${p[0]} ${p[1]}`).join(' ')} L ${ex - 200} ${ey + 520} L ${ex + 500} ${ey + 520} L ${ex + 500} ${ey - 460} Z`} /></clipPath></defs>
        <path d={eggD(ex, ey, es)} fill="url(#eggIn)" />
        <Train x={nose} y={1424} s={1.3} len={1200} />
        <g clipPath="url(#shellClip)"><Egg x={ex} y={ey} s={es} text="" /></g>
        <g clipPath="url(#eggClip)"><polyline points={crack.map(p => p.join(',')).join(' ')} fill="none" stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>
        <text x={ex + 90} y={ey + 150} textAnchor="middle" fontFamily={MARK} fontSize={160} fill={RED}>ウソ</text>
        {[[-380, -330, 30], [-260, -430, -24], [-450, -170, 64], [-120, -470, 12]].map(([dx, dy, r], i) => { const f = easeOut(prog(v, 0.05, 1.0)); return <g key={i} transform={`translate(${ex - 140 + dx * f} ${ey - 60 + dy * f + f * f * 140}) rotate(${r + f * 170}) scale(1.3)`}><path d="M -34 -20 L 30 -30 L 40 26 L -20 34 Z" fill="#fbf4e2" {...S({strokeWidth: 4})} /></g>; })}
        {[0, 1, 2, 3].map(i => <path key={i} d={`M ${nose + 30} ${1250 + i * 40} H ${nose - 120 - i * 30}`} stroke={INK} strokeWidth={5} strokeLinecap="round" opacity={0.5 * (1 - prog(v, 0.8, 0.6))} />)}
      </g>
    );
  }},
  // 1a  the one who told it: a finger on his lips, the egg behind his back
  {a: T.s(1) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#e3dac6" />
      <Egg x={880} y={1500} s={0.95} rot={22} />
      <Person id="s1" t={t} x={540} y={2350} s={2.3} {...SOGO} mood="flat" look={-4} armL={[8, 8]} armR={[175, -57]} />
      <rect x={526} y={1150} width={30} height={130} rx={15} fill={SKIN} {...S({strokeWidth: 5})} />
      <g transform={`translate(250 880) rotate(-10) scale(${pop(t, T.s(1) + 0.1)})`}><text textAnchor="middle" fontFamily={MARK} fontSize={110} fill="#e0702a" stroke="#fbf6ea" strokeWidth={16} paintOrder="stroke">しーっ</text></g>
    </g>
  )},
  // 1b  who he is, on a card
  {a: T.at(1, '71歳') - 0.08, draw: (t, v) => {
    const name = T.at(1, '十河信二'), n = Math.ceil(4 * clamp((t - name) / (T.to(1, '十河信二') - name)));
    return (
      <g>
        <Paper c="#9a6b3d" />
        {Array.from({length: 9}).map((_, i) => <path key={i} d={`M 0 ${620 + i * 150} C 300 ${600 + i * 150}, 700 ${650 + i * 150}, 1080 ${615 + i * 150}`} stroke="#7d5530" strokeWidth={5} fill="none" opacity={0.6} />)}
        <g transform="translate(540 1130) rotate(-2)" filter="url(#drop)">
          <rect x={-450} y={-440} width={900} height={880} rx={10} fill="#fbf6ea" {...S({strokeWidth: 6})} />
          <clipPath id="photo1"><rect x={-400} y={-390} width={380} height={480} /></clipPath>
          <rect x={-410} y={-400} width={400} height={500} fill="#e7d9b6" {...S({strokeWidth: 6})} />
          <g clipPath="url(#photo1)" filter="url(#sepia)"><rect x={-400} y={-390} width={380} height={480} fill="#d9c7a0" /><Person id="ph1" t={t} x={-210} y={360} s={1.0} {...SOGO} mood="stern" noShadow armL={[8, 8]} armR={[8, 8]} /></g>
          <rect x={-410} y={-400} width={400} height={500} fill="none" stroke="#fbf6ea" strokeWidth={10} />
          <g transform={`translate(230 -280) scale(${pop(t, T.at(1, '71歳'))})`}><circle r={120} fill="#fff3c8" {...S({strokeWidth: 6})} /><text y={34} textAnchor="middle" fontFamily={MARK} fontSize={96} fill={RED}>71歳</text></g>
          {t > T.at(1, '国鉄') && <g transform={`translate(230 -60) scale(${pop(t, T.at(1, '国鉄'))})`}><rect x={-200} y={-48} width={400} height={96} rx={8} fill="#1f4d3a" {...S({strokeWidth: 5})} /><text y={20} textAnchor="middle" fontFamily={MARK} fontSize={58} fill="#f3e9c6">国鉄のトップ</text></g>}
          {t > name && <g><text x={-400} y={180} fontFamily={HAND} fontWeight={700} fontSize={40} fill="#6a5f50">そごう しんじ</text><text x={-400} y={300} fontFamily={MARK} fontSize={128} fill={INK}>{'十河信二'.slice(0, n)}</text><path d="M -400 330 H 120" stroke={RED} strokeWidth={7} /></g>}
          <path d="M 140 400 H 430" stroke="#b9b6ae" strokeWidth={6} /><Train x={150} y={398} s={0.22} len={1200} />
        </g>
      </g>
    );
  }},
  // 2   why was a lie needed? a glass over the egg
  {a: T.s(2) - 0.08, draw: (t, v) => {
    const gx = 600 + Math.sin(v * 2.6) * 110, gy = 1200 + Math.cos(v * 2.1) * 80;
    return (
      <g>
        <Paper c="#e3dac6" /><rect x={0} y={1580} width={W} height={340} fill="#c9bfa8" /><path d="M 0 1580 H 1080" stroke={INK} strokeWidth={4} />
        <Shadow x={540} y={1580} w={460} o={0.28} />
        <Egg x={540} y={1280} s={1.3} />
        <path d={`M ${gx + 150} ${gy + 150} L ${gx + 330} ${gy + 330}`} stroke="#5a3d22" strokeWidth={36} strokeLinecap="round" />
        <circle cx={gx} cy={gy} r={210} fill="rgba(207,230,243,0.42)" stroke={INK} strokeWidth={14} />
        <path d={`M ${gx - 140} ${gy - 80} A 160 160 0 0 1 ${gx - 60} ${gy - 150}`} fill="none" stroke="#fff" strokeWidth={12} strokeLinecap="round" opacity={0.8} />
        <QMark x={220} y={860} s={1.7 * pop(t, T.s(2))} rot={-10} />
      </g>
    );
  }},
  // 3   the railway was said to be old: the car and the plane race past the old engine
  {a: T.s(3) - 0.08, draw: (t, v) => {
    const old = T.at(3, 'もう古い');
    const px = lerp(-400, 800, easeOut(prog(t, old - 0.1, 1.0))), cx = lerp(-320, 560, easeOut(prog(t, old + 0.1, 1.0)));
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#f1e9d4" y1={1500} />
        <Cloud x={220 + v * 10} y={1030} s={1.1} />
        <rect x={0} y={1010} width={W} height={80} fill="#8f9296" {...S({strokeWidth: 4})} />
        {Array.from({length: 7}).map((_, i) => <path key={i} d={`M ${((i * 180 + v * 400) % 1260) - 100} 1050 H ${((i * 180 + v * 400) % 1260) - 20}`} stroke="#f3ecd8" strokeWidth={8} />)}
        {t > old - 0.1 && <g>{[0, 1, 2].map(i => <path key={i} d={`M ${px - 280 - i * 50} ${720 + i * 24} H ${px - 200 - i * 50}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}<Plane x={px} y={740} s={1.2} rot={-4} />
          {[0, 1, 2].map(i => <path key={'c' + i} d={`M ${cx - 220 - i * 40} ${960 + i * 22} H ${cx - 170 - i * 40}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />)}<Auto x={cx} y={1040} s={1.25} /></g>}
        <Label t={t} text="これからは車と飛行機" x={760} y={880} size={46} a={old + 0.4} b={old + 1.0} fill="#fff6cf" />
        <rect x={0} y={1500} width={W} height={420} fill="#d9cba8" /><path d="M 0 1494 H 1080" stroke="#8d8a84" strokeWidth={9} />
        <Steam x={130 + v * 12} y={1494} s={1.75} t={t} webs={t > old} />
        <Stamp t={t} text="もう古い" x={500} y={1290} size={128} a={old} rot={-9} />
      </g>
    );
  }},
  // 4a  the plan: a fast line from Tokyo to Osaka
  {a: T.s(4) - 0.08, draw: (t, v) => {
    const p = easeInOut(prog(t, T.at(4, '結ぶ') - 0.4, 1.3));
    const pt = (q: number) => [lerp(880, 200, q), 1300 + Math.sin(q * Math.PI) * 60 + q * 40];
    return (
      <g>
        <Paper c="#dbe6c8" />
        <path d="M -20 1470 C 200 1380, 420 1450, 620 1390 C 800 1340, 960 1380, 1100 1330 L 1100 1940 L -20 1940 Z" fill="#a9cde0" {...S()} />
        <Fuji x={600} y={1220} s={1.05} />
        <path d={'M ' + Array.from({length: Math.max(2, Math.ceil(p * 50) + 1)}).map((_, i) => pt(Math.min(p, i / 50)).join(' ')).join(' L ')} fill="none" stroke={RED} strokeWidth={12} strokeDasharray="30 24" strokeLinecap="round" />
        <Pin x={880} y={1300} s={1.5 * pop(t, T.s(4))} /><Pin x={200} y={1340} s={1.5 * pop(t, T.at(4, '大阪'))} c="#3d74c4" />
        <Label t={t} text="東京" x={880} y={1020} size={76} a={T.s(4)} b={T.s(4) + 0.25} font={MARK} /><Label t={t} text="大阪" x={200} y={1060} size={76} a={T.at(4, '大阪')} b={T.at(4, '大阪') + 0.25} font={MARK} />
        {p > 0.02 && p < 0.98 && <Train x={pt(p)[0] - 40} y={pt(p)[1] + 30} s={0.32} len={520} />}
        <Stamp t={t} text="計画" x={560} y={820} size={110} a={T.at(4, '計画は')} rot={-8} color="#2f5fa8" />
      </g>
    );
  }},
  // 4b-d  the three follies, each filling the frame
  ...([['ピラミッド', '①', (t: number) => <Pyramid x={540} y={1560} s={2.5} />], ['万里', '②', (t: number) => <GreatWall x={540} y={1520} s={2.5} />], ['戦艦', '③', (t: number) => <Yamato x={540} y={1480} s={2.1} t={t} />]] as [string, string, (t: number) => React.ReactNode][]).map(([w, n, art], i): Shot => ({
    a: T.at(4, w) - 0.08, draw: (t, v) => (
      <g>
        <Sky top="#e9d9b4" bottom="#f4ead2" y1={1560} />
        <rect x={0} y={1560} width={W} height={360} fill="#c9bfa8" /><path d="M 0 1560 H 1080" stroke={INK} strokeWidth={4} />
        <g transform={`translate(540 1560) scale(${0.9 + 0.1 * pop(t, T.at(4, w) - 0.08)}) translate(-540 -1560)`}>{art(t)}</g>
        <g transform={`translate(170 760) scale(${pop(t, T.at(4, w))})`}><circle r={86} fill="#fff3c8" {...S({strokeWidth: 6})} /><text y={40} textAnchor="middle" fontFamily={MARK} fontSize={120} fill={RED}>{n}</text></g>
        <Label t={t} text={['ピラミッド', '万里の長城', '戦艦大和'][i]} x={620} y={770} size={86} a={T.at(4, w)} b={T.at(4, w) + 0.3} font={MARK} bold />
      </g>
    ),
  })),
  // 4e  and the fourth: the plan
  {a: T.at(4, 'に続く') - 0.08, draw: (t, v) => {
    const four = T.at(4, 'に続く') - 0.08;
    return (
      <g>
        <Paper c="#e6dcc4" />
        <Card x={190} y={800} w={300} h={250} k={1} rot={-3} n="①"><Pyramid x={0} y={80} s={0.6} /></Card>
        <Card x={540} y={800} w={300} h={250} k={1} rot={2} n="②"><GreatWall x={0} y={86} s={0.6} /></Card>
        <Card x={890} y={800} w={300} h={250} k={1} rot={-2} n="③"><Yamato x={0} y={70} s={0.55} t={t} /></Card>
        <g transform={`translate(540 1260) rotate(-2) scale(${pop(t, four)})`} filter="url(#drop)">
          <rect x={-400} y={-230} width={800} height={460} rx={8} fill="#2f5fa8" {...S({strokeWidth: 6})} />
          <g stroke="#eaf2fb" strokeWidth={5} fill="none"><path d="M -330 60 C -328 8, -240 -40, -122 -44 L 330 -44 L 330 106 L -266 106 C -306 104, -330 86, -330 60 Z" />{Array.from({length: 6}).map((_, i) => <rect key={i} x={-70 + i * 64} y={-20} width={40} height={30} />)}<path d="M -360 150 H 360" />{[-210, -150, 150, 210].map(cx => <circle key={cx} cx={cx} cy={124} r={36} />)}</g>
          <text y={-160} textAnchor="middle" fontFamily={MARK} fontSize={52} fill="#eaf2fb">高速鉄道　計画図</text>
          <g transform="translate(-350 -190)"><circle r={70} fill="#fff3c8" {...S({strokeWidth: 6})} /><text y={34} textAnchor="middle" fontFamily={MARK} fontSize={96} fill={RED}>④</text></g>
        </g>
        <Stamp t={t} text="世界四バカ" x={540} y={1300} size={150} a={T.at(4, '世界四バカ')} rot={-10} />
      </g>
    );
  }},
  // 4f  and everybody laughs
  {a: T.at(4, 'とまで') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#e6dcc4" />
      <Person id="w1" t={t} x={190} y={1720} s={1.3} suit="#3a4a3a" tie="#d9a521" hat="bowler" mood="laugh" bob={Math.sin(t * 22) * 6} armL={[10, 10]} armR={[150, 150]} pointR />
      <Person id="w2" t={t} x={540} y={1680} s={1.25} suit="#2f3f5a" tie="#c0392b" hairStyle="short" mood="laugh" bob={Math.sin(t * 22 + 2) * 6} armL={[40, 120]} armR={[40, 120]} />
      <Person id="w3" t={t} x={890} y={1720} s={1.3} flip suit="#4b3f2a" tie="#2e8b57" hat="bowler" mood="laugh" bob={Math.sin(t * 22 + 4) * 6} armL={[10, 10]} armR={[150, 150]} pointR />
      <g transform="translate(540 1680) rotate(3) scale(0.62)" filter="url(#drop)"><rect x={-400} y={-230} width={800} height={460} rx={8} fill="#2f5fa8" {...S({strokeWidth: 8})} /><text y={20} textAnchor="middle" fontFamily={MARK} fontSize={80} fill="#eaf2fb">高速鉄道　計画図</text></g>
      <QMark x={540} y={800} s={0} />
      {[[260, 760, -12], [820, 740, 12], [540, 1000, 0]].map(([x, y, r], i) => { const k = pop(t, T.at(4, 'とまで') + i * 0.12, 240); return k > 0 ? <g key={i} transform={`translate(${x} ${y + Math.sin(t * 12 + i) * 5}) rotate(${r}) scale(${k})`}><text textAnchor="middle" fontFamily={MARK} fontSize={76} fill="#e0702a" stroke="#fbf6ea" strokeWidth={14} paintOrder="stroke">ハハハ</text></g> : null; })}
    </g>
  )},
  // 5a  the cost: a tower of coins that will not stop growing
  {a: T.s(5) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#efe5cc" /><rect x={0} y={1600} width={W} height={320} fill="#c9bfa8" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
      <CoinTower x={640} y={1600} n={Math.round(lerp(6, 46, easeOut(prog(v, 0, 1.1))))} s={1.3} />
      <Person id="s5" t={t} x={240} y={1720} s={1.25} {...SOGO} mood="wow" look={7} armL={[10, 10]} armR={[120, 160]} />
      <Label t={t} text="建設費" x={880} y={1240} size={80} a={T.at(5, '建設費')} b={T.to(5, '建設費')} font={MARK} fill="#fff6cf" bold />
    </g>
  )},
  // 5b  far too much for the Diet
  {a: T.at(5, '国会') - 0.08, draw: (t, v) => {
    const no = T.at(5, 'ない');
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#efe9d6" y1={1600} />
        <rect x={0} y={1600} width={W} height={320} fill="#c9bfa8" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        <Diet x={330} y={1600} s={1.0} />
        <CoinTower x={860} y={1600} n={46} s={1.15} />
        <path d="M 40 1150 H 1040" stroke={INK} strokeWidth={6} strokeDasharray="18 14" />
        <Label t={t} text="国会" x={330} y={1080} size={64} a={T.at(5, '国会')} b={T.at(5, '国会') + 0.2} font={MARK} />
        {t > no && <g transform={`translate(330 1380) scale(${pop(t, no)})`}><circle r={170} fill="rgba(251,246,234,0.85)" stroke={RED} strokeWidth={18} /></g>}
        <XMark x={330} y={1380} r={100} t={t} a={no} />
      </g>
    );
  }},
  // 6   then Sogo said, it is told:
  {a: T.s(6) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#c99a62" /><rect x={0} y={1640} width={W} height={280} fill="#9a6b3d" />
      <Estimate x={800} y={1080} w={320} h={460} rot={3} />
      {[650, 810, 970].map((x, i) => <Person key={i} id={'e6' + i} t={t} x={x} y={1760} s={0.95} flip {...ENG} mood="flat" armL={[150, 165]} armR={[150, 165]} bob={Math.sin(t * 4 + i) * 2} />)}
      <Person id="s6" t={t} x={270} y={2230} s={2.0} {...SOGO} mood="stern" armL={[8, 8]} armR={[8, 8]} />
      <Balloon x={430} y={760} w={260} h={170} tx={360} ty={900} k={pop(t, T.at(6, 'こう'))}>{[0, 1, 2].map(i => <circle key={i} cx={370 + i * 60} cy={760} r={18 + Math.sin(t * 8 + i) * 4} fill={INK} />)}</Balloon>
    </g>
  )},
  // 7a  the estimate, cut in half
  {a: T.s(7) - 0.08, draw: (t, v) => {
    const cut = T.at(7, '半分'), p = easeOut(prog(t, cut + 0.25, 0.6));
    return (
      <g>
        <Paper c="#c99a62" />
        <clipPath id="left7"><rect x={0} y={0} width={540} height={H} /></clipPath><clipPath id="right7"><rect x={540} y={0} width={540} height={H} /></clipPath>
        <g clipPath="url(#left7)"><Estimate x={540} y={1130} w={600} h={760} /></g>
        <g transform={`translate(${p * 200} ${p * p * 420}) rotate(${p * 30} 540 1130)`} opacity={1 - p * 0.7}><g clipPath="url(#right7)"><Estimate x={540} y={1130} w={600} h={760} /></g></g>
        <path d={`M 540 760 V ${lerp(760, 1520, prog(t, cut - 0.05, 0.35))}`} stroke={RED} strokeWidth={7} strokeDasharray="16 14" />
        <Scissors x={540} y={lerp(700, 1560, prog(t, cut - 0.05, 0.35))} s={1.4} open={0.4 + 0.3 * Math.sin(t * 30)} rot={180} />
        <Stamp t={t} text="半分" x={330} y={1440} size={120} a={cut + 0.4} rot={-10} />
      </g>
    );
  }},
  // 7b  if the half goes through the Diet…
  {a: T.at(7, '国会') - 0.08, draw: (t, v) => {
    const q = easeInOut(prog(v, 0, 0.8));
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#efe9d6" y1={1600} />
        <rect x={0} y={1600} width={W} height={320} fill="#c9bfa8" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        <Diet x={620} y={1600} s={1.25} />
        <path d="M 150 1430 Q 380 1560 590 1560" fill="none" stroke={RED} strokeWidth={9} strokeDasharray="22 18" />
        <g transform={`translate(${lerp(150, 610, q)} ${lerp(1260, 1520, q)}) scale(${lerp(0.55, 0.25, q)})`}><Estimate x={0} y={0} w={300} h={400} title="" /></g>
        {t > T.at(7, '通れば') + 0.15 && <Check x={880} y={960} s={pop(t, T.at(7, '通れば') + 0.15)} />}
      </g>
    );
  }},
  // 7c  "the rest is on me": the rock falls on his back
  {a: T.at(7, 'あとは') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#c99a62" /><rect x={0} y={1680} width={W} height={240} fill="#9a6b3d" />
      <Carrying x={520} y={1700} s={1.55} t={t} drop={easeOut(prog(v, 0, 0.45))} />
      {v > 0.45 && <g>{[0, 1, 2, 3].map(i => { const a = -Math.PI / 2 + (i - 1.5) * 0.4; return <path key={i} d={`M ${560 + Math.cos(a) * 330} ${720 + Math.sin(a) * 120 + 260} l ${Math.cos(a) * 60} ${Math.sin(a) * 40}`} stroke={INK} strokeWidth={8} strokeLinecap="round" opacity={1 - prog(v, 0.45, 0.4)} />; })}</g>}
    </g>
  )},
  // 7d  "do not worry"
  {a: T.at(7, '心配') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#c99a62" />
      <Rock x={900} y={1560} s={0.75} rot={-8} />
      <Person id="s7" t={t} x={380} y={2260} s={2.05} {...SOGO} mood="smile" armL={[8, 8]} armR={[8, 8]} />
      <Balloon x={680} y={800} w={560} h={210} tx={520} ty={980} k={pop(t, T.at(7, '心配') - 0.06)}>
        <text x={680} y={834} textAnchor="middle" fontFamily={MARK} fontSize={96} fill={INK}>{'心配するな'.slice(0, Math.ceil(5 * clamp((t - T.at(7, '心配')) / (T.to(7, 'するな') - T.at(7, '心配')))))}</text>
      </Balloon>
    </g>
  )},
  // 8a  the top of the tower hidden under a cloth: only the "budget" is shown
  {a: T.s(8) - 0.08, draw: (t, v) => {
    const k = easeOut(prog(v, 0, 0.55));
    return (
      <g>
        <Paper c="#efe5cc" /><rect x={0} y={1600} width={W} height={320} fill="#c9bfa8" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        <CoinTower x={560} y={1600} n={46} s={1.3} />
        <g transform={`translate(560 ${lerp(320, 900, k)})`} filter="url(#drop)"><rect x={-250} y={-330} width={500} height={520} fill="#7a5c8f" {...S({strokeWidth: 6})} />{[0, 1, 2, 3].map(i => <path key={i} d={`M ${-190 + i * 126} -330 L ${-216 + i * 126} 190`} stroke="#5a3f6f" strokeWidth={5} />)}<path d="M -290 -330 H 290" stroke="#5a3d22" strokeWidth={18} strokeLinecap="round" /></g>
        <Label t={t} text="予算" x={880} y={1350} size={86} a={T.at(8, '予算は')} b={T.at(8, '予算は') + 0.25} font={MARK} fill="#fff6cf" bold />
        {t > T.at(8, '予算は') && <Arrow x1={790} y1={1350} x2={680} y2={1350} />}
        <Person id="s8" t={t} x={160} y={1720} s={1.1} {...SOGO} mood="flat" armL={[8, 8]} armR={[175, -57]} />
        <g transform={`translate(230 1140) rotate(-10) scale(${pop(t, T.at(8, '安く'))})`}><text textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#e0702a" stroke="#fbf6ea" strokeWidth={12} paintOrder="stroke">しーっ</text></g>
      </g>
    );
  }},
  // 8b  and it goes through
  {a: T.at(8, '国会') - 0.08, draw: (t, v) => {
    const pass = T.at(8, '通りました');
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#efe9d6" y1={1600} />
        <rect x={0} y={1600} width={W} height={320} fill="#c9bfa8" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        <Diet x={540} y={1600} s={1.3} />
        <Estimate x={540} y={900} w={300} h={300} title="予算" rot={-4} />
        <Stamp t={t} text="可決" x={600} y={940} size={170} a={pass} rot={-18} />
        {t > pass && <g>{Array.from({length: 14}).map((_, i) => { const a = (i / 14) * Math.PI * 2, r = 230 + prog(t, pass, 0.3) * 50; return <path key={i} d={`M ${600 + Math.cos(a) * r} ${940 + Math.sin(a) * r} L ${600 + Math.cos(a) * (r + 70)} ${940 + Math.sin(a) * (r + 70)}`} stroke="#e0702a" strokeWidth={9} strokeLinecap="round" />; })}</g>}
      </g>
    );
  }},
  // 9   but the cloth falls: the whole tower
  {a: T.s(9) - 0.08, draw: (t, v) => {
    const a = T.at(9, '予算の'), f = easeOut(prog(t, a - 0.3, 0.7));
    return (
      <g>
        <Paper c="#efe5cc" /><rect x={0} y={1600} width={W} height={320} fill="#c9bfa8" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        <CoinTower x={620} y={1600} n={46} s={1.3} />
        <g transform={`translate(620 ${900 + f * f * 900}) rotate(${f * 25})`} opacity={1 - f}><rect x={-250} y={-330} width={500} height={520} fill="#7a5c8f" {...S({strokeWidth: 6})} /><path d="M -290 -330 H 290" stroke="#5a3d22" strokeWidth={18} strokeLinecap="round" /></g>
        <path d="M 360 1120 H 1040" stroke={INK} strokeWidth={6} strokeDasharray="18 14" />
        <Label t={t} text="予算" x={240} y={1360} size={76} a={T.s(9) + 0.1} b={T.s(9) + 0.3} font={MARK} fill="#fff6cf" />
        <path d="M 400 1590 V 1130 M 380 1590 H 420 M 380 1130 H 420" stroke={INK} strokeWidth={8} />
        {f > 0.5 && <path d="M 880 1590 V 620 M 860 1590 H 900 M 860 620 H 900" stroke={RED} strokeWidth={8} />}
        <Label t={t} text="工事費" x={240} y={800} size={76} a={T.at(9, '工事費')} b={T.to(9, '工事費')} font={MARK} fill="#fff6cf" />
        <Stamp t={t} text="ほぼ2倍" x={300} y={1060} size={110} a={T.at(9, '2倍')} rot={-9} />
        <Person id="e9" t={t} x={980} y={1760} s={0.95} flip {...ENG} mood={f > 0.5 ? 'wow' : 'flat'} armL={[10, 10]} armR={f > 0.5 ? [160, 175] : [10, 10]} />
      </g>
    );
  }},
  // 10a  he takes it on himself and bows
  {a: T.s(10) - 0.08, draw: (t, v) => {
    const bow = easeInOut(prog(t, T.at(10, '責任'), 0.7));
    return (
      <g>
        <Paper c="#e3dac6" /><rect x={0} y={1680} width={W} height={240} fill="#c9bfa8" /><path d="M 0 1680 H 1080" stroke={INK} strokeWidth={4} />
        <Carrying x={420} y={1700} s={1.45} t={t} bow={bow} mood="sad" />
        {[0, 1, 2].map(i => <Mic key={i} x={820 + i * 80} y={1260 + i * 30} s={1.1} rot={-28 - i * 6} />)}
        {[0, 1].map(i => { const f = ((t * 1.4 + i * 0.5) % 1); return f < 0.2 ? <circle key={i} cx={760 + i * 200} cy={900 + i * 100} r={90} fill="url(#glow)" /> : null; })}
      </g>
    );
  }},
  // 10b  the year before the opening, he walks out
  {a: T.at(10, '開業') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1600} />
      <rect x={0} y={1600} width={W} height={320} fill="#b9b0a0" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
      <g filter="url(#drop)"><rect x={40} y={900} width={420} height={700} fill="#cfc7b6" {...S({strokeWidth: 6})} />
        {Array.from({length: 4}).map((_, r) => Array.from({length: 3}).map((_, c) => <rect key={r + '-' + c} x={84 + c * 120} y={1040 + r * 120} width={80} height={80} fill="#cfe6f0" {...S({strokeWidth: 4})} />))}
        <rect x={70} y={920} width={360} height={90} rx={6} fill="#1f4d3a" {...S({strokeWidth: 5})} /><text x={250} y={982} textAnchor="middle" fontFamily={MARK} fontSize={58} fill="#f3e9c6">国鉄本社</text></g>
      <Person id="s10" t={t} x={lerp(500, 820, prog(v, 0, 2.4))} y={1760} s={1.15} {...SOGO} mood="sad" armL={[10, 10]} armR={[12, 8]} legs={[Math.sin(v * 7) * 20, -Math.sin(v * 7) * 20]} holdR={<g><rect x={-40} y={6} width={80} height={60} rx={6} fill="#7a5230" {...S({strokeWidth: 4})} /><path d="M -16 8 Q 0 -10 16 8" fill="none" stroke={INK} strokeWidth={4} /></g>} />
      <Calendar x={640} y={760} s={0.6 * pop(t, T.at(10, '開業') - 0.08)} year="1963" />
      <g opacity={0.6}><Calendar x={900} y={760} s={0.6 * pop(t, T.at(10, '開業') + 0.2)} year="1964" top="開業" /></g>
      {t > T.at(10, '開業') + 0.2 && <circle cx={640} cy={770} r={130} fill="none" stroke={RED} strokeWidth={9} />}
    </g>
  )},
  // 11a  the day: the first train under the date, at dawn
  {a: T.s(11) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#f6c48e" bottom="#fbe9cc" y1={1560} />
      <circle cx={820} cy={1250} r={180} fill="#f6b05a" {...S()} />
      <Fuji x={260} y={1470} s={1.15} />
      <rect x={0} y={1390} width={W} height={90} fill="#d9c9a4" {...S({strokeWidth: 4})} />
      <rect x={0} y={1560} width={W} height={360} fill="#e6d4b0" /><path d="M 0 1554 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={lerp(1100, -500, prog(v, 0, 2.6))} y={1554} s={1.0} len={1300} />
      <Calendar x={540} y={880} s={1.4 * pop(t, T.s(11))} year="1964" top="10月1日" />
    </g>
  )},
  // 11b  the morning it first ran
  {a: T.at(11, '新幹線') - 0.08, draw: (t, v) => {
    const x = lerp(900, -260, easeOut(prog(v, 0, 1.6)));
    return (
      <g>
        <Sky top="#f6c48e" bottom="#fbe9cc" y1={1480} />
        {Array.from({length: 16}).map((_, i) => { const a = (i / 16) * Math.PI * 2 + t * 0.2; return <path key={i} d={`M ${780 + Math.cos(a) * 270} ${1180 + Math.sin(a) * 270} L ${780 + Math.cos(a) * 360} ${1180 + Math.sin(a) * 360}`} stroke="#f2a25a" strokeWidth={10} strokeLinecap="round" />; })}
        <circle cx={780} cy={1180} r={230} fill="#f6b05a" {...S()} />
        <Fuji x={300} y={1480} s={1.55} />
        <rect x={0} y={1300} width={W} height={190} fill="#d9c9a4" {...S({strokeWidth: 4})} />
        <rect x={0} y={1480} width={W} height={440} fill="#e6d4b0" /><path d="M 0 1474 H 1080" stroke="#8d8a84" strokeWidth={8} />
        {[0, 1, 2, 3, 4].map(i => <path key={i} d={`M ${x + 1500 + i * 30} ${1270 + i * 36} H ${x + 1700 + i * 30}`} stroke={INK} strokeWidth={6} strokeLinecap="round" opacity={0.5} />)}
        <Train x={x} y={1474} s={1.35} len={1200} />
      </g>
    );
  }},
  // 11c  the ceremony at Tokyo Station
  {a: T.at(11, '東京駅') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1330} />
      <rect x={0} y={600} width={W} height={50} fill="#8b9aa5" {...S()} />
      <Bunting y={650} sag={40} />
      <g filter="url(#dropS)"><rect x={740} y={760} width={290} height={110} rx={8} fill="#fbf7ee" {...S({strokeWidth: 6})} /><text x={885} y={838} textAnchor="middle" fontFamily={MARK} fontSize={78} fill={INK}>東京駅</text></g>
      <Kusudama x={300} y={850} s={1.0} open={easeOut(prog(v, 0.35, 0.5))} t={t} />
      <path d="M 0 1326 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={230} y={1326} s={1.25} len={1300} />
      <rect x={0} y={1336} width={W} height={584} fill="#cfc8ba" /><rect x={0} y={1340} width={W} height={18} fill="#f2c230" {...S({strokeWidth: 3})} />
      {[[190, '#3a4a3a', '#d9a521', 'bowler'], [540, '#2f3f5a', '#c0392b', null], [890, '#4b3f2a', '#2e8b57', 'bowler']].map(([x, suit, tie, hat], i) => <g key={i}><Flag x={(x as number) + 120} y={1560} t={t} i={i} /><Person id={'c11' + i} t={t} x={x as number} y={2000} s={1.05} suit={suit as string} tie={tie as string} hat={hat as 'bowler' | null} hairStyle="short" mood="laugh" bob={Math.sin(t * 14 + i * 2) * 8} armL={[10, 10]} armR={[150, 160]} /></g>)}
      <Confetti t={t} id="c11" y0={660} h={900} />
    </g>
  )},
  // 11d  every guest has a seat; his is empty
  {a: T.at(11, '十河は') - 0.08, draw: (t, v) => {
    const gone = T.at(11, '十河は') - 0.08;
    return (
      <g>
        <Paper c="#e3dac6" /><rect x={0} y={1600} width={W} height={320} fill="#b9a988" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        {[[150, '#3a4a3a', '#d9a521', 'bowler'], [400, '#2f3f5a', '#c0392b', null], [650, '#4b3f2a', '#2e8b57', null]].map(([x, suit, tie, hat], i) => <g key={i}><Person id={'g11' + i} t={t} x={x as number} y={1440} s={0.82} suit={suit as string} tie={tie as string} hat={hat as 'bowler' | null} hairStyle={i === 2 ? 'grey' : 'short'} glasses={i === 2} mood="smile" noShadow /><Chair x={x as number} y={1600} s={1.0} /></g>)}
        <Chair x={900} y={1600} s={1.0} />
        <g stroke={INK} strokeWidth={7} strokeDasharray="20 16" fill="rgba(251,247,238,0.6)"><circle cx={900} cy={1010} r={62} /><path d="M 830 1340 C 830 1180, 970 1180, 970 1340 Z" /></g>
        <Label t={t} text="招待客" x={400} y={880} size={60} a={gone} b={gone + 0.2} font={MARK} fill="#fff6cf" />
        <Label t={t} text="十河" x={900} y={850} size={80} a={gone + 0.1} b={gone + 0.3} font={MARK} bold />
        <XMark x={900} y={1180} r={140} t={t} a={T.at(11, '招かれ')} />
      </g>
    );
  }},
  // 12a  eighty years old, at home
  {a: T.s(12) - 0.08, draw: (t, v) => (
    <g>
      <Room floor={1640} />
      <g filter="url(#drop)"><rect x={700} y={640} width={260} height={400} fill="#efe4c4" {...S({strokeWidth: 5})} /><path d="M 690 640 H 970" stroke="#5a3d22" strokeWidth={14} strokeLinecap="round" />
        {[[790, 720, 800, 960], [860, 730, 850, 950], [770, 820, 890, 810]].map(([x1, y1, x2, y2], i) => <path key={i} d={`M ${x1} ${y1} L ${x2} ${y2}`} stroke={INK} strokeWidth={14} strokeLinecap="round" />)}</g>
      <Person id="s12" t={t} x={540} y={2380} s={2.1} {...SOGO} mood="flat" armL={[8, 8]} armR={[8, 8]} />
      <g transform={`translate(560 800) scale(${pop(t, T.s(12) + 0.1)})`} filter="url(#drop)"><circle r={140} fill="#fff3c8" {...S({strokeWidth: 7})} /><text y={40} textAnchor="middle" fontFamily={MARK} fontSize={110} fill={RED}>80歳</text></g>
    </g>
  )},
  // 12b  he watched it on the television
  {a: T.at(12, '自宅') - 0.08, draw: (t, v) => (
    <g>
      <Room floor={1640} />
      <TV x={380} y={1480} s={1.6}>
        <rect x={0} y={0} width={310} height={130} fill="#c9dbe3" /><rect x={0} y={130} width={310} height={100} fill="#d9c9a4" />
        <Train x={310 - v * 90} y={150} s={0.26} len={900} />
      </TV>
      <Zabuton x={820} y={1700} />
      <BackView x={820} y={1690} s={1.2} />
    </g>
  )},
  // 13a  nine years of trains at the same platform
  {a: T.s(13) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1560} />
      <path d="M 0 1550 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={lerp(1100, -900, (v * 0.9) % 1)} y={1550} s={0.95} len={1300} />
      <Platform y={1556} roof={640} />
      <YearFlip t={t} a={T.s(13)} b={T.at(13, 'その')} from={1964} to={1973} x={540} y={1010} s={1.4} small="9年後" />
    </g>
  )},
  // 13b  the same platform: an empty place at its end
  {a: T.at(13, 'その') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1560} />
      <path d="M 0 1550 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={-260} y={1550} s={0.95} len={900} />
      <Platform y={1556} roof={640} />
      <g filter="url(#dropS)"><rect x={80} y={760} width={400} height={140} rx={8} fill="#fbf7ee" {...S({strokeWidth: 6})} /><text x={280} y={860} textAnchor="middle" fontFamily={MARK} fontSize={100} fill={INK}>東京</text></g>
      <rect x={710} y={1080} width={300} height={470} fill="none" stroke={INK} strokeWidth={7} strokeDasharray="22 18" />
      <QMark x={860} y={1290} s={1.1} />
      {[[200, '#3a4a3a'], [420, '#7a3b4a']].map(([x, suit], i) => <Person key={i} id={'p13' + i} t={t} x={x as number} y={1700} s={1.15} suit={suit as string} hairStyle="short" mood="ok" bob={Math.sin(t * 5 + i) * 2} />)}
    </g>
  )},
  // 13c  his face in bronze
  {a: T.at(13, '十河の') - 0.08, draw: (t, v) => {
    const up = T.at(13, '十河の') - 0.08, q = prog(t, up, 0.6);
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#efe9d6" y1={1560} />
        <path d="M 0 1550 H 1080" stroke="#8d8a84" strokeWidth={8} />
        <Platform y={1556} roof={640} />
        {q < 1 && <g opacity={1 - q}>{Array.from({length: 16}).map((_, i) => { const a = (i / 16) * Math.PI * 2, r = 420 + q * 100; return <path key={i} d={`M ${540 + Math.cos(a) * r} ${1160 + Math.sin(a) * r} L ${540 + Math.cos(a) * (r + 90)} ${1160 + Math.sin(a) * (r + 90)}`} stroke="#e0702a" strokeWidth={10} strokeLinecap="round" />; })}</g>}
        <Monument x={540} y={1560} s={1.9 * pop(t, up, 140)} />
        <Sparkles x={540} y={1060} r={330} t={t} />
      </g>
    );
  }},
  // 14a  when you take the Shinkansen
  {a: T.s(14) - 0.08, draw: (t, v) => {
    const x = lerp(-100, 430, easeOut(prog(v, 0, 1.3)));
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#efe9d6" y1={1430} />
        <path d="M 0 1424 H 1080" stroke="#8d8a84" strokeWidth={8} />
        <Train x={330} y={1424} s={1.3} len={1300} />
        <rect x={0} y={1430} width={W} height={490} fill="#cfc8ba" /><rect x={0} y={1434} width={W} height={18} fill="#f2c230" {...S({strokeWidth: 2.5})} />
        <Person id="tr14" t={t} x={x} y={1760} s={1.35} suit="#3f8f7a" pants="#2f5a50" tie="#f2c230" hairStyle="short" mood="smile" look={6} legs={[Math.sin(v * 7) * 22 * (1 - prog(v, 1.2, 0.2)), -Math.sin(v * 7) * 22 * (1 - prog(v, 1.2, 0.2))]} armL={[10, 10]} armR={[100, 160]} holdR={<g transform="rotate(-15)"><rect x={-56} y={-34} width={112} height={68} rx={6} fill="#fff6cf" {...S({strokeWidth: 4})} /><text y={14} textAnchor="middle" fontFamily={MARK} fontSize={34} fill={INK}>きっぷ</text></g>} />
      </g>
    );
  }},
  // 14b  platforms 18 and 19
  {a: T.at(14, '18番') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1560} />
      <rect x={0} y={560} width={W} height={50} fill="#8b9aa5" {...S()} />
      <path d="M 0 1554 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={-120} y={1554} s={1.15} len={1300} />
      <rect x={0} y={1560} width={W} height={360} fill="#cfc8ba" /><rect x={0} y={1564} width={W} height={18} fill="#f2c230" {...S({strokeWidth: 2.5})} />
      {[[300, '18', T.at(14, '18番')], [780, '19', T.at(14, '19番')]].map(([x, n, a]) => <g key={n as string}><path d={`M ${x} 610 V 780`} stroke={INK} strokeWidth={10} /><g transform={`translate(${x} 1000) scale(${pop(t, (a as number) - 0.05)})`} filter="url(#drop)"><rect x={-200} y={-220} width={400} height={440} rx={14} fill="#2f5fa8" {...S({strokeWidth: 7})} /><text y={70} textAnchor="middle" fontFamily={MARK} fontSize={260} fill="#fbf7ee">{n}</text><text y={180} textAnchor="middle" fontFamily={MARK} fontSize={60} fill="#fbf7ee">番線</text></g></g>)}
    </g>
  )},
  // 14c  the far end of the platform
  {a: T.at(14, '端') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1500} />
      <path d="M 0 1494 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={-700} y={1494} s={1.0} len={1300} />
      <Platform y={1500} roof={700} />
      <Monument x={880} y={1500} s={1.05} words={false} />
      <Sparkles x={880} y={1260} r={200} t={t} />
      <Arrow x1={130} y1={1000} x2={680} y2={1000} p={easeOut(prog(v, 0.1, 0.6))} />
      <Label t={t} text="ホームの端" x={400} y={880} size={78} a={T.at(14, '端') - 0.05} b={T.at(14, '端') + 0.25} font={MARK} fill="#fff6cf" bold />
    </g>
  )},
  // 15a  alone, the rock of the lie on his back
  {a: T.s(15) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#d9ccb0" /><rect x={0} y={1680} width={W} height={240} fill="#b9a988" /><path d="M 0 1680 H 1080" stroke={INK} strokeWidth={4} />
      <defs><radialGradient id="spot15" cx="50%" cy="60%" r="45%"><stop offset="0" stopColor="#fff6d8" stopOpacity="0.9" /><stop offset="1" stopColor="#fff6d8" stopOpacity="0" /></radialGradient></defs>
      <rect x={0} y={500} width={W} height={1420} fill="url(#spot15)" />
      <Egg x={880} y={1560} s={0.6} rot={24} />
      <Carrying x={480} y={1700} s={1.55} t={t} />
    </g>
  )},
  // 15b  he still sees the trains off
  {a: T.at(15, '今も') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#f3b77e" bottom="#f7e3c2" y1={1500} />
      <circle cx={860} cy={940} r={170} fill="#f6a85a" {...S()} />
      <Cloud x={330 + v * 8} y={820} s={1.1} c="#fbe9d6" />
      <path d="M 0 1486 H 1080" stroke="#8d8a84" strokeWidth={8} />
      <Train x={460 + Math.pow(prog(v, 0.3, 4.5), 1.7) * 1700} y={1486} s={1.05} len={1500} flip />
      <rect x={0} y={1494} width={W} height={426} fill="#cfc0a2" /><rect x={0} y={1498} width={W} height={16} fill="#f2c230" {...S({strokeWidth: 2.5})} />
      <Monument x={280} y={1620} s={1.6} look={3} />
    </g>
  )},
];

const N = 16;
const words = (t: number) => (
  <g>
    {lineOn(t, T, 0, N) && <g>
      <Label t={t} text="新幹線は、" x={540} y={330} size={104} a={0} still bold font={MARK} />
      <Label t={t} text="ひとつの{ウソ}から生まれた" x={540} y={490} size={76} a={0} still bold font={MARK} />
    </g>}
    {lineOn(t, T, 1, N) && <g>
      <Tag t={t} text="1955年" a={T.at(1, '71歳')} />
      <Label t={t} text="{ウソ}をついたのは…" x={540} y={330} size={60} a={T.s(1)} b={T.to(1, 'のは')} />
      <Label t={t} text="{71歳}で国鉄のトップになった" x={540} y={455} size={60} a={T.at(1, '71歳')} b={T.to(1, 'なった')} />
    </g>}
    {lineOn(t, T, 2, N) && <Label t={t} text="なぜ、{ウソ}が必要だったのか？" x={540} y={400} size={62} a={T.s(2)} b={T.to(2, 'でしょうか')} />}
    {lineOn(t, T, 3, N) && <g>
      <Tag t={t} text="1950年代" a={T.s(3)} />
      <Label t={t} text="当時、鉄道は…" x={540} y={330} size={60} a={T.s(3)} b={T.to(3, '鉄道は')} />
      <Label t={t} text="「{もう古い}」と言われていた" x={540} y={455} size={60} a={T.at(3, 'もう古い')} b={T.e(3)} />
    </g>}
    {lineOn(t, T, 4, N) && <g>
      {t < T.at(4, 'ピラミッド') - 0.08
        ? <Label t={t} text="東京と大阪を結ぶ{高速鉄道}の計画は" x={540} y={330} size={54} a={T.s(4)} b={T.to(4, '計画は')} />
        : <Label t={t} text="ピラミッド、万里の長城、戦艦大和" x={540} y={330} size={54} a={T.at(4, 'ピラミッド')} b={T.to(4, '戦艦大和')} />}
      <Label t={t} text="に続く「{世界四バカ}」と笑われた" x={540} y={455} size={58} a={T.at(4, 'に続く')} b={T.e(4)} />
    </g>}
    {lineOn(t, T, 5, N) && <g>
      <Label t={t} text="しかも、建設費は…" x={540} y={330} size={60} a={T.s(5)} b={T.to(5, '建設費は')} />
      <Label t={t} text="国会が{認めるはずのない}金額" x={540} y={455} size={60} a={T.at(5, '国会')} b={T.e(5)} />
    </g>}
    {lineOn(t, T, 6, N) && <Label t={t} text="十河は、こう言ったと伝えられている" x={540} y={400} size={54} a={T.s(6)} b={T.to(6, '伝えられて')} />}
    {lineOn(t, T, 7, N) && <g>
      <Label t={t} text="「半分にした予算が国会を通れば、" x={540} y={330} size={54} a={T.at(7, '半分')} b={T.to(7, '通れば')} />
      <Label t={t} text="あとは{おれが責任を持つ}。心配するな」" x={540} y={455} size={52} a={T.at(7, 'あとは')} b={T.to(7, 'するな')} />
    </g>}
    {lineOn(t, T, 8, N) && <g>
      <Label t={t} text="わざと{安く見せた}予算は…" x={540} y={330} size={60} a={T.s(8)} b={T.to(8, '予算は')} />
      <Label t={t} text="国会を通った" x={540} y={455} size={66} a={T.at(8, '国会')} b={T.e(8)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 9, N) && <g>
      <Label t={t} text="けれど、工事費は…" x={540} y={330} size={60} a={T.s(9)} b={T.to(9, '工事費は')} />
      <Label t={t} text="予算の{ほぼ2倍}にふくらんだ" x={540} y={455} size={60} a={T.at(9, '予算の')} b={T.e(9)} />
    </g>}
    {lineOn(t, T, 10, N) && <g>
      <Tag t={t} text="1963年" a={T.s(10)} />
      <Label t={t} text="十河は{責任を取る}形で" x={540} y={330} size={60} a={T.s(10)} b={T.to(10, '形で')} />
      <Label t={t} text="開業の前の年に、国鉄を去った" x={540} y={455} size={58} a={T.at(10, '開業')} b={T.e(10)} />
    </g>}
    {lineOn(t, T, 11, N) && <g>
      <Tag t={t} text="1964年10月1日" a={T.s(11)} />
      <Label t={t} text="新幹線が走り出した朝" x={540} y={300} size={56} a={T.at(11, '新幹線')} b={T.to(11, '朝')} />
      <Label t={t} text="東京駅の出発式に…" x={540} y={410} size={56} a={T.at(11, '東京駅')} b={T.to(11, '出発式に')} />
      <Label t={t} text="十河は{招かれなかった}" x={540} y={520} size={64} a={T.at(11, '十河は')} b={T.e(11)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 12, N) && <g>
      <Label t={t} text="{80歳}の十河は…" x={540} y={330} size={60} a={T.s(12)} b={T.to(12, '十河は')} />
      <Label t={t} text="自宅のテレビで、それを見ていた" x={540} y={455} size={56} a={T.at(12, '自宅')} b={T.to(12, '見ていた')} />
      <Label t={t} text="…といいます" x={800} y={570} size={44} a={T.at(12, 'といいます')} b={T.e(12)} />
    </g>}
    {lineOn(t, T, 13, N) && <g>
      <Tag t={t} text="1973年" a={T.at(13, 'その')} />
      <Label t={t} text="{9年後}、東京駅のホームに" x={540} y={330} size={60} a={T.s(13)} b={T.to(13, 'ホームに')} />
      <Label t={t} text="十河の顔を刻んだ{記念碑}が建った" x={540} y={455} size={56} a={T.at(13, '十河の')} b={T.e(13)} />
    </g>}
    {lineOn(t, T, 14, N) && <g>
      <Label t={t} text="新幹線に乗るときは" x={540} y={300} size={56} a={T.s(14)} b={T.to(14, 'ときは')} />
      <Label t={t} text="{18番・19番}ホームの端を" x={540} y={410} size={62} a={T.at(14, '18番')} b={T.to(14, '端を')} font={MARK} />
      <Label t={t} text="探してみてください" x={540} y={520} size={56} a={T.at(14, '探して')} b={T.e(14)} />
    </g>}
    {lineOn(t, T, 15, N) && <g>
      <Label t={t} text="{ウソ}の責任を一人で背負った男が" x={540} y={330} size={56} a={T.s(15)} b={T.to(15, '男が')} />
      <Label t={t} text="今もそこから、列車を見送っている" x={540} y={455} size={56} a={T.at(15, '今も')} b={T.e(15)} />
    </g>}
  </g>
);

export const ShinkansenVideo: React.FC = () => <Movie shots={shots} words={words} credit="声：VOICEVOX:青山龍星　／　音楽：竹笛" end={T.e(15)} />;
