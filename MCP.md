# Vibeset MCP

A read-only [Model Context Protocol](https://modelcontextprotocol.io) server that lets any coding
agent search the Vibeset catalogue and pull install commands without leaving the editor.

It runs on the Cloudflare Pages Functions that already serve the site, from the same data that feeds
the pages. No new infrastructure, no database.

## The idea

The value is not "one more directory of thousands of components". It is search **filtered by house
criteria**: every component carries its motion cost, whether it respects the motion-accessibility
policy, and which web archetypes it fits. A query for a fintech site drops the heavy WebGL effects on
its own, so you get the two or three pieces that actually belong, not a wall of options.

Two layers, on purpose:

- **This MCP is the pantry.** Horizontal: any agent can use it. It serves data, it does not reason.
- **[FrontLaxWeb](https://github.com/Mun1to/FrontLaxWeb) is the cook.** A separate skill that owns the
  judgement: the intake questionnaire, the motion policy, the audit, the assembly. It is one of the
  brains that consume this pantry.

## Connect it

Remote endpoint (live once deployed to `main`):

```
https://vibeset.dev/api/mcp
```

**Claude Code:**

```bash
claude mcp add --transport http vibeset https://vibeset.dev/api/mcp
```

**Any client that speaks stdio (Cursor, Windsurf, Zed, …)** bridges to the remote server with
`mcp-remote`:

```json
{
  "mcpServers": {
    "vibeset": {
      "command": "npx",
      "args": ["mcp-remote", "https://vibeset.dev/api/mcp"]
    }
  }
}
```

**Locally, without deploying:**

```bash
cd redesign
pnpm install
pnpm dev
# point the client at http://localhost:5183/api/mcp
```

The endpoint speaks Streamable HTTP: a single `POST` with a JSON-RPC 2.0 message, answered with
`application/json`. A `GET` returns a small health object with the server name and its tools.

## Tools

### `search`

Searches the catalogue. Returns metadata and the origin install command, never the code.

| Argument | Type | Notes |
| --- | --- | --- |
| `query` | string | Free text. Matches name, description and labels, in both languages. |
| `tipo` | `component` \| `skill` | Restrict to one kind. |
| `arquetipo` | string | `marca-creativa`, `portfolio`, `lanzamiento`, `saas`, `fintech`, `ecommerce`, `editorial`, `evento`. Drops components that do not fit; skills are never filtered by this. |
| `dial` | `ok` \| `any` | `ok` drops large-amplitude decorative motion that does not meet the house policy. |
| `a11y` | `ok` \| `decorativo` \| `requiere-refuerzo` | Accessibility note. |
| `source` | `own` \| `federated` \| `all` | `own` is the Vibeset catalogue; `federated` reaches the third-party registries; `all` merges both. Federation is skipped when you filter by house criteria (archetype/dial/a11y), because it cannot be guaranteed over third-party pieces. |
| `lang` | `es` \| `en` | Default `es`. |
| `limit` | number | Cap the results (per federated origin too). |

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/call",
  "params": { "name": "search", "arguments": { "arquetipo": "fintech", "tipo": "component", "lang": "en" } } }
```

The `structuredContent` of the reply:

```json
{
  "results": [
    {
      "id": "component:colorDepth",
      "source": "own",
      "type": "component",
      "name": "Color Depth",
      "title": "Color Depth",
      "description": "ten materials for one button",
      "homepage": "https://arlan.me/vault/color-depth",
      "install": null,
      "meta": { "arquetipos": ["saas", "fintech", "ecommerce", "marca-creativa", "portfolio", "editorial"],
                "costeMovimiento": "bajo", "cumpleDial": true, "a11y": "ok" }
    }
  ],
  "count": 1,
  "source": "own"
}
```

The heavy WebGL effects never show up for `fintech`: that is the archetype matrix turned into data.

### `get_item`

Returns one item in full, by id (`component:bubble`, `skill:diretto`) or by bare key.

A **skill** comes with its whole `SKILL.md` inside (`files[0].content`) and a `CC BY 4.0` note. A
**component** comes with metadata and the origin install command, and `files` is always empty:

```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call",
  "params": { "name": "get_item", "arguments": { "id": "component:bubble" } } }
