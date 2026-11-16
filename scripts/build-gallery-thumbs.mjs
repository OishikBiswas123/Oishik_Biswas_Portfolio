/**
 * Generates optimized WebP thumbnails + tiny blur-up placeholders for every
 * photo in public/Gallery, and writes src/lib/gallery-media.json which
 * gallery-grid.tsx uses for instant-loading images.
 *
 * Run with: node scripts/build-gallery-thumbs.mjs
 */
import { readdirSync, mkdirSync, writeFileSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";
import sharp from "sharp";

const GALLERY = join(process.cwd(), "public", "Gallery");
const THUMBS = join(GALLERY, "thumbs");
mkdirSync(THUMBS, { recursive: true });

const files = readdirSync(GALLERY).filter(f => /\.(jpe?g|png)$/i.test(f) && statSync(join(GALLERY, f)).isFile());

const out = {};
for (const file of files) {
  const src = `/Gallery/${file}`;
  const input = join(GALLERY, file);
  const thumbName = `${basename(file)}.webp`;
  const thumbPath = join(THUMBS, thumbName);

  // Thumb: cap the long side at 900px, good quality WebP
  const meta = await sharp(input).metadata();
  await sharp(input)
    .rotate()
    .resize({ width: 900, height: 900, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(thumbPath);

  // Tiny blurred placeholder (~16px wide) as a data URL
  const blurBuf = await sharp(input)
    .rotate()
    .resize({ width: 16 })
    .webp({ quality: 30 })
    .toBuffer();
  const blur = `data:image/webp;base64,${blurBuf.toString("base64")}`;

  out[src] = {
    thumb: `/Gallery/thumbs/${thumbName}`,
    blur,
    w: meta.width,
    h: meta.height,
  };
  console.log("thumb:", file);
}

writeFileSync(join(process.cwd(), "src", "lib", "gallery-media.json"), JSON.stringify(out, null, 2));
console.log(`Wrote gallery-media.json with ${Object.keys(out).length} entries`);
