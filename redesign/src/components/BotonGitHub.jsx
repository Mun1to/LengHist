import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

const REPO = 'https://github.com/Mun1to/Vibeset'

// El logo va inline y no desde una librería de iconos a propósito: es una marca
// registrada, y la gente la reconoce por su forma exacta. Las versiones
// «inspiradas» de los packs de iconos se notan, y en un botón que pide confianza
// para llevarte a otro sitio, notarse es justo lo que no interesa.
function LogoGitHub({ size = 15 }) {
  return (
    <svg
      aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="currentColor"
      className="shrink-0"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  )
}

// Las estrellas del repositorio, en vivo, servidas desde el propio dominio
// (`functions/api/estrellas.js`). Ver ahí por qué no se llama a GitHub desde
// aquí, que sería la mitad de código.
// `conTexto` es para el panel del móvil, donde no hay ratón que pueda pasar por
// encima de nada: allí la invitación va escrita al lado, porque un botón cuyo
// significado solo aparece al hacer hover, en un móvil, no aparece nunca.
export default function BotonGitHub({ t, conTexto = false }) {
  const [estrellas, setEstrellas] = useState(null)

  useEffect(() => {
    // `AbortController` no es ceremonia: en desarrollo React monta dos veces, y
    // sin esto el segundo montaje deja una petición huérfana escribiendo en un
    // componente que ya no existe.
    const corta = new AbortController()
    fetch('/api/estrellas', { signal: corta.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (typeof d?.estrellas === 'number') setEstrellas(d.estrellas) })
      .catch(() => {})
    return () => corta.abort()
  }, [])

  const cuenta = (
    <span className="flex items-center gap-1 text-[13px] font-semibold leading-none">
      <Star size={12} className="shrink-0" aria-hidden="true" />
      {/* Mientras no se sabe el número no se enseña un cero, que sería mentira:
          se enseña una raya, que es «todavía no lo sé». */}
      <span className="font-mono">{estrellas === null ? '—' : estrellas}</span>
    </span>
  )

  const etiqueta = estrellas === null ? t.githubAria : `${t.githubAria} · ${estrellas} ★`

  if (conTexto) {
    return (
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={etiqueta}
        className="pulsable flex items-center gap-2.5 h-10 px-3 mt-2 border border-linea rounded-xl text-sm font-semibold text-tinta-fuerte"
      >
        <LogoGitHub size={16} />
        {t.githubContribuye}
        <span className="ml-auto text-tinta-suave">{cuenta}</span>
      </a>
    )
  }

  // En la barra, la invitación va en una capa flotante y NO dentro del botón, y
  // eso no es gusto: metida dentro, el ancho del botón lo fijaba la palabra más
  // larga («Contribuye», 118px) y la barra desbordaba 47px a 1600px de ancho,
  // con el botón del test saliéndose por la derecha. Medido, no supuesto.
  // Flotando, el botón ocupa lo que ocupa su contenido y no empuja a nadie.
  return (
    <div className="relative hidden xl:block">
      <a
        href={REPO}
        target="_blank"
        rel="noopener noreferrer"
        // Lo que oye un lector de pantalla es la frase entera, porque la
        // etiqueta que aparece al pasar el ratón no existe para quien no usa
        // ratón, y el número tampoco se lee solo.
        aria-label={etiqueta}
        className="peer pulsable inline-flex items-center gap-2 h-9 px-3 border border-linea hover:border-linea-viva text-tinta-fuerte hover:text-tinta transition-colors"
      >
        <LogoGitHub />
        {cuenta}
      </a>

      {/* Aparece también con el foco del teclado, no solo con el ratón: si solo
          respondiera al `hover`, la mitad de la gente no sabría nunca que el
          botón invita a algo. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-full right-0 mt-1.5 px-2 py-1 whitespace-nowrap bg-tinta text-[11px] font-semibold text-zinc-50 dark:text-zinc-900 opacity-0 translate-y-0.5 transition-all duration-150 peer-hover:opacity-100 peer-hover:translate-y-0 peer-focus-visible:opacity-100 peer-focus-visible:translate-y-0"
      >
        {t.githubContribuye}
      </span>
    </div>
  )
}
