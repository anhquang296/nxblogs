'use client'

import type { NodejsEventLoopPhase } from './types'

const PHASES: { id: NodejsEventLoopPhase; label: string; color: string; activeColor: string }[] = [
  {
    id: 'timers',
    label: '1. Timers',
    color: 'border-blue-500/20',
    activeColor: 'border-blue-500 bg-blue-500/15 text-blue-700 dark:text-blue-300',
  },
  {
    id: 'pending',
    label: '2. Pending Callbacks',
    color: 'border-orange-500/20',
    activeColor: 'border-orange-500 bg-orange-500/15 text-orange-700 dark:text-orange-300',
  },
  {
    id: 'idle-prepare',
    label: '3. Idle / Prepare',
    color: 'border-gray-500/20',
    activeColor: 'border-gray-500 bg-gray-500/15 text-gray-700 dark:text-gray-300',
  },
  {
    id: 'poll',
    label: '4. Poll',
    color: 'border-teal-500/20',
    activeColor: 'border-teal-500 bg-teal-500/15 text-teal-700 dark:text-teal-300',
  },
  {
    id: 'check',
    label: '5. Check',
    color: 'border-indigo-500/20',
    activeColor: 'border-indigo-500 bg-indigo-500/15 text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'close',
    label: '6. Close Callbacks',
    color: 'border-rose-500/20',
    activeColor: 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300',
  },
]

export function NodejsEventLoopPhases({
  currentPhase,
  drainingNextTick,
  drainingMicrotask,
}: {
  currentPhase: NodejsEventLoopPhase
  drainingNextTick?: boolean
  drainingMicrotask?: boolean
}) {
  const isBetween = currentPhase === 'between-phases'

  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3">
      <div className="mb-2 text-xs font-medium text-muted-foreground">Event Loop (libuv)</div>
      <div className="space-y-1">
        {PHASES.map((phase, i) => {
          const isActive = phase.id === currentPhase
          return (
            <div key={phase.id}>
              <div
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-all duration-300 ${
                  isActive ? phase.activeColor : `${phase.color} text-muted-foreground/50`
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`size-1.5 rounded-full transition-all duration-300 ${
                      isActive ? 'scale-125 bg-current' : 'bg-muted-foreground/20'
                    }`}
                  />
                  {phase.label}
                </div>
              </div>
              {i < PHASES.length - 1 && (
                <div
                  className={`mx-3 my-0.5 flex items-center gap-1.5 rounded border border-dashed px-2 py-0.5 text-[10px] transition-all duration-300 ${
                    isBetween
                      ? 'border-purple-500/50 bg-purple-500/10 text-purple-600 dark:text-purple-400'
                      : 'border-transparent text-muted-foreground/30'
                  }`}
                >
                  <span className="font-medium">↳</span>
                  <span className={drainingNextTick ? 'font-semibold text-red-500' : ''}>nextTick</span>
                  <span>→</span>
                  <span className={drainingMicrotask ? 'font-semibold text-purple-500' : ''}>microtask</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
