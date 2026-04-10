'use client'

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Progress
        </span>
        <span className="text-sm font-semibold text-foreground">
          {current} / {total}
        </span>
      </div>
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-0 h-full w-20 animate-pulse rounded-full bg-white/20 blur-sm"
          style={{ 
            left: `${Math.max(0, percentage - 10)}%`,
            opacity: percentage > 0 ? 1 : 0
          }}
        />
      </div>
    </div>
  )
}
