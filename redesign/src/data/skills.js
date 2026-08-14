// Biblioteca de skills de agente de Vibeset.
//
// Una skill es una carpeta con un SKILL.md dentro: frontmatter YAML que le dice
// al agente cuándo usarla, y debajo las instrucciones que sigue cuando se usa.
// Los campos del frontmatter que aparecen aquí están tomados de la referencia
// oficial (code.claude.com/docs/en/skills); no hay ninguno inventado.
//
// Cada entrada guarda el cuerpo real de la skill en los dos idiomas, para que
// lo que se copia desde la web sea un archivo que funciona tal cual.

// Autoría. Las fichas sin campo author son de la casa; una skill aportada por
// otra persona trae el suyo, para que el crédito viaje con la ficha.
export const AUTOR_CASA = { name: 'Mun1to', url: 'https://github.com/Mun1to' }
export const VIBESET_REPO = 'https://github.com/Mun1to/Vibeset'

export const authorOf = (item) => item.author || AUTOR_CASA
// Algunas skills se publican además como repo propio, instalable como plugin.
// Las que no, viven en este mismo repositorio: ahí es donde está su código.
export const hasOwnRepo = (item) => Boolean(item.repo)
export const repoOf = (item) => item.repo || VIBESET_REPO
export const repoLabel = (item) => repoOf(item).replace('https://github.com/', '')

export const SKILL_GROUPS = [
  { key: 'web', label: { es: 'Web y diseño', en: 'Web and design' } },
  { key: 'codigo', label: { es: 'Código', en: 'Code' } },
  { key: 'flujo', label: { es: 'Flujo de trabajo', en: 'Workflow' } },
  { key: 'escritura', label: { es: 'Escritura', en: 'Writing' } },
]

