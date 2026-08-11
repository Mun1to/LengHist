import { lazy, Suspense } from 'react'

// Componentes originales de canvasui.dev: shaders pesados (dos con three.js),
// así que se descargan solo cuando alguien los mira, no en la carga inicial.
const Bubble = lazy(() => import('./canvasui/Bubble'))
const Cloth = lazy(() => import('./canvasui/Cloth'))
const DitheredObject = lazy(() => import('./canvasui/DitheredObject'))
const Asciify = lazy(() => import('./canvasui/Asciify'))
const Peel = lazy(() => import('./canvasui/Peel'))
const Bend = lazy(() => import('./canvasui/Bend'))
const AsciiObject = lazy(() => import('./canvasui/AsciiObject'))
const Laser = lazy(() => import('./canvasui/Laser'))
const ParticleScroll = lazy(() => import('./canvasui/ParticleScroll'))

// Visuales de arlan.me/vault: motores propios, montados por su puente.
const ChromaGlowDemo = lazy(() => import('./arlan/ArlanDemos').then((m) => ({ default: m.ChromaGlowDemo })))
const EmbossDemo = lazy(() => import('./arlan/ArlanDemos').then((m) => ({ default: m.EmbossDemo })))
const ColorDepthDemo = lazy(() => import('./arlan/colorDepth/ColorDepthDemo'))

const SAMPLE = [
  { name: 'Python', year: 1991, color: '#4f81bd' },
  { name: 'Rust', year: 2010, color: '#d97757' },
  { name: 'TypeScript', year: 2012, color: '#3178c6' },
  { name: 'Go', year: 2009, color: '#00add8' },
  { name: 'Kotlin', year: 2011, color: '#a97bff' },
  { name: 'Swift', year: 2014, color: '#f05138' },
  { name: 'Elixir', year: 2011, color: '#a06bd6' },
  { name: 'Zig', year: 2016, color: '#f7a41d' },
  { name: 'Julia', year: 2012, color: '#4caf50' },
  { name: 'Lua', year: 1993, color: '#2c2d72' },
  { name: 'Haskell', year: 1990, color: '#5e5086' },
  { name: 'C', year: 1972, color: '#a8b9cc' },
]

// Una foto con detalle da mucho más juego a estos efectos que un bloque de
// texto: la trama, el ASCII y los pliegues necesitan algo que deformar.
// Una distinta por componente, o en la rejilla parecerían la misma tarjeta.
const PHOTOS = {
  bubble: '/demo/paisaje-1.jpg',
  cloth: '/demo/paisaje-2.jpg',
  asciify: '/demo/paisaje-3.jpg',
  peel: '/demo/paisaje-4.jpg',
  bend: '/demo/paisaje-5.jpg',
  laser: '/demo/paisaje-2.jpg',
  particleScroll: '/demo/paisaje-3.jpg',
}
const PHOTO = PHOTOS.bubble

function DemoContent({ compact, photo = PHOTO }) {
  return (
    <div className="relative w-full h-full overflow-hidden bg-zinc-900">
      <img src={photo} alt="" className="absolute inset-0 w-full h-full object-cover" draggable="false" />
      <div className={`absolute left-0 bottom-0 text-white ${compact ? 'p-3' : 'p-6'}`}
           style={{ textShadow: '0 1px 12px rgba(0,0,0,.75)' }}>
        <div className={`font-extrabold tracking-tight ${compact ? 'text-base' : 'text-2xl'}`}>Vibeset</div>
        <div className={`font-mono opacity-80 ${compact ? 'text-[10px]' : 'text-xs'}`}>
          100 lenguajes · 64 recursos · 41 conceptos
        </div>
      </div>
    </div>
  )
}

