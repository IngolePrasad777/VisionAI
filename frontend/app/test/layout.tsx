import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Vision Test',
  description: 'Take the Ishihara plate test to screen for color vision deficiency. Answer questions about the numbers you see in each plate.',
}

export default function TestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
