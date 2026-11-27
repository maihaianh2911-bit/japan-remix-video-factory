// The first four lines of 「ほら吹き」と笑われた男が、日本で最初の地下鉄をつくった, drawn with Remotion (a trial, 27/11/2026).
import React, {useEffect, useState} from 'react';
import {AbsoluteFill, continueRender, delayRender, useCurrentFrame} from 'remotion';
import {
  W, H, INK, RED, HAND, MARK, clamp, prog, lerp, easeOut, easeInOut, pop, T, Defs, Finish, Shadow, Paper, Sky, Cloud, Label, Tag,
  Stamp, Person, Shop, Street, Lamp, Tram, Car, Tube, Tunnel, Columns, Soil, Calendar, Medal, Pin, Bulb, Haha, PersonProps,
} from './kit';

export const DURATION = 16.5;

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
type Shot = {a: number; draw: (t: number, v: number) => React.ReactNode};
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
];

// every character drawn, for the fonts to load before the first frame
const ALL = 'みんなに笑われた「ほら吹き」が日本で最初の地下鉄をつくったけれど13年後…その地下鉄から追い出された男の名前は早川徳次はやかわのりつぐ1881年山梨県生まれ地下鉄の父ロンドンで地下鉄を見た早川は東京にも、つくろう！1914年・ロンドン東京ど真ん中日本初時計呉服薬洋品ガス水道電線上野うえの1927193019351940GENERALUNDERGROUNDハハハ0123456789';

export const Trial: React.FC = () => {
  const t = useCurrentFrame() / 30;
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all([document.fonts.load(`700 60px "Zen Maru Gothic"`, ALL), document.fonts.load(`60px "Yusei Magic"`, ALL)]).then(() => document.fonts.ready).then(() => continueRender(handle));
  }, [handle]);
  let cur = shots[0], next = Infinity;
  shots.forEach((s, i) => { if (t >= s.a) { cur = s; next = i + 1 < shots.length ? shots[i + 1].a : Infinity; } });
  const v = t - cur.a;
  const k = (1 + 0.06 * (1 - easeOut(clamp(v / 0.25)))) * (1 + 0.04 * easeInOut(clamp(v / Math.min(3.5, next - cur.a))));
  return (
    <AbsoluteFill style={{backgroundColor: '#efe5cc'}}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs />
        <g transform={`translate(540 1150) scale(${k}) translate(-540 -1150)`}>{cur.draw(t, v)}</g>
        {/* the words of the voice, on top */}
        {t < T.s(1) - 0.08 && <g>
          <Label t={t} text="みんなに笑われた「{ほら吹き}」が" x={540} y={300} size={60} a={0} still bold font={MARK} />
          <Label t={t} text="日本で最初の{地下鉄}をつくった" x={540} y={440} size={68} a={0} still bold font={MARK} />
        </g>}
        {t >= T.s(1) - 0.08 && t < T.s(2) - 0.08 && <g>
          <Label t={t} text="けれど{13年後}…" x={540} y={330} size={60} a={T.s(1)} b={T.to(1, '13年後')} />
          <Label t={t} text="その地下鉄から{追い出された}" x={540} y={455} size={64} a={T.at(1, '彼は')} b={T.e(1)} bold font={MARK} />
        </g>}
        {t >= T.s(2) - 0.08 && t < T.s(3) - 0.08 && <Label t={t} text="男の名前は…" x={540} y={380} size={62} a={T.s(2)} b={T.to(2, '名前は')} />}
        {t >= T.s(3) - 0.08 && <g>
          <Tag t={t} text="1914年・ロンドン" a={T.s(3)} />
          <Label t={t} text="ロンドンで{地下鉄}を見た早川は" x={540} y={330} size={58} a={T.at(3, 'ロンドン')} b={T.to(3, '早川は')} />
          <Label t={t} text="東京にも、つくろう！" x={540} y={455} size={68} a={T.at(3, '東京にも')} b={T.e(3)} bold font={MARK} />
        </g>}
        <Finish />
      </svg>
    </AbsoluteFill>
  );
};
