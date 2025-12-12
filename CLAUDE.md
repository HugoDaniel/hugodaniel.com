# CLAUDE.md - hugodaniel.com

Personal blog and portfolio of Hugo Daniel, served at https://hugodaniel.com

## Tech Stack

- **Static Site Generator:** Zola
- **Deployment:** rsync to remote server
- **License:** EUPL 1.2

## Project Structure

```
├── config.toml          # Zola configuration
├── Makefile             # Build & deploy automation
├── content/             # Markdown source files
│   ├── posts/           # Blog articles (46 posts)
│   ├── projects/        # Project showcases
│   └── drafts/          # Work in progress
├── templates/           # Zola templates
├── static/              # Assets served as-is
│   ├── css/             # Stylesheets
│   ├── scripts/         # JavaScript
│   ├── images/          # Photos and graphics
│   ├── assets/          # SVG icons
│   └── pages/           # Embedded web applications
└── public/              # Generated output (gitignored)
```

## Common Commands

```bash
# Build the site (copies shader-canvas docs first)
make build

# Just run Zola build
zola build

# Serve locally with live reload
zola serve

# Deploy to production
make publish
```

## Content Authoring

### Creating a New Post

Create a markdown file in `content/posts/` with naming convention `YYYY-MM-DD-slug.md`:

```toml
+++
title = "Post Title"
description = "Brief description for SEO and previews"
date = 2025-01-15
extra = {
    place = "Location",
    author = "Hugo Daniel",
    social_img = "/images/social-preview.webp",
    class = "center-images"
}
+++

Post content in markdown...
```

### Frontmatter Options

| Field | Purpose |
|-------|---------|
| `extra.place` | Location where post was written |
| `extra.author` | Author name |
| `extra.social_img` | OpenGraph/Twitter card image |
| `extra.class` | CSS classes for post layout (`center-images`, `with-lists`) |
| `extra.modules` | ES modules to inject (array) |
| `extra.scripts` | Scripts to inject (array) |

### Drafts

Place unfinished posts in `content/drafts/` - they won't be published.

## Templates

| Template | Purpose |
|----------|---------|
| `index.html` | Base template with SEO, navigation, CSS loading |
| `page.html` | Individual post layout |
| `section.html` | Post listing (divides into "new" and "old" posts) |
| `project.html` | Project showcase with TOC navigation |
| `thanks.html` | Thank you page |

## CSS Architecture

Modular CSS loaded in order:
1. `base.css` - Foundation styles, CSS variables, grid layout
2. `html-system.css` - HTML5 semantic elements
3. `dark-mode.css` - Dark theme (respects `prefers-color-scheme`)
4. `desktop.css` - Desktop-specific layouts
5. `submit-form.css` - Form components

## Embedded Applications

Interactive web apps in `/static/pages/`:
- `boreDOM/` - JS framework demo
- `gridgenerator/` - Pixel art design tool
- `color-picker-pro/` - Figma plugin
- `webgpu-diagnostics/` - WebGPU shader benchmarking tool

## Special Behaviors

- **Search:** Client-side search via elasticlunr (index built at compile time)
- **Feeds:** RSS/Atom at `/atom.xml`
- **Code highlighting:** Uses "boron" theme
- **Shader Canvas docs:** Auto-copied from `../shader_canvas/docs/` during build

## Post Date Threshold

Posts after 2020-06-07 appear in "New posts" section; earlier posts in "Old posts".

## Accessibility Features

- **Skip link** - "Skip to main content" link for keyboard users (hidden until focused)
- **Focus indicators** - Visible `outline` on `:focus-visible` for all interactive elements
- **ARIA labels** - Navigation elements have descriptive `aria-label` attributes
- **Semantic HTML** - Proper heading hierarchy, `<main>`, `<article>`, `<nav>`, `<time>` elements
- **Hamburger menu** - Uses `<button>` with `aria-expanded`, `aria-controls`, keyboard support

## LLM/AI Friendliness

- **llms.txt** - `/llms.txt` provides site context for AI crawlers
- **JSON-LD schema** - BlogPosting structured data on all posts
- **Author metadata** - `<meta name="author">`, `<link rel="author">`, `article:author` OG tag
- **Semantic structure** - Clear content hierarchy for content extraction
- **RSS/Atom feeds** - Machine-readable content at `/atom.xml`

## Creating a New Page (Interactive App)

Pages are standalone web applications in `static/pages/`. They are served as-is and bypass Zola templating.

### Process

1. **Create directory:**
   ```bash
   mkdir static/pages/my-new-app
   ```

2. **Create index.html with required meta tags:**
   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
     <meta charset="utf-8">
     <meta name="viewport" content="width=device-width, initial-scale=1">
     <title>App Name</title>
     <meta name="description" content="Brief description">
     <meta name="author" content="Hugo Daniel">

     <!-- Open Graph -->
     <meta property="og:type" content="website">
     <meta property="og:title" content="App Name">
     <meta property="og:description" content="Brief description">
     <meta property="og:image" content="https://hugodaniel.com/pages/my-new-app/preview.webp">
     <meta property="og:url" content="https://hugodaniel.com/pages/my-new-app/">

     <!-- Twitter Card -->
     <meta name="twitter:card" content="summary_large_image">
     <meta name="twitter:title" content="App Name">
     <meta name="twitter:description" content="Brief description">
     <meta name="twitter:image" content="https://hugodaniel.com/pages/my-new-app/preview.webp">

     <link rel="stylesheet" href="styles.css">
     <script src="main.js" type="module"></script>
   </head>
   <body>
     <!-- App content -->
   </body>
   </html>
   ```

3. **Add assets** (CSS, JS, images) in the same directory

4. **Build site** to copy to public:
   ```bash
   zola build
   ```

### Existing Page Patterns

| Page | Approach | Notes |
|------|----------|-------|
| `boreDOM/` | Hand-crafted HTML | Documentation-style, own CSS reset |
| `webgpu-diagnostics/` | boreDOM framework | ES modules, web components, importmap |
| `color-picker-pro/` | SvelteKit build | Has `_app/` folder from bundler |
| `gridgenerator/` | Standalone app | Legacy structure |

### Notes

- Pages don't share styles/components with main Zola site
- Each page manages its own dependencies
- No build step required (unless using a framework like SvelteKit)
- For boreDOM-based apps, copy `boreDOM.js` and set up importmap
