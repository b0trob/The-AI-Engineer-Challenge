import React from 'react';
import { Bot, User } from 'lucide-react';
import { Message } from '../types';
import FormattedMessage from './FormattedMessage';

interface MessageBubbleProps {
  message: Message;
  'aria-label'?: string;
}

export default function MessageBubble({ message, 'aria-label': ariaLabel }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const Icon = isUser ? User : Bot;
  const iconLabel = isUser ? 'User message' : 'AI assistant message';

  return (
    <div
      className={`flex gap-2 sm:gap-3 ${
        isUser ? 'justify-end' : 'justify-start'
      }`}
      role="listitem"
      aria-label={ariaLabel}
    >
      <div
        className={`flex gap-2 sm:gap-3 max-w-[85%] sm:max-w-[80%] ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <div
          className={`flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
          aria-label={iconLabel}
        >
          <Icon className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
        </div>
        <div
          className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground'
          }`}
          role="article"
          aria-label={`${message.role} message`}
        >
          <FormattedMessage content={message.content} role={message.role} />
          <time
            className={`text-xs mt-1 block ${
              isUser
                ? 'text-primary-foreground/80'
                : 'text-muted-foreground'
            }`}
            dateTime={message.timestamp.toISOString()}
            aria-label={`Message sent at ${message.timestamp.toLocaleTimeString()}`}
          >
            {message.timestamp.toLocaleTimeString()}
          </time>
        </div>
      </div>
    </div>
  );
} 