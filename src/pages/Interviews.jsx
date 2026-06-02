import { useEffect, useMemo, useState } from 'react'
import { interviews as seedInterviews, interviewRounds } from '../data/interviews'
import { usePersistedState } from '../lib/storage'
import { draftInterviewFeedback, AI_MODE_LABEL } from '../lib/aiClient'
import Modal, { Field } from '../components/Modal'
import { Calendar as CalIcon, List, Video, MapPin, ChevronLeft, ChevronRight, CheckCircle2, XCircle, PauseCircle, Sparkles, Loader2, Plus, Trash2 } from 'lucide-react'

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

const blank = { candidate: '', role: '', client: '', round: 'R1', date: new Date(2026, 5, 15).toISOString().slice(0,10), time: '10:00', mode: 'Online', interviewer: '', feedback: 'Pending', notes: '' }

export default function Interviews() {
  const [view, setView] = useState('list')
  const [items, setItems] = usePersistedState('interviews', seedInterviews)
  const [month, setMonth] = useState(new Date(2026, 5, 1))
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blank)
  const [draftBusy, setDraftBusy] = useState(false)
  const [draftError, setDraftError] = useState('')

  const openCreate = () => { setForm(blank); setEditingId(null); setDraftError(''); setModalOpen(true) }
  const openEdit = (iv) => { setForm({ ...iv }); setEditingId(iv.id); setDraftError(''); setModalOpen(true) }

  // Listen for navbar "+ New"
  useEffect(() => {
    const onNew = (e) => { if (e.detail?.entity === 'interview' || e.detail?.path === '/interviews') openCreate() }
    window.addEventListener('talentflow:new', onNew)
    return () => window.removeEventListener('talentflow:new', onNew)
  }, [])

  const setFeedback = (id, feedback) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, feedback } : i))
  }

  const draftNotes = async () => {
    setDraftBusy(true); setDraftError('')
    try {
      const text = await draftInterviewFeedback(form)
      setForm(f => ({ ...f, notes: text }))
    } catch (err) { setDraftError(err.message || 'AI draft failed') } finally { setDraftBusy(false) }
  }

  const save = (e) => {
    e?.preventDefault?.()
    if (editingId) {
      setItems(prev => prev.map(i => i.id === editingId ? { ...i, ...form } : i))
    } else {
      const id = `iv-${Date.now()}`
      setItems(prev => [...prev, { ...form, id }])
    }
    setModalOpen(false)
  }
  const remove = () => {
    if (!editingId) return
    if (!confirm('Delete this interview?')) return
    setItems(prev => prev.filter(i => i.id !== editingId))
    setModalOpen(false)
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
        <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-slate-400">
          <Legend />
        </div>
        <button onClick={openCreate} className="btn-primary !py-1.5"><Plus className="w-3.5 h-3.5" /> Schedule</button>
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
                  <tr key={iv.id} className="table-row cursor-pointer" onClick={() => openEdit(iv)}>
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
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center gap-1.5">
                        <span className={`badge border ${FEEDBACK_BADGE[iv.feedback]}`}>{iv.feedback}</span>
                        <div className="flex items-center gap-0.5">
                          <button title="Pass" onClick={() => setFeedback(iv.id, 'Passed')} className="p-1 rounded hover:bg-emerald-500/15 text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /></button>
                          <button title="Reject" onClick={() => setFeedback(iv.id, 'Rejected')} className="p-1 rounded hover:bg-accent-rose/15 text-accent-rose"><XCircle className="w-3.5 h-3.5" /></button>
                          <button title="On Hold" onClick={() => setFeedback(iv.id, 'On Hold')} className="p-1 rounded hover:bg-accent-amber/15 text-accent-amber"><PauseCircle className="w-3.5 h-3.5" /></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-slate-500">No interviews yet. Click <strong className="text-accent-blue">Schedule</strong> to add one.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <CalendarView month={month} setMonth={setMonth} interviews={items} onPick={openEdit} />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={CalIcon}
        title={editingId ? `Interview · ${form.candidate}` : 'Schedule Interview'}
        subtitle={editingId ? `${form.role} · ${form.client}` : 'Add a new interview to the calendar'}
        size="lg"
        footer={
          <>
            {editingId && <button type="button" onClick={remove} className="btn-secondary text-accent-rose mr-auto"><Trash2 className="w-4 h-4" /> Delete</button>}
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button form="iv-form" className="btn-primary" type="submit">{editingId ? 'Save Changes' : 'Schedule Interview'}</button>
          </>
        }
      >
        <form id="iv-form" onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Candidate" required><input className="input" value={form.candidate} onChange={e => setForm({ ...form, candidate: e.target.value })} required /></Field>
          <Field label="Role" required><input className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required /></Field>
          <Field label="Client" required><input className="input" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required /></Field>
          <Field label="Interviewer"><input className="input" value={form.interviewer} onChange={e => setForm({ ...form, interviewer: e.target.value })} /></Field>
          <Field label="Round">
            <select className="input" value={form.round} onChange={e => setForm({ ...form, round: e.target.value })}>
              {interviewRounds.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </Field>
          <Field label="Mode">
            <select className="input" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
              <option>Online</option><option>F2F</option>
            </select>
          </Field>
          <Field label="Date"><input type="date" className="input" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} required /></Field>
          <Field label="Time"><input type="time" className="input" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} required /></Field>
          <Field label="Feedback Status">
            <select className="input" value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })}>
              <option>Pending</option><option>Passed</option><option>Rejected</option><option>On Hold</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">Feedback Notes</span>
              <button type="button" onClick={draftNotes} disabled={draftBusy || !form.candidate} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue border border-accent-blue/30 disabled:opacity-40 disabled:cursor-not-allowed transition">
                {draftBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Draft with AI
              </button>
            </div>
            <textarea className="input min-h-[140px] font-mono text-xs leading-relaxed" value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder={`Click 'Draft with AI' (${AI_MODE_LABEL()}) to generate structured feedback notes, or write your own.`} />
            {draftError && <p className="text-[11px] text-accent-rose mt-1">{draftError}</p>}
          </div>
        </form>
      </Modal>
    </div>
  )
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

function CalendarView({ month, setMonth, interviews, onPick }) {
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
        <button onClick={() => setMonth(new Date(year, m - 1, 1))} className="btn-secondary !py-1.5"><ChevronLeft className="w-4 h-4" /></button>
        <h3 className="text-white font-semibold text-lg">{monthLabel}</h3>
        <button onClick={() => setMonth(new Date(year, m + 1, 1))} className="btn-secondary !py-1.5"><ChevronRight className="w-4 h-4" /></button>
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
                      <button key={iv.id} onClick={() => onPick?.(iv)} className={`w-full text-left text-[10px] px-1.5 py-1 rounded border truncate hover:brightness-125 ${ROUND_HUE[iv.round]}`}>
                        {iv.time} · {iv.candidate.split(' ')[0]}
                      </button>
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
