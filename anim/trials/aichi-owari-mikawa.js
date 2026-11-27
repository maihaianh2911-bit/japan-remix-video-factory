/* The scenes of the trial "同じ愛知県なのに？" (21 seconds, layout "map"): one prefecture that was two provinces.
   Every moment comes from the voice (timing.json). Needs <out>/geo/aichi.json and prefectures.json
   (smartnews-smri/japan-topography, from 国土数値情報 行政区域) and <out>/map (anim/tiles.py). */
window.TRIAL = async (stage, { world, tiles, get }) => {
  const { tl } = stage, L = stage.lines, END = stage.timing.duration;
  const [aichi, japan] = await Promise.all([get("/geo/aichi.json"), get("/geo/prefectures.json")]);
  const map = await Sat.satmap(stage, { tiles, world, japan });
  document.getElementById("credit").textContent = "地図: 国土地理院・国土数値情報（行政区域）";
  const GOLD = "#e9b63a", ORANGE = "#f08a3c", GREEN = "#3fbf88";

  /* 三河: the eighteen towns east of the old border; 尾張: the rest of the prefecture */
  const MIKAWA = new Set(["岡崎市", "豊田市", "豊橋市", "豊川市", "碧南市", "刈谷市", "安城市", "西尾市", "蒲郡市", "新城市", "知立市",
    "高浜市", "田原市", "みよし市", "幸田町", "設楽町", "東栄町", "豊根村"]);
  const towns = Object.values(aichi.objects)[0];
  const east = town => MIKAWA.has(town.properties.N03_004);
  const whole = topojson.merge(aichi, towns.geometries);
  const owari = map.region(topojson.merge(aichi, towns.geometries.filter(town => !east(town))));
  const mikawa = map.region(topojson.merge(aichi, towns.geometries.filter(east)));
  const border = map.line(topojson.mesh(aichi, towns, (a, b) => a !== b && east(a) !== east(b)));
  const paint = { ow: { gold: owari.tint(GOLD), color: owari.tint(ORANGE) }, mi: { gold: mikawa.tint(GOLD), color: mikawa.tint(GREEN) } };
  const fade = (el, to, at, dur = 0.4) => tl.to(el, { opacity: to }, at, dur, "inOut");

  const t1 = L.hook.start, t1b = L.hook.chunks[1].start, t2 = L.two.start, t2b = L.two.chunks[1].start;
  const t3 = L.towns.start, t3b = L.towns.chunks[1].start, t4 = L.kuni.start, t4b = L.kuni.chunks[1].start;
  const t5 = L.merge.start, t5b = L.merge.chunks[1].start, t6 = L.now.start, t6b = L.now.chunks[1].start, t6c = L.now.chunks[2].start;

  /* the camera: all Japan, then down to the prefecture, then a slow push */
  tl.set(map.cam, { lon: 137.6, lat: 37.4, z: 6.35, ax: 540, ay: 960 });
  tl.to(map.cam, { lon: 137.27, lat: 34.99, z: 9.86, ay: 930 }, 0.5, t1b - 0.7, "inOut");
  tl.to(map.cam, { z: 9.98 }, t1b, t4 - t1b, "linear");
  tl.to(map.cam, { z: 9.8, lat: 35.0 }, t4, 0.9, "inOut");
  tl.to(map.cam, { z: 9.9 }, t5, END - t5, "linear");

  /* 1. one prefecture, in gold; two voices say "not us" */
  for (const side of [paint.ow, paint.mi]) { tl.set(side.gold, { opacity: 1 }); tl.set(side.color, { opacity: 0 }); }
  for (const part of [owari, mikawa]) tl.to(part.lift, { up: [0, 12] }, 0.2, 0.5, "out");
  const ken = map.pin(137.2, 35.0, "愛知県", { dx: 150, dy: 130 });
  stage.pop(ken.tag, 0.45); stage.out(ken.el, 1.7, 0.25);
  tl.set(ken.lead, { opacity: 0 }).to(ken.lead, { opacity: 1 }, 0.4, 0.15);
  const not1 = map.say(136.93, 35.27, "うちは別！", { color: ORANGE, dy: -10 });
  const not2 = map.say(137.52, 35.06, "うちは別！", { color: GREEN, dy: -10 });
  stage.pop(not1.tag, t1b + 0.15); stage.pop(not2.tag, t1b + 0.55);
  stage.out(not1.el, t2 - 0.15, 0.15); stage.out(not2.el, t2 - 0.15, 0.15);

  /* 2. the border is drawn; the west turns orange, the east green */
  tl.set(border.glow, { opacity: 0 });
  tl.fn(t2 - 0.1, 0.7, "inOut", p => border.draw(p));
  fade(paint.ow.color, 1, t2 + 0.1); fade(paint.mi.color, 1, t2b);
  const owName = map.pin(136.86, 35.17, "尾張", { dx: -30, dy: -170, small: "西" });
  const miName = map.pin(137.45, 35.02, "三河", { dx: 150, dy: -230, small: "東" });
  for (const [name, at] of [[owName, t2 + 0.2], [miName, t2b + 0.1]]) {
    stage.pop(name.tag, at); tl.set(name.lead, { opacity: 0 }).to(name.lead, { opacity: 1 }, at, 0.15);
    tl.set(name.el, { opacity: 0 }).to(name.el, { opacity: 1 }, at - 0.05, 0.05);
    stage.out(name.el, t3 - 0.2, 0.2);
  }

  /* 3. the towns of each */
  const places = [[136.9066, 35.1815, "名古屋", -135, 70, t3 + 0.45], [137.1744, 34.9543, "岡崎", 250, 110, t3b + 0.55], [137.1563, 35.0825, "豊田", 300, -70, t3b + 1.05]];
  for (const [lon, lat, name, dx, dy, at] of places) {
    const place = map.pin(lon, lat, name, { dx, dy });
    tl.set(place.el, { opacity: 0 }).to(place.el, { opacity: 1 }, at - 0.05, 0.05);
    stage.pop(place.tag, at); stage.out(place.el, t4 - 0.2, 0.2);
  }

  /* 4. night falls: two provinces, a border between them */
  fade(map.night, 0.55, t4, 0.6);
  const seals = [map.say(136.88, 35.2, "尾張国", { color: "#c8641c", kind: "seal" }), map.say(137.5, 35.02, "三河国", { color: "#1f8f62", kind: "seal" })];
  seals.forEach((seal, i) => { stage.pop(seal.tag, t4b + 0.1 + i * 0.3, { from: 1.8, ease: "out" }); stage.out(seal.el, t5 - 0.15, 0.2); });
  fade(border.glow, 1, t4b + 0.5, 0.4); fade(border.glow, 0, t5b, 0.5);

  /* 5. 1872: the two become one */
  for (const side of [paint.ow, paint.mi]) fade(side.color, 0, t5b + 0.1, 0.7);
  tl.fn(t5b + 0.1, 0.7, "inOut", p => border.draw(1 - p));
  for (const part of [owari, mikawa]) tl.to(part.lift, { up: 22 }, t5b + 0.1, 0.35, "out").to(part.lift, { up: 12 }, t5b + 0.45, 0.4, "inOut");
  const one = map.pin(137.2, 35.0, "愛知県", { dx: 0, dy: -300, small: "1872年" });
  tl.set(one.el, { opacity: 0 }).to(one.el, { opacity: 1 }, t5b + 0.55, 0.05);
  stage.pop(one.tag, t5b + 0.6); stage.out(one.el, t6b - 0.2, 0.2);

  /* 6. a hundred and fifty years on: still two */
  fade(map.night, 0, t6, 0.6);
  tl.fn(t6b - 0.15, 0.5, "inOut", p => border.draw(p));
  fade(paint.ow.color, 1, t6b); fade(paint.mi.color, 1, t6c);
  const still1 = map.say(136.93, 35.27, "尾張は尾張", { color: ORANGE });
  const still2 = map.say(137.52, 35.06, "三河は三河", { color: GREEN });
  stage.pop(still1.tag, t6b + 0.15); stage.pop(still2.tag, t6c + 0.15);
};
