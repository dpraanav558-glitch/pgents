# Troubleshooting and FAQ

Here are answers to the most common questions and issues encountered when deploying or running the Pgents dashboard ecosystem.

---

## 🔌 Port Collisions & Connection Issues

### Issue: "Address already in use" on Port 8000
If you run `python main.py` inside `com100x-engine` and see a port error, it means another process (like a local server, database, or tool) is already using port 8000.
* **Solution (Change microservice port):**
  Open [com100x-engine/main.py](file:///D:/Desktop/Antigravity/Projec%201%20AG/com100x-engine/main.py) and change the port in the final block:
  ```python
  if __name__ == "__main__":
      uvicorn.run(app, host="0.0.0.0", port=8001) # Change to 8001
  ```
  Then, update the endpoint configuration in the React frontend:
  Open [src/App.jsx](file:///D:/Desktop/Antigravity/Projec%201%20AG/src/App.jsx) and change the compression URL endpoint value to match.

---

## 🗜️ Com100X Offline Fallback

### Question: "What happens if the Com100X microservice is offline?"
If the fastapi server is offline, the React dashboard handles it gracefully. 
* **Behavior:** The client-side application detects a connection failure, prints a warning in the console, and automatically falls back to sending the **raw uncompressed prompt** to the LLM. 
* **User Impact:** Your request will complete successfully without errors, though it will consume the standard token amount.

---

## 🌐 Chrome Extension Bridge Troubleshooting

### Issue: "Bridge Toggle is active, but response is stuck"
Ensure the following:
1. You have a tab open to `https://gemini.google.com/` and you are logged in.
2. The Gemini UI is not currently generating a response (if it is, refresh it).
3. Check the developer console of the background script in `chrome://extensions/` for any permission blocks or injection warnings.

---

## 🔑 Environment Secrets (BYOK Mode)

### Question: "Where are my API keys stored?"
Pgents is a Bring-Your-Own-Key (BYOK) app. All keys (OpenAI, Gemini, Anthropic, etc.) entered in the **Settings panel** are stored entirely in your local browser's **Local Storage**. 
* They are never sent to any backend database.
* They are transmitted directly from your browser to the respective model provider API endpoints.
* To clear them, simply click "Clear Settings" or clear your browser site data.
