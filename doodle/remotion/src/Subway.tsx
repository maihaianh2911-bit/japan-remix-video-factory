// 「ほら吹き」と笑われた男が、日本で最初の地下鉄をつくった — drawn with Remotion (27/11/2026). One picture or more for every
// part of a sentence, timed on the voice (src/timings/chikatetsu-horafuki.json, from doodle/voice.py).
import React from 'react';
import {
  W, H, INK, RED, HAND, MARK, clamp, prog, lerp, easeOut, easeInOut, pop, makeT, Timing, Shot, Movie, lineOn, Defs, Finish, Shadow, Paper, Sky, Cloud,
  Label, Tag, Stamp, Person, Shop, Street, Lamp, Tram, Car, Tube, Tunnel, Columns, Soil, Calendar, Medal, Pin, Bulb, Haha, PersonProps,
} from './kit';
import {YearFlip, Confetti, QMark, XMark, Bunting, Flag, Flowers, Bean, Glove, Shade, Cake, MetroNet, SKIN} from './parts';
import timing from './timings/chikatetsu-horafuki.json';

const T = makeT(timing as Timing);
export const SUBWAY_SECONDS = T.total;

// Hayakawa Noritsugu: dark hair parted, round glasses, a moustache, a brown three-piece suit
const HAYA: Partial<PersonProps> = {suit: '#6b4c32', pants: '#5a3f2a', tie: '#2e6b4f', glasses: true, mustache: true, vest: true, hairStyle: 'part'};
const OLD: Partial<PersonProps> = {...HAYA, hairStyle: 'grey'};

// ---------- pictures used more than once ----------
// the street of Tokyo cut open: shops and people above, the tunnel and the yellow car below
const UnderTokyo: React.FC<{t: number; v: number; carX: number; street?: number}> = ({t, v, carX, street = 860}) => (
  <g>
    <Sky top="#9fc8e2" bottom="#eee7d3" y1={street} />
    <Cloud x={220 + v * 16} y={street - 270} s={0.9} />
    <Shop x={-30} y={street} w={250} h={300} c="#b5553c" sign="時計" />
    <Shop x={230} y={street} w={230} h={360} c="#c98a5a" awning="url(#stripesG)" />
    <Shop x={470} y={street} w={250} h={290} c="#8f5a44" sign="呉服" />
    <Shop x={730} y={street} w={380} h={340} c="#b5553c" awning="url(#stripesG)" sign="薬" />
    <Street y={street} h={130} />
    <Tram x={lerp(1150, -520, prog(v, 0, 4))} y={street + 112} s={0.55} />
    {[0, 1, 2].map(i => { const q = (v * 0.12 + i * 0.33) % 1; return <Person key={i} id={'w' + i} t={t} x={lerp(-60, 1140, q)} y={street + 72} s={0.3} suit={['#3a4a3a', '#7a3b4a', '#2f3f5a'][i]} hat={i === 1 ? 'bowler' : 'boater'} legs={[Math.sin(v * 9 + i) * 22, -Math.sin(v * 9 + i) * 22]} noShadow />; })}
    <Soil y1={street + 130} y2={street + 300} />
    {[180, 470, 860].map((px, i) => <g key={px}><circle cx={px} cy={street + 214} r={30} fill="#8d8a84" stroke={INK} strokeWidth={4} /><circle cx={px} cy={street + 214} r={18} fill="#4b4744" /><text x={px} y={street + 274} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={26} fill="#5a3f22">{['ガス', '水道', '電線'][i]}</text></g>)}
    <Tunnel y1={street + 300} y2={street + 700} />
    <Car x={carX} y={street + 684} s={1.22} id="u" />
    <Columns y1={street + 300} y2={street + 700} xs={[70, 1010]} />
    <Soil y1={street + 700} y2={H} />
  </g>
);

