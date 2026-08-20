import { useEffect, useMemo, useRef, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import { useTema } from '../lib/tema'
import { I18N } from '../data/i18n'
import { CATEGORIES } from '../data/languages'
import Buscador from '../components/Buscador'
import BotonGitHub from '../components/BotonGitHub'
import { PanelFiltros } from '../components/Sidebar'
import VerMas from '../components/VerMas'
import EmptyState from '../components/EmptyState'
import { contraste, fondoReal, tokenResuelto, auditar } from './medir'

// El kitchen sink: todo el sistema de Vibeset en una pantalla.
//
// Existe porque ninguna de las incoherencias que se arreglan aquí se ve como un
// fallo por separado. Cuatro alturas de control, tres radios y un activo pintado
// de color no llaman la atención en su propia página; puestos uno al lado del
// otro se ven en dos segundos, y es exactamente por qué una interfaz se siente
// descuidada sin que sepas señalar dónde.
//
// **Solo vive en desarrollo.** No es una página del sitio: no tiene ruta
// publicada, no entra en el sitemap y `main.jsx` solo la monta cuando
// `import.meta.env.DEV`, así que el bundler la deja fuera del build. Publicarla
// sería enseñar el andamio junto al edificio.
//
// Dos reglas que sostienen todo lo de abajo:
//
// 1. **Aquí no se escribe ningún valor a mano.** Los colores se le preguntan al
//    navegador, los tamaños se miden del elemento ya pintado y los contrastes se
//    calculan. Un muestrario con su propia lista de tokens miente el primer día
//    que alguien cambia uno, y entonces es peor que no tenerlo.
// 2. **Las piezas son las de verdad, importadas.** Copiar su markup aquí crearía
//    una segunda versión que se arregla sola y deja la buena rota.

const seccionesDelSitio = ['/', '/languages', '/resources', '/concepts', '/components', '/skills', '/tips']

// Los tonos se leen de `--tono-*`, que son las variables escritas a mano en
// `:root`, y NO de las utilidades `--color-*` que declara el bloque `@theme`.
// Costó un rato entender por qué la mitad salían negros: Tailwind v4 hace
// limpieza de las variables de `@theme` que ninguna clase usa, así que
// `--color-violeta` no existe en el CSS servido mientras nadie escriba
// `text-violeta`. La declaración sigue estando bien, pero preguntar por ella
// devuelve vacío y el navegador cae a negro sin avisar.
const TONOS = [
  'indigo', 'violeta', 'purpura', 'fucsia', 'rosa', 'rojo', 'naranja',
  'ambar', 'lima', 'esmeralda', 'turquesa', 'cian', 'cielo', 'azul',
]

const Rotulo = ({ children }) => (
  <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-tinta-suave">{children}</div>
)

// Cada bloque va dentro de su marco de 1px con las cuatro marcas de encuadre: es
// el mismo lenguaje de plano técnico de la portada, y aquí además hace su
// trabajo, que es separar sin pintar nada de color.
function Bloque({ titulo, nota, children }) {
  return (
    <section className="relative border border-linea bg-panel">
      <span aria-hidden="true" className="pointer-events-none absolute -top-px -left-px w-2.5 h-2.5 border-t border-l border-tinta" />
      <span aria-hidden="true" className="pointer-events-none absolute -top-px -right-px w-2.5 h-2.5 border-t border-r border-tinta" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l border-tinta" />
      <span aria-hidden="true" className="pointer-events-none absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r border-tinta" />
      <header className="flex items-baseline justify-between gap-6 px-5 py-3 border-b border-linea">
        <Rotulo>{titulo}</Rotulo>
        {nota && <span className="text-[13px] text-tinta-suave">{nota}</span>}
      </header>
      <div className="p-5">{children}</div>
    </section>
  )
}

// Una muestra de color con su contraste medido contra el fondo que de verdad
// tiene detrás. El veredicto sale de la cuenta, no de una lista de aprobados.
//
// `umbral` no es un adorno: la norma pide 4,5 a un texto pequeño, 3 a un texto
// grande y a los bordes de un control, y nada a una superficie o a una línea
// decorativa. La primera versión les exigía 4,5 a todos y marcaba en rojo el
// color de los bordes, que es como reprobar a un martillo por no cortar.
function Muestra({ variable, uso, umbral = 4.5 }) {
  const ref = useRef(null)
  const [dato, setDato] = useState(null)

  useEffect(() => {
    if (!ref.current) return
    const color = tokenResuelto(variable)
    setDato({ color, ratio: contraste(color, fondoReal(ref.current)) })
  }, [variable])

  const veredicto = !dato ? ''
    : umbral === 0 ? '—'
    : dato.ratio >= umbral ? 'AA'
    : dato.ratio >= 3 ? 'solo grande'
    : 'NO'

  return (
    <div ref={ref} className="flex items-center gap-3 py-1.5">
      <span
        aria-hidden="true"
        className="w-9 h-9 shrink-0 border border-linea"
        style={{ background: dato?.color }}
      />
      <span className="min-w-0 flex-1">
        <span className="block font-mono text-[13px] text-tinta truncate">{variable.replace(/^--/, '')}</span>
        <span className="block text-[11px] text-tinta-suave truncate">{uso}</span>
      </span>
      <span className="font-mono text-[11px] tabular-nums text-tinta-suave shrink-0">
        {dato ? `${dato.ratio.toFixed(2)}:1` : '…'}
      </span>
      <span className={`font-mono text-[11px] shrink-0 w-16 text-right ${veredicto === 'AA' || veredicto === '—' ? 'text-tinta-suave' : 'text-tinta font-bold'}`}>
        {veredicto}
      </span>
    </div>
  )
}

// El aviso que costó un fallo real, puesto donde se ve en vez de escrito en un
// documento que nadie abre: el mismo gris cambia de veredicto según lo que tenga
// detrás, y en esta web hay controles con fondo gris.
function SueloDelGris() {
  const ref = useRef(null)
  const [medidas, setMedidas] = useState([])

  useEffect(() => {
    const t = setTimeout(() => {
      if (!ref.current) return
      setMedidas([...ref.current.querySelectorAll('[data-sobre]')].map((el) => ({
        sobre: el.dataset.sobre,
        ratio: contraste(getComputedStyle(el).color, fondoReal(el)),
      })))
    }, 150)
    return () => clearTimeout(t)
  }, [])

  const filas = [
    ['el fondo de la página', 'bg-zinc-50 dark:bg-zinc-950'],
    ['el fondo de ficha', 'bg-panel'],
    ['un control con relleno gris', 'bg-zinc-100 dark:bg-zinc-900'],
  ]

  return (
    <Bloque titulo="El suelo del gris" nota="el mismo color, tres fondos">
      <div ref={ref} className="grid gap-2">
        {filas.map(([nombre, fondo], i) => {
          const m = medidas[i]
          const pasa = m && m.ratio >= 4.5
          return (
            <div key={nombre} className={`flex items-center justify-between gap-4 px-3 py-2 border border-linea ${fondo}`}>
              <span data-sobre={nombre} className="text-sm text-tinta-suave">
                Texto de apoyo sobre {nombre}
              </span>
              <span className="font-mono text-[11px] tabular-nums shrink-0">
                <span className="text-tinta-suave">{m ? `${m.ratio.toFixed(2)}:1` : '…'}</span>
                <span className={`ml-2 ${pasa ? 'text-tinta-suave' : 'text-tinta font-bold'}`}>
                  {m ? (pasa ? 'AA' : 'NO') : ''}
                </span>
              </span>
            </div>
          )
        })}
      </div>
      <p className="mt-3 max-w-prose text-[13px] text-tinta-suave">
        <span className="text-tinta-fuerte">tinta-suave solo cumple sobre el fondo base.</span> Es
        el gris más bajo que pasa AA, y le sobran tres centésimas: en cuanto se pone encima de un
        control con relleno gris, cae por debajo del aprobado. No es un caso teórico, el buscador
        de la barra llevaba semanas así. La regla que sale de aquí: si un control tiene fondo
        propio, su texto de apoyo sube a tinta-fuerte, o el control se queda sin relleno.
      </p>
    </Bloque>
  )
}

// La auditoría de las rutas REALES. Cada sección se abre en un iframe del mismo
// origen y se mide dentro: así lo que sale es el estado de la web, no el de esta
// página. Es la diferencia entre un muestrario y un comprobador.
function Auditoria() {
  const [estado, setEstado] = useState('quieto')
  const [filas, setFilas] = useState([])
  const [tema, setTema] = useState('')
  const marco = useRef(null)

  // El tema de esta pasada se lee del documento, que es el mismo que tendrán los
  // iframes. Se dice siempre y en grande: un informe que no cuenta en qué tema
  // se midió deja creer que cubre los dos.
  useEffect(() => {
    setTema(document.documentElement.dataset.theme || 'light')
  }, [filas.length])

  // Mide EL TEMA QUE HAYA PUESTO, y no los dos. Es una limitación con nombre, no
  // un olvido, y conviene leerla antes de intentar «mejorarlo»:
  //
  // Forzar `data-theme="dark"` dentro del iframe para medir los dos de una
  // pasada se probó tres veces y no da un resultado en el que se pueda confiar
  // (523 fallos, con ratios de 1,04:1 que son imposibles en una web que se ve).
  // De los tres intentos salieron dos causas reales, ya arregladas: el fondo se
  // buscaba en el documento del padre en vez del iframe, y el atributo se ponía
  // antes de que React montara, así que la aplicación lo pisaba al aplicar el
  // tema del sistema. Con las dos arregladas la medición seguía sin cuadrar, y
  // un comprobador que grita en falso enseña a ignorarlo, que es peor que no
  // tenerlo. La misma pared que ya está documentada para el navegador
  // automatizado, vista desde otro lado.
  //
  // **La forma de comprobar el oscuro es real y cuesta un clic:** poner el
  // sistema en oscuro y volver a abrir esta página. Entonces el taller y las
  // siete secciones arrancan en oscuro de verdad, sin forzar nada, y lo que
  // sale de aquí vale. Por eso la tabla dice siempre en qué tema está midiendo.
  const pasar = async () => {
    setEstado('midiendo')
    setFilas([])
    for (const ruta of seccionesDelSitio) {
      const doc = await new Promise((resolve) => {
        marco.current.onload = () => resolve(marco.current.contentDocument)
        marco.current.src = ruta
      })
      // Un respiro para que monten las vistas que animan su entrada; sin esto se
      // mide un DOM a medio pintar y salen fallos que no existen.
      await new Promise((r) => setTimeout(r, 900))
      const f = auditar(doc.body)
      setFilas((prev) => [...prev, {
        ruta,
        contraste: f.contraste.length,
        tactil: f.tactil.length,
        letra: f.letraMinuscula.length,
        color: f.colorEnNavegacion.length,
        detalle: f,
      }])
    }
    setEstado('hecho')
  }

  const total = filas.reduce((n, f) => n + f.contraste + f.tactil + f.letra + f.color, 0)

  return (
    <Bloque
      titulo="Comprobación"
      nota={estado === 'hecho'
        ? (total === 0 ? `las 7 secciones limpias · tema ${tema}` : `${total} cosas que mirar · tema ${tema}`)
        : `las 7 secciones · se medirá en tema ${tema}`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={pasar}
          disabled={estado === 'midiendo'}
          className="h-9 px-4 bg-tinta text-panel text-sm font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-wait"
        >
          {estado === 'midiendo' ? 'Midiendo…' : 'Medir las 7 secciones'}
        </button>
        <p className="text-[13px] text-tinta-suave max-w-prose">
          Mide <span className="text-tinta-fuerte">el tema que tenga tu sistema</span>, no los dos.
          Para comprobar el otro, cámbialo en Windows y vuelve a abrir esta página: forzarlo desde
          aquí se intentó tres veces y daba cientos de fallos inventados.
        </p>
      </div>

      {filas.length > 0 && (
        <div className="mt-4 border-t border-linea">
          <div className="grid grid-cols-[1fr_repeat(4,auto)] gap-x-6 py-2 border-b border-linea font-mono text-[11px] uppercase tracking-wider text-tinta-suave">
            <span>ruta</span><span>contraste</span><span>táctil</span><span>letra</span><span>color en nav</span>
          </div>
          {filas.map((f) => (
            <div key={f.ruta} className="grid grid-cols-[1fr_repeat(4,auto)] gap-x-6 py-2 border-b border-linea font-mono text-[13px] tabular-nums">
              <span className="text-tinta-fuerte">{f.ruta}</span>
              {[f.contraste, f.tactil, f.letra, f.color].map((n, i) => (
                <span key={i} className={n === 0 ? 'text-tinta-suave' : 'text-tinta font-bold'}>{n}</span>
              ))}
            </div>
          ))}
          {/* Una cuenta sin el detalle no sirve para arreglar nada: manda a
              buscar a ciegas. Cada fallo sale con lo que hay que saber para ir
              a por él, y en el orden en que aparece en la página. */}
          {filas.map((f) => {
            const listas = [
              ['color en navegación', f.detalle.colorEnNavegacion, (x) => `${x.que} · ${x.prop} ${x.valor}`],
              ['contraste', f.detalle.contraste, (x) => `${x.que} · ${x.valor}:1 a ${Math.round(x.px)}px`],
              ['táctil', f.detalle.tactil, (x) => `${x.que} · ${x.w}x${x.h}`],
              ['letra', f.detalle.letraMinuscula, (x) => `${x.que} · ${x.px}px`],
            ].filter(([, l]) => l.length)
            if (!listas.length) return null
            return (
              <details key={`d-${f.ruta}`} className="mt-3 border-b border-linea pb-2">
                <summary className="cursor-pointer font-mono text-[11px] uppercase tracking-wider text-tinta-suave hover:text-tinta">
                  {f.ruta}
                </summary>
                {listas.map(([nombre, lista, formato]) => (
                  <div key={nombre} className="mt-2">
                    <Rotulo>{nombre} · {lista.length}</Rotulo>
                    <ul className="mt-1 space-y-0.5">
                      {lista.slice(0, 12).map((x, i) => (
                        <li key={i} className="font-mono text-[11px] text-tinta-fuerte">{formato(x)}</li>
                      ))}
                      {lista.length > 12 && (
                        <li className="font-mono text-[11px] text-tinta-suave">y {lista.length - 12} más</li>
                      )}
                    </ul>
                  </div>
                ))}
              </details>
            )
          })}
        </div>
      )}

      {/* El iframe mide lo que mide una pantalla de escritorio de verdad, y se
          queda a la vista a propósito: si algo sale raro en la tabla, se ve al
          lado por qué. */}
      <iframe
        ref={marco}
        title="auditoría"
        className={`mt-4 w-full border border-linea ${estado === 'quieto' ? 'hidden' : ''}`}
        style={{ height: 420 }}
      />
    </Bloque>
  )
}

// Mide de verdad lo que ocupa cada control ya pintado. La escala del header se
// arregló midiendo, no imaginando, y esta tabla es lo que hizo falta entonces.
function Medidas({ zona }) {
  const [filas, setFilas] = useState([])

  useEffect(() => {
    if (!zona.current) return
    const t = setTimeout(() => {
      const vistos = new Map()
      for (const el of zona.current.querySelectorAll('a, button, input, [role="button"]')) {
        const r = el.getBoundingClientRect()
        if (!r.width) continue
        const cs = getComputedStyle(el)
        // `rounded-full` se resuelve a un número enorme (el navegador recorta el
        // 9999px al radio máximo posible), así que en la tabla sale como lo que
        // es y no como «2.68435e+07px», que no le dice nada a nadie.
        const bruto = parseFloat(cs.borderTopLeftRadius) || 0
        const radio = bruto > 100 ? 'redondo' : `${Math.round(bruto)}px`
        const clave = `${Math.round(r.height)}|${radio}`
        if (!vistos.has(clave)) {
          vistos.set(clave, { alto: Math.round(r.height), radio, ejemplo: (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24) || el.tagName.toLowerCase(), veces: 0 })
        }
        vistos.get(clave).veces++
      }
      setFilas([...vistos.values()].sort((a, b) => b.veces - a.veces))
    }, 500)
    return () => clearTimeout(t)
  }, [zona])

  const alturas = new Set(filas.map((f) => f.alto)).size
  const radios = new Set(filas.map((f) => f.radio)).size

  return (
    <Bloque
      titulo="La escala, medida"
      nota={`${alturas} alturas · ${radios} radios en las piezas de arriba`}
    >
      <p className="mb-3 text-[13px] text-tinta-suave max-w-prose">
        Una barra se siente descuidada cuando conviven cuatro alturas y tres radios sin que
        ninguno se vea mal por separado. Si estas dos cuentas suben, hay algo que decidir.
      </p>
      <div className="grid grid-cols-[auto_auto_auto_1fr] gap-x-6 gap-y-1 font-mono text-[13px] tabular-nums">
        <span className="text-[11px] uppercase tracking-wider text-tinta-suave">alto</span>
        <span className="text-[11px] uppercase tracking-wider text-tinta-suave">radio</span>
        <span className="text-[11px] uppercase tracking-wider text-tinta-suave">veces</span>
        <span className="text-[11px] uppercase tracking-wider text-tinta-suave">ejemplo</span>
        {filas.map((f, i) => (
          <div key={i} className="contents">
            <span className="text-tinta">{f.alto}px</span>
            <span className="text-tinta-fuerte">{f.radio}</span>
            <span className="text-tinta-suave">{f.veces}</span>
            <span className="text-tinta-suave truncate">{f.ejemplo}</span>
          </div>
        ))}
      </div>
    </Bloque>
  )
}

export default function KitchenSink() {
  useTema()
  const t = I18N.es
  const zonaPiezas = useRef(null)
  const [cat, setCat] = useState('all')
  const [filtro, setFiltro] = useState('')

  const categorias = useMemo(
    () => CATEGORIES.map((c) => ({ key: c.key, label: c.label.es, count: c.count })),
    [],
  )

  const tipografia = [
    ['Titular de sección', 'text-3xl font-extrabold tracking-tight text-tinta'],
    ['Titular de ficha', 'text-lg font-bold text-tinta'],
    ['Texto normal', 'text-sm text-tinta-fuerte'],
    ['Apoyo', 'text-[13px] text-tinta-suave'],
    ['Rótulo monoespaciado, el suelo de la casa', 'font-mono text-[11px] uppercase tracking-[0.16em] text-tinta-suave'],
  ]

  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <div className="min-h-dvh bg-zinc-50 dark:bg-zinc-950 text-tinta">
          <header className="border-b border-linea bg-panel">
            <div className="mx-auto max-w-5xl px-6 py-8">
              <Rotulo>Vibeset · taller</Rotulo>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Kitchen sink</h1>
              <p className="mt-2 max-w-prose text-sm text-tinta-fuerte">
                Todo el sistema en una pantalla, con sus medidas al lado. Nada de esto está
                escrito a mano: los colores se le preguntan al navegador y los contrastes se
                calculan aquí mismo, así que esta página no puede quedarse desfasada.
              </p>
              <p className="mt-3 font-mono text-[11px] text-tinta-suave">
                solo en desarrollo · no entra en el build ni en el sitemap
              </p>
            </div>
          </header>

          <main className="mx-auto max-w-5xl px-6 py-8 grid gap-6">
            <Auditoria />

            <div className="grid gap-6 md:grid-cols-2">
              <Bloque titulo="Tinta" nota="tres niveles, y no cuatro">
                <Muestra variable="--v-tinta" uso="el texto que manda" />
                <Muestra variable="--v-tinta-fuerte" uso="el texto normal" />
                <Muestra variable="--v-tinta-suave" uso="el apoyo · el nivel más bajo que pasa AA" />
                <p className="mt-3 text-[13px] text-tinta-suave">
                  Por debajo de tinta-suave no hay nada legal. Lo que tenga que sonar más
                  callado se calla con tamaño, peso o sitio, nunca con más gris.
                </p>
              </Bloque>

              <Bloque titulo="Estructura y acento">
                <Muestra variable="--v-linea" uso="el borde de todo · no lleva texto encima" umbral={0} />
                <Muestra variable="--v-linea-viva" uso="el borde que responde" umbral={0} />
                <Muestra variable="--v-panel" uso="el fondo de ficha" umbral={0} />
                <Muestra variable="--v-acento" uso="enlaces y acciones · azul desde el 2026-08-20" />
                <p className="mt-3 text-[13px] text-tinta-suave">
                  El acento vale para enlaces y acciones. En una lista de navegación no entra:
                  ahí no clasifica nada y solo gasta el único color que significa algo.
                </p>
              </Bloque>
            </div>

            <SueloDelGris />

            <Bloque titulo="Tonos de categoría" nota="14 · el color que sí clasifica">
              <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
                {TONOS.map((tono) => (
                  <Muestra key={tono} variable={`--tono-${tono}`} uso="categoría del catálogo" />
                ))}
              </div>
              <p className="mt-3 text-[13px] text-tinta-suave max-w-prose">
                Van a 700 en claro y 400 en oscuro, siempre. Un hex único vale para un tema y
                falla en el otro: el mismo escalón no da el mismo contraste sobre blanco que
                sobre negro.
              </p>
            </Bloque>

            <Bloque titulo="Tipografía">
              <div className="grid gap-3">
                {tipografia.map(([nombre, clases]) => (
                  <div key={nombre} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-linea pb-2">
                    <span className={clases}>{nombre}</span>
                    <span className="font-mono text-[11px] text-tinta-suave">{clases}</span>
                  </div>
                ))}
              </div>
            </Bloque>

            <div ref={zonaPiezas} className="grid gap-6">
              <Bloque titulo="Controles" nota="las piezas de verdad, importadas">
                <div className="grid gap-5">
                  <div>
                    <Rotulo>Buscar</Rotulo>
                    <div className="mt-2 max-w-md">
                      <Buscador t={t} lang="es" onAbrir={() => {}} />
                    </div>
                  </div>
                  <div>
                    <Rotulo>Repositorio</Rotulo>
                    <div className="mt-2 flex items-center gap-4">
                      <BotonGitHub t={t} />
                      <BotonGitHub t={t} conTexto />
                    </div>
                  </div>
                  <div>
                    <Rotulo>Acciones</Rotulo>
                    <div className="mt-2 flex flex-wrap items-center gap-4">
                      <button type="button" className="h-9 px-4 bg-tinta text-panel text-sm font-semibold cursor-pointer">
                        Acción principal
                      </button>
                      <VerMas quedan={24} onMas={() => {}} etiqueta={t.verMas} />
                    </div>
                  </div>
                </div>
              </Bloque>

              <div className="grid gap-6 md:grid-cols-[260px_1fr]">
                <Bloque titulo="Navegación">
                  <div data-nav>
                    <PanelFiltros
                      t={t}
                      searchPh={t.searchPh}
                      query={filtro}
                      setQuery={setFiltro}
                      categories={categorias.slice(0, 6)}
                      activeCat={cat}
                      setActiveCat={setCat}
                    />
                  </div>
                </Bloque>

                <Bloque titulo="Vacío">
                  <EmptyState t={t} onClear={() => {}} />
                </Bloque>
              </div>
            </div>

            <Medidas zona={zonaPiezas} />
          </main>
        </div>
      </BrowserRouter>
    </MotionConfig>
  )
}
