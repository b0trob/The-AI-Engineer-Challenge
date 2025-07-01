import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatInput from '../ChatInput';

// Mock the store
jest.mock('../../store/useAppStore', () => ({
  useAppStore: () => ({
    inputMessage: '',
    setInputMessage: jest.fn(),
    sendMessage: jest.fn(),
    canSendMessage: () => true,
    apiKey: 'test-key',
    apiKeyError: null,
  }),
}));

describe('ChatInput', () => {
  it('renders input field and send button', () => {
    render(<ChatInput />);
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByLabelText('Send message')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const mockSendMessage = jest.fn();
    jest.doMock('../../store/useAppStore', () => ({
      useAppStore: () => ({
        inputMessage: 'test message',
        setInputMessage: jest.fn(),
        sendMessage: mockSendMessage,
        canSendMessage: () => true,
        apiKey: 'test-key',
        apiKeyError: null,
      }),
    }));

    render(<ChatInput />);
    
    const form = screen.getByRole('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockSendMessage).toHaveBeenCalled();
    });
  });

  it('shows error message when no API key is provided', () => {
    jest.doMock('../../store/useAppStore', () => ({
      useAppStore: () => ({
        inputMessage: '',
        setInputMessage: jest.fn(),
        sendMessage: jest.fn(),
        canSendMessage: () => false,
        apiKey: '',
        apiKeyError: null,
      }),
    }));

    render(<ChatInput />);
    
    expect(screen.getByText('Please enter your OpenAI API key in settings to start chatting')).toBeInTheDocument();
  });

  it('applies custom aria-label when provided', () => {
    const customAriaLabel = 'Custom chat input';
    render(<ChatInput aria-label={customAriaLabel} />);
    
    expect(screen.getByLabelText(customAriaLabel)).toBeInTheDocument();
  });
}); 