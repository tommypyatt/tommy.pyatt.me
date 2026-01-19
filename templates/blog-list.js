import { layout, resolveUrl } from "./layout.js";
import config from "../site.config.js";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function renderPostCard({ title, date, excerpt, slug, tags }) {
  const formattedDate = formatDate(date);

  const tagsHtml = tags && tags.length > 0
    ? `<div class="flex flex-wrap gap-2 mb-3">
        ${tags.map(tag => `<span class="px-2 py-0.5 bg-background-elevated text-primary-400 text-xs rounded-full border border-border">${tag}</span>`).join("")}
      </div>`
    : "";

  return `
    <article class="border-b border-border-subtle pb-8 mb-8 last:border-b-0 last:pb-0 last:mb-0">
      <p class="text-foreground-subtle text-sm mb-2">
        <time datetime="${date}">${formattedDate}</time>
      </p>
      <h2 class="text-xl md:text-2xl font-semibold text-foreground-heading mb-3">
        <a href="${resolveUrl(`/blog/${slug}/`)}" class="hover:text-primary-400 transition-colors">
          ${title}
        </a>
      </h2>
      ${tagsHtml}
      <p class="text-foreground-muted mb-4">${excerpt}</p>
      <a href="${resolveUrl(`/blog/${slug}/`)}" class="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors" aria-label="Read more: ${title}">
        Read more
        <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </a>
    </article>
  `;
}

function renderPagination({ currentPage, totalPages }) {
  if (totalPages <= 1) return "";

  const prevPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  const prevUrl = prevPage === 1
    ? resolveUrl("/blog/")
    : prevPage ? resolveUrl(`/blog/page/${prevPage}/`) : null;

  const nextUrl = nextPage ? resolveUrl(`/blog/page/${nextPage}/`) : null;

  return `
    <nav class="flex justify-between items-center pt-8 border-t border-border-subtle" aria-label="Blog pagination">
      <div>
        ${prevUrl
          ? `<a href="${prevUrl}" class="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
              Newer posts
            </a>`
          : `<span class="text-foreground-disabled">Newer posts</span>`
        }
      </div>
      <span class="text-foreground-subtle text-sm">Page ${currentPage} of ${totalPages}</span>
      <div>
        ${nextUrl
          ? `<a href="${nextUrl}" class="inline-flex items-center text-primary-400 hover:text-primary-300 font-medium transition-colors">
              Older posts
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>`
          : `<span class="text-foreground-disabled">Older posts</span>`
        }
      </div>
    </nav>
  `;
}

export function renderBlogList({ posts, currentPage, totalPages }) {
  const postsHtml = posts.map(renderPostCard).join("");

  const pageContent = `
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-foreground-heading mb-4">Blog</h1>
        <p class="text-foreground-muted">${config.blogIntro}</p>
      </header>

      <div class="space-y-0">
        ${postsHtml || `<p class="text-foreground-subtle">No posts yet. Check back soon!</p>`}
      </div>

      ${renderPagination({ currentPage, totalPages })}
    </div>
  `;

  return layout({
    title: currentPage > 1 ? `Blog - Page ${currentPage}` : "Blog",
    content: pageContent,
    currentPath: "blog"
  });
}
