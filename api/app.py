# Import required FastAPI components for building the API
from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
# Import Pydantic for data validation and settings management
from pydantic import BaseModel
# Import OpenAI client for interacting with OpenAI's API
from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam
import os
import uuid
import re
from typing import Optional, Dict, List, Literal, TypedDict
from datetime import datetime

# Define a TypedDict for message structure for type safety
class Message(TypedDict):
    role: Literal["system", "user", "assistant"]
    content: str

# Initialize FastAPI application with a title
app = FastAPI(title="OpenAI Chat API")

# Configure CORS (Cross-Origin Resource Sharing) middleware
# This allows the API to be accessed from different domains/origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows requests from any origin
    allow_credentials=True,  # Allows cookies to be included in requests
    allow_methods=["*"],  # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers in requests
    expose_headers=["X-Session-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],  # Expose custom headers
)

# In-memory storage for conversation sessions
# In a production environment, this should be replaced with a proper database
conversation_sessions: Dict[str, Dict] = {}

# Define the data model for chat requests using Pydantic
# This ensures incoming request data is properly validated
class ChatRequest(BaseModel):
    developer_message: str  # Message from the developer/system
    user_message: str      # Message from the user
    model: Optional[str] = "gpt-4.1-mini"  # Optional model selection with default
    api_key: str          # OpenAI API key for authentication
    session_id: Optional[str] = None  # Optional session ID for conversation continuity

# Define the data model for session creation
class SessionRequest(BaseModel):
    developer_message: str  # Initial system message for the session

# Define the data model for session deletion
class SessionDeleteRequest(BaseModel):
    session_id: str

# Helper function to create a new conversation session
def create_session(developer_message: str) -> str:
    """Create a new conversation session with the given developer message."""
    session_id = str(uuid.uuid4())
    conversation_sessions[session_id] = {
        "developer_message": developer_message,
        "messages": [],
        "created_at": datetime.now(),
        "last_updated": datetime.now()
    }
    return session_id

# Helper function to get conversation history for a session
def get_conversation_history(session_id: str) -> List[ChatCompletionMessageParam]:
    """Get the conversation history for a given session, formatted for the OpenAI API."""
    if session_id not in conversation_sessions:
        return []
    
    session = conversation_sessions[session_id]
    # Start with the developer message as system message
    messages: List[ChatCompletionMessageParam] = [{"role": "system", "content": session["developer_message"]}]
    
    # Add all previous messages in the conversation, formatting them correctly
    for msg in session["messages"]:
        # The type assertion is needed here because my stored dict is less specific
        # than the ChatCompletionMessageParam. This is safe because I control the structure.
        messages.append({"role": msg["role"], "content": msg["content"]})
        
    return messages

# Helper function to add a message to the conversation history
def add_message_to_history(session_id: str, role: str, content: str):
    """Add a message to the conversation history for a given session."""
    if session_id in conversation_sessions:
        conversation_sessions[session_id]["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now()
        })
        conversation_sessions[session_id]["last_updated"] = datetime.now()

# Define the main chat endpoint that handles POST requests
@app.post("/api/chat")
async def chat(request: ChatRequest):
    # --- API Key Validation ---
    if not re.match(r"^sk-proj-[A-Za-z0-9\-_]{156}$", request.api_key):
        raise HTTPException(
            status_code=400,
            detail="Invalid API Key format. The key should start with 'sk-proj-' and be 164 characters long."
        )
        
    try:
        client = OpenAI(api_key=request.api_key)
        
        session_id = request.session_id
        if not session_id or session_id not in conversation_sessions:
            session_id = create_session(request.developer_message)
            
        add_message_to_history(session_id, "user", request.user_message)
        
        messages_for_api = get_conversation_history(session_id)

        api_response = client.chat.completions.with_raw_response.create(
            model=request.model or "gpt-4.1-mini",
            messages=messages_for_api,
            stream=True
        )

        limit_requests = api_response.headers.get("x-ratelimit-limit-requests")
        remaining_requests = api_response.headers.get("x-ratelimit-remaining-requests")
        
        async def generate():
            try:
                assistant_response = ""
                for chunk in api_response.parse():
                    if chunk.choices[0].delta.content is not None:
                        content = chunk.choices[0].delta.content
                        assistant_response += content
                        yield content
                add_message_to_history(session_id, "assistant", assistant_response)
            except Exception as e:
                error_msg = f"Error during streaming: {str(e)}"
                yield error_msg

        response = StreamingResponse(generate(), media_type="text/plain")
        
        if limit_requests:
            response.headers["X-RateLimit-Limit"] = limit_requests
        if remaining_requests:
            response.headers["X-RateLimit-Remaining"] = remaining_requests
            
        response.headers["X-Session-ID"] = session_id
        return response
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- New Endpoint for API Usage ---
class ApiKeyRequest(BaseModel):
    api_key: str

