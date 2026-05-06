export type SortedNode = {
  member: string
  score: number
  height: number
}

export type Step = {
  description: string
  detail?: string
  hashHighlight?: string
  hashAction?: 'lookup' | 'insert' | 'update' | 'delete'
  skipFocus?: string
  skipLevel?: number
  skipVisited?: string[]
  state?: SortedNode[]
  pending?: { member: string; score: number; height: number }
  removing?: string
  rankCounter?: number
}

export type OpType = 'ZADD' | 'ZSCORE' | 'ZRANK' | 'ZRANGE' | 'ZREM'

export type DisplayNode = {
  kind: 'head' | 'node' | 'pending' | 'nil'
  member: string
  score?: number
  height: number
}
