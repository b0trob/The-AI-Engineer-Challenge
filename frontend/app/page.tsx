'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Settings, Trash2 } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Get API base URL from environment or use relative path for local development
const getApiBaseUrl = () => {
  // Check if we're in production (not localhost)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Use environment variable if available
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envApiUrl) {
      console.log('Using environment API URL:', envApiUrl);
      return envApiUrl;
    }
    
    // If no environment variable, try to construct from current domain
    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;
    
    // For Vercel deployments, try different patterns
    if (currentHost.includes('vercel.app')) {
      // Try to construct API URL from frontend URL
      // If your frontend is at: https://my-frontend.vercel.app
      // And your API is at: https://my-api.vercel.app
      // You can set NEXT_PUBLIC_API_URL=https://my-api.vercel.app
      
      // For now, let's try the same domain but different path
      const apiUrl = `${currentProtocol}//${currentHost}`;
      console.log('Constructed API URL:', apiUrl);
      console.log('⚠️  If this doesn\'t work, please set NEXT_PUBLIC_API_URL environment variable');
      return apiUrl;
    }
    
    // Fallback to same domain but different path
    const fallbackUrl = `${currentProtocol}//${currentHost}`;
    console.log('Using fallback API URL:', fallbackUrl);
    return fallbackUrl;
  }
  
  // In development, use relative path (will work with local FastAPI server)
  console.log('Development mode - using relative API paths');
  return '';
}

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

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [apiKey, setApiKey] = useState<string>('')
  const [developerMessage, setDeveloperMessage] = useState(predefinedPrompts[0].prompt)
  const [model, setModel] = useState(models[0].value)
  const [showSettings, setShowSettings] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)

  const [isApiKeyValid, setIsApiKeyValid] = useState<boolean>(false)
  const [apiKeyError, setApiKeyError] = useState<string | null>(null)
  const [isLoadingValidation, setIsLoadingValidation] = useState<boolean>(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      const apiBaseUrl = getApiBaseUrl();
      const fullUrl = `${apiBaseUrl}/api/test-key`;
      console.log('Attempting to validate API key at:', fullUrl);
      
      const response = await fetch(fullUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: key }),
      });

      console.log('API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API validation response:', data);
      
      if (!data.valid) {
        throw new Error(data.message);
      }

      setIsApiKeyValid(true);
    } catch (error: any) {
      console.error('API key validation error:', error);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Function to clear conversation and start a new session
  const clearConversation = () => {
    setMessages([])
    setSessionId(null)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isApiKeyValid) return;

    const newMessage: Message = { role: 'user', content: inputMessage, timestamp: new Date() };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await fetch(`${apiBaseUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          user_message: newMessage.content,
          developer_message: developerMessage,
          api_key: apiKey,
          session_id: sessionId,
          model: model
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantMessage += chunk;
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = assistantMessage;
          } else {
            newMessages.push({ role: 'assistant', content: assistantMessage, timestamp: new Date() });
          }
          return newMessages;
        });
      }

      // Get session ID from response headers
      const newSessionId = response.headers.get('X-Session-ID');
      if (newSessionId && newSessionId !== sessionId) {
        setSessionId(newSessionId);
      }

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.', timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 animate-in">
      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-8 animate-in">
          <div className="text-center sm:text-left">
            <p className="text-sm sm:text-base text-foreground">
            Start a conversation with AI - ask questions, get help, or just chat
            </p>
          </div>
        </div>
        {/* Settings and Controls */}
        <div className="flex justify-end items-center mb-4">
          {/* Controls */}
          <div className="flex gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearConversation}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
                title="Clear conversation"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
          </div>
        </div>
        {/* Chat Container */}
        <div className="glass rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] animate-in">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <Bot className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm sm:text-base">Set your API key and set model preferences using the Settings page.</p>
                <p className="text-sm sm:text-base">With a valid API key you can then start a conversation by typing a message below</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-2 sm:gap-3 ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${
                      message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {message.role === 'user' ? <User className="w-3 h-3 sm:w-4 sm:h-4" /> : <Bot className="w-3 h-3 sm:w-4 sm:h-4" />}
                    </div>
                    <div
                      className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex gap-2 sm:gap-3 justify-start">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center">
                  <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <div className="bg-secondary px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input Form */}
          <div className="border-t border-border p-3 sm:p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading || !apiKey.trim() || !!apiKeyError}
                className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 text-sm sm:text-base"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim() || !apiKey.trim() || !!apiKeyError}
                className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {!apiKey.trim() && (
              <p className="text-xs sm:text-sm text-destructive mt-2">
                Please enter your OpenAI API key in settings to start chatting
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 