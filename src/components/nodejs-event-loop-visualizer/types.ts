import type { QueueItem } from '@/components/browser-event-loop-visualizer/types'

export type NodejsEventLoopPhase =
  | 'idle'
  | 'timers'
  | 'pending'
  | 'idle-prepare'
  | 'poll'
  | 'check'
  | 'close'
  | 'between-phases'

export type NodejsStep = {
  description: string
  highlightLines: number[]
  callStack: QueueItem[]
  nextTickQueue: QueueItem[]
  microtaskQueue: QueueItem[]
  timerQueue: QueueItem[]
  checkQueue: QueueItem[]
  phase: NodejsEventLoopPhase
  consoleOutput: string[]
  libuvOps: QueueItem[]
  drainingNextTick?: boolean
  drainingMicrotask?: boolean
}

export type NodejsScenario = {
  id: string
  title: string
  code: string
  steps: NodejsStep[]
}

export type { QueueItem }
