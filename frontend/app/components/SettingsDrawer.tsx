import React from 'react';
import { useAppStore } from '../store/useAppStore';
import { MODELS, PREDEFINED_PROMPTS } from '../constants';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  'aria-label'?: string;
}

export default function SettingsDrawer({ isOpen, onClose, 'aria-label': ariaLabel }: SettingsDrawerProps) {
  const {
    apiKey,
    setApiKey,
    developerMessage,
    setDeveloperMessage,
    model,
    setModel,
    apiKeyError,
    isApiKeyValid,
    isLoadingValidation,
  } = useAppStore();

  const handlePredefinedPromptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPrompt = PREDEFINED_PROMPTS.find((p) => p.name === e.target.value)?.prompt;
    if (selectedPrompt) {
      setDeveloperMessage(selectedPrompt);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel || 'Settings dialog'}
    >
      <div
        className="max-w-2xl w-full mx-auto p-6 rounded-lg bg-background border border-border shadow-lg animate-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* API Key Section */}
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-foreground">
              OpenAI API Key
            </label>
            <input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`w-full p-3 bg-input border rounded-lg text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent ${
                apiKeyError ? 'border-destructive' : 'border-border'
              }`}
              placeholder="sk-proj-..."
              aria-describedby={apiKeyError ? 'api-key-error' : undefined}
              aria-invalid={!!apiKeyError}
            />
            {apiKeyError && (
              <p id="api-key-error" className="text-destructive text-sm">
                {apiKeyError}
              </p>
            )}
            {isLoadingValidation && (
              <p className="text-muted-foreground text-sm">Validating key...</p>
            )}
            {isApiKeyValid && (
              <p className="text-green-600 text-sm">✓ API key is valid</p>
            )}
          </div>

          {/* AI Personality Section */}
          <div className="space-y-2">
            <label htmlFor="personality" className="block text-sm font-medium text-foreground">
              AI Personality
            </label>
            <select
              id="personality"
              onChange={handlePredefinedPromptChange}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground"
              aria-describedby="personality-description"
            >
              {PREDEFINED_PROMPTS.map((p) => (
                <option key={p.name}>{p.name}</option>
              ))}
              <option>Custom</option>
            </select>
            <p id="personality-description" className="text-xs text-muted-foreground">
              Choose a predefined personality or select Custom to write your own
            </p>
          </div>

          {/* Developer Message Section */}
          <div className="space-y-2">
            <label htmlFor="developerMessage" className="block text-sm font-medium text-foreground">
              Developer Message (System Prompt)
            </label>
            <textarea
              id="developerMessage"
              value={developerMessage}
              onChange={(e) => setDeveloperMessage(e.target.value)}
              placeholder="System prompt for the AI"
              rows={3}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground resize-vertical"
              aria-describedby="developer-message-description"
            />
            <p id="developer-message-description" className="text-xs text-muted-foreground">
              This message sets the context and personality for the AI. It acts as a guiding instruction for every response.
            </p>
          </div>

          {/* Model Selection Section */}
          <div className="space-y-2">
            <label htmlFor="model" className="block text-sm font-medium text-foreground">
              Model
            </label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-input text-foreground"
              aria-describedby="model-description"
            >
              {MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.name}
                </option>
              ))}
            </select>
            <p id="model-description" className="text-xs text-muted-foreground">
              {MODELS.find((m) => m.value === model)?.description}
            </p>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-ring focus:ring-offset-2 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 