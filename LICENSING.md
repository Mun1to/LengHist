# Licensing

Vibeset is not under a single licence, because it is not a single kind of work. The code, the
catalogue and the brand are different things, and each one has its own rules.

The `LICENSE` file at the root holds the MIT text on its own, with nothing added, so GitHub and
automated tools detect it correctly. **It covers the source code only.** This document is the full
map: read it before reusing anything that is not code.

**The short version: take the code, credit the content, leave the name.**

| What | Licence | You may |
| --- | --- | --- |
| Source code written for Vibeset | [MIT](LICENSE) | Copy it, modify it, ship it commercially. Keep the copyright notice. |
| Catalogue content and written material | [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) | Reuse and adapt it for non-commercial purposes, with credit, under the same licence. |
| Name, logo and domain | Not licensed | Nothing. See [Brand](#brand). |
| Third-party effects bundled here | Their authors' terms | See [Third-party code](#third-party-code). |

---

## Source code — MIT

Everything written for this project: the React application, the views, the components built for
Vibeset, the build configuration and the scripts.

Take a component, take the whole app if it is useful to you. Ship it in a commercial product. The
only condition is the one MIT already states: keep the copyright notice.

## Catalogue content — CC BY-NC-SA 4.0

The written material and the curated data:

- the 100 language profiles (descriptions, uses, pros and cons, code examples),
- the 64 resource entries,
- the 41 web design concepts and their examples,
- the 12 agent skills, including the body of every `SKILL.md`,
- the interface copy in both languages.

This is the part that took the time. It is yours to use under three conditions: **credit Vibeset**
with a visible link, **do not sell it or build a commercial product out of it**, and **share your
adaptations under the same licence**.

Quoting a definition in a post, using an example in a class, translating a section: all fine. Lifting
the catalogue to launch a competing site with ads on it: not fine.

Full text: <https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode>

## Brand

**Vibeset**, the Vibeset logo, the icons in `redesign/public/brand/` and the domain `vibeset.dev`
are not covered by any of the licences above. No licence to use them is granted, expressly or by
implication.

Concretely:

- Do not publish a fork, a mirror or a derived site under the name Vibeset, or under a name close
  enough to be confused with it.
- Do not use the logo as the identity of your own project, product or service.
- Do not suggest that Vibeset endorses, sponsors or is affiliated with your work.

What you can always do without asking: name Vibeset to refer to Vibeset. Link to it, review it,
teach with it, say where a component came from. That is nominative use and no permission is needed.

If you fork the repository, rename the project and replace the assets in `redesign/public/brand/`.
The code will run fine without them.

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
pull request you agree that your code goes in under MIT and your written content under
CC BY-NC-SA 4.0, the same terms as the rest.

## Questions

If a use you have in mind does not fit cleanly in any of the boxes above, open an issue and ask.
Permission for a specific case is easier to grant than to guess.

---

> **ES · Resumen.** Vibeset no tiene una sola licencia porque no es una sola cosa. **El código es
> MIT**: cógelo, cámbialo y véndelo si quieres, solo conserva el aviso de copyright. **El contenido**
> (los 100 lenguajes, los 64 recursos, los 41 conceptos, las 12 skills y los textos) es
> **CC BY-NC-SA 4.0**: úsalo citando a Vibeset, sin fines comerciales y compartiendo igual lo que
> hagas con él. **El nombre, el logo y el dominio no se licencian**: si haces un fork, cámbiale el
> nombre. Y ojo, **los efectos de `canvasui/` y `arlan/` no son míos**: están aquí con crédito y
> enlace, pero para reutilizarlos hay que ir a sus autores.
