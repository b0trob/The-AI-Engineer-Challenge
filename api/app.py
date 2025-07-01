from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from openai.types.chat import ChatCompletionMessageParam
import os
import uuid
import re
from typing import Optional, Dict, List
from datetime import datetime

app = FastAPI(title="Simple OpenAI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Session-ID", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
)

conversation_sessions: Dict[str, Dict] = {}

class ChatRequest(BaseModel):
    developer_message: str
    user_message: str
    model: Optional[str] = "gpt-4.1-mini"
    api_key: str
    session_id: Optional[str] = None

class SessionRequest(BaseModel):
    developer_message: str

class ApiKeyRequest(BaseModel):
    api_key: str

def create_session(developer_message: str) -> str:
    session_id = str(uuid.uuid4())
    conversation_sessions[session_id] = {
        "developer_message": developer_message,
        "messages": [],
        "created_at": datetime.now(),
        "last_updated": datetime.now()
    }
    return session_id

def get_conversation_history(session_id: str) -> List[ChatCompletionMessageParam]:
    if session_id not in conversation_sessions:
        return []
    
    session = conversation_sessions[session_id]
    messages: List[ChatCompletionMessageParam] = [{"role": "system", "content": session["developer_message"]}]
    
    for msg in session["messages"]:
        messages.append({"role": msg["role"], "content": msg["content"]})
        
    return messages

def add_message_to_history(session_id: str, role: str, content: str):
    if session_id in conversation_sessions:
        conversation_sessions[session_id]["messages"].append({
            "role": role,
            "content": content,
            "timestamp": datetime.now()
        })
        conversation_sessions[session_id]["last_updated"] = datetime.now()

@app.post("/api/chat")
async def chat(request: ChatRequest):
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



@app.post("/api/test-key")
async def test_api_key(request: ApiKeyRequest):
    if not re.match(r"^sk-proj-[A-Za-z0-9\-_]{156}$", request.api_key):
        raise HTTPException(
            status_code=400,
            detail="Invalid API Key format."
        )

    try:
        client = OpenAI(api_key=request.api_key)
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

@app.post("/api/sessions")
async def create_session_endpoint(request: SessionRequest):
    try:
        session_id = create_session(request.developer_message)
        return {
            "session_id": session_id,
            "message": "Session created successfully",
            "created_at": conversation_sessions[session_id]["created_at"].isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sessions/{session_id}")
async def get_session_info(session_id: str):
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

@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str):
    if session_id not in conversation_sessions:
        raise HTTPException(status_code=404, detail="Session not found")
    
    del conversation_sessions[session_id]
    return {"message": "Session deleted successfully"}

@app.get("/api/health")
async def health_check():
    return {
        "status": "ok",
        "active_sessions": len(conversation_sessions),
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    is_production = os.getenv("VERCEL") == "1"
    
    if is_production:
        uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))
    else:
        uvicorn.run(app, host="127.0.0.1", port=8000)
