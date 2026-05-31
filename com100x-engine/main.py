"""
Com100X Engine API Gateway
==========================
This module implements the FastAPI server hosting the Com100X prompt compression core.
It exposes endpoints for service health verification and prompt compression execution.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from compressor import Com100X

# Initialize the FastAPI application with metadata
app = FastAPI(
    title="Com100X Engine",
    description="API Gateway for LLMLingua-based prompt compression using the meetingbank model",
    version="1.0.0"
)

# Enable Cross-Origin Resource Sharing (CORS) to allow requests from the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits requests from any origin; restrict this in production environments
    allow_credentials=True,
    allow_methods=["*"],  # Permits all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Permits all HTTP headers
)

# Instantiate the Com100X compression engine (loads the model into CPU memory)
engine = Com100X()

class PromptRequest(BaseModel):
    """
    Data model representing a request to compress text.
    """
    text: str              # The raw text to compress
    target_ratio: float = 0.5  # Desired retention ratio (e.g. 0.5 means keep 50% of tokens)

@app.get("/health")
def health_check():
    """
    Service health check endpoint.
    Returns:
        dict: A status message indicating the service is online.
    """
    return {"status": "Com100X Engine is online"}

@app.post("/compress")
def compress_prompt(req: PromptRequest):
    """
    Compresses the input text to the requested target ratio.
    
    Args:
        req (PromptRequest): The input request containing the text and compression ratio.
        
    Returns:
        dict: The compression results containing compressed text and token metrics.
        
    Raises:
        HTTPException: 400 if input text is empty, 500 if the compression core fails.
    """
    if not req.text:
        raise HTTPException(status_code=400, detail="Text cannot be empty")
    
    # Run the compression engine core logic
    result = engine.compress(req.text, req.target_ratio)
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
        
    return result

if __name__ == "__main__":
    import uvicorn
    # Start the Uvicorn ASGI server to listen on all interfaces at port 8000
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
