// The drawing kit of the drawn videos: paper, labels that are typed with the voice, little people and things.
// Runs in the page (page.html); every shape is drawn by rough.js with a fixed seed, so a frame is the same
// every time it is drawn. Everything hangs on window.D; a story's scenes.js draws with it.
(function () {
  const W = 1080, H = 1920;
  const INK = '#1d1a16';
  const HAND = '"Yomogi", "Klee One", sans-serif';       // the labels
  const MARK = '"Yusei Magic", "Yomogi", sans-serif';    // the big words
  const D = { W, H, INK, HAND, MARK, chars: new Set() };
  let ctx, rc;

  D.init = canvas => { ctx = canvas.getContext('2d'); rc = rough.canvas(canvas); D.ctx = ctx; D.rc = rc; };

  // ---------- numbers ----------
  const hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0) % 2147483646 + 1; };
  const O = (key, o) => Object.assign({ seed: hash(key), roughness: 0.7, bowing: 0.6, stroke: INK, strokeWidth: 5, fillStyle: 'solid', disableMultiStroke: true, disableMultiStrokeFill: true }, o || {});
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const prog = (t, a, d) => clamp((t - a) / d);
  const easeOut = x => 1 - Math.pow(1 - x, 3);
  const easeInOut = x => x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const easeBack = x => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
  const lerp = (a, b, p) => a + (b - a) * p;
  const rand = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  Object.assign(D, { O, clamp, prog, easeOut, easeInOut, easeBack, lerp, hash });
  // 0 → 1 as an element comes in at moment a (a little overshoot)
  D.pin = (t, a, d = 0.32) => t < a ? 0 : easeBack(prog(t, a, d));

  // ---------- paper ----------
  const papers = {};
  const TONES = {
    paper: ['#ece2cb', '120,95,50'], wall: ['#e3d9c6', '90,80,60'], sky: ['#cfe3ef', '60,100,140'],
    wood: ['#c99a62', '110,70,30'], room: ['#e6dcc0', '110,100,50'], dusk: ['#f3d9b8', '170,110,60'],
    night: ['#27335a', '10,15,40'], green: ['#dbe6c8', '70,110,60'],
  };
  D.paper = name => {
    if (papers[name]) return papers[name];
    const [base, fibre] = TONES[name];
    const p = document.createElement('canvas'); p.width = W; p.height = H;
    const c = p.getContext('2d'); c.fillStyle = base; c.fillRect(0, 0, W, H);
    const r = rand(7); c.lineCap = 'round';
    for (let i = 0; i < 9000; i++) {
      const x = r() * W, y = r() * H, l = 10 + r() * 34;
      c.strokeStyle = r() < 0.5 ? `rgba(255,255,255,${0.05 + r() * 0.10})` : `rgba(${fibre},${(0.03 + r() * 0.06).toFixed(3)})`;
      c.lineWidth = 1 + r() * 1.6;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + l * 0.55, y + l); c.stroke();
    }
    return papers[name] = p;
  };
  D.bg = (name, y0 = 0, y1 = H) => ctx.drawImage(D.paper(name), 0, y0, W, y1 - y0, 0, y0, W, y1 - y0);
  D.ground = (y, color = '#d6c8a8', alpha = 0.55) => {
    ctx.save(); ctx.fillStyle = color; ctx.globalAlpha = alpha; ctx.fillRect(0, y, W, H - y); ctx.restore();
    rc.line(-10, y, W + 10, y, O('ground' + y));
  };
  D.at = (x, y, s, fn, rot) => { if (s <= 0.001) return; ctx.save(); ctx.translate(x, y); if (rot) ctx.rotate(rot); ctx.scale(s, s); fn(); ctx.restore(); };
  D.fade = (alpha, fn) => { if (alpha <= 0.001) return; ctx.save(); ctx.globalAlpha *= clamp(alpha); fn(); ctx.restore(); };

  // ---------- text ----------
  D.text = (str, x, y, size, o = {}) => {
    for (const ch of str) D.chars.add(ch);
    ctx.save();
    ctx.font = `${o.weight || ''} ${size}px ${o.font || HAND}`;
    ctx.textAlign = o.align || 'center'; ctx.textBaseline = o.baseline || 'middle';
    if (o.rot) { ctx.translate(x, y); ctx.rotate(o.rot); x = 0; y = 0; }
    if (o.outline) { ctx.lineWidth = o.outline; ctx.strokeStyle = o.outlineColor || '#fbf7ee'; ctx.lineJoin = 'round'; ctx.strokeText(str, x, y); }
    ctx.fillStyle = o.color || INK; ctx.fillText(str, x, y);
    ctx.restore();
  };
  // "ひとつの{ウソ}から" → pieces, the ones in braces in red
  const pieces = text => { const out = []; text.split(/(\{[^}]*\})/).forEach(p => { if (!p) return; out.push(p[0] === '{' ? [p.slice(1, -1), true] : [p, false]); }); return out; };
  const plain = text => text.replace(/[{}]/g, '');
  D.measure = (text, size, font) => { ctx.save(); ctx.font = `${size}px ${font || HAND}`; const w = ctx.measureText(plain(text)).width; ctx.restore(); return w; };
  // A label: its box pops in at `a`, its text is typed from `a` to `b` (give the voice's moments). No b: all at once.
  D.label = (key, text, cx, cy, size, t, a, b, o = {}) => {
    if (t < a - 0.14) return;
    for (const ch of text) D.chars.add(ch);
    const font = o.font || HAND, str = plain(text);
    ctx.save();
    ctx.font = `${size}px ${font}`;
    const w = ctx.measureText(str).width + size * 0.9, h = size * 1.7;
    const x = cx - w / 2, y = cy - h / 2;
    const s = o.still ? 1 : easeBack(prog(t, a - 0.14, 0.22));
    ctx.translate(cx, cy); if (o.rot) ctx.rotate(o.rot); ctx.scale(s, s); ctx.translate(-cx, -cy);
    ctx.fillStyle = 'rgba(60,45,20,0.22)'; ctx.fillRect(x + 7, y + 8, w, h);
    rc.rectangle(x, y, w, h, O(key, { fill: o.fill || '#f7f1e3', strokeWidth: o.bold ? 6.5 : 4.5, roughness: 0.9, stroke: o.stroke || INK }));
    const n = b == null || o.still ? str.length : Math.ceil(str.length * clamp((t - a) / Math.max(0.05, b - a)));
    ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
    let px = x + size * 0.45, left = n;
    for (const [piece, red] of pieces(text)) {
      if (left <= 0) break;
      const shown = piece.slice(0, left); left -= shown.length;
      ctx.fillStyle = red ? (o.red || '#cf3a2b') : (o.color || INK);
      ctx.fillText(shown, px, cy + size * 0.04);
      px += ctx.measureText(piece).width;
    }
    ctx.restore();
  };
  // The small tag at the top left (the year, the place)
  D.tag = (key, text, t, a) => { const size = 50; const w = D.measure(text, size) + size * 0.9; D.label(key, text, 64 + w / 2, 150, size, t, a, a + 0.25); };
  // A red rubber stamp, thumped on at moment a
  D.stamp = (key, text, cx, cy, size, rot, t, a, o = {}) => {
    if (t < a) return;
    for (const ch of text) D.chars.add(ch);
    const p = prog(t, a, 0.16), s = lerp(2.2, 1, easeOut(p)), color = o.color || '#cf2e23';
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(s, s); ctx.globalAlpha = clamp(p * 1.6);
    ctx.font = `${size}px ${MARK}`;
    const w = ctx.measureText(text).width + size * 0.8, h = size * 1.55;
    if (o.fill) { ctx.fillStyle = o.fill; ctx.fillRect(-w / 2, -h / 2, w, h); }
    rc.rectangle(-w / 2, -h / 2, w, h, O(key, { stroke: color, strokeWidth: size * 0.11, roughness: 1.1 }));
    rc.rectangle(-w / 2 + size * 0.12, -h / 2 + size * 0.12, w - size * 0.24, h - size * 0.24, O(key + 'in', { stroke: color, strokeWidth: size * 0.04, roughness: 1.1 }));
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, size * 0.04);
    ctx.restore();
  };
  // A speech balloon; rows: [[text, a, b], …] typed one after the other; tail points to (tx, ty)
  D.balloon = (key, rows, cx, cy, size, t, a, tx, ty, o = {}) => {
    if (t < a) return;
    const font = o.font || HAND;
    ctx.save(); ctx.font = `${size}px ${font}`;
    let w = 0; for (const [text] of rows) { w = Math.max(w, ctx.measureText(plain(text)).width); for (const ch of text) D.chars.add(ch); }
    const lh = size * 1.45, h = lh * rows.length + size * 0.9; w += size * 1.4;
    const s = easeBack(prog(t, a, 0.26));
    ctx.translate(cx, cy); ctx.scale(s, s); ctx.translate(-cx, -cy);
    const x = cx - w / 2, y = cy - h / 2, r = 46;
    const bx = clamp(tx, x + 90, x + w - 90);
    ctx.fillStyle = 'rgba(60,45,20,0.20)';
    ctx.beginPath(); ctx.roundRect(x + 8, y + 10, w, h, r); ctx.fill();
    const down = ty > cy;
    const edge = down ? y + h : y;
    rc.path(`M ${x + r} ${y} L ${x + w - r} ${y} Q ${x + w} ${y} ${x + w} ${y + r} L ${x + w} ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} L ${x + r} ${y + h} Q ${x} ${y + h} ${x} ${y + h - r} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} Z`, O(key, { fill: o.fill || '#fffdf4', strokeWidth: 6 }));
    rc.polygon([[bx - 34, edge - (down ? 4 : -4)], [bx + 34, edge - (down ? 4 : -4)], [tx, ty]], O(key + 'tail', { fill: o.fill || '#fffdf4', strokeWidth: 6 }));
    ctx.strokeStyle = o.fill || '#fffdf4'; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(bx - 26, edge); ctx.lineTo(bx + 26, edge); ctx.stroke();
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    rows.forEach(([text, ra, rb], i) => {
      const str = plain(text);
      const n = Math.ceil(str.length * clamp((t - ra) / Math.max(0.05, rb - ra)));
      let px = x + size * 0.7, left = n;
      for (const [piece, red] of pieces(text)) {
        if (left <= 0) break;
        const shown = piece.slice(0, left); left -= shown.length;
        ctx.fillStyle = red ? '#cf3a2b' : INK; ctx.fillText(shown, px, y + size * 0.45 + lh * (i + 0.5));
        px += ctx.measureText(piece).width;
      }
    });
    ctx.restore();
  };

  // ---------- people ----------
  // (x, y) is where the feet stand. o: scale, flip, suit, tie, mood (ok sad wow laugh stern flat), arm (angle),
  // arm2, old (grey hair, glasses), hair (a colour), glasses, mustache, hat, helmet, back (seen from behind),
  // shade (a dark figure, no face), noLegs, bob, look, bag
  D.person = (key, x, y, o = {}) => {
    const suit = o.shade ? '#2a2a2e' : (o.suit || '#27304a'), skin = o.shade ? '#2a2a2e' : '#f3c891';
    ctx.save(); ctx.translate(x, y); const k = o.scale || 1; ctx.scale(k * (o.flip ? -1 : 1), k);
    if (o.lean) ctx.rotate(o.lean);
    if (!o.noLegs) {
      const st = o.step || 0;
      rc.line(-16, -52, -18 - st * 14, 0, O(key + 'l1', { strokeWidth: 6 }));
      rc.line(16, -52, 18 + st * 14, 0, O(key + 'l2', { strokeWidth: 6 }));
      rc.line(-18 - st * 14, 0, -30 - st * 14 + (o.walk ? 24 : 0), 0, O(key + 'f1', { strokeWidth: 6 }));
      rc.line(18 + st * 14, 0, 30 + st * 14 + (o.walk ? 12 : 0), 0, O(key + 'f2', { strokeWidth: 6 }));
    }
    ctx.translate(0, o.bob || 0);
    rc.ellipse(0, -112, 92, 132, O(key + 'body', { fill: suit }));
    if (!o.back && !o.plain && !o.shade) {
      rc.polygon([[-13, -172], [13, -172], [0, -128]], O(key + 'shirt', { fill: '#ffffff', strokeWidth: 3 }));
      rc.polygon([[-6, -168], [6, -168], [8, -118], [0, -106], [-8, -118]], O(key + 'tie', { fill: o.tie || '#c0392b', strokeWidth: 3 }));
    }
    const arm = (a, side, id) => {
      const ax = 30 * side, ay = -132, L = 62;
      const ex = ax + Math.cos(a) * L * side, ey = ay + Math.sin(a) * L;
      rc.line(ax, ay, ex, ey, O(key + id, { strokeWidth: 15, stroke: INK }));
      rc.line(ax, ay, ex, ey, O(key + id, { strokeWidth: 8, stroke: suit }));
      return [ex, ey];
    };
    const hand = arm(o.arm == null ? 0.9 : o.arm, 1, 'arm');
    if (o.arm2 != null) arm(o.arm2, -1, 'arm2');
    if (o.bag) {
      rc.rectangle(hand[0] - 34, hand[1] + 6, 68, 50, O(key + 'bag', { fill: '#7a5230', strokeWidth: 4 }));
      rc.arc(hand[0], hand[1] + 8, 34, 30, Math.PI, 2 * Math.PI, false, O(key + 'bagh', { strokeWidth: 4 }));
    }
    rc.circle(0, -212, 96, O(key + 'head', { fill: skin }));
    if (o.old) {   // grey hair on the sides and the back of the head
      rc.path('M -47 -216 C -62 -240, -44 -262, -22 -258 C -34 -246, -40 -232, -47 -216 Z', O(key + 'h1', { fill: '#d9d9d6', strokeWidth: 3.5 }));
      rc.path('M 47 -216 C 62 -240, 44 -262, 22 -258 C 34 -246, 40 -232, 47 -216 Z', O(key + 'h2', { fill: '#d9d9d6', strokeWidth: 3.5 }));
    }
    if (o.hair) rc.path('M -47 -222 C -56 -278, 56 -278, 47 -222 C 30 -252, -30 -252, -47 -222 Z', O(key + 'hair', { fill: o.hair, strokeWidth: 3.5 }));
    if (o.back || o.shade) {
      if (o.old) rc.path('M -46 -206 C -50 -250, 50 -250, 46 -206 C 30 -190, -30 -190, -46 -206 Z', O(key + 'hb', { fill: '#d9d9d6', strokeWidth: 3.5 }));
    } else {
      const ex = o.look || 0;
      ctx.fillStyle = INK; ctx.strokeStyle = INK; ctx.lineCap = 'round';
      if (o.mood === 'laugh') {
        ctx.lineWidth = 4.5; ctx.beginPath(); ctx.arc(-16 + ex, -216, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
        ctx.beginPath(); ctx.arc(16 + ex, -216, 8, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      } else {
        if (D.blink(key)) { ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-21 + ex, -217); ctx.lineTo(-9 + ex, -217); ctx.moveTo(11 + ex, -217); ctx.lineTo(23 + ex, -217); ctx.stroke(); }
        else { ctx.beginPath(); ctx.arc(-15 + ex, -218, 4.6, 0, 7); ctx.arc(17 + ex, -218, 4.6, 0, 7); ctx.fill(); }
      }
      if (o.old || o.glasses) {
        ctx.lineWidth = 3.5;
        ctx.beginPath(); ctx.arc(-15 + ex, -218, 15, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.arc(17 + ex, -218, 15, 0, 7); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0 + ex, -219); ctx.lineTo(2 + ex, -219); ctx.stroke();
      }
      if (o.mustache) { ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(-17 + ex, -196); ctx.quadraticCurveTo(-8 + ex, -208, 1 + ex, -200); ctx.quadraticCurveTo(10 + ex, -208, 19 + ex, -196); ctx.quadraticCurveTo(8 + ex, -198, 1 + ex, -195); ctx.quadraticCurveTo(-6 + ex, -198, -17 + ex, -196); ctx.fill(); ctx.translate(0, 9); }
      ctx.lineWidth = 4.5; ctx.beginPath();
      const m = o.mood || 'ok';
      if (m === 'sad') { ctx.arc(1 + ex, -180, 13, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else if (m === 'stern') { ctx.moveTo(-12 + ex, -188); ctx.lineTo(14 + ex, -190); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-30 + ex, -242); ctx.lineTo(-8 + ex, -236); ctx.moveTo(32 + ex, -242); ctx.lineTo(10 + ex, -236); ctx.stroke(); }
      else if (m === 'flat') { ctx.moveTo(-11 + ex, -188); ctx.lineTo(13 + ex, -188); ctx.stroke(); }
      else if (m === 'wow') { ctx.ellipse(1 + ex, -191, 8, 10, 0, 0, 7); ctx.stroke(); }
      else if (m === 'laugh') { ctx.moveTo(-18 + ex, -198); ctx.quadraticCurveTo(1 + ex, -166, 20 + ex, -198); ctx.closePath(); ctx.fillStyle = '#7a2a22'; ctx.fill(); ctx.stroke(); }
      else { ctx.arc(1 + ex, -204, 15, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
      if (o.mustache) ctx.translate(0, -9);
      if (o.worry) { ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-28 + ex, -238); ctx.lineTo(-8 + ex, -244); ctx.moveTo(30 + ex, -238); ctx.lineTo(10 + ex, -244); ctx.stroke(); }
    }
    if (o.hat) {
      rc.path('M -42 -250 C -42 -306, 42 -306, 42 -250 Z', O(key + 'hat', { fill: o.hat === true ? '#3a3632' : o.hat, strokeWidth: 4.5 }));
      rc.line(-62, -250, 62, -250, O(key + 'hatb', { strokeWidth: 8 }));
    }
    if (o.helmet) {
      rc.path('M -50 -238 C -48 -290, 48 -290, 50 -238 Z', O(key + 'helm', { fill: '#f2c230', strokeWidth: 4.5 }));
      rc.line(-58, -238, 58, -238, O(key + 'brim', { strokeWidth: 6 }));
    }
    ctx.restore();
  };
  D.t = 0;
  D.blink = key => ((D.t * 1000 + hash(key) % 2900) % 2900) < 120;
  // A face close up, with its shoulders: (x, y) the middle of the head, s its size (1: a head 300 px wide).
  // o: suit, tie, hair, old, glasses, mustache, hat, mood (ok laugh flat stern sad wow doubt), flip, tears, noBody
  D.face = (key, x, y, s, o = {}) => {
    const skin = '#f3c891', m = o.mood || 'ok';
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s); if (o.rot) ctx.rotate(o.rot);
    if (!o.noBody) {
      rc.path('M -230 360 C -230 220, -130 180, -62 158 L 62 158 C 130 180, 230 220, 230 360 Z', O(key + 'sh', { fill: o.suit || '#27304a' }));
      rc.polygon([[-46, 152], [46, 152], [0, 236]], O(key + 'col', { fill: '#ffffff', strokeWidth: 4 }));
      rc.polygon([[-17, 166], [17, 166], [24, 270], [0, 300], [-24, 270]], O(key + 'tie', { fill: o.tie || '#c0392b', strokeWidth: 4 }));
    }
    rc.ellipse(-150, 12, 46, 74, O(key + 'e1', { fill: skin })); rc.ellipse(150, 12, 46, 74, O(key + 'e2', { fill: skin }));
    rc.circle(0, 0, 300, O(key + 'head', { fill: skin }));
    if (o.hair) rc.path('M -148 -26 C -176 -200, 176 -200, 148 -26 C 100 -112, -100 -112, -148 -26 Z', O(key + 'hair', { fill: o.hair, strokeWidth: 4.5 }));
    if (o.old) { rc.path('M -148 0 C -190 -70, -140 -140, -80 -128 C -112 -96, -132 -52, -148 0 Z', O(key + 'h1', { fill: '#d9d9d6', strokeWidth: 4 })); rc.path('M 148 0 C 190 -70, 140 -140, 80 -128 C 112 -96, 132 -52, 148 0 Z', O(key + 'h2', { fill: '#d9d9d6', strokeWidth: 4 })); }
    ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineCap = 'round'; ctx.lineWidth = 7;
    const blink = D.blink(key);
    if (m === 'laugh') { for (const ex of [-54, 54]) { ctx.beginPath(); ctx.arc(ex, -6, 24, Math.PI * 1.12, Math.PI * 1.88); ctx.stroke(); } }
    else if (blink) { ctx.beginPath(); ctx.moveTo(-72, -12); ctx.lineTo(-36, -12); ctx.moveTo(36, -12); ctx.lineTo(72, -12); ctx.stroke(); }
    else { const r = m === 'wow' ? 17 : 12; ctx.beginPath(); ctx.arc(-54 + (o.look || 0), -12, r, 0, 7); ctx.arc(54 + (o.look || 0), -12, r, 0, 7); ctx.fill(); }
    if (o.glasses || o.old) { ctx.lineWidth = 6; for (const ex of [-54, 54]) { ctx.beginPath(); ctx.arc(ex, -12, 46, 0, 7); ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(8, -14); ctx.stroke(); }
    ctx.lineWidth = 7; ctx.beginPath();   // the brows
    if (m === 'stern') { ctx.moveTo(-92, -86); ctx.lineTo(-30, -66); ctx.moveTo(92, -86); ctx.lineTo(30, -66); }
    else if (m === 'sad') { ctx.moveTo(-92, -62); ctx.lineTo(-30, -82); ctx.moveTo(92, -62); ctx.lineTo(30, -82); }
    else if (m === 'doubt') { ctx.moveTo(-92, -70); ctx.lineTo(-30, -70); ctx.moveTo(30, -96); ctx.lineTo(92, -84); }
    else if (m === 'wow') { ctx.moveTo(-88, -92); ctx.quadraticCurveTo(-56, -106, -26, -92); ctx.moveTo(26, -92); ctx.quadraticCurveTo(56, -106, 88, -92); }
    ctx.stroke();
    if (o.mustache) { ctx.beginPath(); ctx.moveTo(-58, 58); ctx.quadraticCurveTo(-28, 22, 0, 46); ctx.quadraticCurveTo(28, 22, 58, 58); ctx.quadraticCurveTo(26, 52, 0, 60); ctx.quadraticCurveTo(-26, 52, -58, 58); ctx.fill(); }
    const my = o.mustache ? 26 : 0;
    ctx.lineWidth = 7; ctx.beginPath();
    if (m === 'laugh') { ctx.moveTo(-62, 44 + my); ctx.quadraticCurveTo(0, 150 + my, 62, 44 + my); ctx.closePath(); ctx.fillStyle = '#7a2a22'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.fillStyle = '#e8837a'; ctx.ellipse(0, 92 + my, 26, 14, 0, 0, 7); ctx.fill(); }
    else if (m === 'wow') { ctx.ellipse(0, 76 + my, 22, 30, 0, 0, 7); ctx.fillStyle = '#7a2a22'; ctx.fill(); ctx.stroke(); }
    else if (m === 'sad') { ctx.arc(0, 106 + my, 40, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
    else if (m === 'stern' || m === 'flat') { ctx.moveTo(-36, 76 + my); ctx.lineTo(38, 72 + my); ctx.stroke(); }
    else if (m === 'doubt') { ctx.moveTo(-34, 80 + my); ctx.quadraticCurveTo(4, 66 + my, 40, 84 + my); ctx.stroke(); }
    else { ctx.arc(0, 44 + my, 46, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); }
    if (o.tears) for (const ex of [-104, 104]) { ctx.fillStyle = '#7ec3ea'; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(ex, -4); ctx.quadraticCurveTo(ex + 16, 26, ex, 34); ctx.quadraticCurveTo(ex - 16, 26, ex, -4); ctx.fill(); ctx.stroke(); }
    if (o.hat) { rc.path('M -132 -110 C -132 -290, 132 -290, 132 -110 Z', O(key + 'hat', { fill: o.hat === true ? '#3a3632' : o.hat })); rc.line(-196, -110, 196, -110, O(key + 'hatb', { strokeWidth: 16 })); }
    ctx.restore();
  };
  D.sweat = (x, y, t, k = 1.9) => {
    for (let i = 0; i < 2; i++) {
      const ph = ((t * 1.1 + i * 0.5) % 1);
      ctx.save(); ctx.globalAlpha = 1 - ph; ctx.translate(x + i * 44, y + ph * 70 - i * 20); ctx.scale(k, k);
      ctx.fillStyle = '#7ec3ea'; ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      ctx.beginPath(); ctx.moveTo(0, -14); ctx.quadraticCurveTo(12, 6, 0, 10); ctx.quadraticCurveTo(-12, 6, 0, -14); ctx.fill(); ctx.stroke();
      ctx.restore();
    }
  };
  D.qcards = (x, y, t, k = 1) => {
    for (let i = 0; i < 3; i++) {
      const a = Math.sin(t * 3 + i * 1.7) * 0.12 + (i - 1) * 0.12;
      ctx.save(); ctx.translate(x + (i - 1) * 62 * k, y + Math.sin(t * 2.2 + i) * 6); ctx.rotate(a); ctx.scale(k, k);
      rc.rectangle(-26, -34, 52, 68, O('qc' + i, { fill: '#fbf7ee', strokeWidth: 4 }));
      D.text('?', 0, 2, 44);
      ctx.restore();
    }
  };

  // ---------- things ----------
  // The first Shinkansen (0 series), nose to the left at (x, y) on the rail; o.len, o.flip (nose to the right)
  D.train = (key, x, y, s, o = {}) => {
    const L = o.len || 1000;
    ctx.save(); ctx.translate(x, y); ctx.scale(s * (o.flip ? -1 : 1), s);
    for (let wx = 150; wx < L - 30; wx += (wx % 400 < 200 ? 80 : 240)) rc.circle(wx, -17, 36, O(key + 'wh' + wx, { fill: '#55595e', strokeWidth: 3.5, roughness: 0.4 }));
    rc.path(`M 6 -80 C 8 -132, 96 -180, 214 -184 L ${L} -184 L ${L} -34 L 70 -34 C 30 -36, 6 -54, 6 -80 Z`, O(key + 'body', { fill: '#fbfaf5' }));
    rc.path(`M 236 -146 L ${L} -146 L ${L} -104 L 180 -104 C 196 -122, 214 -138, 236 -146 Z`, O(key + 'band', { fill: '#2f5fa8', strokeWidth: 3.5 }));
    rc.path(`M 34 -60 L ${L} -60 L ${L} -34 L 70 -34 C 54 -36, 40 -46, 34 -60 Z`, O(key + 'skirt', { fill: '#2f5fa8', strokeWidth: 3.5 }));
    rc.circle(36, -86, 46, O(key + 'nose', { fill: '#e4e0d4', strokeWidth: 4 }));
    rc.ellipse(92, -118, 30, 20, O(key + 'light', { fill: '#f6d75a', strokeWidth: 3 }));
    rc.polygon([[150, -168], [220, -176], [220, -152], [124, -152]], O(key + 'cab', { fill: '#bfe0f0', strokeWidth: 3.5 }));
    for (let wx = 268; wx < L - 50; wx += 66) rc.rectangle(wx, -139, 42, 28, O(key + 'w' + wx, { fill: '#e3f3fb', strokeWidth: 2.5, roughness: 0.4 }));
    if (L > 500) { rc.line(520, -184, 560, -228, O(key + 'p1', { strokeWidth: 4 })); rc.line(600, -184, 560, -228, O(key + 'p2', { strokeWidth: 4 })); rc.line(530, -230, 590, -230, O(key + 'p3', { strokeWidth: 5 })); }
    ctx.restore();
  };
  D.rail = (key, y, x0 = -20, x1 = W + 20) => {
    for (let x = x0 + 20; x < x1; x += 54) rc.rectangle(x, y + 2, 26, 12, O(key + 's' + x, { fill: '#8a6a45', strokeWidth: 2.5, roughness: 0.5 }));
    rc.line(x0, y, x1, y, O(key + 'r', { strokeWidth: 6 }));
  };
  D.steam = (key, x, y, s, t) => {   // an old steam engine, chimney to the right
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.35 + i / 3) % 1; ctx.save(); ctx.globalAlpha = 0.75 * (1 - ph); rc.circle(250 + ph * 70, -260 - ph * 150, 40 + ph * 60, O(key + 'puff' + i, { fill: '#a9a59c', strokeWidth: 3 })); ctx.restore(); }
    rc.rectangle(-120, -190, 150, 160, O(key + 'cabin', { fill: '#3a3a3c' }));
    rc.rectangle(-92, -160, 70, 54, O(key + 'cw', { fill: '#cfe6f3', strokeWidth: 3.5 }));
    rc.rectangle(30, -150, 250, 120, O(key + 'boiler', { fill: '#2d2d30' }));
    rc.rectangle(226, -214, 40, 66, O(key + 'chim', { fill: '#2d2d30' }));
    rc.polygon([[280, -30], [330, -30], [280, -78]], O(key + 'cow', { fill: '#8c2f25', strokeWidth: 4 }));
    rc.ellipse(120, -160, 60, 30, O(key + 'dome', { fill: '#c9a13b', strokeWidth: 4 }));
    for (const wx of [-70, 40, 130, 220]) { rc.circle(wx, -26, wx < 0 ? 58 : 68, O(key + 'w' + wx, { fill: '#8c2f25', strokeWidth: 4.5 })); rc.circle(wx, -26, 14, O(key + 'wc' + wx, { fill: '#d9d4c8', strokeWidth: 3 })); }
    rc.line(40, -26, 220, -26, O(key + 'rod', { strokeWidth: 7, stroke: '#77797d' }));
    ctx.restore();
  };
  D.car = (key, x, y, s) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rc.path('M -150 -30 L -150 -70 C -150 -84, -120 -88, -96 -90 L -60 -132 C -52 -140, 44 -140, 58 -132 L 96 -90 C 130 -88, 150 -84, 150 -64 L 150 -30 Z', O(key + 'b', { fill: '#d5503b' }));
    rc.polygon([[-52, -124], [-6, -124], [-6, -92], [-78, -92]], O(key + 'w1', { fill: '#dff1fa', strokeWidth: 3.5 }));
    rc.polygon([[8, -124], [50, -124], [78, -92], [8, -92]], O(key + 'w2', { fill: '#dff1fa', strokeWidth: 3.5 }));
    rc.circle(-88, -28, 56, O(key + 'wh1', { fill: '#3b3b3d' })); rc.circle(88, -28, 56, O(key + 'wh2', { fill: '#3b3b3d' }));
    rc.circle(-88, -28, 18, O(key + 'h1', { fill: '#d9d4c8', strokeWidth: 3 })); rc.circle(88, -28, 18, O(key + 'h2', { fill: '#d9d4c8', strokeWidth: 3 }));
    ctx.restore();
  };
  D.plane = (key, x, y, s, rot = 0) => {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    rc.polygon([[-30, 0], [-90, 78], [-50, 78], [40, 0]], O(key + 'wing2', { fill: '#c9d3da', strokeWidth: 4 }));
    rc.path('M -190 -6 C -190 -30, -150 -34, -120 -34 L 130 -34 C 176 -32, 200 -14, 200 0 C 200 14, 176 28, 130 28 L -150 28 C -176 26, -190 14, -190 -6 Z', O(key + 'body', { fill: '#f6f6f2' }));
    rc.polygon([[-186, -20], [-222, -92], [-176, -92], [-126, -34]], O(key + 'tail', { fill: '#3d74c4', strokeWidth: 4 }));
    rc.polygon([[-20, 4], [-96, -78], [-56, -78], [50, 4]], O(key + 'wing', { fill: '#dfe6ea', strokeWidth: 4 }));
    for (let wx = -100; wx < 120; wx += 36) rc.circle(wx, -12, 14, O(key + 'w' + wx, { fill: '#bfe0f0', strokeWidth: 2.5 }));
    rc.polygon([[140, -26], [176, -20], [168, -6], [136, -6]], O(key + 'cab', { fill: '#bfe0f0', strokeWidth: 3 }));
    ctx.restore();
  };
  D.fuji = (key, x, y, s) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rc.path('M -260 0 C -150 -40, -90 -190, -50 -230 L 50 -230 C 90 -190, 150 -40, 260 0 Z', O(key + 'm', { fill: '#7c95b8' }));
    rc.path('M -50 -230 L 50 -230 C 64 -214, 76 -196, 88 -176 L 58 -196 L 30 -168 L 0 -198 L -30 -166 L -56 -196 L -88 -176 C -76 -196, -64 -214, -50 -230 Z', O(key + 'snow', { fill: '#fbfbf8', strokeWidth: 3.5 }));
    ctx.restore();
  };
  D.mappin = (key, x, y, s, color = '#d6453a') => {
    D.at(x, y, s, () => {
      rc.path('M 0 0 C -40 -54, -44 -74, -44 -92 C -44 -150, 44 -150, 44 -92 C 44 -74, 40 -54, 0 0 Z', O(key, { fill: color }));
      rc.circle(0, -94, 34, O(key + 'c', { fill: '#fbf7ee', strokeWidth: 3.5 }));
    });
  };
  // The Diet building: (x, y) the middle of its foot
  D.diet = (key, x, y, s) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rc.rectangle(-340, -150, 680, 150, O(key + 'wings', { fill: '#ddd6c6' }));
    for (let wx = -316; wx < 320; wx += 44) if (Math.abs(wx + 12) > 96) { rc.rectangle(wx, -128, 22, 40, O(key + 'wa' + wx, { fill: '#8fa3ad', strokeWidth: 2.5, roughness: 0.4 })); rc.rectangle(wx, -70, 22, 40, O(key + 'wb' + wx, { fill: '#8fa3ad', strokeWidth: 2.5, roughness: 0.4 })); }
    rc.rectangle(-96, -236, 192, 236, O(key + 'mid', { fill: '#e6e0d1' }));
    for (const cx of [-66, -22, 22, 66]) rc.line(cx, -150, cx, -8, O(key + 'col' + cx, { strokeWidth: 5 }));
    rc.line(-96, -150, 96, -150, O(key + 'beam', { strokeWidth: 4 }));
    rc.rectangle(-22, -70, 44, 70, O(key + 'door', { fill: '#6b5a44', strokeWidth: 3.5 }));
    rc.rectangle(-62, -320, 124, 84, O(key + 'tower', { fill: '#e6e0d1' }));
    for (const cx of [-32, 0, 32]) rc.rectangle(cx - 9, -304, 18, 50, O(key + 'tw' + cx, { fill: '#8fa3ad', strokeWidth: 2.5, roughness: 0.4 }));
    rc.rectangle(-74, -344, 148, 24, O(key + 'st1', { fill: '#d3ccbb', strokeWidth: 4 }));
    rc.rectangle(-56, -368, 112, 24, O(key + 'st2', { fill: '#d3ccbb', strokeWidth: 4 }));
    rc.rectangle(-38, -392, 76, 24, O(key + 'st3', { fill: '#d3ccbb', strokeWidth: 4 }));
    rc.polygon([[-22, -392], [22, -392], [0, -432]], O(key + 'top', { fill: '#d3ccbb', strokeWidth: 4 }));
    ctx.restore();
  };
  D.moneybag = (key, x, y, s, mark = '円') => {
    D.at(x, y, s, () => {
      rc.path('M -40 -150 C -70 -130, -120 -70, -110 -20 C -104 6, 104 6, 110 -20 C 120 -70, 70 -130, 40 -150 Z', O(key, { fill: '#c9a26a' }));
      rc.path('M -46 -150 L -62 -190 L 0 -176 L 62 -190 L 46 -150 Z', O(key + 'top', { fill: '#c9a26a' }));
      rc.line(-44, -150, 44, -150, O(key + 'tie', { strokeWidth: 8, stroke: '#7a4a25' }));
      D.text(mark, 0, -70, 78, { font: MARK, color: '#5b3a1a' });
    });
  };
  D.coins = (key, x, y, n, s = 1) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let i = 0; i < n; i++) rc.ellipse(0, -i * 16 - 10, 86, 26, O(key + i, { fill: '#f0c64a', strokeWidth: 3.5, roughness: 0.5 }));
    ctx.restore();
  };
  // A sheet of paper with lines and a title; (x, y) its middle
  D.sheet = (key, x, y, w, h, title, o = {}) => {
    ctx.save(); ctx.translate(x, y); if (o.rot) ctx.rotate(o.rot);
    ctx.fillStyle = 'rgba(60,45,20,0.22)'; ctx.fillRect(-w / 2 + 9, -h / 2 + 10, w, h);
    rc.rectangle(-w / 2, -h / 2, w, h, O(key, { fill: o.fill || '#fbf8ef' }));
    if (title) D.text(title, 0, -h / 2 + (o.titleSize || 46) * 0.95, o.titleSize || 46, { font: MARK });
    const top = -h / 2 + (title ? (o.titleSize || 46) * 1.9 : 40);
    for (let ly = top, i = 0; ly < h / 2 - 30; ly += 38, i++) rc.line(-w / 2 + 34, ly, w / 2 - 34 - (i % 3 === 2 ? w * 0.25 : 0), ly, O(key + 'l' + i, { strokeWidth: 3, stroke: '#9aa3ad' }));
    ctx.restore();
  };
  D.calendar = (key, x, y, s, text, small) => {
    D.at(x, y, s, () => {
      ctx.fillStyle = 'rgba(60,45,20,0.22)'; ctx.fillRect(-150, -130, 320, 310);
      rc.rectangle(-160, -150, 320, 310, O(key + 'pg', { fill: '#fbf7ee' }));
      rc.rectangle(-160, -150, 320, 78, O(key + 'hd', { fill: '#d6453a' }));
      rc.rectangle(-98, -176, 16, 46, O(key + 'r1', { fill: '#5b5b5b', strokeWidth: 3.5 }));
      rc.rectangle(82, -176, 16, 46, O(key + 'r2', { fill: '#5b5b5b', strokeWidth: 3.5 }));
      if (small) { D.text(small, 0, -110, 46, { font: MARK, color: '#fbf7ee' }); }
      D.text(text, 0, small ? 48 : 50, text.length > 4 ? 84 : 118, { font: MARK });
    });
  };
  D.pyramid = (key, x, y, s) => {
    D.at(x, y, s, () => {
      rc.circle(120, -200, 70, O(key + 'sun', { fill: '#f6c543', strokeWidth: 4 }));
      rc.polygon([[-170, 0], [0, -230], [170, 0]], O(key + 'p', { fill: '#e2b96b' }));
      rc.polygon([[0, -230], [170, 0], [60, 0]], O(key + 'sh', { fill: '#c99a4e', strokeWidth: 3.5 }));
      for (let i = 1; i < 5; i++) rc.line(-170 + i * 34, -i * 46, 60 - i * 12, -i * 46, O(key + 'b' + i, { strokeWidth: 2.5, stroke: '#8a6a35' }));
    });
  };
  D.wall = (key, x, y, s) => {
    D.at(x, y, s, () => {
      rc.path('M -190 0 C -120 -110, -60 -120, 0 -60 C 60 -10, 120 -120, 190 -150 L 190 0 Z', O(key + 'hill', { fill: '#9fbf7a' }));
      rc.path('M -190 -20 C -120 -134, -60 -144, 0 -84 C 60 -34, 120 -144, 190 -174 L 190 -140 C 120 -110, 60 0, 0 -50 C -60 -110, -120 -100, -190 14 Z', O(key + 'w', { fill: '#b7b0a2', strokeWidth: 4 }));
      for (const [tx, ty] of [[-96, -118], [96, -128]]) { rc.rectangle(tx - 28, ty - 62, 56, 70, O(key + 't' + tx, { fill: '#c7c0b2', strokeWidth: 4 })); for (const dx of [-22, -4, 14]) rc.rectangle(tx + dx, ty - 76, 12, 14, O(key + 'c' + tx + dx, { fill: '#c7c0b2', strokeWidth: 3 })); }
    });
  };
  D.battleship = (key, x, y, s, t = 0) => {
    D.at(x, y, s, () => {
      rc.polygon([[-200, -70], [200, -70], [164, -10], [-170, -10]], O(key + 'hull', { fill: '#6d737a' }));
      rc.rectangle(-40, -150, 70, 80, O(key + 'tw', { fill: '#868d94', strokeWidth: 4 }));
      rc.rectangle(-24, -200, 36, 50, O(key + 'tw2', { fill: '#868d94', strokeWidth: 4 }));
      rc.rectangle(44, -120, 34, 50, O(key + 'fun', { fill: '#4c5157', strokeWidth: 4 }));
      for (const [gx, dir] of [[-140, -1], [-88, -1], [118, 1]]) { rc.rectangle(gx - 22, -96, 44, 26, O(key + 'g' + gx, { fill: '#868d94', strokeWidth: 3.5 })); rc.line(gx + dir * 20, -86, gx + dir * 74, -100, O(key + 'gb' + gx, { strokeWidth: 6 })); }
      rc.line(-6, -200, -6, -246, O(key + 'mast', { strokeWidth: 4 }));
      rc.rectangle(-6, -246, 38, 24, O(key + 'flag', { fill: '#fbf7ee', strokeWidth: 3 })); rc.circle(13, -234, 12, O(key + 'hi', { fill: '#d6453a', strokeWidth: 0.1, stroke: '#d6453a' }));
      rc.path(`M -220 -6 C -180 ${-20 + Math.sin(t * 3) * 3}, -140 6, -100 -8 C -60 -20, -20 6, 20 -8 C 60 -20, 100 6, 140 -8 C 170 -18, 200 0, 220 -6 L 220 30 L -220 30 Z`, O(key + 'sea', { fill: '#6fa8d6', strokeWidth: 4 }));
    });
  };
  // A paper card that holds a drawing (the four "follies")
  D.card = (key, cx, cy, w, h, s, rot, fn) => {
    D.at(cx, cy, s, () => {
      ctx.fillStyle = 'rgba(60,45,20,0.24)'; ctx.fillRect(-w / 2 + 10, -h / 2 + 12, w, h);
      rc.rectangle(-w / 2, -h / 2, w, h, O(key, { fill: '#fbf8ef' }));
      fn();
    }, rot);
  };
  D.tv = (key, x, y, s, fn) => {   // an old television on legs; fn draws the screen at (0, 0), 300 × 210
    D.at(x, y, s, () => {
      rc.line(-110, 0, -140, 110, O(key + 'l1', { strokeWidth: 9, stroke: '#5a3d22' })); rc.line(110, 0, 140, 110, O(key + 'l2', { strokeWidth: 9, stroke: '#5a3d22' }));
      rc.line(-40, -300, -100, -400, O(key + 'a1', { strokeWidth: 4 })); rc.line(40, -300, 100, -400, O(key + 'a2', { strokeWidth: 4 }));
      rc.rectangle(-220, -300, 440, 300, O(key + 'box', { fill: '#9a6b3d' }));
      ctx.save(); ctx.translate(-40, -150);
      ctx.save(); ctx.beginPath(); ctx.roundRect(-150, -105, 300, 210, 34); ctx.clip(); ctx.fillStyle = '#dfe9e6'; ctx.fillRect(-150, -105, 300, 210); fn(); ctx.restore();
      rc.path('M -116 -105 L 116 -105 Q 150 -105 150 -71 L 150 71 Q 150 105 116 105 L -116 105 Q -150 105 -150 71 L -150 -71 Q -150 -105 -116 -105 Z', O(key + 'scr', { strokeWidth: 6 }));
      ctx.restore();
      rc.circle(160, -220, 44, O(key + 'k1', { fill: '#e8e0cc', strokeWidth: 4 })); rc.circle(160, -150, 44, O(key + 'k2', { fill: '#e8e0cc', strokeWidth: 4 }));
      for (let i = 0; i < 4; i++) rc.line(134, -90 + i * 16, 186, -90 + i * 16, O(key + 'sp' + i, { strokeWidth: 3 }));
    });
  };
  // The memorial on the platform: a brick wall with a bronze plate that bears a face; (x, y) the middle of its foot
  D.monument = (key, x, y, s, o = {}) => {
    D.at(x, y, s, () => {
      rc.rectangle(-170, -30, 340, 30, O(key + 'base', { fill: '#b9b3a6' }));
      rc.rectangle(-150, -420, 300, 390, O(key + 'wall', { fill: '#b5553c' }));
      for (let by = -420 + 39, i = 0; by < -32; by += 39, i++) {
        rc.line(-150, by, 150, by, O(key + 'bl' + i, { strokeWidth: 2.5, stroke: '#7c3323' }));
        for (let bx = -150 + (i % 2 ? 50 : 100); bx < 150; bx += 100) rc.line(bx, by - 39, bx, by, O(key + 'bv' + i + bx, { strokeWidth: 2.5, stroke: '#7c3323' }));
      }
      rc.rectangle(-112, -380, 224, 290, O(key + 'plate', { fill: '#8c7a4a', strokeWidth: 5 }));
      rc.circle(0, -276, 150, O(key + 'round', { fill: '#a8955c', strokeWidth: 4 }));
      rc.ellipse(0, -216, 96, 70, O(key + 'sh', { fill: '#77673c', strokeWidth: 3.5 }));
      rc.circle(0, -286, 84, O(key + 'face', { fill: '#c2ad6e', strokeWidth: 4 }));
      ctx.strokeStyle = '#4a3f22'; ctx.lineWidth = 3.5; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-15, -290, 13, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.arc(15, -290, 13, 0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-2, -290); ctx.lineTo(2, -290); ctx.stroke();
      ctx.fillStyle = '#4a3f22'; ctx.beginPath(); ctx.arc(-15 + (o.look || 0), -290, 3.6, 0, 7); ctx.arc(15 + (o.look || 0), -290, 3.6, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -276, 14, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke();
      if (o.words) D.text(o.words, 0, -130, 30, { font: MARK, color: '#3a3018' });
    });
  };
  // A station platform seen from the side: floor at y, a roof on posts; o.sign text, o.yellow (the tactile line)
  D.platform = (key, y, o = {}) => {
    const x0 = o.x0 == null ? -20 : o.x0, x1 = o.x1 == null ? W + 20 : o.x1;
    const top = y - (o.height || 520);
    rc.rectangle(x0, top - 34, x1 - x0, 34, O(key + 'roof', { fill: '#8b9aa5' }));
    for (let px = x0 + 150; px < x1 - 60; px += 390) rc.rectangle(px, top, 22, y - top, O(key + 'post' + px, { fill: '#a9b4bb', strokeWidth: 4 }));
    rc.rectangle(x0, y, x1 - x0, 70, O(key + 'floor', { fill: '#c9c3b6' }));
    if (o.yellow) rc.rectangle(x0, y + 4, x1 - x0, 14, O(key + 'yl', { fill: '#f2c230', strokeWidth: 2.5 }));
  };
  D.bulb = (key, x, y, s, glow) => {
    D.at(x, y, s, () => {
      if (glow > 0) { ctx.save(); ctx.strokeStyle = '#e8892b'; ctx.lineWidth = 7; ctx.lineCap = 'round'; for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + 0.2, r1 = 92 + glow * 6, r2 = 122 + glow * 16; if (i === 2) continue; ctx.beginPath(); ctx.moveTo(Math.cos(a) * r1, -10 + Math.sin(a) * r1); ctx.lineTo(Math.cos(a) * r2, -10 + Math.sin(a) * r2); ctx.stroke(); } ctx.restore(); }
      rc.circle(0, -14, 130, O(key + 'glass', { fill: '#f6c543' }));
      rc.rectangle(-30, 46, 60, 40, O(key + 'base', { fill: '#a9a9ad' }));
      rc.linearPath([[-16, -6], [0, -28], [4, -6], [18, -26]], O(key + 'fil', { strokeWidth: 4, stroke: '#c9772a' }));
    });
  };
  D.cross = (key, x, y, r, t, a, color = '#cf2e23') => {
    const p = prog(t, a, 0.14), q = prog(t, a + 0.1, 0.14);
    if (p > 0) rc.line(x - r, y - r, x - r + 2 * r * p, y - r + 2 * r * p, O(key + 'a', { stroke: color, strokeWidth: 16, roughness: 1.2 }));
    if (q > 0) rc.line(x + r, y - r, x + r - 2 * r * q, y - r + 2 * r * q, O(key + 'b', { stroke: color, strokeWidth: 16, roughness: 1.2 }));
  };
  D.cloud = (key, x, y, w) => rc.ellipse(x, y, w, w * 0.2, O(key, { fill: '#f8fbfd', strokeWidth: 3.5 }));
  D.burst = (key, x, y, r, n, color, width = 7) => { ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = width; ctx.lineCap = 'round'; for (let i = 0; i < n; i++) { const a = i * 2 * Math.PI / n + 0.3; ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); ctx.lineTo(x + Math.cos(a) * r * 1.45, y + Math.sin(a) * r * 1.45); ctx.stroke(); } ctx.restore(); };

  window.D = D;
})();
