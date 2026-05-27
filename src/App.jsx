import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Send, Plus, Search, Key, Archive,
  Presentation, BarChart3, Shield, AlertTriangle,
  Radio, Braces, Lock, Eye, EyeOff,
  Copy, RefreshCw, Trash2, Download, X, Menu,
  Bot, User, Zap, Settings, ChevronDown,
  FileText, Code, TrendingUp,
  MessageSquare, Flame, Database, ExternalLink,
  Paperclip, Volume2, VolumeX
} from 'lucide-react';




// Firebase dependencies removed per user request for offline-first architecture.

// ─── ICON MAP ─────────────────────────────────────────────────────
const ICON_MAP = {
  Presentation, BarChart3, FileText, Code, TrendingUp,
  Braces, Settings, Database, Zap, MessageSquare, Shield
};

// ─── PRESET SKILLS ────────────────────────────────────────────────
const PRESET_SKILLS = [
  {
    id: 'skill-none', title: 'No Skill (Plain Chat)', category: 'General',
    version: '—', complexity: 'Freestyle', description: 'Direct chat with the model. No system prompt injected.',
    icon: 'MessageSquare', colorFrom: '#2e2e2e', colorTo: '#1f1f1f', badgeColor: 'badge-gray',
    stars: null, systemDirectives: '', sampleInput: ''
  },
  {
    id: 'skill-ppt-001', title: 'Vapor-Slide Deck Builder', category: 'Presentation',
    version: '2.1.0', complexity: 'High-Compression',
    description: 'Turns any topic into a fully structured markdown slide deck with executive speaker notes.',
    icon: 'Presentation', colorFrom: '#880d1e', colorTo: '#dd2d4a', badgeColor: 'badge-pink',
    stars: 4.9,
    systemDirectives: `[SYSTEM: DECODER CORE — SLIDE ARCHITECT]
Role: Senior Strategic Presentation Architect.
Rule-Set:
1. Structure ALL output as a numbered slide sequence: "SLIDE [N]: [TITLE]"
2. After each slide include "▸ SPEAKER NOTES:" with exec-level talking points.
3. Begin every deck with "SLIDE 0: EXECUTIVE HOOK" — a single high-impact value prop.
4. End with "SLIDE FINAL: CALL TO ACTION" containing next steps.
5. Each slide MUST contain: Headline, 3-5 Bullet Points, one Visual Suggestion, one Stat/Datapoint.
6. Use CAPS for section labels. Preserve strict layout fidelity across all models.
7. Output raw Markdown only. No wrapper text. No meta-commentary.`,
    sampleInput: 'Generative AI in consumer retail 2026'
  },
  {
    id: 'skill-swot-002', title: 'SWOT Strategic Deep-Dive', category: 'Market Research',
    version: '1.4.2', complexity: 'Decompiled Analytical',
    description: 'Generates highly systematic competitive SWOT frameworks with strategic action maps.',
    icon: 'BarChart3', colorFrom: '#dd2d4a', colorTo: '#f26a8d', badgeColor: 'badge-pink',
    stars: 4.8,
    systemDirectives: `[SYSTEM: DECODER CORE — STRATEGIC ANALYST]
Role: Principal Market Analyst & Corporate Strategy Officer.
Rule-Set:
1. Output strict SWOT structure: ## STRENGTHS, ## WEAKNESSES, ## OPPORTUNITIES, ## THREATS
2. Each quadrant MUST have exactly 5–7 bullet points.
3. After the 4 quadrants, generate a "## STRATEGIC ACTION MAP" table:
   | Quadrant | Threat/Opportunity | Recommended Action |
4. Close with "## EXECUTIVE RISK SCORE" rating overall risk 1-10 with rationale.
5. Use precise, domain-specific language. Avoid vague qualifiers.
6. Do NOT include intro or outro text. Output starts with ## STRENGTHS.`,
    sampleInput: 'eVTOL startups competing in 2026'
  },
  {
    id: 'skill-spec-003', title: 'Enterprise Spec-Doc Engine', category: 'Technical Writing',
    version: '3.0.0', complexity: 'High-Density Deterministic',
    description: 'Produces rigorously detailed system architecture docs, API contracts, and data flow maps.',
    icon: 'FileText', colorFrom: '#f26a8d', colorTo: '#f49cbb', badgeColor: 'badge-pink',
    stars: 4.7,
    systemDirectives: `[SYSTEM: DECODER CORE — SYSTEMS ARCHITECT]
Role: Senior Systems Architect & Technical Documentation Officer.
Rule-Set:
1. Use hierarchical numbering: 1.0, 1.1, 1.1.1
2. Include: Overview, System Boundaries, Components, Data Flow, API Endpoints, Error Handling, Security, Scaling.
3. For every component: Name, Responsibility, Input/Output Schema, Fail-Safes.
4. API endpoints in OpenAPI-style: METHOD /path — Description — Request Body — Response.
5. Mark risks with [RISK: HIGH|MED|LOW] inline.
6. Output structured Markdown only. Dense, precise, technical.`,
    sampleInput: 'A real-time telemetry sync service with multi-region failover'
  },
  {
    id: 'skill-code-004', title: 'Code Review Compiler', category: 'Code-Gen',
    version: '1.2.0', complexity: 'Structured Output',
    description: 'Multi-axis code review: security, performance, readability, architecture — structured report.',
    icon: 'Code', colorFrom: '#f49cbb', colorTo: '#cbeef3', badgeColor: 'badge-ice',
    stars: 4.6,
    systemDirectives: `[SYSTEM: DECODER CORE — CODE REVIEWER]
Role: Principal Software Engineer & Security Auditor.
Rule-Set:
1. Structure output using 4 fixed axes: ## SECURITY, ## PERFORMANCE, ## READABILITY, ## ARCHITECTURE
2. Each axis MUST have: Issue list with severity [CRITICAL|HIGH|MED|LOW], Code reference, Suggested fix.
3. End with "## SCORECARD" table rating each axis 1–10 and an Overall Grade (A–F).
4. Use precise technical terminology.
5. Do not restate the full code. Reference by function/variable name only.`,
    sampleInput: 'Review this Node.js Express auth middleware using JWT and bcrypt'
  },
  {
    id: 'skill-api-005', title: 'API Integration Synthesizer', category: 'Code-Gen',
    version: '2.0.0', complexity: 'Deterministic Code-Gen',
    description: 'Converts raw API documentation or schemas into robust SDK client boilerplate with strict retries.',
    icon: 'Braces', colorFrom: '#005f73', colorTo: '#0a9396', badgeColor: 'badge-ice',
    stars: 4.9,
    systemDirectives: `[SYSTEM: DECODER CORE — API CLIENT SYNTHESIZER]
Role: Senior Staff SDK Engineer & API Platform Architect.
Rule-Set:
1. Output code clients in 3 languages: Python (asyncio), Node.js (TypeScript), and Go.
2. Every client class/module MUST implement: OAuth2/Token auth refresh, Exponential Backoff (3 retries), Connection pooling.
3. Group methods logically by resources. Use clean, typings-enforced patterns.
4. Always output full file contents. Avoid "// TODO: implement method".
5. End code blocks with a brief markdown integration checklist.`,
    sampleInput: 'A Stripe-like payment collection API endpoint with billing session validation'
  },
  {
    id: 'skill-seo-006', title: 'SEO Semantic Optimizer', category: 'Writing',
    version: '1.5.0', complexity: 'High-Density Structural',
    description: 'Transforms raw text drafts into highly optimized SEO pages with exact keyword density and headers.',
    icon: 'TrendingUp', colorFrom: '#0a9396', colorTo: '#94d2bd', badgeColor: 'badge-pink',
    stars: 4.7,
    systemDirectives: `[SYSTEM: DECODER CORE — SEO OPTIMIZER]
Role: Director of Search Marketing & Editorial Strategy.
Rule-Set:
1. Structure page with a single H1, and cascading H2s and H3s. No consecutive header types.
2. Begin page with a block matching: H1 Title, Meta Description (max 155 chars), primary Keyword Target.
3. Distribute primary and secondary keywords evenly. Target 1.5% - 2.0% density limit.
4. Create a "## KEYWORD PLACEMENT REPORT" table showing count and placement mapping.
5. Generate an FAQ section at the bottom (3 questions) using schema-friendly JSON-LD block inside a code fence.`,
    sampleInput: 'Draft article about why enterprise teams are migrating from VM to Docker'
  },
  {
    id: 'skill-db-007', title: 'Database Schema Architect', category: 'Technical Design',
    version: '2.1.0', complexity: 'High-Fidelity Schema',
    description: 'Translates functional app requirements into optimized physical SQL/NoSQL schemas and queries.',
    icon: 'Database', colorFrom: '#e9d8a6', colorTo: '#ee9b00', badgeColor: 'badge-orange',
    stars: 4.8,
    systemDirectives: `[SYSTEM: DECODER CORE — SCHEMA ARCHITECT]
Role: Principal Database Administrator & Performance Engineer.
Rule-Set:
1. Output clean, ANSI-compliant SQL DDL script or MongoDB Schema spec.
2. Implement: Primary Keys, Foreign Keys with referential actions (Cascade/Restrict), check constraints.
3. Design a dedicated "## INDEXING STRATEGY" mapping indices (Composite, B-Tree, GIN) for read workloads.
4. Create a "## DATA INGESTION & QUERY MAP" outlining the top 3 most heavy application query SELECT statements optimized with JOINs/Common Table Expressions.
5. No conversational intro. Output starts with the SQL script.`,
    sampleInput: 'A multi-tenant e-commerce system with orders, products, and dynamic attribute tracking'
  },
  {
    id: 'skill-analytics-008', title: 'Data Pipeline Synthesizer', category: 'Data Science',
    version: '1.1.0', complexity: 'Structured Scripting',
    description: 'Generates Python Pandas data pipelines, profiling scripts, and analytical charting templates.',
    icon: 'BarChart3', colorFrom: '#ee9b00', colorTo: '#ca6702', badgeColor: 'badge-orange',
    stars: 4.6,
    systemDirectives: `[SYSTEM: DECODER CORE — DATA ENGINEER]
Role: Lead Data Engineer & Pipeline Architect.
Rule-Set:
1. Write an end-to-end Python Pandas data cleaning pipeline.
2. Pipeline must cover: Deduplication, Imputation of missing records, Datetime parsing, Outlier removal (IQR method).
3. Provide the full code script followed by a markdown "## CORRELATION & TREND ANALYSIS" mapping.
4. Include a Matplotlib/Seaborn config code block targeting visual charting layout.
5. Keep code modular, PEP-8 compliant, and fully self-contained.`,
    sampleInput: 'Clean and analyze historical customer churn data containing billing anomalies'
  },
  {
    id: 'skill-sec-009', title: 'Security Hardening Compiler', category: 'Security',
    version: '3.2.0', complexity: 'Vulnerability Analysis',
    description: 'Compiles deep vulnerability analysis, patch suggestions, and container config checklists.',
    icon: 'Shield', colorFrom: '#ca6702', colorTo: '#bb3e03', badgeColor: 'badge-orange',
    stars: 4.9,
    systemDirectives: `[SYSTEM: DECODER CORE — SEC HARDENING]
Role: DevSecOps Lead & Red Team Auditor.
Rule-Set:
1. Analyze provided code/architecture specifically for OWASP Top 10 vulnerabilities.
2. Output "## VULNERABILITY SUMMARY" listing exploits, impact levels, and proof-of-concept mock commands.
3. Provide "## CODE REMEDIATION PATCH" in standard git diff syntax showing secure alternatives.
4. Add a "## PLATFORM HARDENING CHECKLIST" detailing docker/nginx/systemd directives to mitigate secondary exploits.
5. Avoid conversational prose. Keep output focused on security patching.`,
    sampleInput: 'An Express.js file upload handler vulnerable to directory traversal'
  },
  {
    id: 'skill-ux-010', title: 'UX Copywriter & Tone Tuner', category: 'Writing',
    version: '1.0.0', complexity: 'Structured Formatting',
    description: 'Optimizes UI microcopy, alert headers, and user flows across distinct brand personas.',
    icon: 'MessageSquare', colorFrom: '#bb3e03', colorTo: '#ae2012', badgeColor: 'badge-pink',
    stars: 4.5,
    systemDirectives: `[SYSTEM: DECODER CORE — UX COPYWRITER]
Role: Principal UX Content Strategist & Brand Designer.
Rule-Set:
1. Transform provided raw user notification/error message into 3 distinct UI variations:
   - ## PROFESSIONAL (Clear, reassuring, zero jargon)
   - ## PLAYFUL (Friendly, lighthearted, clever but helpful)
   - ## EMERGENCY / URGENT (Action-oriented, highly visible, critical instructions)
2. For each variation, output: Notification Header (max 40 chars), Body Microcopy (max 120 chars), CTA Button Text (max 20 chars).
3. Adhere strictly to length limits. Output only raw markdown.`,
    sampleInput: 'The user database sync failed because of a network timeout during credit card processing'
  }
];

