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
├── App.jsx              # sections, filters and shared state
├── components/          # views and UI
│   ├── canvasui/        # third-party effects — see ../LICENSING.md
│   └── arlan/           # third-party effects — see ../LICENSING.md
└── data/                # the catalogue: languages, resources, concepts,
                         # components, skills, and the translation maps
```

Adding content means editing a file in `data/`. Anything with an English version lives in a
parallel map next to it (`codeEn.js`, `conceptExamplesEn.js`): update both, or the new entry shows
up in Spanish inside the English site.

Full project documentation, licensing and contribution notes are in the
[repository README](../README.md).
