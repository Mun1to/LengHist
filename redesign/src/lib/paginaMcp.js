// La cara humana del endpoint MCP. Un MCP es una API para agentes: si abres
// /api/mcp en el navegador (un GET que pide HTML), en vez del JSON pelado sale esta
// página. El agente, que pide JSON, sigue recibiendo la tarjeta de salud. El GET
// mira el header Accept para decidir cuál de las dos dar (ver functions/api/mcp.js).
//
// El diseño es el de la casa: el lenguaje de plano técnico de la portada (marcos de
// 1px con marcas de encuadre, rótulos en mono, la paleta sobria de zinc con acento
// azul, Inter + JetBrains Mono, el resplandor índigo). Los tokens salen de
// src/index.css; aquí van resueltos porque la página es autocontenida, sin Tailwind.
import { buscarCatalogo } from './registro.js'

const cuenta = (tipo) => buscarCatalogo('', { tipo }).length

// Un bloque con marco de plano técnico y sus cuatro marcas de encuadre en L.
function bloque(rotulo, nota, cuerpo) {
  return `<section class="bloque">
      <i class="esq tl"></i><i class="esq tr"></i><i class="esq bl"></i><i class="esq br"></i>
      <header class="bloque-h"><span class="rotulo">${rotulo}</span>${nota ? `<span class="nota">${nota}</span>` : ''}</header>
      <div class="bloque-b">${cuerpo}</div>
    </section>`
}

