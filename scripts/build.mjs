import { copyFile, mkdir } from "node:fs/promises";
import { build } from "esbuild";

await mkdir("dist/web", { recursive: true });
await build({
  entryPoints: ["src/worker.ts"],
  outfile: "dist/worker.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2023",
});
await build({
  entryPoints: ["web/app.ts"],
  outfile: "dist/web/app.js",
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2023",
});
await copyFile("web/index.html", "dist/web/index.html");
await copyFile("web/styles.css", "dist/web/styles.css");
console.log("Portable Worker bundle and static UI built; nothing deployed.");
