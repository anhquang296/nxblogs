'use client'

export function ConsolePanel({ output }: { output: string[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-[#1e1e2e]">
      <div className="border-b border-white/10 px-3 py-1.5">
        <span className="text-[11px] text-white/40">Console</span>
      </div>
      <div className="max-h-35 min-h-15 overflow-y-auto p-3 font-mono text-[13px] leading-6">
        {output.length === 0 ? (
          <span className="text-white/20">{'>'} _</span>
        ) : (
          output.map((line, i) => (
            <div key={i} className="text-green-400">
              <span className="text-white/30">{'>'} </span>
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
