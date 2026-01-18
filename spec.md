Create a complete static-site project in this folder for a personal website + blog with the following requirements. Treat this as the authoritative spec for the repo and also create a CLAUDE.md capturing it.

Tech and tooling
Use Node-based tooling (plain Node + npm scripts is fine).

Use a custom static site generator in Node, not an off-the-shelf SSG like Next, Astro, Hugo, etc.

All pages and posts must be authored in Markdown files with YAML front matter.

Use Tailwind CSS for all styling (build once into a single CSS file).

Use AlpineJS for all interactivity and any dynamic behaviour in the browser.

The output must be a fully static site that can be hosted on GitHub Pages (from docs/ or dist/ – pick one and document it).

Content and structure
Implement this content model and folder structure (if you think a small tweak is needed, propose it in CLAUDE.md and implement the best variant):

content/ directory for all markdown:

content/pages/ for standalone pages (home, about, etc.)

Example files:

index.md for the homepage.

about.md as an example extra page.

content/blog/ for blog posts.

Each post is a .md file with YAML front matter, e.g.:

title (string)

date (ISO date string)

excerpt (short string)

tags (array of strings, optional)

draft (boolean, default false)

Add several example posts with realistic front matter and content to demonstrate pagination and templates.

Static site generator behaviour
Create a small Node-based static site generator in a scripts/ or builder/ folder. You can pick the exact structure, but it must:

Read all markdown files under content/pages/ and content/blog/.

Parse YAML front matter and markdown body (use popular npm libs like gray-matter and marked/markdown-it).

Generate HTML files into an output folder: prefer docs/ so the repo can be hosted directly with GitHub Pages.

For pages:

Generate:

docs/index.html from content/pages/index.md.

docs/about/index.html (or docs/about.html) from content/pages/about.md.

Support additional future pages just by adding .md files in content/pages/.

For blog posts:

Generate one HTML page per post, under something like:

docs/blog/<slug>/index.html

Slug can be derived from the filename (e.g. my-first-post.md -> my-first-post) with a simple slugification function.

Exclude posts where draft: true in front matter.

Blog listing + pagination
Generate a blog index/landing page at docs/blog/index.html.

The blog listing must:

List posts in reverse chronological order by date.

Show post title, formatted date, excerpt, and a “Read more” link to the post page.

Support pagination with a configurable page size (e.g. 5 posts per page):

docs/blog/index.html for page 1.

docs/blog/page/2/index.html for page 2, etc.

Include “Newer posts” / “Older posts” links for pagination navigation.

The blog index itself is generated purely from markdown posts (no need for a separate blog.md page, unless you think it is cleaner, in which case describe it in CLAUDE.md).

Layout, header, footer, navigation
Implement a shared layout so the header and footer are the same across all pages:

Use a template system (e.g. simple string templates, a tiny templating helper, or a very small templating library) to avoid repeating header/footer in every page.

The layout should have:

A consistent <head> section with:

Page <title> derived from front matter title if available, else a default site title.

Basic meta tags.

Link to the built Tailwind CSS.

Script tag for AlpineJS (via CDN is fine).

A single shared header with:

Site logo / title.

Primary navigation.

A shared footer with:

Copyright.

A link back to home.

Navigation and page selection
Implement a simple config-driven navigation model so that both mobile and desktop nav are generated based on a configuration instead of being hard-coded into each page.

For example (you can choose the final shape):

A site.config.json or site.config.mjs file that includes:

siteTitle

baseUrl (for GitHub Pages, if needed)

navLinks array of items, such as:

json
[
  { "label": "Home", "type": "page", "slug": "" },
  { "label": "About", "type": "page", "slug": "about" },
  { "label": "Blog", "type": "blog", "slug": "blog" }
]
The generator should:

Use navLinks to render the navigation bar in the header for both desktop and mobile views.

Treat “blog landing page” as a first-class nav item pointing to /blog/.

On mobile:

Use AlpineJS to implement a hamburger menu that toggles the navigation.

On desktop:

Show the navigation inline.

Make sure adding/removing nav items or pages only requires editing the config (and maybe adding a markdown file), not touching templates.

Tailwind and AlpineJS
Set up Tailwind properly:

Tailwind config file that purges the generated HTML templates to keep CSS small.

A single CSS entry file in src/styles.css (or similar), compiled to something like docs/assets/styles.css.

Use Tailwind utility classes for layouts, typography, and responsive design.

Include AlpineJS:

Use the latest stable AlpineJS via CDN script tag in the layout.

Use Alpine for:

Mobile nav toggle.

Any small interactive behaviours you think are useful (but keep it minimal and clean).

Include a basic responsive layout:

The site should look good on mobile and desktop out of the box.

Use a centered content column, sensible typography defaults, and adequate spacing.

GitHub Pages compatibility
Configure the project so that:

Running a single npm script builds the site into docs/.

All assets referenced in output HTML work correctly when served from https://<user>.github.io/<repo>/ (i.e. use relative paths or configurable base path).

Add clear instructions in the README and CLAUDE.md describing:

How to build locally: npm install, then npm run build, etc.

Which folder is expected to be published on GitHub Pages (e.g. docs/ branch main).

Any GitHub Pages-specific notes (like using relative asset paths).

DX and scripts
Add these npm scripts (names can vary slightly, but keep them simple and documented):

dev: builds the site and optionally watches markdown/templates for changes and rebuilds.

build: clean output folder and build a production-ready site into docs/.

If not implementing a full dev server, at least document how to use a simple static server (like npx serve docs) in the README.

Include a .gitignore with typical Node, build, and editor ignores.

CLAUDE.md requirements
Create a CLAUDE.md file at the project root with:

A clear description of the project purpose and tech stack.

The directory structure and what each folder is for (content/pages, content/blog, templates, build scripts, docs output, etc.).

Details of the static site generation process:

How markdown files are discovered.

How front matter is parsed and used.

How pagination works.

How navigation is configured.

Guidelines for future changes:

How to add a new page.

How to add a new blog post.

How to hide/unhide posts with draft: true.

How to change nav items.

How to adjust page size for blog pagination.

Any assumptions or simplifications you made vs this spec, and how to extend the system later.

README
Also create a README.md that is user-focused (not AI-focused) with:

Quickstart (install, dev, build).

How to deploy to GitHub Pages.

How to add/edit pages and blog posts.

How to customize navigation and styling.

Implementation expectations
Implement everything in this prompt, not just a skeleton; the repo should be runnable after npm install and npm run build.

Prefer small, readable modules over one giant script.

Add comments only where they materially clarify the generator’s behaviour or configuration.

When you are done, summarise:

The implemented directory structure.

The main build steps.

Any key commands the user should run.

If anything in this spec is ambiguous or conflicting, choose a sensible default, document your choice clearly in CLAUDE.md, and then implement accordingly.

