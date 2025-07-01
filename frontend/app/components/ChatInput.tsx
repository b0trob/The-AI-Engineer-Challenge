import React, { useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

interface ChatInputProps {
  disabled?: boolean;
  'aria-label'?: string;
}

export default function ChatInput({ disabled = false, 'aria-label': ariaLabel }: ChatInputProps) {
  const { inputMessage, setInputMessage, sendMessage, canSendMessage, apiKey, apiKeyError } = useAppStore();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSendMessage()) return;

    await sendMessage(inputMessage);
    // Focus input after sending message
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const isDisabled = disabled || !apiKey.trim() || !!apiKeyError;

  return (
    <div className="border-t border-border p-3 sm:p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 group">
        <input
          ref={inputRef}
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          disabled={isDisabled}
          className="flex-1 px-3 py-2 sm:px-4 sm:py-2 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground placeholder-muted-foreground disabled:opacity-50 text-sm sm:text-base"
          aria-label={ariaLabel || 'Chat message input'}
          aria-describedby={!apiKey.trim() ? 'api-key-error' : undefined}
        />
        <button
          type="submit"
          disabled={!canSendMessage() || isDisabled}
          className="px-3 py-2 sm:px-4 sm:py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 hover:shadow-lg"
          aria-label="Send message"
        >
          <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
        </button>
      </form>
      {!apiKey.trim() && (
        <p id="api-key-error" className="text-xs sm:text-sm text-destructive mt-2">
          Please enter your OpenAI API key in settings to start chatting
        </p>
      )}
    </div>
  );
} 