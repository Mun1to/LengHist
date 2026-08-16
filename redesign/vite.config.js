import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// El sitemap se genera del propio catálogo en cada build, no a mano: son 135
// direcciones y una lista escrita a mano se queda vieja en cuanto se añade un
// lenguaje. Se emite al dist, así que no hay un archivo generado versionado.
function sitemap() {
  const BASE = 'https://vibeset.dev'

  return {
    name: 'vibeset-sitemap',
    async generateBundle() {
      const { LANGUAGES } = await import('./src/data/languages.js')
      const { COMPONENT_ITEMS } = await import('./src/data/components.js')
      const { SKILL_ITEMS } = await import('./src/data/skills.js')
      const { rutaDe, slugClave, slugLenguaje } = await import('./src/lib/rutas.js')

      const rutas = [
        { ruta: '/', prioridad: '1.0' },
        ...['languages', 'resources', 'concepts', 'components', 'skills', 'consejos']
          .map((s) => ({ ruta: rutaDe(s), prioridad: '0.9' })),
        ...LANGUAGES.map((l) => ({ ruta: rutaDe('languages', slugLenguaje(l.name)), prioridad: '0.7' })),
        ...COMPONENT_ITEMS.map((c) => ({ ruta: rutaDe('components', slugClave(c.key)), prioridad: '0.7' })),
        ...SKILL_ITEMS.map((s) => ({ ruta: rutaDe('skills', slugClave(s.key)), prioridad: '0.7' })),
      ]

      const hoy = new Date().toISOString().slice(0, 10)
      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${rutas.map(({ ruta, prioridad }) => `  <url>
    <loc>${BASE}${ruta}</loc>
    <lastmod>${hoy}</lastmod>
    <priority>${prioridad}</priority>
  </url>`).join('\n')}
</urlset>
`

      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: xml })
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`,
      })
      console.log(`\n  sitemap.xml con ${rutas.length} direcciones`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), sitemap()],
  server: { port: 5183, strictPort: true },
})
