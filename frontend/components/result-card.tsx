'use client'

import { cn } from '@/lib/utils'
import { CheckCircle, AlertTriangle, Info, Eye } from 'lucide-react'

interface ResultCardProps {
  prediction: 'Normal' | 'Protanopia' | 'Deuteranopia' | 'RG_Deficient'
  confidence: number
  explanation: string
  isVisible: boolean
}

const resultConfig = {
  Normal: {
    icon: CheckCircle,
    color: 'bg-success text-success-foreground',
    badgeColor: 'bg-success/10 text-success border-success/30',
    gradientFrom: 'from-success/20',
    gradientTo: 'to-success/5',
    description: 'Your color vision appears to be normal.',
  },
  Protanopia: {
    icon: Eye,
    color: 'bg-destructive text-destructive-foreground',
    badgeColor: 'bg-destructive/10 text-destructive border-destructive/30',
    gradientFrom: 'from-destructive/20',
    gradientTo: 'to-destructive/5',
    description: 'Reduced sensitivity to red light wavelengths.',
  },
  Deuteranopia: {
    icon: Eye,
    color: 'bg-warning text-warning-foreground',
    badgeColor: 'bg-warning/10 text-warning border-warning/30',
    gradientFrom: 'from-warning/20',
    gradientTo: 'to-warning/5',
    description: 'Reduced sensitivity to green light wavelengths.',
  },
  RG_Deficient: {
    icon: AlertTriangle,
    color: 'bg-primary text-primary-foreground',
    badgeColor: 'bg-primary/10 text-primary border-primary/30',
    gradientFrom: 'from-primary/20',
    gradientTo: 'to-primary/5',
    description: 'Combined red-green color vision deficiency.',
  },
}

export function ResultCard({ prediction, confidence, explanation, isVisible }: ResultCardProps) {
  const config = resultConfig[prediction]
  const Icon = config.icon
  const confidencePercent = Math.round(confidence * 100)

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"
      )}
    >
      {/* Gradient Background */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-br opacity-50",
        config.gradientFrom,
        config.gradientTo
      )} />

      <div className="relative p-6 sm:p-8">
        {/* Header */}
        <div className="mb-6 flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
          <div className={cn("flex size-16 items-center justify-center rounded-2xl", config.color)}>
            <Icon className="size-8" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {prediction === 'RG_Deficient' ? 'Red-Green Deficient' : prediction}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {config.description}
            </p>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="mb-6 rounded-2xl bg-muted/50 p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Confidence Score
            </span>
            <span className={cn(
              "inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold",
              config.badgeColor
            )}>
              {confidencePercent}%
            </span>
          </div>
          <div className="relative h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                prediction === 'Normal' ? 'bg-success' : 
                prediction === 'Deuteranopia' ? 'bg-warning' : 
                prediction === 'Protanopia' ? 'bg-destructive' : 'bg-primary'
              )}
              style={{ 
                width: isVisible ? `${confidencePercent}%` : '0%',
                transitionDelay: '300ms'
              }}
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="rounded-2xl border border-border bg-background/50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <Info className="size-5 text-primary" />
            <h3 className="font-semibold text-foreground">Analysis Details</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {explanation}
          </p>
        </div>
      </div>
    </div>
  )
}
