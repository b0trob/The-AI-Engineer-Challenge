<p align = "center" draggable="false" ><img src="https://github.com/AI-Maker-Space/LLM-Dev-101/assets/37101144/d1343317-fa2f-41e1-8af1-1dbb18399719" 
     width="200px"
     height="auto"/>
</p>

## <h1 align="center" id="heading"> 👋 Welcome to the AI Engineer Challenge</h1>

## 🤖 Full-Stack LLM Chat Application

> **Current Status**: This is a complete full-stack application with a FastAPI backend and Next.js frontend, ready for deployment on Vercel.

> If you are a novice and need help setting up your development environment, check out this [Setup Guide](aie-docs/GIT_SETUP.md).

> For additional context on LLM development environments and API key setup, check out our [Interactive Dev Environment for LLM Development](https://github.com/AI-Maker-Space/Interactive-Dev-Environment-for-AI-Engineers).

## 🏗️ Application Architecture

This project consists of:

- **Backend**: FastAPI application (`/api/`) with streaming chat, session management, and API key validation
- **Frontend**: Next.js 14 application (`/frontend/`) with TypeScript, Tailwind CSS, and real-time chat interface
- **Deployment**: Vercel configuration for both frontend and backend deployment

### Tech Stack

**Backend:**
- FastAPI 0.115.12
- OpenAI Python SDK 1.77.0
- Uvicorn 0.34.2
- Pydantic 2.11.4

**Frontend:**
- Next.js 14.0.4
- React 18.3.1
- TypeScript 5
- Tailwind CSS 3.3.0
- Lucide React Icons

## 🚀 Quick Start

### Prerequisites

1. **Git Setup**: Ensure you have Git installed and configured
2. **Python 3.8+**: For the FastAPI backend
3. **Node.js 18+**: For the Next.js frontend
4. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)

### Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/The-AI-Engineer-Challenge.git
   cd The-AI-Engineer-Challenge
   ```

2. **Backend Setup**
   ```bash
   cd api
   # Create virtual environment (recommended)
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Start the server
   python app.py
   ```
   The API will be available at `http://127.0.0.1:8000`

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will be available at `http://127.0.0.1:3000`

## 🔧 API Endpoints

### Main Chat Endpoint
**POST** `/api/chat`
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
```bash
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

### Session Management
```bash
# Create session
curl -X POST http://127.0.0.1:8000/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"developer_message": "You are a helpful assistant."}'

# Get session info
curl -X GET http://127.0.0.1:8000/api/sessions/{session_id}

# Delete session
curl -X DELETE http://127.0.0.1:8000/api/sessions/{session_id}
```

### Health Check
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

## 🎮 Frontend Features

### ✨ What's Cool About the Frontend

- 🎨 **Gorgeous UI**: Clean, modern design that looks great in both light and dark modes
- 💬 **Real-time Magic**: Watch AI responses stream in live, like watching thoughts form in real-time
- ⚙️ **Super Configurable**: Tweak your AI's personality, model, and settings on the fly
- 🔒 **Security First**: API keys are hidden like secrets (because they are!)
- 📱 **Works Everywhere**: From your phone to your massive desktop monitor
- 🌙 **Dark Mode**: Because your eyes deserve better than bright white screens

### Frontend Project Structure
```
frontend/
├── app/                    # Next.js 13+ app directory (the new hotness)
│   ├── globals.css        # Global styles with Tailwind (because we're fancy)
│   ├── layout.tsx         # Root layout component (the foundation)
│   └── page.tsx           # Main chat interface (where the magic happens)
├── package.json           # All the dependencies and scripts
├── next.config.js         # Next.js configuration (with API rewrites!)
├── tailwind.config.js     # Tailwind CSS configuration (for that sweet styling)
├── postcss.config.js      # PostCSS configuration (CSS processing magic)
├── tsconfig.json          # TypeScript configuration (type safety FTW!)
└── README.md              # This awesome file you're reading right now
```

### How to Use the Frontend

1. **🔧 Configure Your Setup**: Click that "Settings" button and:
   - Drop in your OpenAI API key (this is required - no key, no AI magic!)
   - Customize the system message (make your AI sound like Shakespeare if you want!)
   - Pick your favorite AI model (we've got options!)

2. **💬 Start Chatting**: Once your API key is in place, let the conversations begin!

3. **👀 Watch the Magic**: See AI responses appear word by word - it's like watching someone think out loud!

## 🌐 VPS Deployment with SSH Tunnel

If you're running this on a VPS and need to access it via SSH tunnel:

### 1. On your VPS, start both services:
```bash
# Terminal 1 - Backend
cd The-AI-Engineer-Challenge/api
python app.py

# Terminal 2 - Frontend  
cd The-AI-Engineer-Challenge/frontend
npm run dev
```

### 2. From your local machine, create SSH tunnels:
```bash
# Tunnel for frontend (port 3000)
ssh -L 3000:127.0.0.1:3000 your-vps-username@your-vps-ip

# In another terminal, tunnel for backend (port 8000) if needed
ssh -L 8000:127.0.0.1:8000 your-vps-username@your-vps-ip
```

### 3. Access the frontend:
- Open your browser and go to `http://localhost:3000`
- The frontend will automatically connect to the backend on the VPS

*Note: Both frontend and backend are configured to use IPv4 localhost (127.0.0.1) for maximum security! 🛠️🔒*

## 🛠️ Troubleshooting

### Backend Issues