# --- Simple API Key Test Endpoint ---
@app.post("/api/test-key")
async def test_api_key(request: ApiKeyRequest):
    """
    Simple endpoint to test if an API key is valid without making expensive calls.
    """
    if not re.match(r"^sk-proj-[A-Za-z0-9\-_]{156}$", request.api_key):
        raise HTTPException(
            status_code=400,
            detail="Invalid API Key format."
        )

    try:
        client = OpenAI(api_key=request.api_key)
        # Just try to list models - this is usually the cheapest call
        models = client.models.list()
        return {"valid": True, "message": f"API key is valid. Found {len(models.data)} models."}
    except Exception as e:
        error_msg = str(e)
        if "authentication" in error_msg.lower() or "401" in error_msg:
            return {"valid": False, "message": "Authentication failed. Please check your API key."}
        elif "permission" in error_msg.lower() or "403" in error_msg:
            return {"valid": False, "message": "Permission denied. Your API key may not have the required permissions."}
        else:
            return {"valid": False, "message": f"API key test failed: {error_msg}"}

# Endpoint to create a new conversation session
@app.post("/api/sessions")
async def create_session_endpoint(request: SessionRequest):
    """Create a new conversation session."""
    try:
        session_id = create_session(request.developer_message)
        return {
            "session_id": session_id,
            "message": "Session created successfully",
            "created_at": conversation_sessions[session_id]["created_at"].isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Endpoint to get session information
@app.get("/api/sessions/{session_id}")
async def get_session_info(session_id: str):
    """Get information about a specific session."""
    if session_id not in conversation_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    session = conversation_sessions[session_id]
    return {
        "session_id": session_id,
        "developer_message": session["developer_message"],
        "message_count": len(session["messages"]),
        "created_at": session["created_at"].isoformat(),
        "last_updated": session["last_updated"].isoformat()
    }

# Endpoint to delete a session
@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    """Delete a conversation session."""
    if session_id not in conversation_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    del conversation_sessions[session_id]
    return {"message": "Session deleted successfully"}

# Endpoint to list all active sessions
# @app.get("/api/sessions")
# async def list_sessions():
#     """List all active conversation sessions."""
#     sessions = []
#     for session_id, session_data in conversation_sessions.items():
#         sessions.append({
#             "session_id": session_id,
#             "developer_message": session_data["developer_message"],
#             "message_count": len(session_data["messages"]),
#             "created_at": session_data["created_at"].isoformat(),
#             "last_updated": session_data["last_updated"].isoformat()
#         })
    
#     return {"sessions": sessions}

# Endpoint to clear all sessions
# @app.delete("/api/sessions")
# async def clear_all_sessions():
#     """Clear all conversation sessions."""
#     global conversation_sessions
#     session_count = len(conversation_sessions)
#     conversation_sessions.clear()
#     return {"message": f"Cleared {session_count} sessions"}

# Define a health check endpoint to verify API status
@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "active_sessions": len(conversation_sessions),
        "timestamp": datetime.now().isoformat()
    }

# Entry point for running the application directly
if __name__ == "__main__":
    import uvicorn
    # Check if we're in production (Vercel sets VERCEL environment variable)
    is_production = os.getenv("VERCEL") == "1"
    
    if is_production:
        # In production (Vercel), bind to 0.0.0.0 to accept external connections
        uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
    else:
        # In development, bind to localhost only (127.0.0.1) for security
        uvicorn.run(app, host="127.0.0.1", port=8000)
