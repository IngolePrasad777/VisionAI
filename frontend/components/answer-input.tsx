'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface AnswerInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const AnswerInput = forwardRef<HTMLInputElement, AnswerInputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <div className="relative">
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className={cn(
              "w-full rounded-2xl border-2 bg-background px-6 py-4 text-center text-2xl font-semibold tracking-widest text-foreground shadow-sm transition-all duration-200",
              "placeholder:text-muted-foreground/50 placeholder:font-normal placeholder:tracking-normal placeholder:text-lg",
              "focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error ? "border-destructive focus:border-destructive focus:ring-destructive/20" : "border-border hover:border-primary/50",
              className
            )}
            {...props}
          />
          <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
            <kbd className="hidden rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground sm:inline-flex">
              Enter ↵
            </kbd>
          </div>
        </div>
        {error && (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        )}
      </div>
    )
  }
)

AnswerInput.displayName = 'AnswerInput'
