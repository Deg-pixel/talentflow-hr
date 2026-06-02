import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X, Users, Briefcase, Building2, CalendarDays, GraduationCap } from 'lucide-react'
import { readStored } from '../lib/storage'
import { candidates as seedCandidates } from '../data/candidates'
import { jobs as seedJobs } from '../data/jobs'
import { clients as seedClients } from '../data/clients'
import { interviews as seedInterviews } from '../data/interviews'
import { recruiters, trainings } from '../data/trainings'

export default function SearchPalette({ open, onClose }) {
  const [q, setQ] = useState('')
  const inputRef = useRef(null)
  const nav = useNavigate()

  useEffect(() => {
    if (open) {
      setQ('')
      setTimeout(() => inputRef.current?.focus(), 30)
    }
  }, [open])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return []
    const cands = readStored('candidates', seedCandidates)
    const jobs = readStored('jobs', seedJobs)
    const ivs = readStored('interviews', seedInterviews)
    const out = []
    cands.forEach(c => {
      if (match(term, c.name, c.tech, c.client, c.location, c.email)) out.push({ kind: 'Candidate', icon: Users, label: c.name, sub: `${c.tech} · ${c.experience}y · ${c.client || '—'}`, to: '/pipeline' })
    })
    jobs.forEach(j => {
      if (match(term, j.id, j.role, j.client, (j.skills || []).join(' '), j.location, j.recruiter)) out.push({ kind: 'Job', icon: Briefcase, label: `${j.id} — ${j.role}`, sub: `${j.client} · ${j.status}`, to: '/jobs' })
    })
    seedClients.forEach(cl => {
      if (match(term, cl.name, cl.industry, cl.accountManager)) out.push({ kind: 'Client', icon: Building2, label: cl.name, sub: `${cl.industry} · ${cl.activeReqs} active reqs`, to: '/clients' })
    })
    ivs.forEach(iv => {
      if (match(term, iv.candidate, iv.role, iv.client, iv.interviewer)) out.push({ kind: 'Interview', icon: CalendarDays, label: `${iv.candidate} → ${iv.client}`, sub: `${iv.role} · ${iv.date} ${iv.time}`, to: '/interviews' })
    })
    recruiters.forEach(r => {
      if (match(term, r.name, r.role, r.email)) out.push({ kind: 'Recruiter', icon: Users, label: r.name, sub: `${r.role} · ${r.placements} placements`, to: '/team' })
    })
    trainings.forEach(t => {
      if (match(term, t.batchName, t.tech, t.trainer)) out.push({ kind: 'Training', icon: GraduationCap, label: t.batchName, sub: `${t.tech} · ${t.status}`, to: '/training' })
    })
    return out.slice(0, 30)
  }, [q])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pt-20 px-4 animate-fade-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="card max-w-xl mx-auto overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-navy-700/60">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search candidates, jobs, clients, interviews, recruiters…"
            className="flex-1 bg-transparent outline-none text-sm text-slate-200 placeholder-slate-500"
            onKeyDown={(e) => { if (e.key === 'Escape') onClose() }}
          />
          <kbd className="hidden sm:inline text-[10px] text-slate-500 border border-navy-600 rounded px-1.5 py-0.5">Esc</kbd>
          <button onClick={onClose} className="p-1 rounded hover:bg-navy-700 text-slate-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {!q.trim() ? (
            <div className="p-6 text-center text-xs text-slate-500">
              Start typing to search across the entire dataset.<br />Press <kbd className="text-[10px] text-slate-400 border border-navy-600 rounded px-1.5 py-0.5">Ctrl/⌘ K</kbd> any time to open this.
            </div>
          ) : results.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">No matches for "<span className="text-slate-300">{q}</span>".</div>
          ) : (
            <ul>
              {results.map((r, i) => {
                const Icon = r.icon
                return (
                  <li key={i}>
                    <button
                      onClick={() => { nav(r.to); onClose() }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-navy-700/40 text-left transition"
                    >
                      <Icon className="w-4 h-4 text-accent-teal shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{r.label}</p>
                        <p className="text-[11px] text-slate-500 truncate">{r.sub}</p>
                      </div>
                      <span className="badge bg-navy-700 text-slate-400 border border-navy-600 text-[10px]">{r.kind}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

function match(term, ...fields) {
  return fields.some(f => f && f.toString().toLowerCase().includes(term))
}