// Contenido alto, para los efectos que necesitan que haya scroll de verdad.
function TallContent({ compact, photo = PHOTO }) {
  return (
    <div className="w-full bg-zinc-900 text-zinc-100">
      <img src={photo} alt="" className={`w-full object-cover ${compact ? 'h-32' : 'h-64'}`} draggable="false" />
      <div className={compact ? 'p-4' : 'p-8'}>
        <div className="flex flex-col gap-2">
          {SAMPLE.map((l) => (
            <div key={l.name} className="flex items-center justify-between gap-4 border-b border-zinc-800 pb-2">
              <span className="font-bold" style={{ color: l.color }}>{l.name}</span>
              <span className={`font-mono text-zinc-500 ${compact ? 'text-[10px]' : 'text-xs'}`}>{l.year}</span>
            </div>
          ))}
        </div>
      </div>
      <img src={photo} alt="" className={`w-full object-cover ${compact ? 'h-32' : 'h-64'}`} draggable="false" />
    </div>
  )
}

// La capa que asoma cuando el Peel levanta la portada.
function UnderContent({ compact }) {
  return (
    <div className={`w-full h-full bg-indigo-600 text-white ${compact ? 'p-4' : 'p-8'}`}>
      <div className={`font-extrabold tracking-tight ${compact ? 'text-base' : 'text-2xl'}`}>
        Debajo está el catálogo.
      </div>
      <div className={`opacity-80 mt-2 ${compact ? 'text-[11px]' : 'text-sm'}`}>
        100 lenguajes · 64 recursos · 41 conceptos
      </div>
    </div>
  )
}

// Los componentes de canvasui aplican `position: relative` en el style inline,
// que gana a cualquier clase: hay que estirarlos desde el propio style.
const FILL = { position: 'absolute', inset: 0 }

function Loading({ t }) {
  return (
    <div className="absolute inset-0 grid place-items-center font-mono text-xs text-zinc-500">
      {t.compLoading}
    </div>
  )
}

export default function ComponentDemo({ item, values, lang, compact = false, t }) {
  if (item.key === 'bubble') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Bubble {...values} style={FILL} className="cursor-none">
          <DemoContent compact={compact} photo={PHOTOS.bubble} />
        </Bubble>
      </Suspense>
    )
  }

  if (item.key === 'cloth') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Cloth {...values} style={FILL}>
          <DemoContent compact={compact} photo={PHOTOS.cloth} />
        </Cloth>
      </Suspense>
    )
  }

  if (item.key === 'dithered') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <DitheredObject {...values} style={FILL} />
      </Suspense>
    )
  }

  if (item.key === 'asciiObject') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <AsciiObject {...values} style={FILL} />
      </Suspense>
    )
  }

  if (item.key === 'asciify') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Asciify {...values} style={FILL}>
          <DemoContent compact={compact} photo={PHOTOS.asciify} />
        </Asciify>
      </Suspense>
    )
  }

  if (item.key === 'peel') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Peel {...values} style={FILL} under={<UnderContent compact={compact} />}>
          <DemoContent compact={compact} photo={PHOTOS.peel} />
        </Peel>
      </Suspense>
    )
  }

  if (item.key === 'laser') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Laser {...values} style={FILL}>
          <TallContent compact={compact} photo={PHOTOS.laser} />
        </Laser>
      </Suspense>
    )
  }

  if (item.key === 'particleScroll') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <ParticleScroll {...values} style={FILL}>
          <TallContent compact={compact} photo={PHOTOS.particleScroll} />
        </ParticleScroll>
      </Suspense>
    )
  }

  if (item.key === 'chromaGlow') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <ChromaGlowDemo values={values} />
      </Suspense>
    )
  }

  if (item.key === 'emboss') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <EmbossDemo values={values} />
      </Suspense>
    )
  }

  if (item.key === 'colorDepth') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <ColorDepthDemo values={values} compact={compact} />
      </Suspense>
    )
  }

  if (item.key === 'bend') {
    return (
      <Suspense fallback={<Loading t={t} />}>
        <Bend {...values} style={FILL}>
          <TallContent compact={compact} photo={PHOTOS.bend} />
        </Bend>
      </Suspense>
    )
  }

  return null
}
