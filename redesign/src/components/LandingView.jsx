import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Boxes, Braces, Lightbulb, Sparkles, Terminal, Wrench } from 'lucide-react'
import CodeWindow from './CodeWindow'
import Logo from './Logo'
import { Banda, Canal, Encuadre } from './Plano'
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

// Las seis secciones comparten una sola pieza con las divisiones por dentro, en
// vez de seis recuadros sueltos. La retícula se dibuja con un hueco de 1px que
// deja ver el fondo del contenedor: así las líneas interiores son de un píxel
// exacto y no se doblan donde dos bordes se tocan.
//
// Aquí no se usa `pulsable`: encoger una celda que comparte lado con su vecina
// abriría una rendija en la retícula al pulsarla. La respuesta es el fondo.
function Seccion({ n, titulo, texto, a, Icono }) {
  return (
    <Link
      to={a}
      className="group relative overflow-hidden flex flex-col text-left p-5 min-h-[132px] bg-white dark:bg-zinc-950 hover:bg-zinc-50 dark:hover:bg-zinc-900/70 active:bg-zinc-100 dark:active:bg-zinc-900 transition-colors"
    >
      {/* La cifra va detrás, sangrando por el borde de abajo. Sangra solo hacia
          abajo y no hacia la derecha a propósito: cortada por el costado partía
          los dígitos por la mitad y parecía un fallo de maquetación en vez de
          una decisión. */}
      <span
        aria-hidden="true"
        className="cifra-fondo pointer-events-none absolute right-4 -bottom-7 font-mono text-[5.4rem] font-extrabold leading-none tracking-tighter"
      >
        {n}
      </span>

      <Icono size={19} className="relative text-blue-600 dark:text-blue-400" />

      <div className="relative font-bold text-tinta mt-3 flex items-center gap-1.5">
        {titulo}
        <ArrowRight size={14} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
      </div>
      <div className="relative text-sm text-tinta-suave mt-1 leading-relaxed max-w-[26ch]">{texto}</div>
    </Link>
  )
}

