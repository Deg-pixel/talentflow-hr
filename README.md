<h1 align="center">TalentFlow HR</h1>

<p align="center">
  <strong>An all-in-one HR command center for IT staffing &amp; consulting firms — from sourcing to placement to bench training.</strong>
</p>

<p align="center">
  <a href="https://talentflow-hr-kappa.vercel.app">
    <img alt="Live Demo" src="https://img.shields.io/badge/Live%20Demo-talentflow--hr.vercel.app-3b82f6?style=for-the-badge&logo=vercel&logoColor=white">
  </a>
  <a href="#license">
    <img alt="License" src="https://img.shields.io/badge/License-MIT-14b8a6?style=for-the-badge">
  </a>
  <img alt="Built With" src="https://img.shields.io/badge/Built%20With-React%20%C2%B7%20Vite%20%C2%B7%20Tailwind-8b5cf6?style=for-the-badge">
  <img alt="Status" src="https://img.shields.io/badge/Status-Demo-f59e0b?style=for-the-badge">
</p>

<p align="center">
  <a href="https://talentflow-hr-kappa.vercel.app">🌐 Live Demo</a> ·
  <a href="#-what-is-talentflow-hr">About</a> ·
  <a href="#-feature-tour">Features</a> ·
  <a href="#-getting-started">Get Started</a> ·
  <a href="#-deploy-on-vercel">Deploy</a> ·
  <a href="#-tech-stack">Stack</a>
</p>

---

## 🎯 What is TalentFlow HR?

**TalentFlow HR** is a polished, dark-themed, end-to-end recruitment and bench-management dashboard designed for the day-to-day operations of an **IT staffing &amp; consulting company** — the kind of firm that places SAP, AWS, Salesforce, Java, and cybersecurity consultants into client roles at Cognizant, Infosys, Deloitte, TCS, and similar enterprises.

It models a **real talent-supply chain**:

> **Source** candidates → **Screen** &amp; interview them → **Place** them at client requirements → **Train** the bench (HTD: Hire-Train-Deploy) → **Measure** recruiter performance and revenue.

Everything in the demo is **mock data**. No backend. No database. No tracking. All state lives in your browser. AI features (job-description drafting, interview-feedback generation) work with three providers — **Ollama (local, free), any cloud API, or zero-config local templates** — picked from the Settings page.

### Who is it for?

- **Recruitment agencies &amp; staffing firms** that need a lightweight ATS-like view of their candidate pipeline, client requirements, and recruiter team
- **Bench managers** running HTD batches who need a single screen for batch progress, deployment readiness, and trainer utilization
- **Account managers** who want a per-client view of open roles, placements, and revenue
- **Engineering leads &amp; portfolio builders** looking for a fully-featured, production-style React + Tailwind reference app

### Why this stack?

| Goal | Decision |
|---|---|
| **No backend to maintain** | All data in `src/data/*.js`, persistence via `localStorage` |
| **Works offline / no internet** | Zero external calls unless you configure AI |
| **No vendor lock-in for AI** | Pluggable provider: Ollama, OpenAI, Anthropic, Gemini, custom OpenAI-compatible — plus offline template fallback |
| **Free hosting** | Static build, deploys in 30 seconds to Vercel's Hobby tier |
| **Fast UI** | Drag-and-drop kanban (@dnd-kit), beautiful charts (Recharts), smooth animations |

---

## ✨ Feature Tour

### 📊 Overview Dashboard
At-a-glance KPIs — open positions, candidates in pipeline, monthly placements, staffing revenue. Trend charts for the last 6 months. Pie chart of pipeline by technology. Recent activity feed (interviews, offers, joinings, rejections). Quick-snapshot panel for today's commitments.

### 👥 Candidate Pipeline (Kanban)
Six-column drag-and-drop board: **Sourced → Screening → Interview Scheduled → Offer Sent → Joined → Rejected**. Each card surfaces name, tech stack, experience, target client, source, location, expected CTC. Filter by technology, experience band, or client. Drops persist to `localStorage` instantly.

### 📁 Job Requisitions
Sortable, searchable table of every open client requirement. Columns: Job ID, Client, Role, Skills, Experience, Location, Date Posted, Status (Open / Filled / On Hold), Assigned Recruiter, Priority. **"New Requirement" modal** with a built-in **"Draft with AI"** button that generates a structured markdown job description from the role, skills, and client.

### 🏢 Client Management
One card per client company with industry tag (BFSI, Manufacturing, Healthcare, IT Services, Consulting, etc.), tier (Platinum / Gold / Silver), active requirements count, placements YTD, account manager, primary contact, and revenue. Expand any card to inline-view all that client's open roles.

### 📅 Interview Tracker
Toggle between a calendar grid (color-coded by interview round) and a detailed list view. Each interview shows candidate, role, client, round (1st / 2nd / Final / HR), date &amp; time, mode (Online / F2F), interviewer, and feedback status. **One-click Pass / Reject / Hold** buttons per row, plus an **AI-drafted feedback notes** modal that generates structured feedback (Strengths · Areas to Improve · Technical Depth · Communication · Recommendation), editable before saving.

### 📈 Analytics &amp; Reports
- Donut chart: placements by industry
- Bar chart: average time-to-fill per technology
- Pie chart: candidate source distribution (LinkedIn, Portal, Referral, Internal DB)
- Revenue tracker split across Staffing / Consulting / Training lines
- Ranked recruiter leaderboard with active reqs, pipeline size, placements, and conversion %

