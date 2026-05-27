from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from compressor import Com100X

app = FastAPI(title="Com100X Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize compression engine
engine = Com100X()

class PromptRequest(BaseModel):
    text: str
    target_ratio: float = 0.5

@app.get("/health")
def health_check():
    return {"status": "Com100X Engine is online"}

@app.post("/compress")
def compress_prompt(req: PromptRequest):
    if not req.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    result = engine.compress(req.text, req.target_ratio)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
