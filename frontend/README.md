# 🚀 AI Engineer Challenge Frontend

A sleek, modern chat interface built with Next.js that seamlessly integrates with your FastAPI backend! Think of it as the beautiful face to your AI's brain. 🧠✨

## ✨ What's Cool About This

- 🎨 **Gorgeous UI**: Clean, modern design that looks great in both light and dark modes
- 💬 **Real-time Magic**: Watch AI responses stream in live, like watching thoughts form in real-time
- ⚙️ **Super Configurable**: Tweak your AI's personality, model, and settings on the fly
- 🔒 **Security First**: API keys are hidden like secrets (because they are!)
- 📱 **Works Everywhere**: From your phone to your massive desktop monitor
- 🌙 **Dark Mode**: Because your eyes deserve better than bright white screens

## 🛠️ What You Need

- Node.js 18+ (the newer, the better!)
- npm or yarn (your package manager of choice)
- The FastAPI backend running locally (we'll get to that!)

## 🚀 Let's Get This Party Started

### 1. Navigate to the frontend directory:
```bash
cd The-AI-Engineer-Challenge/frontend
```

### 2. Install the good stuff:
```bash
npm install
# or if you're a yarn person
yarn install
```

## 🎯 Running the Show

### Step 1: Fire up the backend (in one terminal):
```bash
cd The-AI-Engineer-Challenge/api
pip install -r requirements.txt
python app.py
```
*Note: The backend runs securely on localhost only (127.0.0.1) - no security breaches here! 🔒*

### Step 2: Launch the frontend (in another terminal):
```bash
cd The-AI-Engineer-Challenge/frontend
npm run dev
# or
yarn dev
```
*Note: The frontend also runs securely on localhost only (127.0.0.1) - double security! 🔒🔒*

### Step 3: Open your browser and head to `http://localhost:3000`

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

## 🎮 How to Use This Bad Boy

1. **🔧 Configure Your Setup**: Click that "Settings" button and:
   - Drop in your OpenAI API key (this is required - no key, no AI magic!)
   - Customize the system message (make your AI sound like Shakespeare if you want!)
   - Pick your favorite AI model (we've got options!)

2. **💬 Start Chatting**: Once your API key is in place, let the conversations begin!

3. **👀 Watch the Magic**: See AI responses appear word by word - it's like watching someone think out loud!

## 📁 What's Inside This Box

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

## 🔌 API Integration

The frontend talks to your FastAPI backend through this endpoint:

- **POST** `/api/chat` - Sends your messages and gets back streaming AI responses

The frontend automatically routes API calls to `http://127.0.0.1:8000` using explicit IPv4 localhost to avoid IPv6 connection issues.

## 🛠️ Development Goodies

- **🔥 Hot Reload**: Change something and see it instantly - no more waiting around!
- **📝 TypeScript**: Full type safety so you know exactly what you're working with
- **🧹 ESLint**: Keeps your code clean and consistent
- **🎨 Tailwind CSS**: Utility-first CSS that makes styling a breeze

## 🚀 Deployment Ready

This frontend is built for Vercel deployment. The `next.config.js` includes API rewrites that work perfectly with Vercel's serverless functions.

## 🆘 When Things Go Sideways

1. **🔌 API Connection Issues**: Make sure your FastAPI backend is running on port 8000
2. **🌐 CORS Errors**: The backend is already configured to play nice with the frontend
3. **🔑 API Key Problems**: Double-check that your OpenAI API key is valid and has some credits left
4. **🔗 IPv6 Issues**: The frontend now explicitly uses IPv4 (127.0.0.1) to avoid connection problems

## 🤝 Contributing

Want to make this even better? Here's how:

1. Follow the existing code style (consistency is key!)
2. Add TypeScript types for new features (type safety is your friend)
3. Test on both light and dark modes (everyone has preferences!)
4. Make sure it works on mobile (because phones are everywhere)

---

**Happy coding! 🎉** May your AI conversations be enlightening and your code be bug-free!