import config from "../site.config.js";

function resolveUrl(path) {
  const base = config.baseUrl || "";
  if (path.startsWith("/")) {
    return `${base}${path}`;
  }
  return `${base}/${path}`;
}

function renderNavLinks(currentPath) {
  return config.navLinks
    .map((link) => {
      const href = link.slug === "" ? resolveUrl("/") : resolveUrl(`/${link.slug}/`);
      const isActive = currentPath === link.slug ||
        (link.slug === "" && currentPath === "index") ||
        (link.type === "blog" && currentPath.startsWith("blog"));

      return `<a href="${href}" class="px-3 py-2 rounded-md text-sm font-medium ${
        isActive
          ? "text-primary-400 bg-background-elevated"
          : "text-foreground hover:text-primary-400 hover:bg-background-elevated"
      } transition-colors">${link.label}</a>`;
    })
    .join("\n            ");
}

function renderMobileNavLinks(currentPath) {
  return config.navLinks
    .map((link) => {
      const href = link.slug === "" ? resolveUrl("/") : resolveUrl(`/${link.slug}/`);
      const isActive = currentPath === link.slug ||
        (link.slug === "" && currentPath === "index") ||
        (link.type === "blog" && currentPath.startsWith("blog"));

      return `<a href="${href}" class="block px-3 py-2 rounded-md text-base font-medium ${
        isActive
          ? "text-primary-400 bg-background-elevated"
          : "text-foreground hover:text-primary-400 hover:bg-background-elevated"
      } transition-colors">${link.label}</a>`;
    })
    .join("\n          ");
}

const socialIcons = {
  linkedin: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>`,
  github: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"/>
  </svg>`,
  twitter: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>`,
  medium: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>`,
  email: `<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z"/>
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z"/>
  </svg>`
};

function renderSocialLinks() {
  const links = config.socialLinks;
  if (!links) return '';

  const socialItems = [];
  const linkClass = "text-foreground-subtle hover:text-primary-400 transition-colors";

  if (links.linkedin) {
    socialItems.push(`<a href="${links.linkedin}" target="_blank" rel="noopener noreferrer" class="${linkClass}" aria-label="LinkedIn">${socialIcons.linkedin}</a>`);
  }
  if (links.github) {
    socialItems.push(`<a href="${links.github}" target="_blank" rel="noopener noreferrer" class="${linkClass}" aria-label="GitHub">${socialIcons.github}</a>`);
  }
  if (links.twitter) {
    socialItems.push(`<a href="${links.twitter}" target="_blank" rel="noopener noreferrer" class="${linkClass}" aria-label="Twitter">${socialIcons.twitter}</a>`);
  }
  if (links.medium) {
    socialItems.push(`<a href="${links.medium}" target="_blank" rel="noopener noreferrer" class="${linkClass}" aria-label="Medium">${socialIcons.medium}</a>`);
  }
  if (links.email) {
    // Email link is rendered with data attribute and populated via JavaScript
    socialItems.push(`<a href="#" id="email-link" data-e="${links.email}" class="${linkClass}" aria-label="Email">${socialIcons.email}</a>`);
  }

  return socialItems.join('\n              ');
}

export function layout({ title, content, currentPath = "" }) {
  const pageTitle = title ? `${title} | ${config.siteTitle}` : config.siteTitle;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${config.siteDescription}">
  <meta name="author" content="${config.author}">
  <title>${pageTitle}</title>
  <link rel="stylesheet" href="${resolveUrl("/assets/styles.css")}">
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>
</head>
<body class="min-h-screen flex flex-col">
  <!-- Header -->
  <header class="bg-background-surface border-b border-border-subtle sticky top-0 z-50" x-data="{ mobileMenuOpen: false }">
    <nav class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <!-- Logo/Site Title -->
        <div class="flex items-center">
          <a href="${resolveUrl("/")}" class="text-xl font-bold text-foreground-heading hover:text-primary-400 transition-colors">
            ${config.siteTitle}
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          ${renderNavLinks(currentPath)}
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden flex items-center">
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-primary-400 hover:bg-background-elevated focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle navigation menu"
          >
            <svg x-show="!mobileMenuOpen" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg x-show="mobileMenuOpen" x-cloak class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div
        x-show="mobileMenuOpen"
        x-cloak
        x-transition:enter="transition ease-out duration-200"
        x-transition:enter-start="opacity-0 -translate-y-1"
        x-transition:enter-end="opacity-100 translate-y-0"
        x-transition:leave="transition ease-in duration-150"
        x-transition:leave-start="opacity-100 translate-y-0"
        x-transition:leave-end="opacity-0 -translate-y-1"
        class="md:hidden pb-3 space-y-1"
      >
        ${renderMobileNavLinks(currentPath)}
      </div>
    </nav>
  </header>

  <!-- Main Content -->
  <main class="flex-grow">
    ${content}
  </main>

  <!-- Footer -->
  <footer class="bg-background-surface border-t border-border-subtle mt-auto">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <p class="text-foreground-subtle text-sm">${config.footer.copyright}</p>
        <div class="flex items-center space-x-4">
              ${renderSocialLinks()}
        </div>
      </div>
    </div>
  </footer>

  <style>
    [x-cloak] { display: none !important; }
  </style>
  <script>
    (function() {
      var el = document.getElementById('email-link');
      if (el) {
        var d = el.getAttribute('data-e');
        if (d) {
          try {
            var e = atob(d);
            el.href = 'mailto:' + e;
            el.removeAttribute('data-e');
          } catch(err) {}
        }
      }
    })();
  </script>
</body>
</html>`;
}

export { resolveUrl };
