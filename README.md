# Pgents: Advanced AI Orchestration Dashboard

Pgents is a high-performance, multi-model React dashboard designed to orchestrate LLM workflows, manage complex system prompts (Skills), and reduce token costs through a custom hybrid compression engine. 

## 🚀 Key Features

### 1. Multi-Model BYOK Architecture
Pgents operates on a **Bring Your Own Key (BYOK)** architecture, allowing you to instantly switch between the industry's top models from a unified interface:
- **Google Gemini** (2.5 Flash, 2.5 Pro)
- **OpenAI** (GPT-4o, GPT-4 Turbo, o1-Mini)
- **Anthropic Claude** (3.5 Sonnet, 3 Opus)
- **Groq** (Llama 3, Mixtral)
- **Custom / Local** (Ollama, LM Studio)

### 2. Chrome Extension Bridge (Zero-API Mode)
Don't want to pay for API keys? Pgents includes a custom **Browser Extension Bridge**. When "Bridge Mode" is enabled, the dashboard securely routes your prompts directly to a standard `gemini.google.com` tab. 
- The extension automatically types your prompt, hits send, waits for the response, and pipes it back into your dashboard. 
- You get the full power of the Pgents UI and Skill system using your free consumer Google account.

### 3. Com100X Prompt Compression Engine
For complex tasks, system directives can consume thousands of tokens. Pgents standardizes on the **Com100X (FastAPI / LLMLingua-2)** semantic prompt compression engine. 
- It communicates with a local Python microservice running the XLM-RoBERTa meetingbank model.
- It semantically prunes low-information words from the prompt while preserving original intent and directives, saving up to 60% of context tokens and cutting down on API latency and costs.
- If the Com100X microservice is offline, the client automatically falls back to raw directives transparently.

### 4. Deterministic AI Skill Library
The platform comes pre-loaded with 10 highly engineered "Skills" designed to force smaller models to output high-tier deterministic results:
- **Vapor-Slide Deck Builder:** Turns raw data into structured markdown slide decks with speaker notes.
- **SWOT Strategic Deep-Dive:** Generates systematic competitive SWOT frameworks.
- **Enterprise Spec-Doc Engine:** Produces rigorously detailed system architecture docs and API contracts.
- **Code Review Compiler:** Outputs multi-axis reviews (readability, security, performance) with a graded scorecard.
- **API Integration Synthesizer:** Converts API schemas into SDK client boilerplates in Python, Node, and Go.
- **SEO Semantic Optimizer:** Optimizes copy drafts matching exact keyword density ratios.
- **Database Schema Architect:** Translates system designs into index-optimized SQL/NoSQL schemas.
- **Data Pipeline Synthesizer:** Generates Pandas data pipelines and profiling visuals.
- **Security Hardening Compiler:** Exploits audit checklists, patch diff compiles, and container hardening.
- **UX Copywriter & Tone Tuner:** Tuning alerts and microcopy to Brand voices (Professional, Playful, Emergency).

### 5. Native Markdown & Streaming
- **Server-Sent Events (SSE):** True real-time token streaming for a fluid user experience.
- **Rich Markdown Engine:** Natively parses and renders markdown, tables, and fenced code blocks without relying on heavy external markdown libraries.

---

## 🛠️ Installation & Setup

### Running the Dashboard
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your browser.

### Running the Com100X Compression Microservice
To use the FastAPI-based semantic compression engine:
1. Navigate to the engine folder:
   ```bash
   cd com100x-engine
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI API:
   ```bash
   python main.py
   ```
   *(Ensure Docker is used if running containerized: `docker build -t com100x . && docker run -p 8000:8000 com100x`)*

### Installing the Chrome Extension Bridge
To use the free Zero-API Bridge Mode:
1. Open Google Chrome and navigate to `chrome://extensions/`.
2. Turn on **Developer mode** in the top right corner.
3. Click **Load unpacked** and select the `extension/` folder located in this repository.
4. Keep `https://gemini.google.com/` open in one tab, and the Pgents Dashboard open in another. Toggle "Bridge" on in the dashboard navbar!

---

## 🏗️ Tech Stack
- **Frontend Framework:** React 18 + Vite
- **Styling:** Tailwind CSS + Vanilla CSS (Custom Glassmorphism & Animations)
- **Icons:** Lucide React
- **Backend / Auth:** Firebase (Firestore + Anonymous Auth)

## 📝 License
Proprietary / Closed Source. Developed for advanced agentic coding workflows.
