@echo off
set GIT="C:\Program Files\Git\cmd\git.exe"

%GIT% init
%GIT% config user.name "dpraanav558-glitch"
%GIT% config user.email "dpraanav558@github.com"
%GIT% add .
%GIT% commit -m "feat: Pgents AI Dashboard — full release

- Multi-provider AI chat (Gemini, Claude, GPT, Grok, Mistral, DeepSeek)
- Com100X semantic compression engine (XLM-RoBERTa MeetingBank)
- Pgents Browser Bridge extension for zero-API mode
- Role-based auth (Admin / Member)
- 10 AI agent personas with system prompts
- Light/dark theme with design token system
- Conversation export (MD/TXT/JSON)
- Real-time token streaming with tool-use support
- Settings panel: API keys, appearance, admin, bridge docs"

echo COMMIT_DONE
