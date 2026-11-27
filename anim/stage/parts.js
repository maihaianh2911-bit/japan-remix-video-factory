/* The parts a scene is built from: a map with a camera, country shapes at one scale, bars, a ring chart, oil drums,
   a battleship, a fighter, a fuel gauge. Each one only draws; the trial file says when each thing happens. */
(() => {
  const { h, svg, px } = Anim;
  const W = 1080, H = 690;

  /* A map of the region with a camera. cam = {lon, lat, k, ax, ay}: the point (lon, lat) is shown at (ax, ay) of the
     panel, k times larger. Tween cam on the timeline; pins follow. */
  function map(stage, parent, world, { center = [128, 35], scale = 900 } = {}) {
    const root = svg("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: "position:absolute;left:0;top:0" }, parent);
    const defs = svg("defs", {}, root);
    defs.innerHTML = `<radialGradient id="sea" cx="45%" cy="48%" r="75%"><stop offset="0" stop-color="#24337a"/><stop offset="1" stop-color="#141c47"/></radialGradient>
      <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>
      <filter id="lift" x="-10%" y="-10%" width="120%" height="120%"><feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#060a1e" flood-opacity=".55"/></filter>`;
    svg("rect", { width: W, height: H, fill: "url(#sea)" }, root);
    const projection = d3.geoMercator().center(center).scale(scale).translate([W / 2, H / 2]);
    const path = d3.geoPath(projection);
    const view = svg("g", {}, root);
    svg("path", { class: "grid", d: path(d3.geoGraticule().step([10, 10]).extent([[60, -20], [200, 75]])()) }, view);
    const lands = svg("g", { filter: "url(#lift)" }, view), lights = svg("g", {}, view);
    const features = topojson.feature(world, world.objects.countries).features.filter(feature => {
      const [lon, lat] = d3.geoCentroid(feature);
      return lon > 55 && lat > -15 && lat < 78;
    });
    const byId = new Map(features.map(feature => [String(Number(feature.id)), feature]));
    for (const feature of features) svg("path", { class: "land", d: path(feature) }, lands);
    const overlay = h("div", { style: "position:absolute;inset:0" }, parent);
    const rings = svg("svg", { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: "position:absolute;left:0;top:0" }, overlay);
    const cam = { lon: center[0], lat: center[1], k: 1, ax: W / 2, ay: H / 2 };
    const followers = [];
    const screen = (lon, lat) => {
      const [x, y] = projection([lon, lat]), [cx, cy] = projection([cam.lon, cam.lat]);
      return [(x - cx) * cam.k + cam.ax, (y - cy) * cam.k + cam.ay];
    };
    stage.tl.set(cam, { ...cam });
    stage.tl.hook(t => {
      const [cx, cy] = projection([cam.lon, cam.lat]);
      view.setAttribute("transform", `translate(${cam.ax},${cam.ay}) scale(${cam.k}) translate(${-cx},${-cy})`);
      for (const follow of followers) follow(t);
    });
    return {
      cam, screen,
      /* the country (ISO number: Japan 392, South Korea 410, North Korea 408, Taiwan 158) in a colour, with a glow under it */
      light(ids, color) {
        const group = svg("g", {}, lights);
        for (const id of [].concat(ids)) {
          const d = path(byId.get(String(id)));
          svg("path", { d, fill: color, filter: "url(#glow)", opacity: 0.75 }, group);
          svg("path", { class: "lit", d, fill: color }, group);
        }
        return group;
      },
      /* a name tag standing at a place; dx, dy: where the tag sits from its point */
      pin(lon, lat, name, { dx = 0, dy = -70, question = false } = {}) {
        const el = h("div", { class: "pin" }, overlay);
        const tip = h("div", { class: "tip" }, el);
        const holder = h("div", { style: "position:absolute;left:0;top:0" }, el);   // the tag springs out of its point
        const tag = h("div", { class: "name", html: name + (question ? '<span class="q">？</span>' : ""), style: px({ left: dx, top: dy }) }, holder);
        tag.style.transform = "translate(-50%, -50%)";
        followers.push(() => { const [x, y] = screen(lon, lat); el.style.transform = `translate(${x}px, ${y}px)`; });
        return { el, tip, tag: holder };
      },
      /* rings that spread from a place, again and again, between `from` and `to` */
      pulse(lon, lat, from, to, { size = 70, every = 0.9 } = {}) {
        const circles = [0, 1].map(() => svg("circle", { class: "ring", r: 0 }, rings));
        followers.push(t => {
          const [x, y] = screen(lon, lat);
          circles.forEach((circle, i) => {
            const phase = (((t - from) / every + i / 2) % 1 + 1) % 1, on = t >= from && t <= to;
            circle.setAttribute("cx", x); circle.setAttribute("cy", y);
            circle.setAttribute("r", 10 + phase * size);
            circle.setAttribute("opacity", on ? (1 - phase) * 0.9 : 0);
          });
        });
      },
    };
  }

  /* The outline of a country, drawn alone. Every shape made with the same `scale` is at the same scale on screen
     (an equal-area view centred on the country), so two countries can be compared by eye. keep(lon, lat): which
     pieces of the country to draw (the 48 states without Alaska, Japan without its far islands). */
  function shape(parent, world, id, { scale = 600, keep = () => true, fill = "#888" } = {}) {
    const feature = topojson.feature(world, world.objects.countries).features.find(f => Number(f.id) === id);
    const polygons = (feature.geometry.type === "Polygon" ? [feature.geometry.coordinates] : feature.geometry.coordinates)
      .filter(polygon => keep(...d3.geoCentroid({ type: "Polygon", coordinates: polygon })));
    const geometry = { type: "MultiPolygon", coordinates: polygons };
    const [lon, lat] = d3.geoCentroid(geometry);
    const path = d3.geoPath(d3.geoAzimuthalEqualArea().rotate([-lon, -lat]).scale(scale).translate([0, 0]));
    const [[x0, y0], [x1, y1]] = path.bounds(geometry);
    const width = x1 - x0, height = y1 - y0;
    const el = svg("svg", { viewBox: `${x0 - 4} ${y0 - 4} ${width + 8} ${height + 14}`, width: width + 8, height: height + 14, style: "position:absolute;overflow:visible" }, parent);
    svg("path", { d: path(geometry), fill: "rgba(0,0,0,.16)", transform: "translate(0,7)" }, el);
    svg("path", { d: path(geometry), fill, stroke: "rgba(0,0,0,.3)", "stroke-width": 1.2, "stroke-linejoin": "round" }, el);
    return { el, width: width + 8, height: height + 14 };
  }

  /* a ring chart: share (0..1) drawn clockwise from the top; returns set(p) */
  function ring(parent, { x, y, r = 130, width = 56, color = "#d8392b", rest = "#8d97ad", share = 0.9 }) {
    const size = (r + width) * 2, c = 2 * Math.PI * r;
    const el = svg("svg", { viewBox: `${-size / 2} ${-size / 2} ${size} ${size}`, width: size, height: size, style: `position:absolute;left:${x - size / 2}px;top:${y - size / 2}px` }, parent);
    svg("circle", { r, fill: "none", stroke: "rgba(0,0,0,.14)", "stroke-width": width, transform: "translate(0,7)" }, el);
    svg("circle", { r, fill: "none", stroke: rest, "stroke-width": width }, el);
    const arc = svg("circle", { r, fill: "none", stroke: color, "stroke-width": width, transform: "rotate(-90)", "stroke-dasharray": `0 ${c}` }, el);
    return { el, set: p => arc.setAttribute("stroke-dasharray", `${c * share * p} ${c}`) };
  }

  /* an oil drum; returns paint(p): 0 = empty grey, 1 = its colour */
  function drum(parent, { x, y, size = 92, color = "#d8392b" }) {
    const el = svg("svg", { viewBox: "0 0 60 80", width: size * 0.75, height: size, style: `position:absolute;left:${x}px;top:${y}px;overflow:visible` }, parent);
    svg("ellipse", { cx: 30, cy: 77, rx: 27, ry: 5, fill: "rgba(0,0,0,.18)" }, el);
    const body = svg("g", {}, el);
    body.innerHTML = `<rect x="4" y="8" width="52" height="66" rx="6" class="can"/><ellipse cx="30" cy="9" rx="26" ry="6.5" class="lid"/>
      <rect x="2" y="26" width="56" height="6" rx="3" class="rib"/><rect x="2" y="50" width="56" height="6" rx="3" class="rib"/>
      <rect x="11" y="13" width="7" height="58" rx="3.5" fill="#fff" opacity=".22"/><circle cx="40" cy="9" r="3" fill="rgba(0,0,0,.35)"/>`;
    const mix = (a, b, p) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * p)).join(",")})`;
    const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
    const grey = [176, 172, 158], full = rgb(color);
    const paint = p => {
      body.querySelector(".can").setAttribute("fill", mix(grey, full, p));
      body.querySelector(".lid").setAttribute("fill", mix([206, 202, 190], full.map(v => Math.min(255, v + 46)), p));
      body.querySelectorAll(".rib").forEach(rib => rib.setAttribute("fill", mix([150, 146, 132], full.map(v => v * 0.72), p)));
    };
    paint(0);
    return { el, paint };
  }

  /* a battleship seen from the side, bow to the right */
  function battleship(parent, { x, y, width = 380 }) {
    const el = svg("svg", { viewBox: "0 0 380 170", width, height: width * 170 / 380, style: `position:absolute;left:${x}px;top:${y}px;overflow:visible` }, parent);
    el.innerHTML = `
      <path d="M8 150 q16 -9 32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 t32 0 v14 h-352 z" fill="#3f76b8" opacity=".5"/>
      <g class="ship">
        <rect x="176" y="18" width="5" height="52" fill="#39445c"/><rect x="160" y="30" width="38" height="4" fill="#39445c"/>
        <rect x="106" y="40" width="4" height="46" fill="#39445c"/>
        <path d="M150 112 v-58 h14 v-14 h30 v14 h12 v58 z" fill="#56637f"/>
        <rect x="158" y="62" width="40" height="7" fill="#c9d3e4"/><rect x="156" y="80" width="46" height="6" fill="#39445c"/>
        <path d="M116 112 l4 -44 h22 l4 44 z" fill="#4a5672"/><rect x="118" y="62" width="26" height="8" rx="2" fill="#2b3449"/>
        <rect x="86" y="92" width="150" height="22" rx="3" fill="#63718f"/>
        <path d="M236 114 v-18 q0 -8 9 -8 h26 q9 0 11 8 l4 18 z" fill="#4a5672"/><rect x="262" y="93" width="64" height="6" rx="3" fill="#2b3449"/>
        <path d="M282 114 v-10 q0 -7 8 -7 h22 q8 0 10 7 l3 10 z" fill="#56637f"/><rect x="304" y="100" width="56" height="5" rx="2.5" fill="#2b3449"/>
        <path d="M40 114 l4 -16 q2 -8 11 -8 h24 q9 0 9 8 v16 z" fill="#4a5672"/><rect x="4" y="94" width="58" height="6" rx="3" fill="#2b3449"/>
        <path d="M6 112 h364 l-30 40 h-306 q-18 -10 -28 -40 z" fill="#39445c"/>
        <path d="M22 140 h326 l-9 12 h-305 q-7 -4 -12 -12 z" fill="#a93226"/>
        <rect x="14" y="118" width="346" height="4" fill="#c9d3e4" opacity=".55"/>
        <g fill="#c9d3e4" opacity=".7"><circle cx="70" cy="130" r="2.6"/><circle cx="110" cy="130" r="2.6"/><circle cx="150" cy="130" r="2.6"/><circle cx="190" cy="130" r="2.6"/><circle cx="230" cy="130" r="2.6"/><circle cx="270" cy="130" r="2.6"/><circle cx="310" cy="130" r="2.6"/></g>
      </g>`;
    return { el, body: el.querySelector(".ship") };
  }

  /* a fighter seen from the side, nose to the right; returns spin(turns) for its propeller */
  function fighter(parent, { x, y, width = 330 }) {
    const el = svg("svg", { viewBox: "0 0 330 150", width, height: width * 150 / 330, style: `position:absolute;left:${x}px;top:${y}px;overflow:visible` }, parent);
    el.innerHTML = `
      <ellipse cx="165" cy="142" rx="120" ry="6" fill="rgba(0,0,0,.14)"/>
      <g class="plane">
        <path d="M34 62 l-18 -44 h26 l34 38 z" fill="#8fa08a"/>
        <path d="M22 70 q110 -34 236 -18 q34 6 40 22 q-6 16 -40 20 q-150 12 -236 -12 q-10 -6 0 -12 z" fill="#b9c6b2"/>
        <path d="M22 76 q86 22 236 18 q34 -4 40 -20 q2 22 -40 30 q-150 12 -236 -16 q-6 -6 0 -12 z" fill="#93a48e"/>
        <path d="M252 50 q34 4 46 24 q-10 22 -46 24 z" fill="#2b3449"/>
        <path d="M150 50 q24 -30 62 -26 q22 4 34 24 z" fill="#9ed0ee" stroke="#4f5c66" stroke-width="4"/>
        <path d="M184 27 l4 22 M214 28 l8 20" stroke="#4f5c66" stroke-width="4" fill="none"/>
        <path d="M112 80 h120 q14 0 8 12 l-10 22 q-4 8 -16 8 h-74 q-12 0 -18 -10 l-14 -22 q-4 -10 4 -10 z" fill="#7d8f79"/>
        <circle cx="92" cy="74" r="15" fill="#d8392b" stroke="#fff" stroke-width="3.5"/>
        <path d="M20 74 h-14 M40 50 l-10 -14" stroke="#6f7f6b" stroke-width="5" stroke-linecap="round"/>
        <g class="prop"><ellipse cx="302" cy="74" rx="5" ry="52" fill="#2b3449"/></g>
        <circle cx="302" cy="74" r="9" fill="#e9c257"/>
      </g>`;
    const prop = el.querySelector(".prop ellipse");
    return { el, body: el.querySelector(".plane"), spin: turns => prop.setAttribute("ry", 6 + 46 * Math.abs(Math.cos(turns * Math.PI))) };
  }

  /* a fuel gauge; set(level): 1 = full (F), 0 = empty (E) */
  function gauge(parent, { x, y, size = 150 }) {
    const el = svg("svg", { viewBox: "-80 -74 160 96", width: size, height: size * 0.6, style: `position:absolute;left:${x}px;top:${y}px;overflow:visible` }, parent);
    el.innerHTML = `<path d="M-64 0 A64 64 0 0 1 64 0 z" fill="#fff" stroke="#1d2440" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-52 0 A52 52 0 0 1 -26 -45" fill="none" stroke="#d8392b" stroke-width="11"/>
      <path d="M-26 -45 A52 52 0 0 1 52 0" fill="none" stroke="#c8ccd6" stroke-width="11"/>
      <text x="-42" y="-8" font-size="22" font-weight="900" fill="#d8392b" text-anchor="middle" font-family="Gothic">E</text>
      <text x="42" y="-8" font-size="22" font-weight="900" fill="#1d2440" text-anchor="middle" font-family="Gothic">F</text>
      <g class="needle"><path d="M-5 0 L0 -56 L5 0 z" fill="#1d2440"/></g><circle r="9" fill="#1d2440"/>`;
    const needle = el.querySelector(".needle");
    const set = level => needle.setAttribute("transform", `rotate(${-70 + 140 * level})`);
    set(1);
    return { el, set };
  }

  window.Parts = { map, shape, ring, drum, battleship, fighter, gauge, W, H };
})();
