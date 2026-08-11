import { useEffect, useRef } from 'react'
import { ChromaGlow } from './chroma/engine'
import { EmbossPlayground } from './emboss/pg-engine'

// Los visuales de arlan.me no son componentes React: son clases que se montan
// sobre un div y reciben parámetros por setParams. Este puente los conecta con
// el panel de controles de Vibeset.

// Los motores vienen con la fuente del sitio original ("var(--font-neue-corp)"),
// que aquí no existe: como valor de canvas es inválido y el texto se dibuja a 10px.
// Hay que darles una familia real.
const FUENTE = "'Inter', system-ui, sans-serif"

const hexARgb = (h) => {
  const n = String(h).replace('#', '')
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2) || '0', 16) / 255)
}

export function ChromaGlowDemo({ values }) {
  const hostRef = useRef(null)
  const engineRef = useRef(null)

  const params = {
    word: values.word,
    bloom: values.bloom,
    split: values.split,
    core: values.core,
    noise: values.noise,
    spectral: values.spectral,
    warm: hexARgb(values.warm),
    cool: hexARgb(values.cool),
    red: hexARgb(values.fringe),
    bg: hexARgb(values.bg),
    invert: false,
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const eng = new ChromaGlow(host, params)
    if (!eng.ok) return
    engineRef.current = eng
    eng.setFont(FUENTE)
    eng.start()
    const onResize = () => eng.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      eng.destroy()
      engineRef.current = null
    }
    // solo al montar: los cambios entran por setParams
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { engineRef.current?.setParams(params) })

  return <div ref={hostRef} className="absolute inset-0" />
}

export function EmbossDemo({ values }) {
  const hostRef = useRef(null)
  const engineRef = useRef(null)

  const params = {
    depth: values.depth,
    size: values.size,
    soften: values.soften,
    angle: values.angle,
    altitude: values.altitude,
    highlight: values.highlight,
    shadow: values.shadow,
    contrast: values.contrast,
    bright: values.bright,
    tint: hexARgb(values.tint),
    texOffset: [0.4, 0.15],
    texScale: values.texScale,
  }
  const content = { word: values.word, svg: null }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    const eng = new EmbossPlayground(host, params, content)
    if (!eng.ok) return
    engineRef.current = eng
    eng.setFont(FUENTE)
    const onResize = () => eng.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      eng.destroy()
      engineRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => { engineRef.current?.setParams(params) })
  useEffect(() => { engineRef.current?.setContent(content) }, [values.word])

  return <div ref={hostRef} className="absolute inset-0" />
}
