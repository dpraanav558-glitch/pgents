# Chrome Extension Bridge: User Guide & Setup Instructions

The Chrome Extension Bridge allows you to run Pgents in **Zero-API Mode** (fully free). It routes your dashboard queries securely to your logged-in consumer account on `https://gemini.google.com`, types the prompt, hits submit, waits for the response, and streams it back to the dashboard!

---

## 🛠️ Step 1: Install the Extension in Google Chrome

1. Open your Google Chrome browser.
2. In the URL bar, go to `chrome://extensions/`.
3. In the top right corner, toggle **Developer mode** to **ON**.
4. In the top left corner, click the **Load unpacked** button.
5. In the file explorer, navigate to your project directory: `d:\Desktop\Projec 1 AG\extension` and select the **`extension`** folder itself.
6. The extension **"Pgents Browser Bridge"** will appear in your Chrome extensions list!

---

## 🚀 Step 2: Connect the Bridge

To use the bridge connection:

1. **Open Gemini**: Open a new tab in Chrome and go to [https://gemini.google.com/](https://gemini.google.com/). 
   * Make sure you are logged into your standard Google email account and the chat interface is visible.
2. **Open Pgents**: In another tab, open your local Pgents Dashboard (`http://localhost:3000/`).
3. **Toggle Bridge**: In the top navigation bar of Pgents, locate the **Bridge** switch (next to the theme palette button) and toggle it to **ON**.
4. **Choose Google Gemini**: Ensure your active AI Provider in the sidebar is set to **Google Gemini**.

---

## 💡 Step 3: Prompting in Action

Now, write a prompt in Pgents or run a test skill and hit **Send**. Under the hood, here is what happens:
1. Pgents sends a window message to the bridge content script.
2. The background script routes the request to your open `gemini.google.com` tab.
3. The bridge script on Gemini types the prompt, clicks send, and watches the page.
4. As Gemini responds, the text is captured in real-time and streamed back to Pgents!

> [!NOTE]
> Keep the `gemini.google.com` tab open in the background while using Bridge Mode. If you close it, the bridge will disconnect and your queries will fail.
