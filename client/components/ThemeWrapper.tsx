"use client"

import { useContext } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { cn } from "@/lib/utils"

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("ThemeWrapper must be used within a ThemeProvider")
  }

  const { theme } = context

  return (
    <div className={cn("min-h-screen bg-background text-foreground transition-colors duration-300", theme)}>
      {children}
    </div>
  )
}
