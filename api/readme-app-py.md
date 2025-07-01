# OpenAI Chat API - Documentation

A production-ready FastAPI application that provides a streaming interface to OpenAI's GPT models with comprehensive session management capabilities.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Run the API
```bash
python app.py
```
The API will be available at `http://127.0.0.1:8000`

## API Endpoints

### Main Chat Endpoint
**POST** `/api/chat`

Send messages and get streaming responses from GPT models.

**Request Body:**
```json
{
  "developer_message": "You are a helpful assistant.",
  "user_message": "Hello, how are you?",
  "model": "gpt-4.1-mini",
  "api_key": "sk-proj-your-api-key-here",
  "session_id": "optional-session-id"
}
```

**Response:** Streaming text response with headers:
- `X-Session-ID`: Session identifier
- `X-RateLimit-Limit`: Rate limit information
- `X-RateLimit-Remaining`: Remaining requests

### Test API Key
**POST** `/api/test-key`

Validate your OpenAI API key without making expensive calls.

**Request Body:**
```json
{
  "api_key": "sk-proj-your-api-key-here"
}
```

### Session Management

**Create Session:**
```bash
POST /api/sessions
{
  "developer_message": "You are a helpful assistant."
}
```

**Get Session Info:**
```bash
GET /api/sessions/{session_id}
```

**Delete Session:**
```bash
DELETE /api/sessions/{session_id}
```

### Health Check
**GET** `/api/health`

Check API status and active session count.

## Key Features

- **Streaming Responses**: Real-time chat responses with low latency
- **Session Management**: Maintain conversation context across multiple interactions
- **API Key Validation**: Built-in key format validation and authentication
- **CORS Enabled**: Cross-origin resource sharing for web applications
- **Rate Limit Headers**: Monitor API usage and rate limiting
- **Error Handling**: Comprehensive error responses and validation

## Example Usage

```python
import requests

# Test your API key
response = requests.post("http://127.0.0.1:8000/api/test-key", 
                        json={"api_key": "sk-proj-your-key"})
print(response.json())

# Send a chat message
chat_data = {
    "developer_message": "You are a helpful coding assistant.",
    "user_message": "Write a Python function to calculate fibonacci numbers.",
    "api_key": "sk-proj-your-key"
}

response = requests.post("http://127.0.0.1:8000/api/chat", 
                        json=chat_data, stream=True)

for chunk in response.iter_content(chunk_size=1024):
    if chunk:
        print(chunk.decode(), end='')
```

## API Key Format

Your OpenAI API key must:
- Start with `sk-proj-`
- Be exactly 164 characters long
- Contain only letters, numbers, hyphens, and underscores

## Troubleshooting with cURL

### Test API Health
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

### Validate API Key
```bash
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

### Create a New Session
```bash
curl -X POST http://127.0.0.1:8000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"developer_message": "You are a helpful coding assistant."}'
```

### Send a Chat Message
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "developer_message": "You are a helpful assistant.",
    "user_message": "Hello, how are you?",
    "api_key": "sk-proj-your-api-key-here"
  }'
```

### Get Session Information
```bash
curl -X GET http://127.0.0.1:8000/api/sessions/{session_id}
```

### Delete a Session
```bash
curl -X DELETE http://127.0.0.1:8000/api/sessions/{session_id}
```

### Common Error Responses

**Invalid API Key Format:**
```json
{
  "detail": "Invalid API Key format. The key should start with 'sk-proj-' and be 164 characters long."
}
```

**Authentication Failed:**
```json
{
  "valid": false,
  "message": "Authentication failed. Please check your API key."
}
```

**Session Not Found:**
```json
{
  "detail": "Session not found"
}
``` 