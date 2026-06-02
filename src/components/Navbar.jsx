import { Search, Bell, Plus, Menu, Sparkles, HelpCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { loadSettings, statusLabel } from '../lib/aiSettings'
import SearchPalette from './SearchPalette'
import NotificationsDropdown from './NotificationsDropdown'
import HelpDialog from './HelpDialog'

const titleMap = {
  '/': { title: 'Overview', subtitle: 'Your staffing & consulting cockpit at a glance' },
  '/pipeline': { title: 'Candidate Pipeline', subtitle: 'Drag candidates through the hiring funnel' },
  '/jobs': { title: 'Job Requisitions', subtitle: 'Track every client requirement in one place' },
  '/clients': { title: 'Clients', subtitle: 'Accounts, contacts and revenue at a glance' },
  '/interviews': { title: 'Interview Tracker', subtitle: 'Calendar & feedback across rounds' },
  '/analytics': { title: 'Analytics & Reports', subtitle: 'Performance, revenue, and source intelligence' },
  '/training': { title: 'Training Tracker', subtitle: 'HTD batches and bench readiness' },
  '/team': { title: 'Recruiter Team', subtitle: 'Track team performance and workload' },
  '/settings': { title: 'Settings', subtitle: 'Configure AI provider, API keys, and Ollama' },
}

const NEW_LABEL = {
  '/': 'Candidate',
  '/pipeline': 'Candidate',
  '/jobs': 'Requirement',
  '/interviews': 'Interview',
  '/clients': 'Client',
  '/team': 'Recruiter',
  '/training': 'Batch',
}

const NEW_TARGET = {
  '/': '/pipeline',
  '/pipeline': '/pipeline',
  '/jobs': '/jobs',
  '/interviews': '/interviews',
  '/clients': '/clients',
  '/training': '/training',
}

const TONE = {
  teal: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  blue: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  amber: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  slate: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

export default function Navbar({ onToggleSidebar }) {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const meta = titleMap[pathname] || { title: 'TalentFlow HR', subtitle: '' }
  const newLabel = NEW_LABEL[pathname] || 'Item'

  const [aiStatus, setAiStatus] = useState(() => statusLabel(loadSettings()))
  const [searchOpen, setSearchOpen] = useState(false)
  const [bellOpen, setBellOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const bellRef = useRef(null)

  useEffect(() => {
    const sync = () => setAiStatus(statusLabel(loadSettings()))
    window.addEventListener('talentflow:ai-settings-changed', sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener('talentflow:ai-settings-changed', sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen(o => !o)
      }
      if (e.key === '?' && !['INPUT','TEXTAREA','SELECT'].includes(document.activeElement?.tagName)) {
        e.preventDefault()
        setHelpOpen(o => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const handleNew = () => {
    const target = NEW_TARGET[pathname] || '/pipeline'
    if (target !== pathname) nav(target)
    setTimeout(() => window.dispatchEvent(new CustomEvent('talentflow:new', { detail: { path: target } })), 60)
  }

  return (
    <header className="sticky top-0 z-20 bg-navy-900/80 backdrop-blur border-b border-navy-700/60">
      <div className="flex items-center justify-between gap-4 px-6 h-16">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-navy-700/60 text-slate-400 hover:text-white"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h1 className="text-white text-lg font-semibold truncate">{meta.title}</h1>
            <p className="text-xs text-slate-400 truncate">{meta.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2 bg-navy-800/70 border border-navy-700 hover:border-accent-blue/40 rounded-lg px-3 py-1.5 w-72 transition"
          >
            <Search className="w-4 h-4 text-slate-500" />
            <span className="bg-transparent text-sm w-full text-left text-slate-500">Search candidates, jobs, clients…</span>
            <kbd className="hidden lg:inline text-[10px] text-slate-500 border border-navy-600 rounded px-1.5 py-0.5">⌘K</kbd>
          </button>
          <Link
            to="/settings"
            title="AI provider settings"
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold uppercase tracking-wider transition hover:brightness-125 ${TONE[aiStatus.tone] || TONE.slate}`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="normal-case tracking-normal max-w-[14ch] truncate">{aiStatus.label}</span>
          </Link>
          <button
            onClick={() => setHelpOpen(true)}
            title="Keyboard shortcuts (press ?)"
            aria-label="Help"
            className="hidden md:inline-flex p-2 rounded-lg bg-navy-800/70 border border-navy-700 hover:border-accent-blue/40 text-slate-300 transition"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
          <div className="relative">
            <button
              ref={bellRef}
              onClick={() => setBellOpen(o => !o)}
              className={`relative p-2 rounded-lg bg-navy-800/70 border transition ${bellOpen ? 'border-accent-blue/60' : 'border-navy-700 hover:border-accent-blue/40'}`}
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-slate-300" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent-teal animate-pulse" />
            </button>
            <NotificationsDropdown open={bellOpen} anchorRef={bellRef} onClose={() => setBellOpen(false)} />
          </div>
          <button onClick={handleNew} title={`Add new ${newLabel.toLowerCase()}`} className="btn-primary !py-1.5">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New {newLabel}</span>
          </button>
          <div className="flex items-center gap-2 pl-2 ml-1 border-l border-navy-700">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent-blue to-accent-teal text-white text-xs font-bold flex items-center justify-center">
              DU
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-medium text-white">Demo User</div>
              <div className="text-[11px] text-slate-400">Admin</div>
            </div>
          </div>
        </div>
      </div>
      <SearchPalette open={searchOpen} onClose={() => setSearchOpen(false)} />
      <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />
    </header>
  )
}
