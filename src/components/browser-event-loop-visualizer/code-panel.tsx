'use client'

export function CodePanel({ code, highlightLines }: { code: string; highlightLines: number[] }) {
  const lines = code.split('\n')

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#1e1e2e]">
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <div className="size-2.5 rounded-full bg-[#ff5f57]" />
        <div className="size-2.5 rounded-full bg-[#febc2e]" />
        <div className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[11px] text-white/40">script.js</span>
      </div>
      <div className="overflow-x-auto p-3 font-mono text-[13px] leading-6">
        {lines.map((line, i) => {
          const lineNum = i + 1
          const isHighlighted = highlightLines.includes(lineNum)
          return (
            <div
              key={i}
              className={`flex transition-colors duration-200 ${isHighlighted ? 'rounded bg-amber-500/20' : ''}`}
            >
              <span className={`mr-4 inline-block w-5 text-right ${isHighlighted ? 'text-amber-400' : 'text-white/20'}`}>
                {lineNum}
              </span>
              <span className="text-white/80">{line || ' '}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
