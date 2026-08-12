<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="redesign/public/brand/logo-blanco.svg">
  <img alt="Vibeset" src="redesign/public/brand/logo-negro.svg" width="104">
</picture>

### Un sitio con todo lo que necesitas para construir en la web

100 lenguajes de programación, 64 herramientas de frontend, 41 técnicas de diseño, 12 componentes
en vivo y 12 skills de agente. Gratis, bilingüe, sin registro y sin rastreo.

<a href="https://vibeset.dev">
  <img alt="Abrir vibeset.dev" src=".github/assets/boton-abrir.svg" width="268">
</a>

[English](README.md) · **Español**

</div>

---

## Por qué existe

Aprender a construir en la web es pelearse con la búsqueda antes que con el problema. Qué lenguaje
encaja con lo que quieres hacer. Cuál de las cuarenta herramientas que hacen lo mismo merece la
tarde. Cómo se llama ese efecto que has visto en otra web. Qué decirle a tu agente de código para
que deje de adivinar.

Las respuestas existen, repartidas entre marcadores, hilos y tutoriales que caducaron hace dos años.

Vibeset las reúne en un sitio, y en vez de describirlas las enseña: datos reales en lugar de
opiniones, código que funciona en lugar de capturas de pantalla, efectos que puedes coger por los
mandos en lugar de un vídeo de otro usándolos. Es gratis y va a seguir siéndolo, funciona sin cuenta
y no te rastrea. En dos idiomas, porque lo bueno no debería estar solo en inglés.

No es un curso ni quiere serlo. Es la estantería que miras antes de empezar.

## Qué hay dentro

**100 lenguajes.** Año, creador, paradigma, popularidad, extensiones, ecosistema, ventajas,
desventajas y un ejemplo de código que enseña de verdad qué pinta tiene. Busca por nombre, uso o
extensión (`.py`, `.rs`), filtra por categoría, compara hasta tres a la vez, o haz un test corto que
te recomienda uno según lo que quieras construir, tu nivel y lo que valoras.

**64 recursos de frontend.** Las herramientas que merecen la tarde: generadores de interfaces con
IA, bloques ya hechos, frameworks de CSS, librerías de componentes, animación, iconos, color, fondos,
tipografía e inspiración.

**41 conceptos de diseño web.** Parallax, smooth scroll, animaciones ligadas al scroll, tilt 3D,
glassmorphism, View Transitions, container queries, Core Web Vitals y más. Cada uno con qué es, para
qué sirve y un ejemplo copiable con lo mínimo que hay que escribir.

**12 componentes en vivo.** Tela, despegado, ASCII, tramado, brillo cromático, relieve y más, cada
uno corriendo a tamaño real con sus mandos a la vista. Mueve los controles y copia el código con tus
valores ya puestos. Cada efecto lleva el crédito y el enlace de su autor original.

**12 skills de agente.** Instrucciones que le das una vez a tu agente de código y ya se sabe para
siempre: revisar una pantalla en móvil, auditar accesibilidad, revisar un diff, depurar hasta la
causa real, escribir el mensaje de un commit. Copias el `SKILL.md`, lo pegas en su carpeta y listo.

## Con qué está hecho

React 19, Vite, Tailwind CSS v4, Framer Motion y Lucide. Dos de los efectos usan three.js y se
descargan solo cuando los miras. Sin backend, sin base de datos, sin cuentas y sin analítica: todo
corre en tu navegador y nada sale de ahí.

La interfaz y todo el contenido están en los dos idiomas, incluidos los ejemplos de código. El tema
sigue al de tu sistema.

## Arrancarlo en tu ordenador

```bash
git clone https://github.com/Mun1to/Vibeset.git
cd Vibeset/redesign
pnpm install
pnpm dev
```

Abre la dirección que aparece. `pnpm build` deja el sitio de producción en `dist/`.

Lo que está en vivo es la app de React de `redesign/`. El `index.html` de la raíz del repositorio es
la versión vanilla original: se queda como historia y ya no se sirve.

## Despliegue

Cloudflare Pages, desde `main`. Root directory `redesign`, build `pnpm install && pnpm build`,
salida `dist`. Dominio propio `vibeset.dev`.

## Contribuir

Esto está pensado para crecer con más gente: un componente, un recurso, un concepto, una skill, un
arreglo, una traducción mejor. Abre un issue o una pull request. Las pequeñas también valen, y decir
que algo de aquí está mal, también.

## Licencia

Tres cosas distintas con tres reglas distintas: **coge el código, cita el contenido, deja el nombre.**

- **El código** es [MIT](LICENSE). Cópialo, cámbialo, véndelo.
- **El contenido** (lenguajes, recursos, conceptos, skills y textos) es
  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es). Con crédito, sin
  fines comerciales y compartiendo igual.
- **El nombre Vibeset, el logo y el dominio** no se licencian. Si haces un fork, cámbiale el nombre.
- **Los efectos de `canvasui/` y `arlan/` no son míos.** Están aquí con crédito y enlace; para
  reutilizarlos, hay que ir a sus autores.

Todo el detalle en **[LICENSING.md](LICENSING.md)**.

## No te fíes, compruébalo

El código abierto solo sirve si alguien lo lee, y casi nadie lo hace. Así que en vez de pedirte que
te fíes de este proyecto, aquí tienes el texto para comprobarlo: apunta tu propia IA a este
repositorio y te da un informe de seguridad, en tu idioma, en unos minutos, aunque no sepas
programar.

**[Abre AI-AUDIT.md](AI-AUDIT.md)** y pega ese texto en Claude Code, Codex, Cursor, Copilot o lo que
uses. Es el mismo texto en todos los repositorios públicos de aquí, así que puedes comparar.

---

<div align="center">

Hecho por [Munir Torres](https://github.com/Mun1to) · [vibeset.dev](https://vibeset.dev)

</div>
