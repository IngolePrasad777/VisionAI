'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { ProgressBar } from '@/components/progress-bar'
import { Timer } from '@/components/timer'
import { PlateCard } from '@/components/plate-card'
import { AnswerInput } from '@/components/answer-input'
import { LoadingOverlay } from '@/components/loading-overlay'
import { ErrorMessage } from '@/components/error-message'
import { useTimer } from '@/hooks/use-timer'
import { getTestPlates, submitAnswers, type Plate, type Answer } from '@/services/api'

export default function TestPage() {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  
  // State
  const [plates, setPlates] = useState<Plate[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Timer hook
  const { formattedTime, start: startTimer } = useTimer(0, false)

  // Fetch plates on mount
  useEffect(() => {
    const fetchPlates = async () => {
      try {
        setIsLoading(true)
        const data = await getTestPlates()
        setPlates(data)
        startTimer()
      } catch (err) {
        console.error('Failed to fetch plates:', err)
        setError('Failed to load test. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlates()
  }, [startTimer])

  // Focus input when plate changes
  useEffect(() => {
    if (!isLoading && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [currentIndex, isLoading])

  // Handle answer submission
  const handleSubmitAnswer = useCallback(async () => {
    if (!currentAnswer.trim() || isTransitioning) return

    const newAnswer: Answer = {
      plate_id: plates[currentIndex].plate_id,
      user_answer: currentAnswer.trim(),
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)

    // Check if this is the last question
    if (currentIndex === plates.length - 1) {
      // Submit all answers
      try {
        setIsSubmitting(true)
        const result = await submitAnswers(updatedAnswers)

        // Store result in sessionStorage for the result page
        sessionStorage.setItem('visioncheck_result', JSON.stringify(result))
        sessionStorage.setItem('visioncheck_time', formattedTime)
        
        router.push('/result')
      } catch (err) {
        console.error('Failed to submit answers:', err)
        setIsSubmitting(false)
        setError('Failed to submit answers. Please try again.')
      }
    } else {
      // Move to next question with animation
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1)
        setCurrentAnswer('')
        setIsTransitioning(false)
      }, 300)
    }
  }, [currentAnswer, currentIndex, plates, answers, router, formattedTime, isTransitioning])

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentAnswer.trim()) {
      handleSubmitAnswer()
    }
  }

  // Handle previous question
  const handlePrevious = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1)
        setCurrentAnswer(answers[currentIndex - 1]?.user_answer || '')
        setAnswers(prev => prev.slice(0, -1))
        setIsTransitioning(false)
      }, 300)
    }
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <LoadingOverlay isVisible={true} message="Loading Test..." />
      </div>
    )
  }

  // Error state
  if (error && plates.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 pt-16">
          <ErrorMessage
            message={error}
            onRetry={() => window.location.reload()}
          />
        </main>
      </div>
    )
  }

  const currentPlate = plates[currentIndex]
  const isLastQuestion = currentIndex === plates.length - 1

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <LoadingOverlay isVisible={isSubmitting} message="Analyzing Results..." />
      
      <main className="px-4 pt-24 pb-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Top Bar */}
          <div className="mb-8 flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <Home className="size-4" />
                <span className="hidden sm:inline">Exit Test</span>
              </Button>
            </Link>
            <Timer time={formattedTime} />
          </div>

          {/* Progress */}
          <ProgressBar 
            current={currentIndex + 1} 
            total={plates.length} 
            className="mb-8"
          />

          {/* Plate Card */}
          <div className="mb-8">
            <PlateCard
              imageUrl={currentPlate.image_url}
              plateId={currentPlate.plate_id}
              category={currentPlate.category}
              isVisible={!isTransitioning}
            />
          </div>

          {/* Question */}
          <div className="mb-6 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              What number do you see?
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter the number displayed in the plate above. If you {"can't"} see any number, type 0.
            </p>
          </div>

          {/* Answer Input */}
          <div className="mb-8">
            <AnswerInput
              ref={inputRef}
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your answer"
              disabled={isSubmitting || isTransitioning}
            />
          </div>

          {/* Error Message */}
          {error && plates.length > 0 && (
            <ErrorMessage
              message={error}
              onRetry={() => setError(null)}
              className="mb-6"
            />
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || isSubmitting || isTransitioning}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>

            <div className="text-sm font-medium text-muted-foreground">
              Question {currentIndex + 1} of {plates.length}
            </div>

            <Button
              onClick={handleSubmitAnswer}
              disabled={!currentAnswer.trim() || isSubmitting || isTransitioning}
              className="gap-2"
            >
              <span className="hidden sm:inline">
                {isLastQuestion ? 'Submit' : 'Next'}
              </span>
              <span className="sm:hidden">
                {isLastQuestion ? 'Submit' : 'Next'}
              </span>
              <ArrowRight className="size-4" />
            </Button>
          </div>

          {/* Keyboard Hint */}
          <div className="mt-8 text-center">
            <p className="text-xs text-muted-foreground">
              Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to submit your answer
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
