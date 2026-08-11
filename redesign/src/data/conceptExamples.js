// Un ejemplo real y corto por concepto: lo mínimo que hay que escribir para
// que la técnica funcione. Se muestra en la tarjeta, bajo la explicación.
export const CONCEPT_EXAMPLES = {
  // Scroll interactivo
  'Smooth scroll': `const lenis = new Lenis({ lerp: 0.1 })

function raf(t) {
  lenis.raf(t)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)`,

  Parallax: `addEventListener('scroll', () => {
  fondo.style.transform = \`translateY(\${scrollY * 0.4}px)\`
}, { passive: true })`,

  'Scroll Snap': `.contenedor {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
}
.seccion { scroll-snap-align: start; height: 100dvh }`,

  'Scroll-driven animations': `@keyframes entrar {
  from { opacity: 0; translate: 0 40px }
}
.card {
  animation: entrar linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}`,

  'Scroll reveal': `const io = new IntersectionObserver(([e]) => {
  if (e.isIntersecting) e.target.classList.add('visible')
}, { threshold: 0.2 })

document.querySelectorAll('.reveal').forEach(el => io.observe(el))`,

  'Sticky / Pin': `.panel {
  position: sticky;
  top: 0;
  height: 100dvh;
}`,

  'Horizontal scroll': `gsap.to(pista, {
  x: () => -(pista.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: { trigger: seccion, pin: true, scrub: 1,
    end: () => '+=' + pista.scrollWidth },
})`,

  Marquee: `.pista {
  display: flex;
  animation: correr 18s linear infinite;
}
@keyframes correr { to { transform: translateX(-50%) } }`,

  Scrollytelling: `const avance = (scrollY - inicio) / (fin - inicio)
escena.progreso = Math.min(Math.max(avance, 0), 1)`,

  'Page transitions': `if (!document.startViewTransition) return pintar()

document.startViewTransition(() => pintar())`,

  // Puntero y micro-interacciones
  'Tilt 3D': `card.onpointermove = e => {
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.transform =
    \`perspective(800px) rotateY(\${x * 16}deg) rotateX(\${-y * 16}deg)\`
}`,

  'Hover magnético': `boton.onpointermove = e => {
  const r = boton.getBoundingClientRect()
  const dx = e.clientX - r.left - r.width / 2
  const dy = e.clientY - r.top - r.height / 2
  boton.style.translate = \`\${dx * 0.3}px \${dy * 0.3}px\`
}
boton.onpointerleave = () => boton.style.translate = '0 0'`,

  'Cursor personalizado (lerp)': `function bucle() {
  x += (ratonX - x) * 0.15   // persigue sin llegar nunca del todo
  y += (ratonY - y) * 0.15
  cursor.style.transform = \`translate(\${x}px, \${y}px)\`
  requestAnimationFrame(bucle)
}`,

  'Micro-interacciones': `.btn {
  transition: transform .18s ease, background .18s ease;
}
.btn:hover { transform: translateY(-2px) }
.btn:active { transform: scale(.96) }`,

  'Cursor blend': `.cursor {
  mix-blend-mode: difference;
  background: #fff;
  pointer-events: none;
}`,

  'Spotlight / glow': `card.onpointermove = e => {
  card.style.setProperty('--x', e.offsetX + 'px')
  card.style.setProperty('--y', e.offsetY + 'px')
}

/* css */
.card { background: radial-gradient(
  260px circle at var(--x) var(--y), #6366f133, transparent 60%) }`,

  // Estética y efectos
  Glassmorphism: `.panel {
  backdrop-filter: blur(12px) saturate(1.4);
  background: rgb(255 255 255 / .08);
  border: 1px solid rgb(255 255 255 / .12);
}`,

  Neumorphism: `.btn {
  background: #e0e5ec;
  box-shadow: 8px 8px 16px #b8bec7, -8px -8px 16px #ffffff;
}`,

  'Aurora / mesh gradient': `.fondo {
  background:
    radial-gradient(at 20% 30%, #6366f1 0, transparent 50%),
    radial-gradient(at 80% 20%, #22d3ee 0, transparent 50%),
    radial-gradient(at 60% 80%, #a855f7 0, transparent 50%);
}`,

  'Clip-path y máscaras': `.foto { clip-path: polygon(0 0, 100% 6%, 100% 100%, 0 94%) }

.desvanece { mask-image: linear-gradient(#000 60%, transparent) }`,

  'View Transitions': `/* css */
.hero { view-transition-name: hero }

/* js */
document.startViewTransition(() => cambiarDeVista())`,

  'Skeleton loaders': `.skeleton {
  background: linear-gradient(90deg, #27272a, #3f3f46, #27272a);
  background-size: 200% 100%;
  animation: brillo 1.4s ease-in-out infinite;
}
@keyframes brillo { to { background-position: -200% 0 } }`,

  'Tipografía cinética': `const partido = new SplitText(titulo, { type: 'chars' })

gsap.from(partido.chars, { y: 40, opacity: 0, stagger: 0.03 })`,

  'Noise / grain': `<svg width="0" height="0">
  <filter id="grano"><feTurbulence baseFrequency=".8"/></filter>
</svg>

/* css */
.grano::after { content: ''; position: absolute; inset: 0;
  filter: url(#grano); opacity: .06; pointer-events: none }`,

  Preloader: `addEventListener('load', () => {
  document.body.classList.add('cargado')
})

/* css */
.cargado .preloader { opacity: 0; pointer-events: none }`,

  // Rendimiento y buenas prácticas
  'Animar transform/opacity': `/* sí: la GPU las compone, no recalculan la página */
.card { transition: transform .3s, opacity .3s }

/* no: left, top, width y height obligan a recalcular el diseño */`,

  'will-change': `.card:hover { will-change: transform }

/* solo mientras haga falta: dejarlo puesto gasta memoria de vídeo */`,

  'Core Web Vitals': `new PerformanceObserver(lista => {
  console.log('LCP', lista.getEntries().at(-1).startTime)
}).observe({ type: 'largest-contentful-paint', buffered: true })`,

  'prefers-reduced-motion': `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: .01ms !important;
    transition-duration: .01ms !important;
  }
}`,

  'Progressive enhancement': `@supports (animation-timeline: view()) {
  .card { animation-timeline: view() }
}

/* sin soporte, la tarjeta simplemente se ve sin animar */`,

  'Responsive / mobile-first': `.grid { display: grid; grid-template-columns: 1fr }

@media (min-width: 48rem) {
  .grid { grid-template-columns: repeat(3, 1fr) }
}`,

  'Lazy loading': `<img src="foto.jpg" loading="lazy" decoding="async"
     width="800" height="600" alt="">`,

  'Debounce y throttle': `const debounce = (fn, ms = 200) => {
  let id
  return (...args) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), ms)
  }
}`,

  requestAnimationFrame: `function bucle(t) {
  mover(t)
  requestAnimationFrame(bucle)
}
requestAnimationFrame(bucle)`,

  // CSS moderno
  'Container queries': `.card { container-type: inline-size }

@container (min-width: 30rem) {
  .titulo { font-size: 2rem }
}`,

  'Fluid typography': `h1 { font-size: clamp(2rem, 5vw + 1rem, 4.5rem) }`,

  ':has()': `.card:has(img) { padding: 0 }

form:has(input:invalid) .enviar { opacity: .5; pointer-events: none }`,

  'Cascade layers': `@layer base, componentes, utilidades;

@layer componentes { .btn { color: white } }
@layer utilidades  { .btn { color: black } }  /* esta gana */`,

  'color-mix()': `.btn:hover {
  background: color-mix(in oklab, var(--marca) 80%, white);
}`,

  Subgrid: `.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;   /* los títulos se alinean entre tarjetas */
}`,

  'Logical properties': `.caja {
  margin-inline: auto;
  padding-block: 1rem;
  border-inline-start: 2px solid;
}`,
}
