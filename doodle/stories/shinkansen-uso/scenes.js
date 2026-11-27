// 新幹線は、ひとつのウソから生まれた — drawn the second way (26/11/2026): one big picture for every part of a sentence,
// each saying the idea by itself. Two things come back through the video: the egg 「ウソ」 the train was born from,
// and the rock 「責任」 Sogo carries. T.s(i) / T.e(i): when line i starts / ends; T.at(i, "words") / T.to(i, "words"):
// when the voice reaches / ends them.
window.SCENES = function (T) {
  const { W, H, ctx, rc, O, prog, pin, clamp, lerp, easeOut, easeInOut, easeBack, MARK, INK, shots } = D;
  const RED = '#cf2e23';
  const sogo = (key, x, y, o) => D.person(key, x, y, Object.assign({ old: true, suit: '#27304a', tie: '#b03a2e' }, o));
  const sogoFace = (key, x, y, s, o) => D.face(key, x, y, s, Object.assign({ old: true, suit: '#27304a', tie: '#b03a2e' }, o));
  const rows = (t, list) => list.forEach(([key, text, y, size, a, b, o]) => D.label(key, text, W / 2, y, size, t, a, b, o));
  const scenes = [];
  const scene = (start, draw) => scenes.push({ start, draw });

  // ---------- the things that come back ----------
  const egg = (key, x, y, s, rot) => D.at(x, y, s, () => {   // the lie, as an egg
    rc.path('M 0 -210 C 130 -210, 196 -20, 196 66 C 196 176, 104 236, 0 236 C -104 236, -196 176, -196 66 C -196 -20, -130 -210, 0 -210 Z', O(key, { fill: '#fbf6e6', strokeWidth: 6 }));
    D.text('ウソ', 0, 60, 120, { font: MARK, color: RED });
  }, rot);
  const rock = (key, x, y, s) => D.at(x, y, s, () => {   // the responsibility, as a rock
    rc.path('M -190 60 C -210 -40, -150 -140, -40 -160 C 60 -180, 170 -130, 196 -30 C 214 50, 170 130, 60 140 C -50 150, -170 140, -190 60 Z', O(key, { fill: '#9a9da2', strokeWidth: 6 }));
    rc.line(-120, -60, -70, -30, O(key + 'c1', { strokeWidth: 3, stroke: '#6f7378' })); rc.line(110, 40, 150, 10, O(key + 'c2', { strokeWidth: 3, stroke: '#6f7378' }));
    D.text('責任', 0, -4, 104, { font: MARK });
  });
  const carrying = (key, x, y, s, u, o = {}) => {   // Sogo, bent under the rock
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rock(key + 'rk', 30, -330 + Math.sin(u * 3) * 4, 0.92);
    sogo(key, 0, 0, Object.assign({ scale: 1, mood: 'stern', lean: 0.22, arm: -1.9, arm2: -1.3 }, o));
    ctx.restore();
    D.sweat(x - 90 * s, y - 250 * s, u, 1.2 * s);
  };
  const dietBig = (key, x, y, s) => D.diet(key, x, y, s);
  const estimate = (key, x, y, w, h, title, rot) => D.at(x, y, 1, () => {   // a sheet with a tower of coins drawn on it
    ctx.fillStyle = 'rgba(60,45,20,0.22)'; ctx.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
    rc.rectangle(-w / 2, -h / 2, w, h, O(key, { fill: '#fbf8ef', strokeWidth: 6 }));
    D.text(title, 0, -h / 2 + 62, 62, { font: MARK });
    D.tower(key + 'tw', 0, h / 2 - 30, Math.round((h - 170) / 17), Math.min(1, w / 320));
  }, rot);

  // 0  新幹線は、ひとつのウソから生まれました。 — the hook: the train comes out of the egg
  scene(0, (t, u) => {
    D.bg('sky'); D.bg('paper', 1420);
    D.cloud('c1', 230 + u * 14, 760, 260); D.cloud('c2', 560 + u * 10, 900, 170);
    D.fuji('fj0', 250, 1420, 1.25);
    D.rail('rail0', 1420);
    const ex = 760, ey = 1160;
    egg('egg0', ex, ey + Math.sin(u * 22) * 3 * (1 - prog(u, 0, 1.2)), 1.75, 0.04);
    const nose = lerp(360, 40, easeOut(prog(u, 0, 1.6)));
    ctx.save(); ctx.beginPath(); ctx.rect(-20, 600, ex - 150, 900); ctx.clip();
    D.train('tr0', nose, 1420, 1.25, { len: 1200 });
    ctx.restore();
    // the broken shell round the hole
    rc.polygon([[ex - 190, 1010], [ex - 120, 1060], [ex - 170, 1120], [ex - 110, 1190], [ex - 170, 1250], [ex - 120, 1320], [ex - 190, 1400], [ex - 250, 1340], [ex - 300, 1200], [ex - 250, 1060]], O('hole0', { fill: '#2a2a2e', strokeWidth: 5 }));
    ctx.save(); ctx.beginPath(); ctx.rect(ex - 320, 990, 170, 430); ctx.clip(); D.train('tr0b', nose, 1420, 1.25, { len: 1200 }); ctx.restore();
    for (const [dx, dy, r] of [[-360, -330, 0.5], [-250, -420, -0.4], [-420, -180, 1.1]]) { const f = easeOut(prog(u, 0.1, 0.9)); D.at(ex - 200 + dx * f, ey + dy * f + f * f * 120, 1, () => rc.polygon([[-34, -20], [30, -30], [40, 26], [-20, 34]], O('sh' + dx, { fill: '#fbf6e6', strokeWidth: 4 })), r + f * 3); }
    D.label('hk1', '新幹線は、', W / 2, 345, 104, t, 0, null, { still: true, font: MARK, bold: true });
    D.label('hk2', 'ひとつの{ウソ}から生まれた', W / 2, 505, 74, t, 0, null, { still: true, font: MARK, bold: true });
  });

  // 1  ウソをついたのは、71歳で国鉄のトップになった、十河信二です。
  scene(T.s(1) - 0.08, (t, u) => {
    const name = T.at(1, '十河信二');
    shots(t, [
      [-1, v => {   // the one who told it: a finger on his lips, the egg behind his back
        D.bg('wall');
        egg('egg1', 860, 1330, 1.0, 0.25);
        sogoFace('f1', 520, 1040, 1.5, { mood: 'flat' });
        rc.path('M 470 1560 C 440 1440, 480 1330, 520 1320 C 560 1330, 600 1440, 570 1560 Z', O('fist1', { fill: '#f3c891', strokeWidth: 6 }));
        rc.path('M 496 1340 L 496 1110 C 496 1076, 544 1076, 544 1110 L 544 1340 Z', O('fing1', { fill: '#f3c891', strokeWidth: 6 }));
        D.at(250, 760, pin(t, T.s(1) + 0.2), () => D.text('しーっ', 0, 0, 90, { font: MARK, color: '#e2742b', outline: 14 }), -0.15);
      }],
      [T.at(1, '71歳') - 0.08, v => {   // who he is, on a card
        D.bg('paper');
        D.at(540, 1090, 1, () => {
          ctx.fillStyle = 'rgba(60,45,20,0.24)'; ctx.fillRect(-440, -410, 900, 840);
          rc.rectangle(-450, -420, 900, 840, O('card1', { fill: '#fbf8ef', strokeWidth: 6 }));
          rc.rectangle(-410, -380, 380, 470, O('ph1', { fill: '#cfe0e6' }));
          ctx.save(); ctx.beginPath(); ctx.rect(-406, -376, 372, 462); ctx.clip(); sogoFace('f1b', -220, -150, 0.86, { mood: 'stern' }); ctx.restore();
          rc.rectangle(-410, -380, 380, 470, O('ph1f', { strokeWidth: 6 }));
          D.at(200, -250, pin(t, T.at(1, '71歳'), 0.3), () => { rc.circle(0, 0, 230, O('age1', { fill: '#fff6cf', strokeWidth: 6 })); D.text('71歳', 0, 6, 92, { font: MARK, color: RED }); });
          if (t > T.at(1, '国鉄')) D.fade(prog(t, T.at(1, '国鉄'), 0.25), () => { rc.rectangle(10, -110, 400, 90, O('jnr1', { fill: '#1f4d3a', strokeWidth: 5 })); D.text('国鉄のトップ', 210, -62, 56, { font: MARK, color: '#f3e9c6' }); });
          if (t > name) {
            const n = Math.ceil(4 * clamp((t - name) / (T.to(1, '十河信二') - name)));
            D.text('そごう　しんじ', -30, 150, 40, { color: '#5a5347' });
            D.text('十河信二'.slice(0, n), -400, 250, 120, { font: MARK, align: 'left' });
            rc.line(-400, 330, 140, 330, O('ul1', { strokeWidth: 6, stroke: RED }));
          }
          D.rail('r1', 396, 150, 430); D.train('t1', 170, 396, 0.26, { len: 900 });
        });
      }],
    ]);
    D.tag('tg1', '1955年', t, T.at(1, '71歳'));
    rows(t, [
      ['b1', '{ウソ}をついたのは…', 370, 58, T.s(1), T.to(1, 'のは')],
      ['b2', '{71歳}で国鉄のトップになった', 490, 58, T.at(1, '71歳'), T.to(1, 'なった')],
    ]);
  });

  // 2  なぜ、ウソが必要だったのでしょうか。 — a glass over the egg
  scene(T.s(2) - 0.08, (t, u) => {
    D.bg('wall'); D.ground(1560, '#bdb4a3');
    egg('egg2', 540, 1290, 1.25, 0);
    const gx = 600 + Math.sin(u * 2.6) * 110, gy = 1180 + Math.cos(u * 2.1) * 80;
    rc.line(gx + 150, gy + 150, gx + 330, gy + 330, O('mgh', { strokeWidth: 34, stroke: '#5a3d22' })); ctx.fillStyle = 'rgba(207,230,243,0.45)'; ctx.beginPath(); ctx.arc(gx, gy, 210, 0, 7); ctx.fill(); rc.circle(gx, gy, 420, O('mg', { strokeWidth: 14 }));
    D.at(250, 860, pin(t, T.at(2, 'なぜ'), 0.4) * (1 + Math.sin(u * 4) * 0.03), () => D.text('？', 0, 0, 330, { font: MARK, color: '#e2742b', outline: 20, outlineColor: INK }), -0.1);
    rows(t, [['c1', 'なぜ、{ウソ}が必要だったのか？', 420, 62, T.s(2), T.to(2, 'でしょうか')]]);
  });

  // 3  当時、鉄道はもう古いと言われていました。
  scene(T.s(3) - 0.08, (t, u) => {
    const old = T.at(3, 'もう古い');
    D.bg('sky'); D.bg('paper', 1500);
    D.cloud('d1', 200 + u * 10, 1020, 260);
    // above: the car and the plane race ahead
    const k = prog(t, old - 0.1, 0.5);
    if (k > 0) {
      const px = lerp(-300, 760, easeOut(prog(t, old - 0.1, 1.0))), cx = lerp(-320, 520, easeOut(prog(t, old + 0.1, 1.0)));
      for (let i = 0; i < 4; i++) { rc.line(px - 330 - i * 60, 700 + i * 22, px - 240 - i * 60, 700 + i * 22, O('spp' + i, { strokeWidth: 6 })); rc.line(cx - 250 - i * 50, 890 + i * 20, cx - 180 - i * 50, 890 + i * 20, O('spc' + i, { strokeWidth: 6 })); }
      D.plane('pl', px, 730, 1.15, -0.05); D.car('car', cx, 960, 1.25);
      D.label('new3', 'これからは車と飛行機', 760, 1085, 44, t, old + 0.4, old + 1.0, { fill: '#fff6cf' });
    }
    D.rail('rail3', 1500);
    D.steam('st', 160 + u * 14, 1500, 1.75, u);
    if (t > old) rc.path('M 700 1180 Q 760 1250 770 1400 M 640 1240 Q 720 1260 770 1400 M 740 1150 Q 770 1260 770 1400 M 660 1210 Q 720 1200 762 1300', O('web3', { strokeWidth: 3, stroke: '#8d8a84' }));
    D.stamp('old', 'もう古い', 470, 1300, 130, -0.1, t, old, { fill: 'rgba(251,247,238,0.93)' });
    D.tag('tg3', '1950年代', t, T.s(3));
    rows(t, [
      ['d1', '当時、鉄道は…', 370, 58, T.s(3), T.to(3, '鉄道は')],
      ['d2', '「{もう古い}」と言われていた', 490, 58, old, T.e(3)],
    ]);
  });

  // 4  東京と大阪を結ぶ高速鉄道の計画は、ピラミッド、万里の長城、戦艦大和に続く「世界四バカ」とまで笑われました。
  scene(T.s(4) - 0.08, (t, u) => {
    const four = T.at(4, 'に続く') - 0.08, laugh = T.at(4, 'とまで') - 0.08;
    const folly = (n, name, fn) => v => {   // one of the three follies, alone and big
      D.bg('wall'); D.ground(1540, '#bdb4a3');
      fn(v);
      D.at(170, 760, pin(t, t - v, 0.3), () => { rc.circle(0, 0, 190, O('no' + n, { fill: '#fff6cf', strokeWidth: 6 })); D.text(String(n), 0, 6, 130, { font: MARK, color: RED }); });
      D.label('fn' + n, name, 620, 770, 88, t, t - v + 0.05, t - v + 0.3, { font: MARK, bold: true });
    };
    const plan = (x, y, k) => D.at(x, y, k, () => {   // the plan of the fast railway, on blue paper
      rc.rectangle(-400, -230, 800, 460, O('plan', { fill: '#2f5fa8', strokeWidth: 6 }));
      const w = { stroke: '#eaf2fb', strokeWidth: 5 };
      rc.path('M -330 60 C -328 8, -240 -40, -122 -44 L 330 -44 L 330 106 L -266 106 C -306 104, -330 86, -330 60 Z', O('pl1', w));
      for (let i = 0; i < 6; i++) rc.rectangle(-70 + i * 64, -20, 40, 30, O('plw' + i, w));
      rc.line(-360, 150, 360, 150, O('pl2', w)); for (const cx of [-210, -150, 150, 210]) rc.circle(cx, 124, 36, O('plc' + cx, w));
      D.text('高速鉄道　計画図', 0, -168, 52, { font: MARK, color: '#eaf2fb' });
    }, -0.02);
    shots(t, [
      [-1, v => {   // the plan: a fast line from Tokyo to Osaka
        D.bg('green');
        rc.path('M -20 1460 C 200 1370, 420 1440, 620 1380 C 800 1330, 960 1370, 1100 1320 L 1100 1940 L -20 1940 Z', O('sea', { fill: '#bcd9ea', strokeWidth: 4 }));
        D.fuji('fj', 620, 1210, 1.05);
        const p = easeInOut(prog(t, T.at(4, '結ぶ') - 0.4, 1.3));
        const pt = q => [lerp(880, 200, q), 1290 + Math.sin(q * Math.PI) * 60 + q * 40];
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.setLineDash([30, 24]);
        ctx.beginPath(); for (let q = 0; q <= p + 0.001; q += 0.02) { const [x, y] = pt(q); q === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore();
        D.mappin('pt', 880, 1290, pin(t, T.s(4)) * 1.5, '#d6453a'); D.mappin('po', 200, 1330, pin(t, T.at(4, '大阪')) * 1.5, '#3d74c4');
        D.label('lt', '東京', 880, 1020, 76, t, T.s(4), T.s(4) + 0.25, { font: MARK }); D.label('lo', '大阪', 200, 1060, 76, t, T.at(4, '大阪'), T.at(4, '大阪') + 0.25, { font: MARK });
        if (p > 0.02 && p < 0.98) { const [x, y] = pt(p); D.train('mini', x - 60, y + 34, 0.42, { len: 420 }); }
        D.stamp('pl4', '計画', 560, 820, 110, -0.08, t, T.at(4, '計画は'), { color: '#2f5fa8', fill: 'rgba(251,247,238,0.93)' });
      }],
      [T.at(4, 'ピラミッド') - 0.08, folly(1, 'ピラミッド', v => D.pyramid('py', 540, 1540, 2.5))],
      [T.at(4, '万里') - 0.08, folly(2, '万里の長城', v => D.wall('gw', 540, 1500, 2.6))],
      [T.at(4, '戦艦') - 0.08, folly(3, '戦艦大和', v => D.battleship('bs', 540, 1470, 2.4, u))],
      [four, v => {   // and the fourth: the plan
        D.bg('wall');
        [[190, v2 => D.pyramid('py4', 0, 60, 0.62)], [540, v2 => D.wall('gw4', 0, 60, 0.62)], [890, v2 => D.battleship('bs4', 0, 50, 0.58, u)]].forEach(([x, fn], i) => D.card('c4' + i, x, 800, 300, 250, 1, [-0.03, 0.02, -0.02][i], () => { fn(); D.text('①②③'[i], -112, -86, 54, { font: MARK, color: RED }); }));
        plan(540, 1260, pin(t, four, 0.35));
        D.at(140, 1010, pin(t, four + 0.15), () => { rc.circle(0, 0, 170, O('no4', { fill: '#fff6cf', strokeWidth: 6 })); D.text('4', 0, 6, 116, { font: MARK, color: RED }); });
        D.stamp('baka', '世界四バカ', 540, 1290, 150, -0.1, t, T.at(4, '世界四バカ'), { fill: 'rgba(251,247,238,0.94)' });
      }],
      [laugh, v => {   // and everybody laughs
        D.bg('wall');
        [[190, 900, '#3a4a3a', '#d9a521', true], [540, 850, '#2f3f5a', '#c0392b', false], [890, 900, '#4b3f2a', '#2e8b57', true]].forEach(([x, y, suit, tie, hat], i) => D.face('lf4' + i, x, y + Math.sin(u * 14 + i * 2) * 8, 0.56, { mood: 'laugh', suit, tie, hat: hat ? true : null, hair: hat ? null : '#4a3b2e', tears: true, flip: i === 2 }));
        plan(540, 1380, 0.8);
        D.haha(t, laugh, [[330, 660, -0.12], [760, 650, 0.12], [540, 1130, 0]], u);
      }],
    ]);
    rows(t, [
      ['e1', t < T.at(4, 'ピラミッド') - 0.08 ? '東京と大阪を結ぶ{高速鉄道}の計画は' : 'ピラミッド、万里の長城、戦艦大和', 370, 52, t < T.at(4, 'ピラミッド') - 0.08 ? T.s(4) : T.at(4, 'ピラミッド'), t < T.at(4, 'ピラミッド') - 0.08 ? T.to(4, '計画は') : T.to(4, '戦艦大和')],
      ['e2', 'に続く「{世界四バカ}」と笑われた', 490, 58, T.at(4, 'に続く'), T.e(4)],
    ]);
  });

  // 5  しかも建設費は、国会が認めるはずのない金額でした。
  scene(T.s(5) - 0.08, (t, u) => {
    const no = T.at(5, 'ない');
    shots(t, [
      [-1, v => {   // the cost: a tower of coins that will not stop growing
        D.bg('paper'); D.ground(1580);
        const n = Math.round(lerp(6, 44, easeOut(prog(v, 0, 1.1))));
        D.tower('tw5', 600, 1580, n, 1.3);
        sogo('s5', 190, 1580, { scale: 1.5, mood: 'wow', arm: -1.1, arm2: 1.1, look: 6 });
        D.label('cl5', '建設費', 860, 1200, 78, t, T.at(5, '建設費'), T.to(5, '建設費'), { font: MARK, bold: true, fill: '#fff6cf' });
      }],
      [T.at(5, '国会') - 0.08, v => {   // far too much for the Diet
        D.bg('paper'); D.ground(1580);
        D.tower('tw5b', 850, 1580, 44, 1.15);
        D.diet('dt5', 340, 1580, 0.95);
        D.label('dn5', '国会', 340, 1100, 64, t, T.at(5, '国会'), T.at(5, '国会') + 0.2, { font: MARK });
        const k = pin(t, no, 0.35);
        D.at(340, 1330, k, () => { rc.circle(0, 0, 330, O('nosign', { fill: '#fbf7ee', strokeWidth: 10, stroke: RED })); });
        D.cross('x5', 340, 1330, 96, t, no);
        ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.moveTo(40, 1180); ctx.lineTo(1040, 1180); ctx.stroke(); ctx.restore();
      }],
    ]);
    rows(t, [
      ['g1', 'しかも、建設費は…', 370, 58, T.s(5), T.to(5, '建設費は')],
      ['g2', '国会が{認めるはずのない}金額', 490, 58, T.at(5, '国会'), T.e(5)],
    ]);
  });

  // 6  すると十河は、こう言ったと伝えられています。
  scene(T.s(6) - 0.08, (t, u) => {
    D.bg('wood'); D.ground(1580, '#8c6238', 0.5);
    estimate('est6', 790, 1090, 330, 470, '見積もり', 0.04);
    [[650, 0], [800, 1], [950, 2]].forEach(([x, i]) => D.person('en' + i, x, 1640, { scale: 1.25, helmet: true, suit: '#4f7fa8', plain: true, mood: 'flat', worry: true, flip: true, arm: -1.3, arm2: -1.3, bob: Math.sin(u * 4 + i) * 1.5 }));
    sogoFace('f6', 270, 1130, 1.0, { mood: 'stern' });
    D.at(430, 800, pin(t, T.at(6, 'こう'), 0.3), () => { rc.path('M -110 -70 Q -110 -110 -70 -110 L 70 -110 Q 110 -110 110 -70 L 110 30 Q 110 70 70 70 L -30 70 L -80 130 L -66 70 L -70 70 Q -110 70 -110 30 Z', O('bl6', { fill: '#fffdf4', strokeWidth: 6 })); for (const dx of [-50, 0, 50]) rc.circle(dx, -20, 26 + Math.sin(u * 8 + dx) * 4, O('dot6' + dx, { fill: INK })); });
    D.label('h1', '十河は、こう言ったと伝えられている', W / 2, 400, 52, t, T.s(6), T.to(6, '伝えられて'));
  });

  // 7  「半分にした予算が国会を通れば、あとはおれが責任を持つ。心配するな」。
  scene(T.s(7) - 0.08, (t, u) => {
    const cut = T.at(7, '半分');
    shots(t, [
      [-1, v => {   // the estimate, cut in half
        D.bg('wood');
        const p = easeOut(prog(t, cut + 0.25, 0.6));
        estimate('est7a', 540 - 150 - p * 40, 1120, 300, 620, '', -p * 0.03);
        D.fade(1 - p * 0.9, () => estimate('est7b', 540 + 150 + p * 190, 1120 + p * p * 260, 300, 620, '', p * 0.7));
        D.text('見積もり', 540 - p * 190, 760, 70, { font: MARK });
        const sy = lerp(700, 1500, prog(t, cut - 0.05, 0.35));   // the scissors come down
        D.at(540, sy, 1.5, () => { rc.line(-10, -150, 40, 40, O('sc1', { strokeWidth: 14, stroke: '#8d9197' })); rc.line(10, -150, -40, 40, O('sc2', { strokeWidth: 14, stroke: '#8d9197' })); rc.circle(52, 74, 70, O('sc3', { stroke: RED, strokeWidth: 12 })); rc.circle(-52, 74, 70, O('sc4', { stroke: RED, strokeWidth: 12 })); });
        D.stamp('half', '半分', 330, 1480, 120, -0.1, t, cut + 0.4, { fill: 'rgba(251,247,238,0.93)' });
      }],
      [T.at(7, '国会') - 0.08, v => {   // if the half goes through the Diet…
        D.bg('paper'); D.ground(1580);
        D.diet('dt7', 620, 1580, 1.25);
        const q = easeInOut(prog(v, 0, 0.8));
        estimate('est7c', lerp(140, 610, q), lerp(1250, 1500, q), 150, 250 - q * 120, '', -0.1);
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.setLineDash([22, 18]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(150, 1420); ctx.quadraticCurveTo(380, 1560, 590, 1540); ctx.stroke(); ctx.restore();
        D.at(880, 960, pin(t, T.at(7, '通れば') + 0.15), () => { rc.circle(0, 0, 220, O('ok7', { fill: '#e7f3df', strokeWidth: 8, stroke: '#2e8b57' })); rc.linearPath([[-56, 0], [-14, 46], [62, -50]], O('ok7c', { stroke: '#2e8b57', strokeWidth: 20 })); });
      }],
      [T.at(7, 'あとは') - 0.08, v => {   // "the rest is on me": he takes the rock on his back
        D.bg('wood'); D.ground(1600, '#8c6238', 0.5);
        const drop = easeOut(prog(v, 0, 0.45));
        ctx.save(); ctx.translate(540, 1600); ctx.scale(2.0, 2.0);
        rock('rk7', 30, lerp(-640, -330, drop), 0.92);
        sogo('s7', 0, 0, { scale: 1, mood: 'stern', lean: 0.22 * drop, arm: -1.9, arm2: -1.3 });
        ctx.restore();
        if (drop >= 1) D.sweat(330, 1080, u, 2.2);
      }],
      [T.at(7, '心配') - 0.08, v => {   // "do not worry"
        D.bg('wood');
        sogoFace('f7', 400, 1180, 1.25, { mood: 'ok' });
        D.balloon('q7', [['心配するな', T.at(7, '心配'), T.to(7, 'するな')]], 690, 800, 96, t, T.at(7, '心配') - 0.06, 520, 990, { font: MARK });
        rock('rk7b', 860, 1430, 0.8);
      }],
    ]);
    rows(t, [
      ['q1', '「半分にした予算が国会を通れば、', 370, 54, cut, T.to(7, '通れば')],
      ['q2', 'あとは{おれが責任を持つ}。心配するな」', 490, 52, T.at(7, 'あとは'), T.to(7, 'するな')],
    ]);
  });

  // 8  わざと安く見せた予算は、国会を通りました。
  scene(T.s(8) - 0.08, (t, u) => {
    const pass = T.at(8, '通りました');
    shots(t, [
      [-1, v => {   // the top half of the tower is hidden: only the "budget" is shown
        D.bg('paper'); D.ground(1580);
        D.tower('tw8', 540, 1580, 44, 1.3);
        const k = easeOut(prog(v, 0, 0.55));
        D.at(540, lerp(300, 880, k), 1, () => { rc.rectangle(-260, -330, 520, 520, O('cloth8', { fill: '#7a5c8f', strokeWidth: 6 })); for (let i = 0; i < 4; i++) rc.line(-200 + i * 130, -330, -230 + i * 130, 190, O('fold8' + i, { strokeWidth: 3, stroke: '#5a3f6f' })); rc.line(-290, -330, 290, -330, O('rod8', { strokeWidth: 14, stroke: '#5a3d22' })); });
        D.label('bd8', '予算', 870, 1330, 86, t, T.at(8, '予算は'), T.at(8, '予算は') + 0.25, { font: MARK, bold: true, fill: '#fff6cf' });
        if (t > T.at(8, '予算は')) rc.line(780, 1330, 660, 1330, O('ar8', { stroke: RED, strokeWidth: 10 }));
        sogo('s8', 170, 1580, { scale: 1.4, mood: 'flat', arm: -1.6, arm2: 1.1 });
        D.at(250, 1140, pin(t, T.at(8, '安く'), 0.3), () => D.text('しーっ', 0, 0, 70, { font: MARK, color: '#e2742b', outline: 12 }), -0.1);
      }],
      [T.at(8, '国会') - 0.08, v => {   // and it goes through
        D.bg('paper'); D.ground(1580);
        D.diet('dt8', 540, 1580, 1.3);
        estimate('bud8', 540, 900, 300, 300, '予算', -0.04);
        D.stamp('pass', '可決', 600, 930, 170, -0.18, t, pass, { fill: 'rgba(251,247,238,0.9)' });
        if (t > pass) D.burst('pb', 600, 930, 220 + prog(t, pass, 0.3) * 50, 14, '#e2742b', 8);
      }],
    ]);
    rows(t, [
      ['i1', 'わざと{安く見せた}予算は…', 370, 58, T.s(8), T.to(8, '予算は')],
      ['i2', '国会を通った', 490, 62, T.at(8, '国会'), T.e(8), { font: MARK }],
    ]);
  });

  // 9  けれど工事費は、予算のほぼ2倍にふくらみます。 — the cloth falls: the whole tower
  scene(T.s(9) - 0.08, (t, u) => {
    const a = T.at(9, '予算の');
    D.bg('paper'); D.ground(1580);
    D.tower('tw9', 620, 1580, 44, 1.3);
    const f = easeOut(prog(t, a - 0.3, 0.7));
    D.fade(1 - f, () => D.at(620, 880 + f * f * 900, 1, () => { rc.rectangle(-260, -330, 520, 520, O('cloth9', { fill: '#7a5c8f', strokeWidth: 6 })); rc.line(-290, -330, 290, -330, O('rod9', { strokeWidth: 14, stroke: '#5a3d22' })); }, f * 0.5));
    ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.moveTo(380, 1094); ctx.lineTo(1040, 1094); ctx.stroke(); ctx.restore();
    D.label('b9a', '予算', 250, 1340, 76, t, T.s(9) + 0.1, T.s(9) + 0.3, { font: MARK, fill: '#fff6cf' });
    for (const [y0, y1, id] of [[1570, 1104, 'a']]) { rc.line(410, y0, 410, y1, O('br9' + id, { strokeWidth: 8 })); rc.line(390, y0, 430, y0, O('br9b' + id, { strokeWidth: 8 })); rc.line(390, y1, 430, y1, O('br9c' + id, { strokeWidth: 8 })); }
    if (f > 0.5) { rc.line(860, 1570, 860, 620, O('br9x', { strokeWidth: 8, stroke: RED })); rc.line(840, 1570, 880, 1570, O('br9y', { strokeWidth: 8, stroke: RED })); rc.line(840, 620, 880, 620, O('br9z', { strokeWidth: 8, stroke: RED })); }
    D.label('b9b', '工事費', 250, 800, 76, t, T.at(9, '工事費'), T.to(9, '工事費'), { font: MARK, fill: '#fff6cf' });
    D.stamp('x2', 'ほぼ2倍', 300, 1050, 110, -0.1, t, T.at(9, '2倍'), { fill: 'rgba(251,247,238,0.93)' });
    D.person('wk9', 980, 1640, { scale: 1.1, helmet: true, suit: '#4f7fa8', plain: true, mood: f > 0.5 ? 'wow' : 'flat', worry: true, flip: true, arm: f > 0.5 ? -1.2 : 1.0 });
    rows(t, [
      ['j1', 'けれど、工事費は…', 370, 58, T.s(9), T.to(9, '工事費は')],
      ['j2', '予算の{ほぼ2倍}にふくらんだ', 490, 58, a, T.e(9)],
    ]);
  });

  // 10 十河は責任を取る形で、開業の前の年に国鉄を去りました。
  scene(T.s(10) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // he takes the rock on himself and bows
        D.bg('wall'); D.ground(1600, '#bdb4a3');
        const bow = easeInOut(prog(t, T.at(10, '責任'), 0.7)) * 0.3;   // a deep bow, the rock still on his back
        ctx.save(); ctx.translate(430, 1600); ctx.scale(2.0, 2.0); ctx.rotate(bow);
        rock('rk10', 30, -330, 0.92);
        sogo('s10', 0, 0, { scale: 1, mood: 'sad', lean: 0.22, arm: -1.9, arm2: -1.3 });
        ctx.restore();
        for (let i = 0; i < 3; i++) { rc.line(860 + i * 70, 1600, 840 + i * 70, 1250, O('mic' + i, { strokeWidth: 7 })); rc.ellipse(838 + i * 70, 1230, 44, 64, O('mich' + i, { fill: '#4b4f54', strokeWidth: 4 })); }
      }],
      [T.at(10, '開業') - 0.08, v => {   // the year before the opening, he walks out
        D.bg('wall'); D.ground(1600, '#bdb4a3');
        rc.rectangle(40, 900, 400, 700, O('hq', { fill: '#cfc7b6' }));
        for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) rc.rectangle(82 + c * 116, 1030 + r * 120, 76, 74, O('hqw' + r + c, { fill: '#cfe6f3', strokeWidth: 3.5 }));
        rc.rectangle(80, 922, 320, 80, O('hqs', { fill: '#1f4d3a', strokeWidth: 4 })); D.text('国鉄本社', 240, 964, 52, { font: MARK, color: '#f3e9c6' });
        sogo('s10b', lerp(470, 800, prog(v, 0, 2.4)), 1600, { scale: 1.9, mood: 'sad', arm: 1.35, arm2: 1.2, bag: true, bob: Math.abs(Math.sin(v * 5)) * -4, step: Math.sin(v * 5) * 0.6, lean: 0.04, look: 4 });
        D.calendar('cal10a', 640, 800, pin(t, T.at(10, '開業') - 0.08, 0.3) * 0.62, '1963');
        D.fade(0.55, () => D.calendar('cal10b', 900, 800, pin(t, T.at(10, '開業') + 0.2, 0.3) * 0.62, '1964', '開業'));
        if (t > T.at(10, '開業') + 0.2) { rc.circle(640, 820, 250, O('ring10', { stroke: RED, strokeWidth: 9 })); }
      }],
    ]);
    rows(t, [
      ['k1', '十河は{責任を取る}形で', 370, 58, T.s(10), T.to(10, '形で')],
      ['k2', '開業の前の年に、国鉄を去った', 490, 56, T.at(10, '開業'), T.e(10)],
    ]);
  });

  // 11 1964年10月1日、新幹線が走り出した朝、東京駅の出発式に、十河は招かれませんでした。
  scene(T.s(11) - 0.08, (t, u) => {
    const gone = T.at(11, '十河は') - 0.08;
    shots(t, [
      [-1, v => { D.bg('wall'); D.calendar('cal11', 540, 1120, pin(t, T.s(11), 0.35) * 2.05, '1964', '10月1日'); }],
      [T.at(11, '新幹線') - 0.08, v => {   // the morning it first ran
        D.bg('dusk'); D.bg('paper', 1480);
        rc.circle(780, 1180, 420, O('sun11', { fill: '#f6b05a', strokeWidth: 5 })); D.burst('sunb', 780, 1180, 250 + Math.sin(u * 3) * 6, 16, '#f2a25a', 8);
        D.fuji('fj11', 300, 1480, 1.5);
        rc.rectangle(-20, 1300, W + 40, 190, O('hz11', { fill: '#d9c9a4', strokeWidth: 4 }));
        D.rail('rail11b', 1480);
        const x = lerp(900, -260, easeOut(prog(v, 0, 1.6)));
        for (let i = 0; i < 5; i++) rc.line(x + 1500 + i * 30, 1280 + i * 34, x + 1680 + i * 30, 1280 + i * 34, O('sp11' + i, { strokeWidth: 7 }));
        D.train('tr11b', x, 1480, 1.35, { len: 1200 });
      }],
      [T.at(11, '東京駅') - 0.08, v => {   // the ceremony at Tokyo Station
        D.bg('sky');
        rc.rectangle(-20, 640, W + 40, 44, O('roof11', { fill: '#8b9aa5' }));
        for (let i = 0; i < 12; i++) rc.polygon([[30 + i * 90, 684], [100 + i * 90, 684], [65 + i * 90, 754]], O('flag' + i, { fill: ['#d6453a', '#f6c543', '#3d74c4', '#fbf7ee'][i % 4], strokeWidth: 3 }));
        D.rail('rail11', 1330); D.train('tr11', 230, 1330, 1.25, { len: 1300 });
        rc.rectangle(-20, 1336, W + 40, 320, O('floor11', { fill: '#cfc8ba' })); D.bg('paper', 1656);
        rc.rectangle(740, 790, 290, 110, O('board11', { fill: '#fbf7ee', strokeWidth: 5 })); D.text('東京駅', 885, 848, 74, { font: MARK });
        // the ball that opens, its ribbons
        const open = easeOut(prog(v, 0.35, 0.5));
        rc.line(300, 684, 300, 800, O('ks0', { strokeWidth: 5 }));
        for (const dir of [-1, 1]) D.at(300 + dir * open * 60, 880, 1, () => rc.arc(0, 0, 170, 170, dir < 0 ? Math.PI / 2 : -Math.PI / 2, dir < 0 ? Math.PI * 1.5 : Math.PI / 2, true, O('ks' + dir, { fill: '#f6c543' })), dir * open * 0.5);
        if (open > 0.3) { for (let i = 0; i < 5; i++) rc.line(260 + i * 20, 900, 240 + i * 30 + Math.sin(u * 5 + i) * 8, 900 + open * 230, O('rb11' + i, { stroke: ['#d6453a', '#3d74c4', '#f6c543', '#2e8b57', '#d6453a'][i], strokeWidth: 6 })); rc.rectangle(244, 930, 112, 190 * open, O('bn11', { fill: '#fbf7ee', strokeWidth: 4 })); if (open > 0.9) { D.text('祝', 300, 980, 60, { font: MARK, color: RED }); D.text('開業', 300, 1066, 44, { font: MARK, color: RED }); } }
        [[190, '#3a4a3a', '#d9a521', true], [540, '#2f3f5a', '#c0392b', false], [890, '#4b3f2a', '#2e8b57', true]].forEach(([fx, suit, tie, hat], i) => D.face('of11' + i, fx, 1560 + Math.sin(u * 12 + i * 2) * 9, 0.5, { mood: 'laugh', suit, tie, hat: hat ? true : null, hair: hat ? null : '#4a3b2e', flip: i === 2 }));
        D.confetti('cf11', u, 26, 760, 560);
      }],
      [gone, v => {   // every seat has its guest, but one: his
        D.bg('wall'); D.ground(1580, '#bdb4a3');
        [[150, '#3a4a3a', '#d9a521'], [400, '#2f3f5a', '#c0392b'], [650, '#4b3f2a', '#2e8b57'], [900, null, null]].forEach(([x, suit, tie], i) => {
          rc.rectangle(x - 96, 1090, 192, 290, O('chb' + i, { fill: '#8c2f25' })); rc.rectangle(x - 110, 1380, 220, 50, O('chs' + i, { fill: '#a33a2e', strokeWidth: 5 })); rc.line(x - 96, 1430, x - 96, 1580, O('chl' + i, { strokeWidth: 9 })); rc.line(x + 96, 1430, x + 96, 1580, O('chr' + i, { strokeWidth: 9 }));
          if (suit) D.person('gs' + i, x, 1420, { scale: 1.35, suit, tie, noLegs: true, mood: 'ok', arm: 1.3, arm2: 1.3, hat: i === 1 });
          else {
            ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.setLineDash([20, 16]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, 1134, 64, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(x, 1290, 64, 90, 0, 0, 7); ctx.stroke(); ctx.restore();
            D.label('nm11', '十河', x, 940, 80, t, gone + 0.1, gone + 0.3, { font: MARK, bold: true });
            D.cross('x11', x, 1250, 130, t, T.at(11, '招かれ'));
          }
        });
        D.label('inv11', '招待客', 400, 900, 60, t, gone, gone + 0.2, { font: MARK, fill: '#fff6cf' });
      }],
    ]);
    D.tag('tg11', '1964年10月1日', t, T.s(11));
    rows(t, [
      ['l1', '新幹線が走り出した朝', 345, 56, T.at(11, '新幹線'), T.to(11, '朝')],
      ['l2', '東京駅の出発式に…', 460, 56, T.at(11, '東京駅'), T.to(11, '出発式に')],
      ['l3', '十河は{招かれなかった}', 580, 62, T.at(11, '十河は'), T.e(11), { font: MARK, bold: true }],
    ]);
  });

  // 12 80歳の十河は、自宅のテレビでそれを見ていたといいます。
  scene(T.s(12) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // eighty years old
        D.bg('room');
        sogoFace('f12', 520, 1180, 1.45, { mood: 'flat' });
        D.at(860, 800, pin(t, T.s(12) + 0.1, 0.3), () => { rc.circle(0, 0, 280, O('age12', { fill: '#fff6cf', strokeWidth: 7 })); D.text('80歳', 0, 8, 110, { font: MARK, color: RED }); });
      }],
      [T.at(12, '自宅') - 0.08, v => {   // at home, before the television
        D.bg('room'); D.ground(1600, '#b9c08f', 0.6);
        D.tv('tv', 460, 1470, 1.9, () => {
          ctx.fillStyle = '#c9dbe3'; ctx.fillRect(-150, -105, 300, 120); ctx.fillStyle = '#d9c9a4'; ctx.fillRect(-150, 60, 300, 50);
          D.train('tvt', 150 - v * 80, 62, 0.34, { len: 900 });
          ctx.fillStyle = 'rgba(40,50,60,0.10)'; for (let y = -105; y < 105; y += 8) ctx.fillRect(-150, y + (v * 30) % 8, 300, 2);
        });
        rc.ellipse(860, 1640, 330, 60, O('zabu', { fill: '#8d5a8f', strokeWidth: 4.5 }));
        sogo('s12', 860, 1630, { scale: 1.75, noLegs: true, back: true, arm: 1.25, arm2: 1.25 });
      }],
    ]);
    rows(t, [
      ['m1', '{80歳}の十河は…', 370, 60, T.s(12), T.to(12, '十河は')],
      ['m2', '自宅のテレビで、それを見ていた', 490, 54, T.at(12, '自宅'), T.to(12, '見ていた')],
    ]);
    D.label('m3', '…といいます', 800, 610, 42, t, T.at(12, 'といいます'), T.e(12));
  });

  // 13 9年後、その東京駅のホームに、十河の顔を刻んだ記念碑が建ちました。
  scene(T.s(13) - 0.08, (t, u) => {
    const up = T.at(13, '十河の') - 0.08;
    shots(t, [
      [-1, v => { D.bg('wall'); D.yearFlip('cal13', t, T.s(13), T.at(13, 'その'), 1964, 1973, 520, 1120, 2.05, '9年後'); }],
      [T.at(13, 'その') - 0.08, v => {   // the same platform of Tokyo Station
        D.bg('sky'); D.bg('paper', 1650);
        D.platform('pf13', 1560, { height: 860 });
        rc.rectangle(300, 800, 480, 150, O('sg13', { fill: '#fbf7ee', strokeWidth: 6 })); D.text('東京', 540, 878, 110, { font: MARK });
        ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 7; ctx.setLineDash([22, 18]); ctx.strokeRect(390, 1100, 300, 460); ctx.restore();
        D.text('？', 540, 1330, 180, { font: MARK, color: '#e2742b' });
      }],
      [up, v => {   // his face in bronze
        D.bg('sky'); D.bg('paper', 1650);
        D.platform('pf13b', 1560, { height: 860 });
        const k = pin(t, up, 0.45);
        D.monument('mn13', 540, 1560, 1.9 * k, { words: '一花開天下春' });
        const q = prog(t, up, 0.6); D.fade(1 - q, () => D.burst('mb13', 540, 1160, 420 + q * 100, 16, '#e2742b', 9));
      }],
    ]);
    D.tag('tg13', '1973年', t, T.at(13, 'その'));
    rows(t, [
      ['n1', '{9年後}、東京駅のホームに', 370, 58, T.s(13), T.to(13, 'ホームに')],
      ['n2', '十河の顔を刻んだ{記念碑}が建った', 490, 54, T.at(13, '十河の'), T.e(13)],
    ]);
  });

  // 14 新幹線に乗るときは、18番、19番ホームの端を探してみてください。
  scene(T.s(14) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // when you take the Shinkansen
        D.bg('sky'); D.bg('paper', 1650);
        D.rail('rail14', 1420); D.train('tr14', 330, 1420, 1.3, { len: 1300 });
        rc.rectangle(-20, 1426, W + 40, 230, O('floor14', { fill: '#cfc8ba' })); rc.rectangle(-20, 1430, W + 40, 16, O('yl14', { fill: '#f2c230', strokeWidth: 2.5 }));
        const x = lerp(-100, 430, easeOut(prog(v, 0, 1.3)));
        D.person('tv14', x, 1600, { scale: 1.8, suit: '#3f8f7a', plain: true, mood: 'ok', arm: 1.2, arm2: -0.9, bag: true, bob: Math.abs(Math.sin(v * 7)) * -4, step: Math.sin(v * 7) * 0.6, look: 6 });
        D.at(x - 110, 1090, 1, () => { rc.rectangle(-60, -36, 120, 72, O('tk14', { fill: '#fff6cf', strokeWidth: 4 })); D.text('きっぷ', 0, 2, 32, { font: MARK }); }, -0.2);
      }],
      [T.at(14, '18番') - 0.08, v => {   // platforms 18 and 19
        D.bg('wall');
        [[300, '18', T.at(14, '18番')], [780, '19', T.at(14, '19番')]].forEach(([x, n, a]) => D.at(x, 1120, pin(t, a - 0.05, 0.3), () => {
          rc.line(0, -470, 0, -210, O('sg' + n, { strokeWidth: 10 }));
          rc.rectangle(-200, -210, 400, 420, O('sq' + n, { fill: '#2f5fa8', strokeWidth: 7 }));
          D.text(n, 0, 10, 280, { font: MARK, color: '#fbf7ee' }); D.text('番線', 0, 250, 60, { font: MARK });
        }));
      }],
      [T.at(14, '端') - 0.08, v => {   // the far end of the platform
        D.bg('sky'); D.bg('paper', 1650);
        D.platform('pf14', 1500, { height: 760, yellow: true });
        D.rail('rail14c', 1490); D.train('tr14c', -700, 1490, 1.0, { len: 1300 });
        rc.rectangle(-20, 1500, W + 40, 70, O('floor14c', { fill: '#c9c3b6' })); rc.rectangle(-20, 1504, W + 40, 14, O('yl14c', { fill: '#f2c230', strokeWidth: 2.5 }));
        D.monument('mn14', 900, 1500, 0.95, {});
        const q = easeOut(prog(v, 0.1, 0.7));
        ctx.save(); ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 18; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(140, 950); ctx.lineTo(140 + 520 * q, 950); ctx.stroke(); if (q >= 1) { ctx.beginPath(); ctx.moveTo(740, 950); ctx.lineTo(660, 900); ctx.lineTo(660, 1000); ctx.closePath(); ctx.fill(); } ctx.restore();
        D.label('end14', 'ホームの端', 400, 840, 76, t, T.at(14, '端') - 0.05, T.at(14, '端') + 0.25, { font: MARK, bold: true, fill: '#fff6cf' });
        D.burst('mb14', 900, 1290, 230 + Math.sin(u * 6) * 10, 14, '#e2742b', 8);
      }],
    ]);
    rows(t, [
      ['p1', '新幹線に乗るときは', 345, 56, T.s(14), T.to(14, 'ときは')],
      ['p2', '{18番・19番}ホームの端を', 460, 60, T.at(14, '18番'), T.to(14, '端を'), { font: MARK }],
      ['p3', '探してみてください', 580, 56, T.at(14, '探して'), T.e(14)],
    ]);
  });

  // 15 ウソの責任を一人で背負った男が、今もそこから、列車を見送っています。
  scene(T.s(15) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // alone, the rock of the lie on his back
        D.bg('wall'); D.ground(1600, '#bdb4a3');
        ctx.save(); const g = ctx.createRadialGradient(540, 1250, 80, 540, 1250, 700); g.addColorStop(0, 'rgba(255,246,207,0.85)'); g.addColorStop(1, 'rgba(255,246,207,0)'); ctx.fillStyle = g; ctx.fillRect(0, 600, W, 1100); ctx.restore();
        egg('egg15', 860, 1470, 0.62, 0.3);
        carrying('s15', 500, 1600, 2.0, u);
      }],
      [T.at(15, '今も') - 0.08, v => {   // he still sees the trains off
        D.bg('dusk'); D.bg('paper', 1650);
        rc.circle(860, 900, 200, O('sun', { fill: '#f2a25a', strokeWidth: 4 }));
        D.cloud('q1', 320 + v * 8, 800, 240);
        D.rail('rail15', 1480);
        D.train('tr15', 460 + Math.pow(prog(v, 0.2, 5.0), 1.7) * 1600, 1480, 1.1, { len: 1500, flip: true });
        rc.rectangle(-20, 1490, W + 40, 170, O('floor15', { fill: '#cfc8ba' })); rc.rectangle(-20, 1494, W + 40, 14, O('yl15', { fill: '#f2c230', strokeWidth: 2.5 }));
        D.monument('mn15', 270, 1600, 1.6, { look: 3, words: '一花開天下春' });
      }],
    ]);
    rows(t, [
      ['q1', '{ウソ}の責任を一人で背負った男が', 370, 54, T.s(15), T.to(15, '男が')],
      ['q2', '今もそこから、列車を見送っている', 490, 54, T.at(15, '今も'), T.e(15)],
    ]);
    const c = prog(t, T.e(15) + 0.2, 0.5);
    if (c > 0) D.fade(c, () => D.text('声：VOICEVOX:青山龍星　／　音楽：竹笛', W / 2, 1720, 34, { color: '#5a5347' }));
  });

  return scenes;
};
