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

  // the street of Tokyo cut open: buildings on top, the yellow train running in its tunnel below (the time passes)
  const underTokyo = (key, v, street = 1180, x0 = 60) => {
    D.bg('sky');
    D.cloud(key + 'c', 240 + v * 14, street - 560, 230);
    D.skyline(key + 'sk', street, [[-30, 190, 330, '#d9d0bd', 2], [170, 170, 450, '#cfc7b6', 2], [350, 150, 260, '#d6ccb8', 2], [600, 150, 300, '#d9d0bd', 2], [760, 170, 470, '#cfc7b6', 2], [940, 170, 340, '#d6ccb8', 2]]);
    rc.rectangle(-20, street, W + 40, 40, O(key + 'rd', { fill: '#b8b2a6' }));
    rc.rectangle(-20, street + 40, W + 40, H, O(key + 'ea', { fill: '#b98a5a' }));
    for (let i = 0; i < 14; i++) rc.circle((D.hash(key + 'st' + i) % 1080), street + 90 + (D.hash(key + 'sy' + i) % 520), 12 + i % 3 * 6, O(key + 'stone' + i, { fill: '#a3784c', strokeWidth: 2.5 }));
    tunnel(key + 'tn', street + 120, street + 420);
    const x = x0 + v * 60;
    D.beam(x + 520 * 1.35, street + 404 - 62 * 1.35, 360);
    car(key + 'car', x, street + 404, 1.35);
  };
  const glove = (key, x, y, s, rot) => D.at(x, y, s, () => {   // the rival's dark hand, fingers forward
    for (const [fx, fy, l] of [[60, -58, 110], [76, -20, 124], [70, 20, 116], [52, 56, 92]]) rc.path(`M 0 ${fy - 18} L ${fx + l - 20} ${fy - 18} Q ${fx + l + 6} ${fy} ${fx + l - 20} ${fy + 18} L 0 ${fy + 18} Z`, O(key + 'f' + fy, { fill: '#2a2a2e', strokeWidth: 4 }));
    rc.path('M -40 -60 C 10 -110, 40 -120, 60 -90 L 20 -40 Z', O(key + 'th', { fill: '#2a2a2e', strokeWidth: 4 }));
    rc.ellipse(-10, 0, 170, 170, O(key + 'p', { fill: '#2a2a2e', strokeWidth: 4 }));
    rc.rectangle(-190, -60, 120, 120, O(key + 'cuff', { fill: '#1c1c20', strokeWidth: 4 }));
  }, rot);

  // ---------- lines 0–4, drawn the second way (26/11/2026): one big picture for every part of a sentence ----------
  // shots(t, [[start, draw(v)], …]): the picture of the moment; each new one comes in with a small push
  const shots = D.shots;   // the kit's: a first picture given -1 starts with its line
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
      [-1, v => {   // the man everybody laughed at, and what he built under their feet
        underTokyo('u0', u, 1270, 40);
        haya('h0', 540, 1270, { scale: 2.1, mood: 'stern', arm: 1.15, arm2: 1.15 });
        D.label('tag0', 'ほら吹き', 540, 1050, 64, t, 0, null, { still: true, font: MARK, bold: true, fill: '#fff6cf', color: RED, rot: -0.06 });
        [[170, '#3a4a3a', '#d9a521', false], [910, '#4a3636', '#3d74c4', true]].forEach(([x, suit, tie, flip], i) => D.person('lg0' + i, x, 1270, { scale: 1.6, suit, tie, mood: 'laugh', flip, arm: -0.35 + Math.sin(u * 9 + i) * 0.08, arm2: 1.2, bob: Math.sin(u * 12 + i * 2) * 4, hat: i === 1 }));
        haha(t, 0.05, [[190, 790, -0.14], [890, 790, 0.14]], u);
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
      [-1, v => {   // the years fly by while his train runs: 1927 → 1940
        underTokyo('u1', v, 1260, -200);
        D.yearFlip('cal1', t, T.s(1), T.to(1, '13年後'), 1927, 1940, 540, 900, 1.35, '13年後');
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

  // ---------- lines 5–15, drawn the second way ----------
  const confetti = (key, u, n, y0, h) => { const r = (i, m) => ((D.hash(key + i) % 1000) / 1000 * m); for (let i = 0; i < n; i++) { const x = r(i, 1080), y = y0 + ((r(i + 99, h) + u * (110 + r(i + 7, 90))) % h); ctx.save(); ctx.translate(x, y); ctx.rotate(u * 3 + i); ctx.fillStyle = ['#d6453a', '#f6c543', '#3d74c4', '#2e8b57'][i % 4]; ctx.fillRect(-11, -6, 22, 12); ctx.restore(); } };
  const cake = (x, y, k, u) => D.at(x, y, k, () => {
    rc.rectangle(-190, -160, 380, 160, O('ck1', { fill: '#f6e3c2' })); rc.path('M -190 -160 Q -150 -96 -110 -160 Q -70 -96 -30 -160 Q 10 -96 50 -160 Q 90 -96 130 -160 Q 160 -110 190 -160 L 190 -192 L -190 -192 Z', O('ck2', { fill: '#fbfbf8', strokeWidth: 4 }));
    rc.rectangle(-120, -300, 240, 108, O('ck3', { fill: '#f6e3c2' })); rc.path('M -120 -300 Q -80 -256 -40 -300 Q 0 -256 40 -300 Q 80 -256 120 -300 L 120 -322 L -120 -322 Z', O('ck4', { fill: '#fbfbf8', strokeWidth: 4 }));
    for (const cx of [-66, 0, 66]) { rc.rectangle(cx - 8, -388, 16, 66, O('cd' + cx, { fill: '#d6453a', strokeWidth: 3 })); ctx.fillStyle = '#f6a623'; ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(cx, -408 + Math.sin(u * 12 + cx) * 2, 10, 17, 0, 0, 7); ctx.fill(); ctx.stroke(); }
    D.text('100', 0, -92, 104, { font: MARK, color: RED });
  });
  const yearFlip = (key, t, a, b, from, to, cx, cy, s, small) => {   // a calendar whose year runs from one to the other
    const q = easeInOut(prog(t, a, b - a));
    for (let i = 0; i < 7; i++) { const f = clamp(q * 1.3 - i * 0.12); if (f > 0 && f < 1) D.at(lerp(cx + 80, cx + 640, f), lerp(cy - 220, cy - 500 - i * 30, f), 0.6, () => rc.rectangle(-150, -110, 300, 220, O(key + 'fly' + i, { fill: '#fbf7ee' })), f * 2.4); }
    D.calendar(key, cx, cy, s, String(Math.round(lerp(from, to, q))), q >= 1 ? small : '');
  };

  // 5  お金を集めるには、証拠が必要でした。 — the money is in a safe; the key to it is proof
  scene(T.s(5) - 0.08, (t, u) => {
    const a = T.at(5, '証拠');
    D.bg('wall'); D.ground(1560, '#bdb4a3');
    rc.rectangle(330, 800, 520, 720, O('safe', { fill: '#6f7378' })); rc.rectangle(366, 836, 448, 648, O('safed', { fill: '#868d94', strokeWidth: 5 }));
    rc.rectangle(350, 1520, 60, 40, O('sl1', { fill: '#4b4f54' })); rc.rectangle(770, 1520, 60, 40, O('sl2', { fill: '#4b4f54' }));
    rc.circle(590, 1080, 190, O('dial', { fill: '#d9d4c8' })); for (let i = 0; i < 12; i++) { const g = i * Math.PI / 6 + u * 0.6; rc.line(590 + Math.cos(g) * 66, 1080 + Math.sin(g) * 66, 590 + Math.cos(g) * 86, 1080 + Math.sin(g) * 86, O('dt' + i, { strokeWidth: 4 })); }
    rc.circle(590, 1080, 60, O('dialc', { fill: '#4b4f54' }));
    rc.rectangle(560, 1260, 60, 110, O('khole', { fill: '#2a2a2e', strokeWidth: 4 })); rc.circle(590, 1262, 70, O('khole2', { fill: '#2a2a2e', strokeWidth: 4 }));
    D.label('mn5', 'お金', 590, 760, 74, t, T.s(5) + 0.15, T.s(5) + 0.4, { font: MARK, fill: '#fff6cf' });
    haya('h5', 150, 1560, { scale: 1.75, mood: t > a ? 'sad' : 'ok', arm: -0.4 + Math.sin(u * 10) * 0.2, arm2: 1.1, look: 6 });
    if (t > a - 0.08) {   // the key that is missing
      const k = pin(t, a - 0.08, 0.35);
      D.at(900, 1010 + Math.sin(u * 3) * 10, k, () => {
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 9; ctx.setLineDash([22, 16]); ctx.lineCap = 'round'; ctx.fillStyle = 'rgba(255,246,207,0.9)';
        ctx.beginPath(); ctx.arc(0, -150, 86, 0, 7); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.rect(-22, -70, 44, 300); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.rect(22, 130, 70, 36); ctx.rect(22, 190, 50, 36); ctx.fill(); ctx.stroke(); ctx.restore();
        D.text('？', 0, -146, 96, { font: MARK, color: RED });
      }, 0.25);
      D.stamp('proof', '証拠', 880, 1380, 104, -0.08, t, a + 0.15, { fill: 'rgba(251,247,238,0.94)' });
      D.burst('kb', 590, 1300, 110 + Math.sin(u * 9) * 8, 10, '#e2742b', 7);
    }
    rows(t, [
      ['e1', 'お金を集めるには', 370, 60, T.s(5), T.to(5, '集めるには')],
      ['e2', '{証拠}が必要だった', 495, 62, a, T.e(5)],
    ]);
  });

  // 6  しかも東京には、人の流れを調べた資料がありません。
  scene(T.s(6) - 0.08, (t, u) => {
    const none = T.at(6, 'ありません');
    shots(t, [
      [-1, v => {   // the city office of Tokyo
        D.bg('sky'); D.cloud('c6', 240 + v * 14, 760, 260);
        rc.rectangle(120, 900, 840, 600, O('off', { fill: '#ddd6c6' })); rc.polygon([[90, 900], [990, 900], [540, 700]], O('offr', { fill: '#b9b3a6' }));
        for (let i = 0; i < 6; i++) rc.rectangle(180 + i * 128, 960, 60, 440, O('ofc' + i, { fill: '#efe9da', strokeWidth: 4 }));
        rc.rectangle(470, 1200, 140, 300, O('ofd', { fill: '#6b5a44' })); rc.rectangle(340, 770, 400, 100, O('ofs', { fill: '#1f4d3a' })); D.text('東京市', 540, 822, 70, { font: MARK, color: '#f3e9c6' });
        rc.rectangle(-20, 1500, W + 40, 150, O('rd6', { fill: '#b8b2a6' })); D.bg('paper', 1650);
        haya('h6', lerp(-80, 330, easeOut(prog(v, 0, 1.0))), 1600, { scale: 1.5, mood: 'ok', arm: 1.2, arm2: 1.0, step: Math.sin(v * 9) * 0.6, bob: Math.abs(Math.sin(v * 9)) * -4 });
      }],
      [T.at(6, '人の流れ') - 0.08, v => {   // the book that should hold the counts: its pages are empty
        D.bg('wood');
        ctx.fillStyle = 'rgba(60,45,20,0.25)'; ctx.fillRect(120, 830, 880, 640);
        rc.rectangle(100, 810, 880, 640, O('bk', { fill: '#7a5230' })); rc.rectangle(130, 836, 410, 588, O('pg1', { fill: '#fbf8ef' })); rc.rectangle(540, 836, 410, 588, O('pg2', { fill: '#fbf8ef' }));
        D.text('人の流れ', 335, 900, 60, { font: MARK }); D.text('調べ', 745, 900, 60, { font: MARK });
        for (let r = 0; r < 6; r++) { rc.line(160, 980 + r * 72, 510, 980 + r * 72, O('gl' + r, { strokeWidth: 3, stroke: '#b9c2cb' })); rc.line(570, 980 + r * 72, 920, 980 + r * 72, O('gr' + r, { strokeWidth: 3, stroke: '#b9c2cb' })); }
        for (const x of [270, 390, 680, 800]) rc.line(x, 950, x, 1380, O('gv' + x, { strokeWidth: 3, stroke: '#b9c2cb' }));
        if (t < none) {   // a glass looks for a single number
          const gx = 540 + Math.sin(v * 3.2) * 250, gy = 1160 + Math.cos(v * 2.4) * 110;
          rc.line(gx + 80, gy + 80, gx + 190, gy + 190, O('mgh', { strokeWidth: 26, stroke: '#5a3d22' })); ctx.fillStyle = 'rgba(207,230,243,0.55)'; ctx.beginPath(); ctx.arc(gx, gy, 112, 0, 7); ctx.fill(); rc.circle(gx, gy, 224, O('mg', { strokeWidth: 12 }));
        }
        D.stamp('none', 'なし', 540, 1150, 220, -0.1, t, none, { fill: 'rgba(251,247,238,0.92)' });
      }],
    ]);
    rows(t, [
      ['f1', 'しかも東京には', 370, 60, T.s(6), T.to(6, '東京には')],
      ['f2', '人の流れを調べた{資料がない}', 495, 58, T.at(6, '人の流れ'), T.e(6)],
    ]);
  });

  // 7  そこで早川は銀座の交差点に立ち、ポケットの豆を一粒ずつ移して、通る人を数えたといいます。
  scene(T.s(7) - 0.08, (t, u) => {
    const a = T.at(7, '豆'), step = 0.36, pass = T.at(7, '通る') - 0.08;
    shots(t, [
      [-1, v => {   // he stands at the crossing of Ginza
        D.bg('sky');
        skyline('sk7', 1240, [[-20, 200, 360, '#d9d0bd', 2], [210, 170, 280, '#cfc7b6', 2], [900, 200, 330, '#d6ccb8', 2]]);
        rc.rectangle(520, 860, 300, 380, O('ck', { fill: '#d6ccb8' })); rc.rectangle(610, 710, 120, 150, O('ckt', { fill: '#cfc7b6' })); rc.polygon([[598, 710], [742, 710], [670, 640]], O('ckr', { fill: '#8a7a5a' }));
        rc.circle(670, 786, 92, O('ckf', { fill: '#fbf7ee' })); rc.line(670, 786, 670, 754, O('ckh', { strokeWidth: 6 })); rc.line(670, 786, 694, 796, O('ckm', { strokeWidth: 6 }));
        for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) rc.rectangle(556 + c * 86, 900 + r * 106, 56, 62, O('ckw' + r + c, { fill: '#cfe6f3', strokeWidth: 3 }));
        rc.rectangle(-20, 1240, W + 40, 410, O('street', { fill: '#b8b2a6' })); D.bg('paper', 1650);
        const tx = lerp(1200, -600, prog(v, 0, 3.2));
        D.at(tx, 1330, 1.25, () => { rc.line(170, -210, 250, -290, O('pole', { strokeWidth: 4 })); rc.rectangle(0, -210, 420, 180, O('tram', { fill: '#5b8a5a' })); rc.rectangle(0, -120, 420, 90, O('tram2', { fill: '#efe3c0', strokeWidth: 3.5 })); for (let i = 0; i < 5; i++) rc.rectangle(20 + i * 80, -196, 56, 62, O('tw' + i, { fill: '#dff1fa', strokeWidth: 3 })); rc.circle(90, -16, 40, O('twh1', { fill: '#4b4f54', strokeWidth: 3.5 })); rc.circle(330, -16, 40, O('twh2', { fill: '#4b4f54', strokeWidth: 3.5 })); });
        [['#7a3b4a', 0.1, 1460], ['#2f3f5a', 0.55, 1520], ['#3f8f7a', 0.85, 1440]].forEach(([suit, ph, y], i) => { const q = ((v * 0.22 + ph) % 1); D.person('wk7' + i, lerp(1200, 380, q), y, { scale: 1.15, suit, plain: i % 2 === 1, flip: true, arm: 1.2, arm2: 1.0, step: Math.sin(v * 7 + i) * 0.6, bob: Math.abs(Math.sin(v * 7 + i)) * -3, hat: i === 1 }); });
        haya('h7', 200, 1600, { scale: 2.15, mood: 'flat', arm: 1.3, arm2: 1.3, look: 7 });
      }],
      [T.at(7, 'ポケット') - 0.08, v => {   // his two pockets, close up: one bean across for every one who passes
        D.bg('paper');
        const suit = '#6a4f35';
        rc.path('M 90 1760 L 90 840 C 90 740, 300 680, 420 668 L 540 830 L 660 668 C 780 680, 990 740, 990 840 L 990 1760 Z', O('coat', { fill: suit }));
        rc.polygon([[420, 668], [660, 668], [540, 830]], O('shirt', { fill: '#ffffff', strokeWidth: 4 }));
        rc.polygon([[516, 720], [564, 720], [574, 900], [540, 950], [506, 900]], O('ctie', { fill: '#2e6b4f', strokeWidth: 4 }));
        rc.polygon([[420, 668], [540, 830], [476, 1010], [300, 760]], O('lap1', { fill: '#5a4229', strokeWidth: 5 })); rc.polygon([[660, 668], [540, 830], [604, 1010], [780, 760]], O('lap2', { fill: '#5a4229', strokeWidth: 5 }));
        for (const by of [1130, 1300, 1470]) rc.circle(540, by, 36, O('btn' + by, { fill: '#3a2c22', strokeWidth: 3.5 }));
        const count = t < a ? 0 : Math.floor((t - a) / step) + 1;
        for (const [px, id] of [[150, 'l'], [650, 'r']]) {
          const n = id === 'l' ? clamp(9 - count, 0, 9) : clamp(count - 1, 0, 9);
          for (let i = 0; i < n; i++) bean(px + 50 + (i % 5) * 46, 1168 - Math.floor(i / 5) * 30 + (i % 2) * 8, i % 2 === 0, 2.0);
          rc.path(`M ${px} 1170 L ${px + 280} 1170 L ${px + 270} 1470 Q ${px + 140} 1510 ${px + 10} 1470 Z`, O('pkt' + id, { fill: '#7a5c3e', strokeWidth: 6 })); rc.line(px, 1216, px + 280, 1216, O('pks' + id, { strokeWidth: 4, stroke: '#3a2c22' }));
        }
        if (count > 0 && count <= 10) { const f = ((t - a) % step) / step; bean(lerp(290, 790, f), 1120 - Math.sin(f * Math.PI) * 260, count % 2 === 1, 2.6); }
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.setLineDash([20, 16]); ctx.beginPath(); ctx.moveTo(300, 1090); ctx.quadraticCurveTo(540, 720, 780, 1090); ctx.stroke(); ctx.restore();
        D.label('pl7', '左ポケット', 290, 1560, 44, t, a - 0.3, a - 0.1); D.label('pr7', '右ポケット', 790, 1560, 44, t, a - 0.2, a);
      }],
      [pass, v => {   // one who passes = one bean
        D.bg('sky'); rc.rectangle(-20, 1150, W + 40, 130, O('st7', { fill: '#b8b2a6' })); D.bg('paper', 1280);
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.setLineDash([22, 18]); ctx.beginPath(); ctx.moveTo(540, 660); ctx.lineTo(540, 1270); ctx.stroke(); ctx.restore();
        let tally = 0;
        for (let i = 0; i < 8; i++) {
          const c = pass + 0.2 + i * 0.36, x = 540 + (t - c) * 560;
          if (t >= c) { tally++; const f = prog(t, c, 0.3); if (f < 1) bean(540, lerp(1180, 1400, f), i % 2 === 0, 2.2); }
          if (x > -160 && x < 1240) D.person('ps7' + i, x, 1230, { scale: 1.65, suit: ['#3a4a3a', '#7a3b4a', '#2f3f5a', '#4b3f2a', '#3f8f7a'][i % 5], plain: i % 2 === 1, arm: 1.2, arm2: 1.0, step: Math.sin(v * 9 + i) * 0.6, bob: Math.abs(Math.sin(v * 9 + i)) * -4, hat: i % 3 === 0 });
        }
        rc.path('M 360 1400 L 720 1400 L 706 1640 Q 540 1690 374 1640 Z', O('pk7', { fill: '#7a5c3e', strokeWidth: 6 })); rc.line(360, 1450, 720, 1450, O('pk7s', { strokeWidth: 4, stroke: '#3a2c22' }));
        for (let i = 0; i < Math.min(tally, 8); i++) bean(420 + (i % 5) * 60, 1396 - Math.floor(i / 5) * 30, i % 2 === 0, 2.0);
        if (tally > 0) D.label('tl7', `${tally}人`, 870, 1440, 110, t, pass + 0.2, pass + 0.25, { font: MARK, bold: true, fill: '#fff6cf', still: true });
      }],
    ]);
    D.tag('tg7', '銀座', t, T.at(7, '銀座'));
    rows(t, [
      ['g1', '銀座の交差点に立ち', 350, 56, T.at(7, '銀座'), T.to(7, '立ち')],
      ['g2', 'ポケットの{豆}を一粒ずつ移して', 465, 56, T.at(7, 'ポケット'), T.to(7, '移して')],
      ['g3', '通る人を数えた…といいます', 580, 54, T.at(7, '通る'), T.e(7)],
    ]);
  });

  // 8  1927年、上野と浅草のあいだに、東洋で初めての地下鉄が走りました。
  scene(T.s(8) - 0.08, (t, u) => {
    const run = T.at(8, '東洋') - 0.08;
    shots(t, [
      [-1, v => {   // the opening day: flags at the entrance, people going down
        D.bg('sky');
        D.skyline('sk8a', 1300, [[-20, 200, 380, '#d9d0bd', 2], [560, 180, 300, '#cfc7b6', 2], [880, 200, 420, '#d6ccb8', 2]]);
        rc.rectangle(-20, 1300, W + 40, 360, O('st8a', { fill: '#b8b2a6' })); D.bg('paper', 1660);
        ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, 1010); ctx.quadraticCurveTo(540, 1110, 1090, 1010); ctx.stroke(); ctx.restore();
        for (let i = 0; i < 13; i++) { const x = 20 + i * 84, y = 1010 + Math.sin(i / 12 * Math.PI) * 50; rc.polygon([[x, y], [x + 56, y + 2], [x + 28, y + 64]], O('bt8' + i, { fill: ['#d6453a', '#fbf7ee', '#f6c543', '#3d74c4'][i % 4], strokeWidth: 3 })); }
        entrance('en8a', 760, 1560, 1.15, '地下鉄', 300);
        for (let i = 0; i < 3; i++) { const q = ((v * 0.35 + i * 0.3) % 1); D.person('go8' + i, lerp(160, 640, q), 1560 - i * 8, { scale: 1.15, suit: ['#7a3b4a', '#2f3f5a', '#3f8f7a'][i], plain: i === 1, arm: 1.2, arm2: 1.0, hat: i === 0, step: Math.sin(v * 7 + i) * 0.6, bob: Math.abs(Math.sin(v * 7 + i)) * -3 }); }
        D.calendar('cal8', 270, 830, pin(t, T.s(8), 0.35) * 1.15, '1927', '12月30日');
      }],
      [T.at(8, '上野') - 0.08, v => {   // from Ueno to Asakusa, under the ground
        D.bg('sky');
        skyline('sk8', 960, [[330, 150, 190, '#d9d0bd', 2], [520, 170, 250, '#cfc7b6', 2]]);
        rc.rectangle(-20, 960, W + 40, H, O('ea8', { fill: '#b98a5a' }));
        rc.rectangle(60, 1180, 960, 230, O('tn8', { fill: '#34323a' })); D.rail('r8', 1396, 60, 1020);
        [[190, '上野', T.at(8, '上野')], [890, '浅草', T.at(8, '浅草')]].forEach(([x, name, a], i) => {
          rc.rectangle(x - 46, 960, 92, 220, O('sh8' + i, { fill: '#34323a', strokeWidth: 4 })); for (let k = 0; k < 5; k++) rc.line(x - 40, 990 + k * 40, x + 40, 990 + k * 40, O('stp8' + i + k, { strokeWidth: 3, stroke: '#8d8a84' }));
          D.at(x, 960, pin(t, a), () => { rc.line(0, 0, 0, -120, O('st8p' + i, { strokeWidth: 9 })); rc.rectangle(-150, -260, 300, 140, O('st8' + i, { fill: '#fbf7ee', strokeWidth: 6 })); D.text(name, 0, -186, 100, { font: MARK }); });
        });
        const q = easeInOut(prog(t, T.at(8, '浅草'), 0.9));
        ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.setLineDash([26, 20]); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(190, 1296); ctx.lineTo(lerp(190, 890, q), 1296); ctx.stroke(); ctx.restore();
      }],
      [run, v => {   // the first run: the platform cheers
        D.bg('wall');
        rc.rectangle(-20, 640, W + 40, 44, O('cl8', { fill: '#8b9aa5' }));
        rc.rectangle(150, 700, 780, 130, O('bn8', { fill: '#fbf7ee', strokeWidth: 6 })); rc.rectangle(150, 700, 780, 22, O('bn8a', { fill: RED, strokeWidth: 3 })); rc.rectangle(150, 808, 780, 22, O('bn8b', { fill: RED, strokeWidth: 3 }));
        D.text('祝　開通', 540, 768, 78, { font: MARK, color: RED });
        D.rail('r8c', 1330);
        const x = lerp(-1300, -120, easeOut(prog(v, 0, 1.1))) + v * 12;
        beam(x + 520 * 1.9, 1330 - 62 * 1.9, 420); car('car8', x, 1330, 1.9);
        rc.rectangle(-20, 1326, W + 40, 330, O('pf8', { fill: '#cfc8ba' })); rc.rectangle(-20, 1326, W + 40, 16, O('pf8e', { fill: '#fbf7ee', strokeWidth: 3 })); D.bg('paper', 1656);
        [[170, '#3a4a3a', '#d9a521', true], [540, '#7a3b4a', '#3d74c4', false], [910, '#4b3f2a', '#2e8b57', true]].forEach(([fx, suit, tie, hat], i) => {
          const fy = 1560 + Math.sin(u * 12 + i * 2) * 10;
          rc.line(fx + 150, fy + 60, fx + 150, fy - 190, O('fl8p' + i, { strokeWidth: 7 })); rc.rectangle(fx + 150, fy - 190, 110, 76, O('fl8' + i, { fill: '#fbfbf8', strokeWidth: 4 })); rc.circle(fx + 205, fy - 152, 40, O('fl8c' + i, { fill: RED, stroke: RED, strokeWidth: 1 }));
          D.face('ch8' + i, fx, fy, 0.5, { mood: 'laugh', suit, tie, hat: hat ? true : null, hair: hat ? null : '#4a3b2e', flip: i === 2 });
        });
        confetti('cf8', u, 26, 840, 520);
      }],
    ]);
    D.tag('tg8', '1927年12月30日', t, T.s(8));
    rows(t, [
      ['h1', '{上野}と{浅草}のあいだに', 370, 60, T.at(8, '上野'), T.to(8, 'あいだに')],
      ['h2', '東洋で初めての地下鉄が走った', 495, 60, T.at(8, '東洋'), T.e(8), { font: MARK, bold: true }],
    ]);
  });

  // 9  たった2.2キロでしたが、初日は1時間待ちの行列ができます。
  scene(T.s(9) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // only 2.2 km: the whole line fits on a ruler
        D.bg('wood');
        const a = T.at(9, '2.2');
        ctx.fillStyle = 'rgba(60,45,20,0.25)'; ctx.fillRect(110, 1110, 880, 230);
        rc.rectangle(100, 1100, 880, 230, O('ruler', { fill: '#f2d77a', strokeWidth: 6 }));
        for (let i = 0; i <= 22; i++) rc.line(140 + i * 36, 1100, 140 + i * 36, 1100 + (i % 10 === 0 ? 90 : i % 5 === 0 ? 64 : 40), O('tick' + i, { strokeWidth: 4 }));
        D.text('0', 140, 1250, 50, { font: MARK }); D.text('1', 500, 1250, 50, { font: MARK }); D.text('2', 860, 1250, 50, { font: MARK }); D.text('km', 940, 1290, 36, { font: MARK });
        const q = easeOut(prog(v, 0.1, 0.8));
        rc.line(140, 1020, lerp(140, 932, q), 1020, O('ln9', { strokeWidth: 26, stroke: '#f39700' }));
        rc.circle(140, 1020, 70, O('s9a', { fill: '#fbf7ee', strokeWidth: 6 })); if (q > 0.98) rc.circle(932, 1020, 70, O('s9b', { fill: '#fbf7ee', strokeWidth: 6 }));
        D.text('上野', 140, 900, 64, { font: MARK }); if (q > 0.98) D.text('浅草', 932, 900, 64, { font: MARK });
        car('rc9', lerp(80, 740, q), 1012, 0.3);
        D.label('km9', 'たった2.2キロ', 540, 760, 104, t, a, a + 0.25, { bold: true, fill: '#fff6cf', color: RED });
      }],
      [T.at(9, '初日') - 0.08, v => {   // the first day: a line that winds and winds
        D.bg('paper');
        entrance('en9', 930, 960, 0.6);
        const pts = [];
        for (let x = 800; x >= 130; x -= 96) pts.push([x, 1090]);
        for (let x = 130; x <= 950; x += 96) pts.push([x, 1300]);
        for (let x = 950; x >= 130; x -= 96) pts.push([x, 1510]);
        const shown = Math.ceil(pts.length * easeOut(prog(v, 0, 1.2)));
        pts.slice(0, shown).forEach(([x, y], i) => D.person('q9' + i, x, y + (y === 1300 ? 0 : 0), { scale: 0.74, suit: ['#7a3b4a', '#3a4a3a', '#2f3f5a', '#4b3f2a', '#3f8f7a', '#4a3636'][i % 6], plain: i % 2 === 0, flip: y === 1300, arm: 1.2, arm2: 1.2, bob: Math.sin(u * 4 + i) * 2, hat: i % 4 === 0, mood: i % 3 === 0 ? 'flat' : 'ok' }));
        const q = T.at(9, '1時間');
        D.at(230, 770, pin(t, q), () => {   // a clock: a whole hour
          rc.circle(0, 0, 250, O('ck9', { fill: '#fbf7ee', strokeWidth: 7 })); ctx.fillStyle = 'rgba(207,46,35,0.35)'; ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, 112, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog(t, q, 0.8)); ctx.closePath(); ctx.fill();
          rc.line(0, 0, 0, -84, O('ck9h', { strokeWidth: 8 })); rc.line(0, 0, Math.sin(prog(t, q, 0.8) * 6.283) * 100, -Math.cos(prog(t, q, 0.8) * 6.283) * 100, O('ck9m', { strokeWidth: 6, stroke: RED }));
        });
        D.stamp('w9', '1時間待ち', 610, 745, 96, -0.06, t, q + 0.1, { fill: 'rgba(251,247,238,0.94)' });
      }],
    ]);
    rows(t, [
      ['i1', 'たった{2.2キロ}でしたが', 370, 60, T.s(9), T.to(9, 'でしたが')],
      ['i2', '初日は{1時間待ち}の行列', 495, 62, T.at(9, '初日'), T.e(9)],
    ]);
  });

  // 10 それから13年後、ライバルの鉄道会社が、早川の会社の株を買い集めました。
  scene(T.s(10) - 0.08, (t, u) => {
    const a = T.at(10, '株');
    const shadow = (x, y, s) => D.at(x, y, s, () => {   // the rival: a dark figure with a hat, his back to us
      rc.path('M -230 360 C -230 220, -130 180, -62 158 L 62 158 C 130 180, 230 220, 230 360 Z', O('rvs', { fill: '#2a2a2e' })); rc.circle(0, 0, 300, O('rvh', { fill: '#2a2a2e' }));
      rc.path('M -132 -110 C -132 -290, 132 -290, 132 -110 Z', O('rvhat', { fill: '#1c1c20' })); rc.line(-196, -110, 196, -110, O('rvb', { strokeWidth: 16 }));
    });
    shots(t, [
      [-1, v => { underTokyo('u10', v, 1260, 200); D.yearFlip('cal10', t, T.s(10), T.to(10, '13年後'), 1927, 1940, 540, 900, 1.35, '13年後'); }],
      [T.at(10, 'ライバル') - 0.08, v => {   // the rival railway looms over his company
        D.bg('wall'); D.ground(1560, '#bdb4a3');
        building('co10', 110, 1560, 330, 420, '#f2d77a', 3); rc.rectangle(100, 1060, 350, 84, O('cos', { fill: '#fbf7ee', strokeWidth: 5 })); D.text('早川の会社', 275, 1104, 54, { font: MARK });
        const k = easeOut(prog(v, 0, 0.5));
        shadow(lerp(1300, 760, k), 1010, 1.25);
        rc.line(lerp(1300, 700, k), 1300, lerp(1200, 560, k), 1270, O('rarm', { strokeWidth: 70, stroke: '#2a2a2e' })); glove('gl10', lerp(1180, 500, k), 1268, 0.9, Math.PI);
        D.label('rv10', 'ライバルの鉄道会社', 700, 1480, 50, t, T.at(10, 'ライバル') + 0.3, T.to(10, '会社が'), { fill: '#2a2a2e', color: '#f3e9c6' });
      }],
      [T.at(10, '早川の') - 0.08, v => {   // the shares of his company, taken piece by piece
        D.bg('wall');
        const cx = 460, cy = 1090, r = 300, n = 12;
        for (let i = 0; i < n; i++) {
          const taken = i < 4 ? easeOut(prog(t, a + i * 0.26, 0.4)) : 0;
          const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n, mid = (a0 + a1) / 2;
          const ox = Math.cos(mid) * taken * 30 + taken * 150, oy = Math.sin(mid) * taken * 30 - taken * 40;
          rc.path(`M ${cx + ox} ${cy + oy} L ${cx + ox + Math.cos(a0) * r} ${cy + oy + Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${cx + ox + Math.cos(a1) * r} ${cy + oy + Math.sin(a1) * r} Z`, O('sl' + i, { fill: taken > 0.5 ? '#2a2a2e' : '#f2c230', strokeWidth: 5 }));
        }
        rc.circle(cx, cy, 190, O('plc', { fill: '#fbf7ee', strokeWidth: 5 })); D.text('株', cx, cy + 4, 130, { font: MARK, color: '#3d74c4' });
        D.text('早川の会社', cx, cy + 372, 54, { font: MARK });
        rc.line(1140, 820, 960, 900, O('rarm2', { strokeWidth: 76, stroke: '#2a2a2e' })); glove('gl10b', 900, 920, 0.95, Math.PI + 0.35 + Math.sin(u * 5) * 0.05);
        haya('h10', 150, 1640, { scale: 1.5, hair: '#8d8a84', mood: t > a ? 'wow' : 'flat', worry: true, arm: t > a ? -1.2 : 1.1, arm2: 1.1 });
        if (t > a) D.sweat(210, 1290, u, 1.5);
      }],
    ]);
    D.tag('tg10', '1940年', t, T.to(10, '13年後'));
    rows(t, [
      ['j1', 'それから{13年後}', 345, 56, T.s(10), T.to(10, '13年後')],
      ['j2', 'ライバルの鉄道会社が', 460, 56, T.at(10, 'ライバル'), T.to(10, '会社が')],
      ['j3', '早川の会社の{株}を買い集めた', 580, 58, T.at(10, '早川'), T.e(10), { font: MARK, bold: true }],
    ]);
  });

  // 11 早川は社長を退き、自分がつくった地下鉄を去ります。
  scene(T.s(11) - 0.08, (t, u) => {
    const a = T.at(11, '退き');
    shots(t, [
      [-1, v => {   // the president's chair is empty, the name plate falls
        D.bg('wall'); D.ground(1560, '#bdb4a3');
        rc.path('M 400 1200 L 400 860 Q 400 780 480 780 L 600 780 Q 680 780 680 860 L 680 1200 Z', O('chair', { fill: '#8c2f25' }));
        ctx.save(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.setLineDash([18, 14]); ctx.beginPath(); ctx.arc(540, 960, 70, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.ellipse(540, 1120, 70, 90, 0, Math.PI, 0); ctx.stroke(); ctx.restore();
        rc.rectangle(150, 1200, 780, 60, O('desk', { fill: '#9a6b3d' })); rc.rectangle(190, 1260, 700, 300, O('deskf', { fill: '#7a5230' }));
        const f = easeOut(prog(t, a, 0.6));
        D.at(lerp(540, 300, f), lerp(1200, 1560, f * f), 1, () => { rc.polygon([[-170, 0], [170, 0], [140, -110], [-140, -110]], O('np', { fill: '#fbf7ee', strokeWidth: 5 })); D.text('社長', 0, -52, 84, { font: MARK }); }, -f * 1.4);
        haya('h11', lerp(700, 900, prog(v, 0.2, 1.4)), 1640, { scale: 1.7, hair: '#8d8a84', mood: 'sad', arm: 1.3, arm2: 1.2, bag: true, look: -5 });
      }],
      [T.at(11, '自分が') - 0.08, v => {   // he walks away above; under the ground his train runs on without him
        D.bg('sky');
        skyline('sk11', 1010, [[560, 160, 190, '#d9d0bd', 2], [760, 150, 250, '#cfc7b6', 2], [930, 150, 160, '#d6ccb8', 2]]);
        rc.rectangle(-20, 1010, W + 40, H, O('ea11', { fill: '#b98a5a' }));
        tunnel('tn11', 1170, 1580);
        car('car11', lerp(-200, 520, prog(v, 0, 2.0)), 1564, 1.5);
        haya('h11b', lerp(520, 150, prog(v, 0, 2.2)), 1010, { scale: 1.55, hair: '#8d8a84', mood: 'sad', flip: true, arm: 1.35, arm2: 1.2, bag: true, bob: Math.abs(Math.sin(v * 5)) * -4, step: Math.sin(v * 5) * 0.6, lean: 0.04 });
      }],
    ]);
    rows(t, [
      ['k1', '早川は{社長を退き}', 370, 60, T.s(11), T.to(11, '退き')],
      ['k2', '自分がつくった地下鉄を去った', 495, 58, T.at(11, '自分が'), T.e(11)],
    ]);
  });

  // 12 その2年後、61歳で亡くなりました。
  scene(T.s(12) - 0.08, (t, u) => {
    D.bg('room'); D.ground(1560, '#b9c08f', 0.6);
    D.tag('tg12', '1942年', t, T.s(12));
    rc.rectangle(250, 690, 580, 760, O('fr', { fill: '#6b5a44' })); rc.rectangle(296, 736, 488, 668, O('fr2', { fill: '#efe7d2' }));
    ctx.save(); ctx.beginPath(); ctx.rect(300, 740, 480, 660); ctx.clip();
    D.face('f12', 540, 1010, 0.92, { hair: '#8d8a84', glasses: true, mustache: true, suit: '#6a4f35', tie: '#2e6b4f', mood: 'ok' });
    ctx.restore();
    rc.polygon([[250, 690], [400, 690], [250, 840]], O('rb1', { fill: '#1d1a16' })); rc.polygon([[830, 690], [680, 690], [830, 840]], O('rb2', { fill: '#1d1a16' }));
    for (const [vx, id] of [[130, 'a'], [950, 'b']]) {
      rc.rectangle(vx - 60, 1380, 120, 180, O('vase' + id, { fill: '#7fb0d6' }));
      [[-34, 1230], [0, 1170], [36, 1240]].forEach(([dx, fy], i) => { rc.line(vx + dx, 1380, vx + dx, fy, O('stem' + id + i, { strokeWidth: 5, stroke: '#4f7f4a' })); for (let k = 0; k < 6; k++) rc.circle(vx + dx + Math.cos(k * 1.05) * 24, fy + Math.sin(k * 1.05) * 24, 28, O('pt' + id + i + k, { fill: '#fbfbf8', strokeWidth: 2.5 })); rc.circle(vx + dx, fy, 22, O('ctr' + id + i, { fill: '#f6c543', strokeWidth: 2.5 })); });
    }
    rows(t, [['l1', 'その2年後、{61歳}で亡くなった', 420, 58, T.s(12), T.e(12)]]);
  });

  // 13 いま東京の地下鉄は、毎日、何百万人もの人を運んでいます。
  scene(T.s(13) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // from one short line to a whole net
        D.bg('paper');
        metro(prog(v, 0.35, 1.0));
        ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = INK; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(60, 760); ctx.lineTo(420, 760); ctx.stroke(); ctx.strokeStyle = '#f39700'; ctx.lineWidth = 24; ctx.beginPath(); ctx.moveTo(60, 760); ctx.lineTo(420, 760); ctx.stroke(); ctx.restore();
        if (v < 0.9) D.fade(1 - prog(v, 0.6, 0.3), () => D.text('最初は、これだけ', 300, 690, 48, { font: MARK, outline: 12 }));
      }],
      [T.at(13, '毎日') - 0.08, v => {   // a full train, a sea of heads
        D.bg('wall');
        rc.path('M 250 1390 L 250 860 Q 250 760 350 760 L 730 760 Q 830 760 830 860 L 830 1390 Z', O('tf', { fill: '#dfe3e6' }));
        rc.rectangle(300, 820, 480, 250, O('tfw', { fill: '#bfe0f0' })); rc.rectangle(250, 1120, 580, 90, O('tfb', { fill: '#f39700', strokeWidth: 5 }));
        rc.circle(340, 1290, 70, O('tfl1', { fill: '#fff3b0' })); rc.circle(740, 1290, 70, O('tfl2', { fill: '#fff3b0' })); rc.rectangle(430, 770, 220, 40, O('tfd', { fill: '#2a2a2e', strokeWidth: 3 }));
        for (let i = 0; i < 4; i++) rc.circle(360 + i * 120, 960 + (i % 2) * 20, 86, O('pas' + i, { fill: '#f3c891', strokeWidth: 4 }));
        const r = (i, m) => ((D.hash('hd' + i) % 1000) / 1000 * m);
        for (let row = 0; row < 3; row++) for (let i = 0; i < 9; i++) { const k = row * 9 + i, x = 40 + i * 128 + (row % 2) * 60, y = 1470 + row * 80 + Math.sin(u * 5 + k) * 5; rc.circle(x, y, 110, O('hd' + k, { fill: '#f3c891', strokeWidth: 4 })); rc.path(`M ${x - 54} ${y - 10} C ${x - 60} ${y - 80}, ${x + 60} ${y - 80}, ${x + 54} ${y - 10} C ${x + 30} ${y - 40}, ${x - 30} ${y - 40}, ${x - 54} ${y - 10} Z`, O('hh' + k, { fill: ['#2b2622', '#4a3b2e', '#6b5a44', '#8d8a84'][Math.floor(r(k, 4))], strokeWidth: 3 })); }
        D.stamp('mil', '何百万人', 540, 1240, 150, -0.07, t, T.at(13, '何百万'), { fill: 'rgba(251,247,238,0.95)' });
        D.label('day13', '毎日', 250, 1060, 70, t, T.at(13, '毎日'), T.at(13, '毎日') + 0.2, { font: MARK, fill: '#fff6cf', rot: -0.06 });
      }],
    ]);
    D.tag('tg13', 'いま', t, T.s(13));
    rows(t, [
      ['m1', 'いま、東京の地下鉄は', 370, 60, T.s(13), T.to(13, '地下鉄は')],
      ['m2', '毎日{何百万人}もの人を運ぶ', 495, 60, T.at(13, '毎日'), T.e(13)],
    ]);
  });

  // 14 2027年には、あの最初の線路が100歳になります。
  scene(T.s(14) - 0.08, (t, u) => {
    shots(t, [
      [-1, v => {   // a station of today: the orange line, the calendar of 2027
        D.bg('wall');
        rc.rectangle(-20, 1200, W + 40, 70, O('or14', { fill: '#f39700', strokeWidth: 4 }));
        for (let x = -20; x < W; x += 120) for (let y = 640; y < 1200; y += 120) rc.rectangle(x, y, 120, 120, O('tile' + x + y, { stroke: '#cfc8ba', strokeWidth: 2, roughness: 0.3 }));
        rc.rectangle(-20, 1270, W + 40, 60, O('pf14a', { fill: '#cfc8ba', strokeWidth: 4 })); rc.rectangle(-20, 1276, W + 40, 16, O('pf14y', { fill: '#f2c230', strokeWidth: 2.5 })); D.bg('paper', 1330);
        [110, 290, 790, 970].forEach((x, i) => D.person('w14' + i, x, 1300 + (i % 2) * 6, { scale: 1.2, suit: ['#3a4a3a', '#7a3b4a', '#2f3f5a', '#3f8f7a'][i], plain: i % 2 === 1, arm: 1.2, arm2: 1.0, bob: Math.sin(v * 5 + i) * 2, flip: i > 1 }));
        D.calendar('cal14', 540, 880, pin(t, T.s(14), 0.35) * 1.4, '2027');
      }],
      [T.at(14, 'あの') - 0.08, v => {   // the first line turns 100
        D.bg('sky');
        D.rail('r14', 1060); car('car14', lerp(-700, 240, easeOut(prog(v, 0, 1.0))), 1060, 1.35);
        rc.rectangle(-20, 1070, W + 40, 600, O('fl14', { fill: '#e7d9b8' })); D.bg('paper', 1650);
        [[150, '上野'], [930, '浅草']].forEach(([x, name], i) => { rc.rectangle(x - 110, 660, 220, 100, O('s14' + i, { fill: '#fbf7ee', strokeWidth: 5 })); D.text(name, x, 712, 70, { font: MARK }); });
        cake(540, 1600, pin(t, T.at(14, '100歳') - 0.2, 0.4) * 1.5, u);
        if (t > T.at(14, '100歳')) confetti('cf14', u, 24, 640, 700);
      }],
    ]);
    rows(t, [
      ['o1', '{2027年}には', 370, 60, T.s(14), T.to(14, 'には')],
      ['o2', 'あの最初の線路が{100歳}になる', 495, 58, T.at(14, 'あの'), T.e(14)],
    ]);
  });

  // 15 「ほら吹き」が豆で数えた答えは、まちがっていなかったのです。
  scene(T.s(15) - 0.08, (t, u) => {
    const a = T.at(15, 'まちがって');
    D.bg('dusk'); D.ground(1540, '#d9b98a');
    const k = prog(t, a, 0.5);
    if (k > 0) { ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(540, 1160, 430, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * easeOut(k)); ctx.stroke(); ctx.restore(); }
    haya('h15', 540, 1540, { scale: 2.5, mood: 'ok', arm: -0.8, arm2: 1.1, bob: Math.sin(u * 3) * 1.5 });
    [[735, 1050, true], [790, 1000, false], [845, 1052, true]].forEach(([x, y, dark], i) => bean(x, y + Math.sin(u * 4 + i) * 7, dark, 2.4));
    // the two who laughed at the start: now they stare
    D.face('lf15a', 140, 1200, 0.5, { mood: t > a ? 'wow' : 'laugh', suit: '#3a4a3a', tie: '#d9a521', hair: '#4a3b2e', tears: t <= a });
    D.face('lf15b', 950, 1420, 0.5, { mood: t > a ? 'wow' : 'laugh', suit: '#4a3636', tie: '#3d74c4', hat: true, flip: true, tears: t <= a });
    // the name they gave him is struck out; the one he is known by takes its place
    const off = easeOut(prog(t, a + 0.25, 0.5));
    D.fade(1 - off, () => D.label('tag15', 'ほら吹き', 540 - off * 60, 720 + off * off * 500, 84, t, T.s(15), T.s(15) + 0.1, { font: MARK, bold: true, fill: '#fff6cf', color: RED, rot: -0.05 - off * 0.8, still: true }));
    if (t > a && off < 1) rc.line(390, 730, 690, 710, O('strike', { stroke: RED, strokeWidth: 12 }));
    D.label('tag15b', '地下鉄の父', 540, 720, 84, t, a + 0.5, a + 0.8, { font: MARK, bold: true, fill: '#1f4d3a', color: '#f3e9c6' });
    rows(t, [
      ['p1', '「{ほら吹き}」が豆で数えた答えは', 370, 56, T.s(15), T.to(15, '答えは')],
      ['p2', 'まちがっていなかった', 495, 70, a, T.e(15), { font: MARK, bold: true }],
    ]);
    const c = prog(t, T.e(15) + 0.2, 0.5);
    if (c > 0) D.fade(c, () => D.text('声：VOICEVOX:青山龍星　／　音楽：竹笛', W / 2, 1700, 34, { color: '#5a5347' }));
  });

  return scenes;
};
