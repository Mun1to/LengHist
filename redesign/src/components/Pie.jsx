import { ArrowUpRight } from 'lucide-react'

// El pie vivía dentro de la portada, así que en las seis vistas de catálogo no
// existía: quien llega por un buscador a una ficha suelta, la lee y se va, no
// veía en ningún momento que esto tiene el código a la vista, que se puede
// auditar y que acepta aportaciones. Ahora va en la plantilla, debajo de todo, y
// lleva enlaces, que es lo que un pie hace.
const REPO = 'https://github.com/Mun1to/Vibeset'

const ENLACES = [
  { clave: 'pieCodigo', url: REPO },
  { clave: 'pieAportar', url: `${REPO}/blob/main/APORTAR.md` },
  { clave: 'pieLicencia', url: `${REPO}/blob/main/LICENSING.md` },
  { clave: 'pieAuditar', url: `${REPO}/blob/main/AI-AUDIT.md` },
]

export default function Pie({ t, totals }) {
  return (
    <footer className="border-t border-linea px-6 sm:px-10 py-8 mt-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="font-mono text-[11px] text-tinta-suave">
          {t.stats({ langs: totals.langs, res: totals.res, concepts: totals.concepts, skills: totals.skills })}
        </p>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-1" aria-label={t.pieTitulo}>
          {ENLACES.map(({ clave, url }) => (
            <a
              key={clave}
              href={url}
              target="_blank"
              rel="noreferrer"
              className="pulsable inline-flex items-center gap-1 min-h-6 text-xs font-medium text-tinta-suave hover:text-tinta transition-colors"
            >
              {t[clave]}
              <ArrowUpRight size={12} />
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