// ─── MODEL REGISTRY ───────────────────────────────────────────────
const MODEL_REGISTRY = {
  gemini: {
    label: 'Google Gemini', color: '#dd2d4a', icon: Zap,
    models: [
      { id: 'gemini-2.5-flash-preview-05-20', label: 'Gemini 2.5 Flash', tier: 'Fast · Low cost' },
      { id: 'gemini-2.5-pro-preview-05-06',   label: 'Gemini 2.5 Pro',   tier: 'Powerful · Med cost' },
      { id: 'gemini-2.0-flash',               label: 'Gemini 2.0 Flash', tier: 'Fast · Low cost' },
    ]
  },
  openai: {
    label: 'OpenAI', color: '#f26a8d', icon: Braces,
    models: [
      { id: 'gpt-4o',      label: 'GPT-4o',      tier: 'Powerful · Med cost' },
      { id: 'gpt-4o-mini', label: 'GPT-4o Mini', tier: 'Fast · Low cost' },
      { id: 'gpt-4-turbo', label: 'GPT-4 Turbo', tier: 'Powerful · High cost' },
      { id: 'o1-mini',     label: 'o1 Mini',      tier: 'Reasoning · Med cost' },
    ]
  },
  groq: {
    label: 'Groq', color: '#f49cbb', icon: Flame,
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', tier: 'High performance' },
      { id: 'llama-3.1-8b-instant',    label: 'Llama 3.1 8B',   tier: 'Ultra fast' },
      { id: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7b',   tier: 'MoE · Low latency' },
    ]
  },
  anthropic: {
    label: 'Anthropic Claude', color: '#cbeef3', icon: Bot,
    models: [
      { id: 'claude-3-5-sonnet-latest', label: 'Claude 3.5 Sonnet', tier: 'Powerful · High cost' },
      { id: 'claude-3-5-haiku-latest',  label: 'Claude 3.5 Haiku',  tier: 'Fast · Low cost' },
      { id: 'claude-3-opus-latest',      label: 'Claude 3 Opus',      tier: 'Reasoning · High cost' },
    ]
  },
  custom: {
    label: 'Custom / Local', color: '#880d1e', icon: Settings,
    models: [
      { id: 'custom', label: 'Custom Endpoint', tier: 'Ollama · LM Studio · Groq · Azure' }
    ]
  }
};

// ─── TONE & LANGUAGE STYLES ───────────────────────────────────────
const LANGUAGE_STYLES = [
  { id: 'professional', label: 'Professional & Balanced', description: 'Standard polite, clear, and structured business tone.', instruction: 'Maintain a professional, objective, balanced, and polite tone. Avoid overly informal language.' },
  { id: 'concise', label: 'Concise & Minimalist', description: 'Highly direct and brief replies without conversational fluff.', instruction: 'Be extremely concise, direct, and brief. Skip greetings, summaries, and concluding remarks. Get straight to the point.' },
  { id: 'casual', label: 'Casual & Warm', description: 'Conversational, warm, and friendly tone with occasional emojis.', instruction: 'Use a casual, warm, friendly, and conversational tone. Feel free to use appropriate emojis.' },
  { id: 'technical', label: 'Technical & In-depth', description: 'Highly analytical, structured, detailed explanation with full code/data.', instruction: 'Provide a highly detailed, technical, and analytical response. Use precise terminology and include structured code or data formats where applicable.' },
  { id: 'eli5', label: 'ELI5 (Ultra-Simple)', description: 'Explains complex topics as if speaking to a 5-year-old child.', instruction: 'Explain all concepts using extremely simple, plain language as if explaining to a 5-year-old. Use clear metaphors and everyday analogies. Avoid jargon.' },
  { id: 'academic', label: 'Academic & Scholarly', description: 'Formal, objective, highly structured academic style with citations.', instruction: 'Use a formal academic and scholarly tone. Structure the response logically and use precise, sophisticated vocabulary.' },
  { id: 'socratic', label: 'Socratic & Educational', description: 'Asks guiding questions to help you reason and arrive at answers.', instruction: 'Do not give the answers directly. Act as a Socratic teacher. Ask thought-provoking, guiding questions to help the user reason and solve the problem step-by-step.' },
  { id: 'genz', label: 'Gen Z Slang', description: 'Trendy, lowercase, casual internet lingo (bet, fr, no cap).', instruction: 'Respond in casual Gen Z slang (e.g. bet, no cap, fr, lowkey, rizz). Keep the tone highly informal, lowercase-heavy, and modern.' },
  { id: 'legal', label: 'Legal & Contractual', description: 'Precise, risk-conscious phrasing focusing on liability/accuracy.', instruction: 'Use precise, formal, and risk-conscious legal phrasing. Focus strictly on terminology accuracy, clarity, and structural standard boilerplate formats.' },
  { id: 'creative', label: 'Creative & Storyteller', description: 'Engaging, narrative-driven, metaphorical, and inspiring.', instruction: 'Use a creative, narrative-driven, and highly engaging storytelling voice. Employ rich metaphors, descriptive language, and inspiring analogies.' }
];

// ─── HELPERS ──────────────────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2);
const estimateTokens = (text) => Math.ceil((text || '').split(/\s+/).length * 1.3);

