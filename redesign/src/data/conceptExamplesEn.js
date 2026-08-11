// Los mismos 41 ejemplos de conceptExamples.js, con los comentarios y los
// nombres de variable en inglés. Se indexan por el nombre español del concepto,
// que es la clave interna: lo que se ve traducido es el contenido.
export const CONCEPT_EXAMPLES_EN = {
  // Interactive scroll
  'Smooth scroll': `const lenis = new Lenis({ lerp: 0.1 })

function raf(t) {
  lenis.raf(t)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)`,

  Parallax: `addEventListener('scroll', () => {
  backdrop.style.transform = \`translateY(\${scrollY * 0.4}px)\`
}, { passive: true })`,

  'Scroll Snap': `.container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
}
.section { scroll-snap-align: start; height: 100dvh }`,

  'Scroll-driven animations': `@keyframes enter {
  from { opacity: 0; translate: 0 40px }
}
.card {
  animation: enter linear both;
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

  'Horizontal scroll': `gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: { trigger: section, pin: true, scrub: 1,
    end: () => '+=' + track.scrollWidth },
})`,

  Marquee: `.track {
  display: flex;
  animation: run 18s linear infinite;
}
@keyframes run { to { transform: translateX(-50%) } }`,

  Scrollytelling: `const progress = (scrollY - start) / (end - start)
scene.progress = Math.min(Math.max(progress, 0), 1)`,

  'Page transitions': `if (!document.startViewTransition) return render()

document.startViewTransition(() => render())`,

  // Pointer and micro-interactions
  'Tilt 3D': `card.onpointermove = e => {
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.transform =
    \`perspective(800px) rotateY(\${x * 16}deg) rotateX(\${-y * 16}deg)\`
}`,

  'Hover magnético': `button.onpointermove = e => {
  const r = button.getBoundingClientRect()
  const dx = e.clientX - r.left - r.width / 2
  const dy = e.clientY - r.top - r.height / 2
  button.style.translate = \`\${dx * 0.3}px \${dy * 0.3}px\`
}
button.onpointerleave = () => button.style.translate = '0 0'`,

  'Cursor personalizado (lerp)': `function loop() {
  x += (mouseX - x) * 0.15   // chases without ever catching up
  y += (mouseY - y) * 0.15
  cursor.style.transform = \`translate(\${x}px, \${y}px)\`
  requestAnimationFrame(loop)
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

  // Aesthetics and effects
  Glassmorphism: `.panel {
  backdrop-filter: blur(12px) saturate(1.4);
  background: rgb(255 255 255 / .08);
  border: 1px solid rgb(255 255 255 / .12);
}`,

  Neumorphism: `.btn {
  background: #e0e5ec;
  box-shadow: 8px 8px 16px #b8bec7, -8px -8px 16px #ffffff;
}`,

  'Aurora / mesh gradient': `.backdrop {
  background:
    radial-gradient(at 20% 30%, #6366f1 0, transparent 50%),
    radial-gradient(at 80% 20%, #22d3ee 0, transparent 50%),
    radial-gradient(at 60% 80%, #a855f7 0, transparent 50%);
}`,

  'Clip-path y máscaras': `.photo { clip-path: polygon(0 0, 100% 6%, 100% 100%, 0 94%) }

.fade { mask-image: linear-gradient(#000 60%, transparent) }`,

  'View Transitions': `/* css */
.hero { view-transition-name: hero }

/* js */
document.startViewTransition(() => renderNextView())`,

  'Skeleton loaders': `.skeleton {
  background: linear-gradient(90deg, #27272a, #3f3f46, #27272a);
  background-size: 200% 100%;
  animation: shine 1.4s ease-in-out infinite;
}
@keyframes shine { to { background-position: -200% 0 } }`,

  'Tipografía cinética': `const split = new SplitText(title, { type: 'chars' })

gsap.from(split.chars, { y: 40, opacity: 0, stagger: 0.03 })`,

  'Noise / grain': `<svg width="0" height="0">
  <filter id="grain"><feTurbulence baseFrequency=".8"/></filter>
</svg>

/* css */
.grain::after { content: ''; position: absolute; inset: 0;
  filter: url(#grain); opacity: .06; pointer-events: none }`,

  Preloader: `addEventListener('load', () => {
  document.body.classList.add('loaded')
})

/* css */
.loaded .preloader { opacity: 0; pointer-events: none }`,

  // Performance and best practices
  'Animar transform/opacity': `/* yes: the GPU composites them, no layout work */
.card { transition: transform .3s, opacity .3s }

/* no: left, top, width and height force a relayout */`,

  'will-change': `.card:hover { will-change: transform }

/* only while needed: leaving it on burns video memory */`,

  'Core Web Vitals': `new PerformanceObserver(list => {
  console.log('LCP', list.getEntries().at(-1).startTime)
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

/* without support, the card simply shows up unanimated */`,

  'Responsive / mobile-first': `.grid { display: grid; grid-template-columns: 1fr }

@media (min-width: 48rem) {
  .grid { grid-template-columns: repeat(3, 1fr) }
}`,

  'Lazy loading': `<img src="photo.jpg" loading="lazy" decoding="async"
     width="800" height="600" alt="">`,

  'Debounce y throttle': `const debounce = (fn, ms = 200) => {
  let id
  return (...args) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), ms)
  }
}`,

  requestAnimationFrame: `function loop(t) {
  move(t)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)`,

  // Modern CSS
  'Container queries': `.card { container-type: inline-size }

@container (min-width: 30rem) {
  .title { font-size: 2rem }
}`,

  'Fluid typography': `h1 { font-size: clamp(2rem, 5vw + 1rem, 4.5rem) }`,

  ':has()': `.card:has(img) { padding: 0 }

form:has(input:invalid) .submit { opacity: .5; pointer-events: none }`,

  'Cascade layers': `@layer base, components, utilities;

@layer components { .btn { color: white } }
@layer utilities  { .btn { color: black } }  /* this one wins */`,

  'color-mix()': `.btn:hover {
  background: color-mix(in oklab, var(--brand) 80%, white);
}`,

  Subgrid: `.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;   /* titles line up across cards */
}`,

  'Logical properties': `.box {
  margin-inline: auto;
  padding-block: 1rem;
  border-inline-start: 2px solid;
}`,
}
