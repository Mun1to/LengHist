import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import CodeWindow from './CodeWindow'
import Logo from './Logo'

// El objeto 3D en ASCII no depende de funciones experimentales: se ve en
// cualquier navegador, así que sirve de escaparate en la portada.
const AsciiObject = lazy(() => import('./canvasui/AsciiObject'))

const aparece = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: 'easeOut' },
})

// flex-col porque los botones centran su contenido en vertical: la tarjeta con
// una línea menos de texto quedaba desalineada respecto a sus vecinas.
function Seccion({ n, titulo, texto, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col text-left p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
    >
      <div className="font-mono text-3xl font-bold text-indigo-600 dark:text-indigo-400">{n}</div>
      <div className="font-bold text-zinc-900 dark:text-zinc-50 mt-2 flex items-center gap-1.5">
        {titulo}
        <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
      <div className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">{texto}</div>
    </button>
  )
}

export default function LandingView({ t, lang, onNavigate, onQuiz, totals }) {
  return (
    <div>
      <section className="relative overflow-hidden px-6 sm:px-10 py-16 sm:py-24">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(1000px 480px at 8% -18%, color-mix(in srgb, #6366f1 34%, transparent), transparent 60%), radial-gradient(760px 420px at 104% -6%, color-mix(in srgb, #22d3ee 20%, transparent), transparent 65%)',
          }}
        />
        <div className="absolute inset-0 -z-10 dot-grid opacity-60 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 -z-10 grain opacity-[0.035] mix-blend-overlay pointer-events-none" />

        <div className="relative grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center max-w-6xl mx-auto">
          <div>
            <motion.div {...aparece()} className="text-zinc-900 dark:text-white mb-7">
              <Logo size={44} wide />
            </motion.div>

            <motion.span
              {...aparece(0.05)}
              className="inline-flex items-center font-mono text-[11px] font-bold uppercase tracking-[.12em] text-indigo-600 dark:text-indigo-400 mb-5"
            >
              {t.heroKicker}
            </motion.span>

            <motion.h1
              {...aparece(0.1)}
              className="text-[2.8rem] sm:text-[3.6rem] leading-[1.1] font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-5"
            >
              {t.heroTitle1}
              <span className="block text-indigo-600 dark:text-indigo-400">{t.heroTitle2}</span>
            </motion.h1>

            <motion.p {...aparece(0.15)} className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md mb-8 leading-relaxed">
              {t.heroSub}
            </motion.p>

            <motion.div {...aparece(0.2)} className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('languages')}
                className="rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-6 py-3 text-sm cursor-pointer hover:opacity-90 transition-opacity"
              >
                {t.exploreBtn}
              </button>
              <button
                onClick={onQuiz}
                className="text-sm font-semibold text-zinc-600 dark:text-zinc-300 border-b border-zinc-300 dark:border-zinc-600 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer pb-0.5"
              >
                {t.testBtn}
              </button>
            </motion.div>
          </div>

          <motion.div {...aparece(0.25)}>
            <CodeWindow lang={lang} />
          </motion.div>
        </div>
      </section>

      <section className="px-6 sm:px-10 pb-20 max-w-6xl mx-auto">
        <div className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 mb-4">
          {t.landingWhat}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <Seccion n={totals.langs} titulo={t.nav.languages} texto={t.landingLangs} onClick={() => onNavigate('languages')} />
          <Seccion n={totals.res} titulo={t.nav.resources} texto={t.landingRes} onClick={() => onNavigate('resources')} />
          <Seccion n={totals.concepts} titulo={t.nav.concepts} texto={t.landingConcepts} onClick={() => onNavigate('concepts')} />
          <Seccion n={totals.comps} titulo={t.nav.components} texto={t.landingComps} onClick={() => onNavigate('components')} />
          <Seccion n={totals.skills} titulo={t.nav.skills} texto={t.landingSkills} onClick={() => onNavigate('skills')} />
        </div>
      </section>

      <section className="px-6 sm:px-10 pb-24 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative h-[340px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
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
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">
              {t.landingCompTitle}
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">{t.landingCompText}</p>
            <button
              onClick={() => onNavigate('components')}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 border-b border-indigo-500/40 hover:border-indigo-500 transition-colors cursor-pointer pb-0.5"
            >
              {t.landingCompCta}
              <ArrowRight size={14} />
            </button>
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
