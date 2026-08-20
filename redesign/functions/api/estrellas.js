// Cuántas estrellas tiene el repositorio, servidas desde el propio dominio.
//
// Por qué existe esto en vez de llamar a `api.github.com` desde el navegador,
// que sería la mitad de código: **el sitio promete «sin rastreo»**, y una
// petición del visitante a GitHub le entrega su IP y su cabecera de navegador a
// un tercero para pintar un número. Que el botón LLEVE a GitHub es otra cosa:
// eso lo decide quien pulsa. Aquí decide la página, y por eso el visitante solo
// habla con vibeset.dev.
//
// El caché no es un lujo: sin autenticar, GitHub deja 60 peticiones por hora y
// por IP, y aquí todas salen de las IPs de Cloudflare, así que sin él una punta
// de visitas agotaría el cupo en un minuto. Con quince minutos de caché, el
// número sigue siendo actual (un repositorio no gana estrellas por segundo) y
// las peticiones reales a GitHub caben de sobra en el cupo.
//
// Vive en `functions/` porque Cloudflare Pages publica esa carpeta como
// endpoints sin configurar nada. En desarrollo no la ejecuta Vite: el mismo
// endpoint lo levanta un plugin de `vite.config.js`, para que lo que se prueba
// en local sea lo mismo que se sirve en producción.

const REPO = 'https://api.github.com/repos/Mun1to/Vibeset'
const CACHE_SEGUNDOS = 900

export async function onRequestGet() {
  try {
    const r = await fetch(REPO, {
      headers: {
        // GitHub rechaza las peticiones sin User-Agent, y el suyo es el sitio.
        'User-Agent': 'vibeset.dev',
        Accept: 'application/vnd.github+json',
      },
      cf: { cacheTtl: CACHE_SEGUNDOS, cacheEverything: true },
    })

    if (!r.ok) return error(r.status)

    const datos = await r.json()
    const estrellas = Number(datos.stargazers_count)
    if (!Number.isFinite(estrellas)) return error(502)

    // Solo sale el número. La respuesta de GitHub trae medio centenar de campos
    // que aquí no pinta nadie, y reenviarlos sería filtrar por costumbre.
    return new Response(JSON.stringify({ estrellas }), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_SEGUNDOS}, s-maxage=${CACHE_SEGUNDOS}`,
      },
    })
  } catch {
    return error(502)
  }
}

// Sin número, el botón sigue funcionando: enseña el logo y lleva al repositorio.
// Por eso el fallo se responde con un JSON legible y no con una página de error.
function error(codigo) {
  return new Response(JSON.stringify({ estrellas: null }), {
    status: codigo >= 500 ? 502 : codigo,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
    },
  })
}
