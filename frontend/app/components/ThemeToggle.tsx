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
      className="relative inline-flex h-10 w-20 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800 transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Toggle theme"
    >
      <span className="sr-only">Toggle theme</span>
      
      {/* Toggle track */}
      <div className="relative h-6 w-16 rounded-full bg-white dark:bg-gray-900 shadow-inner transition-colors duration-300">
        {/* Toggle handle */}
        <div
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-blue-500 dark:bg-green-400 shadow-md transition-transform duration-300 ${
            isDark ? 'translate-x-10' : 'translate-x-0'
          }`}
        />
      </div>
      
      {/* Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <Sun className={`h-4 w-4 transition-colors duration-300 ${
          isDark ? 'text-gray-400' : 'text-yellow-500'
        }`} />
        <Moon className={`h-4 w-4 transition-colors duration-300 ${
          isDark ? 'text-green-400' : 'text-gray-400'
        }`} />
      </div>
    </button>
  )
} 