```

```json
{
  "name": "bubble",
  "type": "registry:component",
  "title": "Bubble",
  "description": "A glassy droplet rides your cursor…",
  "homepage": "https://canvasui.dev/docs/components/bubble",
  "registryDependencies": ["@canvas-ui/bubble-react"],
  "files": [],
  "meta": { "origen": "canvasui", "install": "pnpm dlx shadcn@latest add @canvas-ui/bubble-react",
            "instalacion": "shadcn", "licencia": "third-party" }
}
```

### `list_registries`

Enumerates the third-party registries Vibeset indexes and links (never rehosts): name, homepage,
namespace, licence and whether the index URL has been verified to return a real registry.

## The static registry

The same catalogue is also a [shadcn registry](https://ui.shadcn.com/docs/registry), emitted to
`dist/` at build:

- `https://vibeset.dev/r/registry.json` — the index
- `https://vibeset.dev/r/{name}.json` — one item each (`bubble`, `diretto`, …)
- `https://vibeset.dev/r/en/…` — the English half

So a skill can be installed straight from the URL, and the components point to their origin.

## Federated registries

`source: "federated"` reads the **index** (metadata only) of each curated registry, cached at the
edge, and returns title, description and the origin install command. It never requests the per-item
URLs, so third-party **code** never touches this server. An origin that falls does not break the
search. Verified 2026-08-21:

| Registry | Items | Licence | Namespace |
| --- | --- | --- | --- |
| shadcn/ui | 63 | MIT | `@shadcn` |
| Magic UI | 247 | MIT | `@magicui` |
| React Bits | 664 | MIT + Commons Clause | `@reactbits` |
| Aceternity UI | 278 | proprietary | `@aceternity` |
| canvasui | 210 | author terms | `@canvas-ui` |

Namespaces are the shadcn convention: to install `@magicui/marquee` a project registers the namespace
in its own `components.json`. Vibeset only points the way.

## Licensing: what it serves and what it never serves

The line, and the whole reason the architecture looks like this (see [LICENSING.md](LICENSING.md)):

- **Skills** are CC BY of the house, so they are served **whole**, body included.
- **Components** (the 12 in the catalogue are from canvasui/arlan, not ours) and **everything
  federated** are served as **metadata plus the origin install command**, with `files` empty. Their
  code is never copied, never served.

`pnpm registro` carries a guard that **fails the build if a component item ever ships code**. Indexing
and linking is safe; rehosting is the line that does not move.

## Add a registry

1. Add an entry to [`redesign/src/data/registries.js`](redesign/src/data/registries.js): `name`,
   `homepage`, `namespace`, `indexUrl`, `license`, and a one-line `es`/`en` description.
2. Run `pnpm registro`. It checks the `indexUrl` returns a real registry JSON with items. Flip
   `verificado: true` once it passes.

To change how a house component is filtered, edit its overlay in
[`redesign/src/data/registro-meta.js`](redesign/src/data/registro-meta.js) (archetypes, motion cost,
dial, a11y). That file is the vocabulary FrontLaxWeb relies on.

## Test and verify

```bash
pnpm mcp        # offline smoke test of the endpoint and the licence guard
pnpm registro   # validates the registry and pings the federated origins
pnpm dev        # then: curl http://localhost:5183/api/mcp
```

## Architecture

| File | Role |
| --- | --- |
| `redesign/src/lib/registro.js` | Pure builder: `indiceRegistro`, `itemRegistro`, `buscarCatalogo`. Single source of truth. |
| `redesign/src/data/registro-meta.js` | House metadata overlay (archetype, motion cost, dial, a11y). |
| `redesign/src/data/registries.js` | Curated third-party registries to federate. |
| `redesign/functions/api/mcp.js` | The Streamable HTTP endpoint and the three tools. |
| `redesign/vite.config.js` | Emits `/r/` at build; serves `/r/` and `/api/mcp` in dev. |
| `redesign/scripts/comprobar-registro.mjs` | Registry validation and the no-third-party-code guard. |
| `redesign/scripts/comprobar-mcp.mjs` | Offline smoke test of the tools. |
