'use client'

import type { QueueItem } from './types'

const QUEUE_COLORS: Record<string, { bg: string; border: string; dot: string }> = {
  task: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', dot: 'bg-blue-500' },
  microtask: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', dot: 'bg-purple-500' },
  raf: { bg: 'bg-green-500/10', border: 'border-green-500/30', dot: 'bg-green-500' },
  callstack: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', dot: 'bg-amber-500' },
  webapi: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', dot: 'bg-cyan-500' },
}

export function QueuePanel({
  title,
  items,
  variant,
  isActive,
}: {
  title: string
  items: QueueItem[]
  variant: keyof typeof QUEUE_COLORS
  isActive?: boolean
}) {
  const colors = QUEUE_COLORS[variant]

  return (
    <div
      className={`rounded-lg border p-3 transition-all duration-300 ${
        isActive ? `${colors.bg} ${colors.border} shadow-sm` : 'border-border bg-muted/30'
      }`}
    >
      <div className="mb-2 flex items-center gap-2">
        <div className={`size-2 rounded-full ${isActive ? colors.dot : 'bg-muted-foreground/30'}`} />
        <span className="text-xs font-medium text-muted-foreground">{title}</span>
        {items.length > 0 && (
          <span className="ml-auto rounded-full bg-foreground/10 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
            {items.length}
          </span>
        )}
      </div>
      <div className="flex min-h-8 flex-wrap gap-1.5">
        {items.length === 0 ? (
          <span className="text-[11px] italic text-muted-foreground/50">empty</span>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className={`rounded-md border px-2 py-1 text-xs font-mono transition-all duration-300 ${colors.border} ${colors.bg}`}
            >
              {item.label}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
