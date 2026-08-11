import { motion } from 'framer-motion'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import ComponentDemo from './ComponentDemo'
import ControlPanel from './ControlPanel'
import CodeBlock from './CodeBlock'
import FavButton from './FavButton'
import useHtmlInCanvas from '../hooks/useHtmlInCanvas'
import { usageSnippet } from '../data/components'

export default function ComponentDetail({ t, lang, item, values, onChange, onReset, onBack, fav, onToggleFav }) {
  const htmlInCanvas = useHtmlInCanvas()
  const needsHtmlInCanvas = item.labels?.includes('html-in-canvas')

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="px-6 sm:px-10 py-10 max-w-5xl"
    >
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 cursor-pointer transition-colors mb-6"
      >
        <ArrowLeft size={14} />
        {t.compBack}
      </button>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">{item.name}</h1>
        <FavButton active={fav} onClick={onToggleFav} label={t.favoritos} />
      </div>

      <div className="font-mono text-[11px] uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mt-1.5">
        {item.labels.join(' · ')}
      </div>

      <p className="text-zinc-500 dark:text-zinc-400 mt-4 max-w-2xl leading-relaxed">{item.desc[lang]}</p>

      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 mt-3 transition-colors"
        >
          {t.compSource} {new URL(item.url).hostname}
          <ArrowUpRight size={13} />
        </a>
      ) : (
        <div className="text-sm text-zinc-400 mt-3">{t.compOwn}</div>
      )}

      <div className="relative h-[420px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200 dark:border-zinc-800 mt-8">
        <ComponentDemo item={item} values={values} lang={lang} t={t} />
      </div>
      {needsHtmlInCanvas && !htmlInCanvas && (
        <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed max-w-2xl">{t.compHicWarn}</p>
      )}

      <div className="mt-6 border border-zinc-200 dark:border-zinc-800 rounded-2xl px-4 py-3 bg-white dark:bg-zinc-900/50">
        <ControlPanel
          t={t} lang={lang} controls={item.controls} values={values}
          onChange={onChange} onReset={onReset}
        />
      </div>

      <div className="flex flex-col gap-4 mt-10">
        <CodeBlock t={t} title={t.compUsage} code={usageSnippet(item, values)} />
        {item.install && <CodeBlock t={t} title={t.compInstall} code={item.install} />}
        {item.deps?.length > 0 && (
          <div className="text-sm text-zinc-400">
            {t.compDeps} <span className="font-mono text-zinc-500 dark:text-zinc-300">{item.deps.join(', ')}</span>
          </div>
        )}
      </div>

      {/* Crédito al pie: discreto, pero con el enlace exacto de donde salió. */}
      {item.url && (
        <div className="mt-12 pt-5 border-t border-zinc-200/60 dark:border-zinc-800/60">
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-zinc-400/60 hover:text-zinc-500 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors break-all"
          >
            {t.compCredit} {item.url.replace('https://', '')}
          </a>
        </div>
      )}
    </motion.section>
  )
}
