'use client'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimerProps {
  time: string
  className?: string
}

export function Timer({ time, className }: TimerProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm",
        className
      )}
    >
      <Clock className="size-4 text-primary" />
      <span className="tabular-nums tracking-wider">{time}</span>
    </div>
  )
}
