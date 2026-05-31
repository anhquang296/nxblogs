'use client'

import { ReactNode } from 'react'
import { Tooltip as TooltipRoot, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'

interface TooltipProps {
  content: ReactNode
  children: ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <span className="font-bold underline decoration-dashed decoration-2 underline-offset-4 cursor-help">
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent sideOffset={8} collisionPadding={16} className="max-w-xs text-center">
        {content}
      </TooltipContent>
    </TooltipRoot>
  )
}
