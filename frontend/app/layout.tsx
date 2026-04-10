import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ["latin"],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'VisionCheck AI - Color Vision Screening',
    template: '%s | VisionCheck AI',
  },
  description: 'AI-powered color vision deficiency screening using Ishihara plates. Detect Protanopia, Deuteranopia, and Tritanopia with clinical-grade accuracy.',
  keywords: ['color blindness test', 'Ishihara test', 'color vision deficiency', 'CVD screening', 'eye test'],
  authors: [{ name: 'VisionCheck AI' }],
  creator: 'VisionCheck AI',
  openGraph: {
    title: 'VisionCheck AI - Color Vision Screening',
    description: 'AI-powered color vision deficiency screening using Ishihara plates.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VisionCheck AI - Color Vision Screening',
    description: 'AI-powered color vision deficiency screening using Ishihara plates.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f8f7fc' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1625' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
