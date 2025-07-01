# OpenAI Chat API Documentation

This FastAPI application provides a comprehensive chat interface for interacting with OpenAI's GPT models, featuring session management, streaming responses, and API key validation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Session Management](#session-management)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)
- [Deployment](#deployment)

## Overview

The API serves as a wrapper around OpenAI's chat completion API, providing:
- **Session-based conversations** for maintaining context across multiple messages
- **Streaming responses** for real-time chat experience
- **API key validation** and testing
- **CORS support** for web applications
- **Rate limiting headers** from OpenAI

## Features

- ✅ **Session Management**: Create, retrieve, and delete conversation sessions
- ✅ **Streaming Responses**: Real-time chat responses using Server-Sent Events
- ✅ **API Key Validation**: Validate OpenAI API keys before use
- ✅ **Conversation History**: Maintain context across multiple messages
- ✅ **CORS Support**: Cross-origin resource sharing enabled
- ✅ **Health Monitoring**: API health check endpoint
- ✅ **Rate Limit Tracking**: Forward OpenAI's rate limit headers

## API Endpoints

### 1. Chat Endpoint

**POST** `/api/chat`

Main endpoint for sending messages and receiving streaming responses.

#### Request Body
```json
{
  "developer_message": "You are a helpful AI assistant.",
  "user_message": "Hello, how are you?",
  "model": "gpt-4.1-mini",
  "api_key": "sk-proj-your-api-key-here",
  "session_id": "optional-session-id"
}
```

#### Parameters
- `developer_message` (string, required): System message that defines the AI's role/behavior
- `user_message` (string, required): The user's message to the AI
- `model` (string, optional): OpenAI model to use (default: "gpt-4.1-mini")
- `api_key` (string, required): Your OpenAI API key
- `session_id` (string, optional): Session ID for conversation continuity

#### Response
- **Content-Type**: `text/plain`
- **Streaming**: Real-time text chunks
- **Headers**:
  - `X-Session-ID`: Session identifier
  - `X-RateLimit-Limit`: Rate limit from OpenAI
  - `X-RateLimit-Remaining`: Remaining requests

### 2. API Key Test Endpoint

**POST** `/api/test-key`

Test if an OpenAI API key is valid without making expensive calls.

#### Request Body
```json
{
  "api_key": "sk-proj-your-api-key-here"
}
```

#### Response
```json
{
  "valid": true,
  "message": "API key is valid. Found 50 models."
}
```

### 3. Session Management Endpoints

#### Create Session
**POST** `/api/sessions`

Create a new conversation session.

#### Request Body
```json
{
  "developer_message": "You are a helpful AI assistant."
}
```

#### Response
```json
{
  "session_id": "uuid-session-id",
  "message": "Session created successfully",
  "created_at": "2024-01-01T12:00:00"
}
```

#### Get Session Info
**GET** `/api/sessions/{session_id}`

Retrieve information about a specific session.

#### Response
```json
{
  "session_id": "uuid-session-id",
  "developer_message": "You are a helpful AI assistant.",
  "message_count": 5,
  "created_at": "2024-01-01T12:00:00",
  "last_updated": "2024-01-01T12:30:00"
}
```

#### Delete Session
**DELETE** `/api/sessions/{session_id}`

Delete a conversation session.

#### Response
```json
{
  "message": "Session deleted successfully"
}
```

### 4. Health Check Endpoint

**GET** `/api/health`

Check API status and get basic statistics.

#### Response
```json
{
  "status": "ok",
  "active_sessions": 3,
  "timestamp": "2024-01-01T12:00:00"
}
```

## Authentication

The API uses OpenAI API keys for authentication. API keys must:
- Start with `sk-proj-`
- Be exactly 164 characters long
- Follow the pattern: `sk-proj-[A-Za-z0-9\-_]{156}`

## Session Management

Sessions provide conversation continuity by maintaining:
- **Developer Message**: The system prompt that defines AI behavior
- **Message History**: All user and assistant messages in chronological order
- **Timestamps**: Creation and last update times

### Session Lifecycle
1. **Create**: Initialize with a developer message
2. **Use**: Send messages with the session ID for context
3. **Manage**: Retrieve info or delete when no longer needed

## Usage Examples

### JavaScript/TypeScript Example

```javascript
// Test API key
async function testApiKey(apiKey) {
  const response = await fetch('/api/test-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey })
  });
  return await response.json();
}

// Create a session
async function createSession(developerMessage) {
  const response = await fetch('/api/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ developer_message: developerMessage })
  });
  return await response.json();
}

// Send a chat message with streaming
async function sendMessage(sessionId, userMessage, apiKey) {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      developer_message: "You are a helpful AI assistant.",
      user_message: userMessage,
      api_key: apiKey,
      session_id: sessionId
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    result += chunk;
    console.log('Received chunk:', chunk);
  }

  return result;
}
```

### Python Example

```python
import requests
import json

# Test API key
def test_api_key(api_key):
    response = requests.post('/api/test-key', json={'api_key': api_key})
    return response.json()

# Create session
def create_session(developer_message):
    response = requests.post('/api/sessions', json={'developer_message': developer_message})
    return response.json()

# Send chat message
def send_message(session_id, user_message, api_key):
    data = {
        'developer_message': 'You are a helpful AI assistant.',
        'user_message': user_message,
        'api_key': api_key,
        'session_id': session_id
    }
    
    response = requests.post('/api/chat', json=data, stream=True)
    
    for line in response.iter_lines():
        if line:
            print(line.decode('utf-8'))
```

### cURL Examples

```bash
# Test API key
curl -X POST http://localhost:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'

# Create session
curl -X POST http://localhost:8000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"developer_message": "You are a helpful AI assistant."}'

# Send chat message
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "developer_message": "You are a helpful AI assistant.",
    "user_message": "Hello, how are you?",
    "api_key": "sk-proj-your-api-key-here",
    "session_id": "your-session-id"
  }'

# Get session info
curl -X GET http://localhost:8000/api/sessions/your-session-id

# Delete session
curl -X DELETE http://localhost:8000/api/sessions/your-session-id
```

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid API key format or malformed request
- **404 Not Found**: Session not found
- **500 Internal Server Error**: OpenAI API errors or server issues

### Common Error Responses

```json
{
  "detail": "Invalid API Key format. The key should start with 'sk-proj-' and be 164 characters long."
}
```

```json
{
  "detail": "Session not found"
}
```

## Deployment

### Local Development

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python app.py
```

The API will be available at `http://127.0.0.1:8000`

### Production (Vercel)

The application is configured for Vercel deployment:
- Automatically detects production environment
- Binds to `0.0.0.0` for external connections
- Uses environment variable `PORT` for port configuration

### Environment Variables

- `VERCEL`: Set to "1" in production (Vercel)
- `PORT`: Port number (default: 8000)

## Dependencies

- **FastAPI**: Web framework
- **Pydantic**: Data validation
- **OpenAI**: OpenAI API client
- **Uvicorn**: ASGI server
- **Python 3.7+**: Runtime requirement

## Security Considerations

- API keys are validated but not stored
- CORS is configured for cross-origin requests
- Sessions are stored in memory (not persistent)
- Production deployments should use proper database storage
- Consider implementing rate limiting for production use

## Rate Limiting

The API forwards OpenAI's rate limit headers:
- `X-RateLimit-Limit`: Maximum requests per time window
- `X-RateLimit-Remaining`: Remaining requests in current window

Monitor these headers to avoid hitting OpenAI's rate limits. 