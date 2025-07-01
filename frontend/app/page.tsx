'use client'

import React, { useEffect } from 'react'
import AppShell from './components/AppShell'
import { useAppStore } from './store/useAppStore'
import { STORAGE_KEYS } from './constants'

export default function Home() {
  const { setApiKey, setDeveloperMessage, setModel } = useAppStore()

  // Load stored settings on mount
  useEffect(() => {
    const storedApiKey = sessionStorage.getItem(STORAGE_KEYS.API_KEY)
    const storedDeveloperMessage = sessionStorage.getItem(STORAGE_KEYS.DEVELOPER_MESSAGE)
    const storedModel = sessionStorage.getItem(STORAGE_KEYS.MODEL)

    if (storedApiKey) {
      setApiKey(storedApiKey)
    }
    if (storedDeveloperMessage) {
      setDeveloperMessage(storedDeveloperMessage)
    }
    if (storedModel) {
      setModel(storedModel)
    }
  }, [setApiKey, setDeveloperMessage, setModel])

  return <AppShell aria-label="Simple OpenAI Chat Application" />
} 