import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
await Promise.all([
  sharp("assets/source/Logo Design.png")
    .resize({ width: 192 })
    .webp({ quality: 90 })
    .toFile("public/images/brington-emblem.webp"),
  sharp("assets/source/Logo Design.png")
    .resize(64, 64, { fit: "contain", background: "#ffffff" })
    .png()
    .toFile("public/favicon.png"),
  sharp("assets/source/Logo Design.png")
    .resize(180, 180, { fit: "contain", background: "#ffffff" })
    .png()
    .toFile("public/apple-touch-icon.png"),
  ...[800, 1600].map((width) =>
    sharp("assets/source/construction-site.jpg")
      .resize({ width })
      .webp({ quality: 78 })
      .toFile(`public/images/site-team-${width}.webp`),
  ),
  sharp("assets/source/construction-detail.jpg")
    .resize(800, 960, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile("public/images/construction-detail.webp"),
]);
console.log("Optimised branding and responsive photography.");
