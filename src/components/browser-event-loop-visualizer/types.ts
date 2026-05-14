export type EventLoopPhase =
  | 'idle'
  | 'macrotask'
  | 'microtask'
  | 'raf'
  | 'render'
  | 'idle-callback'

export type QueueItem = {
  id: string
  label: string
  color?: string
}

export type Step = {
  description: string
  highlightLines: number[]
  callStack: QueueItem[]
  taskQueue: QueueItem[]
  microtaskQueue: QueueItem[]
  rafQueue: QueueItem[]
  phase: EventLoopPhase
  consoleOutput: string[]
  webAPIs: QueueItem[]
}

export type Scenario = {
  id: string
  title: string
  code: string
  steps: Step[]
}
