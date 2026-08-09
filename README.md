# Vibeset

Resources for people who build for the web: programming languages, frontend tools, web design
techniques and news. Free, bilingual and with no sign-up. Everything runs in the browser.

Live: https://vibeset.dev

## What is inside

**Languages.** 100 programming languages with real data: year, creator, paradigm, popularity,
extensions, code example, pros and cons, plus the key frameworks, libraries and tools for each one.
Search by name, description, use case, framework or extension (`.py`, `.rs`...), filter by category,
mark favorites, compare two or three side by side, browse them on a timeline, and take a short quiz
that recommends a language based on your goal, level and priorities.

**Frontend resources.** Around 64 pages and tools for building interfaces: AI UI generators from
prompts (21st.dev, v0, bolt.new...), pre-built sections and blocks, CSS frameworks, UI libraries,
buttons and effects, animation, icons, color, backgrounds, typography, illustrations and
inspiration.

**Web design concepts.** A cheatsheet of 41 techniques across 5 categories: parallax, Lenis, scroll
snap, sticky, 3D tilt, glassmorphism, View Transitions, modern CSS, Core Web Vitals and more.

**Blog.** Tool news and practical tips, bilingual.

## Planned

Vibeset is the home of a community of people who build, so what it holds is meant to grow with
contributions: components, tutorials, guides and a library of agent skills that anyone can improve
through a pull request. That part is not built yet.

## Details

- Automatic light and dark theme that follows the system, plus first-visit language detection.
- Bilingual interface and content (Spanish / English).
- Shareable state in the URL (search, category, view and open language).
- Responsive layout (3 / 2 / 1 columns), keyboard navigation in the detail modal.
- Effects: cursor-following spotlight on cards, background aurora, per-language color glow,
  staggered entrance, button sheen and custom scrollbar.

## Stack

HTML, CSS and vanilla JavaScript. No frameworks, no build step, no dependencies and no keys: a
single self-contained `index.html` plus Google Fonts. It works by opening the file in a browser.

## Deployment

Published with Cloudflare Pages from the `main` branch (root), custom domain `vibeset.dev`.
