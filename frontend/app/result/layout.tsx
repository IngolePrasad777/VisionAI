import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Test Results',
  description: 'View your color vision screening results with AI-powered analysis and personalized recommendations.',
}

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
