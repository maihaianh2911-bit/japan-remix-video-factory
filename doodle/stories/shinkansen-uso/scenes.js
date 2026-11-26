// 新幹線は、ひとつのウソから生まれた — the scenes, one for each spoken line (story.json), timed on the voice (T).
// T.s(i) / T.e(i): when line i starts / ends; T.at(i, "words") / T.to(i, "words"): when the voice reaches / ends them.
window.SCENES = function (T) {
  const { W, H, ctx, rc, O, prog, pin, clamp, lerp, easeOut, easeInOut, easeBack, MARK, INK } = D;
  const RED = '#cf2e23';
  const sogo = (key, x, y, o) => D.person(key, x, y, Object.assign({ old: true, suit: '#27304a', tie: '#b03a2e' }, o));
  const rows = (t, list) => list.forEach(([key, text, y, size, a, b, o]) => D.label(key, text, W / 2, y, size, t, a, b, o));
  const scenes = [];
  const scene = (start, draw) => scenes.push({ start, draw });

  // 0  新幹線は、ひとつのウソから生まれました。 — the hook: on screen, big, from the first frame
  scene(0, (t, u) => {
    D.bg('sky'); D.bg('paper', 1400);
    D.cloud('c1', 250 + u * 14, 760, 260); D.cloud('c2', 850 + u * 9, 900, 200); D.cloud('c3', 600 + u * 11, 700, 150);
    D.fuji('fj0', 340, 1400, 1.7);   // the picture every Japanese viewer knows: the Shinkansen passing Mount Fuji
    const nose = lerp(560, 130, easeOut(prog(u, 0, 1.5)));
    D.rail('rail0', 1400);
    D.train('tr0', nose, 1400, 1.3, { len: 1300 });
    D.label('hk1', '新幹線は、', W / 2, 395, 104, t, 0, null, { still: true, font: MARK, bold: true });
    D.label('hk2', 'ひとつの{ウソ}から生まれた', W / 2, 575, 74, t, 0, null, { still: true, font: MARK, bold: true });
    const k = pin(t, T.at(0, 'ウソ'), 0.3);
    if (k > 0) D.burst('hb', 462, 575, 92 * k, 12, RED, 7);
  });

  // 1  ウソをついたのは、71歳で国鉄のトップになった、十河信二です。
  scene(T.s(1) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1520);
    D.tag('tg1', '1955年', t, T.s(1));
    // the head office of the national railways
    rc.rectangle(70, 900, 400, 620, O('hq', { fill: '#cfc7b6' }));
    for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) rc.rectangle(112 + c * 116, 1010 + r * 112, 76, 70, O('hqw' + r + c, { fill: '#cfe6f3', strokeWidth: 3.5 }));
    rc.rectangle(110, 920, 320, 66, O('hqs', { fill: '#1f4d3a', strokeWidth: 4 }));
    D.text('国鉄本社', 270, 955, 44, { font: MARK, color: '#f3e9c6' });
    sogo('sg1', 720, 1520, { scale: 2.3, mood: 'stern', arm: 1.1, arm2: 1.1, bob: Math.sin(u * 3) * 1.5 });
    rows(t, [
      ['b1', '{ウソ}をついたのは…', 370, 58, T.s(1), T.to(1, 'のは')],
      ['b2', '{71歳}で国鉄のトップになった', 490, 58, T.at(1, '71歳'), T.to(1, 'なった')],
    ]);
    const a = T.at(1, '十河信二');
    D.label('b3', '十河信二', 720, 790, 92, t, a, T.to(1, '十河信二'), { font: MARK, bold: true, fill: '#fff6cf' });
    if (t > a) D.fade(prog(t, a, 0.3), () => D.text('そごう　しんじ', 720, 688, 40, { outline: 10 }));
  });

  // 2  なぜ、ウソが必要だったのでしょうか。
  scene(T.s(2) - 0.1, (t, u) => {
    D.bg('wall'); D.ground(1560, '#bdb4a3');
    const k = pin(t, T.at(2, 'なぜ'), 0.4);
    D.at(600, 1010, k * (1 + Math.sin(u * 4) * 0.02), () => D.text('？', 0, 0, 560, { font: MARK, color: '#e2742b', outline: 22, outlineColor: '#1d1a16' }));
    sogo('sg2', 250, 1560, { scale: 1.7, mood: 'flat', arm: 1.2, arm2: 1.2 });
    D.balloon('bq', [['{ウソ}', T.s(2), T.s(2) + 0.2]], 250, 960, 64, t, T.at(2, 'ウソ') - 0.1, 250, 1100, { font: MARK });
    rows(t, [['c1', 'なぜ、{ウソ}が必要だったのか？', 420, 62, T.s(2), T.to(2, 'でしょうか')]]);
  });

  // 3  当時、鉄道はもう古いと言われていました。
  scene(T.s(3) - 0.1, (t, u) => {
    D.bg('sky'); D.bg('paper', 1380);
    D.tag('tg3', '1950年代', t, T.s(3));
    D.cloud('d1', 200 + u * 10, 720, 220);
    // the plane and the car hurry past, the old engine puffs along
    const px = lerp(-260, 1360, prog(u, 0.2, 2.6)), py = 800 - Math.sin(u) * 20;
    D.plane('pl', px, py, 0.9, -0.06);
    D.label('dl1', '飛行機', px - 20, py - 120, 42, t, T.s(3) + 0.5, T.s(3) + 0.7);
    rc.rectangle(-20, 1090, W + 40, 60, O('road', { fill: '#8f9296' }));
    for (let x = -80 + (u * 400) % 160; x < W; x += 160) rc.line(x, 1120, x + 70, 1120, O('rd' + Math.round(x / 160), { stroke: '#f3ecd8', strokeWidth: 6, roughness: 0.3 }));
    const cx = lerp(-200, 1300, prog(u, 0.5, 2.0));
    D.car('car', cx, 1094, 1.0);
    D.label('dl2', '車', cx, 905, 42, t, T.s(3) + 0.7, T.s(3) + 0.8);
    D.rail('rail3', 1380);
    D.steam('st', 220 + u * 22, 1380, 1.15, u);
    const a = T.at(3, 'もう古い');
    D.stamp('old', 'もう古い', 780, 1250, 86, -0.12, t, a, { fill: 'rgba(251,247,238,0.92)' });
    rows(t, [
      ['d1', '当時、鉄道は…', 370, 58, T.s(3), T.to(3, '鉄道は')],
      ['d2', '「{もう古い}」と言われていた', 490, 58, a, T.e(3)],
    ]);
  });

  // 4a 東京と大阪を結ぶ高速鉄道の計画は、
  const cards = T.at(4, 'ピラミッド') - 0.18;
  scene(T.s(4) - 0.1, (t, u) => {
    D.bg('green');
    rc.path('M -20 1420 C 200 1330, 420 1400, 620 1340 C 800 1290, 960 1330, 1100 1280 L 1100 1940 L -20 1940 Z', O('sea', { fill: '#bcd9ea', strokeWidth: 4 }));
    D.fuji('fj', 640, 1160, 0.9);
    const p = easeInOut(prog(t, T.at(4, '結ぶ') - 0.5, 1.2));
    // the dashed line from Tokyo (east, right) to Osaka (west, left)
    const pt = q => [lerp(880, 200, q), 1235 + Math.sin(q * Math.PI) * 60 + q * 40];
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.setLineDash([26, 22]);
    ctx.beginPath(); for (let q = 0; q <= p + 0.001; q += 0.02) { const [x, y] = pt(q); q === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
    D.mappin('pt', 880, 1235, pin(t, T.s(4)), '#d6453a');
    D.mappin('po', 200, 1275, pin(t, T.at(4, '大阪')), '#3d74c4');
    D.label('lt', '東京', 880, 1050, 56, t, T.s(4), T.s(4) + 0.25, { font: MARK });
    D.label('lo', '大阪', 200, 1090, 56, t, T.at(4, '大阪'), T.at(4, '大阪') + 0.25, { font: MARK });
    if (p > 0.02 && p < 0.98) { const [x, y] = pt(p); D.train('mini', x - 40, y + 26, 0.3, { len: 420 }); }
    rows(t, [
      ['e1', '東京と大阪を結ぶ', 370, 62, T.s(4), T.to(4, '結ぶ')],
      ['e2', '{高速鉄道}の計画は…', 495, 62, T.at(4, '高速'), T.to(4, '計画は')],
    ]);
  });

  // 4b ピラミッド、万里の長城、戦艦大和に続く「世界四バカ」とまで笑われました。
  scene(cards, (t, u) => {
    D.bg('wall');
    const pos = [[290, 830], [790, 830], [290, 1270], [790, 1270]];
    const when = [T.at(4, 'ピラミッド'), T.at(4, '万里'), T.at(4, '戦艦'), T.at(4, 'に続く')];
    const names = ['ピラミッド', '万里の長城', '戦艦大和', '高速鉄道'];
    const rots = [-0.03, 0.025, 0.02, -0.025];
    pos.forEach(([cx, cy], i) => {
      D.card('cd' + i, cx, cy, 440, 390, pin(t, when[i] - 0.1), rots[i], () => {
        if (i === 0) D.pyramid('py', 0, 80, 0.95);
        if (i === 1) D.wall('gw', 0, 90, 1.0);
        if (i === 2) D.battleship('bs', 0, 70, 0.92, u);
        if (i === 3) { D.rail('cr', 80, -200, 200); D.train('ctr', -170, 80, 0.42, { len: 900 }); D.text('計画', 130, -110, 46, { font: MARK, color: '#3d74c4', rot: 0.12 }); }
        D.text(names[i], 0, 150, 46, { font: MARK });
        D.text('①②③④'[i], -180, -152, 50, { font: MARK, color: i === 3 ? RED : '#7a7366' });
      });
    });
    const a = T.at(4, '世界四バカ');
    D.stamp('baka', '世界四バカ', W / 2, 1050, 150, -0.1, t, a, { fill: 'rgba(251,247,238,0.94)' });
    const l = T.at(4, '笑われ');
    [[170, 1560, -0.2], [900, 1575, 0.18], [540, 1610, 0.04]].forEach(([x, y, r], i) => {
      const k = pin(t, l + i * 0.12, 0.25);
      if (k > 0) D.at(x, y + Math.sin(u * 9 + i) * 6, k, () => D.text('ハハハ', 0, 0, 70, { font: MARK, color: '#e2742b', outline: 12 }), r);
    });
    rows(t, [
      ['f1', 'ピラミッド、万里の長城、戦艦大和', 370, 54, when[0], T.to(4, '戦艦大和')],
      ['f2', 'に続く「{世界四バカ}」と笑われた', 490, 58, when[3], T.e(4)],
    ]);
  });

  // 5  しかも建設費は、国会が認めるはずのない金額でした。
  scene(T.s(5) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1520);
    D.diet('dt5', 290, 1520, 0.78);
    D.label('dn5', '国会', 290, 1130, 50, t, T.at(5, '国会'), T.at(5, '国会') + 0.2, { font: MARK });
    const drop = easeOut(prog(u, 0.05, 0.45));
    const by = lerp(700, 1520, drop) + (drop >= 1 ? 0 : 0);
    D.moneybag('mb5', 810, by, 2.2 * (1 + Math.sin(u * 5) * 0.012));
    if (drop >= 1) { D.coins('cn5b', 1010, 1520, 4, 0.8); }
    D.label('ml5', '建設費', 810, 1020, 56, t, T.at(5, '建設費'), T.to(5, '建設費'), { font: MARK, fill: '#fff6cf' });
    const a = T.at(5, 'ない');
    D.cross('x5', 810, 1300, 190, t, a);
    rows(t, [
      ['g1', 'しかも、建設費は…', 370, 58, T.s(5), T.to(5, '建設費は')],
      ['g2', '国会が{認めるはずのない}金額', 490, 58, T.at(5, '国会'), T.e(5)],
    ]);
  });

  // 6-7  すると十河は、こう言ったと伝えられています。「半分にした予算が国会を通れば、あとはおれが責任を持つ。心配するな」。
  scene(T.s(6) - 0.1, (t, u) => {
    D.bg('wood'); D.ground(1540, '#8c6238', 0.5);
    const cut = T.at(7, '半分');
    const p = easeOut(prog(t, cut + 0.15, 0.7));
    // the estimate on the wall, cut in half
    D.sheet('est', 800 - 96, 990, 190, 300, null, {});
    if (p < 1) D.fade(1 - p, () => D.sheet('est2', 800 + 96 + p * 130, 990 + p * p * 420, 190, 300, null, { rot: p * 0.9 }));
    D.text('見積もり', 800 - (p > 0 ? 96 : 0), 880, p > 0 ? 40 : 54, { font: MARK });
    if (t > cut - 0.1 && p < 0.6) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 6; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(800, 820); ctx.lineTo(800, 820 + 340 * prog(t, cut - 0.1, 0.3)); ctx.stroke(); ctx.restore(); }
    D.stamp('half', '半分', 704, 1010, 70, -0.15, t, cut + 0.35);
    [[690, 0], [840, 1], [985, 2]].forEach(([x, i]) => D.person('en' + i, x, 1540, { scale: 1.3, helmet: true, suit: '#4f7fa8', plain: true, mood: t > cut ? 'wow' : 'flat', worry: true, flip: true, arm: 1.1, bob: Math.sin(u * 4 + i) * 1.5 }));
    if (t > cut) D.sweat(905, 1130, u, 1.5);
    const speak = t > T.s(7) && t < T.e(7);
    sogo('sg6', 260, 1540, { scale: 2.15, mood: 'stern', arm: speak ? -0.5 + Math.sin(u * 7) * 0.12 : 0.9, arm2: 1.1, bob: speak ? Math.sin(u * 9) * 2 : 0 });
    D.label('h1', '十河は、こう言ったと伝えられている', W / 2, 330, 52, t, T.s(6), T.to(6, '伝えられて'));
    D.balloon('quote', [
      ['{半分}にした予算が国会を通れば、', cut, T.to(7, '通れば')],
      ['あとは{おれが責任を持つ}。', T.at(7, 'あとは'), T.to(7, '持つ')],
      ['心配するな', T.at(7, '心配'), T.to(7, 'するな')],
    ], W / 2 + 6, 590, 57, t, T.s(7) - 0.12, 300, 950);
  });

  // 8  わざと安く見せた予算は、国会を通りました。
  scene(T.s(8) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1540);
    D.diet('dt8', 540, 1540, 1.12);
    const fly = easeOut(prog(u, 0, 0.5));
    const a = T.at(8, '通りました');
    D.at(lerp(-300, 540, fly), 880, 1, () => {
      D.sheet('bud', 0, 0, 420, 330, '予算', { titleSize: 60, rot: lerp(-0.5, -0.04, fly) });
    });
    D.stamp('pass', '可決', 590, 900, 120, -0.2, t, a, { fill: 'rgba(251,247,238,0.9)' });
    if (t > a) D.burst('pb', 590, 900, 150 + prog(t, a, 0.3) * 40, 12, '#e2742b', 7);
    sogo('sg8', 930, 1600, { scale: 1.25, mood: 'flat', arm: 1.1, arm2: 1.1 });
    rows(t, [
      ['i1', 'わざと{安く見せた}予算は…', 370, 58, T.s(8), T.to(8, '予算は')],
      ['i2', '国会を通った', 490, 62, T.at(8, '国会'), T.e(8), { font: MARK }],
    ]);
  });

  // 9  けれど工事費は、予算のほぼ2倍にふくらみます。
  scene(T.s(9) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1500);
    const grow = easeInOut(prog(t, T.at(9, '予算の'), T.to(9, 'ふくらみ') - T.at(9, '予算の')));
    const h1 = 300, h2 = lerp(300, 585, grow);
    rc.rectangle(200, 1500 - h1, 230, h1, O('bar1', { fill: '#7fb0d6' }));
    rc.rectangle(600, 1500 - h2, 230, h2, O('bar2', { fill: grow > 0.05 ? '#e0624d' : '#7fb0d6' }));
    ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.setLineDash([14, 12]); ctx.beginPath(); ctx.moveTo(160, 1500 - h1); ctx.lineTo(900, 1500 - h1); ctx.stroke(); ctx.restore();
    D.text('予算', 315, 1560, 56, { font: MARK }); D.text('工事費', 715, 1560, 56, { font: MARK });
    D.coins('c9a', 315, 1500 - h1, 2, 1.1); D.coins('c9b', 715, 1500 - h2, 2 + Math.round(grow * 3), 1.1);
    D.stamp('x2', 'ほぼ2倍', 760, 800, 96, -0.1, t, T.at(9, '2倍'), { fill: 'rgba(251,247,238,0.9)' });
    D.person('wk9', 960, 1500, { scale: 1.2, helmet: true, suit: '#4f7fa8', plain: true, mood: grow > 0.4 ? 'wow' : 'flat', worry: true, flip: true, arm: grow > 0.4 ? -1.2 : 1.0 });
    if (grow > 0.4) D.sweat(990, 1170, u, 1.5);
    rows(t, [
      ['j1', 'けれど、工事費は…', 370, 58, T.s(9), T.to(9, '工事費は')],
      ['j2', '予算の{ほぼ2倍}にふくらんだ', 490, 58, T.at(9, '予算の'), T.e(9)],
    ]);
  });

  // 10 十河は責任を取る形で、開業の前の年に国鉄を去りました。
  scene(T.s(10) - 0.1, (t, u) => {
    D.bg('wall'); D.ground(1520, '#bdb4a3');
    D.tag('tg10', '1963年', t, T.s(10));
    rc.rectangle(110, 900, 300, 620, O('door', { fill: '#9a6b3d' }));
    rc.rectangle(146, 940, 228, 250, O('doorp1', { fill: '#b07f4c', strokeWidth: 3.5 })); rc.rectangle(146, 1230, 228, 250, O('doorp2', { fill: '#b07f4c', strokeWidth: 3.5 }));
    rc.circle(372, 1220, 26, O('knob', { fill: '#e2b23a', strokeWidth: 3.5 }));
    rc.rectangle(150, 800, 220, 70, O('plate', { fill: '#1f4d3a', strokeWidth: 4 }));
    D.text('総裁室', 260, 836, 46, { font: MARK, color: '#f3e9c6' });
    const x = lerp(470, 760, prog(u, 0.2, 4.2));
    sogo('sg10', x, 1520, { scale: 1.9, mood: 'flat', arm: 1.35, arm2: 1.2, bag: true, bob: Math.abs(Math.sin(u * 5)) * -4, step: Math.sin(u * 5) * 0.6, lean: 0.03, look: 4 });
    const a = T.at(10, '開業');
    D.calendar('cal10', 850, 800, pin(t, a) * 0.66, '1964', '開業');
    rows(t, [
      ['k1', '十河は{責任を取る}形で', 370, 58, T.s(10), T.to(10, '形で')],
      ['k2', '開業の前の年に、国鉄を去った', 490, 56, a, T.e(10)],
    ]);
  });

  // 11 1964年10月1日、新幹線が走り出した朝、東京駅の出発式に、十河は招かれませんでした。
  scene(T.s(11) - 0.1, (t, u) => {
    D.bg('sky');
    const gone = T.at(11, '十河は');
    D.tag('tg11', '1964年10月1日', t, T.s(11));
    // the roof, the bunting, the station board
    rc.rectangle(-20, 720, W + 40, 40, O('roof11', { fill: '#8b9aa5' }));
    for (let i = 0; i < 12; i++) rc.polygon([[30 + i * 90, 760], [100 + i * 90, 760], [65 + i * 90, 830]], O('flag' + i, { fill: ['#d6453a', '#f6c543', '#3d74c4', '#fbf7ee'][i % 4], strokeWidth: 3 }));
    const go = Math.pow(prog(t, gone + 0.5, 2.6), 2);
    D.rail('rail11', 1290);
    D.train('tr11', 150 - go * 1500, 1290, 1.12, { len: 1300 });
    rc.rectangle(-20, 1300, W + 40, 340, O('floor11', { fill: '#cfc8ba' }));
    D.bg('paper', 1640);
    rc.rectangle(770, 850, 250, 96, O('board11', { fill: '#fbf7ee' }));
    D.text('東京駅', 895, 900, 62, { font: MARK });
    // the ceremony: people clap, paper falls
    [[150, '#3a4a3a', '#d9a521'], [300, '#4a3636', '#3d74c4'], [450, '#2f3f5a', '#c0392b'], [600, '#4b3f2a', '#2e8b57']].forEach(([x, suit, tie], i) =>
      D.person('of' + i, x, 1600, { scale: 1.25, suit, tie, mood: 'laugh', arm: -1.1 + Math.sin(u * 9 + i) * 0.25, arm2: -1.1 + Math.sin(u * 9 + i + 1) * 0.25, bob: Math.sin(u * 6 + i * 1.3) * 3 }));
    const r = (i, m) => ((D.hash('cf' + i) % 1000) / 1000 * m);
    for (let i = 0; i < 26; i++) { const x = r(i, 1080), y = 780 + ((r(i + 99, 700) + u * (90 + r(i + 7, 80))) % 760); ctx.save(); ctx.translate(x, y); ctx.rotate(u * 3 + i); ctx.fillStyle = ['#d6453a', '#f6c543', '#3d74c4', '#2e8b57'][i % 4]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); }
    // the one who is not there
    const k = pin(t, gone - 0.1);
    if (k > 0) D.at(880, 1600, k * 1.12, () => {
      ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.lineCap = 'round'; ctx.fillStyle = 'rgba(251,247,238,0.7)';
      ctx.beginPath(); ctx.ellipse(0, -150, 64, 92, 0, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, -292, 66, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore();
      D.text('？', 0, -288, 86, { font: MARK, color: RED });
    });
    rows(t, [
      ['l1', '新幹線が走り出した朝', 340, 56, T.at(11, '新幹線'), T.to(11, '朝')],
      ['l2', '東京駅の出発式に…', 458, 56, T.at(11, '東京駅'), T.to(11, '出発式に')],
      ['l3', '十河は{招かれなかった}', 580, 62, gone, T.e(11), { font: MARK, bold: true }],
    ]);
  });

  // 12 80歳の十河は、自宅のテレビでそれを見ていたといいます。
  scene(T.s(12) - 0.1, (t, u) => {
    D.bg('room'); D.ground(1500, '#b9c08f', 0.6);
    // a paper window
    rc.rectangle(700, 760, 300, 360, O('shoji', { fill: '#fbf8ef' }));
    for (let i = 1; i < 3; i++) { rc.line(700 + i * 100, 760, 700 + i * 100, 1120, O('sj' + i, { strokeWidth: 3.5 })); rc.line(700, 760 + i * 120, 1000, 760 + i * 120, O('sk' + i, { strokeWidth: 3.5 })); }
    D.tv('tv', 320, 1370, 1.2, () => {
      ctx.fillStyle = '#c9dbe3'; ctx.fillRect(-150, -105, 300, 120);
      D.train('tvt', 120 - u * 70, 60, 0.3, { len: 900 });
      ctx.fillStyle = 'rgba(40,50,60,0.10)'; for (let y = -105; y < 105; y += 8) ctx.fillRect(-150, y + (u * 30) % 8, 300, 2);
    });
    rc.ellipse(800, 1505, 330, 60, O('zabu', { fill: '#8d5a8f', strokeWidth: 4.5 }));
    sogo('sg12', 800, 1495, { scale: 2.0, noLegs: true, mood: 'flat', arm: 1.25, arm2: 1.25, flip: true, look: 7 });
    rows(t, [
      ['m1', '{80歳}の十河は…', 370, 60, T.s(12), T.to(12, '十河は')],
      ['m2', '自宅のテレビで、それを見ていた', 490, 54, T.at(12, '自宅'), T.to(12, '見ていた')],
    ]);
    D.label('m3', '…といいます', 800, 610, 42, t, T.at(12, 'といいます'), T.e(12));
  });

  // 13 9年後、その東京駅のホームに、十河の顔を刻んだ記念碑が建ちました。
  scene(T.s(13) - 0.1, (t, u) => {
    D.bg('sky'); D.bg('paper', 1570);
    D.tag('tg13', '1973年', t, T.s(13));
    D.platform('pf13', 1500, { height: 720 });
    D.calendar('cal13', 230, 1130, pin(t, T.s(13)) * 0.75, '1973', '9年後');
    const a = T.at(13, '記念碑') - 0.35;
    const k = pin(t, a, 0.45);
    D.monument('mn13', 640, 1500, 1.42 * k, { words: '一花開天下春' });
    if (t > a) { const q = prog(t, a, 0.6); D.fade(1 - q, () => { D.burst('mb13', 640, 1200, 330 + q * 90, 14, '#e2742b', 8); }); }
    rows(t, [
      ['n1', '{9年後}、東京駅のホームに', 370, 58, T.s(13), T.to(13, 'ホームに')],
      ['n2', '十河の顔を刻んだ{記念碑}が建った', 490, 54, T.at(13, '十河の'), T.e(13)],
    ]);
  });

  // 14 新幹線に乗るときは、18番、19番ホームの端を探してみてください。
  scene(T.s(14) - 0.1, (t, u) => {
    D.bg('sky'); D.bg('paper', 1570);
    D.platform('pf14', 1500, { height: 720, yellow: true });
    const a = T.at(14, '18番');
    // the platform numbers
    [[350, '18'], [560, '19']].forEach(([x, n], i) => D.at(x, 960, pin(t, a + i * (T.at(14, '19番') - a)), () => {
      rc.line(0, -180, 0, -90, O('sg' + n, { strokeWidth: 6 }));
      rc.rectangle(-90, -90, 180, 180, O('sq' + n, { fill: '#2f5fa8' }));
      D.text(n, 0, 6, 120, { font: MARK, color: '#fbf7ee' });
    }));
    const e = T.at(14, '端');
    if (t > e) { const q = prog(t, e, 0.4); ctx.save(); ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(690, 960); ctx.lineTo(690 + 170 * q, 960); ctx.stroke(); if (q >= 1) { ctx.beginPath(); ctx.moveTo(900, 960); ctx.lineTo(852, 928); ctx.lineTo(852, 992); ctx.closePath(); ctx.fill(); } ctx.restore(); }
    D.monument('mn14', 950, 1500, 0.78, {});
    if (t > e) D.burst('mb14', 950, 1330, 190 + Math.sin(u * 6) * 8, 12, '#e2742b', 6);
    const x = lerp(130, 640, easeInOut(prog(u, 0.3, 4.2)));
    D.person('tv14', x, 1500, { scale: 1.5, suit: '#3f8f7a', plain: true, mood: 'ok', arm: 1.2, arm2: 1.0, bag: true, bob: Math.abs(Math.sin(u * 6)) * -4, step: Math.sin(u * 6) * 0.6, look: 6 });
    rows(t, [
      ['p1', '新幹線に乗るときは', 340, 56, T.s(14), T.to(14, 'ときは')],
      ['p2', '{18番・19番}ホームの端を', 458, 60, a, T.to(14, '端を'), { font: MARK }],
      ['p3', '探してみてください', 580, 56, T.at(14, '探して'), T.e(14)],
    ]);
  });

  // 15 ウソの責任を一人で背負った男が、今もそこから、列車を見送っています。
  scene(T.s(15) - 0.1, (t, u) => {
    D.bg('dusk'); D.bg('paper', 1570);
    rc.circle(860, 900, 190, O('sun', { fill: '#f2a25a', strokeWidth: 4 }));
    D.cloud('q1', 300 + u * 8, 800, 240);
    D.rail('rail15', 1440);
    const go = Math.pow(prog(u, 0.6, 6.2), 1.7);
    D.train('tr15', 560 + go * 1500, 1440, 1.05, { len: 1500, flip: true });
    rc.rectangle(-20, 1450, W + 40, 120, O('floor15', { fill: '#cfc8ba' }));
    rc.rectangle(-20, 1454, W + 40, 14, O('yl15', { fill: '#f2c230', strokeWidth: 2.5 }));
    D.monument('mn15', 250, 1560, 1.5, { look: 3, words: '一花開天下春' });
    rows(t, [
      ['q1', '{ウソ}の責任を一人で背負った男が', 370, 54, T.s(15), T.to(15, '男が')],
      ['q2', '今もそこから、列車を見送っている', 490, 54, T.at(15, '今も'), T.e(15)],
    ]);
    const c = prog(t, T.e(15) + 0.2, 0.5);
    if (c > 0) D.fade(c, () => D.text('声：VOICEVOX:青山龍星　／　音楽：竹笛', W / 2, 1700, 34, { color: '#5a5347' }));
  });

  return scenes;
};
