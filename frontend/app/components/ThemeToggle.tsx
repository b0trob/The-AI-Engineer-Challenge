'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    
    if (newTheme) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="relative w-14 h-8 flex items-center rounded-full border border-border bg-input transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      tabIndex={0}
    >
      {/* Track background highlight for dark mode */}
      <div
        className={`absolute inset-0 rounded-full transition-colors duration-300 pointer-events-none ${
          isDark ? 'bg-primary/20' : 'bg-accent/30'
        }`}
      />
      {/* Handle */}
      <div
        className={`absolute top-1 left-1 h-6 w-6 rounded-full bg-primary border border-border shadow-md flex items-center justify-center transition-transform duration-300 ${
          isDark ? 'translate-x-6' : 'translate-x-0'
        }`}
        style={{ transition: 'transform 0.3s cubic-bezier(.4,2,.6,1)' }}
      >
        {/* Sun and Moon icons cross-fade */}
        <Sun className={`absolute h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-0' : 'opacity-100'} text-primary-foreground`} />
        <Moon className={`absolute h-4 w-4 transition-opacity duration-300 ${isDark ? 'opacity-100' : 'opacity-0'} text-primary-foreground`} />
      </div>
    </button>
  )
} 