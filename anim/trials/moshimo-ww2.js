/* The scenes of the trial "もし日本が第二次世界大戦に勝っていたら？" (20 seconds): what is drawn while each line is spoken.
   Every moment comes from the voice (timing.json): L.<line>.start, L.<line>.chunks[n].start. */
window.TRIAL = async (stage, { world }) => {
  const { h, px } = Anim, { tl } = stage, L = stage.lines, END = stage.timing.duration;
  const JAPAN = 392, KOREA = [408, 410], TAIWAN = 158, USA = 840;
  const RED = "#d8392b", GOLD = "#f2c95c", BLUE = "#2f5fa8", INK = "#1d2440";
  const at = (parent, cls, text, style) => h("div", { class: cls, html: text, style: px(style) }, parent);

  /* 1. the map: Japan in red, then Korea and Taiwan */
  const mapScene = stage.scene("map", 0, L.usa.start);
  const map = Parts.map(stage, mapScene, world);
  h("div", { class: "shade" }, mapScene);
  const chip1 = at(mapScene, "chip", "もしもの世界", {});
  const japan = map.light(JAPAN, RED), korea = map.light(KOREA, GOLD), taiwan = map.light(TAIWAN, GOLD);
  tl.set(map.cam, { lon: 132, lat: 37, k: 1.02, ax: 430, ay: 352 });
  tl.to(map.cam, { lon: 136.5, lat: 38, k: 1.45, ax: 400, ay: 360 }, 0, L.hook.end, "inOut");
  tl.to(map.cam, { lon: 129, lat: 33.2, k: 1.38, ax: 400, ay: 350 }, L.map.start - 0.1, 0.8, "inOut");
  tl.to(map.cam, { k: 1.46 }, L.map.start + 0.8, L.map.end - L.map.start, "linear");
  const nihon = map.pin(138.3, 36.3, "日本", { dx: 104, dy: 64 });
  stage.pop(nihon.tag, 0.75).pop(nihon.tip, 0.7);
  stage.out(nihon.el, L.map.start, 0.2);
  for (const [group, when] of [[korea, L.map.start + 0.15], [taiwan, L.map.start + 1.0]]) tl.set(group, { opacity: 0 }).to(group, { opacity: 1 }, when, 0.35, "out");
  const chosen = map.pin(127.3, 38.2, "朝鮮半島", { dx: -178, dy: -52, question: true });
  const tai = map.pin(121.0, 23.7, "台湾", { dx: 118, dy: -14, question: true });
  stage.pop(chosen.tip, L.map.start + 0.15).pop(chosen.tag, L.map.start + 0.2);
  stage.pop(tai.tip, L.map.start + 1.0).pop(tai.tag, L.map.start + 1.05);
  map.pulse(127.3, 38.2, L.map.start + 0.2, L.map.end + 0.3);
  map.pulse(121.0, 23.7, L.map.start + 1.05, L.map.end + 0.3);

  /* 2. Japan and America, at one scale, then the size of their economies */
  const usaScene = stage.scene("paper", L.usa.start, L.oil.start);
  at(usaScene, "chip", "1941年ごろ", {});
  const t2 = L.usa.start, t2b = L.usa.chunks[1].start;
  const jp = Parts.shape(usaScene, world, JAPAN, { scale: 560, fill: RED, keep: (lon, lat) => lat > 30.5 && lon < 146 });
  const us = Parts.shape(usaScene, world, USA, { scale: 560, fill: BLUE, keep: (lon, lat) => lon > -128 && lon < -60 && lat > 24 && lat < 50 });
  Object.assign(jp.el.style, px({ left: 440 - jp.width / 2, top: 196 - jp.height / 2 }));
  Object.assign(us.el.style, px({ left: 822 - us.width / 2, top: 196 - us.height / 2 }));
  const jpName = at(usaScene, "label", "日本", { left: 370, top: 312, width: 140 });
  const usName = at(usaScene, "label", "アメリカ", { left: 722, top: 312, width: 200 });
  const vs = at(usaScene, "vs", "VS", { left: 516, top: 142 });
  stage.pop(jp.el, t2 + 0.05).pop(jpName, t2 + 0.15).pop(vs, t2 + 0.4, { from: 2.2, ease: "out" }).pop(us.el, t2 + 0.6, { from: 0.3 }).pop(usName, t2 + 0.75);
  const barNote = at(usaScene, "note", "経済の規模（GDP）", { left: 494, top: 392, "font-size": 30 });
  stage.rise(barNote, t2b - 0.35, { by: 16, dur: 0.3 });
  const rows = [["日本", RED, 76, "1"], ["アメリカ", BLUE, 380, "約5倍"]].map(([name, color, width, value], i) => {
    const y = 446 + i * 84;
    stage.rise(at(usaScene, "bar-name", name, { left: 304, top: y + 4 }), t2b - 0.3 + i * 0.12, { by: 16, dur: 0.3 });
    const bar = at(usaScene, "bar", "", { left: 494, top: y, width, background: color });
    const label = at(usaScene, "bar-value", value, { left: 494 + width + 18, top: y - 6, color });
    return { bar, label, width };
  });
  tl.set(rows[0].bar, { sx: 0 }).to(rows[0].bar, { sx: 1 }, t2b - 0.25, 0.3, "out");
  stage.pop(rows[0].label, t2b);
  tl.set(rows[1].bar, { sx: 0 }).to(rows[1].bar, { sx: 1 }, t2b + 0.15, 0.85, "out");
  tl.fn(t2b + 0.15, 0.85, "out", p => {
    rows[1].label.style.left = 494 + rows[1].width * p + 18 + "px";
    rows[1].label.textContent = p >= 1 ? "約5倍" : (1 + 4 * p).toFixed(1) + "倍";
  });
  tl.set(rows[1].label, { opacity: 0 }).to(rows[1].label, { opacity: 1 }, t2b + 0.15, 0.1).to(rows[1].label, { scale: [1.5, 1] }, t2b + 1.0, 0.35, "back");

  /* 3. oil: nine drums of ten came from abroad */
  const oilScene = stage.scene("paper", L.oil.start, L.fuel.start);
  at(oilScene, "chip", "日本の石油", {});
  const t3 = L.oil.start, t3b = L.oil.chunks[1].start;
  const ring = Parts.ring(oilScene, { x: 500, y: 336, r: 138, width: 52, rest: "#5f6f8f" });
  const inRing = at(oilScene, "big", '<span style="font-size:34px;color:#1d2440">輸入</span><br><span style="font-size:60px;color:#d8392b;line-height:1.08">約9割</span>', { left: 350, top: 274, width: 300 });
  stage.pop(ring.el, t3 + 0.05, { from: 0.7 });
  tl.fn(t3b, 1.0, "inOut", p => ring.set(p));
  stage.pop(inRing, t3b + 0.75, { from: 1.6, ease: "out" });
  const drums = [...Array(10)].map((_, i) => Parts.drum(oilScene, { x: 700 + (i % 5) * 71, y: 206 + Math.floor(i / 5) * 122, size: 92, color: i < 9 ? RED : "#5f6f8f" }));
  drums.forEach((drum, i) => {
    stage.pop(drum.el, t3 + 0.1 + i * 0.04, { from: 0.4 });
    tl.fn(t3b + 0.1 * i, 0.18, "out", p => drum.paint(p));
    if (i < 9) tl.to(drum.el, { y: [0, -14] }, t3b + 0.1 * i, 0.09, "out").to(drum.el, { y: 0 }, t3b + 0.1 * i + 0.09, 0.16, "in");
  });
  const legend = at(oilScene, "note", '<b style="color:#d8392b">■</b> 輸入　<b style="color:#5f6f8f">■</b> 国産', { left: 770, top: 462, "font-size": 30 });
  stage.rise(legend, t3b + 0.9, { by: 14 });

  /* 4. without oil nothing moves */
  const fuelScene = stage.scene("paper", L.fuel.start, L.ask.start);
  at(fuelScene, "chip", "石油がなければ", {});
  const t4 = L.fuel.start, t4b = L.fuel.chunks[1].start;
  const ship = Parts.battleship(fuelScene, { x: 356, y: 92, width: 450 });
  const plane = Parts.fighter(fuelScene, { x: 400, y: 352, width: 390 });
  const gauges = [Parts.gauge(fuelScene, { x: 852, y: 138, size: 184 }), Parts.gauge(fuelScene, { x: 852, y: 398, size: 184 })];
  const names = [at(fuelScene, "label", "戦艦", { left: 874, top: 252, width: 140 }), at(fuelScene, "label", "戦闘機", { left: 874, top: 512, width: 140 })];
  tl.set(ship.el, { opacity: 0, x: -90 }).to(ship.el, { opacity: 1 }, t4, 0.15, "linear").to(ship.el, { x: 0 }, t4, 0.5, "out");
  tl.set(plane.el, { opacity: 0, x: 120, y: -30 }).to(plane.el, { opacity: 1 }, t4 + 0.45, 0.15, "linear").to(plane.el, { x: 0, y: 0 }, t4 + 0.45, 0.5, "out");
  gauges.forEach((gauge, i) => {
    stage.pop(gauge.el, t4 + 0.3 + i * 0.4).pop(names[i], t4 + 0.36 + i * 0.4);
    tl.fn(t4b + i * 0.12, 0.75, "inOut", p => gauge.set(1 - p));
  });
  const stopped = t4b + 0.8;
  tl.hook(t => {
    const run = Math.min(t, stopped) - t4;              // the propeller turns, the ship rides the swell, until the oil is gone
    const slow = Anim.clamp((stopped - t) / 0.6);
    plane.spin(run * 9 + (1 - slow) * 0.0);
    plane.body.setAttribute("transform", `translate(0, ${Math.sin(run * 5) * 5 * slow})`);
    ship.body.setAttribute("transform", `translate(0, ${Math.sin(run * 3.2) * 3 * slow}) rotate(${Math.sin(run * 3.2 + 1) * 0.7 * slow} 190 120)`);
    const grey = Anim.clamp((t - (t4b + 0.35)) / 0.5);
    ship.el.style.filter = plane.el.style.filter = `grayscale(${grey}) brightness(${1 - 0.18 * grey})`;
  });
  const stamp = at(fuelScene, "stamp", "動けない", { left: 470, top: 268, "font-size": 66 });
  tl.set(stamp, { opacity: 0, scale: 2.4, rot: -9 }).to(stamp, { opacity: 1 }, stopped, 0.08, "linear").to(stamp, { scale: 1 }, stopped, 0.22, "in");

  /* 5. the question */
  const askScene = stage.scene("night", L.ask.start, null);
  const marks = [[205, 330, 270, -14], [880, 320, 250, 12], [110, 130, 120, 10], [975, 120, 110, -8]].map(([x, y, size, rot], i) => {
    const mark = at(askScene, "mark", "？", { left: x - size / 2, top: y - size / 2, "font-size": size, "line-height": 1, opacity: i < 2 ? 1 : 0.55 });
    tl.set(mark, { opacity: 0, scale: 0.2, rot: rot * 3 });
    tl.to(mark, { opacity: 1 }, L.ask.start + 0.25 + i * 0.16, 0.12, "linear").to(mark, { scale: 1, rot }, L.ask.start + 0.25 + i * 0.16, 0.45, "back");
    tl.to(mark, { y: [0, -16] }, L.ask.start + 0.8 + i * 0.16, END - L.ask.start, "linear");
    return mark;
  });

  /* the mascot: a pose for each line */
  const samurai = new Anim.Mascot(stage, ["tachi", "yubi", "shoukai", "odoroki", "udegumi", "good"]);
  samurai.stand({ pose: "tachi", x: 905, h: 610, sink: 26 }).pose(0.3, "yubi");
  samurai.pose(L.map.start + 0.1, "shoukai", { flip: true, x: 915 });
  samurai.move(L.usa.start, { pose: "tachi", x: 158, h: 570, sink: 20, flip: false });
  samurai.pose(t2b + 0.75, "odoroki", { h: 540, x: 152 });
  samurai.pose(L.oil.start + 0.05, "yubi", { h: 570, x: 160 });
  samurai.pose(L.fuel.start + 0.05, "shoukai", { h: 570, x: 160 });
  samurai.pose(stopped + 0.05, "odoroki", { h: 540, x: 152 });
  samurai.move(L.ask.start, { pose: "udegumi", x: 540, h: 650, sink: 18 });
};
