const TOKEN_CLASS = {
  cmt: 'text-zinc-500',
  kw: 'text-indigo-400',
  str: 'text-emerald-400',
  fn: 'text-cyan-400',
  plain: 'text-zinc-200',
}

export default function CodeBlock({ tokens, className = '' }) {
  return (
    <pre className={`font-mono text-[13px] leading-relaxed whitespace-pre-wrap ${className}`}>
      {tokens.map((tok, i) => (
        <span key={i} className={TOKEN_CLASS[tok.t]}>
          {tok.v}
        </span>
      ))}
    </pre>
  )
}
