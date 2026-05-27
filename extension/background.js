// extension/background.js
console.log("Antigravity Bridge Background Worker Started");

// Keep track of the active dashboard tab and gemini tab
let dashboardTabId = null;
let geminiTabId = null;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background received message:", message);

  if (message.type === 'FROM_DASHBOARD') {
    // Record the dashboard tab ID so we know where to send responses back
    dashboardTabId = sender.tab.id;
    console.log("Registered dashboard tab:", dashboardTabId);

    // Find the Gemini tab and forward the message
    chrome.tabs.query({ url: "*://gemini.google.com/*" }, (tabs) => {
      if (tabs.length > 0) {
        geminiTabId = tabs[0].id;
        console.log("Forwarding to Gemini tab:", geminiTabId);
        chrome.tabs.sendMessage(geminiTabId, {
          type: 'EXECUTE_PROMPT',
          prompt: message.prompt
        });
      } else {
        console.error("No Gemini tab found. Please open gemini.google.com");
        // Optional: send error back to dashboard
        chrome.tabs.sendMessage(dashboardTabId, {
          type: 'EXTENSION_ERROR',
          error: 'Gemini tab not found. Please open gemini.google.com in a new tab.'
        });
      }
    });
  }

  if (message.type === 'FROM_GEMINI') {
    // Forward the response back to the dashboard tab
    if (dashboardTabId) {
      console.log("Forwarding response to dashboard tab:", dashboardTabId);
      chrome.tabs.sendMessage(dashboardTabId, {
        type: 'GEMINI_RESPONSE',
        response: message.response
      });
    } else {
      console.error("Received response from Gemini but no dashboard tab registered.");
    }
  }

  // Return true to indicate you wish to send a response asynchronously (if needed)
  return true;
});