**1. API Key Validation Errors**
```bash
# Test API key format
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

**2. Check Backend Health**
```bash
curl -X GET http://127.0.0.1:8000/api/health
```

**3. Test Chat Endpoint**
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

**1. Check Frontend Build**
```bash
cd frontend
npm run build
```

**2. Check for TypeScript Errors**
```bash
cd frontend
npx tsc --noEmit
```

**3. Clear Next.js Cache**
```bash
cd frontend
rm -rf .next
npm run dev
```

### Common Error Solutions

**API Key Format Error:**
- Ensure your API key starts with `sk-proj-`
- API key must be exactly 164 characters long
- Only use letters, numbers, hyphens, and underscores

**CORS Errors:**
- Backend is configured to allow all origins in development
- Check that frontend is making requests to the correct backend URL

**Session Not Found:**
- Sessions are stored in memory (not persistent across server restarts)
- Create a new session if the server has been restarted

**🔌 API Connection Issues**: Make sure your FastAPI backend is running on port 8000
**🌐 CORS Errors**: The backend is already configured to play nice with the frontend
**🔑 API Key Problems**: Double-check that your OpenAI API key is valid and has some credits left
**🔗 IPv6 Issues**: The frontend now explicitly uses IPv4 (127.0.0.1) to avoid connection problems

## 🚀 Vercel Deployment

### Prerequisites for Deployment

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Integration**: Connect your GitHub account to Vercel
3. **Environment Variables**: Prepare your OpenAI API key

### Deployment Process

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

#### Step 2: Deploy to Vercel

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from Project Root**
   ```bash
   vercel
   ```

4. **Follow the Prompts:**
   - Set up and deploy: `Y`
   - Which scope: Select your account
   - Link to existing project: `N`
   - Project name: `ai-engineer-challenge` (or your preferred name)
   - Directory: `.` (current directory)
   - Override settings: `N`

#### Step 3: Configure Environment Variables

1. **Go to Vercel Dashboard**
   - Navigate to your project
   - Go to Settings → Environment Variables

2. **Add Required Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-project-name.vercel.app
   ```

3. **Redeploy After Changes**
   ```bash
   vercel --prod
   ```

### Testing Deployment

#### 1. Test Backend Endpoints
```bash
# Replace with your actual Vercel URL
curl -X GET https://your-project-name.vercel.app/api/health

curl -X POST https://your-project-name.vercel.app/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

#### 2. Test Frontend
- Visit your Vercel URL in a browser
- Test the chat functionality
- Verify API key validation works

### Production Deployment

#### 1. Production Environment Variables
Set these in Vercel Dashboard:
```
NEXT_PUBLIC_API_URL=https://your-production-domain.vercel.app
```

#### 2. Custom Domain (Optional)
1. Go to Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS settings as instructed
4. Update `NEXT_PUBLIC_API_URL` to use your custom domain

#### 3. Production Monitoring
```bash
# Monitor deployment status
vercel ls

# View deployment logs
vercel logs

# Check function execution
vercel logs --follow
```

### Deployment Troubleshooting

#### Build Failures
```bash
# Check build logs
vercel logs

# Test build locally
cd frontend && npm run build
cd ../api && python -c "import app; print('Backend imports successfully')"
```

#### Environment Variable Issues
```bash
# List environment variables
vercel env ls

# Add environment variable
vercel env add NEXT_PUBLIC_API_URL
```

#### Function Timeout Issues
- Backend functions have a 10-second timeout on Vercel
- For longer operations, consider using background jobs
- Optimize API calls to complete within the timeout

## 🔑 API Key Setup

### Getting Your OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-`)

### API Key Format Requirements

Your API key must:
- Start with `sk-proj-`
- Be exactly 164 characters long
- Contain only letters, numbers, hyphens, and underscores

### Testing Your API Key

```bash
# Test locally
curl -X POST http://127.0.0.1:8000/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'

# Test on Vercel
curl -X POST https://your-project-name.vercel.app/api/test-key \
  -H "Content-Type: application/json" \
  -d '{"api_key": "sk-proj-your-api-key-here"}'
```

## 🎯 Features

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
- **Dark/Light Theme**: Toggle between themes

## 🛠️ Development Goodies

- **🔥 Hot Reload**: Change something and see it instantly - no more waiting around!
- **📝 TypeScript**: Full type safety so you know exactly what you're working with
- **🧹 ESLint**: Keeps your code clean and consistent
- **🎨 Tailwind CSS**: Utility-first CSS that makes styling a breeze

## 📚 Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🎉 Congratulations!

You've successfully built and deployed a full-stack LLM chat application! 

### Share Your Achievement

Post your results on LinkedIn with this template:

```
🚀🎉 Exciting News! 🎉🚀

🏗️ Today, I'm thrilled to announce that I've successfully built and deployed my first-ever full-stack LLM application using FastAPI, Next.js, and the OpenAI API! 🖥️

Check it out 👇
[YOUR_VERCEL_URL]

A big shoutout to the @AI Makerspace for making this possible. Couldn't have done it without the incredible community there. 🤗🙏

Looking forward to building with the community! 🙌✨ Here's to many more creations ahead! 🥂🎉

Who else is diving into the world of AI? Let's connect! 🌐💡

#FullStackLLM #AIEngineering #OpenAI #FastAPI #NextJS
```

---

**Need Help?** Check out our [FAQ and Common Issues](FAQandCommonIssues.md) or ask questions in the AI Makerspace community!

**Happy coding! 🎉** May your AI conversations be enlightening and your code be bug-free!
