import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SLIDES_DIR = path.join(PROJECT_ROOT, "slides");
const DIST_DIR = path.join(PROJECT_ROOT, "dist");

const BASE_PATH = "/mobile-app-jti/";

// Bersihkan output sebelumnya
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true, force: true });
}

fs.mkdirSync(DIST_DIR, { recursive: true });

// Cari file slide
const files = fs
  .readdirSync(SLIDES_DIR)
  .filter((file) => file.endsWith(".slides.md"));

if (files.length === 0) {
  console.log("Tidak ada file .slides.md di folder slides/");
  process.exit(0);
}

console.log(`Ditemukan ${files.length} slide:\n`);

for (const file of files) {
  const input = path.join(SLIDES_DIR, file);

  // Contoh:
  // 7-responsive-ui-scrollable-widget-v2.slides.md
  //
  // menjadi:
  // 7-responsive-ui-scrollable-widget-v2
  const slug = file.replace(/\.slides\.md$/, "");

  const output = path.join(DIST_DIR, slug);
  const base = `${BASE_PATH}${slug}/`;

  console.log(`Building: ${file}`);
  console.log(`Output : ${output}`);
  console.log(`Base   : ${base}`);

  execFileSync(
    path.join(PROJECT_ROOT, "node_modules", ".bin", "slidev"),
    ["build", input, "--out", output, "--base", base],
    {
      cwd: PROJECT_ROOT,
      stdio: "inherit",
    },
  );

  console.log(`✓ ${slug} selesai\n`);
}

console.log("Semua slide berhasil di-build.");
