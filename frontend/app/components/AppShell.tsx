import React, { useState } from 'react';
import { Settings, Trash2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Navbar from './Navbar';
import ChatWindow from './ChatWindow';
import SettingsDrawer from './SettingsDrawer';

interface AppShellProps {
  children?: React.ReactNode;
  'aria-label'?: string;
}

export default function AppShell({ children, 'aria-label': ariaLabel }: AppShellProps) {
  const { messages, clearMessages } = useAppStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleClearConversation = () => {
    if (confirm('Are you sure you want to clear the conversation? This action cannot be undone.')) {
      clearMessages();
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground" aria-label={ariaLabel}>
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20">
        <div className="container mx-auto px-4 py-4 sm:py-8 max-w-4xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4 sm:mb-8 animate-in">
            <div className="text-center sm:text-left">
              <p className="text-sm sm:text-base text-foreground">
                Start a conversation with AI - ask questions, get help, or just chat
              </p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex gap-2">
              {messages.length > 0 && (
                <button
                  onClick={handleClearConversation}
                  className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
                  title="Clear conversation"
                  aria-label="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-lg shadow-md hover:shadow-lg transition-all text-sm sm:text-base"
                title="Open settings"
                aria-label="Open settings"
              >
                <Settings className="w-4 h-4" aria-hidden="true" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>

          {/* Chat Window */}
          <ChatWindow aria-label="Main chat interface" />

          {/* Settings Drawer */}
          <SettingsDrawer
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            aria-label="Settings panel"
          />
        </div>
      </main>

      {/* Render children if provided */}
      {children}
    </div>
  );
} 