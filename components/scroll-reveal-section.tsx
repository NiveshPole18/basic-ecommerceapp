"use client"

import type { ReactNode } from "react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { cn } from "@/lib/utils"

interface ScrollRevealSectionProps {
  children: ReactNode
  animation?: "fade-in" | "slide-in-left" | "slide-in-right" | "slide-in-up" | "scale-in" | "bounce-in"
  delay?: number
  className?: string
}

export function ScrollRevealSection({
  children,
  animation = "fade-in",
  delay = 0,
  className,
}: ScrollRevealSectionProps) {
  const { ref, isVisible } = useScrollAnimation()

  return (
    <div
      ref={ref}
      className={cn("transition-all duration-700", isVisible ? `animate-${animation}` : "opacity-0", className)}
      style={{
        animationDelay: isVisible ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  )
}