// ---------- the shots ----------
const shots: Shot[] = [
  // 0a  the man everybody laughed at: a placard 「ほら吹き」 on his chest, Ginza laughing round him
  {a: 0, draw: (t, v) => (
    <g>
      <Sky top="#9fc8e2" bottom="#f1e9d4" y1={1290} />
      <Cloud x={200 + v * 20} y={640} /><Cloud x={880 - v * 12} y={720} s={0.7} />
      <Shop x={-60} y={1290} w={320} h={560} c="#b5553c" sign="時計" />
      <Shop x={270} y={1290} w={280} h={640} c="#c98a5a" awning="url(#stripesG)" sign="呉服" />
      <Shop x={560} y={1290} w={260} h={520} c="#8f5a44" />
      <Shop x={830} y={1290} w={300} h={600} c="#b5553c" awning="url(#stripesG)" sign="洋品" />
      <Street y={1290} h={630} />
      <Lamp x={110} y={1330} /><Lamp x={975} y={1330} />
      <Person id="m1" t={t} x={240} y={1430} s={0.78} suit="#3a4a3a" tie="#d9a521" hat="boater" mood="laugh" armR={[150, 150]} pointR armL={[20, 40]} bob={Math.sin(t * 22) * 4} />
      <Person id="m2" t={t} x={860} y={1440} s={0.8} flip suit="#4a3636" tie="#3d74c4" hat="bowler" mood="laugh" armR={[150, 150]} pointR armL={[30, 70]} bob={Math.sin(t * 22 + 2) * 4} />
      {/* the man, the rolled plan in his hand */}
      <Person id="h0" t={t} x={540} y={1690} s={1.38} {...HAYA} mood="stern" armL={[14, 10]} armR={[28, 90]} holdR={<g transform="rotate(-20)"><rect x={-90} y={-20} width={190} height={40} rx={20} fill="#2f5fa8" stroke={INK} strokeWidth={4} /><ellipse cx={100} cy={0} rx={10} ry={20} fill="#e9f0fa" stroke={INK} strokeWidth={4} /></g>} />
      <path d="M 470 1060 L 420 1180 M 610 1060 L 660 1180" stroke={INK} strokeWidth={4} />
      <Label t={t} text="ほら吹き" x={540} y={1215} size={74} a={0} still font={MARK} fill="#fff3c8" color={RED} rot={-4} bold />
      {/* the two in front, laughing and pointing, cut by the frame */}
      <Person id="f1" t={t} x={-10} y={2120} s={1.7} suit="#2f3f5a" tie="#c0392b" hat="bowler" mood="laugh" armR={[150, 128]} pointR armL={[10, 10]} bob={Math.sin(t * 20) * 6} />
      <Person id="f2" t={t} x={1090} y={2140} s={1.75} flip suit="#5a4636" tie="#2e8b57" hairStyle="short" mood="laugh" armR={[150, 128]} pointR armL={[10, 10]} bob={Math.sin(t * 20 + 1.5) * 6} />
      <Haha x={190} y={900} t={t} a={0.05} rot={-12} /><Haha x={890} y={890} t={t} a={0.2} rot={12} />
    </g>
  )},
  // 0b  the very middle of Tokyo: a pin falls on the map
  {a: T.at(0, '東京') - 0.08, draw: (t, v) => {
    const drop = pop(t, T.at(0, '東京') - 0.05, 120);
    const ring = easeOut(prog(t, T.at(0, '東京') + 0.25, 0.6));
    return (
      <g>
        <Paper c="#e6d9b8" />
        <path d="M 760 600 C 700 820, 820 1000, 760 1180 C 700 1360, 820 1560, 1120 1720 L 1120 600 Z" fill="#a9cde0" stroke={INK} strokeWidth={5} />
        <path d="M 1120 1500 C 900 1560, 820 1760, 860 1940 L 1120 1940 Z" fill="#a9cde0" stroke={INK} strokeWidth={5} />
        <path d="M 120 760 C 200 680, 380 700, 420 790 C 460 880, 360 960, 240 940 C 120 920, 60 840, 120 760 Z" fill="#9cc48a" stroke={INK} strokeWidth={5} />
        {Array.from({length: 7}).map((_, r) => Array.from({length: 7}).map((_, c) => {
          const bx = 40 + c * 120, by = 1000 + r * 110; if (bx > 700 && by < 1200) return null; if (bx > 720) return null;
          return <rect key={r + '-' + c} x={bx} y={by} width={98} height={88} rx={10} fill={['#f1e2bd', '#e7cfa5', '#dcc29a', '#efdcbc'][(r * 3 + c) % 4]} stroke={INK} strokeWidth={3.5} />;
        }))}
        {[0, 1, 2].map(k => <ellipse key={k} cx={420} cy={1330} rx={(140 + k * 110) * ring} ry={(46 + k * 36) * ring} fill="none" stroke={RED} strokeWidth={10 - k * 2} opacity={1 - k * 0.25} />)}
        <Shadow x={420} y={1334} w={120 * drop} o={0.3} />
        <Pin x={420} y={lerp(560, 1330, drop)} s={2.6} />
        <Label t={t} text="東京" x={420} y={760} size={110} a={T.at(0, '東京')} b={T.at(0, '東京') + 0.15} font={MARK} bold />
        <Stamp t={t} text="ど真ん中" x={760} y={1500} size={88} a={T.at(0, 'ど真ん中')} rot={-6} />
      </g>
    );
  }},
  // 0c  under it: the first subway of Japan
  {a: T.at(0, '日本で') - 0.08, draw: (t, v) => (
    <g>
      <UnderTokyo t={t} v={v} carX={lerp(-1000, 120, easeOut(prog(v, 0, 1.1))) + v * 10} />
      {t > T.at(0, '最初') - 0.05 && <Medal x={830} y={680} s={0.82 * pop(t, T.at(0, '最初') - 0.05)} text="日本初" t={t} />}
    </g>
  )},
  // 1a  thirteen years go by while the trains keep running
  {a: T.s(1) - 0.08, draw: (t, v) => {
    const q = easeInOut(prog(t, T.s(1), T.to(1, '13年後') - T.s(1)));
    return (
      <g>
        <UnderTokyo t={t} v={v} carX={((v * 1500) % 2200) - 1000} />
        {Array.from({length: 7}).map((_, i) => { const f = clamp(q * 1.3 - i * 0.12); return f > 0 && f < 1 ? <g key={i} transform={`translate(${lerp(620, 1150, f)} ${lerp(600, 300 - i * 30, f)}) rotate(${f * 140}) scale(0.6)`}><rect x={-160} y={-120} width={320} height={240} fill="#fbf7ee" stroke={INK} strokeWidth={5} /></g> : null; })}
        <Calendar x={540} y={760} s={1.15} year={String(Math.round(lerp(1927, 1940, q)))} top={q >= 1 ? '13年後' : ''} />
      </g>
    );
  }},
  // 1b  he is pushed out of his own train, which leaves without him
  {a: T.at(1, '彼は') - 0.08, draw: (t, v) => {
    const push = T.at(1, '追い出され');
    const p = easeOut(prog(t, push, 0.6));
    const leave = Math.pow(prog(t, push + 0.85, 1.4), 2) * 1800;
    const hx = lerp(540, 230, p), hy = lerp(1366, 1700, p) - Math.sin(p * Math.PI) * 260;
    const arm = t > push - 0.1 && t < push + 0.5 ? Math.sin(prog(t, push - 0.1, 0.6) * Math.PI) : 0;
    return (
      <g>
        <Paper c="#e9e1cc" y1={1500} />
        <rect x={0} y={560} width={W} height={940} fill="url(#tiles)" />
        <rect x={0} y={1180} width={W} height={34} fill="#3e7c6a" />
        <rect x={0} y={540} width={W} height={60} fill="#6d6a68" stroke={INK} strokeWidth={5} />
        {[200, 540, 880].map(lx => <g key={lx}><circle cx={lx} cy={640} r={90} fill="url(#glow)" opacity={0.5} /><ellipse cx={lx} cy={624} rx={26} ry={16} fill="#fff3c2" stroke={INK} strokeWidth={4} /></g>)}
        <g filter="url(#dropS)"><rect x={170} y={690} width={300} height={150} rx={10} fill="#fbf7ee" stroke={INK} strokeWidth={6} /><text x={320} y={734} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill="#5a5347">うえの</text><text x={320} y={812} textAnchor="middle" fontFamily={MARK} fontSize={86} fill={INK}>上野</text></g>
        <rect x={0} y={1500} width={W} height={30} fill="#f3efe3" stroke={INK} strokeWidth={4} />
        <Car x={-257 + leave} y={1500} s={2.4} open={t < push + 0.8 ? 1 : 0} light={false} id="e" people={false} />
        {/* inside the door: him, then the dark arm that pushes */}
        {p <= 0 && <Person id="h1" t={t} x={540} y={1366} s={0.62} {...OLD} mood="flat" armL={[10, 10]} armR={[10, 10]} />}
        {arm > 0 && <g><rect x={500} y={1080} width={80} height={60} fill="#1c1c20" /><path d={`M 580 1110 L ${580 - arm * 210} 1110`} stroke="#1c1c20" strokeWidth={58} strokeLinecap="round" /><circle cx={580 - arm * 220} cy={1110} r={44} fill="#2a2a2e" stroke={INK} strokeWidth={4} /></g>}
        {p > 0 && <g transform={`rotate(${p < 1 ? -p * 300 : -90} ${hx} ${hy - 150})`}><Person id="h1b" t={t} x={hx} y={hy} s={0.62} {...OLD} mood={p < 1 ? 'wow' : 'sad'} armL={[150, 150]} armR={[150, 150]} legs={[30, -20]} /></g>}
        {p > 0 && <g transform={`translate(${lerp(560, 760, p)} ${lerp(1300, 1720, p) - Math.sin(p * Math.PI) * 180}) rotate(${p * 200})`}><rect x={-50} y={-36} width={100} height={72} rx={8} fill="#7a5230" stroke={INK} strokeWidth={4} /><path d="M -22 -36 Q 0 -60 22 -36" fill="none" stroke={INK} strokeWidth={4} /></g>}
        {p > 0.3 && [0, 1, 2].map(i => { const f = prog(t, push + 0.15 + i * 0.08, 1.2); return <g key={i} transform={`translate(${lerp(560, 300 + i * 240, f)} ${lerp(1240, 1650 - i * 60, f) - Math.sin(f * Math.PI) * 300}) rotate(${f * 300 + i * 40})`}><rect x={-34} y={-44} width={68} height={88} fill="#fbf8ef" stroke={INK} strokeWidth={3.5} /></g>; })}
        {[70, 1010].map(cx => <rect key={cx} x={cx - 20} y={600} width={40} height={900} fill="#41565a" stroke={INK} strokeWidth={4} />)}
      </g>
    );
  }},
  // 2   who he is: a card with an old photograph
  {a: T.s(2) - 0.08, draw: (t, v) => {
    const a = T.at(2, '早川徳次'), b = T.to(2, '早川徳次');
    const n = Math.ceil(4 * clamp((t - a) / (b - a)));
    return (
      <g>
        <Paper c="#9a6b3d" />
        {Array.from({length: 9}).map((_, i) => <path key={i} d={`M 0 ${620 + i * 150} C 300 ${600 + i * 150}, 700 ${650 + i * 150}, 1080 ${615 + i * 150}`} stroke="#7d5530" strokeWidth={5} fill="none" opacity={0.6} />)}
        <g transform={`translate(540 1130) rotate(-2) scale(${pop(t, T.s(2) - 0.05, 160)})`} filter="url(#drop)">
          <rect x={-450} y={-440} width={900} height={880} rx={10} fill="#fbf6ea" stroke={INK} strokeWidth={6} />
          <rect x={-410} y={-400} width={400} height={500} fill="#e7d9b6" stroke={INK} strokeWidth={6} />
          <clipPath id="photo"><rect x={-400} y={-390} width={380} height={480} /></clipPath>
          <g clipPath="url(#photo)" filter="url(#sepia)">
            <rect x={-400} y={-390} width={380} height={480} fill="#d9c7a0" />
            <Person id="ph" t={t} x={-210} y={360} s={1.0} {...HAYA} mood="ok" noShadow armL={[8, 8]} armR={[8, 8]} />
          </g>
          <rect x={-410} y={-400} width={400} height={500} fill="none" stroke="#fbf6ea" strokeWidth={10} />
          {t > a && <g>
            <text x={20} y={-300} fontFamily={HAND} fontWeight={700} fontSize={40} fill="#6a5f50">はやかわ のりつぐ</text>
            <text x={10} y={-190} fontFamily={MARK} fontSize={118} fill={INK}>{'早川徳次'.slice(0, n)}</text>
            <path d="M 10 -160 H 420" stroke={RED} strokeWidth={7} />
          </g>}
          {t > a + 0.7 && <g opacity={prog(t, a + 0.7, 0.25)}><text x={20} y={-80} fontFamily={HAND} fontWeight={700} fontSize={50} fill={INK}>1881年</text><text x={20} y={-10} fontFamily={HAND} fontWeight={700} fontSize={50} fill={INK}>山梨県生まれ</text></g>}
          <path d="M -410 330 H 410" stroke="#b9b6ae" strokeWidth={6} />
          <Car x={lerp(-480, -330, easeOut(prog(t, a + 0.7, 0.9)))} y={330} s={0.48} id="cd" />
        </g>
        <Stamp t={t} text="地下鉄の父" x={760} y={1500} size={70} a={a + 1.0} rot={-8} color="#1f4d3a" />
      </g>
    );
  }},
  // 3a  London, 1914
  {a: T.s(3) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#b9c6cc" bottom="#efe6d4" y1={1080} />
      <circle cx={260} cy={720} r={70} fill="#f6e7c0" opacity={0.7} />
      {/* the Houses of Parliament and the clock tower */}
      <g fill="#cbbd96" stroke={INK} strokeWidth={4}>
        <rect x={-20} y={900} width={700} height={180} />
        {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${10 + i * 58} 900 L ${22 + i * 58} 860 L ${34 + i * 58} 900 Z`} />)}
        {Array.from({length: 10}).map((_, i) => <rect key={'w' + i} x={30 + i * 64} y={940} width={22} height={60} fill="#8e9aa0" />)}
      </g>
      <g stroke={INK} strokeWidth={5}>
        <rect x={700} y={760} width={150} height={320} fill="#d1c194" />
        {[730, 760, 790, 820].map(lx => <path key={lx} d={`M ${lx} 790 V 1070`} stroke="#9a8a62" strokeWidth={4} />)}
        <rect x={684} y={600} width={182} height={170} fill="#d9c99c" />
        <circle cx={775} cy={685} r={66} fill="#fbf6ea" />
        {Array.from({length: 12}).map((_, i) => { const a = (i / 12) * Math.PI * 2; return <path key={i} d={`M ${775 + Math.cos(a) * 52} ${685 + Math.sin(a) * 52} L ${775 + Math.cos(a) * 60} ${685 + Math.sin(a) * 60}`} strokeWidth={4} />; })}
        <path d="M 775 685 L 775 640 M 775 685 L 808 698" strokeWidth={6} strokeLinecap="round" />
        <rect x={694} y={520} width={162} height={84} fill="#cbbd96" />
        {[712, 748, 784, 820].map(ax => <path key={ax} d={`M ${ax} 596 V 552 Q ${ax + 10} 536 ${ax + 20} 552 V 596`} fill="#6a6252" strokeWidth={3} />)}
        <path d="M 694 520 L 775 380 L 856 520 Z" fill="#9a8a62" />
        <path d="M 775 380 V 340" strokeWidth={6} /><circle cx={775} cy={334} r={8} fill="#e3b23c" />
      </g>
      <rect x={0} y={1080} width={W} height={130} fill="#8fa7b0" stroke={INK} strokeWidth={4} />
      {[0, 1, 2, 3].map(k => <path key={k} d={`M ${((v * 60 + k * 270) % 1300) - 200} ${1110 + (k % 2) * 40} q 30 -14 60 0 t 60 0`} fill="none" stroke="#dfe9ec" strokeWidth={5} />)}
      <rect x={0} y={1210} width={W} height={46} fill="#cfc3a8" stroke={INK} strokeWidth={4} />
      <rect x={0} y={1256} width={W} height={664} fill="#b9b0a0" />
      <Lamp x={120} y={1260} /><Lamp x={960} y={1260} />
      {/* a London bus of 1914: open on top, stairs at the back */}
      <g transform={`translate(${lerp(1150, 330, easeOut(prog(v, 0, 1.4)))} 1500) scale(1.05)`}>
        <circle cx={90} cy={-50} r={52} fill="#4a2a26" stroke={INK} strokeWidth={5} /><circle cx={450} cy={-50} r={52} fill="#4a2a26" stroke={INK} strokeWidth={5} />
        {[90, 450].map(wx => Array.from({length: 8}).map((_, i) => { const a = (i / 8) * Math.PI * 2 - v * 6; return <path key={wx + '-' + i} d={`M ${wx} -50 L ${wx + Math.cos(a) * 44} ${-50 + Math.sin(a) * 44}`} stroke="#d8b48a" strokeWidth={4} />; }))}
        <path d="M 0 -170 L 120 -170 L 120 -80 L 0 -80 Q -14 -80 -14 -94 L -14 -156 Q -14 -170 0 -170 Z" fill="#b5352b" stroke={INK} strokeWidth={5} />
        {Array.from({length: 5}).map((_, i) => <path key={i} d={`M -6 ${-160 + i * 16} H 20`} stroke={INK} strokeWidth={3} />)}
        <rect x={120} y={-250} width={440} height={170} fill="#b5352b" stroke={INK} strokeWidth={5} />
        {Array.from({length: 4}).map((_, i) => <rect key={i} x={150 + i * 100} y={-226} width={72} height={70} rx={6} fill="#f3ead2" stroke={INK} strokeWidth={3.5} />)}
        <rect x={120} y={-290} width={440} height={40} fill="#e8d9a8" stroke={INK} strokeWidth={4} />
        <text x={340} y={-260} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={28} fill="#7a2a22">GENERAL</text>
        {Array.from({length: 12}).map((_, i) => <path key={i} d={`M ${130 + i * 36} -290 V -340`} stroke={INK} strokeWidth={3} />)}
        <path d="M 120 -340 H 560" stroke={INK} strokeWidth={5} />
        {[170, 260, 350, 450].map((px, i) => <g key={px}><circle cx={px} cy={-366} r={22} fill="#f4c99b" stroke={INK} strokeWidth={3.5} /><path d={`M ${px - 30} -382 L ${px + 30} -382 L ${px + 22} -400 L ${px - 22} -400 Z`} fill={['#2b2826', '#e9d59a', '#2b2826', '#6a3a5a'][i]} stroke={INK} strokeWidth={3} /></g>)}
        <path d="M 560 -90 C 620 -110, 610 -230, 560 -290" fill="none" stroke={INK} strokeWidth={6} />
        <g><circle cx={150} cy={-200} r={20} fill="#f4c99b" stroke={INK} strokeWidth={3.5} /><rect x={128} y={-226} width={44} height={12} fill="#2b2826" /></g>
      </g>
      <Person id="h3a" t={t} x={150} y={1700} s={1.05} {...HAYA} hat="bowler" mood="wow" look={6} armL={[10, 10]} armR={[20, 40]} />
    </g>
  )},
  // 3b  under London: the train he saw
  {a: T.at(3, '地下鉄') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#1f1c22" />
      <path d="M -120 1480 L -120 1000 C -120 640, 1200 640, 1200 1000 L 1200 1480 Z" fill="url(#tiles)" stroke={INK} strokeWidth={6} />
      <path d="M -120 1250 H 1200" stroke="#3e7c6a" strokeWidth={30} />
      <path d="M -60 1000 C -60 700, 1140 700, 1140 1000" fill="none" stroke="#bdb6a4" strokeWidth={8} />
      {/* the roundel of the Underground */}
      <g transform="translate(300 960)" filter="url(#dropS)"><circle r={110} fill="none" stroke="#c8302a" strokeWidth={44} /><rect x={-150} y={-30} width={300} height={60} fill="#1e3f8f" stroke={INK} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={34} fill="#fbf6ea">UNDERGROUND</text></g>
      <g filter="url(#dropS)"><rect x={600} y={880} width={180} height={240} fill="#e9d59a" stroke={INK} strokeWidth={5} /><rect x={800} y={880} width={180} height={240} fill="#a9cde0" stroke={INK} strokeWidth={5} /></g>
      <Tube x={lerp(-1500, -170, easeOut(prog(v, 0, 1.1)))} y={1470} s={1.55} />
      <rect x={0} y={1470} width={W} height={450} fill="#cfc6b4" />
      <rect x={0} y={1470} width={W} height={24} fill="#f3efe3" stroke={INK} strokeWidth={4} />
      <Person id="h3b" t={t} x={850} y={1800} s={1.2} flip {...HAYA} hat="bowler" mood="wow" look={6} armL={[60, 120]} armR={[20, 70]} holdR={<rect x={-36} y={-48} width={72} height={96} rx={6} fill="#fbf8ef" stroke={INK} strokeWidth={4} />} />
      {[0, 1, 2, 3, 4].map(i => { const a = (i / 5) * Math.PI * 2 + t * 2; return <path key={i} d={`M ${850 + Math.cos(a) * 150} ${1150 + Math.sin(a) * 120} l 0 -26 m -13 13 h 26`} stroke="#f6c543" strokeWidth={7} strokeLinecap="round" />; })}
    </g>
  )},
  // 3c  "Tokyo needs one too": his idea, in a cloud
  {a: T.at(3, '東京にも') - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#efe5cc" />
      <g transform={`translate(640 1120) scale(${pop(t, T.at(3, '東京にも'), 140)})`} filter="url(#drop)">
        <path d="M -380 120 C -470 120, -470 -80, -350 -100 C -360 -260, -140 -300, -60 -210 C 20 -320, 260 -300, 280 -160 C 420 -160, 450 60, 320 100 C 340 230, 120 290, 30 210 C -60 300, -300 270, -300 170 C -350 170, -380 150, -380 120 Z" fill="#fffdf6" stroke={INK} strokeWidth={6} />
        <clipPath id="idea"><path d="M -360 110 C -440 110, -440 -70, -330 -90 C -340 -240, -140 -280, -60 -190 C 20 -300, 250 -280, 262 -150 C 400 -150, 420 50, 300 90 C 320 210, 120 270, 30 190 C -60 280, -290 250, -290 160 C -340 160, -360 140, -360 110 Z" /></clipPath>
        <g clipPath="url(#idea)">
          <g transform="scale(0.62) translate(-540 -1080)"><UnderTokyo t={t} v={v} carX={lerp(-900, 160, easeOut(prog(v, 0.3, 1.2)))} street={760} /></g>
        </g>
        <path d="M -380 120 C -470 120, -470 -80, -350 -100 C -360 -260, -140 -300, -60 -210 C 20 -320, 260 -300, 280 -160 C 420 -160, 450 60, 320 100 C 340 230, 120 290, 30 210 C -60 300, -300 270, -300 170 C -350 170, -380 150, -380 120 Z" fill="none" stroke={INK} strokeWidth={6} />
      </g>
      {[[300, 1440, 36], [250, 1530, 24]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r * pop(t, T.at(3, '東京にも') - 0.1 + i * 0.05)} fill="#fffdf6" stroke={INK} strokeWidth={5} />)}
      <Person id="h3c" t={t} x={250} y={2160} s={1.85} {...HAYA} mood="smile" look={8} armR={[160, 178]} armL={[10, 10]} />
      <Bulb x={120} y={860} s={0.75 * pop(t, T.at(3, '東京にも') + 0.2)} t={t} />
    </g>
  )},
  // 4a  the people round him look at his plan, in doubt
  {a: T.s(4) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#e6dcc4" />
      <rect x={0} y={1380} width={W} height={540} fill="#9a6b3d" />
      <rect x={0} y={1380} width={W} height={22} fill="#7d5530" />
      <Person id="d1" t={t} x={190} y={1500} s={1.15} suit="#3a4a3a" tie="#d9a521" hat="bowler" mood="doubt" armL={[10, 10]} armR={[30, 70]} />
      <Person id="d2" t={t} x={540} y={1470} s={1.1} suit="#2f3f5a" tie="#c0392b" hairStyle="short" mood="doubt" look={4} armL={[10, 10]} armR={[10, 10]} />
      <Person id="d3" t={t} x={890} y={1500} s={1.15} flip suit="#4b3f2a" tie="#2e8b57" hat="bowler" mood="doubt" armL={[10, 10]} armR={[30, 70]} />
      <g transform="translate(540 1520) rotate(-2)" filter="url(#drop)">
        <rect x={-400} y={-200} width={800} height={400} rx={8} fill="#2f5fa8" stroke={INK} strokeWidth={6} />
        <g stroke="#eaf2fb" strokeWidth={5} fill="none">
          <path d="M -360 -30 H 360" />{[[-320, 110, 120], [-170, 90, 170], [120, 120, 100], [270, 80, 140]].map(([bx, bw, bh]) => <rect key={bx} x={bx} y={-30 - bh} width={bw} height={bh} />)}
          <rect x={-360} y={30} width={720} height={120} strokeDasharray="18 14" /><rect x={-160} y={60} width={280} height={70} rx={10} /><circle cx={-100} cy={140} r={18} /><circle cx={60} cy={140} r={18} />
        </g>
        <text y={-160} textAnchor="middle" fontFamily={MARK} fontSize={48} fill="#eaf2fb">地下鉄　計画図</text>
      </g>
      {[[330, 760], [760, 740]].map(([qx, qy], i) => <QMark key={i} x={qx} y={qy} s={0.75 * pop(t, T.s(4) + 0.3 + i * 0.15)} rot={i ? 10 : -10} />)}
    </g>
  )},
  // 4b  "the ground of Tokyo is as soft as tofu"
  {a: T.at(4, '東京') - 0.08, draw: (t, v) => {
    const sway = Math.sin(v * 9) * 30 * (0.6 + 0.4 * Math.sin(v * 2.2)), sag = easeOut(prog(t, T.at(4, 'やわらか'), 0.8));
    const poke = Math.abs(Math.sin(v * 5)) * 46;
    return (
      <g>
        <Paper c="#efe5cc" />
        <rect x={0} y={1430} width={W} height={490} fill="#9a6b3d" />
        <ellipse cx={540} cy={1470} rx={440} ry={70} fill="#e3ebef" stroke={INK} strokeWidth={6} />
        <path d={`M 250 1460 L 830 1460 L ${830 + sway} 980 Q ${540 + sway} ${950 + sag * 34} ${250 + sway} 980 Z`} fill="#fbfaf2" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${260 + sway} 990 Q ${540 + sway} ${960 + sag * 34} ${820 + sway} 990`} fill="none" stroke="#e6e2d2" strokeWidth={16} />
        <ellipse cx={540 + sway * 0.4} cy={1300 + sag * 40} rx={170} ry={78 - sag * 44} fill="#34323a" stroke={INK} strokeWidth={4} />
        <g transform={`translate(${440 + sway * 0.4} ${1330 + sag * 40}) scale(${0.32 - sag * 0.06})`}><Car x={0} y={0} s={1} id="tofu" light={false} /></g>
        <text x={540 + sway * 0.7} y={1120} textAnchor="middle" fontFamily={MARK} fontSize={72} fill={INK}>東京の地面</text>
        {[430, 520, 610].map(gx => <ellipse key={gx} cx={gx + sway} cy={972 + sag * 30} rx={24} ry={10} fill="#7fb86a" stroke={INK} strokeWidth={3} />)}
        <g transform={`translate(0 ${poke})`}><path d="M 900 760 L 790 980" stroke="#8a6a45" strokeWidth={18} strokeLinecap="round" /><ellipse cx={776} cy={1006} rx={46} ry={62} fill="#c9c3b6" stroke={INK} strokeWidth={5} /></g>
        <XMark x={540} y={1300} r={130} t={t} a={T.at(4, 'すぎる')} />
      </g>
    );
  }},
  // 4c  and they laugh: the plan goes in the bin
  {a: T.at(4, '笑い') - 0.08, draw: (t, v) => {
    const f = easeOut(prog(t, T.at(4, '笑い'), 0.7));
    return (
      <g>
        <Paper c="#e6dcc4" />
        <Person id="l1" t={t} x={190} y={1640} s={1.25} suit="#3a4a3a" tie="#d9a521" hat="bowler" mood="laugh" bob={Math.sin(t * 22) * 6} armL={[10, 10]} armR={[150, 150]} pointR />
        <Person id="l2" t={t} x={540} y={1600} s={1.2} suit="#2f3f5a" tie="#c0392b" hairStyle="short" mood="laugh" bob={Math.sin(t * 22 + 2) * 6} armL={[40, 120]} armR={[40, 120]} />
        <Person id="l3" t={t} x={890} y={1640} s={1.25} flip suit="#4b3f2a" tie="#2e8b57" hat="bowler" mood="laugh" bob={Math.sin(t * 22 + 4) * 6} armL={[10, 10]} armR={[150, 150]} pointR />
        <Haha x={300} y={780} t={t} a={T.at(4, '笑い')} rot={-10} /><Haha x={780} y={760} t={t} a={T.at(4, '笑い') + 0.1} rot={10} />
        <g transform={`translate(${lerp(540, 820, f)} ${lerp(1250, 1500, f) - Math.sin(f * Math.PI) * 300}) rotate(${f * 400})`}>
          <path d="M -70 -24 L -24 -74 L 44 -58 L 74 0 L 36 64 L -40 58 Z" fill="#2f5fa8" stroke={INK} strokeWidth={5} /><path d="M -30 -14 L 24 22 M -10 -44 L 34 -12" stroke="#eaf2fb" strokeWidth={4} />
        </g>
        <path d="M 730 1560 L 930 1560 L 905 1830 L 755 1830 Z" fill="#8d8a84" stroke={INK} strokeWidth={5} />
        {[1, 2, 3].map(i => <path key={i} d={`M ${730 + i * 50} 1568 L ${748 + i * 38} 1822`} stroke={INK} strokeWidth={3} />)}
      </g>
    );
  }},
  // 5   the money sits in a safe; the key to it is proof
  {a: T.s(5) - 0.08, draw: (t, v) => {
    const a = T.at(5, '証拠');
    return (
      <g>
        <Paper c="#e3dac6" /><rect x={0} y={1560} width={W} height={360} fill="#c9bfa8" /><path d="M 0 1560 H 1080" stroke={INK} strokeWidth={4} />
        <Shadow x={590} y={1560} w={600} />
        <g filter="url(#drop)"><rect x={330} y={820} width={520} height={740} rx={18} fill="#6f7378" stroke={INK} strokeWidth={6} />
          <rect x={366} y={856} width={448} height={668} rx={10} fill="#868d94" stroke={INK} strokeWidth={5} /></g>
        <g transform={`translate(590 1100) rotate(${v * 40})`}><circle r={100} fill="#d9d4c8" stroke={INK} strokeWidth={6} />{Array.from({length: 12}).map((_, i) => { const g = (i / 12) * Math.PI * 2; return <path key={i} d={`M ${Math.cos(g) * 70} ${Math.sin(g) * 70} L ${Math.cos(g) * 88} ${Math.sin(g) * 88}`} stroke={INK} strokeWidth={5} />; })}<circle r={34} fill="#4b4f54" stroke={INK} strokeWidth={4} /></g>
        <path d="M 565 1300 A 25 25 0 1 1 615 1300 L 605 1400 L 575 1400 Z" fill="#1c1c20" stroke={INK} strokeWidth={4} />
        <Label t={t} text="お金" x={590} y={780} size={74} a={T.s(5) + 0.1} b={T.s(5) + 0.35} font={MARK} fill="#fff3c8" bold />
        <Person id="h5" t={t} x={170} y={1700} s={1.3} {...HAYA} mood={t > a ? 'sad' : 'ok'} armR={[60, 80]} armL={[10, 10]} look={6} />
        {t > a - 0.08 && <g transform={`translate(920 ${1080 + Math.sin(t * 3) * 10}) rotate(18) scale(${pop(t, a - 0.08)})`}>
          <g fill="rgba(255,246,207,0.9)" stroke={RED} strokeWidth={9} strokeDasharray="22 16"><circle cx={0} cy={-170} r={84} /><rect x={-22} y={-86} width={44} height={300} /><rect x={22} y={140} width={70} height={36} /><rect x={22} y={190} width={50} height={36} /></g>
          <text x={0} y={-140} textAnchor="middle" fontFamily={MARK} fontSize={96} fill={RED}>？</text>
        </g>}
        <Stamp t={t} text="証拠" x={860} y={1420} size={104} a={a + 0.15} rot={-8} />
      </g>
    );
  }},
  // 6a  the city office of Tokyo
  {a: T.s(6) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1500} />
      <Cloud x={230 + v * 16} y={720} />
      <Shadow x={540} y={1500} w={980} o={0.2} />
      <g filter="url(#drop)">
        <path d="M 80 900 L 540 700 L 1000 900 Z" fill="#c9bfa8" stroke={INK} strokeWidth={6} />
        <rect x={120} y={900} width={840} height={600} fill="#e4dccb" stroke={INK} strokeWidth={6} />
        {Array.from({length: 6}).map((_, i) => <rect key={i} x={170 + i * 130} y={960} width={60} height={440} fill="#f3eee2" stroke={INK} strokeWidth={4} />)}
        <rect x={340} y={780} width={400} height={96} fill="#1f4d3a" stroke={INK} strokeWidth={5} />
        <text x={540} y={846} textAnchor="middle" fontFamily={MARK} fontSize={68} fill="#f3e9c6">東京市役所</text>
        <rect x={470} y={1250} width={140} height={250} fill="#6b5a44" stroke={INK} strokeWidth={5} />
      </g>
      <rect x={0} y={1500} width={W} height={420} fill="#b9b0a0" /><path d="M 0 1500 H 1080" stroke={INK} strokeWidth={4} />
      <Person id="h6" t={t} x={lerp(-80, 330, easeOut(prog(v, 0, 1.0)))} y={1660} s={1.15} {...HAYA} hat="bowler" mood="ok" armL={[10, 10]} armR={[20, 40]} legs={[Math.sin(v * 9) * 20 * (1 - prog(v, 0.8, 0.2)), -Math.sin(v * 9) * 20 * (1 - prog(v, 0.8, 0.2))]} />
    </g>
  )},
  // 6b  the book that should hold the counts of people: empty
  {a: T.at(6, '人の流れ') - 0.08, draw: (t, v) => {
    const none = T.at(6, 'ありません');
    const gx = 540 + Math.sin(v * 3.2) * 240, gy = 1180 + Math.cos(v * 2.4) * 110;
    return (
      <g>
        <Paper c="#9a6b3d" />
        <g filter="url(#drop)"><rect x={100} y={800} width={880} height={660} rx={14} fill="#6b4a2e" stroke={INK} strokeWidth={6} />
          <path d="M 130 830 H 530 V 1430 H 130 Z" fill="#fbf8ef" stroke={INK} strokeWidth={5} /><path d="M 550 830 H 950 V 1430 H 550 Z" fill="#fbf8ef" stroke={INK} strokeWidth={5} /></g>
        <text x={330} y={910} textAnchor="middle" fontFamily={MARK} fontSize={58} fill={INK}>人の流れ</text><text x={750} y={910} textAnchor="middle" fontFamily={MARK} fontSize={58} fill={INK}>調べ</text>
        {Array.from({length: 6}).map((_, r) => <g key={r}><path d={`M 160 ${980 + r * 72} H 500`} stroke="#b9c2cb" strokeWidth={3} /><path d={`M 580 ${980 + r * 72} H 920`} stroke="#b9c2cb" strokeWidth={3} /></g>)}
        {[270, 390, 680, 800].map(x => <path key={x} d={`M ${x} 950 V 1400`} stroke="#b9c2cb" strokeWidth={3} />)}
        {t < none && <g><path d={`M ${gx + 80} ${gy + 80} L ${gx + 190} ${gy + 190}`} stroke="#5a3d22" strokeWidth={28} strokeLinecap="round" /><circle cx={gx} cy={gy} r={110} fill="rgba(207,230,243,0.5)" stroke={INK} strokeWidth={12} /></g>}
        <Stamp t={t} text="なし" x={540} y={1140} size={220} a={none} rot={-10} />
      </g>
    );
  }},
  // 7a  he stands at the crossing of Ginza
  {a: T.s(7) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#9fc8e2" bottom="#efe9d6" y1={1260} />
      <Shop x={-40} y={1260} w={300} h={520} c="#b5553c" sign="時計" />
      <Shop x={270} y={1260} w={270} h={460} c="#c98a5a" awning="url(#stripesG)" />
      <Shop x={550} y={1260} w={260} h={540} c="#8f5a44" sign="呉服" />
      <Shop x={820} y={1260} w={300} h={480} c="#b5553c" awning="url(#stripesG)" />
      <Street y={1260} h={660} />
      <Tram x={lerp(1150, -600, prog(v, 0, 3.4))} y={1420} s={0.9} />
      {[0, 1, 2].map(i => { const q = (v * 0.2 + i * 0.33) % 1; return <Person key={i} id={'g' + i} t={t} x={lerp(1200, 360, q)} y={1530 + i * 20} s={0.62} flip suit={['#7a3b4a', '#2f3f5a', '#3f8f7a'][i]} hat={i === 1 ? 'bowler' : null} hairStyle="short" legs={[Math.sin(v * 9 + i) * 22, -Math.sin(v * 9 + i) * 22]} />; })}
      <Person id="h7" t={t} x={200} y={1760} s={1.25} {...HAYA} hat="bowler" mood="ok" look={7} armL={[10, 10]} armR={[30, 60]} />
    </g>
  )},
  // 7b  his two pockets: one bean across for every one who passes
  {a: T.at(7, 'ポケット') - 0.08, draw: (t, v) => {
    const a = T.at(7, '豆'), step = 0.36;
    const count = t < a ? 0 : Math.floor((t - a) / step) + 1;
    const f = ((t - a) % step) / step;
    return (
      <g>
        <Paper c="#e6dcc4" />
        <path d="M 60 1920 L 60 860 C 60 740, 300 680, 420 668 L 540 830 L 660 668 C 780 680, 1020 740, 1020 860 L 1020 1920 Z" fill="#6b4c32" stroke={INK} strokeWidth={6} />
        <path d="M 420 668 L 660 668 L 540 830 Z" fill="#fbfaf4" stroke={INK} strokeWidth={5} />
        <path d="M 516 700 L 564 700 L 574 880 L 540 930 L 506 880 Z" fill="#2e6b4f" stroke={INK} strokeWidth={5} />
        <path d="M 420 668 L 540 830 L 470 1040 L 290 760 Z" fill="#5a3f28" stroke={INK} strokeWidth={5} /><path d="M 660 668 L 540 830 L 610 1040 L 790 760 Z" fill="#5a3f28" stroke={INK} strokeWidth={5} />
        {[1150, 1320, 1490].map(by => <circle key={by} cx={540} cy={by} r={34} fill="#3a2c22" stroke={INK} strokeWidth={4} />)}
        {[[130, 'l', clamp(9 - count, 0, 9)], [670, 'r', clamp(count - 1, 0, 9)]].map(([px, id, n]) => (
          <g key={id as string}>
            {Array.from({length: n as number}).map((_, i) => <Bean key={i} x={(px as number) + 56 + (i % 5) * 46} y={1186 - Math.floor(i / 5) * 30 + (i % 2) * 8} dark={i % 2 === 0} s={2.0} />)}
            <path d={`M ${px} 1190 L ${(px as number) + 280} 1190 L ${(px as number) + 268} 1490 Q ${(px as number) + 140} 1530 ${(px as number) + 12} 1490 Z`} fill="#7a5c3e" stroke={INK} strokeWidth={6} />
            <path d={`M ${px} 1236 H ${(px as number) + 280}`} stroke="#3a2c22" strokeWidth={4} />
          </g>
        ))}
        {count > 0 && count <= 10 && <Bean x={lerp(270, 810, f)} y={1140 - Math.sin(f * Math.PI) * 280} dark={count % 2 === 1} s={2.6} />}
        <path d="M 280 1110 Q 540 720 800 1110" fill="none" stroke={RED} strokeWidth={8} strokeDasharray="20 16" />
        <Label t={t} text="左ポケット" x={270} y={1600} size={46} a={a - 0.3} b={a - 0.1} /><Label t={t} text="右ポケット" x={810} y={1600} size={46} a={a - 0.2} b={a} />
      </g>
    );
  }},
  // 7c  one who passes = one bean
  {a: T.at(7, '通る') - 0.08, draw: (t, v) => {
    const pass = T.at(7, '通る') - 0.08;
    let tally = 0;
    const walkers = Array.from({length: 8}).map((_, i) => {
      const c = pass + 0.2 + i * 0.36, x = 540 + (t - c) * 560;
      if (t >= c) tally++;
      return {i, c, x};
    });
    return (
      <g>
        <Sky top="#9fc8e2" bottom="#efe9d6" y1={1150} />
        <Shop x={-40} y={1150} w={360} h={420} c="#b5553c" /><Shop x={330} y={1150} w={380} h={380} c="#c98a5a" awning="url(#stripesG)" /><Shop x={720} y={1150} w={400} h={440} c="#8f5a44" />
        <Street y={1150} h={770} />
        <path d="M 540 700 V 1270" stroke={RED} strokeWidth={8} strokeDasharray="22 18" />
        {walkers.map(({i, c, x}) => x > -160 && x < 1240 ? <Person key={i} id={'pw' + i} t={t} x={x} y={1260} s={0.95} suit={['#3a4a3a', '#7a3b4a', '#2f3f5a', '#4b3f2a', '#3f8f7a'][i % 5]} hat={i % 3 === 0 ? 'bowler' : i % 3 === 1 ? 'boater' : null} hairStyle="short" legs={[Math.sin(v * 9 + i) * 24, -Math.sin(v * 9 + i) * 24]} /> : null)}
        {walkers.map(({i, c}) => { const f = prog(t, c, 0.3); return f > 0 && f < 1 ? <Bean key={'b' + i} x={540} y={lerp(1180, 1440, f)} dark={i % 2 === 0} s={2.2} /> : null; })}
        <path d="M 360 1430 L 720 1430 L 706 1680 Q 540 1730 374 1680 Z" fill="#7a5c3e" stroke={INK} strokeWidth={6} /><path d="M 360 1480 H 720" stroke="#3a2c22" strokeWidth={4} />
        {Array.from({length: Math.min(tally, 8)}).map((_, i) => <Bean key={i} x={420 + (i % 5) * 60} y={1426 - Math.floor(i / 5) * 30} dark={i % 2 === 0} s={2.0} />)}
        {tally > 0 && <g transform={`translate(880 1500) scale(${pop(t, pass + 0.2)})`} filter="url(#dropS)"><rect x={-110} y={-80} width={220} height={160} rx={16} fill="#fff6cf" stroke={INK} strokeWidth={6} /><text y={36} textAnchor="middle" fontFamily={MARK} fontSize={100} fill={INK}>{tally}人</text></g>}
      </g>
    );
  }},
  // 8a  the opening day: flags at the entrance, people going down
  {a: T.s(8) - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1300} />
      <Shop x={-40} y={1300} w={340} h={460} c="#b5553c" /><Shop x={560} y={1300} w={260} h={380} c="#8f5a44" /><Shop x={830} y={1300} w={300} h={500} c="#c98a5a" awning="url(#stripesG)" />
      <Street y={1300} h={620} />
      <Bunting y={980} />
      <g transform="translate(760 1600)">
        <rect x={-190} y={-40} width={380} height={40} fill="#b9b3a6" stroke={INK} strokeWidth={5} />
        <path d="M -160 -40 L 160 -40 L 130 -10 L -130 -10 Z" fill="#2a2620" stroke={INK} strokeWidth={4} />
        <path d="M -180 -40 V -320 M 180 -40 V -320" stroke={INK} strokeWidth={12} />
        <g filter="url(#dropS)"><rect x={-220} y={-430} width={440} height={110} rx={8} fill="#1f4d3a" stroke={INK} strokeWidth={6} /><text y={-354} textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#f3e9c6">地下鉄</text></g>
      </g>
      {[0, 1, 2].map(i => { const q = (v * 0.35 + i * 0.3) % 1; return <Person key={i} id={'o8' + i} t={t} x={lerp(120, 650, q)} y={1580 - i * 10} s={0.85} suit={['#7a3b4a', '#2f3f5a', '#3f8f7a'][i]} hat={i === 0 ? 'bowler' : null} hairStyle="short" mood="smile" legs={[Math.sin(v * 9 + i) * 22, -Math.sin(v * 9 + i) * 22]} />; })}
      <Calendar x={280} y={760} s={1.0 * pop(t, T.s(8))} year="1927" top="12月30日" />
    </g>
  )},
  // 8b  from Ueno to Asakusa, under the ground
  {a: T.at(8, '上野') - 0.08, draw: (t, v) => {
    const q = easeInOut(prog(t, T.at(8, '浅草'), 0.9));
    return (
      <g>
        <Sky top="#a9cfe6" bottom="#efe9d6" y1={960} />
        <Shop x={330} y={960} w={200} h={260} c="#b5553c" /><Shop x={540} y={960} w={220} h={300} c="#c98a5a" />
        <Street y={960} h={60} />
        <Soil y1={1020} y2={1920} />
        <rect x={60} y={1180} width={960} height={240} fill="#34323a" stroke={INK} strokeWidth={6} />
        <path d="M 60 1404 H 1020" stroke="#b9b6ae" strokeWidth={6} />
        {[[190, '上野', T.at(8, '上野')], [890, '浅草', T.at(8, '浅草')]].map(([x, name, a], i) => (
          <g key={i}>
            <rect x={(x as number) - 50} y={960} width={100} height={220} fill="#34323a" stroke={INK} strokeWidth={5} />
            {Array.from({length: 5}).map((_, k) => <path key={k} d={`M ${(x as number) - 44} ${990 + k * 40} H ${(x as number) + 44}`} stroke="#8d8a84" strokeWidth={4} />)}
            <g transform={`translate(${x} 960) scale(${pop(t, a as number)})`} filter="url(#dropS)"><path d="M 0 0 V -120" stroke={INK} strokeWidth={9} /><rect x={-150} y={-270} width={300} height={150} rx={10} fill="#fbf7ee" stroke={INK} strokeWidth={6} /><text y={-170} textAnchor="middle" fontFamily={MARK} fontSize={100} fill={INK}>{name}</text></g>
          </g>
        ))}
        <path d={`M 190 1300 H ${lerp(190, 890, q)}`} stroke={RED} strokeWidth={14} strokeDasharray="28 22" strokeLinecap="round" />
        <g transform={`translate(${lerp(140, 640, q)} 1400) scale(0.42)`}><Car x={0} y={0} s={1} id="ua" /></g>
      </g>
    );
  }},
  // 8c  the first run: the platform cheers
  {a: T.at(8, '東洋') - 0.08, draw: (t, v) => (
    <g>
      <rect x={0} y={0} width={W} height={1330} fill="url(#tiles)" />
      <rect x={0} y={530} width={W} height={50} fill="#6d6a68" stroke={INK} strokeWidth={5} />
      <g filter="url(#dropS)"><rect x={150} y={600} width={780} height={130} fill="#fbf7ee" stroke={INK} strokeWidth={6} /><rect x={150} y={600} width={780} height={22} fill={RED} /><rect x={150} y={708} width={780} height={22} fill={RED} />
        <text x={540} y={692} textAnchor="middle" fontFamily={MARK} fontSize={78} fill={RED}>祝　開通</text></g>
      <Car x={lerp(-1400, -170, easeOut(prog(v, 0, 1.1))) + v * 12} y={1330} s={1.9} id="o8" />
      <rect x={0} y={1330} width={W} height={590} fill="#cfc6b4" /><rect x={0} y={1330} width={W} height={24} fill="#f3efe3" stroke={INK} strokeWidth={4} />
      {[[170, '#3a4a3a', '#d9a521', 'bowler'], [540, '#7a3b4a', '#3d74c4', null], [910, '#4b3f2a', '#2e8b57', 'boater']].map(([x, suit, tie, hat], i) => <g key={i}><Flag x={(x as number) + 120} y={1500} t={t} i={i} /><Person id={'c8' + i} t={t} x={x as number} y={1960} s={1.05} suit={suit as string} tie={tie as string} hat={hat as 'bowler' | 'boater' | null} hairStyle="short" mood="laugh" bob={Math.sin(t * 14 + i * 2) * 8} armL={[10, 10]} armR={[150, 160]} /></g>)}
      <Confetti t={t} id="c8" y0={600} h={900} />
    </g>
  )},
  // 9a  only 2.2 km: the whole line fits on a ruler
  {a: T.s(9) - 0.08, draw: (t, v) => {
    const a = T.at(9, '2.2'), q = easeOut(prog(v, 0.1, 0.8));
    return (
      <g>
        <Paper c="#9a6b3d" />
        <g filter="url(#drop)"><rect x={100} y={1120} width={880} height={240} rx={10} fill="#f2d77a" stroke={INK} strokeWidth={6} /></g>
        {Array.from({length: 23}).map((_, i) => <path key={i} d={`M ${140 + i * 36} 1120 V ${1120 + (i % 10 === 0 ? 96 : i % 5 === 0 ? 68 : 42)}`} stroke={INK} strokeWidth={4} />)}
        {[['0', 140], ['1', 500], ['2', 860]].map(([n, x]) => <text key={n} x={x as number} y={1290} textAnchor="middle" fontFamily={MARK} fontSize={56} fill={INK}>{n}</text>)}
        <text x={940} y={1330} textAnchor="middle" fontFamily={MARK} fontSize={40} fill={INK}>km</text>
        <path d={`M 140 1030 H ${lerp(140, 932, q)}`} stroke="#f39700" strokeWidth={30} strokeLinecap="round" />
        <circle cx={140} cy={1030} r={36} fill="#fbf7ee" stroke={INK} strokeWidth={6} />{q > 0.98 && <circle cx={932} cy={1030} r={36} fill="#fbf7ee" stroke={INK} strokeWidth={6} />}
        <text x={140} y={940} textAnchor="middle" fontFamily={MARK} fontSize={64} fill="#fbf7ee" stroke={INK} strokeWidth={8} paintOrder="stroke">上野</text>
        {q > 0.98 && <text x={932} y={940} textAnchor="middle" fontFamily={MARK} fontSize={64} fill="#fbf7ee" stroke={INK} strokeWidth={8} paintOrder="stroke">浅草</text>}
        <g transform={`translate(${lerp(100, 700, q)} 1022) scale(0.28)`}><Car x={0} y={0} s={1} id="r9" light={false} /></g>
        <Label t={t} text="たった2.2キロ" x={540} y={760} size={100} a={a} b={a + 0.25} fill="#fff6cf" color={RED} bold />
      </g>
    );
  }},
  // 9b  the first day: a line that winds and winds
  {a: T.at(9, '初日') - 0.08, draw: (t, v) => {
    const q = T.at(9, '1時間');
    const pts: number[][] = [];
    for (let x = 780; x >= 140; x -= 92) pts.push([x, 1150]);
    for (let x = 140; x <= 940; x += 92) pts.push([x, 1380]);
    for (let x = 940; x >= 140; x -= 92) pts.push([x, 1610]);
    const shown = Math.ceil(pts.length * easeOut(prog(v, 0, 1.2)));
    return (
      <g>
        <rect x={0} y={0} width={W} height={H} fill="#b9b0a0" />
        <g transform="translate(900 1150) scale(0.7)">
          <path d="M -180 -40 V -320 M 180 -40 V -320" stroke={INK} strokeWidth={12} /><rect x={-190} y={-40} width={380} height={40} fill="#2a2620" stroke={INK} strokeWidth={5} />
          <rect x={-220} y={-430} width={440} height={110} rx={8} fill="#1f4d3a" stroke={INK} strokeWidth={6} /><text y={-354} textAnchor="middle" fontFamily={MARK} fontSize={70} fill="#f3e9c6">地下鉄</text>
        </g>
        {pts.slice(0, shown).map(([x, y], i) => <Person key={i} id={'q9' + i} t={t} x={x} y={y} s={0.42} flip={y === 1380} suit={['#7a3b4a', '#3a4a3a', '#2f3f5a', '#4b3f2a', '#3f8f7a', '#4a3636'][i % 6]} hat={i % 4 === 0 ? 'bowler' : i % 4 === 2 ? 'boater' : null} hairStyle="short" mood={i % 3 === 0 ? 'doubt' : 'ok'} bob={Math.sin(t * 4 + i) * 3} noShadow />)}
        <g transform={`translate(230 790) scale(${pop(t, q)})`} filter="url(#drop)">
          <circle r={130} fill="#fbf7ee" stroke={INK} strokeWidth={8} />
          <path d={`M 0 0 L 0 -112 A 112 112 0 ${prog(t, q, 0.8) > 0.5 ? 1 : 0} 1 ${Math.sin(prog(t, q, 0.8) * 6.283) * 112} ${-Math.cos(prog(t, q, 0.8) * 6.283) * 112} Z`} fill="rgba(207,46,35,0.35)" />
          <path d="M 0 0 V -86" stroke={INK} strokeWidth={9} strokeLinecap="round" /><path d={`M 0 0 L ${Math.sin(prog(t, q, 0.8) * 6.283) * 104} ${-Math.cos(prog(t, q, 0.8) * 6.283) * 104}`} stroke={RED} strokeWidth={7} strokeLinecap="round" />
        </g>
        <Stamp t={t} text="1時間待ち" x={640} y={790} size={96} a={q + 0.1} rot={-6} />
      </g>
    );
  }},
  // 10a  thirteen years again: 1927 → 1940
  {a: T.s(10) - 0.08, draw: (t, v) => (
    <g>
      <UnderTokyo t={t} v={v} carX={((v * 1500) % 2200) - 900} />
      <YearFlip t={t} a={T.s(10)} b={T.to(10, '13年後')} from={1927} to={1940} x={540} y={760} s={1.15} small="13年後" />
    </g>
  )},
  // 10b  the rival railway looms over his company
  {a: T.at(10, 'ライバル') - 0.08, draw: (t, v) => {
    const k = easeOut(prog(v, 0, 0.5));
    return (
      <g>
        <Paper c="#ddd3bd" /><rect x={0} y={1600} width={W} height={320} fill="#b9b0a0" /><path d="M 0 1600 H 1080" stroke={INK} strokeWidth={4} />
        <Shadow x={290} y={1600} w={420} />
        <g filter="url(#drop)"><rect x={90} y={1100} width={400} height={500} fill="#f2d77a" stroke={INK} strokeWidth={6} />
          {Array.from({length: 4}).map((_, r) => Array.from({length: 3}).map((_, c) => <rect key={r + '-' + c} x={130 + c * 118} y={1190 + r * 100} width={70} height={64} fill="#cfe6f0" stroke={INK} strokeWidth={4} />))}
          <rect x={80} y={1040} width={420} height={90} rx={8} fill="#fbf7ee" stroke={INK} strokeWidth={6} /><text x={290} y={1104} textAnchor="middle" fontFamily={MARK} fontSize={58} fill={INK}>早川の会社</text></g>
        <Shade x={lerp(1400, 800, k)} y={980} s={1.35} />
        <path d={`M ${lerp(1300, 760, k)} 1330 L ${lerp(1200, 600, k)} 1300`} stroke="#2a2a2e" strokeWidth={80} strokeLinecap="round" />
        <Glove x={lerp(1180, 560, k)} y={1296} s={0.9} rot={180} />
        <Label t={t} text="ライバルの鉄道会社" x={760} y={1500} size={50} a={T.at(10, 'ライバル') + 0.3} b={T.to(10, '会社が')} fill="#2a2a2e" color="#f3e9c6" />
      </g>
    );
  }},
  // 10c  the shares of his company, taken slice by slice
  {a: T.at(10, '早川の') - 0.08, draw: (t, v) => {
    const a = T.at(10, '株');
    const cx = 470, cy = 1090, r = 300, n = 12;
    return (
      <g>
        <Paper c="#ddd3bd" />
        <g filter="url(#drop)">{Array.from({length: n}).map((_, i) => {
          const taken = i < 4 ? easeOut(prog(t, a + i * 0.26, 0.4)) : 0;
          const a0 = -Math.PI / 2 + (i * 2 * Math.PI) / n, a1 = a0 + (2 * Math.PI) / n, mid = (a0 + a1) / 2;
          const ox = Math.cos(mid) * taken * 30 + taken * 170, oy = Math.sin(mid) * taken * 30 - taken * 50;
          return <path key={i} d={`M ${cx + ox} ${cy + oy} L ${cx + ox + Math.cos(a0) * r} ${cy + oy + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${cx + ox + Math.cos(a1) * r} ${cy + oy + Math.sin(a1) * r} Z`} fill={taken > 0.5 ? '#2a2a2e' : '#f2c230'} stroke={INK} strokeWidth={5} strokeLinejoin="round" />;
        })}</g>
        <circle cx={cx} cy={cy} r={96} fill="#fbf7ee" stroke={INK} strokeWidth={5} /><text x={cx} y={cy + 44} textAnchor="middle" fontFamily={MARK} fontSize={124} fill="#3d74c4">株</text>
        <text x={cx} y={cy + 380} textAnchor="middle" fontFamily={MARK} fontSize={58} fill={INK}>早川の会社</text>
        <path d="M 1160 820 L 960 900" stroke="#2a2a2e" strokeWidth={84} strokeLinecap="round" />
        <Glove x={900} y={920} s={0.95} rot={200 + Math.sin(t * 5) * 4} />
        <Person id="h10" t={t} x={140} y={1720} s={1.15} {...OLD} mood={t > a ? 'wow' : 'doubt'} armL={[10, 10]} armR={t > a ? [150, 170] : [10, 10]} />
      </g>
    );
  }},
  // 11a  the president's chair is empty, the name plate falls
  {a: T.s(11) - 0.08, draw: (t, v) => {
    const a = T.at(11, '退き'), f = easeOut(prog(t, a, 0.6));
    return (
      <g>
        <Paper c="#ddd3bd" /><rect x={0} y={1560} width={W} height={360} fill="#a88a62" /><path d="M 0 1560 H 1080" stroke={INK} strokeWidth={4} />
        <rect x={280} y={640} width={520} height={360} fill="#f3eee2" stroke={INK} strokeWidth={6} /><path d="M 540 640 V 1000 M 280 820 H 800" stroke={INK} strokeWidth={4} />
        <g filter="url(#drop)"><path d="M 380 1240 L 380 880 Q 380 800 460 800 L 620 800 Q 700 800 700 880 L 700 1240 Z" fill="#8c2f25" stroke={INK} strokeWidth={6} /></g>
        <circle cx={540} cy={960} r={70} fill="none" stroke={INK} strokeWidth={6} strokeDasharray="18 14" /><path d="M 470 1140 C 470 1040, 610 1040, 610 1140" fill="none" stroke={INK} strokeWidth={6} strokeDasharray="18 14" />
        <g filter="url(#drop)"><rect x={140} y={1210} width={800} height={60} fill="#9a6b3d" stroke={INK} strokeWidth={6} /><rect x={180} y={1270} width={720} height={290} fill="#7a5230" stroke={INK} strokeWidth={6} /></g>
        <g transform={`translate(${lerp(540, 280, f)} ${lerp(1210, 1560, f * f)}) rotate(${-f * 80})`}><path d="M -180 0 L 180 0 L 150 -120 L -150 -120 Z" fill="#fbf7ee" stroke={INK} strokeWidth={6} /><text y={-38} textAnchor="middle" fontFamily={MARK} fontSize={90} fill={INK}>社長</text></g>
        <Person id="h11" t={t} x={lerp(760, 960, prog(v, 0.3, 1.6))} y={1760} s={1.2} {...OLD} mood="sad" look={-5} armL={[10, 10]} armR={[12, 8]} holdR={<g><rect x={-40} y={6} width={80} height={60} rx={6} fill="#7a5230" stroke={INK} strokeWidth={4} /><path d="M -16 8 Q 0 -10 16 8" fill="none" stroke={INK} strokeWidth={4} /></g>} />
      </g>
    );
  }},
  // 11b  he walks away above; under the ground his train runs on without him
  {a: T.at(11, '自分が') - 0.08, draw: (t, v) => (
    <g>
      <UnderTokyo t={t} v={v} carX={lerp(-400, 520, prog(v, 0, 2.0))} />
      <Person id="h11b" t={t} x={lerp(560, 160, prog(v, 0, 2.2))} y={940} s={0.58} flip {...OLD} mood="sad" armL={[10, 10]} armR={[12, 8]} legs={[Math.sin(v * 7) * 20, -Math.sin(v * 7) * 20]} holdR={<rect x={-40} y={6} width={80} height={60} rx={6} fill="#7a5230" stroke={INK} strokeWidth={4} />} />
    </g>
  )},
  // 12  two years later he died, at 61
  {a: T.s(12) - 0.08, draw: (t, v) => (
    <g>
      <rect x={0} y={0} width={W} height={1560} fill="#e3d6b6" /><rect x={0} y={1560} width={W} height={360} fill="#c9c58e" /><path d="M 0 1560 H 1080" stroke={INK} strokeWidth={4} />
      <g filter="url(#drop)">
        <rect x={250} y={660} width={580} height={760} fill="#6b5a44" stroke={INK} strokeWidth={6} />
        <rect x={296} y={706} width={488} height={668} fill="#e9dfc8" stroke={INK} strokeWidth={4} />
        <clipPath id="memo"><rect x={300} y={710} width={480} height={660} /></clipPath>
        <g clipPath="url(#memo)" filter="url(#sepia)"><rect x={300} y={710} width={480} height={660} fill="#dccaa3" /><Person id="m12" t={t} x={540} y={1900} s={1.45} {...OLD} mood="ok" noShadow armL={[8, 8]} armR={[8, 8]} /></g>
        <path d="M 250 660 L 420 660 L 250 830 Z" fill="#1d1a16" /><path d="M 830 660 L 660 660 L 830 830 Z" fill="#1d1a16" />
      </g>
      <Flowers x={130} y={1560} s={1.0} /><Flowers x={950} y={1560} s={1.0} />
    </g>
  )},
  // 13a  from one short line to a whole net
  {a: T.s(13) - 0.08, draw: (t, v) => (
    <g>
      <Paper c="#efe5cc" />
      <MetroNet p={prog(v, 0.35, 1.2)} />
      <path d="M 60 760 H 420" stroke={INK} strokeWidth={44} strokeLinecap="round" /><path d="M 60 760 H 420" stroke="#f39700" strokeWidth={32} strokeLinecap="round" />
      {v < 1 && <text x={260} y={690} textAnchor="middle" fontFamily={MARK} fontSize={52} fill={INK} stroke="#fbf7ee" strokeWidth={12} paintOrder="stroke" opacity={1 - prog(v, 0.6, 0.3)}>最初は、これだけ</text>}
    </g>
  )},
  // 13b  a full train, a sea of heads
  {a: T.at(13, '毎日') - 0.08, draw: (t, v) => (
    <g>
      <rect x={0} y={0} width={W} height={H} fill="url(#tiles)" />
      <g filter="url(#drop)"><path d="M 230 1400 L 230 860 Q 230 740 350 740 L 730 740 Q 850 740 850 860 L 850 1400 Z" fill="#e3e7ea" stroke={INK} strokeWidth={6} />
        <rect x={290} y={800} width={500} height={260} rx={16} fill="#bfe0f0" stroke={INK} strokeWidth={5} /><rect x={230} y={1110} width={620} height={90} fill="#f39700" stroke={INK} strokeWidth={5} />
        <circle cx={330} cy={1300} r={46} fill="#fff3c2" stroke={INK} strokeWidth={4} /><circle cx={750} cy={1300} r={46} fill="#fff3c2" stroke={INK} strokeWidth={4} /></g>
      {[0, 1, 2, 3, 4].map(i => <circle key={i} cx={350 + i * 95} cy={960 + (i % 2) * 16} r={40} fill={SKIN} stroke={INK} strokeWidth={4} />)}
      {Array.from({length: 3}).map((_, row) => Array.from({length: 9}).map((_, i) => { const k = row * 9 + i, x = 40 + i * 128 + (row % 2) * 60, y = 1480 + row * 90 + Math.sin(t * 5 + k) * 5; return <g key={k}><circle cx={x} cy={y} r={58} fill={SKIN} stroke={INK} strokeWidth={4} /><path d={`M ${x - 58} ${y - 8} C ${x - 62} ${y - 84}, ${x + 62} ${y - 84}, ${x + 58} ${y - 8} C ${x + 30} ${y - 40}, ${x - 30} ${y - 40}, ${x - 58} ${y - 8} Z`} fill={['#2b2622', '#4a3b2e', '#6b5a44', '#8d8a84'][k % 4]} stroke={INK} strokeWidth={3} /></g>; }))}
      <Stamp t={t} text="何百万人" x={540} y={1260} size={150} a={T.at(13, '何百万')} rot={-7} />
      <Label t={t} text="毎日" x={230} y={1040} size={72} a={T.at(13, '毎日')} b={T.at(13, '毎日') + 0.2} font={MARK} fill="#fff6cf" rot={-6} />
    </g>
  )},
  // 14a  a station of today: the orange line, the calendar of 2027
  {a: T.s(14) - 0.08, draw: (t, v) => (
    <g>
      <rect x={0} y={0} width={W} height={1300} fill="url(#tiles)" />
      <rect x={0} y={1180} width={W} height={80} fill="#f39700" stroke={INK} strokeWidth={5} />
      <rect x={0} y={1300} width={W} height={620} fill="#cfc8ba" /><rect x={0} y={1300} width={W} height={18} fill="#f2c230" stroke={INK} strokeWidth={3} />
      {[110, 240, 840, 970].map((x, i) => <Person key={i} id={'w14' + i} t={t} x={x} y={1560} s={0.95} flip={i > 1} suit={['#3a4a3a', '#7a3b4a', '#2f3f5a', '#3f8f7a'][i]} hairStyle="short" mood="ok" bob={Math.sin(t * 5 + i) * 2} />)}
      <Calendar x={540} y={880} s={1.3 * pop(t, T.s(14))} year="2027" />
    </g>
  )},
  // 14b  the first line turns 100
  {a: T.at(14, 'あの') - 0.08, draw: (t, v) => (
    <g>
      <Sky top="#a9cfe6" bottom="#efe9d6" y1={1060} />
      {[[150, '上野'], [930, '浅草']].map(([x, name]) => <g key={name as string} filter="url(#dropS)"><rect x={(x as number) - 120} y={640} width={240} height={110} rx={10} fill="#fbf7ee" stroke={INK} strokeWidth={6} /><text x={x as number} y={720} textAnchor="middle" fontFamily={MARK} fontSize={76} fill={INK}>{name}</text></g>)}
      <rect x={0} y={1060} width={W} height={860} fill="#e7d9b8" /><path d="M 0 1060 H 1080" stroke="#b9b6ae" strokeWidth={8} />
      <Car x={lerp(-900, 220, easeOut(prog(v, 0, 1.0)))} y={1060} s={1.0} id="b14" />
      <Cake x={540} y={1640} s={1.45 * pop(t, T.at(14, '100歳') - 0.2)} t={t} />
      {t > T.at(14, '100歳') && <Confetti t={t} id="c14" y0={620} h={800} />}
    </g>
  )},
  // 15  the answer he counted with beans was right
  {a: T.s(15) - 0.08, draw: (t, v) => {
    const a = T.at(15, 'まちがって'), k = prog(t, a, 0.5), off = easeOut(prog(t, a + 0.25, 0.5));
    return (
      <g>
        <Sky top="#f3c58e" bottom="#f6e6c6" y1={H} />
        <MetroNet p={1} o={0.22} />
        <rect x={0} y={1580} width={W} height={340} fill="#d9b98a" /><path d="M 0 1580 H 1080" stroke={INK} strokeWidth={4} />
        {k > 0 && <path d={`M 540 760 A 430 430 0 ${easeOut(k) > 0.5 ? 1 : 0} 1 ${540 + Math.sin(easeOut(k) * 6.2) * 430} ${1190 - Math.cos(easeOut(k) * 6.2) * 430}`} fill="none" stroke={RED} strokeWidth={34} strokeLinecap="round" />}
        <Person id="h15" t={t} x={540} y={1700} s={1.6} {...HAYA} mood="smile" armL={[10, 10]} armR={[100, 150]} holdR={<g transform="translate(10 -40)">{[[-20, 0, true], [16, -10, false], [46, 4, true]].map(([bx, by, d], i) => <Bean key={i} x={bx as number} y={(by as number) + Math.sin(t * 4 + i) * 5} dark={d as boolean} s={2.0} />)}</g>} />
        <Person id="lf1" t={t} x={130} y={1900} s={0.9} suit="#3a4a3a" tie="#d9a521" hat="bowler" mood={t > a ? 'wow' : 'laugh'} armL={[10, 10]} armR={[10, 10]} />
        <Person id="lf2" t={t} x={960} y={1900} s={0.9} flip suit="#4a3636" tie="#3d74c4" hairStyle="short" mood={t > a ? 'wow' : 'laugh'} armL={[10, 10]} armR={[10, 10]} />
        {off < 1 && <g opacity={1 - off} transform={`translate(${-off * 60} ${off * off * 500})`}><Label t={t} text="ほら吹き" x={540} y={720} size={84} a={0} still font={MARK} fill="#fff3c8" color={RED} rot={-4 - off * 40} bold />{t > a && <path d="M 390 730 L 690 710" stroke={RED} strokeWidth={12} strokeLinecap="round" />}</g>}
        <Label t={t} text="地下鉄の父" x={540} y={720} size={84} a={a + 0.5} b={a + 0.8} font={MARK} fill="#1f4d3a" color="#f3e9c6" bold />
      </g>
    );
  }},
];

