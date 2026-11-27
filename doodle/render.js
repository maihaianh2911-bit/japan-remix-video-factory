// The frames of a drawn video, from the page (page.html) in the pre-installed Chromium.
//   node doodle/render.js <story folder> stills [t1,t2,…]   a sheet of still frames (out/stills/sheet.jpg)
//   node doodle/render.js <story folder> video [seconds]     out/picture.mp4 (no sound; doodle/sound.py adds it);
//                                                            with seconds: only the start of the video, for a trial
// Needs <story>/out/timing.json (python -m doodle.voice <story>).
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// a little more colour and contrast than the flat drawing (the stills are graded the same way)
const COLOUR = 'eq=saturation=1.14:contrast=1.04:gamma=0.98';

(async () => {
  const story = path.resolve(process.argv[2]);
  const mode = process.argv[3] || 'stills';
  const out = path.join(story, 'out');
  const timing = JSON.parse(fs.readFileSync(path.join(out, 'timing.json'), 'utf8'));
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const problems = [];
  page.on('console', m => console.log('page:', m.text()));
  page.on('pageerror', e => { problems.push(e.message); console.log('page error:', e.message); });
  await page.goto('file://' + path.join(__dirname, 'page.html'));
  await page.addScriptTag({ path: path.join(story, 'scenes.js') });
  const total = await page.evaluate(t => window.setup(t), timing);
  const count = await page.evaluate(() => window.loadFonts());
  console.log(`${total.toFixed(1)} s, ${count} different characters`);
  if (problems.length) { await browser.close(); process.exit(1); }

  if (mode === 'stills') {
    const dir = path.join(out, 'stills'); fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
    let times = process.argv[4] ? process.argv[4].split(',').map(Number) : null;
    if (!times) {   // every scene a little after its start, in its middle and at its end
      const starts = await page.evaluate(() => window.STARTS);
      times = [];
      starts.forEach((s, i) => { const e = i + 1 < starts.length ? starts[i + 1] : total; times.push(s + Math.min(0.9, (e - s) * 0.3), s + (e - s) * 0.62, e - 0.12); });
    }
    const files = [];
    for (const [i, t] of times.entries()) {
      await page.evaluate(t => window.draw(t), t);
      const file = path.join(dir, `f${String(i).padStart(3, '0')}_${t.toFixed(2)}.jpg`);
      await page.screenshot({ path: file + '.png', type: 'png' });
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', file + '.png', '-vf', COLOUR, '-q:v', '3', file]); fs.rmSync(file + '.png');
      files.push(file);
    }
    const cols = 6, rows = Math.ceil(files.length / cols / 2);
    for (let part = 0; part * cols * 2 < files.length; part++) {
      const some = files.slice(part * cols * 2, (part + 1) * cols * 2);
      const list = path.join(dir, 'list.txt'); fs.writeFileSync(list, some.map(f => `file '${f}'\nduration 1\n`).join(''));
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', list, '-vf', `scale=360:-1,tile=${cols}x2`, '-frames:v', '1', path.join(dir, `sheet${part + 1}.jpg`)]);
    }
    console.log(`${files.length} stills in ${dir}`);
  } else {
    const until = process.argv[4] ? Math.min(total, Number(process.argv[4])) : total;   // a part only: … video 20
    const fps = 30, n = Math.round(until * fps);
    const ff = spawn('ffmpeg', ['-v', 'error', '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
      '-vf', COLOUR, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '17', '-preset', 'medium', '-movflags', '+faststart', path.join(out, 'picture.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      await page.evaluate(t => window.draw(t), i / fps);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log(`${n} frames`);
  }
  await browser.close();
  if (problems.length) process.exit(1);
})();
