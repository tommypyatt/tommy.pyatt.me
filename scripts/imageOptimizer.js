import fs from "fs/promises";
import path from "path";
import sharp from "sharp";
import { ensureDir } from "./utils.js";
import config from "../site.config.js";

const imageConfig = config.images || {
  sizes: [400, 800, 1200],
  quality: 80
};

const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];

// Track processed images for the markdown renderer
const processedImages = new Map();

export function getProcessedImages() {
  return processedImages;
}

export function clearProcessedImages() {
  processedImages.clear();
}

async function getImageFiles(dir) {
  const files = [];

  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        const subFiles = await getImageFiles(fullPath);
        files.push(...subFiles);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
  }

  return files;
}

async function processImage(srcPath, destDir, baseDir) {
  const relativePath = path.relative(baseDir, srcPath);
  const ext = path.extname(srcPath).toLowerCase();
  const basename = path.basename(srcPath, ext);
  const subDir = path.dirname(relativePath);

  const outputSubDir = path.join(destDir, subDir);
  await ensureDir(outputSubDir);

  const metadata = await sharp(srcPath).metadata();
  const originalWidth = metadata.width;

  const generatedFiles = {
    webp: [],
    original: []
  };

  // Generate responsive sizes
  for (const width of imageConfig.sizes) {
    // Skip sizes larger than original
    if (width > originalWidth) continue;

    // Generate WebP version
    const webpFilename = `${basename}-${width}w.webp`;
    const webpPath = path.join(outputSubDir, webpFilename);
    await sharp(srcPath)
      .resize(width)
      .webp({ quality: imageConfig.quality })
      .toFile(webpPath);

    generatedFiles.webp.push({
      width,
      filename: path.join(subDir, webpFilename).replace(/\\/g, "/")
    });

    // Generate original format version (for fallback)
    const origFilename = `${basename}-${width}w${ext}`;
    const origPath = path.join(outputSubDir, origFilename);
    await sharp(srcPath)
      .resize(width)
      .toFile(origPath);

    generatedFiles.original.push({
      width,
      filename: path.join(subDir, origFilename).replace(/\\/g, "/")
    });
  }

  // Also copy original at original size for fallback
  const fallbackFilename = `${basename}${ext}`;
  const fallbackPath = path.join(outputSubDir, fallbackFilename);
  await fs.copyFile(srcPath, fallbackPath);

  // Store info for markdown renderer
  const imageKey = `/images/${relativePath.replace(/\\/g, "/")}`;
  processedImages.set(imageKey, {
    webp: generatedFiles.webp,
    original: generatedFiles.original,
    fallback: path.join(subDir, fallbackFilename).replace(/\\/g, "/"),
    originalWidth
  });

  return generatedFiles;
}

export async function processAllImages(srcDir, destDir) {
  console.log("Processing images...");

  clearProcessedImages();

  try {
    await fs.access(srcDir);
  } catch {
    console.log("  No images directory found, skipping image processing");
    return;
  }

  const imageFiles = await getImageFiles(srcDir);

  if (imageFiles.length === 0) {
    console.log("  No images found to process");
    return;
  }

  await ensureDir(destDir);

  for (const imagePath of imageFiles) {
    const relativePath = path.relative(srcDir, imagePath);
    await processImage(imagePath, destDir, srcDir);
    console.log(`  Processed: ${relativePath}`);
  }

  console.log(`  Total: ${imageFiles.length} image(s) processed`);
}

export function generateResponsiveHTML(imagePath, alt) {
  const baseUrl = config.baseUrl || "";
  const imageInfo = processedImages.get(imagePath);

  // If image wasn't processed, return standard img tag
  if (!imageInfo) {
    return `<img src="${baseUrl}${imagePath}" alt="${alt}" loading="lazy" class="rounded-lg shadow-md max-w-full h-auto">`;
  }

  // Build srcset strings
  const webpSrcset = imageInfo.webp
    .map((img) => `${baseUrl}/assets/images/${img.filename} ${img.width}w`)
    .join(", ");

  const fallbackSrcset = imageInfo.original
    .map((img) => `${baseUrl}/assets/images/${img.filename} ${img.width}w`)
    .join(", ");

  // Determine best fallback size (middle size or largest available)
  const fallbackSize = imageInfo.original.length > 0
    ? imageInfo.original[Math.floor(imageInfo.original.length / 2)]
    : null;

  const fallbackSrc = fallbackSize
    ? `${baseUrl}/assets/images/${fallbackSize.filename}`
    : `${baseUrl}/assets/images/${imageInfo.fallback}`;

  // Calculate sizes attribute based on typical content width
  const sizes = "(max-width: 768px) 100vw, 800px";

  return `<picture>
  <source type="image/webp" srcset="${webpSrcset}" sizes="${sizes}">
  <source srcset="${fallbackSrcset}" sizes="${sizes}">
  <img src="${fallbackSrc}" alt="${alt}" loading="lazy" class="rounded-lg shadow-md max-w-full h-auto">
</picture>`;
}
