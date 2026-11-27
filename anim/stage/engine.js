/* The stage of an animated video: a timeline that can show any moment (seek), the title, the captions, the mascot.
   Nothing here runs on the clock: seek(t) sets the whole picture for the second t, so every frame is the same on
   every machine and the video follows the voice exactly. */
(() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const EASE = {
    linear: p => p,
    in: p => p * p * p,
    out: p => 1 - Math.pow(1 - p, 3),
    inOut: p => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: p => 1 + 2.70158 * Math.pow(p - 1, 3) + 1.70158 * Math.pow(p - 1, 2),      // overshoots, then settles
    bounce: p => 1 + 3.2 * Math.pow(p - 1, 3) + 2.2 * Math.pow(p - 1, 2),
  };
  const DEFAULTS = { scale: 1, sx: 1, sy: 1, opacity: 1 };
  const MOVES = ["x", "y", "scale", "sx", "sy", "rot"];

  class Timeline {
    constructor() { this.items = new Map(); this.fns = []; this.hooks = []; this.sorted = false; }
    track(target, prop) {
      let props = this.items.get(target);
      if (!props) this.items.set(target, (props = {}));
      return props[prop] || (props[prop] = { init: DEFAULTS[prop] ?? 0, tweens: [] });
    }
    /* the value of each property before any change */
    set(target, values) { for (const [k, v] of Object.entries(values)) this.track(target, k).init = v; return this; }
    /* values: {x: 10} (from where it is) or {x: [0, 10]}; a DOM element takes x, y, scale, sx, sy, rot, opacity;
       any other object simply gets its fields set */
    to(target, values, start, dur = 0.4, ease = "out") {
      for (const [k, v] of Object.entries(values)) {
        const [from, to] = Array.isArray(v) ? v : [null, v];
        this.track(target, k).tweens.push({ start, dur, from, to, ease: EASE[ease] });
      }
      this.sorted = false;
      return this;
    }
    /* f(progress 0..1, t) on every seek */
    fn(start, dur, ease, f) { this.fns.push({ start, dur, ease: EASE[ease] || EASE.linear, f }); return this; }
    hook(f) { this.hooks.push(f); return this; }
    seek(t) {
      if (!this.sorted) {
        for (const props of this.items.values()) for (const track of Object.values(props)) track.tweens.sort((a, b) => a.start - b.start);
        this.sorted = true;
      }
      for (const [target, props] of this.items) {
        const now = {};
        for (const [name, track] of Object.entries(props)) {
          let value = track.init;
          for (const tw of track.tweens) {
            if (t < tw.start) break;
            const from = tw.from ?? value;
            value = from + (tw.to - from) * tw.ease(tw.dur > 0 ? clamp((t - tw.start) / tw.dur) : 1);
          }
          now[name] = value;
        }
        if (target instanceof Element) {
          if (MOVES.some(k => k in now)) {
            const { x = 0, y = 0, scale = 1, sx = 1, sy = 1, rot = 0 } = now;
            target.style.transform = `translate(${x}px, ${y}px) rotate(${rot}deg) scale(${scale * sx}, ${scale * sy})`;
          }
          if ("opacity" in now) { target.style.opacity = now.opacity; target.style.visibility = now.opacity <= 0.001 ? "hidden" : "visible"; }
        } else Object.assign(target, now);
      }
      for (const item of this.fns) item.f(item.ease(item.dur > 0 ? clamp((t - item.start) / item.dur) : t >= item.start ? 1 : 0), t);
      for (const f of this.hooks) f(t);
    }
  }

  const NS = "http://www.w3.org/2000/svg";
  function make(ns, tag, attrs, parent) {
    const el = ns ? document.createElementNS(ns, tag) : document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "html") el.innerHTML = v;
      else if (k === "text") el.textContent = v;
      else if (k === "style" && typeof v === "object") Object.assign(el.style, v);
      else el.setAttribute(k, v);
    }
    if (parent) parent.appendChild(el);
    return el;
  }
  const h = (tag, attrs, parent) => make(null, tag, attrs, parent);
  const svg = (tag, attrs, parent) => make(NS, tag, attrs, parent);
  const px = values => Object.fromEntries(Object.entries(values).map(([k, v]) => [k, typeof v === "number" ? v + "px" : v]));
  /* "[金]の文字\n二行目" -> gold words and a row break; "[o|…]" orange, "[g|…]" green, "[b|…]" blue */
  const rich = text => text.replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/\[(?:([a-z])\|)?([^\]]*)\]/g, (_, color, words) => `<span class="gold${color ? " k-" + color : ""}">${words}</span>`)
    .replace(/\n/g, "<br>");

  class Stage {
    constructor(timing) {
      this.timing = timing;
      this.tl = new Timeline();
      this.panel = document.getElementById("panel");
      this.lines = Object.fromEntries(timing.lines.map(line => [line.id, line]));
      const tag = document.getElementById("tag"), title = document.getElementById("title");
      if (tag) tag.textContent = timing.tag || "";
      if (title) title.innerHTML = (timing.title || []).map(rich).join("<br>");
      this.captions();
      if (document.getElementById("headline")) this.headlines();
    }
    /* every caption comes in with its first sound and stays until the next one */
    captions() {
      const box = document.getElementById("captions"), tl = this.tl;
      const chunks = this.timing.lines.flatMap(line => line.chunks);
      chunks.forEach((chunk, i) => {
        const el = h("div", { class: "cap", html: "<div>" + rich(chunk.text.replace(/。$/, "")) + "</div>" }, box);
        const end = i + 1 < chunks.length ? chunks[i + 1].start : this.timing.duration + 1;
        tl.set(el, { opacity: 0, y: 18, scale: 0.94 });
        tl.to(el, { opacity: 1 }, chunk.start, 0.1, "linear").to(el, { y: 0, scale: 1 }, chunk.start, 0.22, "back");
        tl.to(el, { opacity: 0 }, end, 0);
      });
    }
    /* layout "map": the large words at the top. Each one is written in from the left with the first sound of its
       chunk and stays until the next one */
    headlines() {
      const box = document.getElementById("headline"), tl = this.tl;
      const heads = this.timing.lines.flatMap(line => line.chunks).filter(chunk => chunk.head);
      heads.forEach((chunk, i) => {
        const el = h("div", { class: "head", html: "<div>" + rich(chunk.head) + "</div>" }, box);
        const end = i + 1 < heads.length ? heads[i + 1].start : this.timing.duration + 1;
        if (i === 0) tl.set(el, { opacity: 1 });        // the first one is there from the first frame (the hook)
        else {
          tl.set(el, { opacity: 0, scale: 1.06 });
          tl.to(el, { opacity: 1 }, chunk.start, 0.08, "linear").to(el, { scale: 1 }, chunk.start, 0.3, "out");
          tl.fn(chunk.start, 0.32, "out", p => { el.style.clipPath = `inset(-20% ${(1 - p) * 100}% -20% -5%)`; });
        }
        tl.to(el, { opacity: 0 }, end - 0.1, 0.1, "linear");
      });
    }
    /* a layer of the panel; `from`..`to` is when it is shown (it fades in and out over `fade` seconds) */
    scene(kind, from, to, fade = 0.25) {
      const el = h("div", { class: "scene " + kind }, this.panel);
      this.panel.insertBefore(el, document.getElementById("mascot"));
      this.tl.set(el, { opacity: from <= 0 ? 1 : 0 });
      if (from > 0) this.tl.to(el, { opacity: 1 }, from - fade / 2, fade, "inOut");
      if (to != null) this.tl.to(el, { opacity: 0 }, to + fade / 2, 0);
      return el;
    }
    /* comes in with a little spring */
    pop(el, at, { dur = 0.34, from = 0.5, ease = "back" } = {}) {
      this.tl.set(el, { opacity: 0, scale: from });
      this.tl.to(el, { opacity: 1 }, at, Math.min(0.12, dur), "linear").to(el, { scale: 1 }, at, dur, ease);
      return this;
    }
    rise(el, at, { dur = 0.4, by = 40 } = {}) {
      this.tl.set(el, { opacity: 0, y: by });
      this.tl.to(el, { opacity: 1 }, at, dur * 0.6, "linear").to(el, { y: 0 }, at, dur, "out");
      return this;
    }
    out(el, at, dur = 0.2) { this.tl.to(el, { opacity: 0 }, at, dur, "linear"); return this; }
    /* wait for the typefaces and the pictures: a frame is never taken with a fallback font or a missing pose */
    async settle() {
      const text = document.getElementById("frame").textContent + "0123456789";
      await Promise.all(['900 40px "Gothic"', '700 40px "Gothic"', '800 40px "Mincho"'].map(font => document.fonts.load(font, text)));
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.decode().catch(() => { throw new Error("picture not loaded: " + img.src); })));
    }
  }

  /* The mascot: one picture for each pose, cut off its green screen. It stands on the foot of the panel, breathes
     a little, hops when it changes its pose, and leaves and comes back from below when it changes its place. */
  class Mascot {
    constructor(stage, poses, { prefix = "/char/samurai-", ext = ".webp" } = {}) {
      this.stage = stage;
      this.root = document.getElementById("mascot");
      this.body = h("div", { class: "body" }, this.root);
      this.imgs = Object.fromEntries(poses.map(pose => [pose, h("img", { src: prefix + pose + ext, alt: pose }, this.body)]));
      this.steps = [];                       // {t, pose, x, h, sink, flip}
      this.state = { drop: 1, squash: 0 };   // drop: 1 = under the panel, 0 = standing; squash: the hop
      stage.tl.set(this.state, { drop: 1, squash: 0 });
      stage.tl.hook(t => this.draw(t));
    }
    /* x: the middle of the mascot in the panel; h: its height; sink: how much of its feet is under the panel's foot */
    /* there from the first frame, standing */
    stand(place) { this.steps.push({ t: -1, ...place }); this.stage.tl.set(this.state, { drop: 0 }); return this; }
    enter(t, place) { this.steps.push({ t, ...place }); this.stage.tl.to(this.state, { drop: [1, 0] }, t, 0.42, "back"); return this; }
    pose(t, pose, more = {}) {
      this.steps.push({ t: t + 0.07, pose, ...more });
      this.stage.tl.to(this.state, { squash: [0, 1] }, t, 0.07, "in").to(this.state, { squash: [1, 0] }, t + 0.07, 0.3, "bounce");
      return this;
    }
    leave(t) { this.stage.tl.to(this.state, { drop: [0, 1] }, t, 0.2, "in"); return this; }
    move(t, place) { return this.leave(t - 0.2).enter(t + 0.02, place); }
    draw(t) {
      const now = {};
      for (const step of this.steps) if (step.t <= t) Object.assign(now, step);
      const { pose, x = 540, h: height = 600, sink = 0, flip = false } = now;
      for (const [name, img] of Object.entries(this.imgs)) {
        img.style.visibility = name === pose ? "visible" : "hidden";
        img.style.height = height + "px";
        img.style.left = -(img.naturalWidth * height / img.naturalHeight) / 2 + "px";
      }
      const breath = 1 + 0.012 * Math.sin((t * 2 * Math.PI) / 1.7), sway = 0.7 * Math.sin((t * 2 * Math.PI) / 3.1);
      const sy = breath * (1 - 0.1 * this.state.squash), sx = (flip ? -1 : 1) * (1 + 0.07 * this.state.squash);
      const y = 690 + sink + this.state.drop * (height + 60);
      this.body.style.transform = `translate(${x}px, ${y}px) rotate(${sway}deg) scale(${sx}, ${sy})`;
    }
  }

  window.Anim = { Timeline, Stage, Mascot, h, svg, px, rich, clamp, EASE };
})();
