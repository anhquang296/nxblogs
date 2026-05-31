import { TooltipProvider } from '@/components/ui/tooltip'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return <TooltipProvider>{children}</TooltipProvider>
}
