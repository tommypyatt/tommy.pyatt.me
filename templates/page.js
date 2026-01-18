import { layout } from "./layout.js";

export function renderPage({ title, content, slug }) {
  const pageContent = `
    <article class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      ${title ? `<h1 class="text-3xl md:text-4xl font-bold text-gray-100 mb-8">${title}</h1>` : ""}
      <div class="prose">
        ${content}
      </div>
    </article>
  `;

  return layout({
    title,
    content: pageContent,
    currentPath: slug || "index"
  });
}
