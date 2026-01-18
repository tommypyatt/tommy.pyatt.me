export default {
  siteTitle: "Tommy Pyatt",
  siteDescription: "Personal website and blog",
  author: "Tommy Pyatt",

  // Base URL for GitHub Pages deployment
  // Set to "" for root domain, or "/repo-name" for project pages
  baseUrl: "",

  // Number of posts per page on the blog listing
  postsPerPage: 5,

  // Blog listing intro text
  blogIntro: "My thoughts, ideas and updates. Updated infrequently. Probably.",

  // Navigation links - used for both desktop and mobile nav
  navLinks: [
    { label: "Home", type: "page", slug: "" },
    { label: "About", type: "page", slug: "about" },
    { label: "Blog", type: "blog", slug: "blog" }
  ],

  // Footer content
  footer: {
    copyright: `© ${new Date().getFullYear()} Tommy Pyatt. All rights reserved.`
  },

  // Social links for footer (set to null or remove to hide)
  socialLinks: {
    linkedin: "https://uk.linkedin.com/in/tommy-pyatt-69a78461",
    github: "https://github.com/tommypyatt",
    twitter: "https://twitter.com/tommy_pyatt",
    medium: "https://medium.com/@tommypyatt",
    // Email is obfuscated in the page - use base64 encoded value
    // To encode: btoa("your@email.com") in browser console
    email: "dG9tbXlAcHlhdHQubWU=" // base64 encoded email address
  }
};
