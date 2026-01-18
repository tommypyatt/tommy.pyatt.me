import { layout, resolveUrl } from "./layout.js";

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

export function renderPost({ title, date, content, tags, slug }) {
  const formattedDate = formatDate(date);

  const tagsHtml = tags && tags.length > 0
    ? `<div class="flex flex-wrap gap-2 mb-6">
        ${tags.map(tag => `<span class="px-3 py-1 bg-gray-800 text-cyan-400 text-sm rounded-full border border-gray-700">${tag}</span>`).join("")}
      </div>`
    : "";

  const pageContent = `
    <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header class="mb-8">
        <p class="text-gray-500 text-sm mb-2">
          <time datetime="${date}">${formattedDate}</time>
        </p>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-100 mb-4">${title}</h1>
        ${tagsHtml}
      </header>

      <div class="prose">
        ${content}
      </div>

      <footer class="mt-12 pt-8 border-t border-gray-700">
        <a href="${resolveUrl("/blog/")}" class="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors">
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </a>
      </footer>
    </article>
  `;

  return layout({
    title,
    content: pageContent,
    currentPath: `blog/${slug}`
  });
}
