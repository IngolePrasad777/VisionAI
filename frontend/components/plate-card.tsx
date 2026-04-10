'use client'

import { useState } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

interface PlateCardProps {
  imageUrl: string
  plateId: string
  category: string
  isVisible: boolean
}

export function PlateCard({ imageUrl, plateId, category, isVisible }: PlateCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-lg transition-all duration-500",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
      )}
    >
      <div className="absolute right-4 top-4 z-10 rounded-full bg-primary/90 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-sm">
        {category}
      </div>

      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Spinner className="size-8 text-primary" />
          </div>
        )}

        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-muted text-muted-foreground">
            <svg className="size-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm">Failed to load plate</span>
          </div>
        ) : (
          <Image
            src={imageUrl}
            alt={`Ishihara plate ${plateId}`}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false)
              setHasError(true)
            }}
            priority
          />
        )}
      </div>
    </div>
  )
}