export default function LandingView({ t, lang, onQuiz, totals }) {
  return (
    <div>
      {/* Las tres bandas comparten UN canal: las dos verticales son las mismas
          y no se cortan al pasar de una sección a otra, que es lo que hace que
          esto se lea como un documento en vez de como tres bloques apilados.
          Los nudos van solo en el hero: marcarlos en las tres los convertiría en
          un patrón de fondo y dejarían de señalar nada. */}
      <Banda>
        {/* Aquí ya no hay `overflow-hidden`. Recortaba las cruces, que sobresalen
            media cruz del canal a propósito; el resplandor es `inset-0` y no se
            sale por su cuenta. */}
        <Canal nudos>
          <section className="relative px-6 sm:px-10 py-16 sm:py-24">
            {/* Un solo resplandor, sin mezcla de capas. Antes había tres (dos
                radiales, rejilla de puntos y grano) con mix-blend-overlay, que se
                anulaban entre ellas: el fondo salía negro plano en oscuro y
                blanco plano en claro, o sea trabajo de pintado para cero píxeles. */}
            <div className="absolute inset-0 -z-10 pointer-events-none resplandor" />

            <div className="relative grid lg:grid-cols-[1.05fr_.95fr] gap-14 items-center">
              <div>
                <motion.div {...aparece()} className="text-zinc-900 dark:text-white mb-7">
                  <Logo size={44} wide />
                </motion.div>

                <motion.h1
                  {...aparece(0.1)}
                  className="text-[2.4rem] sm:text-[3.1rem] leading-[1.08] font-extrabold tracking-tight text-balance text-tinta mb-5"
                >
                  {t.heroTitle1}
                  <span className="block text-blue-600 dark:text-blue-400">{t.heroTitle2}</span>
                </motion.h1>

                {/* Las cuatro promesas ya no van sueltas encima del titular: cierran
                    la descripción, que es donde se leen como parte de la frase. */}
                <motion.p {...aparece(0.15)} className="text-tinta-suave text-lg max-w-lg mb-8 leading-relaxed">
                  {t.heroSub}{' '}
                  <span className="text-tinta font-semibold">{t.heroClaims}</span>
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
                    className="pulsable inline-flex items-center min-h-6 pt-1 text-sm font-semibold text-tinta-fuerte border-b border-linea-viva hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer pb-0.5"
                  >
                    {t.testBtn}
                  </button>
                </motion.div>
              </div>

              {/* La portada la ocupa una pieza viva del catálogo, no una ilustración
                  de una pieza viva del catálogo. */}
              <motion.div {...aparece(0.25)}>
                <div className="relative h-[340px] sm:h-[400px] rounded-2xl overflow-hidden bg-zinc-950 border border-linea">
                  <Suspense fallback={<div className="absolute inset-0 grid place-items-center font-mono text-xs text-zinc-400">{t.compLoading}</div>}>
                    <AsciiObject
                      src="/brand/logo-blanco.svg"
                      cellSize={7}
                      scale={3.6}
                      autoRotate
                      autoRotateSpeed={1.2}
                      highlight="#2563eb"
                      style={{ position: 'absolute', inset: 0 }}
                    />
                  </Suspense>
                </div>
                <Link
                  to={rutaDe('components', 'ascii-object')}
                  className="inline-flex items-center gap-1.5 mt-3 font-mono text-[11px] text-tinta-suave hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {t.heroDemo}
                  <ArrowRight size={11} />
                </Link>
              </motion.div>
            </div>
          </section>
        </Canal>
      </Banda>

      <Banda>
        <Canal>
          <section className="px-6 sm:px-10 py-14">
            <div className="text-[11px] font-bold uppercase tracking-wider text-tinta-suave mb-4">
              {t.landingWhat}
            </div>
            {/* La esquina se queda recta y el encuadre la señala. El `rounded-2xl`
                que había aquí es incompatible con las marcas en L: sobre una
                esquina curva la marca flota separada del borde y parece un fallo
                de maquetación. Y sin `overflow-hidden`, que también las cortaba;
                lo que sangraba era la cifra de cada celda, y cada celda ya trae
                el suyo. */}
            <div className="relative grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-200 dark:bg-zinc-800 border border-linea">
              <Encuadre />
              <Seccion n={totals.langs} titulo={t.nav.languages} texto={t.landingLangs} a={rutaDe('languages')} Icono={Braces} />
              <Seccion n={totals.res} titulo={t.nav.resources} texto={t.landingRes} a={rutaDe('resources')} Icono={Wrench} />
              <Seccion n={totals.concepts} titulo={t.nav.concepts} texto={t.landingConcepts} a={rutaDe('concepts')} Icono={Sparkles} />
              <Seccion n={totals.comps} titulo={t.nav.components} texto={t.landingComps} a={rutaDe('components')} Icono={Boxes} />
              <Seccion n={totals.skills} titulo={t.nav.skills} texto={t.landingSkills} a={rutaDe('skills')} Icono={Terminal} />
              <Seccion n={totals.consejos} titulo={t.nav.consejos} texto={t.landingConsejos} a={rutaDe('consejos')} Icono={Lightbulb} />
            </div>
          </section>
        </Canal>
      </Banda>

      {/* El otro bloque enseña la otra mitad del catálogo: el código real de cada
          lenguaje, que también se toca (cuatro pestañas, cuatro ejemplos). */}
      <Banda>
        <Canal>
          <section className="px-6 sm:px-10 py-16">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <CodeWindow lang={lang} />
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight text-tinta mb-3">
                  {t.landingCodeTitle}
                </h2>
                <p className="text-tinta-suave leading-relaxed mb-6">{t.landingCodeText}</p>
                <Link
                  to={rutaDe('languages')}
                  className="grupo-cta pulsable inline-flex items-center gap-1.5 min-h-6 pt-1 text-sm font-semibold text-blue-600 dark:text-blue-400 border-b border-blue-500/40 hover:border-blue-500 pb-0.5"
                >
                  {t.landingCodeCta}
                  <ArrowRight size={14} className="flecha-desliza" />
                </Link>
              </div>
            </div>
          </section>
        </Canal>
      </Banda>

    </div>
  )
}
