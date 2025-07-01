export interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Model {
  value: string;
  name: string;
  description: string;
}

export interface PredefinedPrompt {
  name: string;
  prompt: string;
}

export interface ChatState {
  messages: Message[];
  inputMessage: string;
  isLoading: boolean;
  sessionId: string | null;
}

export interface SettingsState {
  apiKey: string;
  developerMessage: string;
  model: string;
  apiKeyError: string | null;
  isApiKeyValid: boolean;
  isLoadingValidation: boolean;
}

export interface AppState extends ChatState, SettingsState {}

export interface ApiResponse {
  valid: boolean;
  message?: string;
}

export interface ChatRequest {
  user_message: string;
  developer_message: string;
  api_key: string;
  session_id: string | null;
  model: string;
}

export interface Theme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    muted: string;
    border: string;
    accent: string;
  };
} 