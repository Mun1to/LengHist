import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import CodeWindow from './CodeWindow'
import Logo from './Logo'
import { rutaDe } from '../lib/rutas'

// El objeto 3D en ASCII no depende de funciones experimentales: se ve en
// cualquier navegador, así que sirve de escaparate en la portada. Y es una pieza
// real del catálogo, no una ilustración: lo que la portada enseña es el producto.
const AsciiObject = lazy(() => import('./canvasui/AsciiObject'))

const aparece = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

// flex-col porque los botones centran su contenido en vertical: la tarjeta con
// una línea menos de texto quedaba desalineada respecto a sus vecinas.
function Seccion({ n, titulo, texto, a }) {
  return (
    <Link
      to={a}
      className="group pulsable pulsable-suave alzable flex flex-col text-left p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-lg hover:shadow-zinc-900/5 dark:hover:shadow-black/30"
    >
      <div className="font-mono text-3xl font-bold text-indigo-600 dark:text-indigo-400">{n}</div>
      <div className="font-bold text-zinc-900 dark:text-zinc-50 mt-2 flex items-center gap-1.5">
        {titulo}
        <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{texto}</div>
    </Link>
  )
}

export default function LandingView({ t, lang, onQuiz, totals }) {
  return (
    <div>
      <section className="relative overflow-hidden px-6 sm:px-10 py-16 sm:py-24">
        {/* Un solo resplandor, sin mezcla de capas. Antes había tres (dos
            radiales, rejilla de puntos y grano) con mix-blend-overlay, que se
            anulaban entre ellas: el fondo salía negro plano en oscuro y blanco
            plano en claro, o sea trabajo de pintado para cero píxeles. */}
        <div className="absolute inset-0 -z-10 pointer-events-none resplandor" />

        <div className="relative grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center max-w-6xl mx-auto">
          <div>
            <motion.div {...aparece()} className="text-zinc-900 dark:text-white mb-7">
              <Logo size={44} wide />
            </motion.div>

            <motion.h1
              {...aparece(0.1)}
              className="text-[2.4rem] sm:text-[3.1rem] leading-[1.08] font-extrabold tracking-tight text-balance text-zinc-900 dark:text-zinc-50 mb-5"
            >
              {t.heroTitle1}
              <span className="block text-indigo-600 dark:text-indigo-400">{t.heroTitle2}</span>
            </motion.h1>

            {/* Las cuatro promesas ya no van sueltas encima del titular: cierran
                la descripción, que es donde se leen como parte de la frase. */}
            <motion.p {...aparece(0.15)} className="text-zinc-600 dark:text-zinc-400 text-lg max-w-lg mb-8 leading-relaxed">
              {t.heroSub}{' '}
              <span className="text-zinc-900 dark:text-zinc-200 font-semibold">{t.heroClaims}</span>
            </motion.p>

            <motion.div {...aparece(0.2)} className="flex flex-wrap items-center gap-4">
              <Link
                to={rutaDe('languages')}
                className="grupo-cta pulsable alzable inline-flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-6 py-3 text-sm hover:shadow-lg hover:shadow-zinc-900/20 dark:hover:shadow-white/10"
              >
                {t.exploreBtn}
                <ArrowRight size={15} className="flecha-desliza" />
              </Link>
              <button
                onClick={onQuiz}
                className="pulsable text-sm font-semibold text-zinc-600 dark:text-zinc-300 border-b border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer pb-0.5"
              >
                {t.testBtn}
              </button>
            </motion.div>
          </div>

          {/* La portada la ocupa una pieza viva del catálogo, no una ilustración
              de una pieza viva del catálogo. */}
          <motion.div {...aparece(0.25)}>
            <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
              <Suspense fallback={<div className="absolute inset-0 grid place-items-center font-mono text-xs text-zinc-500">{t.compLoading}</div>}>
                <AsciiObject
                  src="/brand/logo-blanco.svg"
                  cellSize={7}
                  scale={3.6}
                  autoRotate
                  autoRotateSpeed={1.2}
                  highlight="#4f46e5"
                  style={{ position: 'absolute', inset: 0 }}
                />
              </Suspense>
            </div>
            <Link
              to={rutaDe('components', 'ascii-object')}
              className="inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] text-zinc-400 dark:text-zinc-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              {t.heroDemo}
              <ArrowRight size={11} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="px-6 sm:px-10 pb-20 max-w-6xl mx-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
          {t.landingWhat}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Seccion n={totals.langs} titulo={t.nav.languages} texto={t.landingLangs} a={rutaDe('languages')} />
          <Seccion n={totals.res} titulo={t.nav.resources} texto={t.landingRes} a={rutaDe('resources')} />
          <Seccion n={totals.concepts} titulo={t.nav.concepts} texto={t.landingConcepts} a={rutaDe('concepts')} />
          <Seccion n={totals.comps} titulo={t.nav.components} texto={t.landingComps} a={rutaDe('components')} />
          <Seccion n={totals.skills} titulo={t.nav.skills} texto={t.landingSkills} a={rutaDe('skills')} />
          <Seccion n={totals.consejos} titulo={t.nav.consejos} texto={t.landingConsejos} a={rutaDe('consejos')} />
        </div>
      </section>

      {/* El otro bloque enseña la otra mitad del catálogo: el código real de cada
          lenguaje, que también se toca (cuatro pestañas, cuatro ejemplos). */}
      <section className="px-6 sm:px-10 pb-24 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <CodeWindow lang={lang} />
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              {t.landingCodeTitle}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">{t.landingCodeText}</p>
            <Link
              to={rutaDe('languages')}
              className="grupo-cta pulsable inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b border-indigo-500/40 hover:border-indigo-500 pb-0.5"
            >
              {t.landingCodeCta}
              <ArrowRight size={14} className="flecha-desliza" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-8 border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto font-mono text-[11px] text-zinc-400 dark:text-zinc-600">
          {t.stats({ langs: totals.langs, res: totals.res, concepts: totals.concepts, skills: totals.skills })}
        </div>
      </footer>
    </div>
  )
}
