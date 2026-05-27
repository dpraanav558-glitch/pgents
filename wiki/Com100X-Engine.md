# Com100X Prompt Compression Engine

The **Com100X Engine** is a FastAPI-based microservice that leverages `llmlingua-2` (specifically `microsoft/llmlingua-2-xlm-roberta-large-meetingbank`) to perform semantic prompt compression. It removes low-information words while fully preserving the prompt's intent, constraints, and instructions, allowing you to save up to 60% of your LLM tokens.

## 🛠️ Installation & Setup

1. **Navigate to the engine directory:**
   ```bash
   cd com100x-engine
   ```
2. **Create a virtual environment:**
   ```bash
   python -m venv .venv
   ```
3. **Activate the environment:**
   - **Windows (PowerShell):**
     ```powershell
     .\.venv\Scripts\Activate.ps1
     ```
   - **Windows (cmd):**
     ```cmd
     .\.venv\Scripts\activate.bat
     ```
   - **macOS/Linux:**
     ```bash
     source .venv/bin/activate
     ```
4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
5. **Run the microservice:**
   ```bash
   python main.py
   ```
   The engine will initialize the model (first run download takes ~1.5GB) and listen on `http://localhost:8000`.

---

## ⚡ CPU Performance & device_map Patch

By default, recent versions of the Hugging Face `transformers` library require the `accelerate` package when using the `device_map` parameter, even if targeting the CPU. 

To prevent errors on CPU-only machines, the dependency was patched inside `.venv/Lib/site-packages/llmlingua/prompt_compressor.py` by removing the `device_map` argument when CPU target is specified and manually placing the model on CPU:

```python
if "cpu" in device_map:
    # Load without device_map to avoid accelerate check
    model = MODEL_CLASS.from_pretrained(
        model_name,
        **model_config
    ).to("cpu")
```

This optimization allows the microservice to run smoothly on any laptop without needing a dedicated GPU or CUDA setup.

---

## 📡 API Endpoints

### 1. Health Check
- **Endpoint:** `GET /health`
- **Response:**
  ```json
  {
    "status": "Com100X Engine is online"
  }
  ```

### 2. Compress Prompt
- **Endpoint:** `POST /compress`
- **Request Body:**
  ```json
  {
    "text": "Your long prompt here...",
    "target_ratio": 0.5
  }
  ```
- **Response:**
  ```json
  {
    "compressed_text": "Your compressed prompt...",
    "original_tokens": 120,
    "compressed_tokens": 60,
    "saved_ratio": "2.0x"
  }
  ```
