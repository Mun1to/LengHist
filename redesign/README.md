# redesign — the live Vibeset site

This directory **is** vibeset.dev. Cloudflare Pages builds it from `main` with root directory
`redesign`, build `pnpm install && pnpm build`, output `dist`.

The `index.html` at the repository root is the original vanilla version, kept as history and no
longer served. Do not edit it expecting the live site to change.

## Run it

```bash
pnpm install
pnpm dev      # http://localhost:5183
pnpm build    # writes dist/
```

## Layout

```
src/
├── App.jsx              # reads the route, holds the filters and shared state
├── lib/
│   ├── rutas.js         # URL <-> internal key, and the slug rules
│   ├── tema.js          # light / dark / system, on a data-theme attribute
│   └── meta.js          # title and description per page
├── components/          # views and UI
│   ├── canvasui/        # third-party effects - see ../LICENSING.md
│   └── arlan/           # third-party effects - see ../LICENSING.md
└── data/                # the catalogue: languages, resources, concepts,
                         # components, skills, and the translation maps
```

## Addresses

Every section and every entry has one, and the router is the only source of truth for what is on
screen:

```
/                        /languages/rust
/languages               /components/cloth
/resources               /skills/finito
/concepts                anything else -> 404
/components
/skills
/tips
```

`public/_redirects` gives Cloudflare Pages the SPA fallback: without it, opening
`/languages/rust` directly returns a server 404. `sitemap.xml` and `robots.txt` are generated from
the catalogue at build time by a small plugin in `vite.config.js`, so adding a language keeps them
correct.

The theme is decided by an inline script in `index.html` before the first paint, and Tailwind's
`dark:` variant hangs off the `data-theme` attribute it sets. Adding a raw
`@media (prefers-color-scheme: dark)` block to a stylesheet will disagree with the header selector:
use `[data-theme="dark"]` instead.

Adding content means editing a file in `data/`. Anything with an English version lives in a
parallel map next to it (`codeEn.js`, `conceptExamplesEn.js`): update both, or the new entry shows
up in Spanish inside the English site.

Full project documentation, licensing and contribution notes are in the
[repository README](../README.md).