export const SKILL_ITEMS = [
  {
    key: 'revisar-responsive',
    group: 'web',
    name: 'revisar-responsive',
    nameEn: 'check-on-mobile',
    extra: [['allowed-tools', 'Read Grep Glob Bash']],
    files: ['SKILL.md'],
    es: {
      label: 'Revisar en móvil',
      what: 'Repasa una pantalla en móvil, tableta y escritorio y señala lo que se rompe antes de que lo vea nadie.',
      when: 'Cuando termines una vista nueva o toques la maquetación de una que ya existía.',
      description:
        'Revisa una pantalla web en móvil, tableta y escritorio y devuelve los fallos de maquetación ordenados por gravedad. Úsalo al terminar una vista nueva, al cambiar la maquetación de una existente o cuando el usuario diga que algo "se ve mal en el móvil".',
      body: `# Revisar en móvil

Revisa la vista indicada en tres anchos: 390px (móvil), 820px (tableta) y 1440px
(escritorio). Si el usuario no dice cuál, pregunta por la ruta o el archivo.

## Qué comprobar, en este orden

1. **Desbordamiento horizontal.** Nada debe empujar el ancho de la página. Los
   sospechosos habituales: tablas, bloques de código, imágenes sin max-width,
   rejillas con columnas de ancho fijo y palabras largas sin corte.
2. **Texto legible.** Mínimo 16px en el cuerpo del texto en móvil, y longitud de
   línea por debajo de 75 caracteres en escritorio.
3. **Zonas táctiles.** Todo lo que se pulsa necesita al menos 44x44px reales,
   contando el relleno, y separación suficiente entre elementos vecinos.
4. **Puntos de ruptura muertos.** Anchos donde el diseño no está roto pero sí
   feo: dos columnas apretadas, una tarjeta huérfana en la última fila, texto
   que baila.
5. **Alturas de ventana.** Con teclado abierto en móvil, 100vh corta contenido:
   comprueba si hace falta dvh.

## Cómo responder

Lista los fallos ordenados de más a menos grave. Cada uno con el ancho donde
aparece, el archivo y la línea, y el arreglo concreto en una frase. Si no hay
nada roto, dilo en una línea y no rellenes.`,
    },
    en: {
      label: 'Check on mobile',
      what: 'Goes over a screen at phone, tablet and desktop widths and points out what breaks before anyone else sees it.',
      when: 'When you finish a new view or change the layout of an existing one.',
      description:
        'Reviews a web screen at phone, tablet and desktop widths and returns layout defects ordered by severity. Use it after finishing a new view, after changing an existing layout, or when the user says something "looks wrong on mobile".',
      body: `# Check on mobile

Review the given view at three widths: 390px (phone), 820px (tablet) and 1440px
(desktop). If the user does not say which view, ask for the route or the file.

## What to check, in this order

1. **Horizontal overflow.** Nothing should push the page width. Usual suspects:
   tables, code blocks, images without max-width, grids with fixed-width columns
   and long unbroken words.
2. **Readable text.** At least 16px for body copy on phones, and line length
   under 75 characters on desktop.
3. **Touch targets.** Anything tappable needs at least 44x44px of real area,
   padding included, with enough space between neighbours.
4. **Dead breakpoints.** Widths where the layout is not broken but is ugly: two
   cramped columns, an orphan card on the last row, text that jumps around.
5. **Viewport heights.** With the keyboard open on a phone, 100vh cuts content
   off: check whether dvh is needed.

## How to answer

List the defects from most to least severe. Each one with the width where it
shows, the file and line, and the concrete fix in one sentence. If nothing is
broken, say so in one line and do not pad it.`,
    },
  },

  {
    key: 'accesibilidad',
    group: 'web',
    name: 'accesibilidad',
    nameEn: 'accessibility-audit',
    extra: [['allowed-tools', 'Read Grep Glob']],
    files: ['SKILL.md', 'referencias/contraste.md'],
    es: {
      label: 'Auditar accesibilidad',
      what: 'Busca los fallos de accesibilidad que de verdad dejan fuera a alguien, no los que solo salen en un informe.',
      when: 'Antes de publicar, y cada vez que añadas formularios, modales o menús.',
      description:
        'Audita la accesibilidad de una interfaz web: contraste, foco visible, teclado, texto alternativo, estructura de encabezados y anuncios de lector de pantalla. Úsalo antes de publicar una web, al añadir formularios, modales o menús, o cuando el usuario pregunte si su página es accesible.',
      body: `# Auditar accesibilidad

Audita la interfaz indicada. Prioriza siempre lo que impide usar la página por
encima de lo que solo incumple una norma sobre el papel.

## Bloqueantes (arreglar sí o sí)

- **Teclado.** Todo lo que se puede hacer con el ratón se tiene que poder hacer
  con el tabulador. Ojo con los divs con onClick, las trampas de foco en modales
  y el orden de tabulación cuando el CSS reordena visualmente.
- **Foco visible.** Nunca outline:none sin poner otra cosa en su lugar.
- **Nombre accesible.** Los botones de solo icono necesitan aria-label. Las
  imágenes con contenido necesitan alt; las decorativas, alt="".
- **Contraste.** 4.5:1 en texto normal, 3:1 en texto grande y en los bordes de
  los controles. Comprueba también los estados hover y desactivado.
- **Formularios.** Cada campo con su label asociada. Los errores, anunciados y
  ligados al campo, no solo pintados de rojo.

## Importantes

- Un solo h1 por página y encabezados sin saltos de nivel.
- Landmarks: header, nav, main, footer.
- Respetar prefers-reduced-motion en cualquier animación grande.
- Idioma declarado en el html, y en los fragmentos que cambian de idioma.

## Cómo responder

Dos listas: bloqueantes e importantes. Cada fallo con archivo, línea y el arreglo
exacto. No propongas ARIA donde el elemento HTML correcto ya lo resuelve: el
mejor atributo ARIA es el que no hace falta escribir.`,
    },
    en: {
      label: 'Audit accessibility',
      what: 'Looks for the accessibility failures that actually lock people out, not the ones that only show up in a report.',
      when: 'Before shipping, and every time you add forms, modals or menus.',
      description:
        'Audits the accessibility of a web interface: contrast, visible focus, keyboard use, alternative text, heading structure and screen reader announcements. Use it before shipping a site, when adding forms, modals or menus, or when the user asks whether their page is accessible.',
      body: `# Audit accessibility

Audit the given interface. Always rank what stops someone from using the page
above what merely breaks a rule on paper.

## Blockers (must fix)

- **Keyboard.** Everything doable with a mouse must be doable with the tab key.
  Watch for divs with onClick, focus traps in modals, and tab order when CSS
  reorders things visually.
- **Visible focus.** Never outline:none without putting something in its place.
- **Accessible name.** Icon-only buttons need aria-label. Content images need
  alt; decorative ones need alt="".
- **Contrast.** 4.5:1 for body text, 3:1 for large text and control borders.
  Check the hover and disabled states too.
- **Forms.** Every field with its associated label. Errors announced and tied to
  the field, not just painted red.

## Important

- One h1 per page and headings without skipped levels.
- Landmarks: header, nav, main, footer.
- Honour prefers-reduced-motion in any large animation.
- Language declared on the html element, and on fragments that switch language.

## How to answer

Two lists: blockers and important. Each defect with file, line and the exact fix.
Do not propose ARIA where the correct HTML element already solves it: the best
ARIA attribute is the one you never have to write.`,
    },
  },

  {
    key: 'animar-scroll',
    group: 'web',
    name: 'animar-scroll',
    nameEn: 'scroll-animation',
    extra: [['allowed-tools', 'Read Edit Write Grep Glob']],
    files: ['SKILL.md'],
    es: {
      label: 'Animar con el scroll',
      what: 'Añade animaciones ligadas al scroll que no arrastran el rendimiento ni marean a nadie.',
      when: 'Al montar una portada, un hero o cualquier sección que aparezca al bajar.',
      description:
        'Añade animaciones ligadas al scroll (apariciones, parallax, barras de progreso, secciones fijas) sin hundir el rendimiento. Úsalo al montar una portada o un hero, al querer que algo aparezca al entrar en pantalla, o cuando el usuario pida efectos de scroll.',
      body: `# Animar con el scroll

Añade la animación pedida siguiendo estas reglas. Son de rendimiento, no de
gusto: saltárselas se nota en móvil de gama media.

## Reglas

1. **Anima solo transform y opacity.** Cualquier otra propiedad provoca cálculo
   de maquetación en cada fotograma.
2. **Apariciones con IntersectionObserver**, nunca con un listener de scroll.
   Desconecta el observador al primer disparo si el elemento no vuelve a ocultarse.
3. **Si necesitas la posición exacta del scroll**, lee dentro de un
   requestAnimationFrame y no en el propio evento; guarda el último valor y
   descarta las lecturas sobrantes.
4. **Nada de listeners sin passive: true**, o el navegador espera a tu código
   antes de desplazar la página.
5. **prefers-reduced-motion obligatorio.** Con la preferencia activa, el
   contenido aparece sin movimiento: nunca invisible.
6. **Recorridos cortos.** 12 a 24px de desplazamiento y 200 a 400ms bastan. Más
   que eso se siente lento, no elegante.

## Elegir herramienta

- Aparecer, desvanecer, deslizar: CSS y IntersectionObserver, sin librería.
- React con secuencias o gestos: Framer Motion.
- Línea de tiempo compleja ligada al scroll: GSAP con ScrollTrigger.
- Suavizado del scroll: Lenis, y solo si el diseño lo pide de verdad.

Después de tocar el código, di qué se anima, con qué se ha hecho y qué pasa con
la preferencia de movimiento reducido activada.`,
    },
    en: {
      label: 'Animate on scroll',
      what: 'Adds scroll-linked animation that does not drag performance down or make anyone dizzy.',
      when: 'When building a landing page, a hero or any section that appears as you scroll.',
      description:
        'Adds scroll-linked animation (reveals, parallax, progress bars, pinned sections) without sinking performance. Use it when building a landing page or hero, when something should appear as it enters the viewport, or when the user asks for scroll effects.',
      body: `# Animate on scroll

Add the requested animation following these rules. They are about performance,
not taste: skipping them shows on a mid-range phone.

## Rules

1. **Animate transform and opacity only.** Any other property forces layout work
   on every frame.
2. **Reveals use IntersectionObserver**, never a scroll listener. Disconnect the
   observer after the first hit if the element never hides again.
3. **If you need the exact scroll position**, read it inside requestAnimationFrame
   rather than in the event itself; keep the last value and drop the extras.
4. **No listeners without passive: true**, or the browser waits for your code
   before scrolling the page.
5. **prefers-reduced-motion is mandatory.** With the preference on, content
   appears without movement: never invisible.
6. **Short travel.** 12 to 24px of movement over 200 to 400ms is plenty. More
   than that feels slow, not elegant.

## Picking a tool

- Fade, slide, reveal: CSS plus IntersectionObserver, no library.
- React with sequences or gestures: Framer Motion.
- Complex scroll-driven timeline: GSAP with ScrollTrigger.
- Smooth scrolling: Lenis, and only when the design truly calls for it.

After touching the code, say what animates, what it was built with, and what
happens when reduced motion is on.`,
    },
  },

  {
    key: 'tema-sin-parpadeo',
    group: 'web',
    name: 'tema-sin-parpadeo',
    nameEn: 'theme-no-flash',
    extra: [['allowed-tools', 'Read Edit Write Grep']],
    files: ['SKILL.md'],
    es: {
      label: 'Tema claro y oscuro',
      what: 'Monta el modo claro y oscuro que arranca en el tema del sistema y no pega el fogonazo blanco al cargar.',
      when: 'Al añadir el selector de tema, o cuando la página parpadee en blanco antes de pintarse.',
      description:
        'Monta el modo claro y oscuro respetando la preferencia del sistema, sin el fogonazo blanco al cargar y con la elección del usuario recordada. Úsalo al añadir un selector de tema, al arrancar una web nueva, o cuando la página parpadee en claro antes de pintarse en oscuro.',
      body: `# Tema claro y oscuro

Monta o arregla el cambio de tema. El fallo que hay que evitar es el parpadeo:
la página se pinta clara y medio segundo después se vuelve oscura.

## Los tres estados

El tema tiene tres estados, no dos: claro, oscuro y "el del sistema". Este
último es el valor por defecto y no se guarda como claro ni como oscuro, porque
tiene que seguir cambiando si el usuario cambia el ajuste de su ordenador.

## El orden correcto

1. Un script **síncrono** en el head, antes de cualquier hoja de estilos, lee lo
   guardado y pone el atributo en el elemento raíz. Tiene que ser inline y
   bloqueante: si es diferido, el parpadeo vuelve.
2. El CSS define la paleta completa en :root, la redefine bajo
   @media (prefers-color-scheme: dark) y otra vez bajo el atributo explícito,
   para que la elección del usuario gane en los dos sentidos.
3. El botón guarda la elección y, al volver al modo automático, borra la clave
   en lugar de escribir un valor.

## Comprobaciones

- Recargar en oscuro no debe enseñar ni un fotograma claro.
- Cambiar el tema del sistema con la web abierta y en modo automático debe
  cambiarla al vuelo.
- El body necesita color de fondo propio; sin él hereda el del navegador.
- Declara color-scheme para que los controles nativos y las barras de scroll
  acompañen al tema.`,
    },
    en: {
      label: 'Light and dark theme',
      what: 'Sets up light and dark mode that starts on the system theme and never flashes white on load.',
      when: 'When adding the theme switch, or when the page flashes light before painting.',
      description:
        'Sets up light and dark mode following the system preference, with no white flash on load and the user choice remembered. Use it when adding a theme switch, when starting a new site, or when the page flashes light before painting dark.',
      body: `# Light and dark theme

Build or fix theme switching. The failure to avoid is the flash: the page paints
light and half a second later turns dark.

## The three states

A theme has three states, not two: light, dark and "whatever the system says".
That last one is the default and must not be stored as light or dark, because it
has to keep following the user's OS setting.

## The right order

1. A **synchronous** script in the head, before any stylesheet, reads the stored
   value and sets the attribute on the root element. It must be inline and
   blocking: deferred brings the flash back.
2. The CSS defines the full palette on :root, redefines it under
   @media (prefers-color-scheme: dark), and again under the explicit attribute,
   so the user choice wins in both directions.
3. The button stores the choice and, when going back to automatic, deletes the
   key instead of writing a value.

## Checks

- Reloading in dark must not show a single light frame.
- Changing the OS theme while the page is open and set to automatic must switch
  it live.
- The body needs its own background colour; without it the browser's shows through.
- Declare color-scheme so native controls and scrollbars follow the theme.`,
    },
  },

  {
    key: 'revisar-codigo',
    group: 'codigo',
    name: 'revisar-codigo',
    nameEn: 'review-the-diff',
    extra: [
      ['allowed-tools', 'Read Grep Glob Bash(git diff:*) Bash(git log:*)'],
      ['argument-hint', '"[branch|commit]"'],
    ],
    files: ['SKILL.md'],
    es: {
      label: 'Revisar el diff',
      what: 'Revisa lo que has cambiado antes de subirlo y separa lo que rompe de lo que solo es gusto personal.',
      when: 'Antes de cada commit importante o de abrir una pull request.',
      description:
        'Revisa los cambios sin commitear o los de una rama, y devuelve los problemas ordenados por gravedad, distinguiendo lo que rompe de lo que es preferencia. Úsalo antes de un commit importante, antes de abrir una pull request, o cuando el usuario pida que le revisen el código.',
      body: `# Revisar el diff

Revisa los cambios de la rama o del rango indicado. Sin argumento, revisa lo que
haya sin commitear. Lee el archivo entero de lo que cambia, no solo el trozo del
diff: la mitad de los fallos reales están en cómo encaja con lo que ya había.

## Buscar, en este orden

1. **Corrección.** Casos límite sin cubrir: lista vacía, valor nulo, error de
   red, doble clic, respuesta que llega tarde.
2. **Estado y efectos.** Efectos sin limpiar, listeners sin quitar, dependencias
   mal declaradas, escrituras a un componente ya desmontado.
3. **Datos del usuario.** Todo lo que venga de fuera se valida antes de usarse.
   Ni claves ni tokens en el código.
4. **Contrato roto.** Firmas cambiadas sin actualizar quien las llama, campos
   renombrados sin migración.
5. **Repetición con peso.** Un patrón copiado tres veces ya es una función. Dos
   veces, todavía no.

## Cómo responder

Un hallazgo por línea, ordenados de más a menos grave, con archivo, línea y el
escenario concreto que falla ("si el usuario pulsa dos veces seguidas, la
petición se lanza dos veces"). Si no hay nada que decir, dilo en una línea.

Separa siempre lo que rompe de lo que es preferencia, y marca esto último como
opcional. No reescribas el estilo del autor.`,
    },
    en: {
      label: 'Review the diff',
      what: 'Reviews what you changed before you push it, and separates what breaks from what is just taste.',
      when: 'Before any meaningful commit or before opening a pull request.',
      description:
        'Reviews uncommitted changes or a branch and returns problems ordered by severity, telling what breaks apart from what is preference. Use it before an important commit, before opening a pull request, or when the user asks for a code review.',
      body: `# Review the diff

Review the changes in the given branch or range. With no argument, review what is
uncommitted. Read the whole file around each change, not just the diff hunk: half
the real defects live in how the change fits what was already there.

## Look for, in this order

1. **Correctness.** Uncovered edge cases: empty list, null value, network error,
   double click, response that arrives late.
2. **State and effects.** Effects without cleanup, listeners never removed,
   wrongly declared dependencies, writes to an unmounted component.
3. **User data.** Anything coming from outside is validated before use. No keys
   or tokens in the code.
4. **Broken contract.** Signatures changed without updating callers, fields
   renamed without a migration.
5. **Repetition that weighs.** A pattern copied three times is a function. Twice,
   not yet.

## How to answer

One finding per line, most to least severe, with file, line and the concrete
failing scenario ("if the user clicks twice in a row, the request fires twice").
If there is nothing to say, say it in one line.

Always separate what breaks from what is preference, and mark the latter as
optional. Do not rewrite the author's style.`,
    },
  },

  {
    key: 'depurar-de-raiz',
    group: 'codigo',
    name: 'depurar-de-raiz',
    nameEn: 'debug-to-the-root',
    extra: [['allowed-tools', 'Read Grep Glob Bash']],
    files: ['SKILL.md'],
    es: {
      label: 'Depurar de raíz',
      what: 'Encuentra la causa real de un fallo con una prueba delante, en vez de parchear el síntoma.',
      when: 'Cuando algo falla y la explicación fácil no cuadra, o el mismo fallo vuelve.',
      description:
        'Encuentra la causa real de un fallo antes de tocar nada, con una prueba que la demuestre. Úsalo cuando algo no funciona y no se sabe por qué, cuando un fallo ya arreglado vuelve, o cuando el usuario pregunte por qué algo funciona en otro sitio y en el suyo no.',
      body: `# Depurar de raíz

Un parche que esconde el síntoma cuesta más caro que el fallo, porque vuelve
disfrazado. No propongas ningún arreglo antes de tener la causa demostrada.

## Procedimiento

1. **Reproducir.** Los pasos exactos, el resultado esperado y el que sale de
   verdad. Si no se reproduce, eso es lo primero que hay que resolver.
2. **Aislar.** Reduce el caso hasta el trozo mínimo que sigue fallando. Cada
   pieza que quitas y no cambia nada, deja de ser sospechosa.
3. **Escribir la hipótesis.** Una frase concreta y comprobable. "Algo del estado"
   no vale; "el efecto se ejecuta dos veces porque la dependencia es un objeto
   nuevo en cada render" sí.
4. **Comprobarla.** Con una traza, un punto de parada o una prueba que falle. Si
   la hipótesis no aguanta, vuelve al paso 2 en lugar de retocarla.
5. **Arreglar la causa**, no el punto donde se nota. Si tocas otro sitio para
   compensar, es que la causa sigue ahí.
6. **Dejar la prueba** que falla antes del arreglo y pasa después.

## Cuando la comparación es "allí sí funciona"

Si algo va en otra web o en otro equipo, la diferencia está en el entorno, no en
la lógica. Compara versiones, permisos del navegador, banderas, variables de
entorno y cabeceras. Descarga el HTML del sitio que funciona y míralo: la
respuesta suele estar escrita ahí.

Al terminar, di en dos frases cuál era la causa y cómo se demostró. Si no la
encontraste, dilo claro: una suposición vendida como diagnóstico hace perder más
tiempo que un "no lo sé".`,
    },
    en: {
      label: 'Debug to the root',
      what: 'Finds the real cause of a bug with proof in hand, instead of patching the symptom.',
      when: 'When something fails and the easy explanation does not add up, or the same bug comes back.',
      description:
        'Finds the real cause of a bug before touching anything, with evidence that proves it. Use it when something does not work and nobody knows why, when a fixed bug returns, or when the user asks why something works elsewhere but not for them.',
      body: `# Debug to the root

A patch that hides the symptom costs more than the bug, because it comes back in
disguise. Do not propose a fix before the cause is proven.

## Procedure

1. **Reproduce.** The exact steps, the expected result and the real one. If it
   does not reproduce, that is the first thing to solve.
2. **Isolate.** Shrink the case to the smallest piece that still fails. Every
   part you remove without changing the outcome stops being a suspect.
3. **Write the hypothesis.** One concrete, checkable sentence. "Something with
   the state" does not count; "the effect runs twice because the dependency is a
   new object on every render" does.
4. **Test it.** With a log line, a breakpoint or a failing test. If the
   hypothesis does not hold, go back to step 2 instead of tweaking it.
5. **Fix the cause**, not the place where it shows. If you have to touch a second
   spot to compensate, the cause is still there.
6. **Leave the test** that fails before the fix and passes after it.

## When the comparison is "it works over there"

If something works on another site or another machine, the difference is in the
environment, not the logic. Compare versions, browser permissions, flags,
environment variables and headers. Download the HTML of the site that works and
read it: the answer is usually written right there.

When you finish, say in two sentences what the cause was and how it was proven.
If you did not find it, say so plainly: a guess sold as a diagnosis wastes more
time than an honest "I do not know".`,
    },
  },

  {
    key: 'refactor-seguro',
    group: 'codigo',
    name: 'refactor-seguro',
    nameEn: 'safe-refactor',
    extra: [['allowed-tools', 'Read Edit Grep Glob Bash']],
    files: ['SKILL.md'],
    es: {
      label: 'Refactor sin romper',
      what: 'Reordena el código en pasos pequeños y verificables, sin colar cambios de comportamiento por el camino.',
      when: 'Cuando un archivo se ha hecho grande o vas a tocar algo que da miedo.',
      description:
        'Reordena código existente en pasos pequeños y verificables, sin cambiar el comportamiento. Úsalo cuando un archivo se haya vuelto difícil de leer, antes de añadir una función sobre código enredado, o cuando el usuario pida limpiar o reorganizar algo.',
      body: `# Refactor sin romper

Refactorizar es cambiar la forma sin cambiar el comportamiento. En cuanto se
mezclan las dos cosas, ya no se sabe qué rompió qué.

## Antes de tocar nada

- Comprueba que hay forma de verificar: pruebas, un comando que compile o una
  pantalla que se pueda mirar. Si no hay ninguna, crea la mínima primero.
- Anota qué hace hoy el código, incluidos los comportamientos raros. Algunos de
  esos son un fallo; otros son la razón de que algo funcione.

## Durante

- Un cambio por paso, y verificar entre paso y paso: renombrar, extraer, mover.
  Nunca los tres a la vez.
- Nada de cambios de comportamiento a escondidas. Si encuentras un fallo por el
  camino, apúntalo y arréglalo aparte.
- Extraer una función solo cuando le puedas poner un nombre honesto. Si el mejor
  nombre que se te ocurre es hacerCosas, todavía no está clara.
- No renombres por gusto en archivos que no estás tocando: infla el diff y
  esconde lo importante.

## Al terminar

Di qué se movió y qué se comprobó para saber que no se rompió nada. Si algo
quedó a medias, dilo como a medias.`,
    },
    en: {
      label: 'Refactor without breaking',
      what: 'Reshapes code in small verifiable steps, without sneaking behaviour changes along the way.',
      when: 'When a file has grown unwieldy or you are about to touch something scary.',
      description:
        'Reshapes existing code in small verifiable steps without changing behaviour. Use it when a file has become hard to read, before adding a feature on top of tangled code, or when the user asks to clean up or reorganise something.',
      body: `# Refactor without breaking

Refactoring means changing shape without changing behaviour. The moment the two
get mixed, nobody can tell what broke what.

## Before touching anything

- Make sure there is a way to verify: tests, a build command, or a screen you can
  look at. If there is none, create the smallest one first.
- Write down what the code does today, odd behaviours included. Some of those are
  bugs; others are the reason something works.

## While working

- One change per step, verifying between steps: rename, extract, move. Never all
  three at once.
- No silent behaviour changes. If you find a bug on the way, note it and fix it
  separately.
- Extract a function only when you can give it an honest name. If the best name
  you can think of is doStuff, it is not clear yet.
- Do not rename things for taste in files you are not touching: it inflates the
  diff and hides what matters.

## When you finish

Say what moved and what you checked to know nothing broke. If something was left
half done, say it is half done.`,
    },
  },

  {
    key: 'pruebas-que-importan',
    group: 'codigo',
    name: 'pruebas-que-importan',
    nameEn: 'tests-that-matter',
    extra: [['allowed-tools', 'Read Write Edit Grep Glob Bash']],
    files: ['SKILL.md'],
    es: {
      label: 'Pruebas que importan',
      what: 'Escribe pruebas de lo que puede romperse de verdad, en vez de perseguir un porcentaje de cobertura.',
      when: 'Al cerrar una funcionalidad, o después de arreglar un fallo para que no vuelva.',
      description:
        'Escribe pruebas centradas en lo que puede fallar de verdad, no en subir la cobertura. Úsalo al terminar una funcionalidad, después de arreglar un fallo para que no vuelva, o cuando el usuario pida añadir tests.',
      body: `# Pruebas que importan

La cobertura mide líneas ejecutadas, no fallos evitados. Escribe las pruebas que
te habrían avisado del último fallo que se coló.

## Qué probar

- **Los bordes.** Vacío, uno, muchos, negativo, nulo, texto larguísimo, emoji.
- **Los caminos de error.** La red falla, el archivo no existe, la respuesta llega
  con otro formato.
- **Las reglas del negocio.** Lo que le importa a quien usa la aplicación, no a
  quien la programa.
- **Cada fallo arreglado.** Antes del arreglo, una prueba que falle.

## Qué no probar

- Que la librería de terceros hace lo que promete.
- Getters y setters sin lógica.
- El detalle interno de una función privada: prueba lo que se ve desde fuera, o
  cualquier refactor te romperá la suite sin motivo.

## Cómo escribirlas

Un nombre que diga el caso, no la función: "devuelve lista vacía cuando no hay
resultados". Preparar, ejecutar, comprobar, con una línea en blanco entre las
tres partes. Una afirmación por concepto. Nada de lógica dentro de la prueba: si
la prueba necesita un if, la prueba necesita partirse en dos.

Antes de dar por buena una prueba, rómpela a propósito y comprueba que falla. Una
prueba que pasa siempre no está probando nada.`,
    },
    en: {
      label: 'Tests that matter',
      what: 'Writes tests for what can actually break, instead of chasing a coverage number.',
      when: 'When wrapping up a feature, or right after fixing a bug so it cannot come back.',
      description:
        'Writes tests focused on what can really fail, not on raising coverage. Use it when finishing a feature, after fixing a bug so it never returns, or when the user asks to add tests.',
      body: `# Tests that matter

Coverage measures executed lines, not prevented failures. Write the tests that
would have caught the last bug that slipped through.

## What to test

- **The edges.** Empty, one, many, negative, null, very long text, emoji.
- **The error paths.** The network fails, the file is missing, the response comes
  back in another shape.
- **The business rules.** What matters to whoever uses the app, not to whoever
  wrote it.
- **Every fixed bug.** Before the fix, a test that fails.

## What not to test

- That the third-party library does what it promises.
- Getters and setters with no logic.
- The internals of a private function: test what is visible from outside, or any
  refactor will break your suite for no reason.

## How to write them

A name that states the case, not the function: "returns an empty list when there
are no results". Arrange, act, assert, with a blank line between the three parts.
One assertion per concept. No logic inside the test: if a test needs an if, the
test needs splitting in two.

Before trusting a test, break it on purpose and check that it fails. A test that
always passes is testing nothing.`,
    },
  },

  {
    key: 'finito',
    group: 'flujo',
    name: 'finito',
    nameEn: 'finito',
    repo: 'https://github.com/Mun1to/Finito',
    plugin: 'finito@vibeset',
    files: ['SKILL.md'],
    es: {
      label: 'Finito',
      what: 'Cierra la sesión con un resumen que se entiende y un bloque de traspaso con el que la siguiente sigue sin releer nada.',
      when: 'Al terminar de trabajar, antes de cerrar la conversación o antes de compactarla.',
      description:
        'Cierra una sesión de trabajo con un resumen entendible, los próximos pasos, el estado real del repositorio y un bloque de traspaso listo para pegar en la sesión siguiente o después de compactar. Úsalo al terminar de trabajar, cuando el usuario diga que lo deja por hoy, que va a compactar, o que le resumas lo que habéis hecho.',
      body: `# Finito

Una sesión termina dos veces. Primero para la persona, que cierra el portátil y
necesita saber en treinta segundos qué pasó y qué toca ahora. Después para el
siguiente agente, que mañana abre un contexto en blanco y no sabe nada de hoy.

Casi todos los cierres solo sirven al primero. Por eso la sesión siguiente empieza
releyendo archivos, repreguntando lo que ya se contestó y repitiendo un fallo que
ya se pagó una vez. El contexto se fue, pero el trabajo del que salió sigue ahí.

## Antes de escribir nada

Repasa la conversación desde el último cierre y ejecuta git status y git log. El
cierre tiene que reflejar lo que de verdad pasó, no lo que se recuerda por encima:
la memoria de una sesión larga es optimista y confunde intenciones con resultados.

Lo que quedó a medias se cuenta como a medias. Lo que no se ejecutó no está
verificado. Y si un plan se abandonó a mitad, se dice y se dice por qué: eso es lo
más valioso que hereda la sesión siguiente.

## Lo que solo sabe esta sesión

Hay cosas de hoy que no están en ningún sitio salvo en esta conversación, y
desaparecen con ella. Antes de responder, guárdalas donde sobrevivan: en los
documentos del proyecto y en la memoria persistente del agente, si la tiene. Solo
lo que falte, y actualizando lo que ya exista en vez de duplicarlo.

No guardes lo que el repositorio ya registra. El código y los commits ya están
escritos: esto es para lo que no se puede deducir de ellos. Si no hay nada nuevo
que guardar, se dice y ya.

## El formato de la respuesta

1. **Una frase** con lo esencial de la sesión.
2. **Resumen**, en orden, máximo ocho puntos. Frases simples y sin jerga: se lee
   en el móvil.
3. **Próximos pasos**, máximo cinco, el más importante primero.
4. **Qué se dejó apuntado**, en una línea.
5. **El bloque de traspaso.**

## El bloque de traspaso

Va dentro de un bloque de código, para copiarlo de un clic y pegarlo al compactar
o al abrir la sesión siguiente. Lleva cinco partes: el contexto del proyecto y sus
normas no negociables; lo hecho en orden, con las rutas exactas y el porqué de
cada decisión; el estado real, con la rama, lo que quedó sin commitear y lo que
siga corriendo; lo que queda abierto, cada cosa con el dato para retomarla sin
releer nada; y las trampas del día.

La prueba es simple: ¿podría el siguiente agente continuar solo con este bloque?
Si un detalle hace falta para seguir, entra.

Las trampas son la parte que todo el mundo se salta y la única que se paga sola.
Un fallo ya resuelto, resuelto otra vez desde cero, es lo más caro que tiene un
proyecto largo.

## Reglas

- Proporción: una sesión de veinte minutos tiene un cierre de veinte minutos.
- No des por hecho lo que no se hizo ni por verificado lo que no se ejecutó.
- Nunca hagas commit ni push por tu cuenta al cerrar. Recuérdalo y pregunta.
- Los números, las versiones y las rutas van completos en las dos mitades.`,
    },
    en: {
      label: 'Finito',
      what: 'Closes the session with a summary you can read and a handoff block the next session resumes from without re-reading anything.',
      when: 'When you stop working, before closing the conversation or before compacting it.',
      description:
        'Closes a working session with a readable summary, the next steps, the real state of the repository and a handoff block ready to paste into the next session or after compacting. Use it when you stop working, when the user says they are done for today, that they are about to compact, or asks for a summary of what you did.',
      body: `# Finito

A session ends twice. First for the person, who closes the laptop and needs to know
in thirty seconds what happened and what comes next. Then for the next agent, who
opens a blank context tomorrow and knows nothing about today.

Most closings only serve the first reader. That is why the next session starts by
re-reading files, re-asking questions already answered, and repeating a mistake
that was already paid for once. The context is gone, but the work it came from is
still there.

## Before writing a single line

Go back over the conversation since the last close and run git status and git log.
The closing has to reflect what actually happened, not what you vaguely remember:
the memory of a long session is optimistic and mistakes intentions for outcomes.

Anything half finished is reported as half finished. Anything not run is not
verified. And if a plan was abandoned midway, say so and say why: that is the most
valuable thing the next session can inherit.

## What only this session knows

Some of what happened today lives nowhere but in this conversation, and disappears
with it. Before answering, put it where it survives: in the project documents, and
in the agent's persistent memory if it has one. Only what is missing, updating what
already exists instead of duplicating it.

Do not save what the repository already records. Code and commits are already
written down: this is for what cannot be worked out from them. If there is nothing
new worth saving, say so and move on.

## The shape of the answer

1. **One sentence** with the essence of the session.
2. **Summary**, in order, eight points maximum. Simple sentences, no jargon: it
   gets read on a phone.
3. **Next steps**, five maximum, most important first.
4. **What got written down**, in one line.
5. **The handoff block.**

## The handoff block

It goes inside a code block, so it can be copied in one click and pasted when
compacting or when opening the next session. It carries five parts: the project
context and its non-negotiable conventions; what was done, in order, with exact
paths and the reason behind each decision; the real state, with the branch, what is
uncommitted and whatever is still running; what is left open, each item with the
detail needed to resume without re-reading anything; and the day's gotchas.

The test is simple: could the next agent carry on with this block alone? If a
detail is needed to continue, it goes in.

The gotchas are the part everybody skips and the only one that pays for itself. A
bug already solved, solved again from scratch, is the most expensive thing in a
long project.

## Rules

- Proportion: a twenty minute session gets a twenty minute closing.
- Do not assume work that was not done or call verified what was never run.
- Never commit or push on your own when closing. Mention it and ask.
- Numbers, versions and paths go in full in both halves of the closing.`,
    },
  },

  {
    key: 'plan-antes-de-codigo',
    group: 'flujo',
    name: 'plan-antes-de-codigo',
    nameEn: 'plan-before-code',
    extra: [['allowed-tools', 'Read Grep Glob'], ['disallowed-tools', 'Edit Write']],
    files: ['SKILL.md'],
    es: {
      label: 'Plan antes del código',
      what: 'Convierte una petición vaga en un plan corto y discutible antes de escribir la primera línea.',
      when: 'Cuando el encargo toca varios archivos o no está claro por dónde empezar.',
      description:
        'Convierte una petición amplia o vaga en un plan corto y discutible antes de escribir código. Úsalo cuando el trabajo toque varios archivos, cuando haya más de una forma razonable de hacerlo, o cuando no esté claro por dónde empezar.',
      body: `# Plan antes del código

Escribir código es la parte barata. Lo caro es escribirlo dos veces porque el
encargo no se entendió.

## Antes de planificar

Lee lo que ya existe. La mayoría de las decisiones ya están tomadas en el
repositorio: sigue sus patrones en vez de traer los tuyos. Busca si el problema
ya está resuelto en otro sitio del mismo proyecto.

## El plan

- **Qué se va a construir**, en una frase, con las palabras de quien lo pidió.
- **Qué archivos se tocan** y qué le pasa a cada uno.
- **Qué se decide**: cada punto donde había varias opciones, con la elegida y el
  motivo en media línea. Recomienda una, no des un catálogo.
- **Qué queda fuera**, para que nadie lo dé por incluido.
- **Cómo se comprueba** que funciona.

## Reglas

- Máximo una página. Si no cabe, el trabajo es demasiado grande para un solo paso.
- Solo pregunta cuando dos lecturas del encargo llevarían a trabajos distintos.
  El resto de dudas se resuelven eligiendo y diciendo qué elegiste.
- Nada de código todavía. El plan se aprueba primero.`,
    },
    en: {
      label: 'Plan before code',
      what: 'Turns a vague request into a short, arguable plan before the first line gets written.',
      when: 'When the job touches several files or it is not obvious where to start.',
      description:
        'Turns a broad or vague request into a short, arguable plan before any code is written. Use it when the work touches several files, when there is more than one reasonable approach, or when it is not clear where to start.',
      body: `# Plan before code

Writing code is the cheap part. The expensive part is writing it twice because the
request was misread.

## Before planning

Read what already exists. Most decisions are already made in the repository:
follow its patterns instead of importing your own. Check whether the problem is
already solved elsewhere in the same project.

## The plan

- **What gets built**, in one sentence, in the words of whoever asked for it.
- **Which files change** and what happens to each of them.
- **What gets decided**: every point with more than one option, the one chosen and
  the reason in half a line. Recommend one, do not hand over a catalogue.
- **What is out of scope**, so nobody assumes it is included.
- **How it gets verified**.

## Rules

- One page maximum. If it does not fit, the work is too big for one step.
- Only ask when two readings of the request would lead to different work.
  Everything else is settled by choosing and saying what you chose.
- No code yet. The plan gets approved first.`,
    },
  },

  {
    key: 'commit-limpio',
    group: 'escritura',
    name: 'commit-limpio',
    nameEn: 'clean-commit',
    extra: [['allowed-tools', 'Bash(git diff:*) Bash(git log:*) Bash(git status:*)'], ['disable-model-invocation', 'true']],
    files: ['SKILL.md'],
    es: {
      label: 'Commit limpio',
      what: 'Escribe el mensaje del commit mirando el diff, contando el porqué y no repitiendo lo que ya dice el código.',
      when: 'Cada vez que vayas a commitear.',
      description:
        'Escribe el mensaje de un commit a partir del diff real, contando por qué cambió algo y no solo qué. Úsalo cada vez que se vaya a commitear o cuando el usuario pida un mensaje de commit.',
      body: `# Commit limpio

Lee el diff completo antes de escribir. Un mensaje escrito de memoria describe la
intención, no el cambio.

## El mensaje

- **Primera línea**: hasta 72 caracteres, en imperativo y en presente. Dice qué
  hace el commit, no qué hiciste tú.
- **Línea en blanco**, y luego el porqué: qué problema resuelve, qué se descartó
  y por qué. El qué ya está en el diff; el porqué solo está en tu cabeza.
- **Sin relleno**: nada de "varios cambios" ni "arreglos menores".
- **El idioma del repositorio.** Míralo en git log antes de decidir.

## Antes de commitear

- Un commit, una idea. Si el mensaje necesita un "y", probablemente son dos.
- Que no se cuelen archivos de configuración local, claves, ni sobras de depuración.
- Sigue el estilo que ya tiene el historial: si usa prefijos tipo feat o fix,
  úsalos; si no los usa, no los introduzcas tú.

Nunca hagas commit sin que te lo pidan, y nunca hagas push sin permiso explícito.`,
    },
    en: {
      label: 'Clean commit',
      what: 'Writes the commit message from the actual diff, telling the why and not repeating what the code already says.',
      when: 'Every time you are about to commit.',
      description:
        'Writes a commit message from the real diff, explaining why something changed and not only what. Use it whenever a commit is about to be made or when the user asks for a commit message.',
      body: `# Clean commit

Read the full diff before writing. A message written from memory describes the
intention, not the change.

## The message

- **First line**: up to 72 characters, imperative and present tense. It says what
  the commit does, not what you did.
- **Blank line**, then the why: what problem it solves, what was ruled out and
  why. The what is already in the diff; the why lives only in your head.
- **No filler**: never "various changes" or "minor fixes".
- **The repository's language.** Check git log before deciding.

## Before committing

- One commit, one idea. If the message needs an "and", it is probably two.
- Make sure no local config, keys or leftover debugging slipped in.
- Follow the style the history already has: if it uses prefixes like feat or fix,
  use them; if it does not, do not introduce them.

Never commit unasked, and never push without explicit permission.`,
    },
  },

  {
    key: 'readme-vivo',
    group: 'escritura',
    name: 'readme-vivo',
    nameEn: 'readme-that-works',
    extra: [['allowed-tools', 'Read Write Edit Grep Glob']],
    files: ['SKILL.md', 'plantillas/readme.md'],
    es: {
      label: 'README que sirve',
      what: 'Escribe el README desde el código real, para que alguien nuevo arranque el proyecto sin preguntar nada.',
      when: 'Al publicar un repositorio, o cuando el que hay ya no se parece al proyecto.',
      description:
        'Escribe o actualiza el README a partir del código real, para que alguien nuevo pueda arrancar el proyecto sin preguntar. Úsalo al publicar un repositorio, al abrirlo a otras personas, o cuando el README existente ya no se parezca al proyecto.',
      body: `# README que sirve

El README se escribe leyendo el proyecto, no imaginándolo. Antes de redactar,
mira los scripts del gestor de paquetes, el archivo de configuración, las
variables de entorno de ejemplo y cómo se despliega.

## Estructura

1. **Qué es**, en dos frases, sin adjetivos de marketing.
2. **Arrancarlo**: los comandos exactos, en orden, desde un clon limpio. Si hacen
   falta variables de entorno, dilas todas y de dónde se sacan.
3. **Cómo está organizado**: las cuatro o cinco carpetas que importan, una línea
   cada una. No un árbol de directorios entero.
4. **Cómo se despliega**, si aplica.
5. **Cómo contribuir**, si el proyecto está abierto.

## Reglas

- Cada comando que escribas tiene que haberse ejecutado. Un README con un comando
  que falla es peor que no tener README.
- Nada de secciones vacías puestas por costumbre.
- Nada de capturas de pantalla que caducan en cuanto se toca el diseño.
- Si algo no está hecho, se dice que no está hecho, en su sitio.

Al terminar, di qué partes se verificaron ejecutándolas y cuáles se dan por
buenas sin probar.`,
    },
    en: {
      label: 'A README that works',
      what: 'Writes the README from the real code, so a newcomer can start the project without asking anything.',
      when: 'When publishing a repository, or when the current one no longer matches the project.',
      description:
        'Writes or updates the README from the real code, so a newcomer can start the project without asking. Use it when publishing a repository, when opening it to other people, or when the existing README no longer matches the project.',
      body: `# A README that works

A README is written by reading the project, not by imagining it. Before drafting,
look at the package scripts, the config file, the example environment variables
and how the thing is deployed.

## Structure

1. **What it is**, in two sentences, without marketing adjectives.
2. **How to run it**: the exact commands, in order, from a clean clone. If
   environment variables are needed, list all of them and where they come from.
3. **How it is organised**: the four or five folders that matter, one line each.
   Not a full directory tree.
4. **How it is deployed**, if that applies.
5. **How to contribute**, if the project is open.

## Rules

- Every command you write must have been run. A README with a failing command is
  worse than no README.
- No empty sections added out of habit.
- No screenshots that expire the moment the design changes.
- If something is not built, say it is not built, right where it belongs.

When you finish, say which parts were verified by running them and which are
assumed good without testing.`,
    },
  },

  {
    key: 'diretto',
    group: 'escritura',
    name: 'diretto',
    nameEn: 'diretto',
    repo: 'https://github.com/Mun1to/Diretto',
    plugin: 'diretto@vibeset',
    files: ['SKILL.md'],
    es: {
      label: 'Diretto',
      what: 'Obliga al agente a contestar en pasos numerados que puedes ejecutar, sin relleno y sin jerga sin explicar.',
      when: 'Cuando estés harto de leer párrafos para encontrar el único comando que necesitabas.',
      description:
        'Formato de respuesta directo, completo y enumerado: veredicto en una frase, lista numerada de acciones con una sola frase por punto, verbo al principio, ruta o comando exacto, y una lista aparte de lo que falta. Úsalo cuando el usuario diga "dímelo directo", "sin rodeos", "enuméramelo", "ve al grano" o "solo dime qué tengo que hacer".',
      body: `# Diretto

Quien activa este modo no quiere leer párrafos, quiere ejecutar pasos. Directo no
significa corto, significa que no sobra nada.

## La estructura

Cuatro bloques como mucho, en este orden. El bloque que no tenga contenido real se
omite, nunca se rellena para que aparezca.

1. **Veredicto**: una sola frase con qué pasa o qué se ha decidido, sin título.
2. **Qué tienes que hacer**: lista numerada de acciones.
3. **Qué falta**: lo que bloquea, lo que no se sabe o lo que depende del usuario.
4. **Riesgos**: solo si algo se puede romper, perder o costar dinero.

Nada antes del veredicto y nada después del último bloque.

## Cada punto

- Una sola frase. Si hacen falta dos, son dos puntos.
- Empieza por un verbo en imperativo: abre, corre, borra, comprueba, decide.
- El dato exacto va dentro del propio punto: la ruta completa, el comando literal,
  el número de línea. Nunca "en el archivo de configuración".
- Los comandos, en formato de código y listos para copiar, sin el símbolo del
  intérprete delante.
- Todo tecnicismo lleva su explicación en la misma frase, entre paréntesis y en
  palabras llanas.
- Diez puntos por lista como máximo. Si hay más, se parten en bloques con título.

## Lo que se borra siempre

Preámbulos ("perfecto", "buena pregunta", "te comento"), cierres ("espero que te
sirva", "avísame si necesitas algo"), adjetivos de venta (robusto, potente,
elegante), coletillas vacías ("básicamente", "en cierto modo"), narrar herramientas
("voy a leer el archivo"), y los catálogos de alternativas: se recomienda una.

## Lo que no se recorta nunca

La brevedad sale del relleno, jamás del contenido. Van enteros los pasos (si son
nueve, son nueve, aunque tres parezcan obvios), los números y las versiones, las
rutas, las negaciones (no, nunca, solo, excepto), los bloques de código y los
avisos de que algo se puede perder. Si al comprimir desaparece un paso, la
respuesta está mal.

## Lo que no se sabe

Un hueco nunca se tapa con una suposición escrita como si fuera un hecho. Va un
punto en "Qué falta" con dos cosas: qué se necesita saber y cómo se comprueba.

## La crítica va primero

Si el plan tiene un fallo o un riesgo, eso es el veredicto y va en la primera
frase, no en una nota al final.

## Cuándo no se aplica

Ante una pregunta de sí o no se contesta con la palabra y, como mucho, una frase de
por qué. Si piden entender un concepto desde cero, manda la explicación en prosa
corta. Y dentro de un bloque de código, un documento o un texto para terceros manda
el formato de ese artefacto, no este.`,
    },
    en: {
      label: 'Diretto',
      what: 'Forces the agent to answer in numbered steps you can execute, with no filler and no unexplained jargon.',
      when: 'When you are tired of reading paragraphs to find the one command you needed.',
      description:
        'A direct, complete, enumerated answer format: a one-sentence verdict, a numbered list of actions with one sentence per item, a verb up front, the exact path or command, and a separate list of what is still missing. Use it when the user says "just tell me what to do", "no fluff", "give me the steps" or "get to the point".',
      body: `# Diretto

Whoever turns this on does not want to read paragraphs, they want to execute steps.
Direct does not mean short, it means nothing is left over.

## The structure

Four blocks at most, in this order. A block with no real content is dropped, never
padded so that it shows up.

1. **Verdict**: one sentence saying what is happening or what was decided, no heading.
2. **What you have to do**: a numbered list of actions.
3. **What is missing**: what blocks, what is unknown, what depends on the user.
4. **Risks**: only if something can break, be lost, or cost money.

Nothing before the verdict, nothing after the last block.

## Every item

- One sentence. If two are needed, that is two items.
- Start with a verb in the imperative: open, run, delete, check, decide.
- The exact detail lives inside the item: the full path, the literal command, the
  line number. Never "in the config file".
- Commands go in code format, ready to copy, without the shell prompt in front.
- Every technical term gets a plain-words explanation in the same sentence, in
  brackets.
- Ten items per list, maximum. Beyond that, split into blocks with a heading.

## Always deleted

Preambles ("great question", "let me explain"), sign-offs ("hope this helps", "let
me know if you need anything"), sales adjectives (robust, powerful, elegant), empty
hedges ("basically", "in a sense"), narrating tool calls ("let me read the file"),
and catalogues of alternatives: recommend one.

## Never cut

Brevity comes out of the filler, never out of the content. Kept whole: the steps
(if there are nine, there are nine, even if three look obvious), the numbers and
versions, the paths, the negations (no, never, only, except), the code blocks, and
any warning that something can be lost. If compressing makes a step disappear, the
answer is wrong.

## What you do not know

A gap is never filled with a guess written as if it were a fact. It becomes an item
under "What is missing", with what needs to be known and how to check it.

## Problems first

If the plan has a flaw or a risk, that is the verdict and it goes in the first
sentence, not in a footnote.

## When it does not apply

A yes or no question gets the word itself and, at most, one sentence of why. If the
user asks to understand a concept from scratch, the explanation wins, in short
prose. And inside a code block, a document, or text meant for a third party, that
artefact's format wins, not this one.`,
    },
  },
]

