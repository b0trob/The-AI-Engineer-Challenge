# Simple OpenAI

A full-stack LLM chat application built with FastAPI backend and Next.js frontend, designed for deployment on Vercel.

## Overview

This project demonstrates a complete full-stack application with real-time chat capabilities using OpenAI's API. The application features streaming responses, session management, and a modern web interface.

For development environment setup assistance, refer to the [Setup Guide](aie-docs/GIT_SETUP.md).

For additional context on LLM development environments and API key setup, visit our [Interactive Dev Environment for AI Engineers](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-AI-Engineers).

## Architecture

The application consists of two main components:

- **Backend**: FastAPI application (`/api/`) providing streaming chat, session management, and API key validation
- **Frontend**: Next.js 14 application (`/frontend/`) with TypeScript, Tailwind CSS, and real-time chat interface

### Technology Stack

**Backend Technologies:**
- [FastAPI](https://fastapi.tiangolo.com/) 0.115.12 - Modern web framework for building APIs
- [OpenAI Python SDK](https://github.com/openai/openai-python) 1.77.0 - Official OpenAI API client
- [Uvicorn](https://www.uvicorn.org/) 0.34.2 - ASGI server implementation
- [Pydantic](https://docs.pydantic.dev/) 2.11.4 - Data validation using Python type annotations

**Frontend Technologies:**
- [Next.js](https://nextjs.org/) 14.0.4 - React framework for production
- [React](https://react.dev/) 18.3.1 - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) 5 - Typed JavaScript
- [Tailwind CSS](https://tailwindcss.com/) 3.3.0 - Utility-first CSS framework

## Prerequisites

Before starting, ensure you have the following installed:

1. **Git**: Version control system - [Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
2. **Python 3.8+**: Programming language for backend - [Download Python](https://www.python.org/downloads/)
3. **Node.js 18+**: JavaScript runtime for frontend - [Download Node.js](https://nodejs.org/)
4. **OpenAI API Key**: Required for chat functionality - [Get API Key](https://platform.openai.com/api-keys)

## Local Development Setup

### Automated Setup (Recommended)

For quick setup and testing, use the provided deployment scripts:

**Linux/macOS:**
```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Simple-OpenAI.git
cd Simple-OpenAI

# Run the automated deployment script
./deploy-local.sh
```

**Windows:**
```cmd
# Clone the repository
git clone https://github.com/YOUR_USERNAME/Simple-OpenAI.git
cd Simple-OpenAI

# Run the automated deployment script
deploy-local.bat
```

The automated script will:
- Check all prerequisites (Python 3.8+, Node.js 18+, npm)
- Set up Python virtual environment
- Install all dependencies
- Test both backend and frontend startup
- Run integration tests
- Optionally start both services

### Manual Setup

If you prefer manual setup, follow these steps:

#### Step 1: Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Simple-OpenAI.git
cd Simple-OpenAI
```

#### Step 2: Backend Setup

Navigate to the API directory and set up the Python environment:

```bash
cd api

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python app.py
```

The API server will be available at `http://127.0.0.1:8000`

#### Step 3: Frontend Setup

In a new terminal window, navigate to the frontend directory:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend application will be available at `http://127.0.0.1:3000`

### Testing Before Deployment

Run the comprehensive test suite to validate your local setup:

**Linux/macOS:**
```bash
./test-local.sh
```

The test suite validates:
- File structure and configuration
- Dependencies installation
- Backend API functionality
- Frontend build process
- Service startup and accessibility
- CORS configuration
- API documentation

## API Reference

### Chat Endpoint

**POST** `/api/chat`

Send a message and receive streaming AI responses.

**Request Body:**
```json
{
  "developer_message": "You are a helpful assistant.",
  "user_message": "Hello, how are you?",
  "api_key": "sk-proj-your-api-key-here",
  "model": "gpt-4.1-mini",
  "session_id": "optional-session-id"
}
```

**Example using curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "developer_message": "You are a helpful assistant.",
    "user_message": "Hello, how are you?",
    "api_key": "sk-proj-your-api-key-here",
    "model": "gpt-4.1-mini",
    "session_id": "optional-session-id"
  }'
```

### API Key Validation

**POST** `/api/test-key`

Validate your OpenAI API key format and authentication.

**Request Body:**
```json
{
  "api_key": "sk-proj-your-api-key-here"
}
```

**Example using curl:**
```bash
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

### Session Management

**Create Session:**
```bash
curl -X POST http://127.0.0.1:8000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"developer_message": "You are a helpful assistant."}'
```

**Get Session Info:**
```bash
curl -X GET http://127.0.0.1:8000/api/sessions/{session_id}
```

**Delete Session:**
```bash
curl -X DELETE http://127.0.0.1:8000/api/sessions/{session_id}
```

### Health Check

**GET** `/api/health`

Check if the API server is running.

**Example using curl:**
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

## API Documentation

Once the server is running, you can access the interactive API documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## OpenAI API Key Setup

### Obtaining an API Key

1. Visit the [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the generated key (starts with `sk-proj-`)

### API Key Requirements

Your API key must meet the following criteria:
- Start with `sk-proj-`
- Be exactly 164 characters long
- Contain only letters, numbers, hyphens, and underscores

### Testing Your API Key

**Local Testing:**
```bash
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

**Production Testing:**
```bash
curl -X POST https://your-project-name.vercel.app/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

## Vercel Deployment

### Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Integration**: Connect your GitHub account to Vercel
3. **Environment Variables**: Prepare your OpenAI API key

### Deployment Steps

#### Step 1: Prepare Your Repository

Ensure your repository is pushed to GitHub with the following structure:

```
The-AI-Engineer-Challenge/
├── api/
│   ├── app.py
│   ├── requirements.txt
│   └── readme-app-py.md
├── frontend/
│   ├── package.json
│   ├── next.config.js
│   └── app/
├── vercel.json
└── README.md
```

#### Step 2: Install Vercel CLI

```bash
npm install -g vercel
```

#### Step 3: Login to Vercel

```bash
vercel login
```

#### Step 4: Deploy the Application

From the project root directory:

```bash
vercel
```

Follow the deployment prompts:
- Set up and deploy: `Y`
- Which scope: Select your account
- Link to existing project: `N`
- Project name: `ai-engineer-challenge` (or your preferred name)
- Directory: `.` (current directory)
- Override settings: `N`

#### Step 5: Configure Environment Variables

1. Navigate to your Vercel Dashboard
2. Go to your project settings
3. Navigate to Environment Variables
4. Add the following variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
   ```

#### Step 6: Redeploy with Changes

```bash
vercel --prod
```

### Testing Your Deployment

#### Test Backend Endpoints

Replace `your-project-name` with your actual Vercel project name:

```bash
# Health check
curl -X GET https://your-project-name.vercel.app/api/health

# API key validation
curl -X POST https://your-project-name.vercel.app/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

#### Test Frontend

1. Visit your Vercel URL in a web browser
2. Test the chat functionality
3. Verify API key validation works correctly

### Production Configuration

#### Environment Variables

Set these in your Vercel Dashboard:

```
NEXT_PUBLIC_API_URL=https://your-production-domain.vercel.app
```

#### Custom Domain (Optional)

1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS settings as instructed
4. Update `NEXT_PUBLIC_API_URL` to use your custom domain

#### Monitoring and Logs

```bash
# Monitor deployment status
vercel ls

# View deployment logs
vercel logs

# Monitor function execution
vercel logs --follow
```

## Local Deployment Scripts

### Quick Start with Automated Scripts

The project includes automated deployment scripts for easy local testing:

#### Linux/macOS Deployment
```bash
# Make scripts executable (first time only)
chmod +x deploy-local.sh test-local.sh

# Run deployment script
./deploy-local.sh

# Run test suite
./test-local.sh
```

#### Windows Deployment
```cmd
# Run deployment script
deploy-local.bat
```

#### What the Scripts Do

**deploy-local.sh/deploy-local.bat:**
- Validates system prerequisites (Python 3.8+, Node.js 18+, npm)
- Creates Python virtual environment
- Installs all dependencies
- Tests service startup
- Runs integration tests
- Optionally starts both services

**test-local.sh:**
- Comprehensive validation of all components
- Tests API endpoints and functionality
- Validates frontend build process
- Checks configuration files
- Provides detailed test results

### Manual Testing Commands

If you prefer manual testing, use these commands:

#### Test Backend Health
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

#### Test API Key Validation
```bash
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-invalid-key-for-testing"}'
```

#### Test Frontend Build
```bash
cd frontend && npm run build
```

#### Test Python Dependencies
```bash
cd api && source venv/bin/activate && python -c "import fastapi, uvicorn, openai, pydantic"
```

## Troubleshooting

### Backend Issues

#### API Key Validation Errors

Test your API key format:

```bash
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

#### Check Backend Health

```bash
curl -X GET http://127.0.0.1:8000/api/health
```

#### Test Chat Endpoint

```bash
curl -X POST http://127.0.0.1:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "developer_message": "You are a helpful assistant.",
    "user_message": "Test message",
    "api_key": "sk-proj-your-api-key-here"
  }'
```

### Frontend Issues

#### Check Frontend Build

```bash
cd frontend
npm run build
```

#### Check for TypeScript Errors

```bash
cd frontend
npx tsc --noEmit
```

#### Clear Next.js Cache

```bash
cd frontend
rm -rf .next
npm run dev
```

### Common Error Solutions

#### API Key Format Error

- Ensure your API key starts with `sk-proj-`
- API key must be exactly 164 characters long
- Only use letters, numbers, hyphens, and underscores

#### CORS Errors

- Backend is configured to allow all origins in development
- Check that frontend is making requests to the correct backend URL

#### Session Not Found

- Sessions are stored in memory (not persistent across server restarts)
- Create a new session if the server has been restarted

#### API Connection Issues

- Ensure your FastAPI backend is running on port 8000
- Check firewall settings if using a VPS

#### IPv6 Connection Issues

- The frontend explicitly uses IPv4 (127.0.0.1) to avoid connection problems
- Ensure your network configuration supports IPv4 connections

### Deployment Issues

#### Build Failures

Check build logs:

```bash
vercel logs
```

Test build locally:

```bash
cd frontend && npm run build
cd ../api && python -c "import app; print('Backend imports successfully')"
```

#### Environment Variable Issues

List environment variables:

```bash
vercel env ls
```

Add environment variable:

```bash
vercel env add NEXT_PUBLIC_API_URL
```

#### Function Timeout Issues

- Backend functions have a 10-second timeout on Vercel
- For longer operations, consider using background jobs
- Optimize API calls to complete within the timeout

## Features

### Backend Features

- **Streaming Chat**: Real-time responses from OpenAI models
- **Session Management**: Maintain conversation context
- **API Key Validation**: Built-in key format and authentication validation
- **Multi-Model Support**: GPT-4.1-mini, GPT-4, GPT-3.5-turbo
- **CORS Enabled**: Cross-origin resource sharing
- **Rate Limit Headers**: Monitor API usage

### Frontend Features

- **Real-time Chat Interface**: Streaming message display
- **Session Persistence**: Maintain conversations across page reloads
- **API Key Management**: Secure key storage and validation
- **Model Selection**: Choose from different OpenAI models
- **Predefined Prompts**: Quick setup for different use cases
- **Responsive Design**: Works on desktop and mobile
- **Theme Toggle**: Switch between light and dark modes

## Development Features

- **Hot Reload**: Instant updates during development
- **TypeScript**: Full type safety and IntelliSense
- **ESLint**: Code quality and consistency
- **Tailwind CSS**: Utility-first styling approach

## VPS Deployment with SSH Tunnel

For deployment on a VPS with SSH tunnel access:

### Start Services on VPS

```bash
# Terminal 1 - Backend
cd The-AI-Engineer-Challenge/api
python app.py

# Terminal 2 - Frontend  
cd The-AI-Engineer-Challenge/frontend
npm run dev
```

### Create SSH Tunnels from Local Machine

```bash
# Tunnel for frontend (port 3000)
ssh -L 3000:127.0.0.1:3000 your-vps-username@your-vps-ip

# In another terminal, tunnel for backend (port 8000) if needed
ssh -L 8000:127.0.0.1:8000 your-vps-username@your-vps-ip
```

### Access the Application

- Open your browser and navigate to `http://localhost:3000`
- The frontend will automatically connect to the backend on the VPS

Note: Both frontend and backend are configured to use IPv4 localhost (127.0.0.1) for maximum security.

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## Support

For additional help, check out our [FAQ and Common Issues](FAQandCommonIssues.md) or ask questions in the AI Makerspace community.

---

**Congratulations!** You've successfully built and deployed a full-stack LLM chat application. Share your achievement with the community and continue building amazing AI-powered applications.
