// La cara humana del endpoint MCP. Un MCP es una API para agentes: si abres
// /api/mcp en el navegador (un GET que pide HTML), en vez del JSON pelado sale esta
// página. El agente, que pide JSON, sigue recibiendo la tarjeta de salud. El GET
// mira el header Accept para decidir cuál de las dos dar (ver functions/api/mcp.js).
import { buscarCatalogo } from './registro.js'

const cuenta = (tipo) => buscarCatalogo('', { tipo }).length

export function paginaMcp() {
  const total = buscarCatalogo('', {}).length
  const componentes = cuenta('component')
  const skills = cuenta('skill')
  const conceptos = cuenta('concept')
  const consejos = cuenta('tip')
  const recursos = cuenta('resource')

  return `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Vibeset MCP</title>
<meta name="description" content="El servidor MCP de Vibeset: componentes, skills, conceptos, ~4.400 componentes federados e iconos, para tu agente.">
<style>
  :root {
    --bg: #0b0d12; --surface: #14171f; --surface-2: #191d27; --line: #262b38;
    --fg: #e8eaf0; --muted: #969db0;
    --indigo: #818cf8; --indigo-2: #6366f1; --green: #34d399;
    --radius: 16px;
  }
  * { box-sizing: border-box; }
  html { -webkit-text-size-adjust: 100%; }
  body {
    margin: 0; background: var(--bg); color: var(--fg);
    font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6; -webkit-font-smoothing: antialiased;
    background-image: radial-gradient(60rem 40rem at 50% -10rem, rgba(99,102,241,.18), transparent 70%);
  }
  main { max-width: 780px; margin: 0 auto; padding: clamp(2rem, 6vw, 5rem) 1.25rem 4rem; }
  .badge {
    display: inline-flex; align-items: center; gap: .5rem;
    font-size: .8rem; letter-spacing: .02em; color: var(--indigo);
    background: rgba(129,140,248,.1); border: 1px solid rgba(129,140,248,.25);
    padding: .35rem .75rem; border-radius: 999px;
  }
  .dot { width: .5rem; height: .5rem; border-radius: 50%; background: var(--green); box-shadow: 0 0 0 3px rgba(52,211,153,.2); }
  h1 { font-size: clamp(2.4rem, 8vw, 3.6rem); line-height: 1.05; margin: 1.25rem 0 .5rem; letter-spacing: -.02em; font-weight: 800; }
  h1 span { color: var(--indigo); }
  .lead { font-size: 1.12rem; color: #c3c8d4; max-width: 46ch; margin: 0; }
  .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: .75rem; margin: 2.5rem 0; }
  .stats div { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.1rem 1.2rem; }
  .stats b { display: block; font-size: 1.7rem; font-weight: 800; letter-spacing: -.02em; }
  .stats span { color: var(--muted); font-size: .9rem; }
  h2 { font-size: 1.25rem; margin: 2.75rem 0 1rem; font-weight: 700; }
  .tools { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
  .tools article { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.1rem 1.2rem; }
  .tools code { color: var(--indigo); font-weight: 600; font-size: .95rem; }
  .tools p { margin: .35rem 0 0; color: var(--muted); font-size: .92rem; }
  .connect { background: var(--surface-2); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.4rem; margin-top: 1rem; }
  .cmd { display: flex; align-items: center; gap: .5rem; background: #0c0e14; border: 1px solid var(--line); border-radius: 12px; padding: .85rem 1rem; margin: .25rem 0 .75rem; overflow-x: auto; }
  .cmd code { font-family: ui-monospace, "SF Mono", "Cascadia Code", Consolas, monospace; font-size: .92rem; color: #d7dbe6; white-space: nowrap; }
  button.copy { margin-left: auto; flex: none; background: var(--indigo-2); color: #fff; border: 0; border-radius: 8px; padding: .4rem .7rem; font-size: .82rem; cursor: pointer; font-weight: 600; }
  button.copy:hover { background: var(--indigo); }
  .connect p { margin: 0; color: var(--muted); font-size: .92rem; }
  .connect p code { font-family: ui-monospace, Consolas, monospace; color: #c3c8d4; }
  .note { margin-top: 2.5rem; padding: 1rem 1.2rem; border-left: 3px solid var(--indigo-2); background: rgba(99,102,241,.06); border-radius: 0 12px 12px 0; color: var(--muted); font-size: .92rem; }
  footer { margin-top: 3rem; padding-top: 1.5rem; border-top: 1px solid var(--line); color: var(--muted); font-size: .9rem; display: flex; flex-wrap: wrap; gap: .5rem 1rem; align-items: center; }
  footer a { color: var(--indigo); text-decoration: none; }
  footer a:hover { text-decoration: underline; }
  @media (max-width: 520px) { .tools { grid-template-columns: 1fr; } }
</style>
</head>
<body>
  <main>
    <div class="badge"><span class="dot"></span> MCP en vivo · Streamable HTTP</div>
    <h1>Vibeset <span>MCP</span></h1>
    <p class="lead">La despensa de componentes, skills y conocimiento de Vibeset, servida para tu agente. Esto es un endpoint para máquinas: el contenido de verdad llega por las herramientas, no por esta página.</p>

    <section class="stats">
      <div><b>${total}</b><span>items propios de la casa</span></div>
      <div><b>~4.400</b><span>componentes federados</span></div>
      <div><b>289</b><span>registries descubribles</span></div>
      <div><b>~334k</b><span>iconos (Iconify)</span></div>
    </section>

    <h2>Cuatro herramientas</h2>
    <div class="tools">
      <article><code>search</code><p>${componentes} componentes, ${skills} skills, ${conceptos} conceptos, ${consejos} consejos y ${recursos} recursos, filtrados por el criterio de la casa. Con source:"all" federa terceros.</p></article>
      <article><code>get_item</code><p>Una skill entera, un concepto con su prompt listo, o el comando de instalación de un componente.</p></article>
      <article><code>list_registries</code><p>Los 12 registries que se federan en vivo, o los 289 del directorio oficial de shadcn para descubrir.</p></article>
      <article><code>search_icons</code><p>Iconos de Iconify con su licencia y si permiten uso comercial. Sin API key.</p></article>
    </div>

    <h2>Conéctalo a tu agente</h2>
    <div class="connect">
      <div class="cmd">
        <code id="cmd">claude mcp add --transport http vibeset https://vibeset.dev/api/mcp</code>
        <button class="copy" onclick="copiar()">Copiar</button>
      </div>
      <p>O en cualquier cliente stdio: <code>npx mcp-remote https://vibeset.dev/api/mcp</code></p>
    </div>

    <div class="note">Vibeset indexa y enlaza, nunca rehospeda el código de terceros. Las skills, los conceptos y los recursos son CC BY de la casa.</div>

    <footer>
      <a href="https://vibeset.dev">vibeset.dev</a>
      <a href="https://github.com/Mun1to/Vibeset/blob/main/MCP.md">Documentación (MCP.md)</a>
      <span>Hecho por Munir Torres</span>
    </footer>
  </main>
  <script>
    function copiar() {
      var t = document.getElementById('cmd').textContent;
      var b = document.querySelector('button.copy');
      navigator.clipboard.writeText(t).then(function () { b.textContent = 'Copiado'; setTimeout(function () { b.textContent = 'Copiar'; }, 1500); });
    }
  </script>
</body>
</html>`
}
