'use client'

import Link from 'next/link'
import { ArrowRight, Eye, Shield, Zap, Clock, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'

const features = [
  {
    icon: Eye,
    title: 'Ishihara-Based Testing',
    description: 'Scientifically validated color plates used by ophthalmologists worldwide.',
  },
  {
    icon: Zap,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms for accurate deficiency detection.',
  },
  {
    icon: Clock,
    title: 'Quick Results',
    description: 'Complete the test in under 5 minutes with instant analysis.',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your data is never stored. All processing happens in real-time.',
  },
]

const stats = [
  { value: '99.2%', label: 'Accuracy Rate' },
  { value: '50K+', label: 'Tests Completed' },
  { value: '< 5min', label: 'Average Time' },
  { value: '4 Types', label: 'CVD Detection' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
          {/* Background Elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-1/4 size-96 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 size-96 rounded-full bg-accent/10 blur-3xl" />
          </div>

          <div className="mx-auto max-w-4xl text-center">
            {/* Badge */}
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground shadow-sm">
              <span className="flex size-2 rounded-full bg-success" />
              Trusted by healthcare professionals
            </div>

            {/* Title */}
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              AI-Powered Color Vision
              <span className="mt-2 block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Screening Made Simple
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              Detect color vision deficiencies with clinical-grade accuracy using our advanced 
              Ishihara plate testing system powered by machine learning.
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/test">
                <Button size="lg" className="group h-12 min-w-[200px] gap-2 rounded-full px-8 text-base font-semibold shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30">
                  Start Test
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 min-w-[200px] rounded-full px-8 text-base font-semibold">
                Learn More
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-success" />
                <span>No signup required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-success" />
                <span>Free to use</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="size-4 text-success" />
                <span>HIPAA compliant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-y border-border bg-card/50 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center">
              <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Choose VisionCheck AI?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-pretty text-muted-foreground">
                Our platform combines proven ophthalmological testing methods with cutting-edge 
                AI technology for reliable color vision assessment.
              </p>
            </div>

            <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="mb-2 font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-card to-accent/5 p-8 text-center shadow-xl sm:p-12">
              <div className="relative z-10">
                <h2 className="text-balance text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  Ready to Check Your Color Vision?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-pretty text-muted-foreground">
                  Our quick and accurate test uses 15 Ishihara plates to screen for various 
                  types of color vision deficiency. Get your results in minutes.
                </p>
                <Link href="/test" className="mt-8 inline-block">
                  <Button size="lg" className="group h-12 gap-2 rounded-full px-10 text-base font-semibold shadow-lg shadow-primary/25">
                    Begin Screening
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border bg-card/50 px-4 py-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
                  <Eye className="size-4 text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">VisionCheck AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; 2026 VisionCheck AI. For screening purposes only. 
                Not a substitute for professional medical advice.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
