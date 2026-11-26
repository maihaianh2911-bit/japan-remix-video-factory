/* Draw an animated trial: the stage (anim/stage) is opened in Chromium, every frame is set by seek(t) and
   photographed, ffmpeg joins the frames with the voice.

     node anim/render.cjs <trial name> <out folder>                  -> <out>/video.mp4 (needs <out>/voice.wav, timing.json)
     node anim/render.cjs <trial name> <out folder> --stills 1,3.5   -> <out>/stills/<seconds>.png, no video
     ... --sheet 12      twelve moments spread over the video, as stills

   The page is the layout of the trial (timing.json "layout"): "panel" (stage/index.html: a fixed title, an animated
   panel, captions) or "map" (stage/map.html: a full-screen satellite map; needs <out>/map from anim/tiles.py and the
   boundary files the trial reads in <out>/geo).

   Needs: `npm install` in anim/ (map data, typefaces), playwright with its Chromium, ffmpeg. */
const fs = require("fs");
const http = require("http");
const path = require("path");
const { spawn } = require("child_process");
const { once } = require("events");
const { chromium } = require("playwright");

const HERE = __dirname, MODULES = path.join(HERE, "node_modules");
const LIB = {
  "d3-array.min.js": "d3-array/dist/d3-array.min.js",
  "d3-geo.min.js": "d3-geo/dist/d3-geo.min.js",
  "topojson-client.min.js": "topojson-client/dist/topojson-client.min.js",
  "countries-50m.json": "world-atlas/countries-50m.json",
  "noto-sans-jp-900.woff2": "@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-900-normal.woff2",
  "noto-sans-jp-700.woff2": "@fontsource/noto-sans-jp/files/noto-sans-jp-japanese-700-normal.woff2",
  "shippori-mincho-b1-800.woff2": "@fontsource/shippori-mincho-b1/files/shippori-mincho-b1-japanese-800-normal.woff2",
};
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".jpg": "image/jpeg" };

function serve(trial, out) {
  const server = http.createServer((request, response) => {
    const url = decodeURIComponent(request.url.split("?")[0]);
    let file;
    if (url.startsWith("/lib/")) file = LIB[url.slice(5)] && path.join(MODULES, LIB[url.slice(5)]);
    else if (url.startsWith("/char/")) file = path.join(HERE, "char", path.basename(url));
    else if (url.startsWith("/out/")) file = path.join(out, path.basename(url));
    else if (url.startsWith("/map/") || url.startsWith("/geo/")) file = path.join(out, url.slice(1, 4), path.basename(url));
    else if (url === "/trial.js") file = path.join(HERE, "trials", trial + ".js");
    else file = path.join(HERE, "stage", url === "/" ? "index.html" : path.basename(url));
    if (!file || !fs.existsSync(file)) { response.writeHead(404); response.end("not found: " + url); return; }
    response.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(response);
  });
  return new Promise(resolve => server.listen(0, "127.0.0.1", () => resolve(server)));
}

async function main() {
  const [trial, outArg, ...rest] = process.argv.slice(2);
  if (!trial || !outArg) throw new Error("usage: node anim/render.cjs <trial> <out folder> [--stills 1,2.5 | --sheet 12]");
  const out = path.resolve(outArg), fps = 30;
  const option = name => (rest.includes(name) ? rest[rest.indexOf(name) + 1] : null);
  const server = await serve(trial, out);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const problems = [];
  page.on("pageerror", error => problems.push(String(error)));
  page.on("console", message => { if (message.type() === "error") problems.push(message.text()); });
  page.on("requestfailed", request => problems.push("not loaded: " + request.url()));
  const layout = JSON.parse(fs.readFileSync(path.join(out, "timing.json"), "utf8")).layout || "panel";
  await page.goto(`http://127.0.0.1:${server.address().port}/${layout === "map" ? "map.html" : "index.html"}`);
  const duration = await page.evaluate(() => window.ready).catch(error => { problems.push(String(error)); return 0; });
  if (problems.length || !duration) { console.error(problems.join("\n")); process.exitCode = 1; await browser.close(); server.close(); return; }

  let times = option("--stills") ? option("--stills").split(",").map(Number) : null;
  if (option("--sheet")) { const n = Number(option("--sheet")); times = [...Array(n)].map((_, i) => Math.round((duration * (i + 0.5) / n) * 100) / 100); }
  if (times) {
    fs.mkdirSync(path.join(out, "stills"), { recursive: true });
    for (const t of times) {
      await page.evaluate(t => window.seek(t), t);
      await page.screenshot({ path: path.join(out, "stills", t.toFixed(2).padStart(6, "0") + ".png") });
    }
    console.log(`${times.length} stills in ${path.join(out, "stills")}`);
  } else {
    const frames = Math.ceil(duration * fps), video = path.join(out, "video.mp4");
    const ffmpeg = spawn("ffmpeg", ["-y", "-loglevel", "error", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "png", "-i", "-",
      "-i", path.join(out, "voice.wav"), "-filter:a", "loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000",
      "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p", "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
      "-c:v", "libx264", "-preset", "slow", "-crf", "23", "-maxrate", "7M", "-bufsize", "14M", "-r", String(fps), "-c:a", "aac", "-b:a", "192k",
      "-t", duration.toFixed(3), "-movflags", "+faststart", video], { stdio: ["pipe", "inherit", "inherit"] });
    const started = Date.now();
    for (let i = 0; i < frames; i++) {
      await page.evaluate(t => window.seek(t), i / fps);
      if (!ffmpeg.stdin.write(await page.screenshot({ type: "png" }))) await once(ffmpeg.stdin, "drain");
      if (i % 90 === 0) console.log(`frame ${i}/${frames}`);
    }
    ffmpeg.stdin.end();
    const [code] = await once(ffmpeg, "close");
    if (code) throw new Error("ffmpeg failed: " + code);
    console.log(`${video}: ${frames} frames, ${duration.toFixed(2)} s, drawn in ${((Date.now() - started) / 1000).toFixed(0)} s`);
  }
  if (problems.length) { console.error(problems.join("\n")); process.exitCode = 1; }
  await browser.close();
  server.close();
}

main().catch(error => { console.error(error); process.exit(1); });
