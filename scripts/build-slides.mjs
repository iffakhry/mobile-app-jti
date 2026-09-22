import { readdir, rm, mkdir } from "node:fs/promises";
import { join, basename, extname } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

const slidesDir = "slides";
const distDir = "dist";
const basePath = "/mobile-app-jti/";

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

const files = (await readdir(slidesDir))
  .filter((file) => extname(file).toLowerCase() === ".md")
  .sort();

if (files.length === 0) {
  console.log("Tidak ada file Markdown di folder slides/");
  process.exit(0);
}

console.log(`Ditemukan ${files.length} file slide:`);

for (const file of files) {
  const input = join(slidesDir, file);

  let slug = basename(file, extname(file));

  // Hapus suffix .slides dari nama file
  if (slug.endsWith(".slides")) {
    slug = slug.slice(0, -".slides".length);
  }

  slug = slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const output = join(distDir, slug);

  console.log(`\nBuilding: ${file}`);
  console.log(`Output  : ${output}`);

  await mkdir(output, { recursive: true });

  await execFileAsync(
    "npx",
    [
      "slidev",
      "build",
      input,
      "--out",
      output,
      "--base",
      `${basePath}${slug}/`,
    ],
    {
      stdio: "inherit",
    },
  );
}

console.log("\nSemua slide berhasil dibuild.");
