'use client'

import dynamic from 'next/dynamic'

const Search = dynamic(
  () => import('nextra/components').then(mod => ({ default: mod.Search })),
  { ssr: false }
)

export function SearchWrapper({ placeholder }: { placeholder: string }) {
  return <Search placeholder={placeholder} />
}
