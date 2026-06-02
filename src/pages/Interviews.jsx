import { useState, useMemo } from 'react'
import { interviews as seedInterviews, interviewRounds } from '../data/interviews'
import { usePersistedState } from '../lib/storage'
import { draftInterviewFeedback, AI_MODE_LABEL } from '../lib/aiClient'
import { Calendar as CalIcon, List, Video, MapPin, ChevronLeft, ChevronRight, CheckCircle2, XCircle, PauseCircle, Sparkles, Loader2, X } from 'lucide-react'

const ROUND_HUE = {
  R1: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  R2: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  FINAL: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  HR: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
}

const FEEDBACK_BADGE = {
  Passed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  Rejected: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
  'On Hold': 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  Pending: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

const ROUND_LABEL = { R1: '1st', R2: '2nd', FINAL: 'Final', HR: 'HR' }

export default function Interviews() {
  const [view, setView] = useState('list')
  const [items, setItems] = usePersistedState('interviews', seedInterviews)
  const [month, setMonth] = useState(new Date(2026, 5, 1))
  const [draftFor, setDraftFor] = useState(null) // interview object
  const [draftText, setDraftText] = useState('')
  const [draftBusy, setDraftBusy] = useState(false)
  const [draftError, setDraftError] = useState('')

  const setFeedback = (id, feedback) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, feedback } : i))
  }

  const openDraft = async (iv) => {
    setDraftFor(iv)
    setDraftText('')
    setDraftError('')
    setDraftBusy(true)
    try {
      const text = await draftInterviewFeedback(iv)
      setDraftText(text)
    } catch (err) {
      setDraftError(err.message || 'AI draft failed')
    } finally {
      setDraftBusy(false)
    }
  }

  const saveDraft = () => {
    setItems(prev => prev.map(i => i.id === draftFor.id ? { ...i, notes: draftText } : i))
    setDraftFor(null)
  }

  return (
    <div className="space-y-4">
      <div className="card p-3 flex items-center gap-2">
        <div className="inline-flex rounded-lg bg-navy-900/50 border border-navy-700 p-1">
          <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition ${view === 'list' ? 'bg-accent-blue text-white' : 'text-slate-400 hover:text-white'}`}>
            <List className="w-3.5 h-3.5" /> List
          </button>
          <button onClick={() => setView('calendar')} className={`px-3 py-1.5 text-xs font-medium rounded-md inline-flex items-center gap-1.5 transition ${view === 'calendar' ? 'bg-accent-blue text-white' : 'text-slate-400 hover:text-white'}`}>
            <CalIcon className="w-3.5 h-3.5" /> Calendar
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          <Legend />
        </div>
      </div>

      {view === 'list' ? (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-900/60 border-b border-navy-700">
                <tr>
                  <Th>Candidate</Th>
                  <Th>Role / Client</Th>
                  <Th>Round</Th>
                  <Th>Date & Time</Th>
                  <Th>Mode</Th>
                  <Th>Interviewer</Th>
                  <Th>Feedback</Th>
                </tr>
              </thead>
              <tbody>
                {items.map(iv => (
                  <tr key={iv.id} className="table-row">
                    <td className="px-4 py-3 text-sm text-white font-medium">{iv.candidate}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="text-slate-200">{iv.role}</div>
                      <div className="text-[11px] text-slate-500">{iv.client}</div>
                    </td>
                    <td className="px-4 py-3"><span className={`badge border ${ROUND_HUE[iv.round]}`}>{ROUND_LABEL[iv.round]} Round</span></td>
                    <td className="px-4 py-3 text-sm text-slate-200">
                      <div>{iv.date}</div>
                      <div className="text-[11px] text-slate-500">{iv.time}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300 inline-flex items-center gap-1">
                      {iv.mode === 'Online' ? <Video className="w-3.5 h-3.5 text-accent-blue" /> : <MapPin className="w-3.5 h-3.5 text-accent-teal" />}
                      {iv.mode}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-300">{iv.interviewer}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`badge border ${FEEDBACK_BADGE[iv.feedback]}`}>{iv.feedback}</span>
                        <div className="flex items-center gap-0.5">
                          <button title="Pass" onClick={() => setFeedback(iv.id, 'Passed')} className="p-1 rounded hover:bg-emerald-500/15 text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </button>
                          <button title="Reject" onClick={() => setFeedback(iv.id, 'Rejected')} className="p-1 rounded hover:bg-accent-rose/15 text-accent-rose">
                            <XCircle className="w-3.5 h-3.5" />
                          </button>
                          <button title="On Hold" onClick={() => setFeedback(iv.id, 'On Hold')} className="p-1 rounded hover:bg-accent-amber/15 text-accent-amber">
                            <PauseCircle className="w-3.5 h-3.5" />
                          </button>
                          <button title={`Draft feedback with ${AI_MODE_LABEL()}`} onClick={() => openDraft(iv)} className="p-1 rounded hover:bg-accent-blue/15 text-accent-blue">
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <CalendarView month={month} setMonth={setMonth} interviews={items} />
      )}

      {draftFor && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={() => setDraftFor(null)}>
          <div onClick={e => e.stopPropagation()} className="card max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-blue" /> AI Feedback Draft
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{draftFor.candidate} · {draftFor.role} · {ROUND_LABEL[draftFor.round]} Round</p>
              </div>
              <button onClick={() => setDraftFor(null)} className="p-1 rounded hover:bg-navy-700 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            {draftBusy && (
              <div className="rounded-lg bg-navy-900/40 border border-navy-700/40 p-6 text-center text-sm text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-accent-blue" />
                Drafting with {AI_MODE_LABEL()}…
              </div>
            )}
            {!draftBusy && (
              <textarea
                className="input min-h-[200px] text-xs leading-relaxed font-mono"
                value={draftText}
                onChange={e => setDraftText(e.target.value)}
              />
            )}
            {draftError && <p className="text-xs text-accent-rose">{draftError}</p>}
            <div className="flex items-center justify-between gap-2">
              <button onClick={() => openDraft(draftFor)} disabled={draftBusy} className="btn-secondary text-xs disabled:opacity-50">
                <RegenerateIcon /> Regenerate
              </button>
              <div className="flex gap-2">
                <button onClick={() => setDraftFor(null)} className="btn-secondary">Cancel</button>
                <button onClick={saveDraft} disabled={draftBusy || !draftText} className="btn-primary disabled:opacity-50">Save to Interview</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function RegenerateIcon() {
  return <Loader2 className="w-3.5 h-3.5" />
}

function Th({ children }) {
  return <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{children}</th>
}

function Legend() {
  return (
    <div className="flex items-center gap-3">
      {interviewRounds.map(r => (
        <span key={r.id} className="inline-flex items-center gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-sm ${ROUND_HUE[r.id].split(' ')[0]}`} />
          <span>{r.name}</span>
        </span>
      ))}
    </div>
  )
}

