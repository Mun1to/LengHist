// Generado desde el index.html de producción — 41 conceptos reales
export const CONCEPTS = [
 {
  "key": "scroll",
  "color": "var(--tono-indigo)",
  "label": {
   "es": "Scroll interactivo",
   "en": "Interactive scroll"
  },
  "items": [
   {
    "name": "Smooth scroll",
    "tag": "Lenis",
    "es": {
     "what": "Scroll con inercia y suavizado que hace que la página se sienta fluida y premium.",
     "use": "Cimiento de casi todo efecto de scroll; da esa sensación de mantequilla."
    },
    "en": {
     "what": "Scroll with inertia and easing that makes the page feel fluid and premium.",
     "use": "Foundation of almost every scroll effect; gives that buttery feel."
    },
    "prompt": {
     "es": "Añade smooth scroll con Lenis a esta página. Instálalo, arráncalo en el punto de entrada y engancha su bucle a requestAnimationFrame. No toques el CSS de scroll-behavior ni rompas los enlaces de ancla: comprueba que un enlace a #seccion sigue llevando ahí. Respeta prefers-reduced-motion apagando la inercia.",
     "en": "Add Lenis smooth scroll to this page. Install it, start it at the entry point and hook its loop to requestAnimationFrame. Do not touch scroll-behavior in CSS and do not break anchor links: check that a link to #section still gets there. Respect prefers-reduced-motion by turning the inertia off."
    },
    "vistoEn": {
     "sitio": "lenis.darkroom.engineering",
     "url": "https://lenis.darkroom.engineering",
     "prueba": "lenis",
     "visto": "2026-08-21",
     "es": "la web de la propia librería, movida con Lenis",
     "en": "the library home page, running on Lenis"
    }
   },
   {
    "name": "Parallax",
    "tag": "CSS · JS",
    "es": {
     "what": "Capas que se mueven a distinta velocidad al hacer scroll, creando sensación de profundidad.",
     "use": "Heros inmersivos y storytelling visual."
    },
    "en": {
     "what": "Layers moving at different speeds while scrolling, creating a sense of depth.",
     "use": "Immersive heroes and visual storytelling."
    },
    "prompt": {
     "es": "Haz que el fondo de esta sección se mueva más lento que el contenido al hacer scroll. Usa transform: translate3d y nunca top ni background-position, que fuerzan recálculo. Que la amplitud sea de pocos píxeles, no de media pantalla, y que se apague con prefers-reduced-motion.",
     "en": "Make this section background move slower than the content on scroll. Use transform: translate3d, never top or background-position, which force a relayout. Keep the amplitude to a few pixels, not half the screen, and turn it off under prefers-reduced-motion."
    }
   },
   {
    "name": "Scroll Snap",
    "tag": "CSS",
    "es": {
     "what": "El scroll encaja automáticamente en cada sección o slide (scroll-snap-type).",
     "use": "Presentaciones a pantalla completa, carruseles y secciones tipo diapositiva."
    },
    "en": {
     "what": "Scrolling snaps automatically to each section or slide (scroll-snap-type).",
     "use": "Full-screen presentations, carousels and slide-like sections."
    },
    "prompt": {
     "es": "Convierte estas secciones en diapositivas que encajen al hacer scroll, con CSS puro: scroll-snap-type en el contenedor y scroll-snap-align en cada hija. Usa proximity y no mandatory si el contenido de una sección puede ser más alto que la pantalla, porque si no se queda gente sin poder leer el final.",
     "en": "Turn these sections into slides that snap on scroll, in plain CSS: scroll-snap-type on the container and scroll-snap-align on each child. Use proximity rather than mandatory if a section can be taller than the screen, otherwise people cannot reach the bottom of it."
    },
    "vistoEn": {
     "sitio": "stripe.com",
     "url": "https://stripe.com",
     "prueba": "scroll-snap-type",
     "visto": "2026-08-21",
     "es": "los carruseles de su portada encajan con scroll-snap",
     "en": "its homepage carousels snap with scroll-snap"
    }
   },
   {
    "name": "Scroll-driven animations",
    "tag": "CSS scroll()/view()",
    "es": {
     "what": "Animaciones atadas al progreso del scroll, ya nativas en CSS sin necesidad de JS.",
     "use": "Barras de progreso, reveals y parallax ligero con 0 KB."
    },
    "en": {
     "what": "Animations tied to scroll progress, now native in CSS with no JS needed.",
     "use": "Progress bars, reveals and light parallax at 0 KB."
    },
    "prompt": {
     "es": "Ata esta animación al progreso del scroll con CSS nativo: animation-timeline con scroll() o view(), sin JavaScript. Deja una alternativa para los navegadores que no lo soportan con @supports (animation-timeline: view()), y que sin soporte el elemento se vea igual pero quieto.",
     "en": "Tie this animation to scroll progress with native CSS: animation-timeline with scroll() or view(), no JavaScript. Leave a fallback for browsers without support using @supports (animation-timeline: view()), and make sure the element still looks right, just static, when unsupported."
    },
    "vistoEn": {
     "sitio": "stripe.com",
     "url": "https://stripe.com",
     "prueba": "animation-timeline",
     "visto": "2026-08-21",
     "es": "anima con animation-timeline, sin JavaScript de scroll",
     "en": "animates with animation-timeline, no scroll JavaScript"
    }
   },
   {
    "name": "Scroll reveal",
    "tag": "IntersectionObserver",
    "es": {
     "what": "Elementos que aparecen o se animan al entrar en el viewport.",
     "use": "Revelar secciones al bajar; con stagger (retardo escalonado) queda muy elegante."
    },
    "en": {
     "what": "Elements that appear or animate as they enter the viewport.",
     "use": "Reveal sections on scroll; with stagger it looks very elegant."
    },
    "vistoEn": {
     "sitio": "awwwards.com",
     "url": "https://www.awwwards.com",
     "prueba": "IntersectionObserver",
     "visto": "2026-08-21",
     "es": "las tarjetas aparecen al entrar en pantalla, con IntersectionObserver y no con un listener de scroll",
     "en": "cards appear as they enter the viewport, with IntersectionObserver rather than a scroll listener"
    },
    "prompt": {
     "es": "Haz que estos bloques aparezcan al entrar en pantalla, con IntersectionObserver y no con un listener de scroll. Que cada elemento se anime una sola vez y luego deje de observarse. Importante: el contenido tiene que estar en el HTML y visible por defecto, y que la animación solo lo esconda si hay JavaScript, para que no desaparezca en un buscador.",
     "en": "Make these blocks appear as they enter the viewport, with IntersectionObserver rather than a scroll listener. Animate each element once and then stop observing it. Important: the content must be in the HTML and visible by default, with the animation hiding it only when JavaScript runs, so it never disappears for a crawler."
    }
   },
   {
    "name": "Sticky / Pin",
    "tag": "CSS · GSAP",
    "es": {
     "what": "Un elemento se pega en pantalla mientras el resto del contenido sigue avanzando.",
     "use": "Stacking cards (tarjetas que se apilan), demos fijas y capítulos."
    },
    "en": {
     "what": "An element sticks on screen while the rest of the content keeps moving.",
     "use": "Stacking cards, pinned demos and chapters."
    },
    "prompt": {
     "es": "Deja esta columna pegada mientras la de al lado sigue subiendo, con position: sticky y top. Antes de dar por hecho que funciona, comprueba que ningún ancestro tiene overflow hidden, auto o scroll: es lo que rompe sticky el noventa por ciento de las veces, y encima no da ningún error.",
     "en": "Pin this column while the one next to it keeps scrolling, using position: sticky and top. Before assuming it works, check that no ancestor has overflow hidden, auto or scroll: that is what breaks sticky nine times out of ten, and it fails silently."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "position:sticky",
     "visto": "2026-08-21",
     "es": "once elementos que se quedan pegados al bajar",
     "en": "eleven elements that stick as you scroll"
    }
   },
   {
    "name": "Horizontal scroll",
    "tag": "GSAP",
    "es": {
     "what": "Desplazamiento lateral controlado por el scroll vertical.",
     "use": "Galerías, líneas de tiempo y portfolios."
    },
    "en": {
     "what": "Sideways movement driven by the vertical scroll.",
     "use": "Galleries, timelines and portfolios."
    },
    "prompt": {
     "es": "Convierte esta sección en un desplazamiento lateral movido por el scroll vertical. Que el contenedor se quede pegado y las tarjetas se muevan con transform. Deja salida: cuando la tira se acaba, la página tiene que seguir bajando con normalidad, y en móvil vale más un carrusel con scroll-snap que secuestrar el scroll.",
     "en": "Turn this section into a sideways move driven by vertical scroll. Pin the container and shift the cards with transform. Leave an exit: when the strip ends the page must keep scrolling normally, and on mobile a scroll-snap carousel beats hijacking the scroll."
    }
   },
   {
    "name": "Marquee",
    "tag": "CSS · JS",
    "es": {
     "what": "Cinta de texto o logos que se repite en bucle infinito.",
     "use": "Tiras de logos de clientes y titulares en movimiento."
    },
    "en": {
     "what": "A strip of text or logos looping infinitely.",
     "use": "Client logo strips and moving headlines."
    },
    "prompt": {
     "es": "Monta una cinta de logos que corra en bucle sin cortes. Duplica el contenido y anima el conjunto con transform: translateX en un @keyframes lineal, que es lo que hace que el salto no se vea. Que se pare al pasar el ratón por encima y con prefers-reduced-motion. Nada de la etiqueta marquee, que está muerta.",
     "en": "Build a logo strip that loops with no visible seam. Duplicate the content and animate the whole set with transform: translateX in a linear @keyframes, which is what hides the jump. Pause it on hover and under prefers-reduced-motion. Do not use the marquee tag, it is dead."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "marquee",
     "visto": "2026-08-21",
     "es": "la tira de logos que no para de correr",
     "en": "the logo strip that never stops moving"
    }
   },
   {
    "name": "Scrollytelling",
    "tag": "JS",
    "es": {
     "what": "Contar una historia guiada por el scroll, con texto y visuales sincronizados.",
     "use": "Reportajes interactivos, secciones de 'cómo funciona', datos narrados."
    },
    "en": {
     "what": "Telling a story driven by scroll, with text and visuals in sync.",
     "use": "Interactive features, 'how it works' sections, narrated data."
    },
    "prompt": {
     "es": "Monta una historia guiada por el scroll: una visual que se queda fija a un lado y pasos de texto al otro que la van cambiando. Detecta el paso activo con IntersectionObserver. Cada paso tiene que entenderse leído solo, sin la visual, porque es lo que va a ver quien llegue desde un buscador o con el JavaScript caído.",
     "en": "Build a scroll-driven story: one visual pinned to one side and text steps on the other that change it. Detect the active step with IntersectionObserver. Every step has to make sense read on its own, without the visual, because that is what a crawler or a broken-JavaScript visitor gets."
    }
   },
   {
    "name": "Page transitions",
    "tag": "View Transitions · barba.js",
    "es": {
     "what": "Transición animada al navegar entre páginas o vistas.",
     "use": "Que la navegación se sienta de app, sin recargas bruscas."
    },
    "en": {
     "what": "Animated transition when navigating between pages or views.",
     "use": "Make navigation feel app-like, without harsh reloads."
    },
    "prompt": {
     "es": "Añade una transición al navegar entre páginas con la View Transitions API del navegador, no con una librería. Envuelve el cambio en document.startViewTransition y comprueba antes que existe. Sin soporte, la navegación tiene que seguir siendo instantánea y correcta: la transición es un extra, nunca un requisito.",
     "en": "Add a transition between pages with the browser View Transitions API, not a library. Wrap the change in document.startViewTransition and check it exists first. Without support, navigation must stay instant and correct: the transition is a bonus, never a requirement."
    }
   }
  ]
 },
 {
  "key": "pointer",
  "color": "var(--tono-violeta)",
  "label": {
   "es": "Puntero y micro-interacciones",
   "en": "Pointer & micro-interactions"
  },
  "items": [
   {
    "name": "Tilt 3D",
    "tag": "JS · CSS",
    "es": {
     "what": "Un elemento se inclina en 3D siguiendo al ratón (perspective + rotateX/Y).",
     "use": "Tarjetas de producto, avatares y elementos destacados."
    },
    "en": {
     "what": "An element tilts in 3D following the mouse (perspective + rotateX/Y).",
     "use": "Product cards, avatars and highlighted elements."
    },
    "prompt": {
     "es": "Haz que esta tarjeta se incline en 3D siguiendo al ratón. El contenedor lleva perspective y la tarjeta rotateX y rotateY calculados desde la posición del cursor dentro de ella. Suaviza el retorno al salir y limita el giro a unos 8 grados: más que eso marea y deforma el texto. En táctil no lo montes, que no hay cursor y el listener solo gasta.",
     "en": "Make this card tilt in 3D following the mouse. The container gets perspective and the card rotateX/rotateY computed from the cursor position inside it. Ease it back on leave and cap the tilt around 8 degrees: more than that is dizzying and warps the text. Do not mount it on touch, where there is no cursor and the listener is pure waste."
    }
   },
   {
    "name": "Hover magnético",
    "nameEn": "Magnetic hover",
    "tag": "JS",
    "es": {
     "what": "Un botón atrae el cursor moviéndose ligeramente hacia él.",
     "use": "CTAs y botones que invitan a pulsar."
    },
    "en": {
     "what": "A button attracts the cursor by moving slightly toward it.",
     "use": "CTAs and buttons that invite a click."
    },
    "prompt": {
     "es": "Haz que este botón se acerque un poco al cursor cuando el ratón ronda cerca. Calcula la distancia al centro y muévelo con transform, como mucho unos 10px, volviendo a su sitio al salir. El área de detección puede ser mayor que el botón, pero el ÁREA PULSABLE no se mueve con él: si el botón huye del dedo, no lo pulsa nadie.",
     "en": "Make this button drift toward the cursor when the mouse comes close. Compute the distance to its center and move it with transform, 10px at most, easing back on leave. The detection area can be larger than the button, but the CLICKABLE area must not move with it: a button that runs away never gets pressed."
    }
   },
   {
    "name": "Cursor personalizado (lerp)",
    "nameEn": "Custom cursor (lerp)",
    "tag": "JS",
    "es": {
     "what": "Cursor a medida que sigue al ratón con suavizado (interpolación lineal).",
     "use": "Marcas creativas y portfolios con personalidad."
    },
    "en": {
     "what": "A custom cursor that follows the mouse with easing (linear interpolation).",
     "use": "Creative brands and portfolios with personality."
    },
    "prompt": {
     "es": "Sustituye el cursor por un punto que lo sigue con retardo, interpolando su posición en cada frame con requestAnimationFrame. Ojo con tres cosas: esconder el cursor del sistema deja sin pistas a quien no ve bien, así que hazlo solo en punteros finos con @media (pointer: fine); no lo montes en táctil; y déjalo desactivado con prefers-reduced-motion.",
     "en": "Replace the cursor with a dot that trails it, interpolating its position each frame with requestAnimationFrame. Watch three things: hiding the system cursor removes affordances for people with low vision, so only do it under @media (pointer: fine); do not mount it on touch; and switch it off under prefers-reduced-motion."
    }
   },
   {
    "name": "Micro-interacciones",
    "nameEn": "Micro-interactions",
    "tag": "CSS",
    "es": {
     "what": "Pequeños feedbacks en hover, focus y click (escala, color, sombra).",
     "use": "Hacen la interfaz viva y agradable; refuerzan cada acción."
    },
    "en": {
     "what": "Tiny feedbacks on hover, focus and click (scale, color, shadow).",
     "use": "They make the UI feel alive; they reinforce each action."
    },
    "prompt": {
     "es": "Dale respuesta a estos controles al pasar por encima, al enfocarlos y al pulsarlos: un cambio pequeño de escala, color o sombra, con su propia curva de easing y no la de fábrica. Que el estado de FOCO se vea tanto como el de hover, porque quien navega con teclado solo tiene ese. Nada por encima de 200ms: una micro-interacción lenta se siente como lag.",
     "en": "Give these controls a response on hover, focus and press: a small change of scale, color or shadow, with its own easing curve rather than the default. Make the FOCUS state as visible as the hover one, because keyboard users only get that one. Nothing over 200ms: a slow micro-interaction reads as lag."
    },
    "vistoEn": {
     "sitio": "apple.com",
     "url": "https://www.apple.com",
     "prueba": "cubic-bezier",
     "visto": "2026-08-21",
     "es": "cada transición lleva su curva a medida, no la de fabrica",
     "en": "every transition carries its own curve, not the default one"
    }
   },
   {
    "name": "Cursor blend",
    "tag": "mix-blend-mode",
    "es": {
     "what": "Cursor o formas que invierten el color de lo que hay debajo.",
     "use": "Efecto llamativo en portfolios y marcas creativas."
    },
    "en": {
     "what": "A cursor or shapes that invert the color of what's underneath.",
     "use": "Eye-catching effect in portfolios and creative brands."
    },
    "prompt": {
     "es": "Haz que este cursor a medida invierta el color de lo que tiene debajo, con mix-blend-mode: difference. Comprueba antes que ningún ancestro tenga un backdrop-filter ni un filter, porque cualquiera de los dos crea un contexto de apilado y el blend deja de ver el fondo. Y mira que el texto siga legible por debajo, que es lo que se rompe con esto.",
     "en": "Make this custom cursor invert whatever is under it, with mix-blend-mode: difference. Check first that no ancestor has a backdrop-filter or a filter: either one creates a stacking context and the blend stops seeing the background. And check the text underneath stays readable, which is what this usually breaks."
    }
   },
   {
    "name": "Spotlight / glow",
    "tag": "radial-gradient · JS",
    "es": {
     "what": "Un resplandor que sigue al cursor dentro de una tarjeta o botón.",
     "use": "Da vida a las cards (se usa en esta misma web al pasar el ratón)."
    },
    "en": {
     "what": "A glow that follows the cursor inside a card or button.",
     "use": "Brings cards to life (used on this very site on hover)."
    },
    "prompt": {
     "es": "Que estas tarjetas enciendan un resplandor que sigue al cursor. Guarda la posición del ratón en dos variables CSS desde JavaScript y pinta el brillo con un radial-gradient que las use, así el trabajo por frame es escribir dos números y no recalcular estilos. Un solo listener en el contenedor, no uno por tarjeta. El brillo va detrás del contenido y con pointer-events: none.",
     "en": "Make these cards light up a glow that follows the cursor. Store the mouse position in two CSS variables from JavaScript and paint the glow with a radial-gradient that reads them, so the per-frame work is writing two numbers instead of recomputing styles. One listener on the container, not one per card. The glow sits behind the content with pointer-events: none."
    }
   }
  ]
 },
 {
  "key": "visual",
  "color": "var(--tono-cian)",
  "label": {
   "es": "Estética y efectos",
   "en": "Aesthetics & effects"
  },
  "items": [
   {
    "name": "Glassmorphism",
    "tag": "backdrop-filter",
    "es": {
     "what": "Efecto de cristal esmerilado: fondo borroso y translúcido.",
     "use": "Barras, tarjetas y menús flotantes modernos."
    },
    "en": {
     "what": "Frosted-glass effect: blurred, translucent background.",
     "use": "Modern floating bars, cards and menus."
    },
    "prompt": {
     "es": "Dale a este panel aspecto de cristal esmerilado: fondo semitransparente y backdrop-filter con blur y algo de saturate. Dos avisos que cambian el resultado: backdrop-filter crea contexto de apilado, así que si dentro hay algo con position: fixed dejará de cubrir la pantalla; y el texto encima de un fondo que se mueve tiene que seguir cumpliendo 4,5:1, así que sube la opacidad hasta que lo cumpla.",
     "en": "Give this panel a frosted-glass look: semi-transparent background plus backdrop-filter with blur and a touch of saturate. Two warnings that change the outcome: backdrop-filter creates a stacking context, so anything position: fixed inside it stops covering the viewport; and text over a moving backdrop still has to clear 4.5:1, so raise the opacity until it does."
    },
    "vistoEn": {
     "sitio": "tailwindcss.com",
     "url": "https://tailwindcss.com",
     "prueba": "backdrop-filter",
     "visto": "2026-08-21",
     "es": "las capas translúcidas de su interfaz",
     "en": "the translucent layers in its interface"
    }
   },
   {
    "name": "Neumorphism",
    "tag": "box-shadow",
    "es": {
     "what": "Superficies con sombras suaves que parecen relieve de plástico.",
     "use": "Botones y controles con estilo táctil (ojo con el contraste)."
    },
    "en": {
     "what": "Surfaces with soft shadows that look like extruded plastic.",
     "use": "Buttons and controls with a tactile feel (watch the contrast)."
    },
    "prompt": {
     "es": "Dale a estos controles el relieve de neumorfismo, con dos box-shadow (una clara arriba a la izquierda y una oscura abajo a la derecha) del MISMO color que el fondo. Antes de aceptarlo, mide el contraste: este estilo suele dejar los bordes por debajo de 3:1 y entonces no se ve dónde se puede pulsar. Si no llega, añade un borde o un cambio de fondo al enfocarlo.",
     "en": "Give these controls the neumorphic relief, with two box-shadows (a light one top-left, a dark one bottom-right) in the SAME color as the background. Before accepting it, measure the contrast: this style usually leaves edges under 3:1 and then nobody can tell what is pressable. If it falls short, add a border or a background change on focus."
    }
   },
   {
    "name": "Aurora / mesh gradient",
    "tag": "CSS",
    "es": {
     "what": "Degradados orgánicos y difusos, a menudo animados, de fondo.",
     "use": "Fondos vivos sin recargar (como el de esta misma web)."
    },
    "en": {
     "what": "Organic, diffuse gradients, often animated, used as background.",
     "use": "Lively backgrounds without clutter (like this very site)."
    },
    "prompt": {
     "es": "Monta un fondo de aurora: varios radial-gradient de colores superpuestos y desenfocados, animándose despacio. Hazlo con CSS y transform, sin canvas y sin imágenes. Anima solo transform y opacity, nunca background-position, que repinta toda la superficie. Que el ciclo dure decenas de segundos y se pare con prefers-reduced-motion.",
     "en": "Build an aurora background: several overlapping, blurred radial-gradients drifting slowly. Do it in CSS with transform, no canvas and no images. Animate transform and opacity only, never background-position, which repaints the whole surface. Make the cycle tens of seconds long and stop it under prefers-reduced-motion."
    },
    "vistoEn": {
     "sitio": "astro.build",
     "url": "https://astro.build",
     "prueba": "radial-gradient",
     "visto": "2026-08-21",
     "es": "el fondo son gradientes superpuestos, no una imagen",
     "en": "the background is stacked gradients, not an image"
    }
   },
   {
    "name": "Clip-path y máscaras",
    "nameEn": "Clip-path and masks",
    "tag": "CSS",
    "es": {
     "what": "Revelar o recortar contenido con formas (clip-path, mask).",
     "use": "Reveals con estilo, texto que se descubre y transiciones de imagen."
    },
    "en": {
     "what": "Reveal or crop content with shapes (clip-path, mask).",
     "use": "Stylish reveals, uncovering text and image transitions."
    },
    "prompt": {
     "es": "Recorta esta sección con una forma usando clip-path, o difumina su borde con mask-image y un gradiente. Dos cosas: lo recortado sigue existiendo para un lector de pantalla, así que si sobra de verdad quítalo del DOM y no solo de la vista; y clip-path corta también el foco visible de los controles que queden en el borde, así que déjales margen.",
     "en": "Crop this section into a shape with clip-path, or fade its edge with mask-image and a gradient. Two things: clipped content still exists for a screen reader, so if it is truly redundant remove it from the DOM and not just from view; and clip-path also cuts the focus ring of any control near the edge, so leave them room."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "mask-image",
     "visto": "2026-08-21",
     "es": "recorta y difumina bordes con máscaras CSS, sin imágenes",
     "en": "crops and fades edges with CSS masks, no images"
    }
   },
   {
    "name": "View Transitions",
    "tag": "CSS/JS API",
    "es": {
     "what": "Transición animada nativa entre dos estados o páginas.",
     "use": "Cambios de tema y navegación suave (la usa el toggle de tema de aquí)."
    },
    "en": {
     "what": "Native animated transition between two states or pages.",
     "use": "Theme changes and smooth navigation (used by this site's theme toggle)."
    },
    "prompt": {
     "es": "Anima el cambio entre estos dos estados con la View Transitions API: envuelve la actualización del DOM en document.startViewTransition y comprueba antes que existe. Para que un elemento viaje de un estado a otro dale el mismo view-transition-name en los dos, y que ese nombre sea ÚNICO en la página: dos elementos con el mismo nombre a la vez cancelan la transición entera.",
     "en": "Animate the change between these two states with the View Transitions API: wrap the DOM update in document.startViewTransition and check it exists first. To make an element travel between states give it the same view-transition-name in both, and keep that name UNIQUE on the page: two elements sharing one at the same time cancel the whole transition."
    },
    "vistoEn": {
     "sitio": "astro.build",
     "url": "https://astro.build",
     "prueba": "view-transition",
     "visto": "2026-08-21",
     "es": "el paso entre páginas lo hace la API del navegador",
     "en": "page-to-page transitions handled by the browser API"
    }
   },
   {
    "name": "Skeleton loaders",
    "tag": "CSS",
    "es": {
     "what": "Placeholders grises animados que se muestran mientras carga el contenido real.",
     "use": "Percepción de rapidez; evitan pantallas en blanco."
    },
    "en": {
     "what": "Animated gray placeholders shown while the real content loads.",
     "use": "Perceived speed; they avoid blank screens."
    },
    "prompt": {
     "es": "Mientras carga, enseña un esqueleto con la forma de lo que va a venir, no un spinner: bloques del tamaño real del título, del texto y de la imagen, con un brillo que recorre. Que ocupe EXACTAMENTE el mismo espacio que el contenido final, porque si no el salto al llegar cuenta como CLS. Y márcalo con aria-hidden más un aria-busy en el contenedor.",
     "en": "While loading, show a skeleton shaped like what is coming, not a spinner: blocks the real size of the title, the text and the image, with a shimmer running across. Make it take EXACTLY the same space as the final content, otherwise the jump when it arrives counts as CLS. Mark it aria-hidden and put aria-busy on the container."
    },
    "vistoEn": {
     "sitio": "github.com",
     "url": "https://github.com",
     "prueba": "skeleton",
     "visto": "2026-08-21",
     "es": "el hueco de lo que carga tiene la forma de lo que va a venir",
     "en": "loading gaps keep the shape of what is coming"
    }
   },
   {
    "name": "Tipografía cinética",
    "nameEn": "Kinetic typography",
    "tag": "GSAP SplitText",
    "es": {
     "what": "Animar el texto por letras o palabras (aparecer, deslizar, distorsionar).",
     "use": "Titulares con impacto e intros de marca."
    },
    "en": {
     "what": "Animate text by letters or words (appear, slide, distort).",
     "use": "High-impact headlines and brand intros."
    },
    "vistoEn": {
     "sitio": "gsap.com",
     "url": "https://gsap.com",
     "prueba": "tf-assets/SplitText",
     "visto": "2026-08-21",
     "es": "su propia portada carga SplitText, el plugin que parte el texto en letras",
     "en": "its own home page loads SplitText, the plugin that splits text into letters"
    },
    "prompt": {
     "es": "Anima este titular letra a letra al entrar. Parte el texto en spans y desplázalos con un pequeño retardo escalonado. Importante para que no se rompa nada: el titular tiene que seguir siendo UNA frase para quien la escuche, así que pon el texto completo en un aria-label del contenedor y aria-hidden en los trozos. Sin JavaScript, el titular se ve entero y quieto.",
     "en": "Animate this heading letter by letter on entry. Split the text into spans and stagger their movement. Important so nothing breaks: the heading must still be ONE sentence for anyone listening, so put the full text in an aria-label on the container and aria-hidden on the pieces. With no JavaScript, the heading shows whole and static."
    }
   },
   {
    "name": "Noise / grain",
    "tag": "SVG · CSS",
    "es": {
     "what": "Textura de grano sutil sobre fondos y degradados.",
     "use": "Da un acabado cálido y analógico, menos plano."
    },
    "en": {
     "what": "Subtle grain texture over backgrounds and gradients.",
     "use": "Gives a warm, analog finish, less flat."
    },
    "prompt": {
     "es": "Añade una capa de grano sutil sobre este fondo para quitarle el aspecto plástico. Genera la textura con un SVG de feTurbulence embebido como data URI, no con una imagen que haya que descargar. Ponla en un pseudoelemento con pointer-events: none, opacidad muy baja (0.03 a 0.06) y por debajo del contenido: si el texto pierde nitidez, te has pasado.",
     "en": "Add a subtle grain layer over this background to take the plastic out of it. Generate the texture with an inline SVG feTurbulence as a data URI, not an image you have to download. Put it on a pseudo-element with pointer-events: none, very low opacity (0.03 to 0.06) and under the content: if the text loses sharpness, you overdid it."
    },
    "vistoEn": {
     "sitio": "linear.app",
     "url": "https://linear.app",
     "prueba": "grain",
     "visto": "2026-08-21",
     "es": "una capa de grano encima del color para quitarle el plástico",
     "en": "a grain layer over the color to take the plastic out"
    }
   },
   {
    "name": "Preloader",
    "tag": "JS",
    "es": {
     "what": "Pantalla o barra de carga inicial mientras se prepara la web.",
     "use": "Cubrir la carga de recursos pesados, con mesura (nunca eternos)."
    },
    "en": {
     "what": "An initial loading screen or bar while the site gets ready.",
     "use": "Cover heavy resource loading, in moderation (never endless)."
    },
    "prompt": {
     "es": "Monta una pantalla de carga inicial que se va cuando la página está lista. Y ponle un techo de tiempo: si a los dos segundos no ha terminado, se quita igual. Un preloader sin límite convierte cualquier fallo de red en una pantalla en blanco eterna. Que el contenido esté en el HTML detrás, no dentro del preloader, para que un buscador lo lea aunque el JavaScript no corra.",
     "en": "Build an initial loading screen that leaves when the page is ready. Give it a hard time cap: if it has not finished in two seconds, it goes anyway. A preloader with no limit turns any network hiccup into a permanently blank page. Keep the content in the HTML behind it, not inside the preloader, so a crawler reads it even if the JavaScript never runs."
    }
   }
  ]
 },
 {
  "key": "perf",
  "color": "var(--tono-esmeralda)",
  "label": {
   "es": "Rendimiento y buenas prácticas",
   "en": "Performance & best practices"
  },
  "items": [
   {
    "name": "Animar transform/opacity",
    "nameEn": "Animate transform/opacity",
    "tag": "GPU",
    "es": {
     "what": "Animar solo transform y opacity, nunca top/left/width/height.",
     "use": "Es lo único que la GPU compone barato, dando 60fps sin tirones (jank)."
    },
    "en": {
     "what": "Animate only transform and opacity, never top/left/width/height.",
     "use": "It's the only thing the GPU composes cheaply, giving 60fps with no jank."
    },
    "prompt": {
     "es": "Revisa las animaciones de este archivo y pásalas a transform y opacity. Cualquier cosa que anime top, left, width, height o margin obliga al navegador a recalcular la maquetación en cada frame; el mismo movimiento con translate no toca la maquetación. Enséñame qué has cambiado y por qué, y comprueba en el panel de rendimiento que ya no hay recálculos por frame.",
     "en": "Go through the animations in this file and move them to transform and opacity. Anything animating top, left, width, height or margin forces a layout recalculation every frame; the same movement with translate touches no layout at all. Show me what you changed and why, and check in the performance panel that there are no per-frame recalculations left."
    },
    "vistoEn": {
     "sitio": "apple.com",
     "url": "https://www.apple.com",
     "prueba": "transform:translate",
     "visto": "2026-08-21",
     "es": "mueve con transform y no con top o left, que obliga a recalcular",
     "en": "moves with transform, never top or left, which forces a relayout"
    }
   },
   {
    "name": "will-change",
    "tag": "CSS",
    "es": {
     "what": "Avisa al navegador de qué propiedad va a cambiar para que prepare una capa.",
     "use": "Úsalo con criterio: en exceso consume memoria."
    },
    "en": {
     "what": "Tells the browser which property will change so it prepares a layer.",
     "use": "Use it sparingly: overusing it wastes memory."
    },
    "prompt": {
     "es": "Avisa al navegador de lo que va a moverse en este elemento con will-change, y quítalo cuando la animación termine. La regla que se salta todo el mundo: will-change permanente en muchos elementos crea una capa de composición por cada uno y se come la memoria de vídeo, sobre todo en móvil. Es una pista para un momento concreto, no un atributo que se deja puesto.",
     "en": "Tell the browser what is about to move on this element with will-change, and remove it when the animation ends. The rule everyone skips: a permanent will-change on many elements creates one compositing layer each and eats video memory, especially on mobile. It is a hint for a specific moment, not an attribute you leave on."
    },
    "vistoEn": {
     "sitio": "framer.com",
     "url": "https://www.framer.com",
     "prueba": "will-change",
     "visto": "2026-08-21",
     "es": "avisa al navegador de lo que va a moverse, 258 veces en su portada",
     "en": "warns the browser what is about to move, 258 times on its home page"
    }
   },
   {
    "name": "Core Web Vitals",
    "tag": "Métrica",
    "tagEn": "Metric",
    "es": {
     "what": "LCP (<2,5s), INP (<200ms) y CLS (<0,1): las métricas de experiencia de Google.",
     "use": "Si un efecto las empeora, baja su intensidad o pásalo a CSS nativo."
    },
    "en": {
     "what": "LCP (<2.5s), INP (<200ms) and CLS (<0.1): Google's experience metrics.",
     "use": "If an effect worsens them, lower its intensity or move it to native CSS."
    },
    "prompt": {
     "es": "Mide los Core Web Vitals de esta página y arréglalos por orden de impacto. Para el LCP, encuentra qué elemento es el más grande de la primera pantalla y dale fetchpriority=\"high\", quitándole cualquier lazy loading. Para el CLS, reserva sitio con width y height o aspect-ratio en imágenes, iframes y anuncios. Dime los números antes y después, no solo lo que cambiaste.",
     "en": "Measure this page's Core Web Vitals and fix them in order of impact. For LCP, find which element is the largest in the first viewport and give it fetchpriority=\"high\", removing any lazy loading from it. For CLS, reserve space with width and height or aspect-ratio on images, iframes and ads. Give me the numbers before and after, not just what you changed."
    },
    "vistoEn": {
     "sitio": "developer.mozilla.org",
     "url": "https://developer.mozilla.org",
     "prueba": "fetchpriority",
     "visto": "2026-08-21",
     "es": "marca qué imagen carga primero para no hundir el LCP",
     "en": "flags which image loads first so the LCP does not suffer"
    }
   },
   {
    "name": "prefers-reduced-motion",
    "tag": "CSS media",
    "es": {
     "what": "Preferencia del sistema para reducir animaciones (accesibilidad).",
     "use": "Respétala para no marear; o, si tu marca lo decide, ofrece una válvula para apagar el movimiento."
    },
    "en": {
     "what": "System preference to reduce animations (accessibility).",
     "use": "Respect it to avoid motion sickness; or, if your brand decides, offer a switch to turn motion off."
    },
    "prompt": {
     "es": "Repasa este proyecto y respeta prefers-reduced-motion en todas las animaciones, las de CSS y las de JavaScript. Reducir NO es apagarlo todo y dejar la interfaz muerta: los cambios de opacidad y los fundidos cortos se quedan; lo que se quita es el desplazamiento grande, el parallax, el zoom y el giro, que son los que marean de verdad.",
     "en": "Go through this project and respect prefers-reduced-motion in every animation, CSS and JavaScript alike. Reducing is NOT killing everything and leaving a dead interface: opacity changes and short fades stay; what goes is large movement, parallax, zoom and spin, which are the ones that actually make people sick."
    },
    "vistoEn": {
     "sitio": "stripe.com",
     "url": "https://stripe.com",
     "prueba": "prefers-reduced-motion",
     "visto": "2026-08-21",
     "es": "ciento diez reglas que respetan a quien pide menos movimiento",
     "en": "a hundred and ten rules honoring reduced motion"
    }
   },
   {
    "name": "Progressive enhancement",
    "tag": "Método",
    "tagEn": "Method",
    "es": {
     "what": "Que el contenido funcione y se lea sin JS; el efecto va por encima.",
     "use": "Robustez: si el JS falla, la web sigue siendo usable."
    },
    "en": {
     "what": "Content works and reads without JS; the effect goes on top.",
     "use": "Robustness: if JS fails, the site is still usable."
    },
    "prompt": {
     "es": "Comprueba qué queda de esta página con el JavaScript desactivado y arregla lo que se caiga. El contenido y la navegación tienen que funcionar sin JavaScript; los efectos van encima. En concreto: nada de texto que solo exista tras montar, los enlaces son etiquetas <a> con su href de verdad y los formularios tienen action y method. Dime qué se rompía antes de tocarlo.",
     "en": "Check what is left of this page with JavaScript disabled and fix whatever falls over. Content and navigation must work without JavaScript; effects go on top. Specifically: no text that only exists after mounting, links are real <a> tags with a real href, and forms have action and method. Tell me what was broken before you touched it."
    },
    "vistoEn": {
     "sitio": "apple.com",
     "url": "https://www.apple.com",
     "prueba": "noscript",
     "visto": "2026-08-21",
     "es": "la página sigue diciendo algo con el JavaScript apagado",
     "en": "the page still says something with JavaScript off"
    }
   },
   {
    "name": "Responsive / mobile-first",
    "tag": "CSS",
    "es": {
     "what": "Diseñar primero para móvil y escalar hacia arriba.",
     "use": "La mayoría del tráfico es móvil; los efectos deben ir a 60fps también ahí."
    },
    "en": {
     "what": "Design for mobile first and scale up.",
     "use": "Most traffic is mobile; effects must run at 60fps there too."
    },
    "prompt": {
     "es": "Pasa este CSS a mobile-first: los estilos base son los del móvil y las media queries solo añaden hacia arriba con min-width. Comprueba a 320px de ancho, que es donde se rompe todo, y que ningún bloque desborde en horizontal. Para las imágenes, srcset con varios tamaños y sizes: servir la de escritorio a un móvil es la forma más habitual de hundir el LCP.",
     "en": "Convert this CSS to mobile-first: base styles are the mobile ones and media queries only add upward with min-width. Test at 320px wide, which is where everything breaks, and make sure no block overflows horizontally. For images, srcset with several sizes plus sizes: serving the desktop one to a phone is the most common way to sink the LCP."
    },
    "vistoEn": {
     "sitio": "framer.com",
     "url": "https://www.framer.com",
     "prueba": "srcset",
     "visto": "2026-08-21",
     "es": "sirve una imagen distinta según el ancho de la pantalla",
     "en": "serves a different image depending on screen width"
    }
   },
   {
    "name": "Lazy loading",
    "tag": "loading=\"lazy\"",
    "es": {
     "what": "Cargar imágenes y recursos solo cuando se acercan al viewport.",
     "use": "Acelera la carga inicial y ahorra datos."
    },
    "en": {
     "what": "Load images and resources only as they approach the viewport.",
     "use": "Speeds up initial load and saves data."
    },
    "prompt": {
     "es": "Pon loading=\"lazy\" en las imágenes y los iframes de esta página, pero NO en los de la primera pantalla: la imagen principal cargada de forma perezosa retrasa el LCP, que es justo lo contrario de lo que se busca. Añade width y height a todas para que reserven su sitio, y decoding=\"async\" a las que no sean críticas.",
     "en": "Add loading=\"lazy\" to the images and iframes on this page, but NOT to the ones in the first viewport: lazy-loading the hero image delays the LCP, which is the opposite of the point. Give them all width and height so they reserve their space, and decoding=\"async\" on the non-critical ones."
    },
    "vistoEn": {
     "sitio": "clerk.com",
     "url": "https://clerk.com",
     "prueba": "loading=\"lazy\"",
     "visto": "2026-08-21",
     "es": "noventa y siete imágenes que esperan a hacer falta",
     "en": "ninety-seven images that wait until needed"
    }
   },
   {
    "name": "Debounce y throttle",
    "nameEn": "Debounce and throttle",
    "tag": "JS",
    "es": {
     "what": "Limitar cuántas veces se ejecuta una función en eventos frecuentes (scroll, resize, input).",
     "use": "Evita trabajo de más y mantiene la fluidez."
    },
    "en": {
     "what": "Limit how often a function runs on frequent events (scroll, resize, input).",
     "use": "Avoids extra work and keeps things smooth."
    },
    "prompt": {
     "es": "Limita cuántas veces se ejecuta esto en un evento que dispara sin parar, y elige bien cuál de los dos: DEBOUNCE si solo importa el final (una búsqueda mientras se escribe, un resize); THROTTLE si hace falta ir viendo el progreso (scroll, movimiento del ratón). Y si es scroll o movimiento, lo que quieres casi seguro es requestAnimationFrame en vez de un temporizador.",
     "en": "Limit how often this runs on an event that fires constantly, and pick the right one: DEBOUNCE if only the end matters (a search-as-you-type, a resize); THROTTLE if you need to see the progress (scroll, pointer move). And if it is scroll or pointer, what you almost certainly want is requestAnimationFrame rather than a timer."
    }
   },
   {
    "name": "requestAnimationFrame",
    "tag": "JS",
    "es": {
     "what": "Sincronizar animaciones JS con el refresco de pantalla del navegador.",
     "use": "Animaciones suaves a 60fps sin saturar el hilo principal."
    },
    "en": {
     "what": "Sync JS animations with the browser's screen refresh.",
     "use": "Smooth 60fps animations without clogging the main thread."
    },
    "prompt": {
     "es": "Mueve esta animación a requestAnimationFrame, para que corra sincronizada con el refresco de la pantalla en vez de con un setInterval. Calcula el avance con el tiempo que llega en el callback y no con un incremento fijo, o irá al doble de velocidad en una pantalla de 120Hz. Cancela el bucle al desmontar con cancelAnimationFrame, que si no sigue corriendo invisible.",
     "en": "Move this animation to requestAnimationFrame, so it runs in sync with the screen refresh instead of a setInterval. Compute progress from the timestamp the callback receives, not a fixed increment, or it runs twice as fast on a 120Hz display. Cancel the loop on unmount with cancelAnimationFrame, otherwise it keeps running invisibly."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "requestAnimationFrame",
     "visto": "2026-08-21",
     "es": "engancha sus animaciones al reloj del navegador",
     "en": "hooks its animations to the browser frame clock"
    }
   }
  ]
 },
 {
  "key": "cssmod",
  "color": "var(--tono-rosa)",
  "label": {
   "es": "CSS moderno",
   "en": "Modern CSS"
  },
  "items": [
   {
    "name": "Container queries",
    "tag": "@container",
    "es": {
     "what": "Estilos según el tamaño del contenedor, no de la ventana.",
     "use": "Componentes de verdad reutilizables que se adaptan a su hueco."
    },
    "en": {
     "what": "Styles based on the container's size, not the window's.",
     "use": "Truly reusable components that adapt to their slot."
    },
    "prompt": {
     "es": "Haz que este componente se adapte al ancho de SU CONTENEDOR y no al de la ventana, con container queries. Declara container-type: inline-size en el padre y usa @container en el hijo. Ojo con container-type: size, que exige alto explícito y colapsa el elemento; para casi todo lo que quieres, inline-size es el correcto.",
     "en": "Make this component adapt to the width of ITS CONTAINER rather than the viewport, with container queries. Declare container-type: inline-size on the parent and use @container on the child. Careful with container-type: size, which demands an explicit height and collapses the element; for almost everything you want, inline-size is the right one."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "@container",
     "visto": "2026-08-21",
     "es": "su CSS lleva noventa y seis consultas de contenedor",
     "en": "its CSS carries ninety-six container queries"
    }
   },
   {
    "name": "Fluid typography",
    "tag": "clamp()",
    "es": {
     "what": "Tamaños de fuente que escalan suavemente entre un mínimo y un máximo.",
     "use": "Tipografía que luce bien de móvil a pantalla grande sin saltos."
    },
    "en": {
     "what": "Font sizes that scale smoothly between a min and a max.",
     "use": "Type that looks good from mobile to large screens with no jumps."
    },
    "prompt": {
     "es": "Pasa esta escala tipográfica a tamaños fluidos con clamp(), para que crezca sola entre el móvil y el escritorio sin saltos por breakpoint. Usa una unidad relativa en la parte que escala (rem con vw) y no vw a secas, porque con vw puro el texto deja de responder al zoom del navegador y eso incumple accesibilidad. Comprueba que a 200% de zoom sigue creciendo.",
     "en": "Move this type scale to fluid sizes with clamp(), so it grows on its own between mobile and desktop with no breakpoint jumps. Use a relative unit in the scaling part (rem plus vw) rather than bare vw, because with pure vw the text stops responding to browser zoom, which fails accessibility. Check it still grows at 200% zoom."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "clamp(",
     "visto": "2026-08-21",
     "es": "los tamaños se calculan con clamp, sin saltos",
     "en": "sizes are computed with clamp, no jumps"
    }
   },
   {
    "name": ":has()",
    "tag": "CSS",
    "es": {
     "what": "El 'selector padre': estilar un elemento según lo que contiene.",
     "use": "Lógica de estilos antes imposible sin JS."
    },
    "en": {
     "what": "The 'parent selector': style an element based on what it contains.",
     "use": "Styling logic previously impossible without JS."
    },
    "prompt": {
     "es": "Usa :has() para estilar este elemento según lo que contiene, en vez de añadir una clase desde JavaScript. Sirve para el padre de un input inválido, la tarjeta que lleva imagen o el formulario con un campo enfocado. Dos avisos: :has() no es perezoso y un selector muy amplio se evalúa mucho, así que acótalo; y comprueba que sin soporte la página sigue siendo usable.",
     "en": "Use :has() to style this element based on what it contains, instead of adding a class from JavaScript. Good for the parent of an invalid input, the card that has an image, the form with a focused field. Two warnings: :has() is not lazy and a very broad selector gets evaluated a lot, so scope it; and check the page stays usable without support."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": ":has(",
     "visto": "2026-08-21",
     "es": "lo usa más de cien veces para reaccionar al hijo",
     "en": "used over a hundred times to react to a child"
    }
   },
   {
    "name": "Cascade layers",
    "tag": "@layer",
    "es": {
     "what": "Organizar la prioridad del CSS en capas para evitar guerras de especificidad.",
     "use": "Mantener el CSS ordenado en proyectos grandes."
    },
    "en": {
     "what": "Organize CSS priority into layers to avoid specificity wars.",
     "use": "Keep CSS tidy in large projects."
    },
    "prompt": {
     "es": "Organiza este CSS en capas con @layer para acabar con la guerra de especificidad. Declara el orden de las capas UNA vez y al principio (reset, base, componentes, utilidades), porque ese orden es lo que manda y no dónde esté escrita cada regla. Y ten claro que lo que queda FUERA de toda capa gana a todo lo que está dentro, que es justo al revés de lo que parece.",
     "en": "Organize this CSS into layers with @layer to end the specificity war. Declare the layer order ONCE and up front (reset, base, components, utilities), because that order is what wins, not where each rule is written. And know that anything OUTSIDE every layer beats everything inside one, which is the opposite of what it looks like."
    },
    "vistoEn": {
     "sitio": "stripe.com",
     "url": "https://stripe.com",
     "prueba": "@layer",
     "visto": "2026-08-21",
     "es": "ordena su CSS en capas en vez de pelear con la especificidad",
     "en": "orders its CSS in layers instead of fighting specificity"
    }
   },
   {
    "name": "color-mix()",
    "tag": "CSS",
    "es": {
     "what": "Mezclar dos colores directamente en CSS.",
     "use": "Generar tonos, hovers y transparencias desde un color base (se usa mucho en esta web)."
    },
    "en": {
     "what": "Mix two colors directly in CSS.",
     "use": "Generate shades, hovers and transparencies from a base color (used a lot on this site)."
    },
    "prompt": {
     "es": "Genera estos tonos con color-mix() en vez de escribir cada hex a mano: el hover, el borde y el estado desactivado salen del color base mezclado con el fondo o con transparent. Trabaja en oklch y no en srgb, que en srgb las mezclas pasan por grises sucios. Al terminar comprueba el contraste, que un tono derivado puede quedarse por debajo de 4,5:1 sin que se note.",
     "en": "Generate these shades with color-mix() instead of hand-writing every hex: hover, border and disabled all come from the base color mixed with the background or with transparent. Work in oklch rather than srgb, because in srgb the mixes go through muddy greys. When you are done check the contrast: a derived shade can land under 4.5:1 without anyone noticing."
    },
    "vistoEn": {
     "sitio": "tailwindcss.com",
     "url": "https://tailwindcss.com",
     "prueba": "color-mix(",
     "visto": "2026-08-21",
     "es": "más de mil colores mezclados en su hoja de estilos",
     "en": "over a thousand mixed colors in its stylesheet"
    }
   },
   {
    "name": "Subgrid",
    "tag": "CSS grid",
    "es": {
     "what": "Que un elemento hijo herede las líneas de la cuadrícula del padre.",
     "use": "Alinear tarjetas y listas de forma perfecta."
    },
    "en": {
     "what": "Let a child element inherit the parent's grid lines.",
     "use": "Align cards and lists perfectly."
    },
    "prompt": {
     "es": "Alinea estas tarjetas entre sí con subgrid, para que sus títulos, textos y pies queden en la misma línea aunque tengan distinto contenido. La tarjeta declara grid-template-rows: subgrid y ocupa varias filas del padre con grid-row: span N. Es la forma de arreglarlo sin alturas fijas ni JavaScript midiendo, que es como se hacía antes y se rompía siempre.",
     "en": "Line these cards up with subgrid, so their titles, bodies and footers sit on the same lines even with different content. The card declares grid-template-rows: subgrid and spans several parent rows with grid-row: span N. This is how you fix it without fixed heights or JavaScript measuring, which is how it used to be done and always broke."
    },
    "vistoEn": {
     "sitio": "vercel.com",
     "url": "https://vercel.com",
     "prueba": "subgrid",
     "visto": "2026-08-21",
     "es": "rejillas hijas alineadas con la de su padre",
     "en": "child grids lining up with their parent"
    }
   },
   {
    "name": "Logical properties",
    "tag": "CSS",
    "es": {
     "what": "Propiedades por eje lógico (inline/block) en vez de left/right/top/bottom.",
     "use": "Soporte automático de idiomas de derecha a izquierda (RTL)."
    },
    "en": {
     "what": "Properties by logical axis (inline/block) instead of left/right/top/bottom.",
     "use": "Automatic support for right-to-left (RTL) languages."
    },
    "prompt": {
     "es": "Cambia en este CSS las propiedades físicas por las lógicas: margin-inline en vez de margin-left y margin-right, padding-block en vez de top y bottom, inset-inline-start en vez de left. Con eso la maquetación se da la vuelta sola en árabe o hebreo sin escribir una regla aparte. Empieza por los espaciados y los bordes, que es donde está el noventa por ciento.",
     "en": "Swap the physical properties in this CSS for logical ones: margin-inline instead of margin-left and margin-right, padding-block instead of top and bottom, inset-inline-start instead of left. With that the layout flips itself for Arabic or Hebrew with no separate rules. Start with spacing and borders, which is where ninety percent of it lives."
    },
    "vistoEn": {
     "sitio": "stripe.com",
     "url": "https://stripe.com",
     "prueba": "margin-inline",
     "visto": "2026-08-21",
     "es": "márgenes en lógico, para que el sitio pueda girar de dirección",
     "en": "logical margins, so the site can flip direction"
    }
   }
  ]
 }
]