// ─── MARKDOWN RENDERER ────────────────────────────────────────────
function MdChat({ content, streaming }) {
  // Split by code blocks
  const parts = (content || '').split(/(```[\s\S]*?```)/g);
  
  const processedParts = parts.map((part) => {
    if (part.startsWith('```')) {
      // It's a code block: escape HTML tags specifically
      return part.replace(/```([\w]*)\n?([\s\S]*?)```/g, (_, lang, code) => {
        const cleanLang = lang || 'code';
        const escapedCode = code
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
        let base64Code = '';
        try {
          base64Code = btoa(unescape(encodeURIComponent(code)));
        } catch (err) {
          console.error("Base64 encode failed:", err);
        }
        return `
          <div class="code-block-wrapper">
            <div class="code-block-header">
              <span class="code-block-lang">${cleanLang}</span>
              <span class="code-block-copy-btn" data-code="${base64Code}">Copy</span>
            </div>
            <pre><code class="lang-${cleanLang}">${escapedCode}</code></pre>
          </div>
        `;
      });
    } else {
      // Standard text: escape all raw HTML characters to prevent XSS
      return part
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  });

  const escapedText = processedParts.join('');

  // Apply safe markdown rules on the escaped text
  const rendered = escapedText
    .replace(/^#### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^### (.+)$/gm,  '<h3>$1</h3>')
    .replace(/^## (.+)$/gm,   '<h2>$1</h2>')
    .replace(/^# (.+)$/gm,    '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,    '<em>$1</em>')
    .replace(/`([^`]+)`/g,    '<code>$1</code>')
    .replace(/^---$/gm,       '<hr />')
    .replace(/^> (.+)$/gm,    '<blockquote>$1</blockquote>')
    .replace(/^\- (.+)$/gm,   '<li>$1</li>')
    .replace(/^\* (.+)$/gm,   '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
    .replace(/(<li>[\s\S]+?<\/li>)(\n(?!<li>)|$)/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n\n+/g,        '</p><p>')
    .replace(/^(?!<[hHpPuUoObBpPcC])(.+)$/gm, (l) => l.trim() ? `<p>${l}</p>` : '')
    .replace(/<p><\/p>/g, '');

  return (
    <div
      className={`md-chat${streaming ? ' streaming-cursor' : ''}`}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
}

// ─── COLOR PALETTES REGISTRY (Coolors.co Style Harmonized) ────────
const PALETTES = {
  crimson: {
    label: 'Crimson Rose',
    dark: {
      accent: '#DD2D4A',
      hover: '#F26A8D',
      flowStart: '#120406',
      flowEnd: '#1f070b',
      logBg: 'rgba(41, 8, 14, 0.8)',
      logBorder: 'rgba(221, 45, 74, 0.15)',
      logText: '#F26A8D'
    },
    light: {
      accent: '#DD2D4A',
      hover: '#F26A8D',
      flowStart: '#fcedf0',
      flowEnd: '#f4d3d8',
      logBg: 'rgba(255, 235, 238, 0.9)',
      logBorder: 'rgba(221, 45, 74, 0.2)',
      logText: '#DD2D4A'
    }
  },
  emerald: {
    label: 'Emerald Mint',
    dark: {
      accent: '#10B981',
      hover: '#34D399',
      flowStart: '#021a12',
      flowEnd: '#042a1d',
      logBg: 'rgba(8, 41, 28, 0.8)',
      logBorder: 'rgba(16, 185, 129, 0.15)',
      logText: '#34D399'
    },
    light: {
      accent: '#059669',
      hover: '#10B981',
      flowStart: '#e6fcf5',
      flowEnd: '#c3fae8',
      logBg: 'rgba(230, 252, 245, 0.9)',
      logBorder: 'rgba(5, 150, 105, 0.2)',
      logText: '#059669'
    }
  },
  sapphire: {
    label: 'Sapphire Ice',
    dark: {
      accent: '#3B82F6',
      hover: '#60A5FA',
      flowStart: '#051026',
      flowEnd: '#0a1c3d',
      logBg: 'rgba(8, 28, 64, 0.8)',
      logBorder: 'rgba(59, 130, 246, 0.15)',
      logText: '#60A5FA'
    },
    light: {
      accent: '#2563EB',
      hover: '#3B82F6',
      flowStart: '#ebf8ff',
      flowEnd: '#bee3f8',
      logBg: 'rgba(235, 248, 255, 0.9)',
      logBorder: 'rgba(37, 99, 235, 0.2)',
      logText: '#2563EB'
    }
  },
  violet: {
    label: 'Sunset Violet',
    dark: {
      accent: '#8B5CF6',
      hover: '#A78BFA',
      flowStart: '#140826',
      flowEnd: '#200c3d',
      logBg: 'rgba(28, 12, 64, 0.8)',
      logBorder: 'rgba(139, 92, 246, 0.15)',
      logText: '#A78BFA'
    },
    light: {
      accent: '#7C3AED',
      hover: '#8B5CF6',
      flowStart: '#f5f3ff',
      flowEnd: '#e9d5ff',
      logBg: 'rgba(245, 243, 255, 0.9)',
      logBorder: 'rgba(124, 58, 237, 0.2)',
      logText: '#7C3AED'
    }
  },
  amber: {
    label: 'Electric Amber',
    dark: {
      accent: '#F59E0B',
      hover: '#FBBF24',
      flowStart: '#1c1202',
      flowEnd: '#2e1d04',
      logBg: 'rgba(64, 45, 8, 0.8)',
      logBorder: 'rgba(245, 158, 11, 0.15)',
      logText: '#FBBF24'
    },
    light: {
      accent: '#D97706',
      hover: '#F59E0B',
      flowStart: '#fffbeb',
      flowEnd: '#fef3c7',
      logBg: 'rgba(255, 251, 235, 0.9)',
      logBorder: 'rgba(217, 119, 70, 0.2)',
      logText: '#D97706'
    }
  },
  cyber: {
    label: 'Cyberpunk Neon',
    dark: {
      accent: '#EC4899',
      hover: '#F472B6',
      flowStart: '#260216',
      flowEnd: '#3d0424',
      logBg: 'rgba(64, 8, 41, 0.8)',
      logBorder: 'rgba(236, 72, 153, 0.15)',
      logText: '#F472B6'
    },
    light: {
      accent: '#DB2777',
      hover: '#EC4899',
      flowStart: '#fdf2f8',
      flowEnd: '#fce7f3',
      logBg: 'rgba(253, 242, 248, 0.9)',
      logBorder: 'rgba(219, 39, 119, 0.2)',
      logText: '#DB2777'
    }
  }
};

const FONT_STYLES = {
  editorial: {
    label: 'Editorial Serif & Sans',
    header: "'Playfair Display', Georgia, serif",
    body: "'Outfit', 'Inter', sans-serif",
    input: "Arial, sans-serif"
  },
  minimalist: {
    label: 'Minimalist Sans',
    header: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
    input: "'Inter', sans-serif"
  },
  monospace: {
    label: 'Monospace Coder',
    header: "'JetBrains Mono', monospace",
    body: "'JetBrains Mono', monospace",
    input: "'JetBrains Mono', monospace"
  },
  classic: {
    label: 'Classic Literary',
    header: "Georgia, serif",
    body: "Georgia, serif",
    input: "Georgia, serif"
  },
  modern: {
    label: 'Modern Geometric',
    header: "'Outfit', sans-serif",
    body: "'Outfit', sans-serif",
    input: "'Outfit', sans-serif"
  }
};

// ─── MAIN APP ─────────────────────────────────────────────────────
export default function App() {

  // ── Authentication & Roles ──────────────────────────────────────
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('app_user');
      return saved ? JSON.parse(saved) : null;
    } catch (_) {
      return null;
    }
  });
  
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('app_registered_users');
      return saved ? JSON.parse(saved) : [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'member', password: 'member123', role: 'member' }
      ];
    } catch (_) {
      return [
        { username: 'admin', password: 'admin123', role: 'admin' },
        { username: 'member', password: 'member123', role: 'member' }
      ];
    }
  });

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError]       = useState('');
  const [showUserMenu, setShowUserMenu]   = useState(false);
  
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberPass, setNewMemberPass] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');

  const [visibleUserIndices, setVisibleUserIndices] = useState([]);
  const togglePasswordVisibility = (index) => {
    setVisibleUserIndices(prev => 
      prev.includes(index) ? prev.filter(idx => idx !== index) : [...prev, index]
    );
  };

  const [attachments, setAttachments] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setAttachments(prev => [
          ...prev,
          {
            id: uid(),
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: event.target.result
          }
        ]);
      };
      
      if (file.type.startsWith('image/')) {
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [
          ...prev,
          {
            id: uid(),
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: null
          }
        ]);
      }
    });
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeAttachment = (id) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const [speakingMessageId, setSpeakingMessageId] = useState(null);

  const handleToggleSpeech = (msg) => {
    if (speakingMessageId === msg.id) {
      window.speechSynthesis.cancel();
      setSpeakingMessageId(null);
    } else {
      window.speechSynthesis.cancel();
      const cleanText = msg.content
        .replace(/<\/?[^>]+(>|$)/g, "")
        .replace(/```[\s\S]*?```/g, "")
        .replace(/[*#_`▸▸▸\-]/g, "")
        .trim();

      if (!cleanText) return;

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.onend = () => setSpeakingMessageId(null);
      utterance.onerror = () => setSpeakingMessageId(null);
      
      setSpeakingMessageId(msg.id);
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleAddMember = (e) => {
    e.preventDefault();
    if (!newMemberName || !newMemberPass) return;
    if (registeredUsers.find(u => u.username.toLowerCase() === newMemberName.trim().toLowerCase())) {
      alert("User already exists!");
      return;
    }
    const nextUsers = [...registeredUsers, { username: newMemberName.trim(), password: newMemberPass, role: newMemberRole }];
    setRegisteredUsers(nextUsers);
    localStorage.setItem('app_registered_users', JSON.stringify(nextUsers));
    setNewMemberName('');
    setNewMemberPass('');
    alert("Member added successfully!");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword;
    
    const foundUser = registeredUsers.find(ru => ru.username.toLowerCase() === u && ru.password === p);
    if (foundUser) {
      const userObj = { username: foundUser.username, role: foundUser.role };
      setCurrentUser(userObj);
      localStorage.setItem('app_user', JSON.stringify(userObj));
    } else {
      setLoginError('Invalid username or password.');
    }
  };

  const handleLogout = () => {
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setCurrentUser(null);
    localStorage.removeItem('app_user');
    setShowUserMenu(false);
  };



  // ── Skills ──────────────────────────────────────────────────────
  const [skills, setSkills] = useState(PRESET_SKILLS);
  const [activeSkill, setActiveSkill] = useState(PRESET_SKILLS[0]);
  const [skillSearch, setSkillSearch] = useState('');

  // ── Chat ────────────────────────────────────────────────────────
  const [messages, setMessages] = useState([]);          // [{id,role,content,ts}]
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingId, setStreamingId] = useState(null);  // which msg is being streamed
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  // ── Model & Keys ────────────────────────────────────────────────
  const [provider, setProvider] = useState('gemini');
  const [modelId, setModelId]   = useState(MODEL_REGISTRY.gemini.models[0].id);
  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('sk_gemini') || '',
    openai: localStorage.getItem('sk_openai') || '',
    groq: localStorage.getItem('sk_groq') || '',
    anthropic: localStorage.getItem('sk_anthropic') || '',
    custom: localStorage.getItem('sk_custom') || ''
  });
  const [customEndpoint, setCustomEndpoint] = useState(localStorage.getItem('custom_endpoint') || '');
  const [customModelOverrides, setCustomModelOverrides] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('custom_model_overrides') || '{}');
    } catch (_) {
      return {};
    }
  });
  const [showKey, setShowKey] = useState(false);
  const [temperature, setTemperature] = useState(0.2);

  const saveModelOverride = (prov, val) => {
    setCustomModelOverrides(prev => {
      const next = { ...prev, [prov]: val };
      localStorage.setItem('custom_model_overrides', JSON.stringify(next));
      return next;
    });
  };

  const effectiveModelId = customModelOverrides[provider] || (modelId === 'custom' ? 'gpt-4o' : modelId);

  // ── UI State ────────────────────────────────────────────────────
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanel, setActivePanel] = useState(null); // null | 'builder' | 'zipunzip'
  const [showProviderMenu, setShowProviderMenu] = useState(false);
  const [showModelMenu, setShowModelMenu]       = useState(false);
  const [settingsOpen, setSettingsOpen]         = useState(false);
  const [settingsTab, setSettingsTab]           = useState('credentials');
  const [theme, setTheme]                       = useState(() => localStorage.getItem('app_theme') || 'system');
  const [activePalette, setActivePalette]       = useState(() => localStorage.getItem('app_palette') || 'crimson');
  const [fontStyle, setFontStyle]               = useState(() => localStorage.getItem('app_font_style') || 'editorial');
  const [isExtensionMode, setIsExtensionMode]   = useState(false);



  // ── Skill Builder ────────────────────────────────────────────────
  const [bTitle, setBTitle]           = useState('');
  const [bCategory, setBCategory]     = useState('General');
  const [bDesc, setBDesc]             = useState('');
  const [bDirectives, setBDirectives] = useState('');
  const [bSample, setBSample]         = useState('');

  // ── Prompt Compressor ────────────────────────────────────────────
  const [zipInput, setZipInput] = useState('');
  const [zipResult, setZipResult] = useState('');
  const [zipDone, setZipDone]   = useState(false);
  const [isZipLoading, setIsZipLoading] = useState(false);

  // ── Language Styles ──────────────────────────────────────────────
  const [languageStyle, setLanguageStyle] = useState(() => localStorage.getItem('app_language_style') || 'professional');

  // ── Com100X Integration ──────────────────────────────────────────
  const [com100xEndpoint, setCom100xEndpoint] = useState(() => localStorage.getItem('com100x_endpoint') || 'http://localhost:8000');
  const [com100xActiveSkillPrompt, setCom100xActiveSkillPrompt] = useState('');
  const [isCom100xLoading, setIsCom100xLoading] = useState(false);
  const [com100xStats, setCom100xStats] = useState(null); // { originalTokens, compressedTokens, savedRatio }

  useEffect(() => {
    localStorage.setItem('app_language_style', languageStyle);
  }, [languageStyle]);

  useEffect(() => {
    localStorage.setItem('com100x_endpoint', com100xEndpoint);
  }, [com100xEndpoint]);

  useEffect(() => {
    if (!activeSkill || activeSkill.id === 'skill-none') {
      setCom100xActiveSkillPrompt('');
      setCom100xStats(null);
      return;
    }

    let isSubscribed = true;
    const fetchCompressed = async () => {
      setIsCom100xLoading(true);
      setCom100xStats(null);
      try {
        const response = await fetch(`${com100xEndpoint}/compress`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: activeSkill.systemDirectives,
            target_ratio: 0.4
          })
        });
        if (!response.ok) throw new Error("Server error");
        const data = await response.json();
        if (isSubscribed) {
          setCom100xActiveSkillPrompt(data.compressed_text);
          setCom100xStats({
            originalTokens: data.original_tokens,
            compressedTokens: data.compressed_tokens,
            savedRatio: data.saved_ratio
          });
        }
      } catch (err) {
        if (isSubscribed) {
          setCom100xActiveSkillPrompt(activeSkill.systemDirectives); // Fallback
          setCom100xStats({
            originalTokens: estimateTokens(activeSkill.systemDirectives),
            compressedTokens: estimateTokens(activeSkill.systemDirectives),
            savedRatio: 1.0
          });
        }
      } finally {
        if (isSubscribed) {
          setIsCom100xLoading(false);
        }
      }
    };

    fetchCompressed();

    return () => {
      isSubscribed = false;
    };
  }, [activeSkill, com100xEndpoint]);

  // ── Scroll ──────────────────────────────────────────────────────
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isStreaming]);

  // ── Theme & Palette Sync Effect ───────────────────────────────────
  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    localStorage.setItem('app_palette', activePalette);
    localStorage.setItem('app_font_style', fontStyle);
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    
    const applyThemeAndPalette = () => {
      let isLight = false;
      if (theme === 'light') {
        isLight = true;
      } else if (theme === 'dark') {
        isLight = false;
      } else {
        isLight = mediaQuery.matches;
      }

      if (isLight) {
        document.documentElement.classList.add('light-theme');
      } else {
        document.documentElement.classList.remove('light-theme');
      }

      const config = PALETTES[activePalette] || PALETTES.crimson;
      const paletteVars = isLight ? config.light : config.dark;
      
      const docStyle = document.documentElement.style;
      docStyle.setProperty('--accent-color', paletteVars.accent);
      docStyle.setProperty('--accent-hover', paletteVars.hover);
      docStyle.setProperty('--flow-grad-start', paletteVars.flowStart);
      docStyle.setProperty('--flow-grad-end', paletteVars.flowEnd);
      docStyle.setProperty('--system-log-bg', paletteVars.logBg);
      docStyle.setProperty('--system-log-border', paletteVars.logBorder);
      docStyle.setProperty('--system-log-text', paletteVars.logText);

      // Apply Typography style
      const typography = FONT_STYLES[fontStyle] || FONT_STYLES.editorial;
      docStyle.setProperty('--font-header', typography.header);
      docStyle.setProperty('--font-body', typography.body);
      docStyle.setProperty('--font-input', typography.input);
    };

    applyThemeAndPalette();

    const listener = () => applyThemeAndPalette();
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
    } else {
      mediaQuery.addListener(listener);
    }
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', listener);
      } else {
        mediaQuery.removeListener(listener);
      }
    };
  }, [theme, activePalette, fontStyle]);

  // ── Extension Message Listener ───────────────────────────────────
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'EXTENSION_RESPONSE') {
        const respText = event.data.payload;
        setMessages(prev => prev.map(m =>
          m.id === streamingId ? { ...m, content: respText } : m
        ));
        setIsStreaming(false);
        setStreamingId(null);
      } else if (event.data?.type === 'EXTENSION_ERROR') {
        setMessages(prev => prev.map(m =>
          m.id === streamingId ? { ...m, content: `⚠ **Extension Error:** ${event.data.payload}` } : m
        ));
        setIsStreaming(false);
        setStreamingId(null);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [streamingId]);

  // ── Load Custom Skills on Mount ──────────────────────────────────
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('custom_skills') || '[]');
      if (saved.length) setSkills([...PRESET_SKILLS, ...saved]);
    } catch (_) {}
  }, []);

  // ── Auto-resize textarea ──────────────────────────────────────────
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 150) + 'px'; }
  };

  // ── Save key ─────────────────────────────────────────────────────
  const saveKey = (prov, val) => {
    setKeys(prev => ({ ...prev, [prov]: val }));
    localStorage.setItem(`sk_${prov}`, val);
  };

  // ── Add system message ────────────────────────────────────────────
  const addSysMsg = useCallback((text) => {
    setMessages(prev => [...prev, { id: uid(), role: 'system', content: text, ts: Date.now() }]);
  }, []);

  // ── Switch skill ──────────────────────────────────────────────────
  const switchSkill = (skill) => {
    setActiveSkill(skill);
    if (messages.length > 0) {
      addSysMsg(
        skill.id === 'skill-none'
          ? '⬤ Channel set to Plain Chat'
          : `⬤ Skill loaded: ${skill.title} v${skill.version}`
      );
    }
  };

  // ── Build conversation history for API ────────────────────────────
  const buildHistory = (msgs, prov) => {
    const chatMsgs = msgs.filter(m => m.role === 'user' || m.role === 'assistant');
    if (prov === 'gemini') {
      return chatMsgs.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
    }
    return chatMsgs.map(m => ({ role: m.role, content: m.content }));
  };

  // ── STREAMING SEND ────────────────────────────────────────────────
  const handleSend = async (overrideInput) => {
    const text = (overrideInput ?? input).trim();
    if (!text || isStreaming) return;

    const activeKey = keys[provider];
    if (!isExtensionMode && !activeKey && provider !== 'custom') {
      addSysMsg(`⚠ API key required for ${MODEL_REGISTRY[provider].label}. Please enter it in the Model Configuration panel in the sidebar. Or enable Bridge Mode.`);
      return;
    }
    if (provider === 'custom' && !customEndpoint) {
      addSysMsg('⚠ Custom API endpoint required. Configure it in the Model Configuration panel.');
      return;
    }

    // Add user message
    const userMsg = { 
      id: uid(), 
      role: 'user', 
      content: text, 
      ts: Date.now(),
      attachments: attachments.length ? [...attachments] : undefined
    };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setAttachments([]);
    if (textareaRef.current) { textareaRef.current.style.height = '24px'; }

    // Check for Compression on active skill prompt
    let systemPrompt = activeSkill?.systemDirectives || '';
    let compressionLogged = null;

    if (systemPrompt) {
      if (com100xActiveSkillPrompt) {
        const originalTokens = com100xStats?.originalTokens || estimateTokens(systemPrompt);
        const compressedTokens = com100xStats?.compressedTokens || estimateTokens(com100xActiveSkillPrompt);
        const savedRatio = com100xStats?.savedRatio || 1.0;
        const pct = Math.round((1 - savedRatio) * 100);

        if (com100xActiveSkillPrompt !== systemPrompt) {
          systemPrompt = com100xActiveSkillPrompt;
          compressionLogged = `Com100X Prompt Compression: ${originalTokens} → ${compressedTokens} tokens (saved ${pct}% context overhead)`;
        }
      } else {
        compressionLogged = `Com100X prompt compression skipped (Engine offline or loading)`;
      }
    }

    // Append system compression event log to message stack if triggered
    if (compressionLogged) {
      newMessages.push({ id: uid(), role: 'system', content: compressionLogged, ts: Date.now() });
      setMessages([...newMessages]);
    }

    // Add empty assistant message to stream into
    const assistantId = uid();
    setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '', ts: Date.now() }]);
    setStreamingId(assistantId);
    setIsStreaming(true);

    // Apply Language Tone Style
    const selectedStyleObj = LANGUAGE_STYLES.find(s => s.id === languageStyle);
    const styleInstruction = selectedStyleObj ? `\n\n[STYLE_GUIDELINE]\n${selectedStyleObj.instruction}` : '';

    const finalSystemPrompt = systemPrompt
      ? `${systemPrompt}${styleInstruction}\n\n[DEC_MODEL_ADAPTER]\nModel: ${effectiveModelId}\nTemperature: ${temperature}\nInstruction: Follow all above rules strictly. Output Markdown only.`
      : `You are a helpful, precise AI assistant.${styleInstruction}`;

    const history = buildHistory(newMessages, provider);

    try {
      if (isExtensionMode) {
        window.postMessage({ type: 'SEND_PROMPT_TO_EXTENSION', payload: finalSystemPrompt + "\n\n" + text }, '*');
      } else if (provider === 'gemini') {
        await streamGemini(finalSystemPrompt, history, activeKey, assistantId);
      } else if (provider === 'anthropic') {
        await streamAnthropic(finalSystemPrompt, history, activeKey, assistantId);
      } else {
        await streamOpenAI(finalSystemPrompt, history, activeKey, assistantId);
      }
    } catch (err) {
      setMessages(prev => prev.map(m =>
        m.id === assistantId
          ? { ...m, content: `⚠ **Error:** ${err.message}\n\nVerify your API key, endpoint configurations, and network connection.` }
          : m
      ));
    } finally {
      setIsStreaming(false);
      setStreamingId(null);
    }
  };

  // ── Gemini SSE Streaming ──────────────────────────────────────────
  const streamGemini = async (systemPrompt, history, key, assistantId) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${effectiveModelId}:streamGenerateContent?alt=sse&key=${key}`;
    const body = {
      contents: history,
      systemInstruction: { parts: [{ text: systemPrompt }] },
      generationConfig: { temperature: temperature, topK: 40, topP: 0.95 }
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const chunk = json.candidates?.[0]?.content?.parts?.[0]?.text || '';
          if (chunk) {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            ));
          }
        } catch (_) {}
      }
    }
  };

  // ── Anthropic Claude SSE Streaming ────────────────────────────────
  const streamAnthropic = async (systemPrompt, history, key, assistantId) => {
    const url = 'https://api.anthropic.com/v1/messages';
    
    // Transform history to Anthropic format (roles: 'user' and 'assistant' only)
    const anthropicMessages = history.map(m => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user',
      content: m.content
    }));

    const body = {
      model: effectiveModelId,
      system: systemPrompt,
      messages: anthropicMessages,
      max_tokens: 4096,
      temperature: temperature,
      stream: true
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          if (json.type === 'content_block_delta' && json.delta?.text) {
            const chunk = json.delta.text;
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            ));
          }
        } catch (_) {}
      }
    }
  };

  // ── OpenAI / Custom / Groq SSE Streaming ─────────────────────────
  const streamOpenAI = async (systemPrompt, history, key, assistantId) => {
    let endpoint = 'https://api.openai.com/v1/chat/completions';
    if (provider === 'custom') {
      endpoint = customEndpoint;
    } else if (provider === 'groq') {
      endpoint = 'https://api.groq.com/openai/v1/chat/completions';
    }

    const body = {
      model: effectiveModelId,
      messages: [{ role: 'system', content: systemPrompt }, ...history],
      temperature: temperature,
      stream: true
    };

    const headers = { 'Content-Type': 'application/json' };
    if (key) headers['Authorization'] = `Bearer ${key}`;

    const res = await fetch(endpoint, { method: 'POST', headers, body: JSON.stringify(body) });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `HTTP ${res.status}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.startsWith('data: ')) continue;
        const data = line.slice(6).trim();
        if (!data || data === '[DONE]') continue;
        try {
          const json = JSON.parse(data);
          const chunk = json.choices?.[0]?.delta?.content || '';
          if (chunk) {
            setMessages(prev => prev.map(m =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            ));
          }
        } catch (_) {}
      }
    }
  };

  // ── Regenerate last response ──────────────────────────────────────
  const handleRegenerate = () => {
    const lastUser = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUser) return;
    setMessages(prev => {
      const idx = prev.findIndex(m => m.role === 'assistant' &&
        prev.indexOf(m) > prev.indexOf(lastUser));
      return idx !== -1 ? prev.slice(0, idx) : prev;
    });
    setTimeout(() => handleSend(lastUser.content), 50);
  };

  // ── Clear Chat ────────────────────────────────────────────────────
  const clearChat = () => {
    window.speechSynthesis.cancel();
    setSpeakingMessageId(null);
    setMessages([]);
    if (activeSkill?.id !== 'skill-none')
      setTimeout(() => addSysMsg(`⬤ Active Skill: ${activeSkill.title} v${activeSkill.version}`), 50);
  };

  // ── Export ────────────────────────────────────────────────────────
  const exportChat = () => {
    const md = messages
      .filter(m => m.role !== 'system')
      .map(m => `**${m.role === 'user' ? 'You' : 'Assistant'}:**\n\n${m.content}`)
      .join('\n\n---\n\n');
    const blob = new Blob([md], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `chat-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // ── Copy message ──────────────────────────────────────────────────
  const copyMsg = (content) => {
    navigator.clipboard.writeText(content).catch(() => {
      const ta = document.createElement('textarea');
      ta.value = content; document.body.appendChild(ta);
      ta.select(); document.execCommand('copy');
      document.body.removeChild(ta);
    });
  };

  // ── Copy Code Block ───────────────────────────────────────────────
  const handleChatClick = (e) => {
    const copyBtn = e.target.closest('.code-block-copy-btn');
    if (copyBtn) {
      try {
        const base64Code = copyBtn.getAttribute('data-code');
        const code = decodeURIComponent(escape(atob(base64Code)));
        navigator.clipboard.writeText(code);
        copyBtn.innerText = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerText = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code block:", err);
      }
    }
  };

  // ── Create Skill ──────────────────────────────────────────────────
  const handleCreateSkill = (e) => {
    e.preventDefault();
    if (!bTitle || !bDirectives) return;
    const newSkill = {
      id: `custom-${Date.now()}`, title: bTitle, category: bCategory,
      version: '1.0.0', complexity: 'Custom Decompiled',
      description: bDesc || 'User-authored skill.', icon: 'Code',
      colorFrom: '#dd2d4a', colorTo: '#f26a8d', badgeColor: 'badge-pink',
      stars: null, systemDirectives: bDirectives,
      sampleInput: bSample || '', createdAt: new Date().toISOString()
    };
    try {
      const existing = JSON.parse(localStorage.getItem('custom_skills') || '[]');
      const updated = [...existing, newSkill];
      localStorage.setItem('custom_skills', JSON.stringify(updated));
      setSkills([...PRESET_SKILLS, ...updated]);
    } catch (_) {
      setSkills(prev => [...prev, newSkill]);
    }
    setBTitle(''); setBDesc(''); setBDirectives(''); setBSample('');
    setActivePanel(null);
    addSysMsg(`⬤ Custom skill integrated: ${bTitle}`);
  };

  // ── Prompt Compressor Action ─────────────────────────────────────
  const handleZip = async () => {
    if (!zipInput.trim()) return;
    setIsZipLoading(true);
    setZipResult('');
    try {
      const response = await fetch(`${com100xEndpoint}/compress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: zipInput, target_ratio: 0.4 })
      });
      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();
      setZipResult(data.compressed_text);
    } catch (err) {
      console.error("Com100X compression failed:", err);
      setZipResult("Error: Com100X Engine is offline or failed to compress. Ensure your microservice is active at " + com100xEndpoint);
    } finally {
      setIsZipLoading(false);
      setZipDone(true);
    }
  };

  // ── Keyboard: Enter to send, Shift+Enter for newline ─────────────
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Derived Values ────────────────────────────────────────────────
  const currentProv  = MODEL_REGISTRY[provider];
  const filteredSkills = skills.filter(s =>
    s.title.toLowerCase().includes(skillSearch.toLowerCase()) ||
    s.category.toLowerCase().includes(skillSearch.toLowerCase())
  );
  const hasMessages = messages.filter(m => m.role !== 'system').length > 0;

  // ─────────────────────────────────────────────────────────────────
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg-color)] p-4 font-sans select-none animate-flow-gradient">
        <div className="w-full max-w-md bg-[var(--panel-bg)] border border-[var(--panel-border)] rounded-sm p-8 shadow-2xl backdrop-blur-xl flex flex-col items-center relative overflow-hidden scaleUpPop">
          
          <div className="w-56 h-28 mb-4 flex items-center justify-center">
            <img src="/logo.png" alt="Pgents Logo" className="w-full h-full object-contain" />
          </div>
          <p className="text-[10px] text-[var(--text-muted)] font-mono uppercase tracking-wider mb-6">Agentic Framework</p>

          <form onSubmit={handleLogin} className="w-full space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-2.5 rounded-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Username</label>
              <input
                type="text"
                value={loginUsername}
                onChange={e => { setLoginUsername(e.target.value); setLoginError(''); }}
                placeholder="admin or member"
                required
                className="spotify-input font-mono bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={loginPassword}
                onChange={e => { setLoginPassword(e.target.value); setLoginError(''); }}
                placeholder="Password (admin123 or member123)"
                required
                className="spotify-input font-mono bg-[var(--input-bg)] border-[var(--panel-border)] text-[var(--text-primary)] placeholder-[var(--text-muted)]"
              />
            </div>

            <button
              type="submit"
              className="w-full btn-premium py-3 mt-6 text-xs uppercase tracking-widest"
            >
              Sign In
            </button>
          </form>

          {/* Helpers removed per user request */}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="spotify-container">
      <div className="spotify-workspace">

        {/* ── MOBILE SIDEBAR OVERLAY ───────────────────────────────── */}
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="fixed top-4 left-4 z-30 md:hidden p-2 bg-[var(--nav-bg)] border border-[var(--panel-border)] rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors shadow-lg"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        {sidebarOpen && (
          <div
            className="mobile-sidebar-overlay md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* ── SIDEBAR ──────────────────────────────────────────────── */}
        <aside
          className={`spotify-sidebar fixed md:relative z-40 md:z-auto h-full transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Top Nav Box */}
          <div className="spotify-nav-box">
            <div className="flex items-center justify-between mb-2">
              <div className="h-8 flex items-center justify-start py-0.5">
                <img src="/logo.png" alt="Pgents Logo" className="h-full object-contain" />
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={`spotify-nav-link ${activePanel === null && !settingsOpen ? 'active' : ''}`} onClick={() => { clearChat(); setActivePanel(null); setSettingsOpen(false); }}>
              <MessageSquare className="w-5 h-5 opacity-70" />
              <span>New Conversation</span>
            </div>
            
            <div className={`spotify-nav-link ${activePanel === 'zipunzip' ? 'active' : ''}`} onClick={() => { setActivePanel('zipunzip'); setSettingsOpen(false); }}>
              <Archive className="w-5 h-5 opacity-70" />
              <span>Prompt Compressor</span>
            </div>

            <div className={`spotify-nav-link ${settingsOpen ? 'active' : ''}`} onClick={() => { setSettingsOpen(true); setActivePanel(null); }}>
              <Settings className="w-5 h-5 opacity-70" />
              <span>Settings</span>
            </div>
          </div>

          {/* Library (Skills) List */}
          <div className="spotify-library-box p-3 border-t border-[var(--panel-border)]">
            <div className="flex items-center justify-between px-2 pb-2 shrink-0">
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Pgents Library</span>
              </div>
              {currentUser.role === 'admin' ? (
                <button
                  onClick={() => setActivePanel('builder')}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all w-6 h-6 rounded-sm hover:bg-[var(--sidebar-hover-bg)] flex items-center justify-center animate-pulse"
                  title="Decompile custom skill"
                >
                  <Plus className="w-4 h-4" />
                </button>
              ) : (
                <div 
                  className="text-[var(--text-muted)] cursor-not-allowed w-6 h-6 rounded-sm flex items-center justify-center"
                  title="Skill Decompiler is locked (Admin Only)"
                >
                  <Lock className="w-3.5 h-3.5" />
                </div>
              )}
            </div>

            {/* Library Search */}
            <div className="relative my-1 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--text-muted)]" />
              <input
                type="text"
                placeholder="Search skills..."
                value={skillSearch}
                onChange={e => setSkillSearch(e.target.value)}
                className="w-full bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--text-primary)] placeholder-[var(--text-muted)] rounded-sm pl-9 pr-4 py-1.5 text-xs outline-none focus:ring-1 focus:ring-[var(--accent-color)]"
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1 mt-1">
              {filteredSkills.map(skill => {
                const Icon = ICON_MAP[skill.icon] || MessageSquare;
                const isActive = activeSkill?.id === skill.id;
                return (
                  <div
                    key={skill.id}
                    onClick={() => { switchSkill(skill); setSidebarOpen(window.innerWidth > 768); }}
                    className={`spotify-skill-item ${isActive ? 'active' : ''}`}
                  >
                    <div
                      className={`spotify-cover ${isActive ? 'active-glow' : ''}`}
                      style={{ background: `linear-gradient(135deg, ${skill.colorFrom || '#ff5500'}, ${skill.colorTo || '#ff9000'})` }}
                    >
                      <Icon className="w-5 h-5 text-white" />
                      {skill.stars && (
                        <div className="absolute bottom-0 right-0 left-0 bg-black/60 text-[7px] text-amber-400 text-center py-[1px] font-semibold">
                          {skill.stars} ★
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-[var(--text-secondary)] truncate skill-title">{skill.title}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate">{skill.category} · v{skill.version}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT (CHAT) ─────────────────────────────────── */}
        <main className="spotify-main animate-flow-gradient">
          
          {/* Header Bar */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[var(--panel-border)] bg-transparent shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden md:flex p-1.5 rounded-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--sidebar-hover-bg)] transition-all"
              >
                {sidebarOpen
                  ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/></svg>
                  : <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
                }
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-[var(--text-primary)]">
                  {activeSkill?.id === 'skill-none' ? 'Freestyle Session' : activeSkill?.title}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">v{activeSkill?.version}</span>
                {activeSkill?.id !== 'skill-none' && (
                  <span className="badge badge-orange">Skill Mode</span>
                )}
              </div>
            </div>

            {/* Model stats & header actions */}
            <div className="flex items-center gap-3">
              {/* Reset conversation button */}
              <button
                onClick={clearChat}
                disabled={!hasMessages}
                className="header-action-btn flex items-center gap-1.5"
                title="Clear conversation"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-serif">Clear Chat</span>
              </button>

              {/* Export markdown button */}
              <button
                onClick={exportChat}
                disabled={!hasMessages}
                className="header-action-btn flex items-center gap-1.5"
                title="Export conversation as markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline font-serif">Export</span>
              </button>
              
              <div className="w-[1px] h-4 bg-[var(--panel-border)]" />

              <div className="flex items-center gap-2 header-bridge-container" title="Pgents Browser Bridge">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-mono">Bridge</span>
                <button
                  onClick={() => setIsExtensionMode(!isExtensionMode)}
                  className={`w-8 h-4 rounded-sm flex items-center p-0.5 border border-[var(--panel-border)] transition-colors ${isExtensionMode ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : 'bg-[var(--input-bg)]'}`}
                >
                  <div className={`w-2.5 h-2.5 rounded-sm transition-transform ${isExtensionMode ? 'translate-x-4 bg-white' : 'translate-x-0 bg-[var(--text-secondary)]'}`} />
                </button>
              </div>

              <div className="w-[1px] h-4 bg-[var(--panel-border)]" />

              <div className="relative">
                <button
                  onClick={() => setShowModelMenu(!showModelMenu)}
                  className="header-model-picker-btn flex items-center gap-2"
                >
                  {React.createElement(currentProv.icon, {
                    className: 'w-3.5 h-3.5 text-[var(--accent-color)]'
                  })}
                  <span className="truncate max-w-[80px] sm:max-w-none font-serif">
                    {customModelOverrides[provider] ? `Custom: ${customModelOverrides[provider]}` : (currentProv.models.find(m => m.id === modelId)?.label || modelId)}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                
                {showModelMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowModelMenu(false)} />
                    <div className="absolute right-0 mt-2 w-64 rounded-sm border bg-[var(--bg-color)] border-[var(--panel-border)] shadow-2xl z-20 py-2 max-h-[350px] overflow-y-auto scaleUpPop">
                      <div className="px-3 py-1.5 text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-wider font-mono">
                        Select Model
                      </div>
                      {Object.entries(MODEL_REGISTRY).map(([provKey, prov]) => (
                        <div key={provKey} className="border-t border-[var(--panel-border)] first:border-none">
                          <div className="flex items-center gap-2 px-3.5 py-1.5 text-[10px] text-[var(--text-secondary)] font-bold uppercase bg-neutral-950/20 font-mono">
                            {React.createElement(prov.icon, { className: 'w-3 h-3 text-[var(--accent-color)]' })}
                            <span>{prov.label}</span>
                          </div>
                          {prov.models.map(m => (
                            <button
                              key={m.id}
                              onClick={() => {
                                setProvider(provKey);
                                setModelId(m.id);
                                setShowModelMenu(false);
                              }}
                              className={`w-full flex flex-col px-5 py-2 text-left hover:bg-[var(--sidebar-hover-bg)] transition-colors ${
                                modelId === m.id ? 'text-[var(--accent-color)] font-bold' : 'text-[var(--text-secondary)]'
                              }`}
                            >
                              <span className="text-xs font-serif">{m.label}</span>
                              <span className="text-[9px] text-[var(--text-muted)] mt-0.5 font-sans">{m.tier}</span>
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
              <div className="w-[1px] h-4 bg-[var(--panel-border)]" />
              
              {/* User Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="header-profile-btn flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                  <span className="truncate max-w-[80px] hidden sm:inline font-serif">
                    {currentUser.role === 'admin' ? 'Admin' : 'Member'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>

                {showUserMenu && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                    <div className="absolute right-0 mt-2 w-48 rounded-sm border bg-[var(--bg-color)] border-[var(--panel-border)] shadow-2xl z-20 py-1.5 scaleUpPop">
                      <div className="px-3 py-2 border-b border-[var(--panel-border)]">
                        <span className="text-[10px] font-bold text-[var(--text-secondary)] block">Signed in as</span>
                        <span className="text-xs text-[var(--text-primary)] font-mono block truncate">{currentUser?.role === 'admin' ? 'Admin' : 'Member'}</span>
                      </div>
                      
                      {currentUser?.role === 'admin' && (
                        <button
                          onClick={() => { 
                            setSettingsTab('admin'); 
                            setSettingsOpen(true); 
                            setShowUserMenu(false); 
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-[var(--accent-color)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--accent-hover)] font-bold transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[var(--accent-color)]" />
                          <span>Admin Panel</span>
                        </button>
                      )}

                      <button
                        onClick={() => { setSettingsOpen(true); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-[var(--text-secondary)] hover:bg-[var(--sidebar-hover-bg)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5" />
                        <span>Settings</span>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs text-red-500 hover:bg-red-500/10 transition-colors border-t border-[var(--panel-border)]"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>

              <div className={`streaming-status-indicator ${isStreaming ? 'active' : 'idle'}`} />
            </div>
          </div>

          {/* Chat scrolling viewport */}
          <div className="spotify-chat-container" onClick={handleChatClick}>
            {!hasMessages ? (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-10 px-4">
                <div className="w-56 h-28 mb-4 flex items-center justify-center">
                  <img src="/logo.png" alt="Pgents Logo" className="w-full h-full object-contain" />
                </div>

                {activeSkill?.id !== 'skill-none' ? (
                  <div className="w-full max-w-2xl text-left bg-[var(--nav-bg)] border border-[var(--panel-border)] p-6 rounded shadow-xl mt-4">
                    <div className="flex items-center gap-3 mb-4">
                      {React.createElement(ICON_MAP[activeSkill.icon] || Zap, { className: "w-8 h-8 text-[var(--accent-color)]" })}
                      <div>
                        <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                          {activeSkill.title}
                        </h1>
                        <span className="text-xs text-[var(--text-muted)] font-mono">v{activeSkill.version} · {activeSkill.complexity}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                      {activeSkill.description}
                    </p>

                    <div className="space-y-4">
                      <div>
                        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2">System Directives (Raw)</h3>
                        <div className="bg-[var(--input-bg)] border border-[var(--panel-border)] rounded-sm p-3 max-h-40 overflow-y-auto">
                          <pre className="text-[10px] text-[var(--text-secondary)] font-mono whitespace-pre-wrap">{activeSkill.systemDirectives}</pre>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider mb-2 flex justify-between font-serif">
                          <span>Com100X Semantic Payload</span>
                          {com100xStats && com100xStats.savedRatio < 1.0 && (
                            <span className="text-[var(--accent-color)]">
                              {Math.round((1 - com100xStats.savedRatio) * 100)}% token savings
                            </span>
                          )}
                        </h3>
                        <div className="bg-[var(--input-bg)] border border-[var(--panel-border)] rounded-sm p-3 max-h-32 overflow-y-auto break-all flex items-center justify-center min-h-[60px]">
                          {isCom100xLoading ? (
                            <div className="flex items-center gap-2 text-[var(--text-muted)] text-[10px] font-mono">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--accent-color)]" />
                              <span>Shrinking prompt context with Com100X...</span>
                            </div>
                          ) : com100xActiveSkillPrompt && com100xActiveSkillPrompt !== activeSkill.systemDirectives ? (
                            <code className="text-[10px] text-[var(--text-secondary)] font-mono block w-full whitespace-pre-wrap text-left select-text">
                              {com100xActiveSkillPrompt}
                            </code>
                          ) : (
                            <div className="text-[10px] text-[var(--text-muted)] font-mono text-center leading-normal">
                              Com100X Engine offline (using raw system directives)
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {activeSkill?.sampleInput && (
                      <div className="mt-6 flex justify-center">
                        <button
                          onClick={() => handleSend(activeSkill.sampleInput)}
                          className="flex items-center gap-2 btn-premium text-xs"
                        >
                          <Zap className="w-4 h-4 text-white fill-white" />
                          <span>Run test prompt</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-[var(--text-secondary)] max-w-md leading-relaxed mb-6">
                    Enter your API credentials in the sidebar panel, select an AI Skill template from the library, and prompt the engine.
                  </p>
                )}
              </div>
            ) : (
              <div className="max-w-3xl mx-auto w-full space-y-4">
                {messages.map((msg, idx) => (
                  <div key={msg.id} className={`spotify-message-row ${msg.role === 'user' ? 'user' : ''}`}>
                    
                    {/* System Log Notification */}
                    {msg.role === 'system' && (
                      <div className="spotify-system-log">
                        <Radio className="w-3.5 h-3.5 shrink-0" />
                        <span>{msg.content}</span>
                      </div>
                    )}

                    {/* User Bubble */}
                    {msg.role === 'user' && (
                      <div className="flex flex-col items-end gap-1.5">
                        <div className="spotify-bubble-user">
                          <div>{msg.content}</div>
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 border-t border-[var(--panel-border)] pt-2.5">
                              {msg.attachments.map((att) => (
                                <div key={att.id} className="flex items-center gap-2.5 p-2 rounded-sm bg-[var(--input-bg)]/40 border border-[var(--panel-border)] text-xs text-[var(--text-primary)] max-w-full">
                                  {att.type.startsWith('image/') && att.dataUrl ? (
                                    <img src={att.dataUrl} alt={att.name} className="w-10 h-10 object-cover rounded-sm border border-[var(--panel-border)] shrink-0" />
                                  ) : (
                                    <div className="w-10 h-10 rounded-sm bg-[var(--input-bg)]/20 border border-[var(--panel-border)] flex items-center justify-center shrink-0">
                                      <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
                                    </div>
                                  )}
                                  <div className="flex-1 min-w-0 text-left">
                                    <p className="font-bold truncate text-[11px] leading-tight" title={att.name}>{att.name}</p>
                                    <p className="text-[9px] text-[var(--text-muted)] font-mono mt-0.5">{(att.size / 1024).toFixed(1)} KB</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-[var(--text-muted)] font-mono pr-1">
                          <button onClick={() => copyMsg(msg.content)} className="hover:text-[var(--text-secondary)]">
                            <Copy className="w-3 h-3" />
                          </button>
                          <span>{new Date(msg.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span>
                        </div>
                      </div>
                    )}

                    {/* Assistant Bubble */}
                    {msg.role === 'assistant' && (
                      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                        <div className="spotify-bubble-assistant">
                          {msg.content ? (
                            <MdChat content={msg.content} streaming={streamingId === msg.id} />
                          ) : (
                            <div className="flex items-center gap-1.5 py-1">
                              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce" style={{animationDelay:'0ms'}} />
                              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce" style={{animationDelay:'150ms'}} />
                              <span className="w-2 h-2 rounded-full bg-[#ff5500] animate-bounce" style={{animationDelay:'300ms'}} />
                            </div>
                          )}
                        </div>

                        {/* Hover Actions */}
                        {streamingId !== msg.id && msg.content && (
                          <div className="flex items-center gap-3 text-[10px] text-[var(--text-muted)] font-mono px-2">
                            <button onClick={() => copyMsg(msg.content)} className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors" title="Copy message to clipboard">
                              <Copy className="w-3 h-3" /> Copy
                            </button>
                            
                            <button 
                              onClick={() => handleToggleSpeech(msg)} 
                              className={`flex items-center gap-1 transition-colors ${speakingMessageId === msg.id ? 'text-[var(--accent-color)] font-bold' : 'hover:text-[var(--text-secondary)]'}`}
                              title={speakingMessageId === msg.id ? "Stop reading" : "Read aloud"}
                            >
                              {speakingMessageId === msg.id ? (
                                <>
                                  <VolumeX className="w-3 h-3" /> Stop
                                </>
                              ) : (
                                <>
                                  <Volume2 className="w-3 h-3" /> Speak
                                </>
                              )}
                            </button>

                            {idx === messages.length - 1 && (
                              <button onClick={handleRegenerate} className="flex items-center gap-1 hover:text-[var(--text-secondary)] transition-colors" title="Regenerate last answer">
                                <RefreshCw className="w-3 h-3" /> Regenerate
                              </button>
                            )}
                            <span className="ml-auto text-[9px] text-[var(--text-muted)] font-mono">
                              ~{estimateTokens(msg.content)} tokens ·{' '}
                              {new Date(msg.ts).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Input Box Footer Container */}
          <div className="spotify-chat-input-wrapper">
            <div className="max-w-3xl mx-auto w-full">
              {activeSkill && activeSkill.id !== 'skill-none' && (
                <div className="flex items-center gap-2 mb-2 pl-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-pulse" />
                  <span className="text-[10px] text-[var(--text-muted)] font-mono">
                    Skill directives payload: {estimateTokens(activeSkill.systemDirectives)} tokens · model: {effectiveModelId}
                  </span>
                </div>
              )}
              
              {/* Selected attachments list */}
              {attachments.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2 px-2 py-1 max-h-32 overflow-y-auto">
                  {attachments.map(att => (
                    <div key={att.id} className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm bg-[var(--input-bg)]/40 border border-[var(--panel-border)] text-xs text-[var(--text-secondary)] shadow-sm animate-flow-gradient">
                      {att.type.startsWith('image/') && att.dataUrl ? (
                        <img src={att.dataUrl} alt={att.name} className="w-4 h-4 object-cover rounded-sm border border-[var(--panel-border)]" />
                      ) : (
                        <FileText className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                      )}
                      <span className="truncate max-w-[120px] text-[10px] font-mono">{att.name}</span>
                      <button 
                        onClick={() => removeAttachment(att.id)}
                        className="w-4 h-4 rounded-sm hover:bg-[var(--sidebar-hover-bg)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all ml-1 shrink-0"
                        title="Remove attachment"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="spotify-textarea-container">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-8 h-8 textarea-attach-btn flex items-center justify-center transition-all shrink-0"
                  title="Attach files (Doc, Photo, PPT)"
                  disabled={isStreaming}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                />

                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    activeSkill?.id === 'skill-none'
                      ? 'Send message...'
                      : `Ask ${activeSkill?.title}...`
                  }
                  rows={1}
                  className="spotify-textarea"
                  disabled={isStreaming}
                />
                
                <button
                  onClick={() => handleSend()}
                  disabled={(!input.trim() && !attachments.length) || isStreaming}
                  className="w-8 h-8 textarea-send-btn flex items-center justify-center transition-all shrink-0"
                  title="Send message"
                >
                  {isStreaming ? (
                    <RefreshCw className="w-4 h-4 text-white animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 text-white ml-[2px]" />
                  )}
                </button>
              </div>
              <p className="text-[9px] text-[var(--text-muted)] mt-2 text-center font-mono">
                Enter to send · Shift+Enter for new line · API keys are stored client-side in the browser only.
              </p>
            </div>
          </div>

        </main>
      </div>

      {/* ── SKILL DECOMPILER BUILDER ───────────────────────────────── */}
      {activePanel === 'builder' && (
        <div className="spotify-panel-overlay" onClick={() => setActivePanel(null)}>
          <div className="spotify-panel-slide panel-slide-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--panel-border)] mb-6">
              <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#ff5500]" />
                Decompile Custom Skill
              </h2>
              <button onClick={() => setActivePanel(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSkill} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Skill Title</label>
                  <input type="text" value={bTitle} onChange={e => setBTitle(e.target.value)}
                    placeholder="Legal Drafter" required className="spotify-input" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Category</label>
                  <select value={bCategory} onChange={e => setBCategory(e.target.value)} className="spotify-input">
                    {['General','Presentation','Technical Writing','Market Research','Code-Gen','Analysis','Legal','Finance'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Description</label>
                <input type="text" value={bDesc} onChange={e => setBDesc(e.target.value)}
                  placeholder="Drafts high-density legal contracts" className="spotify-input" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">System Directives</label>
                <textarea rows={6} value={bDirectives} onChange={e => setBDirectives(e.target.value)}
                  placeholder={`[SYSTEM: DECODER CORE]\nRole: Senior Counsel...\nRule-Set:\n1. Use strict markdown tables for outputs.`}
                  required className="spotify-input font-mono text-[11px] leading-relaxed resize-none" />
                {bDirectives && (
                  <span className="text-[9px] text-[var(--text-muted)] font-mono">Estimated size: {estimateTokens(bDirectives)} tokens</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Sample Prompt (Optional)</label>
                <input type="text" value={bSample} onChange={e => setBSample(e.target.value)}
                  placeholder="Draft a NDA contract for software engineers" className="spotify-input" />
              </div>

              <button type="submit"
                className="w-full btn-premium py-3 mt-4 text-xs uppercase tracking-widest"
              >
                Assemble into Registry
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── PROMPT COMPRESSOR DRAWER ───────────────────────────────── */}
      {activePanel === 'zipunzip' && (
        <div className="spotify-panel-overlay" onClick={() => setActivePanel(null)}>
          <div className="spotify-panel-slide panel-slide-in" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-4 border-b border-[var(--panel-border)] mb-6">
              <h2 className="text-base font-black text-[var(--text-primary)] flex items-center gap-2 font-serif">
                <Archive className="w-5 h-5 text-[#ff5500]" />
                Prompt Compressor
              </h2>
              <button onClick={() => setActivePanel(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                Uses the Com100X local AI microservice engine (LLMLingua-2) to analyze and semantically shrink prompts, preserving maximum meaning while slashing context token footprint.
              </p>

              {/* Text Input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-serif">
                  Verbose prompt/directives text
                </label>
                <textarea
                  rows={6}
                  value={zipInput}
                  onChange={e => { setZipInput(e.target.value); setZipDone(false); }}
                  placeholder="Paste your long system directives or prompts here..."
                  className="spotify-input font-mono text-[11px] leading-relaxed resize-none"
                />
                {zipInput && (
                  <span className="text-[9px] text-[var(--text-muted)] font-mono">Token Count: ~{estimateTokens(zipInput)}</span>
                )}
              </div>

              <button
                onClick={handleZip}
                disabled={!zipInput.trim() || isZipLoading}
                className="w-full btn-premium py-2.5 flex items-center justify-center gap-2 font-serif text-xs"
              >
                {isZipLoading && <RefreshCw className="w-3.5 h-3.5 text-white animate-spin" />}
                <span>
                  {isZipLoading 
                    ? 'Shrinking payload...' 
                    : 'Compress prompt'
                  }
                </span>
              </button>

              {/* Persistent Result Area */}
              <div className="flex flex-col gap-1.5 mt-4 pt-4 border-t border-[var(--panel-border)]">
                <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-serif">
                  <span>Compressed Output</span>
                  {zipResult && !zipResult.startsWith("Error:") && (
                    <button
                      onClick={() => copyMsg(zipResult)}
                      className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" /> Copy
                    </button>
                  )}
                </div>
                
                {isZipLoading ? (
                  <div className="flex flex-col items-center justify-center py-8 gap-2 bg-[var(--input-bg)] border border-[var(--input-border)] rounded min-h-[100px]">
                    <RefreshCw className="w-5 h-5 animate-spin text-[var(--accent-color)]" />
                    <span className="text-[10px] font-mono text-[var(--text-muted)]">Reducing prompt...</span>
                  </div>
                ) : (
                  <textarea
                    readOnly
                    value={zipResult || ''}
                    placeholder="Compressed prompt will appear here..."
                    className="spotify-input font-mono text-[10px] text-[#ff7a00] min-h-[100px] bg-[var(--input-bg)] border-[var(--input-border)] resize-none"
                  />
                )}
                
                {zipResult && !zipResult.startsWith("Error:") && !isZipLoading && (
                  <button
                    onClick={() => { setBDirectives(zipResult); setActivePanel('builder'); }}
                    className="w-full btn-premium-secondary py-2 mt-2 font-serif text-[10px]"
                  >
                    Apply directly to custom skill builder
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS MODAL ─────────────────────────────────────────── */}
      {settingsOpen && (
        <div className="spotify-modal-overlay" onClick={() => setSettingsOpen(false)}>
          <div className="spotify-modal-card flex flex-row overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Modal Sidebar */}
            <div className="spotify-modal-sidebar flex flex-col justify-between h-full p-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[var(--text-primary)] font-bold text-xs uppercase tracking-wider mb-4 px-2">
                  <Settings className="w-4 h-4 text-[var(--accent-color)]" />
                  <span>Settings</span>
                </div>
                
                <button
                  onClick={() => setSettingsTab('credentials')}
                  className={`spotify-modal-tab-btn flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white transition-all text-left w-full ${settingsTab === 'credentials' ? 'active' : ''}`}
                >
                  <Key className="w-4 h-4 shrink-0" />
                  <span>Credentials</span>
                </button>

                <button
                  onClick={() => setSettingsTab('appearance')}
                  className={`spotify-modal-tab-btn flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white transition-all text-left w-full ${settingsTab === 'appearance' ? 'active' : ''}`}
                >
                  <Eye className="w-4 h-4 shrink-0" />
                  <span>Appearance</span>
                </button>

                <button
                  onClick={() => setSettingsTab('compression')}
                  className={`spotify-modal-tab-btn flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white transition-all text-left w-full ${settingsTab === 'compression' ? 'active' : ''}`}
                >
                  <Zap className="w-4 h-4 shrink-0" />
                  <span>Com100X Engine</span>
                </button>

                <button
                  onClick={() => setSettingsTab('bridge')}
                  className={`spotify-modal-tab-btn flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white transition-all text-left w-full ${settingsTab === 'bridge' ? 'active' : ''}`}
                >
                  <ExternalLink className="w-4 h-4 shrink-0" />
                  <span>Pgents Browser Bridge</span>
                </button>

                <button
                  onClick={() => setSettingsTab('terms')}
                  className={`spotify-modal-tab-btn flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-neutral-400 hover:text-white transition-all text-left w-full ${settingsTab === 'terms' ? 'active' : ''}`}
                >
                  <Shield className="w-4 h-4 shrink-0" />
                  <span>Terms & conditions</span>
                </button>
                
                {currentUser?.role === 'admin' && (
                  <button
                    onClick={() => setSettingsTab('admin')}
                    className={`spotify-modal-tab-btn flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-bold text-[#ff5500] hover:text-[#ff7a00] transition-all text-left w-full ${settingsTab === 'admin' ? 'active' : ''}`}
                  >
                    <User className="w-4 h-4 shrink-0" />
                    <span>Admin Panel</span>
                  </button>
                )}
              </div>

              {/* Close Button at bottom of sidebar */}
              <button
                onClick={() => setSettingsOpen(false)}
                className="mt-auto btn-premium-secondary py-2 text-xs text-center justify-center cursor-pointer"
              >
                Close
              </button>
            </div>

            {/* Modal Content */}
            <div className="spotify-modal-content flex-1 p-6 overflow-y-auto flex flex-col bg-transparent">
              {settingsTab === 'credentials' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">API Credentials Manager</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Configure your API keys, custom endpoints, and generation parameters. Your credentials are saved locally in your browser.
                    </p>
                  </div>

                  {currentUser.role === 'admin' ? (
                    <div className="bg-[#ff5500]/10 border border-[#ff5500]/25 text-[#ff5500] text-[10px] px-3 py-2.5 rounded-sm flex items-center gap-2 font-mono">
                      <Shield className="w-4 h-4 shrink-0 text-[#ff5500]" />
                      <span>System Admin Mode: Keys configured here will register to the primary engine registry.</span>
                    </div>
                  ) : (
                    <div className="bg-[var(--input-bg)] border border-[var(--panel-border)] text-[var(--text-secondary)] text-[10px] px-3 py-2.5 rounded-sm flex items-center gap-2 font-mono">
                      <Lock className="w-3.5 h-3.5 shrink-0" />
                      <span>Member Access Mode: Keys are sandboxed in your browser's local sandbox partition.</span>
                    </div>
                  )}

                  <hr className="border-[var(--panel-border)]" />

                  {/* Provider API Key inputs */}
                  <div className="space-y-4">
                    {/* Gemini */}
                    <div className="flex flex-col gap-1.5 border-b border-[var(--panel-border)] pb-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Google Gemini</label>
                        {keys.gemini && <span className="text-[9px] text-green-500 font-mono">Connected</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="password"
                          placeholder="API Key / Token"
                          value={keys.gemini}
                          onChange={e => saveKey('gemini', e.target.value)}
                          className="spotify-input font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Custom Model ID override"
                          value={customModelOverrides.gemini || ''}
                          onChange={e => saveModelOverride('gemini', e.target.value)}
                          className="spotify-input font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* OpenAI */}
                    <div className="flex flex-col gap-1.5 border-b border-[var(--panel-border)] pb-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">OpenAI</label>
                        {keys.openai && <span className="text-[9px] text-green-500 font-mono">Connected</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="password"
                          placeholder="API Key / Token"
                          value={keys.openai}
                          onChange={e => saveKey('openai', e.target.value)}
                          className="spotify-input font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Custom Model ID override"
                          value={customModelOverrides.openai || ''}
                          onChange={e => saveModelOverride('openai', e.target.value)}
                          className="spotify-input font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Groq */}
                    <div className="flex flex-col gap-1.5 border-b border-[var(--panel-border)] pb-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Groq</label>
                        {keys.groq && <span className="text-[9px] text-green-500 font-mono">Connected</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="password"
                          placeholder="API Key / Token"
                          value={keys.groq}
                          onChange={e => saveKey('groq', e.target.value)}
                          className="spotify-input font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Custom Model ID override"
                          value={customModelOverrides.groq || ''}
                          onChange={e => saveModelOverride('groq', e.target.value)}
                          className="spotify-input font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Anthropic */}
                    <div className="flex flex-col gap-1.5 border-b border-[var(--panel-border)] pb-3">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Anthropic Claude</label>
                        {keys.anthropic && <span className="text-[9px] text-green-500 font-mono">Connected</span>}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="password"
                          placeholder="API Key / Token"
                          value={keys.anthropic}
                          onChange={e => saveKey('anthropic', e.target.value)}
                          className="spotify-input font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Custom Model ID override"
                          value={customModelOverrides.anthropic || ''}
                          onChange={e => saveModelOverride('anthropic', e.target.value)}
                          className="spotify-input font-mono text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Custom Endpoint */}
                    <div className="flex flex-col gap-1.5 pb-2">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Custom / Local Endpoint</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="URL (e.g. http://localhost:11434/...)"
                          value={customEndpoint}
                          onChange={e => { setCustomEndpoint(e.target.value); localStorage.setItem('custom_endpoint', e.target.value); }}
                          className="spotify-input font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Custom Model ID override"
                          value={customModelOverrides.custom || ''}
                          onChange={e => saveModelOverride('custom', e.target.value)}
                          className="spotify-input font-mono text-[11px]"
                        />
                      </div>
                    </div>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  {/* Temperature slider */}
                  <div className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
                      <span>Default Temperature</span>
                      <span className="text-[#ff5500] font-mono">{temperature.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={temperature}
                      onChange={e => setTemperature(parseFloat(e.target.value))}
                      className="spotify-slider my-1.5"
                    />
                  </div>
                </div>
              )}

              {settingsTab === 'appearance' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Appearance & Design</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Customize how AI Skill Studio looks on your device. Choose a theme, select one of our brand palettes, or pick your preferred typography.
                    </p>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Theme Mode</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex flex-col items-center justify-center p-3 rounded-sm border text-center transition-all hover:scale-[1.03] active:scale-[0.97] ${
                          theme === 'dark'
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] font-bold'
                            : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="text-xs font-bold">Dark Theme</span>
                        <span className="text-[9px] text-[var(--text-muted)] mt-0.5">Deep wine & slate</span>
                      </button>

                      <button
                        onClick={() => setTheme('light')}
                        className={`flex flex-col items-center justify-center p-3 rounded-sm border text-center transition-all hover:scale-[1.03] active:scale-[0.97] ${
                          theme === 'light'
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] font-bold'
                            : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="text-xs font-bold">Light Theme</span>
                        <span className="text-[9px] text-[var(--text-muted)] mt-0.5">Soft rose & ice-blue</span>
                      </button>

                      <button
                        onClick={() => setTheme('system')}
                        className={`flex flex-col items-center justify-center p-3 rounded-sm border text-center transition-all hover:scale-[1.03] active:scale-[0.97] ${
                          theme === 'system'
                            ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] font-bold'
                            : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <span className="text-xs font-bold">System Default</span>
                        <span className="text-[9px] text-[var(--text-muted)] mt-0.5">Device preference</span>
                      </button>
                    </div>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">Accent Color Palette</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(PALETTES).map(([key, pal]) => {
                        const isSelected = activePalette === key;
                        const isLight = document.documentElement.classList.contains('light-theme');
                        const colors = isLight ? pal.light : pal.dark;
                        return (
                          <button
                            key={key}
                            onClick={() => setActivePalette(key)}
                            className={`flex items-center gap-2.5 px-3 py-2 rounded-sm border transition-all hover:scale-[1.03] active:scale-[0.97] text-left ${
                              isSelected
                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] font-bold shadow-sm'
                                : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <span 
                              className="w-3 h-3 rounded-sm shrink-0 border border-black/10 shadow-sm"
                              style={{ backgroundColor: colors.accent }}
                            />
                            <span className="text-xs truncate font-sans">{pal.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-serif">App Typography Style</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {Object.entries(FONT_STYLES).map(([key, style]) => {
                        const isSelected = fontStyle === key;
                        return (
                          <button
                            key={key}
                            onClick={() => setFontStyle(key)}
                            className={`flex flex-col p-2.5 rounded-sm border transition-all hover:scale-[1.02] active:scale-[0.98] text-left ${
                              isSelected
                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] font-bold shadow-sm'
                                : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <span className="text-xs font-bold truncate w-full" style={{ fontFamily: style.header }}>{style.label}</span>
                            <span className="text-[8px] text-[var(--text-muted)] mt-0.5 leading-normal truncate w-full" style={{ fontFamily: style.body }}>Sample Text</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="flex flex-col gap-2.5">
                    <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-serif">Default Tone & Language Style</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {LANGUAGE_STYLES.map(style => {
                        const isSelected = languageStyle === style.id;
                        return (
                          <button
                            key={style.id}
                            onClick={() => setLanguageStyle(style.id)}
                            className={`flex flex-col p-3 rounded-sm border transition-all hover:scale-[1.02] active:scale-[0.98] text-left ${
                              isSelected
                                ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5 text-[var(--text-primary)] font-bold shadow-sm'
                                : 'border-[var(--panel-border)] bg-[var(--input-bg)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                          >
                            <span className="text-xs font-serif">{style.label}</span>
                            <span className="text-[9px] text-[var(--text-muted)] mt-0.5 font-sans leading-normal">{style.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'admin' && currentUser?.role === 'admin' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Admin Panel: Member Management</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Add new members or admins to the application. Registered users are stored locally.
                    </p>
                  </div>
                  <hr className="border-[var(--panel-border)]" />
                  
                  <form onSubmit={handleAddMember} className="bg-[var(--input-bg)]/40 border border-[var(--panel-border)] rounded-sm p-4 space-y-3">
                    <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Add New User</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input 
                        type="text" 
                        placeholder="Username" 
                        value={newMemberName} 
                        onChange={e => setNewMemberName(e.target.value)} 
                        required 
                        className="spotify-input font-mono text-[11px]" 
                      />
                      <input 
                        type="password" 
                        placeholder="Password" 
                        value={newMemberPass} 
                        onChange={e => setNewMemberPass(e.target.value)} 
                        required 
                        className="spotify-input font-mono text-[11px]" 
                      />
                      <select 
                        value={newMemberRole} 
                        onChange={e => setNewMemberRole(e.target.value)} 
                        className="spotify-input font-mono text-[11px]"
                      >
                        <option value="member">Member</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full btn-premium py-2 text-[10px]">
                      Register User
                    </button>
                  </form>

                  <div className="mt-2">
                    <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider mb-2">Registered Users ({registeredUsers.length})</h4>
                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                      {registeredUsers.map((u, i) => {
                        const isVisible = visibleUserIndices.includes(i);
                        return (
                          <div 
                            key={i} 
                            onClick={() => togglePasswordVisibility(i)}
                            className="flex items-center justify-between p-2.5 rounded-sm border border-[var(--panel-border)] bg-[var(--input-bg)]/40 hover:bg-[var(--sidebar-hover-bg)] cursor-pointer transition-all select-none group"
                            title="Click to toggle password visibility"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="text-xs font-bold text-[var(--text-primary)]">{u.username}</span>
                              <span className="text-[9px] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] font-mono flex items-center gap-1.5 transition-colors">
                                Password: {isVisible ? u.password : '••••••••'}
                                {isVisible ? <EyeOff className="w-3 h-3 text-[var(--accent-color)] shrink-0" /> : <Eye className="w-3 h-3 text-neutral-500 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />}
                              </span>
                            </div>
                            <span className={`badge ${u.role === 'admin' ? 'badge-orange' : 'badge-gray'} shrink-0`}>
                              {u.role}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'compression' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 font-serif">Com100X Engine Configuration</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                      Configure your prompt compression endpoint. Pgents standardizes on the Com100X Python microservice (FastAPI + LLMLingua-2) for high-performance semantic prompt pruning.
                    </p>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="space-y-4">
                    <div className="flex flex-col gap-1.5 animate-fadeIn">
                      <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider font-serif">Com100X API Endpoint</label>
                      <input
                        type="text"
                        placeholder="http://localhost:8000"
                        value={com100xEndpoint}
                        onChange={e => setCom100xEndpoint(e.target.value)}
                        className="spotify-input font-mono text-[11px]"
                      />
                      <span className="text-[9px] text-[var(--text-muted)] leading-normal mt-0.5 font-sans">
                        Ensure the Com100X Python microservice is active at this port. The engine loads the XLM-RoBERTa meetingbank model (~1.5GB RAM) for semantic reduction.
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'bridge' && (
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1 font-serif">Pgents Browser Bridge — User Guide</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                      The Chrome Extension Bridge enables **Zero-API Mode** (fully free). It securely routes dashboard queries directly to your logged-in consumer account on <code>https://gemini.google.com</code>, submits the prompts, and streams Gemini's responses back in real time!
                    </p>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 max-h-[280px]">
                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">🛠️ Step 1: Install the Extension</h4>
                      <ol className="list-decimal pl-4 text-xs text-[var(--text-secondary)] space-y-1 font-sans">
                        <li>Open your Google Chrome browser.</li>
                        <li>Go to <code>chrome://extensions/</code> in the URL bar.</li>
                        <li>In the top right, toggle <strong>Developer mode</strong> to <strong>ON</strong>.</li>
                        <li>In the top left, click <strong>Load unpacked</strong>.</li>
                        <li>Select the folder: <code>d:\Desktop\Projec 1 AG\extension</code>.</li>
                        <li>The <strong>"Pgents Browser Bridge"</strong> extension is now loaded!</li>
                      </ol>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">🚀 Step 2: Establish the Connection</h4>
                      <ol className="list-decimal pl-4 text-xs text-[var(--text-secondary)] space-y-1 font-sans">
                        <li>Open a new tab and go to <a href="https://gemini.google.com/" target="_blank" rel="noreferrer" className="text-[var(--accent-color)] hover:underline">https://gemini.google.com</a>. Make sure you are signed in.</li>
                        <li>In the Pgents header bar, toggle the <strong>Bridge</strong> switch to <strong>ON</strong>.</li>
                        <li>Ensure your active AI Provider in the sidebar is set to <strong>Google Gemini</strong>.</li>
                      </ol>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-wider font-mono">💡 Step 3: Run Prompts for Free</h4>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-sans">
                        Type any prompt or select any skill and click <strong>Send</strong>. Under the hood, Pgents routes the request to your open Gemini tab, triggers execution, and captures the streaming result. <em>Note: Keep the Gemini tab open in Chrome while using the bridge.</em>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {settingsTab === 'terms' && (
                <div className="flex flex-col gap-4 h-full">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">Terms & Conditions</h3>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      Please read our license terms and data compliance policies below.
                    </p>
                  </div>

                  <hr className="border-[var(--panel-border)]" />

                  <div className="flex-1 overflow-y-auto bg-[var(--input-bg)]/40 border border-[var(--panel-border)] rounded-sm p-3 text-[11px] text-[var(--text-secondary)] leading-relaxed max-h-[250px] space-y-3 font-mono">
                    <p className="font-bold text-[var(--text-primary)]">1. INTRODUCTION</p>
                    <p>
                      Welcome to Pgents. By accessing or using this local application, you agree to comply with and be bound by the terms and conditions outlined herein. This client is a Bring-Your-Own-Key (BYOK) interface.
                    </p>
                    <p className="font-bold text-[var(--text-primary)]">2. DATA SECURITY & PRIVACY</p>
                    <p>
                      All API credentials, configurations, and chat histories are stored exclusively in your browser's local storage database. No keys, prompts, or logs are transmitted to any third-party analytics servers or intermediate databases. All network requests are dispatched directly from your browser client to the corresponding LLM API provider endpoint (Google Gemini, OpenAI, Groq, Anthropic, or local server instances).
                    </p>
                    <p className="font-bold text-[var(--text-primary)]">3. API PROVIDER RESPONSIBILITY</p>
                    <p>
                      You are sole owner of your API credentials. You are subject to the terms of service, usage policies, and billing rates of each individual API provider configured in settings. We do not assume any liability for API charges incurred through usage of this application.
                    </p>
                    <p className="font-bold text-[var(--text-primary)]">4. LICENSE & FAIR USE</p>
                    <p>
                      Pgents is distributed under open-source client-side developer terms. You are free to modify, compile, and deploy custom variants of the tool for personal or internal commercial operations.
                    </p>
                    <p className="font-bold text-[var(--text-primary)]">5. LIMITATION OF LIABILITY</p>
                    <p>
                      This application is provided "as is", without warranty of any kind, express or implied. Under no circumstances shall the authors be liable for any direct, indirect, special, or consequential damages resulting from connection failure, API rate limiting, key compromise, or data loss.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
