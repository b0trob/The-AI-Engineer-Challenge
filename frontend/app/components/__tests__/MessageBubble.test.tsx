import React from 'react';
import { render, screen } from '@testing-library/react';
import MessageBubble from '../MessageBubble';
import { Message } from '../../types';

const mockUserMessage: Message = {
  role: 'user',
  content: 'Hello, how are you?',
  timestamp: new Date('2024-01-01T12:00:00Z'),
};

const mockAssistantMessage: Message = {
  role: 'assistant',
  content: 'I am doing well, thank you for asking!',
  timestamp: new Date('2024-01-01T12:01:00Z'),
};

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    render(<MessageBubble message={mockUserMessage} />);
    
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    expect(screen.getByLabelText('User message')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    render(<MessageBubble message={mockAssistantMessage} />);
    
    expect(screen.getByText('I am doing well, thank you for asking!')).toBeInTheDocument();
    expect(screen.getByLabelText('AI assistant message')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('displays timestamp correctly', () => {
    render(<MessageBubble message={mockUserMessage} />);
    
    const timeElement = screen.getByRole('time');
    expect(timeElement).toBeInTheDocument();
    expect(timeElement).toHaveAttribute('datetime', mockUserMessage.timestamp.toISOString());
  });

  it('applies correct aria-label when provided', () => {
    const customAriaLabel = 'Custom message label';
    render(<MessageBubble message={mockUserMessage} aria-label={customAriaLabel} />);
    
    expect(screen.getByLabelText(customAriaLabel)).toBeInTheDocument();
  });
}); 