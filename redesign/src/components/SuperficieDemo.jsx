// La superficie sobre la que trabajan los efectos. Antes eran cinco fotos de
// paisajes de banco de imágenes: tres tarjetas de la rejilla salían verdes y no
// se distinguía qué hacía cada efecto, y el sitio importaba la estética de
// plantilla genérica de la que presume de escapar. Ahora la superficie es el
// propio catálogo de Vibeset.
//
// Dos restricciones mandan aquí, y las dos vienen del respaldo que dibuja el
// HTML en un canvas cuando el navegador no trae html-in-canvas (htmlFallback.ts):
// solo sabe pintar COLORES SÓLIDOS, TEXTO E IMÁGENES. Nada de degradados, nada
// de esquinas redondeadas, nada de sombras. Y a estos efectos les hace falta
// detalle con mucho contraste para tener algo que deformar, así que la retícula
// de fichas de colores les da más juego que cualquier fotografía.

const FICHAS = [
  { name: 'Python', year: 1991, color: '#3776ab' },
  { name: 'Rust', year: 2010, color: '#ce4a2f' },
  { name: 'TypeScript', year: 2012, color: '#3178c6' },
  { name: 'Go', year: 2009, color: '#00add8' },
  { name: 'Elixir', year: 2011, color: '#6b4e8f' },
  { name: 'Zig', year: 2016, color: '#c88a1a' },
  { name: 'Swift', year: 2014, color: '#f05138' },
  { name: 'Lua', year: 1993, color: '#2c2d72' },
  { name: 'Julia', year: 2012, color: '#3b8f47' },
  { name: 'Haskell', year: 1990, color: '#5e5086' },
  { name: 'Kotlin', year: 2011, color: '#8a5cd6' },
  { name: 'C', year: 1972, color: '#5b6b7f' },
]

const CODIGO = [
  [['fn ', '#c084fc'], ['saludar', '#60a5fa'], ['(quien: ', '#a1a1aa'], ['&str', '#34d399'], [') {', '#a1a1aa']],
  [['    println!', '#60a5fa'], ['("Hola, {quien}");', '#fbbf24']],
  [['}', '#a1a1aa']],
  [],
  [['const ', '#c084fc'], ['fichas ', '#e4e4e7'], ['= ', '#a1a1aa'], ['catalogo', '#60a5fa'], ['.', '#a1a1aa'], ['filtrar', '#60a5fa'], ['(', '#a1a1aa']],
  [['  (l) ', '#e4e4e7'], ['=> ', '#c084fc'], ['l.anio ', '#e4e4e7'], ['> ', '#a1a1aa'], ['2010', '#fbbf24']],
  [[')', '#a1a1aa']],
]

function Cabecera({ compact }) {
  return (
    <div
      className={`flex items-baseline justify-between border-b border-zinc-700 ${compact ? 'px-3 py-2' : 'px-6 py-4'}`}
      style={{ background: '#18181b' }}
    >
      <span className={`font-extrabold tracking-tight text-white ${compact ? 'text-sm' : 'text-xl'}`}>Vibeset</span>
      {/* En la rejilla, la estrella de favorito flota sobre la esquina derecha de
          la tarjeta: el texto se aparta para no quedar debajo. */}
      <span className={`font-mono text-zinc-400 shrink-0 ${compact ? 'text-[9px] pr-9' : 'text-xs'}`}>
        {compact ? '100 · 64' : '100 lenguajes · 64 recursos · 41 conceptos'}
      </span>
    </div>
  )
}

// Retícula de fichas: bloques de color con el nombre encima. Es lo que más
// contraste da, que es lo que estos efectos necesitan para lucirse.
function Catalogo({ compact, filas = 3, estirar = false }) {
  const visibles = FICHAS.slice(0, filas * 4)
  return (
    <div
      className={`grid grid-cols-4 ${estirar ? 'flex-1' : ''} ${compact ? 'gap-1.5 p-3' : 'gap-3 p-6'}`}
      style={estirar ? { gridTemplateRows: `repeat(${filas}, minmax(0, 1fr))` } : undefined}
    >
      {visibles.map((f) => (
        <div key={f.name} style={{ background: f.color }} className={compact ? 'p-1.5' : 'p-3'}>
          <div className={`font-bold text-white leading-tight ${compact ? 'text-[10px]' : 'text-sm'}`}>{f.name}</div>
          <div className={`font-mono text-white/75 ${compact ? 'text-[8px]' : 'text-[11px]'}`}>{f.year}</div>
        </div>
      ))}
    </div>
  )
}

