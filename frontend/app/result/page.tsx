'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RefreshCw, Home, Share2, Download, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ResultCard } from '@/components/result-card'
import { LoadingOverlay } from '@/components/loading-overlay'
import type { PredictionResult } from '@/services/api'

export default function ResultPage() {
  const router = useRouter()
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [testTime, setTestTime] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Get result from sessionStorage
    const storedResult = sessionStorage.getItem('visioncheck_result')
    const storedTime = sessionStorage.getItem('visioncheck_time')

    if (storedResult) {
      setResult(JSON.parse(storedResult))
      setTestTime(storedTime || '')
      setIsLoading(false)
      // Trigger animation after a short delay
      setTimeout(() => setIsVisible(true), 100)
    } else {
      // No result found, redirect to test
      router.push('/test')
    }
  }, [router])

  const handleRetakeTest = () => {
    sessionStorage.removeItem('visioncheck_result')
    sessionStorage.removeItem('visioncheck_time')
    router.push('/test')
  }

  if (isLoading || !result) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingOverlay isVisible={true} message="Loading Results..." />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className={`mb-8 text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
              <Clock className="size-4 text-primary" />
              Test completed in {testTime}
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your Results
            </h1>
            <p className="mt-2 text-muted-foreground">
              Based on your responses to 10 Ishihara plates
            </p>
          </div>

          {/* Result Card */}
          <div className="mb-8">
            <ResultCard
              prediction={result.prediction}
              confidence={result.confidence}
              explanation={result.explanation}
              isVisible={isVisible}
            />
          </div>

          {/* Disclaimer */}
          <div className={`mb-8 rounded-2xl border border-border bg-card p-5 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <h3 className="mb-2 font-semibold text-foreground">Important Notice</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              This screening tool provides a preliminary assessment only. Results should not be 
              considered a medical diagnosis. For an accurate evaluation, please consult a 
              qualified ophthalmologist or optometrist who can perform comprehensive color 
              vision testing using standardized equipment.
            </p>
          </div>

          {/* Actions */}
          <div className={`flex flex-col gap-4 sm:flex-row sm:justify-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button
              onClick={handleRetakeTest}
              variant="default"
              size="lg"
              className="gap-2 rounded-full px-8"
            >
              <RefreshCw className="size-4" />
              Retake Test
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                size="lg"
                className="w-full gap-2 rounded-full px-8 sm:w-auto"
              >
                <Home className="size-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {/* Share Options */}
          <div className={`mt-8 flex items-center justify-center gap-4 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Share2 className="size-4" />
              Share Results
            </Button>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <Download className="size-4" />
              Download PDF
            </Button>
          </div>

          {/* Additional Info */}
          <div className={`mt-12 grid gap-4 sm:grid-cols-3 transition-all duration-700 delay-900 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            <InfoCard
              title="What is CVD?"
              description="Color Vision Deficiency affects how you perceive certain colors, most commonly red and green."
            />
            <InfoCard
              title="Who is affected?"
              description="Approximately 8% of men and 0.5% of women have some form of color vision deficiency."
            />
            <InfoCard
              title="Next Steps"
              description="Share these results with your eye care professional during your next visit."
            />
          </div>
        </div>
      </main>
    </div>
  )
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h4 className="mb-2 font-semibold text-foreground">{title}</h4>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  )
}
