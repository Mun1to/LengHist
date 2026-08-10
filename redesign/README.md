# Vibeset redesign (work in progress)

An in-progress React rewrite of Vibeset, exploring a new structure inspired by
component-library sites: a persistent sidebar, a visual card grid and a live
code panel instead of a text-heavy modal.

**This is not the live site.** Production still runs from the single
self-contained `index.html` at the repo root, deployed to https://vibeset.dev.

## Status

- 6 sample languages (production has 100)
- Sections: Languages, Resources, Web concepts, Components
- Search, category filters and per-section favorites work
- Not yet ported: the quiz, the comparison table, the timeline view and the
  full language dataset

## Stack

React 19 + Vite, Tailwind CSS v4, Framer Motion, Lucide icons.

## Run it

```
pnpm install
pnpm dev
```

Serves on http://localhost:5183.