function Codigo({ compact }) {
  return (
    <div className={compact ? 'p-3' : 'p-6'} style={{ background: '#0a0a0b' }}>
      {CODIGO.map((linea, i) => (
        <div key={i} className={`font-mono leading-relaxed ${compact ? 'text-[10px]' : 'text-sm'}`}>
          {linea.length === 0 ? ' ' : linea.map(([texto, color], j) => (
            <span key={j} style={{ color }}>{texto}</span>
          ))}
        </div>
      ))}
    </div>
  )
}

function Terminal({ compact }) {
  const lineas = [
    ['~/.claude/skills/', '#71717a'],
    ['└── revisar-responsive/', '#a1a1aa'],
    ['    └── SKILL.md', '#818cf8'],
    ['', '#71717a'],
    ['$ /revisar-responsive', '#34d399'],
    ['  leyendo 3 anchos...', '#71717a'],
    ['  390  ok', '#a1a1aa'],
    ['  768  ok', '#a1a1aa'],
    ['  1280 el menu desaparece', '#f87171'],
  ]
  return (
    <div className={compact ? 'p-3' : 'p-6'} style={{ background: '#0a0a0b' }}>
      {lineas.map(([texto, color], i) => (
        <div key={i} className={`font-mono leading-relaxed ${compact ? 'text-[10px]' : 'text-sm'}`} style={{ color }}>
          {texto || ' '}
        </div>
      ))}
    </div>
  )
}

// Para los efectos que necesitan formas grandes (levantar una portada, doblarla).
function Titular({ compact, t }) {
  return (
    <div className={`h-full flex flex-col justify-end ${compact ? 'p-4' : 'p-10'}`} style={{ background: '#4f46e5' }}>
      <div className={`font-extrabold tracking-tight text-white leading-[1.05] ${compact ? 'text-xl' : 'text-5xl'}`}>
        Vibeset
      </div>
      <div className={`font-mono text-white/80 mt-1 ${compact ? 'text-[10px]' : 'text-sm'}`}>{t.demoLine}</div>
    </div>
  )
}

const VARIANTES = {
  bubble: 'catalogo',
  cloth: 'catalogo',
  asciify: 'codigo',
  peel: 'titular',
  bend: 'catalogo',
  laser: 'terminal',
  particleScroll: 'catalogo',
}

export default function SuperficieDemo({ clave, compact = false, t, variante }) {
  const cual = variante ?? VARIANTES[clave] ?? 'catalogo'

  if (cual === 'titular') return <Titular compact={compact} t={t} />

  return (
    <div className="w-full h-full overflow-hidden flex flex-col" style={{ background: '#0a0a0b' }}>
      <Cabecera compact={compact} />
      {/* Debajo del código y del terminal va una fila de fichas: rellena el alto
          de la caja y le da al efecto algo con contraste hasta abajo, que es
          justo lo que necesitan la lente de ASCII y el trama de un bit. */}
      {cual === 'codigo' && <Codigo compact={compact} />}
      {cual === 'terminal' && <Terminal compact={compact} />}
      {cual !== 'catalogo' && <Catalogo compact={compact} filas={1} estirar />}
      {cual === 'catalogo' && <Catalogo compact={compact} estirar />}
    </div>
  )
}

// Contenido alto, para los efectos que necesitan que haya scroll de verdad.
export function SuperficieAlta({ compact, t }) {
  return (
    <div className="w-full" style={{ background: '#0a0a0b' }}>
      <Cabecera compact={compact} />
      <Catalogo compact={compact} filas={2} />
      <div className={compact ? 'px-3 pb-3' : 'px-6 pb-6'}>
        {FICHAS.map((f) => (
          <div
            key={f.name}
            className={`flex items-center justify-between border-b border-zinc-800 ${compact ? 'py-1.5' : 'py-2.5'}`}
          >
            <span className={`font-bold ${compact ? 'text-[11px]' : 'text-base'}`} style={{ color: f.color }}>
              {f.name}
            </span>
            <span className={`font-mono text-zinc-500 ${compact ? 'text-[9px]' : 'text-xs'}`}>{f.year}</span>
          </div>
        ))}
      </div>
      <Codigo compact={compact} />
      <div className={`font-mono text-zinc-600 ${compact ? 'text-[9px] px-3 pb-3' : 'text-xs px-6 pb-6'}`}>
        {t.demoLine}
      </div>
    </div>
  )
}
