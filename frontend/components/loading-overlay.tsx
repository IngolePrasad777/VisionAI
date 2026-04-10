'use client'

import { Eye } from 'lucide-react'
import { Spinner } from '@/components/ui/spinner'
import { cn } from '@/lib/utils'

interface LoadingOverlayProps {
  isVisible: boolean
  message?: string
}

export function LoadingOverlay({ isVisible, message = 'Processing...' }: LoadingOverlayProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div
        className={cn(
          "flex flex-col items-center gap-6 rounded-3xl border border-border bg-card p-8 shadow-2xl transition-all duration-300",
          isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        )}
      >
        <div className="relative">
          <div className="flex size-20 items-center justify-center rounded-2xl bg-primary">
            <Eye className="size-10 text-primary-foreground" />
          </div>
          <div className="absolute -bottom-1 -right-1 rounded-full bg-card p-1.5">
            <Spinner className="size-6 text-primary" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">{message}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Analyzing your responses...
          </p>
        </div>
      </div>
    </div>
  )
}
