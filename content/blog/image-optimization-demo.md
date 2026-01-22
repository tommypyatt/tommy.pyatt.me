---
title: Image Optimization in Action
date: 2026-01-22
excerpt: A demonstration of the built-in image optimization feature that generates responsive images with WebP support.
tags:
  - web development
  - performance
  - images
draft: true
---

This post demonstrates the image optimization feature built into this static site generator. When you add images to the `content/images/` directory and reference them in markdown, they're automatically processed into responsive image sets.

## How It Works

Simply use standard markdown image syntax:

```markdown
![Mountain landscape at sunset](/images/sample-landscape.jpg)
```

The build process will:

1. **Generate multiple sizes** (400w, 800w, 1200w by default)
2. **Create WebP versions** for better compression
3. **Output responsive HTML** with `<picture>` elements and `srcset`

## Example Image

Here's a sample landscape photo that has been automatically optimized:

![Mountain landscape at sunset](/images/sample-landscape.jpg)

Open your browser's developer tools and inspect the image above. You'll see it's wrapped in a `<picture>` element with multiple sources, allowing the browser to choose the best size and format.

## Configuration

Image settings are defined in `site.config.js`:

```javascript
images: {
  sizes: [400, 800, 1200],  // Widths to generate
  quality: 80               // WebP/JPEG quality
}
```

## Benefits

- **Faster page loads** - Browsers download appropriately-sized images
- **Better compression** - WebP format reduces file sizes by 25-35%
- **Automatic fallbacks** - Non-WebP browsers get original formats
- **Lazy loading** - Images load as they enter the viewport

## Adding Your Own Images

1. Place images in `content/images/`
2. Reference them as `/images/filename.jpg` in markdown
3. Run `npm run build`

The processed images appear in `docs/assets/images/` with size suffixes like `filename-800w.webp`.
