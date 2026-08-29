// The same 41 examples as conceptExamples.js, with comments and variable names
// in English. They are keyed by the Spanish concept name, which is the internal
// key: what gets translated is the content.

const js = (code) => [['js', code]]
const css = (code) => [['css', code]]
const html = (code) => [['html', code]]

export const CONCEPT_EXAMPLES_EN = {
  // Interactive scroll
  'Smooth scroll': js(`const lenis = new Lenis({ lerp: 0.1 })

function raf(t) {
  lenis.raf(t)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)`),

  Parallax: js(`window.addEventListener('scroll', () => {
  const y = window.scrollY
  backdrop.style.transform = \`translateY(\${y * 0.4}px)\`
}, { passive: true })`),

  'Scroll Snap': css(`.container {
  scroll-snap-type: y mandatory;
  overflow-y: auto;
}
.section {
  scroll-snap-align: start;
  height: 100dvh;
}`),

  'Scroll-driven animations': css(`@keyframes enter {
  from { opacity: 0; translate: 0 40px }
}
.card {
  animation: enter linear both;
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
gsap.to(track, {
  x: () => -(track.scrollWidth - innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: section,
    pin: true,
    scrub: 1,
    end: () => '+=' + track.scrollWidth,
  },
})`),

  Marquee: css(`.track {
  display: flex;
  animation: run 18s linear infinite;
}
@keyframes run {
  to { transform: translateX(-50%) }
}`),

  Scrollytelling: js(`// 0 as the scene enters, 1 once it has left
const box = scene.getBoundingClientRect()
const raw = -box.top / (box.height - innerHeight)
const p = Math.min(Math.max(raw, 0), 1)

shape.style.scale = 1 + p
shape.style.rotate = p * 180 + 'deg'`),

  'Page transitions': js(`if (!document.startViewTransition) {
  return render()
}

document.startViewTransition(() => render())`),

  // Pointer and micro-interactions
  'Tilt 3D': js(`card.onpointermove = (e) => {
  const r = card.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width - 0.5
  const y = (e.clientY - r.top) / r.height - 0.5
  card.style.transform = \`perspective(800px)
    rotateY(\${x * 16}deg) rotateX(\${-y * 16}deg)\`
}`),

  'Hover magnético': js(`button.onpointermove = (e) => {
  const r = button.getBoundingClientRect()
  const dx = e.clientX - r.left - r.width / 2
  const dy = e.clientY - r.top - r.height / 2
  button.style.translate = \`\${dx * 0.3}px \${dy * 0.3}px\`
}

button.onpointerleave = () => {
  button.style.translate = '0 0'
}`),

  'Cursor personalizado (lerp)': js(`function loop() {
  // chases without ever catching up
  x += (mouseX - x) * 0.15
  y += (mouseY - y) * 0.15
  cursor.style.transform = \`translate(\${x}px, \${y}px)\`
  requestAnimationFrame(loop)
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
    at var(--x) var(--y), #3b82f633, transparent 60%);
}`],
  ],

  // Aesthetics and effects
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

  'Aurora / mesh gradient': css(`.backdrop {
  background:
    radial-gradient(at 20% 30%, #3b82f6 0, transparent 50%),
    radial-gradient(at 80% 20%, #22d3ee 0, transparent 50%),
    radial-gradient(at 60% 80%, #a855f7 0, transparent 50%);
}`),

  'Clip-path y máscaras': css(`.photo {
  clip-path: polygon(0 0, 100% 6%, 100% 100%, 0 94%);
}

.fade {
  mask-image: linear-gradient(#000 60%, transparent);
}`),

  'View Transitions': [
    ['css', `.hero { view-transition-name: hero }`],
    ['js', `document.startViewTransition(() => renderNextView())`],
  ],

  'Skeleton loaders': css(`/* flat: a still block, nothing to repaint */
.skeleton {
  background: #27272a;
  border-radius: 4px;
}

/* with shimmer: the gradient runs across the block */
.skeleton-shimmer {
  background: linear-gradient(90deg,
    #27272a, #3f3f46, #27272a);
  background-size: 200% 100%;
  animation: shine 1.4s ease-in-out infinite;
}
@keyframes shine {
  to { background-position: -200% 0 }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer { animation: none }
}`),

  'Tipografía cinética': [
    ['js', `title.innerHTML = [...title.textContent]
  .map((c, i) => \`<span style="--i:\${i}">\${c}</span>\`)
  .join('')`],
    ['css', `.title span {
  display: inline-block;
  animation: rise .6s both;
  animation-delay: calc(var(--i) * 45ms);
}
@keyframes rise {
  from { opacity: 0; translate: 0 16px }
}`],
  ],

  'Noise / grain': [
    ['html', `<svg width="0" height="0">
  <filter id="grain">
    <feTurbulence baseFrequency=".8" />
  </filter>
</svg>`],
    ['css', `.grain::after {
  content: '';
  position: absolute;
  inset: 0;
  filter: url(#grain);
  opacity: .06;
  pointer-events: none;
}`],
  ],

  Preloader: [
    ['js', `window.addEventListener('load', () => {
  document.body.classList.add('loaded')
})`],
    ['css', `.loaded .preloader {
  opacity: 0;
  pointer-events: none;
}`],
  ],

  // Performance and best practices
  'Animar transform/opacity': css(`/* yes: the GPU composites them, no layout work */
.card { transition: transform .3s, opacity .3s }
.card:hover { transform: translateY(-4px) }

/* no: this forces the whole layout to be redone */
.card:hover { top: -4px; width: 320px }`),

  'will-change': css(`/* only while needed: leaving it on burns
   video memory for nothing */
.card:hover { will-change: transform }`),

  'Core Web Vitals': js(`new PerformanceObserver((list) => {
  const last = list.getEntries().at(-1)
  console.log('LCP', last.startTime)
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

  'Progressive enhancement': css(`/* without support the card just shows up */
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

  'Lazy loading': html(`<img src="photo.jpg" alt=""
     loading="lazy" decoding="async"
     width="800" height="600">`),

  'Debounce y throttle': js(`const debounce = (fn, ms = 200) => {
  let id
  return (...args) => {
    clearTimeout(id)
    id = setTimeout(() => fn(...args), ms)
  }
}`),

  requestAnimationFrame: js(`function loop(t) {
  move(t)
  requestAnimationFrame(loop)
}
requestAnimationFrame(loop)`),

  // Modern CSS
  'Container queries': css(`.card { container-type: inline-size }

@container (min-width: 30rem) {
  .title { font-size: 2rem }
}`),

  'Fluid typography': css(`h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4.5rem);
}`),

  ':has()': css(`.card:has(img) { padding: 0 }

form:has(input:invalid) .submit {
  opacity: .5;
  pointer-events: none;
}`),

  'Cascade layers': css(`@layer base, components, utilities;

@layer components { .btn { color: white } }
@layer utilities  { .btn { color: black } }

/* utilities wins: layer order decides */`),

  'color-mix()': css(`.btn:hover {
  background: color-mix(in oklab,
    var(--brand) 80%, white);
}`),

  Subgrid: css(`/* titles line up across cards */
.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}`),

  'Logical properties': css(`.box {
  margin-inline: auto;
  padding-block: 1rem;
  border-inline-start: 2px solid;
}`),
}
