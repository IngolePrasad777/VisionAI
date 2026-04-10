'use client'

import Link from 'next/link'
import { Eye, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useDarkMode } from '@/hooks/use-dark-mode'
import { cn } from '@/lib/utils'

export function Header() {
  const { isDark, toggle, mounted } = useDarkMode()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-80">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary">
            <Eye className="size-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            VisionCheck AI
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggle}
            className={cn(
              "relative rounded-full",
              !mounted && "opacity-0"
            )}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            <Sun className={cn(
              "size-5 rotate-0 scale-100 transition-all duration-300",
              isDark && "-rotate-90 scale-0"
            )} />
            <Moon className={cn(
              "absolute size-5 rotate-90 scale-0 transition-all duration-300",
              isDark && "rotate-0 scale-100"
            )} />
          </Button>
        </nav>
      </div>
    </header>
  )
}
