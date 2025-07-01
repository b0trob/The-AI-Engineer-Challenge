import { ApiResponse, ChatRequest } from '../types';
import { API_ENDPOINTS, API_KEY_REGEX } from '../constants';

/**
 * Get API base URL from environment or use relative path for local development
 */
export const getApiBaseUrl = (): string => {
  // Check if we're in production (not localhost)
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // Use environment variable if available
    const envApiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (envApiUrl) {
      console.log('Using environment API URL:', envApiUrl);
      return envApiUrl;
    }

    // If no environment variable, try to construct from current domain
    const currentHost = window.location.hostname;
    const currentProtocol = window.location.protocol;

    // For Vercel deployments, try different patterns
    if (currentHost.includes('vercel.app')) {
      // Try to construct API URL from frontend URL
      // If your frontend is at: https://my-frontend.vercel.app
      // And your API is at: https://my-api.vercel.app
      // You can set NEXT_PUBLIC_API_URL=https://my-api.vercel.app

      // For now, let's try the same domain but different path
      const apiUrl = `${currentProtocol}//${currentHost}`;
      console.log('Constructed API URL:', apiUrl);
      console.log('⚠️  If this doesn\'t work, please set NEXT_PUBLIC_API_URL environment variable');
      return apiUrl;
    }

    // Fallback to same domain but different path
    const fallbackUrl = `${currentProtocol}//${currentHost}`;
    console.log('Using fallback API URL:', fallbackUrl);
    return fallbackUrl;
  }

  // In development, use relative path (will work with local FastAPI server)
  console.log('Development mode - using relative API paths');
  return '';
};

/**
 * Validate API key format
 */
export const validateApiKeyFormat = (key: string): boolean => {
  return API_KEY_REGEX.test(key);
};

/**
 * Test API key validity with backend
 */
export const testApiKey = async (apiKey: string): Promise<ApiResponse> => {
  if (!validateApiKeyFormat(apiKey)) {
    return {
      valid: false,
      message: 'Invalid API Key format. Please check your key.',
    };
  }

  try {
    const apiBaseUrl = getApiBaseUrl();
    const fullUrl = `${apiBaseUrl}${API_ENDPOINTS.TEST_KEY}`;
    console.log('Attempting to validate API key at:', fullUrl);

    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey }),
    });

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('API validation response:', data);

    if (!data.valid) {
      throw new Error(data.message);
    }

    return { valid: true };
  } catch (error: any) {
    console.error('API key validation error:', error);
    return {
      valid: false,
      message: error.message || 'Failed to validate API key',
    };
  }
};

/**
 * Send chat message to API
 */
export const sendChatMessage = async (request: ChatRequest): Promise<Response> => {
  const apiBaseUrl = getApiBaseUrl();
  const fullUrl = `${apiBaseUrl}${API_ENDPOINTS.CHAT}`;

  return fetch(fullUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
}; 