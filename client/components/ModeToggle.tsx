"use client"

import { useContext } from "react"
import { Moon, Sun } from "lucide-react"
import { ThemeContext } from "@/context/ThemeContext"
import { Button } from "@/components/ui/Button"

export function ModeToggle() {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error("ModeToggle must be used within a ThemeProvider")
  }

  const { theme, toggleTheme } = context

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
