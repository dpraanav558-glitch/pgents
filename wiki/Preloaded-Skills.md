# Preloaded Deterministic AI Skills

Pgents comes pre-loaded with 10 highly engineered "Skills" (System Prompts). These skills are designed to enforce smaller models to output structured, deterministic, and high-tier results by applying strict schema constraints and analytical frameworks.

Here is a breakdown of the 10 available skills in the Studio:

---

## 📂 Skill Catalog

### 1. Vapor-Slide Deck Builder
* **Goal:** Converts raw research data, outlines, or transcripts into beautifully structured markdown slide decks.
* **Outputs:** Includes slide-by-slide transitions, layout guidelines (e.g., split-column, dark-mode styling hints), and detailed speaker notes.

### 2. SWOT Strategic Deep-Dive
* **Goal:** Conducts a rigorous competitive analysis.
* **Outputs:** Generates a structured grid covering Strengths, Weaknesses, Opportunities, and Threats, followed by an actionable execution checklist.

### 3. Enterprise Spec-Doc Engine
* **Goal:** Translates high-level feature ideas into system architecture specifications.
* **Outputs:** Produces database schema designs, OpenAPI/REST API contracts, error state handlings, and performance guidelines.

### 4. Code Review Compiler
* **Goal:** Critiques source code submissions across multiple axes.
* **Outputs:** Evaluates readability, performance, and security vulnerabilities, compiling results into a graded scorecard with inline remediation diffs.

### 5. API Integration Synthesizer
* **Goal:** Converts raw JSON/YAML payloads or API endpoints into production-ready client SDK wrappers.
* **Outputs:** Automatically writes client code in Python, Node.js, and Go.

### 6. SEO Semantic Optimizer
* **Goal:** Scrapes and optimizes copywriting drafts to rank for target keywords.
* **Outputs:** Provides optimized versions of headers, body copy, meta descriptions, and calculates exact keyword density matching optimal search intent.

### 7. Database Schema Architect
* **Goal:** Translates natural language entity relationships into index-optimized database scripts.
* **Outputs:** Produces standard-compliant SQL (PostgreSQL/MySQL) or MongoDB schemas complete with index suggestions.

### 8. Data Pipeline Synthesizer
* **Goal:** Automates data loading, cleansing, and profiling.
* **Outputs:** Generates clean Pandas, PySpark, or SQL data pipelines, complete with data type validation checks.

### 9. Security Hardening Compiler
* **Goal:** Audits dockerfiles, configurations, and scripts for security gaps.
* **Outputs:** Produces CIS benchmark checklists, container hardening guidelines, and patch diff compiles.

### 10. UX Copywriter & Tone Tuner
* **Goal:** Tunes application alerts, errors, and microcopy to match specific brand voices.
* **Outputs:** Translates dry system descriptions into Tone variations (Professional, Playful, or High-Priority Emergency).

---

## 🎨 Customizing & Adding Skills
If you want to edit the prompts or add your own, locate the `SKILLS` registry array inside:
👉 [src/App.jsx](file:///D:/Desktop/Antigravity/Projec%201%20AG/src/App.jsx)

Each skill is defined using the following structure:
```javascript
{
  id: "unique-skill-id",
  name: "Display Name",
  icon: IconComponent, // Lucide React icon
  description: "Short summary...",
  prompt: "Rigorous system directives go here..."
}
```