const N = 16;
const words = (t: number) => (
  <g>
    {lineOn(t, T, 0, N) && <g>
      <Label t={t} text="みんなに笑われた「{ほら吹き}」が" x={540} y={300} size={60} a={0} still bold font={MARK} />
      <Label t={t} text="日本で最初の{地下鉄}をつくった" x={540} y={440} size={68} a={0} still bold font={MARK} />
    </g>}
    {lineOn(t, T, 1, N) && <g>
      <Label t={t} text="けれど{13年後}…" x={540} y={330} size={60} a={T.s(1)} b={T.to(1, '13年後')} />
      <Label t={t} text="その地下鉄から{追い出された}" x={540} y={455} size={64} a={T.at(1, '彼は')} b={T.e(1)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 2, N) && <Label t={t} text="男の名前は…" x={540} y={380} size={62} a={T.s(2)} b={T.to(2, '名前は')} />}
    {lineOn(t, T, 3, N) && <g>
      <Tag t={t} text="1914年・ロンドン" a={T.s(3)} />
      <Label t={t} text="ロンドンで{地下鉄}を見た早川は" x={540} y={330} size={58} a={T.at(3, 'ロンドン')} b={T.to(3, '早川は')} />
      <Label t={t} text="東京にも、つくろう！" x={540} y={455} size={68} a={T.at(3, '東京にも')} b={T.e(3)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 4, N) && <g>
      <Label t={t} text="けれど周りは…" x={540} y={330} size={58} a={T.s(4)} b={T.to(4, '周りは')} />
      <Label t={t} text="「東京の地面は{やわらかすぎる}」と笑った" x={540} y={455} size={50} a={T.at(4, '東京')} b={T.e(4)} />
    </g>}
    {lineOn(t, T, 5, N) && <g>
      <Label t={t} text="お金を集めるには" x={540} y={330} size={60} a={T.s(5)} b={T.to(5, '集めるには')} />
      <Label t={t} text="{証拠}が必要だった" x={540} y={455} size={64} a={T.at(5, '証拠')} b={T.e(5)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 6, N) && <g>
      <Label t={t} text="しかも東京には" x={540} y={330} size={60} a={T.s(6)} b={T.to(6, '東京には')} />
      <Label t={t} text="人の流れを調べた{資料がない}" x={540} y={455} size={58} a={T.at(6, '人の流れ')} b={T.e(6)} />
    </g>}
    {lineOn(t, T, 7, N) && <g>
      <Tag t={t} text="銀座" a={T.at(7, '銀座')} />
      <Label t={t} text="銀座の交差点に立ち" x={540} y={300} size={54} a={T.at(7, '銀座')} b={T.to(7, '立ち')} />
      <Label t={t} text="ポケットの{豆}を一粒ずつ移して" x={540} y={410} size={54} a={T.at(7, 'ポケット')} b={T.to(7, '移して')} />
      <Label t={t} text="通る人を数えた…といいます" x={540} y={520} size={52} a={T.at(7, '通る')} b={T.e(7)} />
    </g>}
    {lineOn(t, T, 8, N) && <g>
      <Tag t={t} text="1927年12月30日" a={T.s(8)} />
      <Label t={t} text="{上野}と{浅草}のあいだに" x={540} y={330} size={60} a={T.at(8, '上野')} b={T.to(8, 'あいだに')} />
      <Label t={t} text="東洋で初めての地下鉄が走った" x={540} y={455} size={62} a={T.at(8, '東洋')} b={T.e(8)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 9, N) && <g>
      <Label t={t} text="たった{2.2キロ}でしたが" x={540} y={330} size={60} a={T.s(9)} b={T.to(9, 'でしたが')} />
      <Label t={t} text="初日は{1時間待ち}の行列" x={540} y={455} size={62} a={T.at(9, '初日')} b={T.e(9)} />
    </g>}
    {lineOn(t, T, 10, N) && <g>
      <Tag t={t} text="1940年" a={T.to(10, '13年後')} />
      <Label t={t} text="それから{13年後}" x={540} y={300} size={56} a={T.s(10)} b={T.to(10, '13年後')} />
      <Label t={t} text="ライバルの鉄道会社が" x={540} y={410} size={56} a={T.at(10, 'ライバル')} b={T.to(10, '会社が')} />
      <Label t={t} text="早川の会社の{株}を買い集めた" x={540} y={520} size={58} a={T.at(10, '早川')} b={T.e(10)} bold font={MARK} />
    </g>}
    {lineOn(t, T, 11, N) && <g>
      <Label t={t} text="早川は{社長を退き}" x={540} y={330} size={60} a={T.s(11)} b={T.to(11, '退き')} />
      <Label t={t} text="自分がつくった地下鉄を去った" x={540} y={455} size={58} a={T.at(11, '自分が')} b={T.e(11)} />
    </g>}
    {lineOn(t, T, 12, N) && <g>
      <Tag t={t} text="1942年" a={T.s(12)} />
      <Label t={t} text="その2年後、{61歳}で亡くなった" x={540} y={400} size={58} a={T.s(12)} b={T.e(12)} />
    </g>}
    {lineOn(t, T, 13, N) && <g>
      <Tag t={t} text="いま" a={T.s(13)} />
      <Label t={t} text="いま、東京の地下鉄は" x={540} y={330} size={60} a={T.s(13)} b={T.to(13, '地下鉄は')} />
      <Label t={t} text="毎日{何百万人}もの人を運ぶ" x={540} y={455} size={60} a={T.at(13, '毎日')} b={T.e(13)} />
    </g>}
    {lineOn(t, T, 14, N) && <g>
      <Label t={t} text="{2027年}には" x={540} y={330} size={60} a={T.s(14)} b={T.to(14, 'には')} />
      <Label t={t} text="あの最初の線路が{100歳}になる" x={540} y={455} size={58} a={T.at(14, 'あの')} b={T.e(14)} />
    </g>}
    {lineOn(t, T, 15, N) && <g>
      <Label t={t} text="「{ほら吹き}」が豆で数えた答えは" x={540} y={330} size={56} a={T.s(15)} b={T.to(15, '答えは')} />
      <Label t={t} text="まちがっていなかった" x={540} y={455} size={70} a={T.at(15, 'まちがって')} b={T.e(15)} bold font={MARK} />
    </g>}
  </g>
);

export const Subway: React.FC = () => <Movie shots={shots} words={words} credit="声：VOICEVOX:青山龍星　／　音楽：竹笛" end={T.e(15)} />;
