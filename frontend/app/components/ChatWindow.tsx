import React, { useRef, useEffect } from 'react';
import { Bot } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  'aria-label'?: string;
}

export default function ChatWindow({ 'aria-label': ariaLabel }: ChatWindowProps) {
  const { messages, isLoading } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="glass rounded-lg shadow-lg overflow-hidden flex flex-col h-[calc(100vh-12rem)] sm:h-[calc(100vh-16rem)] md:h-[calc(100vh-20rem)] animate-in">
      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4"
        role="log"
        aria-label={ariaLabel || 'Chat messages'}
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Bot className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p className="text-sm sm:text-base">
              Set your API key and set model preferences using the Settings page.
            </p>
            <p className="text-sm sm:text-base">
              With a valid API key you can then start a conversation by typing a message below
            </p>
          </div>
        ) : (
          messages.map((message, index) => (
            <MessageBubble
              key={index}
              message={message}
              aria-label={`Message ${index + 1} of ${messages.length}`}
            />
          ))
        )}
        {isLoading && (
          <div className="flex gap-2 sm:gap-3 justify-start">
            <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center animate-thinking">
              <Bot className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            </div>
            <div className="bg-secondary px-3 py-2 sm:px-4 sm:py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-primary rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground animate-pulse">AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input Form */}
      <ChatInput aria-label="Chat input area" />
    </div>
  );
} 