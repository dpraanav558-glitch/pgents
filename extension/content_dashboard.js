// extension/content_dashboard.js
console.log("Antigravity Bridge: Dashboard Content Script Injected");

// Listen for messages from the React app (window context)
window.addEventListener("message", (event) => {
  // We only accept messages from ourselves
  if (event.source !== window) return;

  if (event.data && event.data.type === "SEND_PROMPT_TO_EXTENSION") {
    console.log("Dashboard Content Script received prompt from React:", event.data.payload);
    
    // Forward to the background script
    chrome.runtime.sendMessage({
      type: "FROM_DASHBOARD",
      prompt: event.data.payload
    });
  }
});

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GEMINI_RESPONSE") {
    console.log("Dashboard Content Script received response from Gemini:", message.response);
    
    // Forward to the React app (window context)
    window.postMessage({
      type: "EXTENSION_RESPONSE",
      payload: message.response
    }, "*");
  }
  
  if (message.type === "EXTENSION_ERROR") {
    console.error("Extension Error:", message.error);
    window.postMessage({
      type: "EXTENSION_ERROR",
      payload: message.error
    }, "*");
  }
});
