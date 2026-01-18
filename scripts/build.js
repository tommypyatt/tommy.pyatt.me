import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import matter from "gray-matter";
import { marked } from "marked";

import { cleanDir, ensureDir, getFiles, getSlugFromFilename } from "./utils.js";
import { renderPage } from "../templates/page.js";
import { renderPost } from "../templates/post.js";
import { renderBlogList } from "../templates/blog-list.js";
import config from "../site.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT_DIR, "content");
const OUTPUT_DIR = path.join(ROOT_DIR, "docs");
const ASSETS_DIR = path.join(OUTPUT_DIR, "assets");

async function buildCSS() {
  console.log("Building CSS with Tailwind...");
  const inputCSS = path.join(ROOT_DIR, "src", "styles.css");
  const outputCSS = path.join(ASSETS_DIR, "styles.css");

  await ensureDir(ASSETS_DIR);

  execSync(`npx tailwindcss -i "${inputCSS}" -o "${outputCSS}" --minify`, {
    cwd: ROOT_DIR,
    stdio: "inherit"
  });
}

async function parseMarkdownFile(filePath) {
  const fileContent = await fs.readFile(filePath, "utf-8");
  const { data, content } = matter(fileContent);
  const htmlContent = marked(content);

  return {
    frontMatter: data,
    content: htmlContent,
    rawContent: content
  };
}

async function buildPages() {
  console.log("Building pages...");
  const pagesDir = path.join(CONTENT_DIR, "pages");
  const pageFiles = await getFiles(pagesDir);

  for (const filePath of pageFiles) {
    const { frontMatter, content } = await parseMarkdownFile(filePath);
    const slug = getSlugFromFilename(filePath);

    const html = renderPage({
      title: frontMatter.title,
      content,
      slug
    });

    let outputPath;
    if (slug === "index") {
      outputPath = path.join(OUTPUT_DIR, "index.html");
    } else {
      const pageDir = path.join(OUTPUT_DIR, slug);
      await ensureDir(pageDir);
      outputPath = path.join(pageDir, "index.html");
    }

    await fs.writeFile(outputPath, html);
    console.log(`  Created: ${path.relative(OUTPUT_DIR, outputPath)}`);
  }
}

async function buildBlogPosts() {
  console.log("Building blog posts...");
  const blogDir = path.join(CONTENT_DIR, "blog");
  const postFiles = await getFiles(blogDir);

  const posts = [];

  for (const filePath of postFiles) {
    const { frontMatter, content } = await parseMarkdownFile(filePath);

    // Skip draft posts
    if (frontMatter.draft === true) {
      console.log(`  Skipping draft: ${path.basename(filePath)}`);
      continue;
    }

    const slug = getSlugFromFilename(filePath);

    posts.push({
      title: frontMatter.title || "Untitled",
      date: frontMatter.date || new Date().toISOString(),
      excerpt: frontMatter.excerpt || "",
      tags: frontMatter.tags || [],
      slug,
      content
    });

    // Generate individual post page
    const html = renderPost({
      title: frontMatter.title,
      date: frontMatter.date,
      content,
      tags: frontMatter.tags,
      slug
    });

    const postDir = path.join(OUTPUT_DIR, "blog", slug);
    await ensureDir(postDir);
    const outputPath = path.join(postDir, "index.html");

    await fs.writeFile(outputPath, html);
    console.log(`  Created: ${path.relative(OUTPUT_DIR, outputPath)}`);
  }

  // Sort posts by date (newest first)
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  return posts;
}

async function buildBlogIndex(posts) {
  console.log("Building blog index with pagination...");
  const postsPerPage = config.postsPerPage || 5;
  const totalPages = Math.ceil(posts.length / postsPerPage) || 1;

  for (let page = 1; page <= totalPages; page++) {
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    const pagePosts = posts.slice(startIndex, endIndex);

    const html = renderBlogList({
      posts: pagePosts,
      currentPage: page,
      totalPages
    });

    let outputPath;
    if (page === 1) {
      const blogDir = path.join(OUTPUT_DIR, "blog");
      await ensureDir(blogDir);
      outputPath = path.join(blogDir, "index.html");
    } else {
      const pageDir = path.join(OUTPUT_DIR, "blog", "page", String(page));
      await ensureDir(pageDir);
      outputPath = path.join(pageDir, "index.html");
    }

    await fs.writeFile(outputPath, html);
    console.log(`  Created: ${path.relative(OUTPUT_DIR, outputPath)}`);
  }
}

async function build() {
  console.log("Starting build...\n");

  // Clean output directory
  await cleanDir(OUTPUT_DIR);

  // Build CSS
  await buildCSS();
  console.log("");

  // Build pages
  await buildPages();
  console.log("");

  // Build blog posts and get sorted list
  const posts = await buildBlogPosts();
  console.log("");

  // Build blog index with pagination
  await buildBlogIndex(posts);
  console.log("");

  console.log("Build complete!");
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
