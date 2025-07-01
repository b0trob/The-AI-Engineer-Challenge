import { Model, PredefinedPrompt } from '../types';

export const MODELS: Model[] = [
  {
    value: 'gpt-4.1-mini',
    name: 'GPT-4.1 Mini',
    description: 'Fastest and most affordable model, great for simple tasks and quick chats.',
  },
  {
    value: 'gpt-4',
    name: 'GPT-4',
    description: 'Powerful and capable model, ideal for complex reasoning and multi-step tasks.',
  },
  {
    value: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: 'A solid balance of speed, performance, and cost-effectiveness.',
  },
];

export const PREDEFINED_PROMPTS: PredefinedPrompt[] = [
  { name: 'Default', prompt: 'You are a helpful AI assistant.' },
  {
    name: 'Sarcastic Bot',
    prompt: 'You are a sarcastic bot. You provide witty, eye-rolling responses to every user request, but still begrudgingly provide the correct answer.',
  },
  {
    name: 'ELI5 Explainer',
    prompt: 'You are an expert explainer who can break down complex topics into simple, easy-to-understand concepts, as if you were explaining it to a 5-year-old.',
  },
];

export const STORAGE_KEYS = {
  API_KEY: 'openai_api_key',
  MODEL: 'model',
  DEVELOPER_MESSAGE: 'developer_message',
} as const;

export const API_ENDPOINTS = {
  CHAT: '/api/chat',
  TEST_KEY: '/api/test-key',
} as const;

export const API_KEY_REGEX = /^sk-proj-[A-Za-z0-9\-_]{156}$/; 