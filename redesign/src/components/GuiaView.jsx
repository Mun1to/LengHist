import { lazy, Suspense, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { NIVELES, NIVEL_POR_DEFECTO, PASOS } from '../data/guia'
import { trozosDe } from '../lib/marcado'
import { rutaDe, slugLenguaje } from '../lib/rutas'
import { Encuadre } from './Plano'

// La guía de orientación. No es un curso: es un mapa de «estás aquí» que termina
// cada bloque mandándote a la parte del catálogo que resuelve eso.
//
// El test de lenguajes vive DENTRO, en el bloque que habla de con qué escribir,
// que es el único sitio donde su respuesta significa algo. Suelto en la barra
// contestaba una pregunta que nadie se estaba haciendo todavía.
const Quiz = lazy(() => import('./Quiz'))

function Texto({ texto }) {
  return trozosDe(texto).map((t, i) =>
    t.tipo === 'fuerte' ? <b key={i} className="font-semibold text-tinta-fuerte">{t.texto}</b>
      : t.tipo === 'codigo' ? <code key={i} className="font-mono text-[0.92em] bg-zinc-200/60 dark:bg-zinc-800 px-1.5 py-0.5">{t.texto}</code>
      : <span key={i}>{t.texto}</span>
  )
}

export default function GuiaView({ t, lang }) {
  const [params, setParams] = useSearchParams()
  const irA = useNavigate()
  const [quizOpen, setQuizOpen] = useState(false)

  // El nivel viaja en la dirección, como la categoría de las secciones: así se
  // puede compartir «la guía para quien no ha programado nunca» y el botón de
  // atrás hace lo que tiene que hacer. Un nivel inventado en la URL no rompe
  // nada, se cae al de por defecto.
  const pedido = params.get('nivel')
  const nivel = NIVELES.some((n) => n.key === pedido) ? pedido : NIVEL_POR_DEFECTO
  const elNivel = NIVELES.find((n) => n.key === nivel)

  const cambiarNivel = (key) => {
    const p = new URLSearchParams(params)
    if (key === NIVEL_POR_DEFECTO) p.delete('nivel'); else p.set('nivel', key)
    setParams(p, { replace: true })
  }

  const verFicha = (name) => irA(rutaDe('languages', slugLenguaje(name), lang))

  return (
    <section className="px-6 sm:px-10 py-12 max-w-[900px] mx-auto">
      <div className="flex flex-wrap items-baseline justify-between gap-4 mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight">{t.guiaTitle}</h1>
        <span className="font-mono text-xs text-tinta-suave shrink-0 ml-auto">{t.guiaMinutos}</span>
      </div>
      <p className="text-tinta-suave mb-8 max-w-2xl">{t.guiaSub}</p>

      {/* El selector de nivel es navegación, así que lleva su marca y va sin una
          gota de color: lo que separa las tres opciones es el peso y la línea de
          debajo, no un fondo de tono. */}
      <div data-nav className="pt-5 border-t border-linea">
        <div className="font-mono text-[12px] uppercase tracking-wider text-tinta-suave mb-3">
          {t.guiaNivelRotulo}
        </div>
        <div className="flex flex-wrap items-center gap-5">
          {NIVELES.map((n) => {
            const activo = n.key === nivel
            return (
              <button
                key={n.key}
                onClick={() => cambiarNivel(n.key)}
                aria-pressed={activo}
                className={`pulsable text-sm pb-1 border-b-2 cursor-pointer transition-colors ${
                  activo
                    ? 'font-bold text-tinta border-tinta'
                    : 'font-medium text-tinta-suave border-transparent hover:text-tinta-fuerte hover:border-linea-viva'
                }`}
              >
                {n[lang].nombre}
              </button>
            )
          })}
        </div>
        <p className="text-sm text-tinta-suave mt-4 max-w-2xl">{elNivel[lang].pie}</p>
      </div>

      <ol className="mt-10 flex flex-col gap-px">
        {PASOS.map((paso, i) => {
          const d = paso[lang] ?? paso.es
          const tuyo = paso.para.includes(nivel)
          return (
            <li key={paso.key} className="relative border-t border-linea pt-7 pb-9">
              <div className="flex items-baseline gap-4 mb-3">
                <span className="font-mono text-xs text-tinta-suave shrink-0 pt-1">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="text-xl font-bold tracking-tight">{d.titulo}</h2>
                {/* Lo que no es de tu nivel no se esconde, se marca. Esconderlo
                    castiga a quien elige mal el nivel: se pierde cosas y ni
                    siquiera sabe que existen. */}
                {!tuyo && (
                  <span className="ml-auto font-mono text-[12px] text-tinta-suave shrink-0">
                    {t.guiaSaltable}
                  </span>
                )}
              </div>

              <div className={tuyo ? '' : 'opacity-60'}>
                <p className="text-[15px] leading-relaxed text-tinta max-w-[68ch] mb-4">
                  <Texto texto={d.texto} />
                </p>

                {d.texto2 && (
                  <p className="text-[15px] leading-relaxed text-tinta max-w-[68ch] mb-4">
                    <Texto texto={d.texto2} />
                  </p>
                )}

                {d.glosario && (
                  <dl className="mb-4 max-w-[68ch]">
                    {d.glosario.map((g) => (
                      <div key={g.palabra} className="border-t border-linea py-2.5 sm:flex sm:gap-5">
                        <dt className="font-semibold text-sm text-tinta-fuerte sm:w-36 sm:shrink-0">{g.palabra}</dt>
                        <dd className="text-sm text-tinta-suave m-0">{g.def}</dd>
                      </div>
                    ))}
                  </dl>
                )}

                {d.lista && (
                  <ul className="mb-4 max-w-[68ch] flex flex-col">
                    {d.lista.map((x, j) => (
                      <li key={j} className="text-sm text-tinta-suave border-t border-linea py-2.5 leading-relaxed">
                        <Texto texto={x} />
                      </li>
                    ))}
                  </ul>
                )}

                {d.aviso && (
                  <p className="relative text-sm text-tinta-suave max-w-[68ch] border-l-2 border-linea-viva pl-4 py-1 mb-4">
                    {d.aviso}
                  </p>
                )}

                {paso.test && (
                  <div className="relative border border-linea bg-panel p-5 mb-4 max-w-[68ch]">
                    <Encuadre suave />
                    <p className="text-sm font-semibold mb-1">{t.guiaTestTitulo}</p>
                    <p className="text-sm text-tinta-suave mb-4">{t.guiaTestSub}</p>
                    <button
                      onClick={() => setQuizOpen(true)}
                      className="pulsable inline-flex items-center min-h-6 text-sm font-semibold text-tinta-fuerte border-b border-linea-viva hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer pb-0.5"
                    >
                      {t.guiaTestBtn}
                    </button>
                  </div>
                )}

                {d.enlaces?.length > 0 && (
                  <ul className="flex flex-col gap-1.5">
                    {d.enlaces.map((e) => (
                      <li key={e.texto}>
                        <Link
                          to={rutaDe(e.seccion, null, lang) + (e.cat ? `?cat=${e.cat}` : '')}
                          className="pulsable group inline-flex items-baseline gap-1.5 text-sm font-semibold text-tinta-fuerte border-b border-linea-viva hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 pb-0.5"
                        >
                          {e.texto}
                          <ArrowUpRight size={13} className="shrink-0 self-center" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      <div className="border-t border-linea pt-7">
        <p className="text-sm text-tinta-suave mb-4 max-w-[68ch]">{t.guiaFinal}</p>
        <Link
          to={rutaDe('languages', null, lang)}
          className="grupo-cta pulsable alzable inline-flex items-center gap-1.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-6 py-3 text-sm"
        >
          {t.exploreBtn}
        </Link>
      </div>

      {quizOpen && (
        <Suspense fallback={null}>
          <Quiz t={t} lang={lang} open onClose={() => setQuizOpen(false)} onSeeLanguage={verFicha} />
        </Suspense>
      )}
    </section>
  )
}
