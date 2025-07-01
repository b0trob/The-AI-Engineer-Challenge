
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AppState, Message } from '../types';
import { MODELS, PREDEFINED_PROMPTS, STORAGE_KEYS } from '../constants';
import { testApiKey, sendChatMessage } from '../utils/api';

interface AppStore extends AppState {
  // Actions
  setApiKey: (apiKey: string) => void;
  setDeveloperMessage: (message: string) => void;
  setModel: (model: string) => void;
  setInputMessage: (message: string) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  clearMessages: () => void;
  setSessionId: (sessionId: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingValidation: (loading: boolean) => void;
  setApiKeyError: (error: string | null) => void;
  setIsApiKeyValid: (valid: boolean) => void;
  
  // Async actions
  validateApiKey: (apiKey: string) => Promise<void>;
  sendMessage: (message: string) => Promise<void>;
  
  // Computed
  canSendMessage: () => boolean;
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        messages: [],
        inputMessage: '',
        isLoading: false,
        sessionId: null,
        apiKey: '',
        developerMessage: PREDEFINED_PROMPTS[0].prompt,
        model: MODELS[0].value,
        apiKeyError: null,
        isApiKeyValid: false,
        isLoadingValidation: false,

        // Actions
        setApiKey: (apiKey: string) => {
          set({ apiKey });
          if (apiKey) {
            sessionStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);
            get().validateApiKey(apiKey);
          } else {
            sessionStorage.removeItem(STORAGE_KEYS.API_KEY);
            set({ apiKeyError: null, isApiKeyValid: false });
          }
        },

        setDeveloperMessage: (developerMessage: string) => {
          set({ developerMessage });
          sessionStorage.setItem(STORAGE_KEYS.DEVELOPER_MESSAGE, developerMessage);
        },

        setModel: (model: string) => {
          set({ model });
          sessionStorage.setItem(STORAGE_KEYS.MODEL, model);
        },

        setInputMessage: (inputMessage: string) => {
          set({ inputMessage });
        },

        addMessage: (message: Message) => {
          set((state) => ({
            messages: [...state.messages, message],
          }));
        },

        updateLastMessage: (content: string) => {
          set((state) => {
            const newMessages = [...state.messages];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content = content;
            } else {
              newMessages.push({
                role: 'assistant',
                content,
                timestamp: new Date(),
              });
            }
            return { messages: newMessages };
          });
        },

        clearMessages: () => {
          set({ messages: [], sessionId: null });
        },

        setSessionId: (sessionId: string | null) => {
          set({ sessionId });
        },

        setIsLoading: (isLoading: boolean) => {
          set({ isLoading });
        },

        setIsLoadingValidation: (isLoadingValidation: boolean) => {
          set({ isLoadingValidation });
        },

        setApiKeyError: (apiKeyError: string | null) => {
          set({ apiKeyError });
        },

        setIsApiKeyValid: (isApiKeyValid: boolean) => {
          set({ isApiKeyValid });
        },

        // Async actions
        validateApiKey: async (apiKey: string) => {
          const { setIsLoadingValidation, setApiKeyError, setIsApiKeyValid } = get();
          
          setIsLoadingValidation(true);
          setApiKeyError(null);

          try {
            const result = await testApiKey(apiKey);
            setApiKeyError(result.message || null);
            setIsApiKeyValid(result.valid);
          } catch (error: any) {
            setApiKeyError(error.message || 'Failed to validate API key');
            setIsApiKeyValid(false);
          } finally {
            setIsLoadingValidation(false);
          }
        },

        sendMessage: async (message: string) => {
          const {
            apiKey,
            developerMessage,
            model,
            sessionId,
            addMessage,
            updateLastMessage,
            setIsLoading,
            setSessionId,
            setInputMessage,
          } = get();

          if (!message.trim() || !get().isApiKeyValid) return;

          const userMessage: Message = {
            role: 'user',
            content: message,
            timestamp: new Date(),
          };

          addMessage(userMessage);
          setInputMessage('');
          setIsLoading(true);

          try {
            const response = await sendChatMessage({
              user_message: message,
              developer_message: developerMessage,
              api_key: apiKey,
              session_id: sessionId,
              model,
            });

            if (!response.ok) {
              throw new Error('Failed to send message');
            }

            const reader = response.body?.getReader();
            if (!reader) {
              throw new Error('No response body');
            }

            const decoder = new TextDecoder();
            let assistantMessage = '';

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;

              const chunk = decoder.decode(value);
              assistantMessage += chunk;
              updateLastMessage(assistantMessage);
            }

            // Get session ID from response headers
            const newSessionId = response.headers.get('X-Session-ID');
            if (newSessionId && newSessionId !== sessionId) {
              setSessionId(newSessionId);
            }
          } catch (error) {
            console.error('Error:', error);
            addMessage({
              role: 'assistant',
              content: 'Sorry, there was an error processing your request.',
              timestamp: new Date(),
            });
          } finally {
            setIsLoading(false);
          }
        },

        // Computed
        canSendMessage: () => {
          const { inputMessage, isApiKeyValid, apiKeyError } = get();
          return inputMessage.trim().length > 0 && isApiKeyValid && !apiKeyError;
        },
      }),
      {
        name: 'app-storage',
        partialize: (state) => ({
          apiKey: state.apiKey,
          developerMessage: state.developerMessage,
          model: state.model,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
); 