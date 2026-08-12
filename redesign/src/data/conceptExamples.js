// Un ejemplo real y corto por concepto: lo mínimo que hay que escribir para que
// la técnica funcione. Se muestra en la tarjeta, bajo la demo.
//
// Cada ejemplo es una lista de bloques [lenguaje, código]. Declarar el lenguaje
// permite resaltarlo y, sobre todo, separar de verdad los ejemplos que necesitan
// CSS y JS: antes iban pegados con un comentario "/* css */" en medio.

const js = (codigo) => [['js', codigo]]
const css = (codigo) => [['css', codigo]]
const html = (codigo) => [['html', codigo]]

export const CONCEPT_EXAMPLES = {
  // Scroll interactivo
  'Smooth scroll': js(`const lenis = new Lenis({ lerp: 0.1 })

function raf(t) {
  lenis.raf(t)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)`),

  Parallax: js(`window.addEventListener('scroll', () => {
  const y = window.scrollY
  fondo.style.transform = \`translateY(\${y * 0.4}px)\`
}, { passive: true })`),

  'Scroll Snap': css(`.contenedor {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
}
.seccion {
  scroll-snap-align: start;
  height: 100dvh;
}`),

  'Scroll-driven animations': css(`@keyframes entrar {
  from { opacity: 0; translate: 0 40px }
}
.card {
  animation: entrar linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}`),

  'Scroll reveal': js(`const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) e.target.classList.add('visible')
}, { threshold: 0.2 })

document.querySelectorAll('.reveal')
  .forEach((el) => io.observe(el))`),

  'Sticky / Pin': css(`.panel {
  position: sticky;
  top: 0;
  height: 100dvh;
}`),

  'Horizontal scroll': js(`// gsap + ScrollTrigger
gsap.to(pista, {
  x: () => -(pista.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: seccion,
    pin: true,
    scrub: 1,
    end: () => '+=' + pista.scrollWidth,
  },
})`),

  Marquee: css(`.pista {
  display: flex;
  animation: correr 18s linear infinite;
}
@keyframes correr {
  to { transform: translateX(-50%) }
}`),

  Scrollytelling: js(`// 0 cuando la escena entra, 1 cuando termina de salir
const caja = escena.getBoundingClientRect()
const bruto = -caja.top / (caja.height - innerHeight)
const p = Math.min(Math.max(bruto, 0), 1)

figura.style.scale = 1 + p
figura.style.rotate = p * 180 + 'deg'`),

  'Page transitions': js(`if (!document.startViewTransition) {
  return pintar()
}

document.startViewTransition(() => pintar())`),

  // Puntero y micro-interacciones
  'Tilt 3D': js(`card.onpointermove = (e) => {
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.transform = \`perspective(800px)
    rotateY(\${x * 16}deg) rotateX(\${-y * 16}deg)\`
}`),

  'Hover magnético': js(`boton.onpointermove = (e) => {
  const r = boton.getBoundingClientRect()
  const dx = e.clientX - r.left - r.width / 2
  const dy = e.clientY - r.top - r.height / 2
  boton.style.translate = \`\${dx * 0.3}px \${dy * 0.3}px\`
}

boton.onpointerleave = () => {
  boton.style.translate = '0 0'
}`),

  'Cursor personalizado (lerp)': js(`function bucle() {
  // persigue sin llegar nunca del todo
  x += (ratonX - x) * 0.15
  y += (ratonY - y) * 0.15
  cursor.style.transform = \`translate(\${x}px, \${y}px)\`
  requestAnimationFrame(bucle)
}`),

  'Micro-interacciones': css(`.btn {
  transition: transform .18s ease, background .18s ease;
}
.btn:hover { transform: translateY(-2px) }
.btn:active { transform: scale(.96) }`),

  'Cursor blend': css(`.cursor {
  position: fixed;
  mix-blend-mode: difference;
  background: #fff;
  pointer-events: none;
}`),

  'Spotlight / glow': [
    ['js', `card.onpointermove = (e) => {
  card.style.setProperty('--x', e.offsetX + 'px')
  card.style.setProperty('--y', e.offsetY + 'px')
}`],
    ['css', `.card {
  background: radial-gradient(260px circle
    at var(--x) var(--y), #6366f133, transparent 60%);
}`],
  ],

  // Estética y efectos
  Glassmorphism: css(`.panel {
  backdrop-filter: blur(12px) saturate(1.4);
  background: rgb(255 255 255 / .08);
  border: 1px solid rgb(255 255 255 / .12);
}`),

  Neumorphism: css(`.btn {
  background: #e0e5ec;
  box-shadow: 8px 8px 16px #b8bec7,
              -8px -8px 16px #ffffff;
}`),

  'Aurora / mesh gradient': css(`.fondo {
  background:
    radial-gradient(at 20% 30%, #6366f1 0, transparent 50%),
    radial-gradient(at 80% 20%, #22d3ee 0, transparent 50%),
    radial-gradient(at 60% 80%, #a855f7 0, transparent 50%);
}`),

  'Clip-path y máscaras': css(`.foto {
  clip-path: polygon(0 0, 100% 6%, 100% 100%, 0 94%);
}

.desvanece {
  mask-image: linear-gradient(#000 60%, transparent);
}`),

  'View Transitions': [
    ['css', `.hero { view-transition-name: hero }`],
    ['js', `document.startViewTransition(() => cambiarDeVista())`],
  ],

  'Skeleton loaders': css(`.skeleton {
  background: linear-gradient(90deg,
    #27272a, #3f3f46, #27272a);
  background-size: 200% 100%;
  animation: brillo 1.4s ease-in-out infinite;
}
@keyframes brillo {
  to { background-position: -200% 0 }
}`),

  'Tipografía cinética': [
    ['js', `titulo.innerHTML = [...titulo.textContent]
  .map((c, i) => \`<span style="--i:\${i}">\${c}</span>\`)
  .join('')`],
    ['css', `.titulo span {
  display: inline-block;
  animation: subir .6s both;
  animation-delay: calc(var(--i) * 45ms);
}
@keyframes subir {
  from { opacity: 0; translate: 0 16px }
}`],
  ],

  'Noise / grain': [
    ['html', `<svg width="0" height="0">
  <filter id="grano">
    <feTurbulence baseFrequency=".8" />
  </filter>
</svg>`],
    ['css', `.grano::after {
  content: '';
  position: absolute;
  inset: 0;
  filter: url(#grano);
  opacity: .06;
  pointer-events: none;
}`],
  ],

  Preloader: [
    ['js', `window.addEventListener('load', () => {
  document.body.classList.add('cargado')
})`],
    ['css', `.cargado .preloader {
  opacity: 0;
  pointer-events: none;
}`],
  ],

  // Rendimiento y buenas prácticas
  'Animar transform/opacity': css(`/* sí: la GPU las compone sin tocar la página */
.card { transition: transform .3s, opacity .3s }
.card:hover { transform: translateY(-4px) }

/* no: obliga a rehacer la maquetación entera */
.card:hover { top: -4px; width: 320px }`),

  'will-change': css(`/* solo mientras haga falta: dejarlo puesto
   gasta memoria de vídeo para nada */
.card:hover { will-change: transform }`),

  'Core Web Vitals': js(`new PerformanceObserver((lista) => {
  const ultima = lista.getEntries().at(-1)
  console.log('LCP', ultima.startTime)
}).observe({
  type: 'largest-contentful-paint',
  buffered: true,
})`),

  'prefers-reduced-motion': css(`@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}`),

  'Progressive enhancement': css(`/* sin soporte, la tarjeta se ve sin animar */
@supports (animation-timeline: view()) {
  .card { animation-timeline: view() }
}`),

  'Responsive / mobile-first': css(`.grid {
  display: grid;
  grid-template-columns: 1fr;
}

@media (min-width: 48rem) {
  .grid { grid-template-columns: repeat(3, 1fr) }
}`),

  'Lazy loading': html(`<img src="foto.jpg" alt=""
     loading="lazy" decoding="async"
     width="800" height="600">`),

  'Debounce y throttle': js(`const debounce = (fn, ms = 200) => {
  let id
  return (...args) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), ms)
  }
}`),

  requestAnimationFrame: js(`function bucle(t) {
  mover(t)
  requestAnimationFrame(bucle)
}
requestAnimationFrame(bucle)`),

  // CSS moderno
  'Container queries': css(`.card { container-type: inline-size }

@container (min-width: 30rem) {
  .titulo { font-size: 2rem }
}`),

  'Fluid typography': css(`h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
}`),

  ':has()': css(`.card:has(img) { padding: 0 }

form:has(input:invalid) .enviar {
  opacity: .5;
  pointer-events: none;
}`),

  'Cascade layers': css(`@layer base, componentes, utilidades;

@layer componentes { .btn { color: white } }
@layer utilidades  { .btn { color: black } }

/* gana utilidades: manda el orden de las capas */`),

  'color-mix()': css(`.btn:hover {
  background: color-mix(in oklab,
    var(--marca) 80%, white);
}`),

  Subgrid: css(`/* los títulos se alinean entre tarjetas */
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}`),

  'Logical properties': css(`.caja {
  margin-inline: auto;
  padding-block: 1rem;
  border-inline-start: 2px solid;
}`),
}
