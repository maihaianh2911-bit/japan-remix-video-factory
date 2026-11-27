#!/usr/bin/env node
// Đưa ảnh đã chọn từ thư mục kết quả "tìm ảnh" của repo vào public/images/ và ghi credits.md.
//
//   node scripts/use-picks.mjs <thư mục find> hook=12-1 title=7-2 sign1=15-1 sign2=10-5
//
// <thư mục find> là thư mục có index.json và các file <k>-<n>.jpg (nhánh renders, <story>/find/).
// Mỗi cặp <id cảnh>=<k>-<n> chép ảnh thành public/images/<id cảnh>.jpg.
// Tác giả: thêm dòng vào scripts/authors.json ({"<link ảnh gốc>": "Tên tác giả"}) sau khi mở trang ảnh để xem.
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const [findDir, ...pairs] = process.argv.slice(2);
if (!findDir || pairs.length === 0) {
  console.error('Cách dùng: node scripts/use-picks.mjs <thư mục find> hook=12-1 title=7-2 ...');
  process.exit(1);
}

const index = JSON.parse(readFileSync(join(findDir, 'index.json'), 'utf8'));
const byFile = new Map();
for (const group of index) {
  for (const r of group.results ?? group.pictures ?? []) byFile.set(r.file, { ...r, query: group.query });
}

const authorsPath = join(root, 'scripts', 'authors.json');
const authors = existsSync(authorsPath) ? JSON.parse(readFileSync(authorsPath, 'utf8')) : {};

// Trang gốc của ảnh Pexels suy từ số ảnh trong địa chỉ file (trang trong index.json có khi là trang tìm kiếm).
const sourcePage = (r) => {
  const m = /images\.pexels\.com\/photos\/(\d+)\//.exec(r.image ?? '');
  return m ? `https://www.pexels.com/photo/${m[1]}/` : r.page;
};

mkdirSync(join(root, 'public', 'images'), { recursive: true });
const rows = [];
for (const pair of pairs) {
  const [id, pick] = pair.split('=');
  const r = byFile.get(`${pick}.jpg`);
  if (!r) {
    console.error(`Không thấy ảnh ${pick} trong ${findDir}/index.json`);
    process.exit(1);
  }
  copyFileSync(join(findDir, r.file), join(root, 'public', 'images', `${id}.jpg`));
  const page = sourcePage(r);
  const author = authors[page] ?? '(chưa ghi — mở link gốc để xem)';
  const site = new URL(page).hostname.replace(/^www\./, '');
  rows.push(`| images/${id}.jpg | ${author} | ${site} | ${page} | ${r.width}×${r.height} |`);
  console.log(`${id}.jpg ← ${pick} (${r.width}×${r.height}) ${page}`);
}

// Giữ lại các dòng cũ của những cảnh không đổi lần này.
const creditsPath = join(root, 'credits.md');
const changed = new Set(pairs.map((p) => `images/${p.split('=')[0]}.jpg`));
const kept = existsSync(creditsPath)
  ? readFileSync(creditsPath, 'utf8')
      .split('\n')
      .filter((l) => /^\| images\//.test(l) && !changed.has(l.split('|')[1].trim()))
  : [];

const all = [...kept, ...rows].sort();
writeFileSync(
  creditsPath,
  [
    '# Nguồn ảnh',
    '',
    'Mỗi ảnh trong `public/images/`: tên file, tác giả, trang nguồn, link gốc.',
    'File này do `scripts/use-picks.mjs` ghi; tác giả lấy từ `scripts/authors.json`.',
    '',
    '| File | Tác giả | Nguồn | Link gốc | Cỡ ảnh |',
    '| --- | --- | --- | --- | --- |',
    ...all,
    '',
  ].join('\n'),
);
console.log(`Đã ghi credits.md (${all.length} ảnh).`);
