// 「ほら吹き」と笑われた男が、日本で最初の地下鉄をつくった — the scenes, one for each spoken line (story.json).
// T.s(i) / T.e(i): when line i starts / ends; T.at(i, "words") / T.to(i, "words"): when the voice reaches / ends them.
window.SCENES = function (T) {
  const { W, H, ctx, rc, O, prog, pin, clamp, lerp, easeOut, easeInOut, easeBack, MARK, INK } = D;
  const RED = '#cf2e23', YELLOW = '#f2c230';
  // Hayakawa Noritsugu: dark hair, round glasses, a moustache, a brown suit (grey hair in his last years)
  const haya = (key, x, y, o) => D.person(key, x, y, Object.assign({ hair: '#2b2622', glasses: true, mustache: true, suit: '#6a4f35', tie: '#2e6b4f' }, o));
  const rows = (t, list) => list.forEach(([key, text, y, size, a, b, o]) => D.label(key, text, W / 2, y, size, t, a, b, o));
  const scenes = [];
  const scene = (start, draw) => scenes.push({ start, draw });

  // ---------- the things of this story ----------
  // the first subway car (yellow, a brown roof), its front to the right; (x, y): its back end on the rail
  const car = (key, x, y, s, o = {}) => {
    const L = o.len || 520, body = o.body || YELLOW;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (const wx of [70, 132, L - 132, L - 70]) rc.circle(wx, -16, 34, O(key + 'wh' + wx, { fill: '#4b4f54', strokeWidth: 3.5, roughness: 0.4 }));
    rc.rectangle(0, -190, L, 160, O(key + 'b', { fill: body }));
    rc.rectangle(-8, -206, L + 16, 24, O(key + 'roof', { fill: o.roof || '#8a4a2c', strokeWidth: 4 }));
    for (let wx = 26; wx < L - 70; wx += 76) rc.rectangle(wx, -164, 52, 58, O(key + 'w' + wx, { fill: '#dff1fa', strokeWidth: 3, roughness: 0.4 }));
    rc.line(0, -86, L, -86, O(key + 'belt', { strokeWidth: 3 }));
    const dx = o.doorAt == null ? L - 52 : o.doorAt, dw = o.doorW || 34;
    rc.rectangle(dx, -164, dw, 126, O(key + 'door', { fill: o.open ? '#2a2a2e' : body, strokeWidth: 3 }));
    if (!o.open && dw > 50) rc.line(dx + dw / 2, -164, dx + dw / 2, -38, O(key + 'doorm', { strokeWidth: 3 }));
    rc.circle(L - 4, -62, 22, O(key + 'lamp', { fill: '#fff3b0', strokeWidth: 3 }));
    ctx.restore();
  };
  // the ground cut open: the street at y0, earth under it, a tunnel from y1 to y2 with a rail on its floor
  const cut = (key, y0, y1, y2, earth = '#b98a5a') => {
    rc.rectangle(-20, y0, W + 40, H - y0 + 20, O(key + 'earth', { fill: earth }));
    rc.rectangle(-20, y1, W + 40, y2 - y1, O(key + 'tunnel', { fill: '#3d3b40' }));
    D.rail(key + 'rail', y2 - 14);
  };
  const building = (key, x, y, w, h, color, cols = 3) => {
    rc.rectangle(x, y - h, w, h, O(key, { fill: color }));
    const gap = w / (cols + 0.5);
    for (let r = 0; r * 86 + 70 < h; r++) for (let c = 0; c < cols; c++) rc.rectangle(x + gap * (c + 0.45), y - h + 34 + r * 86, gap * 0.55, 46, O(key + 'w' + r + c, { fill: '#cfe6f3', strokeWidth: 3, roughness: 0.5 }));
  };
  // the way down to the subway: a little roof on posts, a sign, steps going down; (x, y): the middle of its foot
  const entrance = (key, x, y, s, sign = '地下鉄', h = 250) => {
    D.at(x, y, s, () => {
      rc.rectangle(-150, -30, 300, 30, O(key + 'curb', { fill: '#b9b3a6' }));
      rc.polygon([[-130, -30], [130, -30], [100, -6], [-100, -6]], O(key + 'hole', { fill: '#3d3b40', strokeWidth: 4 }));
      for (let i = 0; i < 3; i++) rc.line(-112 + i * 10, -24 + i * 6, 112 - i * 10, -24 + i * 6, O(key + 'st' + i, { stroke: '#8d8a84', strokeWidth: 3 }));
      rc.line(-140, -30, -140, -h, O(key + 'p1', { strokeWidth: 9 })); rc.line(140, -30, 140, -h, O(key + 'p2', { strokeWidth: 9 }));
      rc.rectangle(-170, -h - 80, 340, 90, O(key + 'sign', { fill: '#1f4d3a' }));
      D.text(sign, 0, -h - 34, 60, { font: MARK, color: '#f3e9c6' });
    });
  };
  const bean = (x, y, dark, k = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(k, k); ctx.fillStyle = dark ? '#3a2c22' : '#f6efdc'; ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.ellipse(0, 0, 17, 12, 0.5, 0, 7); ctx.fill(); ctx.stroke(); ctx.restore(); };
  const share = (key, x, y, rot, k = 1) => D.at(x, y, k, () => { rc.rectangle(-58, -40, 116, 80, O(key, { fill: '#fbf8ef', strokeWidth: 4 })); rc.rectangle(-48, -30, 96, 60, O(key + 'in', { stroke: '#3d74c4', strokeWidth: 2.5 })); D.text('株', 0, 2, 46, { font: MARK, color: '#3d74c4' }); }, rot);
  const haha = (t, a, spots, u) => spots.forEach(([x, y, r], i) => { const k = pin(t, a + i * 0.12, 0.25); if (k > 0) D.at(x, y + Math.sin(u * 9 + i) * 6, k, () => D.text('ハハハ', 0, 0, 66, { font: MARK, color: '#e2742b', outline: 12 }), r); });
  const LINES = [   // the colours of a subway map
    ['#f39700', [[60, 760], [420, 760], [640, 980], [1020, 980]]], ['#e60012', [[60, 1240], [300, 1000], [620, 1000], [860, 760], [1020, 760]]],
    ['#9caeb7', [[200, 660], [200, 900], [520, 1220], [1020, 1220]]], ['#00a7db', [[60, 900], [760, 900], [900, 1040], [900, 1380]]],
    ['#009944', [[60, 1100], [380, 1100], [560, 1280], [1020, 1280]]], ['#d7c447', [[420, 660], [420, 1380]]],
    ['#9b7cb6', [[60, 1340], [660, 1340], [780, 1220], [780, 660]]], ['#00ada9', [[620, 660], [620, 1160], [1020, 1160]]], ['#bb641d', [[60, 1000], [200, 1000], [540, 660]]],
  ];
  const metro = (p, alpha = 1) => {
    ctx.save(); ctx.globalAlpha *= alpha; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    LINES.forEach(([color, pts], i) => {
      const q = clamp(p * 1.6 - i * 0.07); if (q <= 0) return;
      let total = 0; const seg = []; for (let j = 1; j < pts.length; j++) { const l = Math.hypot(pts[j][0] - pts[j - 1][0], pts[j][1] - pts[j - 1][1]); seg.push(l); total += l; }
      let left = total * q;
      ctx.strokeStyle = INK; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(...pts[0]);
      const path = [pts[0]];
      for (let j = 1; j < pts.length && left > 0; j++) { const f = Math.min(1, left / seg[j - 1]); path.push([lerp(pts[j - 1][0], pts[j][0], f), lerp(pts[j - 1][1], pts[j][1], f)]); left -= seg[j - 1]; }
      path.slice(1).forEach(pt => ctx.lineTo(...pt)); ctx.stroke();
      ctx.strokeStyle = color; ctx.lineWidth = 20; ctx.beginPath(); ctx.moveTo(...path[0]); path.slice(1).forEach(pt => ctx.lineTo(...pt)); ctx.stroke();
      ctx.fillStyle = '#fbf7ee'; ctx.strokeStyle = INK; ctx.lineWidth = 4;
      path.slice(0, q >= 1 ? path.length : path.length - 1).forEach(pt => { ctx.beginPath(); ctx.arc(pt[0], pt[1], 13, 0, 7); ctx.fill(); ctx.stroke(); });
    });
    ctx.restore();
  };

  // ---------- lines 0–4, drawn the second way (26/11/2026): one big picture for every part of a sentence ----------
  // shots(t, [[start, draw(v)], …]): the picture of the moment; each new one comes in with a small push
  const shots = (t, list) => {
    let cur = list[0]; for (const s of list) if (t >= s[0]) cur = s;
    const k = 1 + 0.05 * (1 - easeOut(clamp((t - cur[0]) / 0.22)));
    ctx.save(); ctx.translate(540, 1100); ctx.scale(k, k); ctx.translate(-540, -1100);
    cur[1](Math.max(0, t - cur[0])); ctx.restore();
  };
  const skyline = (key, y, list) => list.forEach(([x, w, h, c, cols], i) => building(key + i, x, y, w, h, c, cols));
  const tunnel = (key, y1, y2, earth = '#b98a5a') => {   // a big tunnel: lamps on its roof, a rail on its floor
    rc.rectangle(-20, y1, W + 40, y2 - y1, O(key + 'tn', { fill: '#34323a' }));
    for (let x = 90; x < W; x += 220) { rc.line(x, y1, x, y1 + 26, O(key + 'lw' + x, { strokeWidth: 4, stroke: '#8d8a84' })); rc.circle(x, y1 + 44, 34, O(key + 'lp' + x, { fill: '#fff3b0', strokeWidth: 3 })); }
    for (let x = -20; x < W; x += 180) rc.arc(x + 90, y2 - 20, 180, (y2 - y1) * 1.5, Math.PI, Math.PI * 2, false, O(key + 'ar' + x, { stroke: '#4a4750', strokeWidth: 4 }));
    D.rail(key + 'rail', y2 - 16);
  };
  const beam = (x, y, len) => { ctx.save(); const g = ctx.createLinearGradient(x, y, x + len, y); g.addColorStop(0, 'rgba(255,240,150,0.75)'); g.addColorStop(1, 'rgba(255,240,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(x, y - 14); ctx.lineTo(x + len, y - 130); ctx.lineTo(x + len, y + 130); ctx.lineTo(x, y + 14); ctx.closePath(); ctx.fill(); ctx.restore(); };
  const pointer = (key, x1, y1, x2, y2, color) => { const d = Math.hypot(x2 - x1, y2 - y1), ux = (x2 - x1) / d, uy = (y2 - y1) / d; rc.line(x1, y1, x2, y2, O(key + 'a', { strokeWidth: 30 })); rc.line(x1, y1, x2, y2, O(key + 'a', { strokeWidth: 20, stroke: color })); rc.line(x2, y2, x2 + ux * 52, y2 + uy * 52, O(key + 'f', { strokeWidth: 18 })); rc.line(x2, y2, x2 + ux * 50, y2 + uy * 50, O(key + 'f', { strokeWidth: 10, stroke: '#f3c891' })); rc.circle(x2, y2, 44, O(key + 'h', { fill: '#f3c891', strokeWidth: 4 })); };

  // 0  みんなに笑われた「ほら吹き」が、東京のど真ん中に、日本で最初の地下鉄をつくりました。
  scene(0, (t, u) => {
    shots(t, [
      [-1, v => {   // everybody laughs at him
        D.bg('paper'); D.ground(1540);
        haya('h0', 540, 1540, { scale: 2.5, mood: 'stern', arm: 1.1, arm2: 1.1 });
        pointer('pt0a', 235, 1350, 330, 1265, '#3a4a3a'); pointer('pt0b', 845, 1350, 750, 1265, '#4a3636');
        D.face('lf0a', 170, 1130 + Math.sin(u * 14) * 7, 0.62, { mood: 'laugh', suit: '#3a4a3a', tie: '#d9a521', tears: true, hair: '#4a3b2e' });
        D.face('lf0b', 910, 1130 + Math.sin(u * 14 + 2) * 7, 0.62, { mood: 'laugh', suit: '#4a3636', tie: '#3d74c4', tears: true, hat: true, flip: true });
        haha(t, 0.05, [[200, 800, -0.16], [880, 790, 0.14], [540, 1640, 0.03]], u);
        const a = T.at(0, 'ほら吹き');
        D.label('tag0', 'ほら吹き', 540, 700, 84, t, a, a + 0.3, { font: MARK, bold: true, fill: '#fff6cf', color: RED, rot: -0.05 });
        if (t > a + 0.2) { ctx.save(); ctx.strokeStyle = RED; ctx.fillStyle = RED; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(540, 790); ctx.lineTo(540, 850); ctx.stroke(); ctx.beginPath(); ctx.moveTo(540, 890); ctx.lineTo(512, 846); ctx.lineTo(568, 846); ctx.closePath(); ctx.fill(); ctx.restore(); }
      }],
      [T.at(0, '東京') - 0.08, v => {   // the very middle of Tokyo
        D.bg('sky');
        skyline('sk0', 1230, [[-30, 190, 330, '#d9d0bd', 2], [170, 170, 470, '#cfc7b6', 2], [350, 150, 280, '#d6ccb8', 2], [600, 150, 300, '#d9d0bd', 2], [760, 170, 500, '#cfc7b6', 2], [940, 170, 360, '#d6ccb8', 2]]);
        rc.rectangle(-20, 1230, W + 40, 420, O('rd0', { fill: '#b8b2a6' })); D.bg('paper', 1650);
        const ring = easeOut(prog(v, 0.3, 0.5));
        [[430, '#cf2e23'], [320, '#fbf7ee'], [210, '#cf2e23'], [100, '#fbf7ee']].forEach(([r, c], i) => rc.ellipse(540, 1440, r * 2 * ring, r * 0.62 * ring, O('rg0' + i, { fill: c, strokeWidth: 4 })));
        const drop = easeOut(prog(v, 0, 0.35));
        D.mappin('pin0', 540, lerp(500, 1440, drop), 3.3);
        D.label('tk0', '東京', 540, 760, 110, t, T.at(0, '東京'), T.at(0, '東京') + 0.2, { font: MARK, bold: true });
        D.label('mn0', 'ど真ん中', 850, 1150, 62, t, T.at(0, 'ど真ん中'), T.to(0, 'ど真ん中'), { font: MARK, fill: '#fff6cf', rot: 0.05 });
      }],
      [T.at(0, '日本で') - 0.08, v => {   // under it: the first subway
        D.bg('sky');
        skyline('sk0c', 880, [[40, 150, 170, '#d9d0bd', 2], [230, 130, 230, '#cfc7b6', 2], [470, 150, 150, '#d6ccb8', 2], [700, 130, 210, '#d9d0bd', 2], [880, 150, 180, '#cfc7b6', 2]]);
        rc.rectangle(-20, 880, W + 40, H, O('ea0', { fill: '#b98a5a' }));
        tunnel('tn0', 990, 1520);
        const x = lerp(-1500, -250, easeOut(prog(v, 0, 0.9))) + v * 14;
        beam(x + 520 * 2.1, 1504 - 62 * 2.1, 520);
        car('car0', x, 1504, 2.1);
        const a = T.at(0, '最初');
        D.at(830, 800, pin(t, a, 0.35), () => {   // a medal: the first in Japan
          rc.polygon([[-70, 60], [-110, 210], [-50, 170], [-10, 220], [0, 80]], O('md0r1', { fill: '#cf2e23', strokeWidth: 4 })); rc.polygon([[70, 60], [110, 210], [50, 170], [10, 220], [0, 80]], O('md0r2', { fill: '#cf2e23', strokeWidth: 4 }));
          rc.circle(0, 0, 250, O('md0', { fill: '#f6c543' })); rc.circle(0, 0, 200, O('md0i', { stroke: '#b8860b', strokeWidth: 4 }));
          D.text('日本初', 0, 4, 66, { font: MARK, color: '#7a4a12' });
        });
        if (t > a) D.burst('md0b', 830, 800, 150 + Math.sin(u * 8) * 8, 14, '#e2742b', 7);
      }],
    ]);
    D.label('hk1', 'みんなに笑われた「{ほら吹き}」が', W / 2, 345, 60, t, 0, null, { still: true, font: MARK, bold: true });
    D.label('hk2', '日本で最初の{地下鉄}をつくった', W / 2, 490, 68, t, 0, null, { still: true, font: MARK, bold: true });
  });

  // 1  けれど13年後、彼はその地下鉄から追い出されます。
  scene(T.s(1) - 0.08, (t, u) => {
    const a = T.at(1, '追い出され');
    shots(t, [
      [-1, v => {   // the years fly: 1927 → 1940
        D.bg('wall');
        const q = easeInOut(prog(t, T.s(1), T.to(1, '13年後') - T.s(1)));
        const year = Math.round(lerp(1927, 1940, q));
        for (let i = 0; i < 7; i++) { const f = clamp(q * 1.3 - i * 0.12); if (f > 0 && f < 1) D.at(lerp(600, 1150, f), lerp(900, 620 - i * 30, f), 0.6, () => rc.rectangle(-150, -110, 300, 220, O('fly' + i, { fill: '#fbf7ee' })), f * 2.4); }
        D.calendar('cal1', 520, 1120, 2.05, String(year), q >= 1 ? '13年後' : '');
      }],
      [T.at(1, '彼は') - 0.08, v => {   // pushed out of his own train, which leaves without him
        D.bg('wall');
        rc.rectangle(-20, 640, W + 40, 50, O('ceil', { fill: '#8b9aa5' }));
        for (const x of [120, 960]) rc.rectangle(x - 20, 690, 40, 740, O('pil' + x, { fill: '#a9b4bb', strokeWidth: 4 }));
        rc.circle(540, 800, 130, O('clk', { fill: '#fbf7ee' })); rc.line(540, 690, 540, 736, O('clkw', { strokeWidth: 6 })); rc.line(540, 800, 540, 756, O('clkh', { strokeWidth: 6 })); rc.line(540, 800, 574, 812, O('clkm', { strokeWidth: 6 }));
        const leave = Math.pow(prog(t, a + 0.75, 1.4), 2) * 1500;
        D.rail('rail1', 1440);
        car('car1', 300 + leave, 1440, 1.9, { open: t < a + 0.6, doorAt: 190, doorW: 78 });
        rc.rectangle(-20, 1430, W + 40, 220, O('pf1', { fill: '#cfc8ba' })); rc.rectangle(-20, 1434, W + 40, 16, O('pf1e', { fill: '#fbf7ee', strokeWidth: 3 })); D.bg('paper', 1650);
        const p = easeOut(prog(t, a, 0.55));
        const x = lerp(735, 300, p), y = 1540 - Math.sin(p * Math.PI) * 190;
        if (t > a - 0.12 && t < a + 0.45) {   // the arm that pushes
          const ext = Math.sin(prog(t, a - 0.12, 0.57) * Math.PI) * 150;
          rc.line(770, 1250, 770 - ext, 1250, O('push', { strokeWidth: 46, stroke: '#2a2a2e' })); rc.circle(770 - ext, 1250, 66, O('fist', { fill: '#2a2a2e' }));
        }
        ctx.save(); ctx.translate(x, y - 200); ctx.rotate(p > 0 && p < 1 ? -p * Math.PI * 2 : 0); ctx.translate(-x, -(y - 200));
        haya('h1', x, y, { scale: 1.75, hair: '#8d8a84', mood: t > a ? (p < 1 ? 'wow' : 'sad') : 'flat', arm: p > 0 && p < 1 ? -1.2 : 1.2, arm2: p > 0 && p < 1 ? -1.2 : 1.2 });
        ctx.restore();
        if (t > a) { const b = easeOut(prog(t, a, 0.7)); D.at(lerp(735, 560, b), 1540 - Math.sin(b * Math.PI) * 120, 1, () => { rc.rectangle(-44, -66, 88, 66, O('bag1', { fill: '#7a5230', strokeWidth: 4 })); rc.arc(0, -64, 44, 40, Math.PI, 2 * Math.PI, false, O('bag1h', { strokeWidth: 4 })); }, b * 2.2 - 2.2 + 0.3); }
        if (p >= 1) D.sweat(360, 1130, u, 1.7);
      }],
    ]);
    rows(t, [
      ['a1', 'けれど{13年後}…', 370, 60, T.s(1), T.to(1, '13年後')],
      ['a2', 'その地下鉄から{追い出された}', 495, 62, T.at(1, '彼は'), T.e(1), { font: MARK, bold: true }],
    ]);
  });

  // 2  男の名前は、早川徳次といいます。 — who he is, on a card
  scene(T.s(2) - 0.08, (t, u) => {
    D.bg('paper');
    const a = T.at(2, '早川徳次'), k = pin(t, T.s(2), 0.35);
    D.at(540, 1090, k, () => {
      ctx.fillStyle = 'rgba(60,45,20,0.24)'; ctx.fillRect(-440, -410, 900, 840);
      rc.rectangle(-450, -420, 900, 840, O('card2', { fill: '#fbf8ef', strokeWidth: 6 }));
      rc.rectangle(-410, -380, 380, 470, O('ph2', { fill: '#cfe0e6' }));
      ctx.save(); ctx.beginPath(); ctx.rect(-406, -376, 372, 462); ctx.clip();
      D.face('f2', -220, -150, 0.86, { hair: '#2b2622', glasses: true, mustache: true, suit: '#6a4f35', tie: '#2e6b4f', mood: 'ok' });
      ctx.restore();
      rc.rectangle(-410, -380, 380, 470, O('ph2f', { strokeWidth: 6 }));
      if (t > a) {
        const n = Math.ceil(4 * clamp((t - a) / (T.to(2, '早川徳次') - a)));
        D.text('はやかわ　のりつぐ', 200, -330, 38, { color: '#5a5347' });
        D.text('早川徳次'.slice(0, n), 20, -240, 104, { font: MARK, align: 'left' });
        rc.line(10, -170, 410, -170, O('ul2', { strokeWidth: 5, stroke: RED }));
      }
      const b = a + 0.75;
      if (t > b) D.fade(prog(t, b, 0.25), () => { D.text('1881年', 20, -90, 54, { align: 'left' }); D.text('山梨県生まれ', 20, -20, 54, { align: 'left' }); });
      // the yellow car along the foot of the card
      D.rail('r2', 360, -410, 410); car('c2', lerp(-420, -180, easeOut(prog(t, b, 0.8))), 362, 0.95);
    });
    D.label('n3', '「地下鉄の父」', 760, 1190, 58, t, a + 1.0, a + 1.25, { rot: -0.05, fill: '#1f4d3a', color: '#f3e9c6', font: MARK });
    rows(t, [['n1', '男の名前は…', 400, 60, T.s(2), T.to(2, '名前は')]]);
  });

  // 3  1914年、ロンドンで地下鉄を見た早川は、東京にもつくろうと決めました。
  scene(T.s(3) - 0.08, (t, u) => {
    const idea = T.at(3, '東京にも');
    shots(t, [
      [-1, v => {   // London
        D.bg('sky');
        D.cloud('c3a', 260 + v * 16, 760, 300); D.cloud('c3b', 470 + v * 10, 900, 180);
        // the clock tower
        rc.rectangle(690, 800, 230, 640, O('bb', { fill: '#c9b58a' })); rc.rectangle(670, 760, 270, 50, O('bbc', { fill: '#b39c6c', strokeWidth: 4 })); rc.polygon([[690, 760], [920, 760], [805, 610]], O('bbtop', { fill: '#8a7a5a' }));
        rc.circle(805, 930, 180, O('bbface', { fill: '#fbf7ee' })); rc.line(805, 930, 805, 868, O('bbh1', { strokeWidth: 7 })); rc.line(805, 930, 848, 948, O('bbh2', { strokeWidth: 7 }));
        for (let i = 0; i < 5; i++) rc.line(722 + i * 42, 1060, 722 + i * 42, 1420, O('bbl' + i, { strokeWidth: 3.5, stroke: '#8a7a5a' }));
        skyline('sk3', 1440, [[-20, 190, 330, '#d6ccb8', 2], [190, 170, 250, '#cfc7b6', 2], [940, 160, 300, '#d9d0bd', 2]]);
        rc.rectangle(-20, 1440, W + 40, 210, O('rd3', { fill: '#b8b2a6' })); D.bg('paper', 1650);
        // a red bus with two floors
        D.at(lerp(1200, 110, easeOut(prog(v, 0, 1.3))), 1560, 1, () => {
          rc.rectangle(0, -400, 560, 370, O('bus', { fill: '#c8402f' }));
          for (let i = 0; i < 5; i++) { rc.rectangle(24 + i * 104, -376, 80, 96, O('bw1' + i, { fill: '#dff1fa', strokeWidth: 3.5 })); if (i < 4) rc.rectangle(128 + i * 104, -216, 80, 96, O('bw2' + i, { fill: '#dff1fa', strokeWidth: 3.5 })); }
          rc.rectangle(24, -216, 80, 186, O('bdr', { fill: '#8f2a1f', strokeWidth: 3.5 })); rc.line(0, -246, 560, -246, O('bln', { strokeWidth: 4 }));
          rc.circle(130, -24, 86, O('bwh1', { fill: '#3b3b3d' })); rc.circle(430, -24, 86, O('bwh2', { fill: '#3b3b3d' })); rc.circle(130, -24, 30, O('bh1', { fill: '#d9d4c8', strokeWidth: 3 })); rc.circle(430, -24, 30, O('bh2', { fill: '#d9d4c8', strokeWidth: 3 }));
        });
      }],
      [T.at(3, '地下鉄') - 0.08, v => {   // under London: the train he saw
        D.bg('sky');
        skyline('sk3b', 860, [[60, 150, 150, '#d6ccb8', 2], [250, 130, 110, '#cfc7b6', 2], [870, 150, 170, '#d9d0bd', 2]]);
        rc.rectangle(560, 640, 80, 220, O('bbs', { fill: '#c9b58a', strokeWidth: 4 })); rc.polygon([[554, 640], [646, 640], [600, 580]], O('bbst', { fill: '#8a7a5a', strokeWidth: 4 })); rc.circle(600, 690, 56, O('bbsf', { fill: '#fbf7ee', strokeWidth: 3.5 }));
        rc.rectangle(-20, 860, W + 40, H, O('ea3', { fill: '#a9865e' }));
        tunnel('tn3', 980, 1530);
        car('tube', lerp(-1300, 330, easeOut(prog(v, 0, 1.0))) + v * 10, 1514, 1.75, { body: '#c8402f', roof: '#5a2a22' });
        rc.rectangle(-20, 1400, 400, 150, O('pf3', { fill: '#cfc8ba' })); rc.rectangle(-20, 1400, 400, 16, O('pf3e', { fill: '#fbf7ee', strokeWidth: 3 }));
        haya('h3b', 190, 1400, { scale: 1.8, mood: 'wow', arm: -1.0, arm2: -1.0, look: 7 });
        D.burst('sp3', 190, 1010, 120 + Math.sin(u * 9) * 10, 12, '#f6c543', 8);
      }],
      [idea - 0.08, v => {   // the same, under Tokyo: his idea
        D.bg('paper'); D.ground(1560);
        haya('h3c', 250, 1560, { scale: 2.0, mood: 'ok', arm: -1.25, arm2: 1.1, look: 6, bob: Math.sin(u * 5) * 2 });
        for (const [bx, by, r] of [[400, 1090, 30], [450, 1030, 44]]) rc.circle(bx, by, r * 2 * pin(t, idea, 0.3), O('tb' + bx, { fill: '#fbfbf8' }));
        D.at(660, 830, pin(t, idea + 0.1, 0.4), () => {
          rc.path('M -330 60 C -420 60, -420 -110, -300 -120 C -310 -250, -110 -290, -40 -200 C 30 -300, 250 -280, 270 -150 C 400 -150, 420 40, 300 70 C 320 190, 120 240, 40 170 C -40 250, -260 220, -260 130 C -300 130, -330 100, -330 60 Z', O('cloud3', { fill: '#fbfbf8', strokeWidth: 6 }));
          ctx.save(); ctx.beginPath(); ctx.rect(-270, -190, 540, 330); ctx.clip();
          rc.rectangle(-270, -40, 540, 200, O('ie', { fill: '#b98a5a', strokeWidth: 3.5 })); rc.rectangle(-270, 10, 540, 110, O('it', { fill: '#34323a', strokeWidth: 3.5 }));
          skyline('isk', -40, [[-230, 80, 110, '#d9d0bd', 1], [-120, 70, 150, '#cfc7b6', 1], [130, 90, 120, '#d6ccb8', 1]]);
          rc.rectangle(-20, -150, 120, 60, O('isg', { fill: '#fbf7ee', strokeWidth: 3.5 })); D.text('東京', 40, -118, 44, { font: MARK }); rc.line(40, -90, 40, -40, O('isp', { strokeWidth: 5 }));
          car('icar', lerp(-420, -150, easeOut(prog(t, idea + 0.3, 0.9))), 112, 0.5);
          ctx.restore();
        });
        D.bulb('bulb3', 250, 880, easeBack(prog(t, idea + 0.2, 0.35)) * 0.8, 0.5 + 0.5 * Math.sin(u * 10));
      }],
    ]);
    D.tag('tg3', '1914年・ロンドン', t, T.s(3));
    rows(t, [
      ['c1', 'ロンドンで{地下鉄}を見た早川は', 370, 58, T.at(3, 'ロンドン'), T.to(3, '早川は')],
      ['c2', '東京にも、つくろう！', 495, 66, idea, T.e(3), { font: MARK }],
    ]);
  });

  // 4  けれど周りは、東京の地面はやわらかすぎると笑います。
  scene(T.s(4) - 0.08, (t, u) => {
    const soft = T.at(4, '東京'), laugh = T.at(4, '笑い');
    const plan = (x, y, k, rot) => D.at(x, y, k, () => {   // his plan on blue paper
      rc.rectangle(-400, -230, 800, 460, O('plan', { fill: '#2f5fa8', strokeWidth: 6 }));
      const w = { stroke: '#eaf2fb', strokeWidth: 5 };
      rc.line(-360, -40, 360, -40, O('pl1', w)); for (const [bx, bw, bh] of [[-320, 110, 120], [-170, 90, 170], [120, 120, 100], [270, 80, 140]]) rc.rectangle(bx, -40 - bh, bw, bh, O('plb' + bx, w));
      rc.rectangle(-360, 30, 720, 120, O('pl2', Object.assign({ strokeLineDash: [18, 14] }, w))); rc.rectangle(-150, 60, 260, 70, O('pl3', w)); rc.circle(-90, 142, 26, O('pl4', w)); rc.circle(50, 142, 26, O('pl5', w));
      D.text('地下鉄　計画図', 0, 192, 46, { font: MARK, color: '#eaf2fb' });
    }, rot);
    const three = mood => [[190, 930, '#3a4a3a', '#d9a521', true], [540, 880, '#2f3f5a', '#c0392b', false], [890, 930, '#4b3f2a', '#2e8b57', true]].forEach(([x, y, suit, tie, hat], i) =>
      D.face('sk4' + i, x, y + (mood === 'laugh' ? Math.sin(u * 14 + i * 2) * 8 : 0), 0.56, { mood, suit, tie, hat: hat ? true : null, hair: hat ? null : '#4a3b2e', tears: mood === 'laugh', flip: i === 2 }));
    shots(t, [
      [-1, v => {   // the people around him look at the plan
        D.bg('wall');
        three('doubt');
        plan(540, 1330, 1, -0.02);
        for (const [qx, qy] of [[330, 720], [700, 680]]) D.at(qx, qy, pin(t, T.s(4) + 0.3), () => D.text('？', 0, 0, 110, { font: MARK, color: '#e2742b', outline: 14 }));
      }],
      [soft - 0.08, v => {   // "the ground of Tokyo is as soft as tofu"
        D.bg('paper');
        rc.ellipse(540, 1500, 900, 150, O('plate', { fill: '#dfe9ee' }));
        const sway = Math.sin(v * 9) * 34 * (0.5 + 0.5 * Math.sin(v * 2.2)), sag = easeOut(prog(t, T.at(4, 'やわらか'), 0.8));
        rc.path(`M 250 1480 L 830 1480 L ${830 + sway} 1010 Q ${540 + sway} ${980 + sag * 30} ${250 + sway} 1010 Z`, O('tofu', { fill: '#fbfaf2', strokeWidth: 6 }));
        // the tunnel in it sinks
        rc.ellipse(540 + sway * 0.4, 1340 + sag * 40, 330, 150 - sag * 90, O('hole', { fill: '#34323a' }));
        car('tcar', 430 + sway * 0.4, 1392 + sag * 40, 0.42 - sag * 0.1);
        D.text('東京の地面', 540 + sway * 0.7, 1130, 72, { font: MARK });
        for (const [gx, gy] of [[430, 1000], [520, 990], [610, 1002]]) rc.ellipse(gx + sway, gy, 44, 20, O('negi' + gx, { fill: '#7fb86a', strokeWidth: 3 }));
        const poke = Math.abs(Math.sin(v * 5)) * 46;
        rc.line(900, 780 + poke, 790, 990 + poke, O('spn', { strokeWidth: 16, stroke: '#8a6a45' })); rc.ellipse(775, 1020 + poke, 90, 120, O('spb', { fill: '#b9b3a6' }));
        D.sweat(210, 1240, v, 2.0);
        D.cross('x4', 540, 1330, 130, t, T.at(4, 'すぎる'));
      }],
      [laugh - 0.08, v => {   // and they laugh
        D.bg('wall');
        three('laugh');
        haha(t, laugh, [[330, 700, -0.12], [760, 680, 0.12], [540, 1180, 0]], u);
        const f = easeOut(prog(t, laugh, 0.7));   // the plan, crumpled, flies into the bin
        rc.polygon([[760, 1360], [960, 1360], [930, 1600], [790, 1600]], O('bin', { fill: '#8d8a84' })); for (let i = 1; i < 4; i++) rc.line(760 + i * 50, 1368, 778 + i * 38, 1592, O('binl' + i, { strokeWidth: 3 }));
        D.at(lerp(300, 860, f), lerp(1380, 1340, f) - Math.sin(f * Math.PI) * 260, 1, () => { rc.polygon([[-60, -20], [-20, -64], [40, -50], [66, 0], [30, 56], [-36, 50]], O('ball', { fill: '#2f5fa8' })); rc.line(-30, -10, 20, 20, O('bl1', { stroke: '#eaf2fb', strokeWidth: 3 })); rc.line(-10, -40, 30, -10, O('bl2', { stroke: '#eaf2fb', strokeWidth: 3 })); }, f * 5);
        haya('h4c', 230, 1620, { scale: 1.6, mood: 'stern', arm: 1.2, arm2: 1.2 });
      }],
    ]);
    rows(t, [
      ['d1', 'けれど周りは…', 370, 58, T.s(4), T.to(4, '周りは')],
      ['d2', '「東京の地面は{やわらかすぎる}」と笑った', 495, 48, soft, T.e(4)],
    ]);
  });

  // 5  お金を集めるには、証拠が必要でした。
  scene(T.s(5) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1520);
    haya('h5', 230, 1520, { scale: 1.7, mood: 'ok', arm: -0.3, arm2: 1.1 });
    D.sheet('plan5', 420, 1150, 200, 150, null, { rot: -0.1 }); D.text('計画', 420, 1150, 50, { font: MARK, color: '#3d74c4', rot: -0.1 });
    D.moneybag('mb5', 850, 1270, 1.5);
    [[750, '#2f3f5a', '#c0392b'], [950, '#4b3f2a', '#2e8b57']].forEach(([x, suit, tie], i) => D.person('inv' + i, x, 1520, { scale: 1.5, suit, tie, mood: 'flat', hat: true, flip: true, arm: 1.3, arm2: 1.3 }));
    const a = T.at(5, '証拠');
    D.stamp('proof', '証拠は？', 600, 780, 110, -0.08, t, a, { fill: 'rgba(251,247,238,0.92)' });
    rows(t, [
      ['e1', 'お金を集めるには', 370, 60, T.s(5), T.to(5, '集めるには')],
      ['e2', '{証拠}が必要だった', 495, 62, a, T.e(5)],
    ]);
  });

  // 6  しかも東京には、人の流れを調べた資料がありません。
  scene(T.s(6) - 0.1, (t, u) => {
    D.bg('wall'); D.ground(1520, '#bdb4a3');
    // an empty cabinet
    rc.rectangle(560, 760, 400, 760, O('cab', { fill: '#9a6b3d' }));
    for (let i = 0; i < 4; i++) { rc.rectangle(590, 790 + i * 180, 340, 150, O('dr' + i, { fill: i === 1 ? '#3d3b40' : '#b07f4c', strokeWidth: 4 })); if (i !== 1) rc.circle(760, 865 + i * 180, 24, O('kn' + i, { fill: '#e2b23a', strokeWidth: 3 })); }
    rc.path('M 590 970 Q 660 1010 700 1120 M 590 1040 Q 640 1040 700 1120 M 640 970 Q 660 1040 700 1120 M 610 1000 Q 650 990 672 1060', O('web', { strokeWidth: 2.5, stroke: '#d9d4c8' }));
    D.label('f3', '人の流れの資料', 760, 700, 46, t, T.at(6, '人の流れ'), T.to(6, '資料'), { font: MARK });
    haya('h6', 260, 1520, { scale: 1.7, mood: 'sad', arm: -1.3, arm2: 1.1, look: 6 });
    D.qcards(300, 1000, u, 1.2);
    D.stamp('none', 'なし', 760, 1070, 130, -0.12, t, T.at(6, 'ありません'), { fill: 'rgba(251,247,238,0.92)' });
    rows(t, [
      ['f1', 'しかも東京には', 370, 60, T.s(6), T.to(6, '東京には')],
      ['f2', '人の流れを調べた{資料がない}', 495, 58, T.at(6, '人の流れ'), T.e(6)],
    ]);
  });

  // 7  そこで早川は銀座の交差点に立ち、ポケットの豆を一粒ずつ移して、通る人を数えたといいます。
  scene(T.s(7) - 0.1, (t, u) => {
    D.bg('sky'); D.bg('paper', 1190);
    D.tag('tg7', '銀座', t, T.s(7));
    building('b7a', 40, 1190, 220, 330, '#d9d0bd', 2); building('b7c', 860, 1190, 200, 300, '#cfc7b6', 2);
    // the corner building with its clock
    rc.rectangle(560, 830, 260, 360, O('ck', { fill: '#d6ccb8' })); rc.rectangle(640, 700, 100, 130, O('ckt', { fill: '#cfc7b6' })); rc.polygon([[630, 700], [750, 700], [690, 640]], O('ckr', { fill: '#8a7a5a' }));
    rc.circle(690, 765, 72, O('ckf', { fill: '#fbf7ee' })); rc.line(690, 765, 690, 740, O('ckh', { strokeWidth: 5 })); rc.line(690, 765, 708, 772, O('ckm', { strokeWidth: 5 }));
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) rc.rectangle(590 + c * 76, 870 + r * 100, 48, 56, O('ckw' + r + c, { fill: '#cfe6f3', strokeWidth: 3 }));
    rc.rectangle(-20, 1190, W + 40, 230, O('street', { fill: '#b8b2a6' }));
    // a tram goes by behind the walkers
    const tx = ((u * 150) % 1700) - 520;
    D.at(tx, 1250, 1, () => { rc.line(170, -210, 250, -290, O('pole', { strokeWidth: 4 })); rc.rectangle(0, -210, 420, 180, O('tram', { fill: '#5b8a5a' })); rc.rectangle(0, -120, 420, 90, O('tram2', { fill: '#efe3c0', strokeWidth: 3.5 })); for (let i = 0; i < 5; i++) rc.rectangle(20 + i * 80, -196, 56, 62, O('tw' + i, { fill: '#dff1fa', strokeWidth: 3 })); rc.circle(90, -16, 40, O('twh1', { fill: '#4b4f54', strokeWidth: 3.5 })); rc.circle(330, -16, 40, O('twh2', { fill: '#4b4f54', strokeWidth: 3.5 })); });
    // the people who pass, and the count
    const a = T.at(7, '豆'), step = 0.5;
    const count = t < a ? 0 : Math.floor((t - a) / step) + 1;
    [['#3a4a3a', 0], ['#7a3b4a', 0.37], ['#2f3f5a', 0.71], ['#4b3f2a', 0.18], ['#3f8f7a', 0.55]].forEach(([suit, ph], i) => {
      const q = ((u * (0.16 + i * 0.012) + ph) % 1);
      D.person('wk7' + i, lerp(1180, -120, q), 1330 + (i % 3) * 34, { scale: 0.92, suit, plain: i % 2 === 1, flip: true, arm: 1.2, arm2: 1.0, step: Math.sin(u * 7 + i) * 0.6, bob: Math.abs(Math.sin(u * 7 + i)) * -3, hat: i === 3 });
    });
    haya('h7', 150, 1420, { scale: 1.55, mood: 'flat', arm: 1.25, arm2: 1.25, look: 6 });
    // his two pockets: a bean hops across for every passer-by
    const k = pin(t, a - 0.2);
    D.card('pk', 720, 1520, 560, 190, k, 0, () => {
      for (const [px, id] of [[-160, 'l'], [160, 'r']]) { rc.path(`M ${px - 80} -62 L ${px + 80} -62 L ${px + 70} 66 Q ${px} 86 ${px - 70} 66 Z`, O('pkt' + id, { fill: '#6a4f35' })); rc.line(px - 80, -40, px + 80, -40, O('pks' + id, { strokeWidth: 3, stroke: '#3a2c22' })); }
      for (let i = 0; i < clamp(7 - count, 0, 6); i++) bean(-205 + (i % 3) * 44, -6 + Math.floor(i / 3) * 34, i % 2 === 0);
      for (let i = 0; i < clamp(count - 1, 0, 6); i++) bean(115 + (i % 3) * 44, -6 + Math.floor(i / 3) * 34, i % 2 === 0);
      if (count > 0 && count <= 7) { const f = ((t - a) % step) / step; bean(lerp(-160, 160, f), -70 - Math.sin(f * Math.PI) * 90, count % 2 === 1, 1.15); }
      D.text('→', 0, 20, 60, { font: MARK, color: RED });
    });
    if (count > 0) D.label('cnt', `${Math.min(count, 12)}人…`, 330, 1010, 64, t, a, a + 0.1, { font: MARK, fill: '#fff6cf' });
    rows(t, [
      ['g1', '銀座の交差点に立ち', 350, 56, T.at(7, '銀座'), T.to(7, '立ち')],
      ['g2', 'ポケットの{豆}を一粒ずつ移して', 465, 56, T.at(7, 'ポケット'), T.to(7, '移して')],
      ['g3', '通る人を数えた…といいます', 580, 54, T.at(7, '通る'), T.e(7)],
    ]);
  });

  // 8  1927年、上野と浅草のあいだに、東洋で初めての地下鉄が走りました。
  scene(T.s(8) - 0.1, (t, u) => {
    D.bg('sky');
    D.tag('tg8', '1927年12月30日', t, T.s(8));
    building('b8a', 330, 1060, 180, 250, '#d9d0bd', 2); building('b8b', 560, 1060, 190, 310, '#cfc7b6', 2);
    cut('cut8', 1060, 1200, 1450);
    const go = easeInOut(prog(t, T.at(8, '東洋') - 0.4, T.e(8) - T.at(8, '東洋') + 1.0));
    car('car8', lerp(-60, 500, go), 1436, 1.05);
    [[170, '上野', T.at(8, '上野')], [910, '浅草', T.at(8, '浅草')]].forEach(([x, name, a], i) => {
      D.at(x, 1060, pin(t, a), () => { rc.line(0, 0, 0, -170, O('st8p' + i, { strokeWidth: 9 })); rc.rectangle(-110, -270, 220, 104, O('st8' + i, { fill: '#fbf7ee' })); D.text(name, 0, -216, 72, { font: MARK }); });
      if (t > a) rc.line(x, 1060, x, 1200, O('st8d' + i, { strokeWidth: 6, stroke: '#5a5347' }));
    });
    const r = (i, m) => ((D.hash('cf8' + i) % 1000) / 1000 * m);
    if (t > T.at(8, '東洋')) for (let i = 0; i < 22; i++) { const x = r(i, 1080), y = 640 + ((r(i + 99, 400) + (t - T.at(8, '東洋')) * (90 + r(i + 7, 80))) % 420); ctx.save(); ctx.translate(x, y); ctx.rotate(u * 3 + i); ctx.fillStyle = ['#d6453a', '#f6c543', '#3d74c4', '#2e8b57'][i % 4]; ctx.fillRect(-9, -5, 18, 10); ctx.restore(); }
    rows(t, [
      ['h1', '{上野}と{浅草}のあいだに', 370, 60, T.at(8, '上野'), T.to(8, 'あいだに')],
      ['h2', '東洋で初めての地下鉄が走った', 495, 60, T.at(8, '東洋'), T.e(8), { font: MARK, bold: true }],
    ]);
  });

  // 9  たった2.2キロでしたが、初日は1時間待ちの行列ができます。
  scene(T.s(9) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1520);
    // the short line between the two stations
    const a = T.at(9, '2.2');
    D.at(540, 760, pin(t, a), () => { rc.line(-300, 0, 300, 0, O('ln9', { strokeWidth: 12, stroke: '#f39700' })); rc.circle(-300, 0, 40, O('s9a', { fill: '#fbf7ee' })); rc.circle(300, 0, 40, O('s9b', { fill: '#fbf7ee' })); D.text('上野', -300, -64, 46, { font: MARK }); D.text('浅草', 300, -64, 46, { font: MARK }); D.text('2.2キロ', 0, 66, 64, { color: RED }); });
    entrance('en9', 880, 1520, 1.15);
    const q = T.at(9, '1時間');
    for (let i = 0; i < 7; i++) D.person('q9b' + i, 90 + i * 100, 1330, { scale: 0.82, suit: ['#7a3b4a', '#3a4a3a', '#2f3f5a', '#4b3f2a', '#3f8f7a'][i % 5], plain: i % 2 === 0, arm: 1.2, arm2: 1.2, bob: Math.sin(u * 4 + i) * 2, hat: i % 3 === 0 });
    for (let i = 0; i < 6; i++) D.person('q9a' + i, 700 - i * 118, 1520, { scale: 1.05, suit: ['#3a4a3a', '#4a3636', '#2f3f5a', '#4b3f2a', '#3f8f7a', '#7a3b4a'][i], plain: i % 2 === 1, flip: false, arm: 1.2, arm2: 1.2, bob: Math.sin(u * 4 + i * 1.3) * 2, mood: i % 2 ? 'ok' : 'flat', hat: i === 2 });
    D.at(190, 1010, pin(t, q), () => { rc.line(0, 60, 0, 250, O('pp9', { strokeWidth: 9 })); rc.rectangle(-170, -60, 340, 120, O('bd9', { fill: '#fff6cf' })); D.text('1時間待ち', 0, 4, 64, { font: MARK, color: RED }); });
    rows(t, [
      ['i1', 'たった{2.2キロ}でしたが', 370, 60, T.s(9), T.to(9, 'でしたが')],
      ['i2', '初日は{1時間待ち}の行列', 495, 62, T.at(9, '初日'), T.e(9)],
    ]);
  });

  // 10 それから13年後、ライバルの鉄道会社が、早川の会社の株を買い集めました。
  scene(T.s(10) - 0.1, (t, u) => {
    D.bg('wall'); D.ground(1540, '#bdb4a3');
    D.tag('tg10', '1940年', t, T.s(10));
    const a = T.at(10, '株');
    rc.rectangle(60, 1320, 360, 30, O('tb', { fill: '#9a6b3d' })); rc.line(100, 1350, 100, 1540, O('tb1', { strokeWidth: 9, stroke: '#5a3d22' })); rc.line(380, 1350, 380, 1540, O('tb2', { strokeWidth: 9, stroke: '#5a3d22' }));
    haya('h10', 240, 1540, { scale: 1.9, hair: '#8d8a84', mood: t > a ? 'wow' : 'flat', worry: true, arm: t > a ? -1.2 : 1.1, arm2: 1.1, noLegs: false });
    // the rival: a dark figure seen from behind, with a sack
    D.person('rv', 830, 1540, { scale: 2.0, shade: true, hat: '#1c1c20', arm: 1.2, arm2: 1.2 });
    D.at(650, 1540, 1, () => { rc.path('M -90 0 C -120 -70, -80 -200, -30 -230 L 40 -230 C 90 -200, 120 -70, 90 0 Z', O('sack', { fill: '#8c7a5a' })); rc.line(-34, -230, 44, -230, O('sackt', { strokeWidth: 8, stroke: '#5a3d22' })); });
    for (let i = 0; i < 6; i++) {
      const p = easeInOut(prog(t, a + i * 0.33, 0.7));
      if (p >= 1) continue;
      const x = lerp(120 + (i % 3) * 118, 655, p), y = lerp(1296 - Math.floor(i / 3) * 14, 1300, p) - Math.sin(p * Math.PI) * 240;
      share('sh' + i, x, y, -0.1 + i * 0.05 + p * 3, 0.8 - p * 0.2);
    }
    if (t > a) D.sweat(330, 1010, u, 1.6);
    rows(t, [
      ['j1', 'それから{13年後}', 345, 56, T.s(10), T.to(10, '13年後')],
      ['j2', 'ライバルの鉄道会社が', 460, 56, T.at(10, 'ライバル'), T.to(10, '会社が')],
      ['j3', '早川の会社の{株}を買い集めた', 580, 58, T.at(10, '早川'), T.e(10), { font: MARK, bold: true }],
    ]);
  });

  // 11 早川は社長を退き、自分がつくった地下鉄を去ります。
  scene(T.s(11) - 0.1, (t, u) => {
    D.bg('paper'); D.ground(1500);
    entrance('en11', 250, 1500, 1.3);
    const x = lerp(470, 800, prog(u, 0.2, 3.6));
    haya('h11', x, 1500, { scale: 1.85, hair: '#8d8a84', mood: 'sad', arm: 1.35, arm2: 1.2, bag: true, bob: Math.abs(Math.sin(u * 4.5)) * -4, step: Math.sin(u * 4.5) * 0.6, lean: 0.04, look: 4 });
    rows(t, [
      ['k1', '早川は{社長を退き}', 370, 60, T.s(11), T.to(11, '退き')],
      ['k2', '自分がつくった地下鉄を去った', 495, 58, T.at(11, '自分が'), T.e(11)],
    ]);
  });

  // 12 その2年後、61歳で亡くなりました。
  scene(T.s(12) - 0.1, (t, u) => {
    D.bg('room'); D.ground(1500, '#b9c08f', 0.6);
    D.tag('tg12', '1942年', t, T.s(12));
    // his picture in a frame, white flowers beside it
    rc.rectangle(330, 760, 420, 520, O('fr', { fill: '#6b5a44' })); rc.rectangle(366, 796, 348, 448, O('fr2', { fill: '#efe7d2' }));
    haya('h12', 540, 1290, { scale: 1.45, hair: '#8d8a84', mood: 'ok', noLegs: true, arm: 1.3, arm2: 1.3 });
    rc.rectangle(330, 1244, 420, 36, O('fr3', { fill: '#6b5a44', strokeWidth: 4 }));
    rc.polygon([[330, 760], [430, 760], [330, 860]], O('rb1', { fill: '#1d1a16' })); rc.polygon([[750, 760], [650, 760], [750, 860]], O('rb2', { fill: '#1d1a16' }));
    rc.rectangle(840, 1330, 110, 170, O('vase', { fill: '#7fb0d6' }));
    [[860, 1180], [900, 1130], [940, 1190]].forEach(([fx, fy], i) => { rc.line(fx, 1330, fx, fy, O('stem' + i, { strokeWidth: 5, stroke: '#4f7f4a' })); for (let k = 0; k < 6; k++) rc.circle(fx + Math.cos(k * 1.05) * 22, fy + Math.sin(k * 1.05) * 22, 26, O('pt' + i + k, { fill: '#fbfbf8', strokeWidth: 2.5 })); rc.circle(fx, fy, 20, O('ctr' + i, { fill: '#f6c543', strokeWidth: 2.5 })); });
    rows(t, [['l1', 'その2年後、{61歳}で亡くなった', 420, 58, T.s(12), T.e(12)]]);
  });

  // 13 いま東京の地下鉄は、毎日、何百万人もの人を運んでいます。
  scene(T.s(13) - 0.1, (t, u) => {
    D.bg('paper');
    D.tag('tg13', 'いま', t, T.s(13));
    metro(prog(u, 0.1, 1.6));
    for (let i = 0; i < 9; i++) D.person('cr13' + i, 70 + i * 118, 1640 + (i % 2) * 30, { scale: 0.85, suit: ['#3a4a3a', '#4a3636', '#2f3f5a', '#4b3f2a', '#3f8f7a', '#7a3b4a'][i % 6], plain: i % 2 === 1, arm: 1.2, arm2: 1.2, bob: Math.sin(u * 5 + i * 1.7) * 3, mood: 'ok' });
    const a = T.at(13, '何百万');
    D.stamp('mil', '何百万人', 560, 1050, 120, -0.08, t, a, { fill: 'rgba(251,247,238,0.94)' });
    rows(t, [
      ['m1', 'いま、東京の地下鉄は', 370, 60, T.s(13), T.to(13, '地下鉄は')],
      ['m2', '毎日{何百万人}もの人を運ぶ', 495, 60, T.at(13, '毎日'), T.e(13)],
    ]);
  });

  // 14 2027年には、あの最初の線路が100歳になります。
  scene(T.s(14) - 0.1, (t, u) => {
    D.bg('sky');
    cut('cut14', 1180, 1280, 1520);
    car('car14', 250 + Math.sin(u * 1.5) * 6, 1506, 1.1);
    [[130, '上野'], [950, '浅草']].forEach(([x, name], i) => { rc.line(x, 1180, x, 1050, O('s14p' + i, { strokeWidth: 8 })); rc.rectangle(x - 90, 960, 180, 90, O('s14' + i, { fill: '#fbf7ee' })); D.text(name, x, 1008, 60, { font: MARK }); });
    D.calendar('cal14', 250, 780, pin(t, T.s(14)) * 0.7, '2027');
    // a birthday cake
    const a = T.at(14, '100歳');
    D.at(620, 1180, pin(t, a - 0.15) * 0.9, () => {
      rc.rectangle(-170, -150, 340, 150, O('ck1', { fill: '#f6e3c2' })); rc.path('M -170 -150 Q -130 -90 -90 -150 Q -50 -90 -10 -150 Q 30 -90 70 -150 Q 110 -90 170 -150 L 170 -180 L -170 -180 Z', O('ck2', { fill: '#fbfbf8', strokeWidth: 4 }));
      rc.rectangle(-110, -280, 220, 100, O('ck3', { fill: '#f6e3c2' })); rc.path('M -110 -280 Q -70 -240 -30 -280 Q 10 -240 50 -280 Q 80 -240 110 -280 L 110 -300 L -110 -300 Z', O('ck4', { fill: '#fbfbf8', strokeWidth: 4 }));
      for (const cx of [-60, 0, 60]) { rc.rectangle(cx - 7, -360, 14, 60, O('cd' + cx, { fill: '#d6453a', strokeWidth: 3 })); ctx.fillStyle = '#f6a623'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, -378 + Math.sin(u * 12 + cx) * 2, 9, 15, 0, 0, 7); ctx.fill(); ctx.stroke(); }
      D.text('100', 0, -86, 96, { font: MARK, color: RED });
    });
    rows(t, [
      ['o1', '{2027年}には', 370, 60, T.s(14), T.to(14, 'には')],
      ['o2', 'あの最初の線路が{100歳}になる', 495, 58, T.at(14, 'あの'), T.e(14)],
    ]);
  });

  // 15 「ほら吹き」が豆で数えた答えは、まちがっていなかったのです。
  scene(T.s(15) - 0.1, (t, u) => {
    D.bg('dusk'); D.ground(1520, '#d9b98a');
    D.fade(0.32, () => metro(1, 1));
    D.bg('dusk', 1400);
    D.ground(1520, '#d9b98a');
    haya('h15', 300, 1520, { scale: 2.2, mood: 'ok', arm: -0.75, arm2: 1.1, bob: Math.sin(u * 3) * 1.5 });
    [[470, 1050, true], [520, 1010, false], [565, 1052, true]].forEach(([x, y, dark], i) => bean(x, y + Math.sin(u * 4 + i) * 6, dark, 2.0));
    const a = T.at(15, 'まちがって');
    const k = prog(t, a, 0.45);
    if (k > 0) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(810, 1040, 172, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * easeOut(k)); ctx.stroke(); ctx.restore(); }
    D.stamp('ok', '正解', 810, 1045, 108, -0.1, t, a + 0.3, { fill: 'rgba(251,247,238,0.9)' });
    rows(t, [
      ['p1', '「{ほら吹き}」が豆で数えた答えは', 370, 56, T.s(15), T.to(15, '答えは')],
      ['p2', 'まちがっていなかった', 495, 70, a, T.e(15), { font: MARK, bold: true }],
    ]);
    const c = prog(t, T.e(15) + 0.2, 0.5);
    if (c > 0) D.fade(c, () => D.text('声：VOICEVOX:青山龍星　／　音楽：竹笛', W / 2, 1700, 34, { color: '#5a5347' }));
  });

  return scenes;
};
