import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

// Con enlaces de verdad hacen falta callejones sin salida de verdad: una
// dirección equivocada tiene que decirlo, no dejar la portada como si nada.
export default function NoEncontrado({ t }) {
  return (
    <section className="px-6 sm:px-10 py-24 max-w-2xl">
      <div className="font-mono text-xs uppercase tracking-[.14em] text-indigo-600 dark:text-indigo-400">404</div>
      <h1 className="text-3xl font-extrabold tracking-tight mt-3">{t.noHayTitulo}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mt-3 leading-relaxed">{t.noHayTexto}</p>

      <Link
        to="/"
        className="inline-flex items-center gap-1.5 mt-7 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-5 py-2.5 text-sm hover:opacity-90 transition-opacity"
      >
        {t.noHayVolver}
        <ArrowRight size={14} />
      </Link>

      <div className="font-mono text-[11px] text-zinc-400 dark:text-zinc-600 mt-4">{t.noHayBuscar}</div>
    </section>
  )
}
