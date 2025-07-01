'use client'

import React, { useState, useEffect } from 'react'

const models = [
  { value: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', description: 'Fastest and most affordable model, great for simple tasks and quick chats.' },
  { value: 'gpt-4', name: 'GPT-4', description: 'Powerful and capable model, ideal for complex reasoning and multi-step tasks.' },
  { value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'A solid balance of speed, performance, and cost-effectiveness.' }
];

const predefinedPrompts = [
  { name: 'Default', prompt: 'You are a helpful AI assistant.' },
  { name: 'Sarcastic Bot', prompt: 'You are a sarcastic bot. You provide witty, eye-rolling responses to every user request, but still begrudgingly provide the correct answer.' },
  { name: 'ELI5 Explainer', prompt: 'You are an expert explainer who can break down complex topics into simple, easy-to-understand concepts, as if you were explaining it to a 5-year-old.' }
];

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [developerMessage, setDeveloperMessage] = useState(predefinedPrompts[0].prompt)
  const [model, setModel] = useState(models[0].value)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [isApiKeyValid, setIsApiKeyValid] = useState(false)
  const [isLoadingValidation, setIsLoadingValidation] = useState(false)

  useEffect(() => {
    const storedApiKey = sessionStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      validateApiKey(storedApiKey);
    }
  }, []);

  const validateApiKey = async (key: string) => {
    const keyRegex = /^sk-proj-[A-Za-z0-9\-_]{156}$/;
    if (!keyRegex.test(key)) {
      setApiKeyError("Invalid API Key format. Please check your key.");
      setIsApiKeyValid(false);
      return;
    }
    setApiKeyError(null);
    setIsLoadingValidation(true);
    try {
      const response = await fetch('/api/test-key', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: key }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.valid) {
        throw new Error(data.message);
      }
      setIsApiKeyValid(true);
    } catch (error: any) {
      setApiKeyError(error.message || 'Failed to validate API key');
      setIsApiKeyValid(false);
    } finally {
      setIsLoadingValidation(false);
    }
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newApiKey = e.target.value;
    setApiKey(newApiKey);
    if (newApiKey) {
      sessionStorage.setItem('openai_api_key', newApiKey);
      validateApiKey(newApiKey);
    } else {
      sessionStorage.removeItem('openai_api_key');
      setApiKeyError(null);
      setIsApiKeyValid(false);
    }
  };

  const handleModelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModel(e.target.value);
  };

  const handlePredefinedPromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrompt = predefinedPrompts.find(p => p.name === e.target.value)?.prompt;
    if (selectedPrompt) {
      setDeveloperMessage(selectedPrompt);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-12 p-6 rounded-lg bg-background border border-border shadow animate-in">
      <h1 className="text-2xl font-bold mb-4 text-foreground">Settings</h1>
      <div className="space-y-6">
        <div className="flex flex-col">
          <label htmlFor="apiKey" className="text-sm font-medium text-foreground mb-1">OpenAI API Key</label>
          <input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={handleApiKeyChange}
            className={`p-2 bg-input border ${apiKeyError ? 'border-destructive' : 'border-border'} rounded-md text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring`}
            placeholder="sk-proj-..."
          />
          {apiKeyError && <p className="text-destructive text-xs mt-1">{apiKeyError}</p>}
        </div>
        {isLoadingValidation && <p className="text-muted-foreground text-sm">Validating key...</p>}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            AI Personality
          </label>
          <select
            onChange={handlePredefinedPromptChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground text-sm sm:text-base"
          >
            {predefinedPrompts.map(p => <option key={p.name}>{p.name}</option>)}
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Developer Message (System Prompt)
          </label>
          <textarea
            value={developerMessage}
            onChange={(e) => setDeveloperMessage(e.target.value)}
            placeholder="System prompt for the AI"
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground text-sm sm:text-base"
          />
          <p className="text-xs text-muted-foreground mt-1">
            This message sets the context and personality for the AI. It acts as a guiding instruction for every response.
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Model
          </label>
          <select
            value={model}
            onChange={handleModelChange}
            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground text-sm sm:text-base"
          >
            {models.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
          <p className="text-xs text-muted-foreground mt-1">
            {models.find(m => m.value === model)?.description}
          </p>
        </div>
      </div>
    </div>
  )
} 