function CalendarView({ month, setMonth, interviews }) {
  const year = month.getFullYear()
  const m = month.getMonth()
  const first = new Date(year, m, 1)
  const startOffset = first.getDay()
  const daysInMonth = new Date(year, m + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  const monthLabel = first.toLocaleString('en-US', { month: 'long', year: 'numeric' })

  const ivByDay = useMemo(() => {
    const out = {}
    interviews.forEach(iv => {
      const dt = new Date(iv.date)
      if (dt.getFullYear() === year && dt.getMonth() === m) {
        const day = dt.getDate()
        out[day] = out[day] || []
        out[day].push(iv)
      }
    })
    return out
  }, [interviews, year, m])

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setMonth(new Date(year, m - 1, 1))} className="btn-secondary !py-1.5">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <h3 className="text-white font-semibold text-lg">{monthLabel}</h3>
        <button onClick={() => setMonth(new Date(year, m + 1, 1))} className="btn-secondary !py-1.5">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d} className="py-1.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          const list = d ? (ivByDay[d] || []) : []
          return (
            <div key={i} className={`min-h-[110px] rounded-lg border ${d ? 'border-navy-700/60 bg-navy-900/30' : 'border-transparent'} p-1.5 text-left`}>
              {d && (
                <>
                  <div className="text-xs text-slate-500 font-semibold mb-1">{d}</div>
                  <div className="space-y-1">
                    {list.slice(0, 3).map(iv => (
                      <div key={iv.id} className={`text-[10px] px-1.5 py-1 rounded border truncate ${ROUND_HUE[iv.round]}`}>
                        {iv.time} · {iv.candidate.split(' ')[0]}
                      </div>
                    ))}
                    {list.length > 3 && <div className="text-[10px] text-slate-500">+{list.length - 3} more</div>}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
