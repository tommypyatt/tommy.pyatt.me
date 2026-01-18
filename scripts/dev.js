import { spawn } from "child_process";
import chokidar from "chokidar";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");

let buildProcess = null;
let buildPending = false;

function runBuild() {
  if (buildProcess) {
    buildPending = true;
    return;
  }

  console.log("\n--- Starting build ---\n");

  buildProcess = spawn("node", [path.join(__dirname, "build.js")], {
    cwd: ROOT_DIR,
    stdio: "inherit"
  });

  buildProcess.on("close", (code) => {
    buildProcess = null;

    if (code === 0) {
      console.log("\n--- Build complete ---");
    } else {
      console.log("\n--- Build failed ---");
    }

    if (buildPending) {
      buildPending = false;
      runBuild();
    }
  });
}

function startWatcher() {
  console.log("Starting development watcher...\n");
  console.log("Watching for changes in:");
  console.log("  - content/**/*.md");
  console.log("  - templates/**/*.js");
  console.log("  - src/**/*.css");
  console.log("  - site.config.js");
  console.log("\nPress Ctrl+C to stop.\n");

  // Run initial build
  runBuild();

  // Set up file watcher
  const watcher = chokidar.watch(
    [
      path.join(ROOT_DIR, "content", "**", "*.md"),
      path.join(ROOT_DIR, "templates", "**", "*.js"),
      path.join(ROOT_DIR, "src", "**", "*.css"),
      path.join(ROOT_DIR, "site.config.js")
    ],
    {
      ignored: /node_modules/,
      persistent: true,
      ignoreInitial: true
    }
  );

  watcher.on("change", (filePath) => {
    console.log(`\nFile changed: ${path.relative(ROOT_DIR, filePath)}`);
    runBuild();
  });

  watcher.on("add", (filePath) => {
    console.log(`\nFile added: ${path.relative(ROOT_DIR, filePath)}`);
    runBuild();
  });

  watcher.on("unlink", (filePath) => {
    console.log(`\nFile removed: ${path.relative(ROOT_DIR, filePath)}`);
    runBuild();
  });
}

startWatcher();
