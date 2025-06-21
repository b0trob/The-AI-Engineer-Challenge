'use client'

import React, { useState } from 'react'

export default function DebugPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testApiConnectivity = async () => {
    setIsLoading(true)
    setTestResults([])
    
    try {
      // Test 1: Check environment variables
      addResult('Testing environment variables...')
      const envApiUrl = process.env.NEXT_PUBLIC_API_URL
      addResult(`NEXT_PUBLIC_API_URL: ${envApiUrl || 'NOT SET'}`)
      
      // Test 2: Check current location
      addResult('Checking current location...')
      addResult(`Hostname: ${window.location.hostname}`)
      addResult(`Protocol: ${window.location.protocol}`)
      addResult(`Full URL: ${window.location.href}`)
      
      // Test 3: Test API health endpoint
      addResult('Testing API health endpoint...')
      const apiBaseUrl = envApiUrl || window.location.origin
      const healthUrl = `${apiBaseUrl}/api/health`
      addResult(`Health check URL: ${healthUrl}`)
      
      const healthResponse = await fetch(healthUrl)
      addResult(`Health check status: ${healthResponse.status}`)
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json()
        addResult(`Health check response: ${JSON.stringify(healthData)}`)
      } else {
        addResult(`Health check failed: ${healthResponse.statusText}`)
      }
      
      // Test 4: Test API key endpoint (without valid key)
      addResult('Testing API key endpoint...')
      const testKeyUrl = `${apiBaseUrl}/api/test-key`
      addResult(`Test key URL: ${testKeyUrl}`)
      
      const keyResponse = await fetch(testKeyUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: 'test-invalid-key' })
      })
      
      addResult(`Test key status: ${keyResponse.status}`)
      
      if (keyResponse.ok) {
        const keyData = await keyResponse.json()
        addResult(`Test key response: ${JSON.stringify(keyData)}`)
      } else {
        const errorText = await keyResponse.text()
        addResult(`Test key failed: ${errorText}`)
      }
      
    } catch (error: any) {
      addResult(`Error during testing: ${error.message}`)
      console.error('Debug test error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Debug Page</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Configuration</h2>
          <div className="space-y-2">
            <p><strong>Environment:</strong> {typeof window !== 'undefined' && window.location.hostname !== 'localhost' ? 'Production' : 'Development'}</p>
            <p><strong>NEXT_PUBLIC_API_URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}</p>
            <p><strong>Current Origin:</strong> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <button
            onClick={testApiConnectivity}
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test API Connectivity'}
          </button>
        </div>
        
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Test Results</h2>
            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">{result}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 