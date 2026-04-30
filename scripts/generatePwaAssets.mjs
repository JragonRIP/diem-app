import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const iconsDir = path.join(root, "public", "icons");

const iconSvg = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" rx="${Math.round(size * 0.2)}" fill="#1A1A18"/>
  <rect x="${Math.round(size * 0.06)}" y="${Math.round(size * 0.06)}" width="${Math.round(size * 0.88)}" height="${Math.round(size * 0.88)}" rx="${Math.round(size * 0.16)}" fill="none" stroke="#C9A84C" stroke-width="${Math.max(3, Math.round(size * 0.016))}"/>
  <text x="50%" y="53%" text-anchor="middle" dominant-baseline="middle" fill="#C9A84C" font-size="${Math.round(size * 0.22)}" font-family="Georgia, 'Times New Roman', serif">Diem</text>
</svg>`;

const splashSvg = (w, h) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="#1A1A18"/>
  <text x="50%" y="49%" text-anchor="middle" dominant-baseline="middle" fill="#C9A84C" font-size="${Math.round(w * 0.14)}" font-family="Georgia, 'Times New Roman', serif">Diem</text>
  <line x1="${Math.round(w * 0.27)}" y1="${Math.round(h * 0.54)}" x2="${Math.round(w * 0.73)}" y2="${Math.round(h * 0.54)}" stroke="#C9A84C" stroke-width="${Math.max(2, Math.round(w * 0.003))}" opacity="0.85"/>
</svg>`;

await fs.mkdir(iconsDir, { recursive: true });

await sharp(Buffer.from(iconSvg(192))).png().toFile(path.join(iconsDir, "icon-192.png"));
await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(iconsDir, "icon-512.png"));
await sharp(Buffer.from(iconSvg(180))).png().toFile(path.join(iconsDir, "apple-touch-icon.png"));
await sharp(Buffer.from(splashSvg(1170, 2532))).png().toFile(path.join(iconsDir, "splash-1170x2532.png"));

console.log("Generated PNG PWA assets in public/icons.");
