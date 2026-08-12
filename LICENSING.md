# Licensing

Vibeset is not under a single licence, because it is not a single kind of work. The code, the
catalogue and the brand are different things, and each one has its own rules.

The `LICENSE` file at the root holds the MIT text on its own, with nothing added, so GitHub and
automated tools detect it correctly. **It covers the source code only.** This document is the full
map: read it before reusing anything that is not code.

**The short version: take the code, take the knowledge, always credit, never take the name.**

| What | Licence | You may |
| --- | --- | --- |
| Source code written for Vibeset | [MIT](LICENSE) | Copy it, modify it, ship it commercially. Keep the copyright notice. |
| Catalogue content and written material | [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) | Reuse and adapt it, commercially too. Credit Vibeset with a visible link. |
| Name, logo and domain | Not licensed | Nothing. See [Brand and name](#brand-and-name). |
| Third-party effects bundled here | Their authors' terms | See [Third-party code](#third-party-code). |

---

## Source code — MIT

Everything written for this project: the React application, the views, the components built for
Vibeset, the build configuration and the scripts.

Take a component, take the whole app if it is useful to you. Ship it in a commercial product. The
only condition is the one MIT already states: keep the copyright notice.

## Catalogue content — CC BY 4.0

The written material and the curated data:

- the 100 language profiles (descriptions, uses, pros and cons, code examples),
- the 64 resource entries,
- the 41 web design concepts and their examples,
- the 12 agent skills, including the body of every `SKILL.md`,
- the interface copy in both languages.

**Take it.** Copy it, translate it, adapt it, teach with it, build a product on top of it and charge
for that product. Knowledge that only one site is allowed to hold is worth less than knowledge that
travels, and this is meant to travel.

One condition, and it is not optional: **credit Vibeset, visibly, with a link.** Not buried in a
footer nobody scrolls to, not in a comment in the source. Where a reader can see it.

Suggested wording, in whatever language you publish in:

```
Content from Vibeset by Munir Torres — https://vibeset.dev — CC BY 4.0
```

Full licence text: <https://creativecommons.org/licenses/by/4.0/legalcode>

## Brand and name

**Vibeset**, the Vibeset logo, the icons in `redesign/public/brand/` and the domain `vibeset.dev`
are the identity of this project. They are **not covered by any licence here**, and no permission to
use them is granted, expressly or by implication. This is the one line that does not move.

You may not:

- **Publish anything under the name Vibeset.** Not a fork, a mirror, a rebuild, an app, an extension
  or a service.
- **Register a domain built on the name.** `vibeset.xyz`, `vibeset.io`, `vibeset.app`,
  `getvibeset.com`, `vibeset.es` and anything of that shape are off limits, as are misspellings and
  near-copies (`vibesets`, `vibe-set`, `viberset`) that a reader could mistake for this project.
- **Use the logo or the icons** as the identity of your project, product, service or account.
- **Open accounts** on GitHub, npm, social platforms or app stores under that name.
- **Suggest affiliation.** No "official", no "powered by Vibeset", no wording that implies this
  project endorses, sponsors or maintains yours.

You may always, without asking: **name Vibeset to refer to Vibeset.** Link to it, review it, teach
with it, compare it, criticise it, say a component or a definition came from here. That is what the
name is for, and no permission is needed for it.

## If you fork this

Forking is welcome. Three conditions, and none of them is a favour:

1. **Rename it.** Choose your own name and remove the assets in `redesign/public/brand/`. The code
   runs fine without them. Nothing in your fork should read "Vibeset" as if it were yours.
2. **Credit it, where it can be seen.** In your README, and in the interface itself if you publish
   the site. A visible link to <https://vibeset.dev>.
3. **Keep the notices.** The copyright notice in the code, and the credits the third-party effects
   carry to their own authors.

This is not a courtesy request. Credit is a term of the licence: CC BY requires attribution for the
content in any medium, and MIT requires the copyright notice to travel with the code. A fork of
Vibeset carries both, so it carries the credit.

Suggested line for a fork:

```
Based on Vibeset by Munir Torres — https://vibeset.dev
```

## Third-party code

Some visual effects in this repository were **not written for Vibeset** and are not Munir's to
license. They are kept in their own folders, unmodified except where noted in the source comments:

| Folder | Author | Source |
| --- | --- | --- |
| `redesign/src/components/canvasui/` | canvasui | <https://canvasui.dev> |
| `redesign/src/components/arlan/` | Arlan | <https://arlan.me/vault> |

Neither author ships a licence file with the code they publish. They distribute it for people to use
in their projects, but **the MIT licence of this repository does not extend to those files**. If you
want to reuse one of those effects, take it from the author's own site and follow their terms, not
these. Every effect in Vibeset credits its source with a link on its page.

The photographs in `redesign/public/demo/` come from [Lorem Picsum](https://picsum.photos) and are
only there to give the demos something to distort.

## Contributing

Contributions are welcome, and they are the point: this is meant to grow with them. By opening a
pull request you agree that your code goes in under MIT and your written content under CC BY 4.0,
the same terms as the rest.

## Questions

If a use you have in mind does not fit cleanly in any of the boxes above, open an issue and ask.
Permission for a specific case is easier to grant than to guess.

---

> **ES · Resumen.** Vibeset no tiene una sola licencia porque no es una sola cosa. **El código es
> MIT**: cógelo, cámbialo y véndelo, solo conserva el aviso de copyright. **El contenido** (los 100
> lenguajes, los 64 recursos, los 41 conceptos, las 12 skills y los textos) es **CC BY 4.0**: úsalo
> para lo que quieras, comercial incluido, con una sola condición que no es negociable: **citar a
> Vibeset con un enlace visible**. **El nombre, el logo y el dominio no se licencian**: no puedes
> llamar Vibeset a lo tuyo ni registrar vibeset.xyz, vibeset.io ni nada parecido. Si haces un fork,
> cámbiale el nombre, quita el logo y pon el crédito donde se vea. Y ojo, **los efectos de
> `canvasui/` y `arlan/` no son míos**: están aquí con crédito y enlace, pero para reutilizarlos hay
> que ir a sus autores.
