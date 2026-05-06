import { cn } from '@/lib/utils'
import { MAX_LEVEL } from './constants'
import type { DisplayNode, SortedNode, Step } from './types'
import { formatScore } from './utils'

export function SkipListPanel({ nodes, step }: { nodes: SortedNode[]; step: Step | null }) {
  const focus = step?.skipFocus
  const visited = new Set(step?.skipVisited ?? [])
  const removing = step?.removing
  const pending = step?.pending
  const activeLevel = step?.skipLevel

  const allNodes: DisplayNode[] = [
    { kind: 'head', member: 'HEAD', height: MAX_LEVEL },
    ...nodes.map((n) => ({
      kind: 'node' as const,
      member: n.member,
      score: n.score,
      height: n.height,
    })),
    ...(pending
      ? [
          {
            kind: 'pending' as const,
            member: pending.member,
            score: pending.score,
            height: pending.height,
          },
        ]
      : []),
    { kind: 'nil', member: 'NIL', height: MAX_LEVEL },
  ]

  const levels = Array.from({ length: MAX_LEVEL }, (_, i) => MAX_LEVEL - i)

  function gapHasArrow(gapIdx: number, level: number): boolean {
    let before = false
    let after = false
    for (let j = 0; j <= gapIdx; j++) if (allNodes[j].height >= level) before = true
    for (let j = gapIdx + 1; j < allNodes.length; j++) if (allNodes[j].height >= level) after = true
    return before && after
  }

  function gapIsActiveArrow(gapIdx: number, level: number): boolean {
    if (!focus || activeLevel !== level) return false
    const focusIdx = allNodes.findIndex((n) => n.member === focus)
    if (focusIdx < 0) return false
    if (allNodes[focusIdx].height < level) return false
    let nextIdx = -1
    for (let j = focusIdx + 1; j < allNodes.length; j++) {
      if (allNodes[j].height >= level) {
        nextIdx = j
        break
      }
    }
    if (nextIdx < 0) return false
    return gapIdx >= focusIdx && gapIdx < nextIdx
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium">Skip List</span>
        {step?.rankCounter !== undefined && (
          <span className="rounded-full bg-blue-500/10 px-2 py-0.5 font-mono text-xs text-blue-700 dark:text-blue-300">
            rank counter: {step.rankCounter}
          </span>
        )}
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="flex min-w-fit items-stretch">
          <div className="mr-1 flex flex-col justify-start pt-1">
            {levels.map((level) => (
              <div
                key={level}
                className="flex h-8 w-6 items-center justify-end pr-1 font-mono text-[10px] text-muted-foreground"
              >
                L{level}
              </div>
            ))}
            <div className="h-6" />
            <div className="h-4" />
          </div>

          {allNodes.map((node, i) => (
            <div key={`${node.kind}-${node.member}-${i}`} className="flex">
              <NodeBlock
                node={node}
                levels={levels}
                isFocused={focus === node.member}
                activeLevel={activeLevel}
                isVisited={visited.has(node.member)}
                isRemoving={removing === node.member}
              />
              {i < allNodes.length - 1 && (
                <ArrowGap
                  levels={levels}
                  hasArrow={(level) => gapHasArrow(i, level)}
                  isActive={(level) => gapIsActiveArrow(i, level)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function NodeBlock({
  node,
  levels,
  isFocused,
  activeLevel,
  isVisited,
  isRemoving,
}: {
  node: DisplayNode
  levels: number[]
  isFocused: boolean
  activeLevel?: number
  isVisited: boolean
  isRemoving: boolean
}) {
  const isHead = node.kind === 'head'
  const isNil = node.kind === 'nil'
  const isPending = node.kind === 'pending'
  const isSentinel = isHead || isNil

  return (
    <div
      className={cn(
        'flex w-20 flex-col overflow-hidden rounded-md border-2 transition-all duration-300',
        isPending
          ? 'border-dashed border-amber-500 bg-amber-500/10'
          : isRemoving
            ? 'border-red-500 bg-red-500/10 opacity-60'
            : isFocused
              ? 'border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/30'
              : isVisited && !isSentinel
                ? 'border-blue-400/50 bg-blue-500/5'
                : isSentinel
                  ? 'border-dashed border-border bg-muted/40'
                  : 'border-border bg-card'
      )}
    >
      <div className="flex flex-col pt-1">
        {levels.map((level) => {
          const hasLevel = node.height >= level
          const isActive = isFocused && activeLevel === level
          return (
            <div
              key={level}
              className={cn('flex h-8 items-center justify-center transition-colors', isActive && 'bg-blue-500/20')}
            >
              {hasLevel ? (
                <span
                  className={cn(
                    'inline-block h-2.5 w-2.5 rounded-full transition',
                    isActive
                      ? 'bg-blue-600 ring-2 ring-blue-500/40'
                      : isPending
                        ? 'bg-amber-600'
                        : isRemoving
                          ? 'bg-red-500'
                          : isSentinel
                            ? 'bg-muted-foreground'
                            : 'bg-foreground'
                  )}
                />
              ) : null}
            </div>
          )
        })}
      </div>
      <div
        className={cn(
          'border-t px-2 pt-1 pb-0.5 text-center font-mono text-xs',
          isPending ? 'border-amber-500/50 text-amber-700 dark:text-amber-300' : 'border-border',
          isRemoving && 'line-through',
          isSentinel && 'text-muted-foreground'
        )}
      >
        {isPending ? `+${node.member}` : node.member}
      </div>
      <div className="px-1 pb-1 text-center font-mono text-[10px] tabular-nums text-muted-foreground">
        {!isSentinel && node.score !== undefined ? formatScore(node.score) : ' '}
      </div>
    </div>
  )
}

function ArrowGap({
  levels,
  hasArrow,
  isActive,
}: {
  levels: number[]
  hasArrow: (level: number) => boolean
  isActive: (level: number) => boolean
}) {
  return (
    <div className="flex w-6 flex-col pt-1">
      {levels.map((level) => {
        const has = hasArrow(level)
        const active = has && isActive(level)
        return (
          <div key={level} className="relative flex h-8 items-center justify-center">
            {has && (
              <>
                <div className={cn('h-0.5 w-full transition-colors', active ? 'bg-blue-500' : 'bg-foreground/25')} />
                <span
                  className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 text-[10px] leading-none transition-colors',
                    active ? 'text-blue-500' : 'text-foreground/40'
                  )}
                >
                  ▶
                </span>
              </>
            )}
          </div>
        )
      })}
      <div className="h-6" />
      <div className="h-4" />
    </div>
  )
}
