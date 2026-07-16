import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

def load_knowledge_base():
    try:
        with open("knowledge_base.txt", "r", encoding="utf-8") as file:
            return file.read()
    except FileNotFoundError:
        return "GrowthsStack.Dev is an AI & Web agency."

# Load environment variables securely
load_dotenv()

app = FastAPI()

# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
model_name = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

session_memory = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    try:
        # Load dynamic knowledge
        kb_content = load_knowledge_base()
        
        system_prompt = f"""You are GrowthsStack AI, the official, friendly assistant for GrowthsStack.Dev.
        
        AGENCY INFO:
        {kb_content}
        
        CRITICAL LANGUAGE ISOLATION RULES:
        1. If the user types in ENGLISH (e.g., 'how are you', 'prices'), you MUST reply 100% in pure ENGLISH. Do not use a single word of Urdu.
        2. If the user types in ROMAN URDU (e.g., 'kasy ho', 'batao'), you MUST reply in very simple, natural, everyday Pakistani Roman Urdu. Keep sentences short. Example: "Main bilkul theek hoon! Aap batayen main aapki kya madad kar sakta hoon?"
        
        BANNED WORDS (NEVER USE THESE):
        - Dhanyavad, Kshamta, Prayaas, Vishesh, Namaste, Karyakram, Karya, Khed, Kash.
        - Instead use: Shukriya, Salam, Help, Masla, Koshish, Maazrat.
        
        TONE & FORMAT:
        - Be sweet, warm, and highly professional.
        - Keep answers short (1-2 sentences).
        - HANDLING FILLERS: If the user says something very short or casual (like "acha", "acha g", "hmm", "ok"), DO NOT be robotic. Acknowledge it naturally and sweetly (e.g., "Jee bilkul! Boliye main aapki kya madad kar sakta hoon?").
        - FORMATTING: NEVER use quotation marks ("") for emphasis. ALWAYS use Markdown bolding (**word**) for important keywords, project names, and links.
        - MEMORY AWARENESS: Always review the chat history provided to you before answering questions about past messages.
        - ALWAYS end with a natural follow-up question to keep the chat engaging.
        - NEVER type the literal word "Suggestions:". Just ask the question naturally at the end.
        
        EXAMPLES:
        User: "prices?"
        You: "Our pricing is custom-tailored based on your project's complexity and requirements. Would you like to book a free consultation call with our founder, Muhammad Talha, to get an exact quote?"
        
        User: "kya price hai?"
        You: "Humaray prices project ki complexity ke hisaab se custom hote hain. Kya aap Talha bhai ke sath ek free consultation call book karna chahenge taake exact quote mil sake?"
        """
        
        history = session_memory.get(req.session_id, [
            {"role": "system", "content": system_prompt}
        ])
        
        history.append({"role": "user", "content": req.message})
        
        response = client.chat.completions.create(
            model=model_name,
            messages=history,
            max_tokens=250
        )
        
        reply = response.choices[0].message.content
        history.append({"role": "assistant", "content": reply})
        session_memory[req.session_id] = history
        
        return {"reply": reply}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
