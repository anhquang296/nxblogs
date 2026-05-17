import type { PhaseId } from './types'

export const STEP_DELAY_MS = 2500

export const PHASE_COLORS: Record<PhaseId, string> = {
  macrotask: '#3b82f6',
  microtask: '#a855f7',
  raf: '#22c55e',
  render: '#f43f5e',
  idle: '#6b7280',
}

export const PHASE_ARCS: {
  id: PhaseId
  dashArray: string
  dashOffset: string
  label: string
  sublabel: string
  labelX: number
  labelY: number
  sublabelX: number
  sublabelY: number
  textAnchor: 'inherit' | 'start' | 'middle' | 'end'
}[] = [
  { id: 'macrotask', dashArray: '248 757', dashOffset: '251', label: 'Macrotask', sublabel: 'setTimeout / click / fetch', labelX: 470, labelY: 90, sublabelX: 470, sublabelY: 110, textAnchor: 'middle' },
  { id: 'microtask', dashArray: '198 807', dashOffset: '1005', label: 'Microtasks', sublabel: 'Promise / queueMicrotask', labelX: 450, labelY: 350, sublabelX: 420, sublabelY: 370, textAnchor: 'start' },
  { id: 'raf', dashArray: '148 857', dashOffset: '804', label: 'rAF', sublabel: 'requestAnimationFrame', labelX: 200, labelY: 470, sublabelX: 200, sublabelY: 490, textAnchor: 'middle' },
  { id: 'render', dashArray: '218 787', dashOffset: '653', label: 'Render', sublabel: 'Style → Layout → Paint', labelX: 10, labelY: 310, sublabelX: 40, sublabelY: 330, textAnchor: 'end' },
  { id: 'idle', dashArray: '178 827', dashOffset: '432', label: 'Idle', sublabel: 'requestIdleCallback', labelX: 100, labelY: 30, sublabelX: 100, sublabelY: 50, textAnchor: 'middle' },
]

export const QUEUE_COLORS: Record<string, string> = {
  task: 'border-blue-800 text-blue-300',
  microtask: 'border-purple-800 text-purple-300',
  raf: 'border-emerald-800 text-emerald-300',
}

export const QUEUE_DOT_COLORS: Record<string, string> = {
  task: '#3b82f6',
  microtask: '#a855f7',
  raf: '#22c55e',
}