export function paginaMcp() {
  const total = buscarCatalogo('', {}).length
  const componentes = cuenta('component')
  const skills = cuenta('skill')
  const conceptos = cuenta('concept')
  const consejos = cuenta('tip')
  const recursos = cuenta('resource')

  const stat = (n, l) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`
  const stats = bloque('El catálogo', `${total} items propios`, `<div class="stats">
        ${stat(total, 'items propios de la casa')}
        ${stat('~4.400', 'componentes federados')}
        ${stat('289', 'registries descubribles')}
        ${stat('~334k', 'iconos, con su licencia')}
      </div>
      <p class="desglose">${componentes} componentes · ${skills} skills · ${conceptos} conceptos · ${consejos} consejos · ${recursos} recursos</p>`)

  const tool = (n, d) => `<div class="tool"><code>${n}</code><p>${d}</p></div>`
  const tools = bloque('Cuatro herramientas', null, `<div class="tools">
        ${tool('search', `${componentes} componentes, ${skills} skills, ${conceptos} conceptos, ${consejos} consejos y ${recursos} recursos, filtrados por el criterio de la casa. Con source:"all", federa terceros.`)}
        ${tool('get_item', 'Una skill entera, un concepto con su prompt listo, o el comando de instalación de un componente.')}
        ${tool('list_registries', 'Los 12 registries que se federan en vivo, o los 289 del directorio oficial de shadcn.')}
        ${tool('search_icons', 'Iconos de Iconify con su licencia SPDX y si permiten uso comercial. Sin API key.')}
      </div>`)

  const conectar = bloque('Cómo se conecta', null, `<div class="term">
        <span class="p">$</span><code id="cmd">claude mcp add --transport http vibeset https://vibeset.dev/api/mcp</code>
        <button class="copy pulsable" onclick="copiar()">copiar</button>
      </div>
      <p class="alt">O en cualquier cliente stdio: <code>npx mcp-remote https://vibeset.dev/api/mcp</code></p>`)

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="dark">
<title>Vibeset · MCP</title>
<meta name="description" content="El servidor MCP de Vibeset: componentes, skills, conceptos, ~4.400 componentes federados e iconos, para tu agente.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  :root {
    --bg: #09090b; --panel: #18181b; --panel-2: #131316;
    --tinta: #fafafa; --tinta-fuerte: #e4e4e7; --tinta-suave: #a1a1aa;
    --linea: #27272a; --linea-viva: #3f3f46;
    --acento: #60a5fa; --indigo: #818cf8;
    --sans: 'Inter', system-ui, -apple-system, sans-serif;
    --mono: 'JetBrains Mono', ui-monospace, Consolas, monospace;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0; background: var(--bg); color: var(--tinta);
    font-family: var(--sans); font-size: 17px; line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  .resplandor { position: fixed; inset: 0; pointer-events: none; z-index: 0;
    background: radial-gradient(900px 420px at 12% -8%, rgba(129,140,248,.22), transparent 70%); }
  main { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: clamp(2.5rem, 7vw, 5.5rem) 1.25rem 4rem; }
  .rotulo { font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .16em; color: var(--tinta-suave); }
  h1 { font-size: clamp(2.2rem, 7vw, 3.25rem); line-height: 1.06; letter-spacing: -.02em; font-weight: 800; margin: 1rem 0 .75rem; }
  h1 span { color: var(--tinta-suave); font-weight: 500; }
  .lead { font-size: 1.15rem; color: var(--tinta-fuerte); max-width: 52ch; margin: 0 0 2.5rem; }

  .bloque { position: relative; border: 1px solid var(--linea); background: var(--panel); margin-bottom: 1.1rem; }
  .esq { position: absolute; width: 10px; height: 10px; pointer-events: none; }
  .tl { top: -1px; left: -1px; border-top: 1px solid var(--tinta); border-left: 1px solid var(--tinta); }
  .tr { top: -1px; right: -1px; border-top: 1px solid var(--tinta); border-right: 1px solid var(--tinta); }
  .bl { bottom: -1px; left: -1px; border-bottom: 1px solid var(--tinta); border-left: 1px solid var(--tinta); }
  .br { bottom: -1px; right: -1px; border-bottom: 1px solid var(--tinta); border-right: 1px solid var(--tinta); }
  .bloque-h { display: flex; align-items: baseline; justify-content: space-between; gap: 1.5rem; padding: .8rem 1.25rem; border-bottom: 1px solid var(--linea); }
  .bloque-h .nota { font-family: var(--mono); font-size: 12px; color: var(--tinta-suave); }
  .bloque-b { padding: 1.25rem; }

  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1px; background: var(--linea); border: 1px solid var(--linea); }
  .stat { background: var(--panel); padding: 1rem 1.1rem; }
  .stat b { display: block; font-family: var(--mono); font-size: 1.9rem; font-weight: 500; letter-spacing: -.01em; color: var(--tinta); }
  .stat span { font-size: .9rem; color: var(--tinta-suave); }
  .desglose { font-family: var(--mono); font-size: 12.5px; color: var(--tinta-suave); margin: 1rem 0 0; }

  .tools { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--linea); border: 1px solid var(--linea); }
  .tool { background: var(--panel); padding: 1rem 1.1rem; }
  .tool code { font-family: var(--mono); font-size: .95rem; color: var(--acento); font-weight: 500; }
  .tool p { margin: .4rem 0 0; color: var(--tinta-suave); font-size: .92rem; line-height: 1.5; }

  .term { display: flex; align-items: center; gap: .6rem; background: var(--bg); border: 1px solid var(--linea-viva); padding: .85rem 1rem; overflow-x: auto; }
  .term .p { font-family: var(--mono); color: var(--acento); flex: none; }
  .term code { font-family: var(--mono); font-size: .92rem; color: var(--tinta-fuerte); white-space: nowrap; }
  .copy { margin-left: auto; flex: none; font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .08em;
    background: transparent; color: var(--tinta-suave); border: 1px solid var(--linea-viva); padding: .4rem .7rem; cursor: pointer; }
  .copy:hover { color: var(--tinta); border-color: var(--tinta-suave); }
  .alt { margin: .85rem 0 0; color: var(--tinta-suave); font-size: .92rem; }
  .alt code { font-family: var(--mono); font-size: .88rem; color: var(--tinta-fuerte); }

  .nota-lic { margin: 2rem 0 0; padding-left: 1rem; border-left: 2px solid var(--linea-viva); color: var(--tinta-suave); font-size: .92rem; }

  footer { margin-top: 2.5rem; padding-top: 1.5rem; border-top: 1px solid var(--linea); display: flex; flex-wrap: wrap; gap: .5rem 1.5rem; align-items: center; }
  footer a { font-family: var(--mono); font-size: 12.5px; color: var(--acento); text-decoration: none; }
  footer a:hover { text-decoration: underline; }
  footer .firma { font-family: var(--mono); font-size: 12.5px; color: var(--tinta-suave); margin-left: auto; }

  .pulsable { transition: transform 120ms cubic-bezier(.2,.8,.2,1), color 160ms ease, border-color 160ms ease; }
  .pulsable:active { transform: scale(.97); transition-duration: 60ms; }

  @media (max-width: 560px) { .tools { grid-template-columns: 1fr; } footer .firma { margin-left: 0; } }
  @media (prefers-reduced-motion: reduce) { .pulsable, .pulsable:active { transform: none; transition-duration: 1ms; } }
</style>
</head>
<body>
  <div class="resplandor"></div>
  <main>
    <div class="rotulo">Vibeset · Servidor MCP</div>
    <h1>El enchufe de Vibeset <span>para tu agente</span></h1>
    <p class="lead">Componentes, skills y todo el conocimiento de la casa, servidos por Model Context Protocol. Esto es un endpoint para máquinas: el contenido de verdad llega por las herramientas, no por esta página.</p>

    ${stats}
    ${tools}
    ${conectar}

    <p class="nota-lic">Vibeset indexa y enlaza, nunca rehospeda el código de terceros. Las skills, los conceptos y los recursos son CC BY de la casa.</p>

    <footer>
      <a href="https://vibeset.dev">vibeset.dev</a>
      <a href="https://github.com/Mun1to/Vibeset/blob/main/MCP.md">MCP.md</a>
      <span class="firma">Munir Torres</span>
    </footer>
  </main>
  <script>
    function copiar() {
      var t = document.getElementById('cmd').textContent;
      var b = document.querySelector('.copy');
      navigator.clipboard.writeText(t).then(function () { b.textContent = 'copiado'; setTimeout(function () { b.textContent = 'copiar'; }, 1500); });
    }
  </script>
</body>
</html>`
}