### 🎓 Training Tracker (HTD)
Visual **Hire → Train → Deploy** pipeline at the top with live counts. Below: each active training batch with technology badge, trainer, start/end dates, trainee count, delivery mode (Online / Offline / Hybrid), live progress bar, and deployment-ready status.

### 👤 Recruiter Team Module
Profile cards for every recruiter with role, email, active requisitions, current pipeline size, placements this month, and join date. Built for quick workload-balancing decisions.

### ⚙️ Settings — AI Assistant
- Pick **Ollama (local, free)**, **Cloud API**, or **Off**
- Cloud providers: **OpenAI**, **Anthropic Claude**, **Google Gemini**, or any **custom OpenAI-compatible** endpoint
- **Test Connection** button hits the real provider endpoint
- **Reset Demo Data** wipes local state and reloads the seed
- API keys are stored **only in your browser's localStorage** — they never leave the device

---

## 🤖 The "no money required" AI design

Most AI dashboards force you to bring an API key. TalentFlow doesn't. There are three tiers, with seamless fallback:

```
┌─────────────────────────────────────────────────────────────┐
│  1. Ollama  (local, free, recommended)                     │
│     → tried first if configured                             │
├─────────────────────────────────────────────────────────────┤
│  2. Cloud API key  (OpenAI / Anthropic / Gemini / Custom)   │
│     → tried if Ollama unreachable                           │
├─────────────────────────────────────────────────────────────┤
│  3. Local template engine  (always works, no internet)      │
│     → final fallback — still produces real, editable text   │
└─────────────────────────────────────────────────────────────┘
```

You can use every "AI" feature in the app with **zero setup, zero accounts, zero cost** — the local template engine produces real, structured, editable job descriptions and interview feedback even with no provider configured.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- (Optional) [Ollama](https://ollama.com/download) for free local AI

### Run locally

```bash
git clone https://github.com/Deg-pixel/talentflow-hr.git
cd talentflow-hr
npm install
npm run dev
```

Open <http://localhost:5173>. Done.

### Enable better AI (optional)
```bash
# install Ollama from https://ollama.com/download
ollama pull llama3.2
ollama serve
# → in the app: Settings → Test Connection → Save
```

---

## ☁️ Deploy on Vercel

The repo includes a pre-configured [`vercel.json`](vercel.json) with SPA rewrites, immutable asset caching, and security headers. Two paths:

### Path A — GitHub → Vercel (auto-redeploy)
1. Fork or clone this repo to your GitHub
2. Open <https://vercel.com/new>, import the repo
3. Click **Deploy** — defaults are correct (framework: Vite)
4. Every `git push` after this auto-redeploys

### Path B — Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

**Both paths are free** on Vercel's Hobby tier — no card required.

---

## 🛠️ Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **React 18 + Vite** | Fast HMR, tiny config, modern JSX |
| Styling | **Tailwind CSS 3** | Utility classes, dark theme tokens |
| Routing | **React Router v6** | Standard SPA routing |
| Charts | **Recharts** | Declarative, accessible, themable |
| Drag &amp; Drop | **@dnd-kit/core** | Modern, accessible, performant |
| Icons | **Lucide React** | Crisp, tree-shakeable |
| State | **localStorage** + custom `usePersistedState` hook | Zero backend, survives reload |
| AI | **Pluggable client** (Ollama / OpenAI / Anthropic / Gemini / template) | Provider-agnostic |
| Hosting | **Vercel Hobby** | Free, instant, HTTPS, global CDN |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Sidebar.jsx          # collapsible sidebar nav with icons
│   ├── Navbar.jsx           # top bar with search, AI status chip, demo avatar
│   ├── Layout.jsx           # shell composing Sidebar + Navbar + DemoBanner
│   ├── DemoBanner.jsx       # dismissable "mock data" notice
│   ├── KPICard.jsx          # gradient KPI tile
│   └── CandidateCard.jsx    # draggable kanban card
├── pages/
│   ├── Dashboard.jsx        # KPIs + charts + activity feed
│   ├── Pipeline.jsx         # 6-column kanban with filters
│   ├── JobRequisitions.jsx  # sortable table + new-job modal w/ AI JD
│   ├── Clients.jsx          # client cards with expandable open roles
│   ├── Interviews.jsx       # list/calendar toggle + AI feedback drafter
│   ├── Analytics.jsx        # charts + recruiter leaderboard
│   ├── Training.jsx         # HTD pipeline + batch cards
│   ├── Team.jsx             # recruiter profile grid
│   └── Settings.jsx         # AI provider + reset demo data
├── data/
│   ├── candidates.js
│   ├── jobs.js
│   ├── clients.js
│   ├── interviews.js
│   ├── trainings.js
│   └── overview.js
└── lib/
    ├── storage.js           # usePersistedState hook
    ├── aiSettings.js        # provider config + connection tests
    └── aiClient.js          # unified generate() with template fallback
```

---

## 🔒 Privacy &amp; Data

- **No analytics, no telemetry, no tracking** — open `src/` and verify
- **No backend, no database** — the app is a static SPA
- **AI keys never leave your browser** — stored only in `localStorage`
- **All candidates / clients / recruiters in the demo are fictional**

---

## 📸 Screenshots

> Coming soon — drop screenshots into `public/screenshots/` and reference them here.

---

## 📄 License

[MIT](LICENSE) © 2026 — free to use, fork, modify, and distribute. Attribution appreciated but not required.

---

<p align="center">
  Made for IT staffing teams who deserve a dashboard that actually looks good. 🚀
</p>
