/* The full-screen map of the layout "map": the satellite picture of the land (from anim/tiles.py, several pictures
   from wide to near), a clean sea, a camera that flies (cam = {lon, lat, z, ax, ay}: the point (lon, lat) shown at
   (ax, ay) of the frame, at the Web Mercator zoom z), and over it regions in colour, borders, names, speech bubbles.
   The trial file says when each thing happens. */
(() => {
  const { h, svg, px } = Anim;
  const Z0 = 10, SCALE = (256 * 2 ** Z0) / (2 * Math.PI);   // the map is laid out in pixels of zoom 10

  async function satmap(stage, { tiles, world, japan }) {
    const tl = stage.tl;
    const widest = tiles.reduce((a, b) => (b.east - b.west > a.east - a.west ? b : a));
    const flat = d3.geoMercator().scale(SCALE).translate([0, 0]);
    const [ox, oy] = flat([widest.west, widest.north]);
    const projection = d3.geoMercator().scale(SCALE).translate([-ox, -oy]);     // (0, 0) = the corner of the widest picture
    const path = d3.geoPath(projection);

    /* the land of Japan as one shape (the prefectures joined), the other countries as they are */
    const homeland = topojson.merge(japan, Object.values(japan.objects)[0].geometries);
    const abroad = topojson.feature(world, world.objects.countries).features.filter(feature => {
      const [lon, lat] = d3.geoCentroid(feature);
      return Number(feature.id) !== 392 && lon > 60 && lat > 0 && lat < 80;
    });
    const under = document.getElementById("under"), over = document.getElementById("over");
    const underView = svg("g", {}, under), view = svg("g", {}, over);
    for (const feature of abroad) svg("path", { class: "foreign", d: path(feature) }, underView);
    svg("path", { class: "homeland", d: path(homeland) }, underView);
    const defs = svg("defs", {}, over);
    defs.innerHTML = `<filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="10"/></filter>`;
    const soft = defs.querySelector("feGaussianBlur");

    /* the satellite pictures, wide to near: the land only (the sea is the frame's own blue), with a pale glow
       along the coast, a little richer in colour */
    const worldBox = document.getElementById("world");
    for (const tile of [...tiles].sort((a, b) => a.zoom - b.zoom || (b.east - b.west) - (a.east - a.west))) {
      const image = new Image();
      image.src = "/map/" + tile.file;
      await image.decode();
      const [x0, y0] = projection([tile.west, tile.north]), [x1, y1] = projection([tile.east, tile.south]);
      const canvas = h("canvas", { width: image.naturalWidth, height: image.naturalHeight, style: px({ left: x0, top: y0, width: x1 - x0, height: y1 - y0 }) }, worldBox);
      const context = canvas.getContext("2d"), ratio = image.naturalWidth / (x1 - x0);
      context.setTransform(ratio, 0, 0, ratio, -x0 * ratio, -y0 * ratio);
      const draw = d3.geoPath(projection, context);
      context.beginPath(); draw(homeland);
      if (tile === widest) {     // the glow of the coast once, on the widest picture (twice would show the finer picture's edge)
        context.shadowColor = "rgba(120, 190, 255, .6)"; context.shadowBlur = 80 * ratio; context.fillStyle = "#24452f";
        context.fill();
        context.shadowColor = "transparent"; context.shadowBlur = 0;
      }
      context.clip();
      context.filter = "saturate(1.25) contrast(1.08) brightness(.9)";
      context.drawImage(image, x0, y0, x1 - x0, y1 - y0);
    }

    const cam = { lon: 137.5, lat: 36, z: 7, ax: 540, ay: 930 };
    const followers = [];
    let k = 1, cx = 0, cy = 0;
    const screen = (lon, lat) => { const [x, y] = projection([lon, lat]); return [(x - cx) * k + cam.ax, (y - cy) * k + cam.ay]; };
    tl.set(cam, { ...cam });
    tl.hook(t => {
      k = 2 ** (cam.z - Z0);
      [cx, cy] = projection([cam.lon, cam.lat]);
      const matrix = `translate(${cam.ax},${cam.ay}) scale(${k}) translate(${-cx},${-cy})`;
      view.setAttribute("transform", matrix); underView.setAttribute("transform", matrix);
      worldBox.style.transform = `translate(${cam.ax}px, ${cam.ay}px) scale(${k}) translate(${-cx}px, ${-cy}px)`;
      soft.setAttribute("stdDeviation", 12 / k);
      for (const follow of followers) follow(t);
    });
    const pins = document.getElementById("pins");
    const night = document.getElementById("night");
    tl.set(night, { opacity: 0 });

    return {
      cam, screen, projection, path, night,
      /* A raised region in colour. geometry: GeoJSON. Returns {el, lift, tint(color)}: lift.up (pixels) raises it
         over its shadow; tint(color) adds a layer of colour whose opacity the timeline moves. */
      region(geometry, { edge = true } = {}) {
        const el = svg("g", {}, view), d = path(geometry);
        const shadow = svg("path", { d, fill: "#020611", filter: "url(#soft)", opacity: 0.6 }, el);
        const body = svg("g", {}, el);
        const lift = { up: 0 };
        tl.set(lift, { up: 0 });
        followers.push(() => {
          body.setAttribute("transform", `translate(0, ${-lift.up / k})`);
          shadow.setAttribute("transform", `translate(${(lift.up * 0.7) / k}, ${(lift.up * 1.1) / k})`);
          shadow.setAttribute("opacity", Math.min(0.62, 0.05 * lift.up));
        });
        const tints = svg("g", {}, body);
        if (edge) svg("path", { class: "edge", d }, body);
        return { el, body, lift, tint: (color, opacity = 0.66) => svg("path", { d, fill: color, "fill-opacity": opacity }, tints) };
      },
      /* a line on the map (a border): returns {el, glow, draw(p)}: draw(0..1) draws it from one end */
      line(geometry) {
        const d = path(geometry);
        const glow = svg("path", { class: "border-glow", d, filter: "url(#soft)", pathLength: 1 }, view);
        const el = svg("path", { class: "border", d, pathLength: 1, "stroke-dasharray": "0 1" }, view);
        return { el, glow, draw: p => el.setAttribute("stroke-dasharray", `${p} 1`) };
      },
      /* a name at a place: the point, a line, the tag at (dx, dy) from the point */
      pin(lon, lat, name, { dx = 120, dy = -90, small = "" } = {}) {
        const el = h("div", { class: "pin" }, pins);
        const length = Math.hypot(dx, dy);
        const lead = h("div", { class: "lead", style: px({ width: length }) }, el);
        lead.style.transform = `rotate(${Math.atan2(dy, dx)}rad)`;
        h("div", { class: "tip" }, el);
        const holder = h("div", { style: `position:absolute;left:${dx}px;top:${dy}px` }, el);
        const tag = h("div", { class: "name", html: name + (small ? `<small>${small}</small>` : "") }, holder);
        tag.style.transform = "translate(-50%, -50%)";
        followers.push(() => { const [x, y] = screen(lon, lat); el.style.transform = `translate(${x}px, ${y}px)`; });
        return { el, tag: holder, lead };
      },
      /* words in a bubble (kind "bubble") or the seal of an old province (kind "seal") at a place */
      say(lon, lat, words, { color = "#333", kind = "bubble", dx = 0, dy = 0 } = {}) {
        const el = h("div", { class: kind, style: `--c:${color}` }, pins);
        const holder = h("div", { style: `position:absolute;left:${dx}px;top:${dy}px` }, el);
        h("div", { class: "say", html: words }, holder);
        followers.push(() => { const [x, y] = screen(lon, lat); el.style.transform = `translate(${x}px, ${y}px)`; });
        return { el, tag: holder };
      },
    };
  }

  window.Sat = { satmap };
})();
