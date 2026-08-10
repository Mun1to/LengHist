import { useState } from 'react'
import { motion } from 'framer-motion'
import Modal from './Modal'
import { LANGUAGES } from '../data/languages'

function scoreLang(l, s) {
  let score = 0
  s.cats.forEach((c) => { if (l.categories.includes(c)) score += 4 })
  if (s.boost.includes(l.name)) score += 5
  if (s.val === 'easy') {
    if (l.fame === 'top' || l.fame === 'popular') score += 3
    if (l.categories.includes('educativo')) score += 2
  }
  if (s.val === 'perf') {
    if (l.categories.includes('sistemas')) score += 3
    if (['C', 'C++', 'Rust', 'Go'].includes(l.name)) score += 2
  }
  if (s.val === 'jobs') score += l.pop / 18
  if (s.val === 'modern') score += Math.max(0, (l.year - 2000) / 3)
  if (s.level === 'beg') {
    if (l.fame === 'top' || l.fame === 'popular') score += 3
    if (l.categories.includes('educativo')) score += 3
    if (l.categories.includes('funcional')) score -= 2
  }
  if (s.level === 'adv') {
    if (l.categories.includes('funcional') || l.categories.includes('sistemas')) score += 2
  }
  return score
}

const EMPTY = { step: 0, cats: [], boost: [], level: null, val: null }

export default function Quiz({ t, lang, open, onClose, onSeeLanguage }) {
  const [state, setState] = useState(EMPTY)
  const steps = t.quizSteps
  const done = state.step >= steps.length

  const pick = (o) => {
    setState((s) => ({
      ...s,
      cats: o.cats ? [...s.cats, ...o.cats] : s.cats,
      boost: o.boost ? [...s.boost, ...o.boost] : s.boost,
      level: o.level ?? s.level,
      val: o.val ?? s.val,
      step: s.step + 1,
    }))
  }

  const close = () => { onClose(); setTimeout(() => setState(EMPTY), 250) }

  const ranked = done
    ? LANGUAGES.map((l) => ({ l, s: scoreLang(l, state) })).sort((a, b) => b.s - a.s).slice(0, 3)
    : []

  return (
    <Modal open={open} onClose={close} title={done ? t.quizResult : t.quizTitle}>
      {!done ? (
        <div>
          <div className="h-1 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden mb-3">
            <motion.div
              className="h-full bg-indigo-500"
              animate={{ width: `${(state.step / steps.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="font-mono text-xs text-zinc-400 mb-4">{t.quizStep(state.step + 1, steps.length)}</div>
          <p className="text-lg font-semibold mb-5">{steps[state.step].q}</p>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {steps[state.step].opts.map((o) => (
              <button
                key={o.label}
                onClick={() => pick(o)}
                className="text-left rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 px-4 py-3.5 text-sm font-medium cursor-pointer hover:border-indigo-500 hover:bg-indigo-500/5 transition-colors"
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">{t.quizResultSub}</p>
          <div className="flex flex-col gap-3">
            {ranked.map((r, i) => (
              <motion.div
                key={r.l.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-xl border-l-[3px] border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 p-4"
                style={{ borderLeftColor: r.l.color[0] }}
              >
                <span className="font-mono font-bold text-indigo-500 dark:text-indigo-400">#{i + 1}</span>
                <span className="text-2xl">{r.l.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm">{r.l.name}</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{r.l[lang].desc}</div>
                </div>
                <button
                  onClick={() => { onSeeLanguage(r.l.name); close() }}
                  className="shrink-0 text-xs font-semibold text-indigo-600 dark:text-indigo-400 border-b border-indigo-500/40 hover:border-indigo-500 pb-0.5 cursor-pointer"
                >
                  {t.verFicha}
                </button>
              </motion.div>
            ))}
          </div>
          <button
            onClick={() => setState(EMPTY)}
            className="mt-6 text-sm font-semibold text-zinc-500 dark:text-zinc-400 border-b border-zinc-300 dark:border-zinc-600 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500 pb-0.5 cursor-pointer transition-colors"
          >
            {t.quizRestart}
          </button>
        </div>
      )}
    </Modal>
  )
}