// El frontmatter se escribe como YAML: las descripciones largas van en bloque
// plegado (>-) porque una sola línea de 300 caracteres no hay quien la lea.
function valorYaml(texto, sangria = '  ') {
  if (texto.length <= 78 && !texto.includes(': ')) return texto
  const palabras = texto.split(' ')
  const lineas = []
  let actual = ''
  for (const p of palabras) {
    if ((actual + ' ' + p).trim().length > 88) { lineas.push(actual.trim()); actual = p }
    else actual += ' ' + p
  }
  if (actual.trim()) lineas.push(actual.trim())
  return '>-\n' + lineas.map((l) => sangria + l).join('\n')
}

// El nombre de la carpeta es lo que se escribe para llamar a la skill, así que
// también se traduce: en inglés no tiene sentido teclear /depurar-de-raiz.
export const slugOf = (item, lang) => (lang === 'en' && item.nameEn) || item.name

// Devuelve el SKILL.md completo, listo para pegar en un archivo.
export function skillFile(item, lang) {
  const d = item[lang]
  const lineas = ['---', `name: ${slugOf(item, lang)}`, `description: ${valorYaml(d.description)}`]
  for (const [clave, valor] of item.extra || []) lineas.push(`${clave}: ${valor}`)
  lineas.push('---', '', d.body.trim(), '')
  return lineas.join('\n')
}

export const skillPath = (item, ambito, lang) =>
  ambito === 'proyecto'
    ? `.claude/skills/${slugOf(item, lang)}/SKILL.md`
    : `~/.claude/skills/${slugOf(item, lang)}/SKILL.md`

// Árbol de la carpeta, tal y como queda en disco.
export function skillTree(item, lang) {
  const raiz = `${slugOf(item, lang)}/`
  const hijos = item.files.map((f, i, arr) => {
    const rama = i === arr.length - 1 ? '└── ' : '├── '
    return rama + f
  })
  return [raiz, ...hijos].join('\n')
}
