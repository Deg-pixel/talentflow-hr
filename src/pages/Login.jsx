import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, Loader2, ShieldCheck, AlertTriangle, ExternalLink, Zap } from 'lucide-react'
import { signIn, signUp, signInAsDemo, DEMO_PROFILES, useAuth } from '../lib/auth'

const ROLES = ['Admin', 'Recruitment Lead', 'Senior Recruiter', 'Recruiter', 'Account Manager', 'Trainer']

export default function Login() {
  const user = useAuth()
  if (user) return <Navigate to="/" replace />

  const nav = useNavigate()
  const [tab, setTab] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Recruiter', remember: true })
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setBusy(true); setError('')
    try {
      await new Promise(r => setTimeout(r, 350)) // small delay so it feels real
      if (tab === 'signin') signIn(form)
      else signUp(form)
      nav('/', { replace: true })
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  const useDemo = (profile) => { signInAsDemo(profile); nav('/', { replace: true }) }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* ambient gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-accent-blue/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-accent-teal/20 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/5 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        {/* Pitch side */}
        <div className="hidden md:block space-y-6 pr-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center shadow-glow-blue">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold tracking-tight">TalentFlow HR</h1>
              <p className="text-xs uppercase tracking-widest text-accent-teal font-semibold">HR Suite</p>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white leading-tight">
            The all-in-one cockpit for <span className="bg-gradient-to-r from-accent-blue to-accent-teal bg-clip-text text-transparent">IT staffing teams.</span>
          </h2>
          <p className="text-slate-400 leading-relaxed">
            Drag candidates through the pipeline, draft job descriptions with AI, run an interview calendar, and watch your bench train and deploy — all in one polished dashboard.
          </p>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <Bullet color="blue" text="6-stage drag-and-drop candidate kanban" />
            <Bullet color="teal" text="AI assistant: Ollama, OpenAI, Anthropic, Gemini, or offline templates" />
            <Bullet color="purple" text="No backend · no database · all data lives in your browser" />
            <Bullet color="amber" text="100% free · open-source · MIT licensed" />
          </ul>
          <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
            <a href="https://github.com/Deg-pixel/talentflow-hr" target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-white transition">
              <ExternalLink className="w-3.5 h-3.5" /> github.com/Deg-pixel/talentflow-hr
            </a>
            <span className="text-slate-700">·</span>
            <span className="inline-flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-accent-amber" /> Deployed on Vercel</span>
          </div>
        </div>

        {/* Auth card */}
        <div className="card p-6 sm:p-8 animate-fade-in">
          <div className="md:hidden flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center shadow-glow-blue">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div className="leading-tight">
              <div className="text-white font-bold text-base tracking-tight">TalentFlow</div>
              <div className="text-[10px] uppercase tracking-widest text-accent-teal font-semibold">HR Suite</div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-white">Welcome back</h2>
          <p className="text-xs text-slate-400 mt-1">Sign in to continue. <strong className="text-accent-teal">Any email + 6-char password</strong> works — this is a fully local demo.</p>

          <div className="inline-flex rounded-lg bg-navy-900/60 border border-navy-700 p-1 mt-4">
            <button
              type="button"
              onClick={() => { setTab('signin'); setError('') }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${tab === 'signin' ? 'bg-accent-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >Sign In</button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setError('') }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${tab === 'signup' ? 'bg-accent-blue text-white' : 'text-slate-400 hover:text-white'}`}
            >Sign Up</button>
          </div>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            {tab === 'signup' && (
              <Wrap icon={UserIcon}>
                <input type="text" required placeholder="Full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-500" />
              </Wrap>
            )}
            <Wrap icon={Mail}>
              <input type="email" autoComplete="email" required placeholder="you@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-500" />
            </Wrap>
            <Wrap icon={Lock}>
              <input type={showPw ? 'text' : 'password'} autoComplete={tab === 'signin' ? 'current-password' : 'new-password'} required placeholder="Password (6+ chars)" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="bg-transparent flex-1 outline-none text-sm text-slate-200 placeholder-slate-500" />
              <button type="button" onClick={() => setShowPw(s => !s)} className="p-1 rounded text-slate-400 hover:text-white" aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </Wrap>
            {tab === 'signup' && (
              <Wrap>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="bg-transparent flex-1 outline-none text-sm text-slate-200">
                  {ROLES.map(r => <option key={r} value={r} className="bg-navy-800">{r}</option>)}
                </select>
              </Wrap>
            )}
            {tab === 'signin' && (
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.remember} onChange={e => setForm({ ...form, remember: e.target.checked })} className="accent-accent-blue" />
                  Remember me on this device
                </label>
                <button type="button" onClick={() => alert('This is a demo — passwords are not stored anywhere. Just enter any 6-char string.')} className="text-accent-blue hover:underline">Forgot?</button>
              </div>
            )}
            {error && (
              <div className="text-[11px] text-accent-rose inline-flex items-center gap-1.5 bg-accent-rose/10 border border-accent-rose/30 rounded-md p-2">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
              </div>
            )}
            <button type="submit" disabled={busy} className="btn-primary w-full justify-center disabled:opacity-50">
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {tab === 'signin' ? 'Sign In' : 'Create account'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-navy-700/70" />
            <span className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">or try the demo</span>
            <div className="flex-1 h-px bg-navy-700/70" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            {DEMO_PROFILES.map(p => (
              <button key={p.email} onClick={() => useDemo(p)} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-navy-900/40 border border-navy-700 hover:border-accent-blue/40 transition text-left">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal text-white text-[10px] font-bold flex items-center justify-center shrink-0">{p.avatar}</div>
                <div className="min-w-0">
                  <p className="text-[12px] text-white font-medium truncate">{p.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{p.role}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-5 flex items-center gap-2 text-[11px] text-slate-500 leading-snug">
            <ShieldCheck className="w-3.5 h-3.5 text-accent-teal shrink-0" />
            <span>No real authentication. No data sent to any server. Sign-in state lives in your browser's localStorage and is wiped on sign-out.</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function Wrap({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 bg-navy-900/60 border border-navy-700 hover:border-accent-blue/40 focus-within:border-accent-blue/60 focus-within:shadow-glow-blue rounded-lg px-3 py-2 transition">
      {Icon && <Icon className="w-4 h-4 text-slate-500" />}
      {children}
    </div>
  )
}

function Bullet({ color, text }) {
  const map = { blue: 'bg-accent-blue', teal: 'bg-accent-teal', purple: 'bg-accent-purple', amber: 'bg-accent-amber' }
  return (
    <li className="flex items-start gap-2.5">
      <span className={`w-1.5 h-1.5 rounded-full ${map[color]} mt-2 shrink-0`} />
      <span>{text}</span>
    </li>
  )
}
