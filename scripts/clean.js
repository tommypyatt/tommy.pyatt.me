import path from "path";
import { fileURLToPath } from "url";
import { cleanDir } from "./utils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const OUTPUT_DIR = path.join(ROOT_DIR, "docs");

async function clean() {
  console.log("Cleaning output directory...");
  await cleanDir(OUTPUT_DIR);
  console.log("Done!");
}

clean().catch((err) => {
  console.error("Clean failed:", err);
  process.exit(1);
});
