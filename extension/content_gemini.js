// extension/content_gemini.js
console.log("Antigravity Bridge: Gemini Content Script Injected");

let isGenerating = false;
let currentPrompt = "";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'EXECUTE_PROMPT') {
    console.log("Gemini Content Script received prompt:", message.prompt);
    currentPrompt = message.prompt;
    executePromptInGemini(message.prompt);
  }
});

async function executePromptInGemini(promptText) {
  // 1. Find the input box
  // Gemini typically uses a rich text editor element.
  const inputBox = document.querySelector('div[contenteditable="true"]') || document.querySelector('.ql-editor');
  
  if (!inputBox) {
    console.error("Could not find Gemini input box.");
    chrome.runtime.sendMessage({ type: 'FROM_GEMINI', response: 'Error: Could not find Gemini input box.' });
    return;
  }

  // Focus and clear existing text
  inputBox.focus();
  inputBox.innerHTML = '';
  
  // Insert the prompt text. For contenteditable, document.execCommand is often best to trigger internal event listeners
  document.execCommand('insertText', false, promptText);
  
  // Give it a small delay to let React/Angular event listeners catch up
  await new Promise(r => setTimeout(r, 500));

  // 2. Find and click the Submit button
  // The send button usually has an aria-label like "Send message" or similar SVG icon
  const buttons = Array.from(document.querySelectorAll('button'));
  let sendButton = buttons.find(b => 
    b.getAttribute('aria-label')?.toLowerCase().includes('send') || 
    b.innerHTML.includes('send') ||
    (b.querySelector('svg') && b.getAttribute('mattooltip')?.toLowerCase().includes('send'))
  );

  if (!sendButton) {
     // Fallback: try pressing Enter if no button found
     const enterEvent = new KeyboardEvent('keydown', {
        bubbles: true, cancelable: true, keyCode: 13, key: 'Enter'
     });
     inputBox.dispatchEvent(enterEvent);
  } else {
     sendButton.click();
  }

  isGenerating = true;
  console.log("Prompt sent. Waiting for generation to complete...");

  // 3. Wait for the response to finish
  waitForGenerationToComplete();
}

function waitForGenerationToComplete() {
  // We can determine generation is complete when the "Stop generating" button disappears
  // or the "Send" button becomes active again.
  // A simple heuristic: Wait a few seconds, then check if DOM mutations settle.
  
  let observer;
  let timeoutId;

  const getLatestResponse = () => {
    // Gemini wraps responses in specific model classes. Usually the last one is the latest.
    // Try common selectors for Gemini
    const responseBlocks = document.querySelectorAll('message-content, .model-response-text, .response-content');
    if (responseBlocks.length > 0) {
      const latestBlock = responseBlocks[responseBlocks.length - 1];
      return latestBlock.innerText;
    }
    return "Response extraction failed: Could not find response block.";
  };

  const checkDone = () => {
    // If the send button is disabled, or a "stop" button is present, it's still generating
    const buttons = Array.from(document.querySelectorAll('button'));
    const isStopPresent = buttons.some(b => b.getAttribute('aria-label')?.toLowerCase().includes('stop'));
    
    if (!isStopPresent) {
      // Looks like it's done!
      console.log("Generation complete!");
      observer.disconnect();
      
      const finalResponse = getLatestResponse();
      chrome.runtime.sendMessage({
        type: 'FROM_GEMINI',
        response: finalResponse
      });
      isGenerating = false;
    } else {
      // Still generating, wait and check again
      setTimeout(checkDone, 1000);
    }
  };

  // Start polling
  setTimeout(checkDone, 2000); // Initial wait
}
