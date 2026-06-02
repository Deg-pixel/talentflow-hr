# TalentFlow HR

A polished, zero-cost HR dashboard for an IT staffing & consulting company. Built with React + Vite + Tailwind + Recharts + @dnd-kit. Includes a kanban candidate pipeline, job requisitions, client management, an interview tracker with calendar view, analytics with charts, training (HTD) tracker, recruiter team module, and a Settings page for AI provider (Ollama, OpenAI, Anthropic, Gemini) with **local-template fallback so AI features work even without a key**.

> **Demo only.** All data is fictional. Changes are saved to your browser's `localStorage` — nothing is sent to any server unless you explicitly configure an AI provider.

## Live features

- 📊 **Overview** — KPIs, monthly placements bar chart, candidates-by-tech pie, recent activity feed
- 👥 **Candidate Pipeline** — drag-and-drop kanban with 6 stages, filters by tech / experience / client
- 📁 **Job Requisitions** — sortable filterable table, status badges, modal form with **AI-drafted job description**
- 🏢 **Clients** — industry-tagged cards, expandable open roles per client
- 📅 **Interviews** — list + calendar toggle, color-coded rounds, **AI-drafted feedback notes**
- 📈 **Analytics** — donut/bar charts, recruiter performance ranking, revenue split
- 🎓 **Training** — HTD (Hire → Train → Deploy) pipeline, batch progress bars
- 👤 **Team** — recruiter profile cards with KPIs
- ⚙️ **Settings** — pick Ollama / API key / off, test connection, reset demo data

## Run locally

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Deploy to Vercel (free)

This project is pre-configured for Vercel's Hobby (free) plan via `vercel.json`. SPA routing, immutable asset caching, and basic security headers are already wired up.

### Option A — via GitHub (recommended)

1. **Create a new GitHub repo** at <https://github.com/new>. Pick a name like `talentflow-hr`. Don't initialize with a README — this repo already has one.

2. **Push this directory to GitHub** (run from the project root):

   ```bash
   git remote add origin https://github.com/<your-username>/talentflow-hr.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Vercel:**
   - Go to <https://vercel.com/new>
   - Click "Import" next to your `talentflow-hr` repo
   - Vercel auto-detects Vite — leave the defaults
   - Click "Deploy"
   - Done. You'll get a live URL like `https://talentflow-hr.vercel.app` in ~30 seconds

Every push to `main` after this auto-redeploys.

### Option B — via Vercel CLI

```bash
npx vercel login    # opens browser once
npx vercel --prod   # deploys
```

## Configure AI (optional, all free)

The app works out of the box with **local templates** (no AI required). For higher-quality output, install Ollama:

1. Install: <https://ollama.com/download>
2. Pull a model: `ollama pull llama3.2`
3. Run: `ollama serve`
4. In the app: **Settings → Test Connection** → done

Or plug in any cloud API key (OpenAI / Anthropic / Gemini / custom OpenAI-compatible endpoint) under **Settings → Cloud API Key**. Keys are stored in your browser's `localStorage` only — they never leave the device.

## Tech stack

- React 18 + Vite
- Tailwind CSS 3
- React Router v6
- Recharts
- @dnd-kit/core (kanban drag-and-drop)
- Lucide React (icons)
- No backend, no database, no analytics
