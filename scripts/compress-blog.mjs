/**
 * One-off: compress the Daydreamer's Gravity blog images to web-friendly WebP.
 * Run with: node scripts/compress-blog.mjs
 */
import { statSync, unlinkSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";

const OUT = join(process.cwd(), "public", "blog", "daydreamers-gravity");
const DL = join(process.env.USERPROFILE, "Downloads");

const files = [
  { src: join(DL, "hgfyjtfkuy.jpg"), out: "doraemon-1.webp", width: 900 },
  { src: join(DL, "dyiyr.jpg"), out: "doraemon-2.webp", width: 900 },
  { src: join(DL, "cool-background-blank-wallpaper-place-your-concept.jpg"), out: "gargantua.webp", width: 1800 },
  { src: join(OUT, "m87-src.jpg"), out: "m87-blackhole.webp", width: 1400 },
];

for (const f of files) {
  const dest = join(OUT, f.out);
  await sharp(f.src).resize({ width: f.width, withoutEnlargement: true }).webp({ quality: 82 }).toFile(dest);
  console.log(`${f.out}: ${Math.round(statSync(dest).size / 1024)} KB`);
}
