import { useEffect, useState } from 'react'
import Modal, { Field } from './Modal'
import { STAGES, techStacks } from '../data/candidates'
import { Sparkles, Loader2, Trash2, User, Mail, Phone, MapPin, IndianRupee, Briefcase, Calendar, RotateCcw } from 'lucide-react'
import { summarizeCandidate, AI_MODE_LABEL } from '../lib/aiClient'

const STAGE_HUES = {
  sourced: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  screening: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  interview: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  offer: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  joined: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  rejected: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
}

export default function CandidateDetail({ open, mode = 'view', candidate, onClose, onSave, onDelete, clients = [] }) {
  const [form, setForm] = useState(() => candidate || blank())
  const [editing, setEditing] = useState(mode === 'create')
  const [summary, setSummary] = useState('')
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(candidate || blank())
      setEditing(mode === 'create' || mode === 'edit')
      setSummary('')
      setAiError('')
    }
  }, [open, candidate, mode])

  const onSummarize = async () => {
    setAiBusy(true)
    setAiError('')
    try {
      const text = await summarizeCandidate(form)
      setSummary(text)
    } catch (err) {
      setAiError(err.message || 'AI summary failed')
    } finally {
      setAiBusy(false)
    }
  }

  const save = (e) => {
    e?.preventDefault?.()
    const next = { ...form }
    if (!next.id) next.id = `c-${Date.now()}`
    if (!next.avatar) next.avatar = (next.name || 'NA').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
    onSave?.(next)
  }

  const stageBadge = STAGES.find(s => s.id === form.stage)?.name || 'Sourced'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add Candidate' : form.name || 'Candidate'}
      subtitle={mode === 'create' ? 'Add a new candidate to the pipeline' : `${form.tech || ''} · ${form.experience || 0} yrs · ${form.location || ''}`}
      icon={User}
      size="lg"
      footer={
        <>
          {mode !== 'create' && onDelete && (
            <button onClick={() => { if (confirm('Delete this candidate?')) { onDelete(form.id); onClose() } }} className="btn-secondary text-accent-rose mr-auto">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          {!editing && mode !== 'create' && (
            <button onClick={() => setEditing(true)} className="btn-secondary">Edit</button>
          )}
          {editing && <button onClick={onClose} className="btn-secondary">Cancel</button>}
          {editing && <button onClick={save} className="btn-primary">Save</button>}
        </>
      }
    >
      {editing ? (
        <form className="grid grid-cols-1 sm:grid-cols-2 gap-3" onSubmit={save}>
          <Field label="Name" required>
            <input className="input" value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
          </Field>
          <Field label="Tech stack" required>
            <select className="input" value={form.tech || ''} onChange={e => setForm({ ...form, tech: e.target.value })} required>
              <option value="">Select…</option>
              {techStacks.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Experience (yrs)" required>
            <input type="number" min="0" className="input" value={form.experience ?? ''} onChange={e => setForm({ ...form, experience: Number(e.target.value) })} required />
          </Field>
          <Field label="Client">
            <select className="input" value={form.client || ''} onChange={e => setForm({ ...form, client: e.target.value })}>
              <option value="">—</option>
              {clients.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Stage">
            <select className="input" value={form.stage || 'sourced'} onChange={e => setForm({ ...form, stage: e.target.value })}>
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </Field>
          <Field label="Location">
            <input className="input" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
          </Field>
          <Field label="Expected CTC">
            <input className="input" value={form.expectedCtc || ''} onChange={e => setForm({ ...form, expectedCtc: e.target.value })} placeholder="18 LPA" />
          </Field>
          <Field label="Source">
            <select className="input" value={form.source || 'LinkedIn'} onChange={e => setForm({ ...form, source: e.target.value })}>
              <option>LinkedIn</option><option>Portal</option><option>Referral</option><option>Internal DB</option>
            </select>
          </Field>
          <Field label="Email">
            <input type="email" className="input" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <input className="input" value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} />
          </Field>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-teal text-white font-bold flex items-center justify-center text-base shadow-glow-blue">
              {form.avatar || form.name?.[0]}
            </div>
            <div className="flex-1">
              <p className="text-white font-semibold text-lg">{form.name}</p>
              <p className="text-xs text-slate-400">{form.tech} · {form.experience} yrs</p>
              <span className={`badge border mt-1 ${STAGE_HUES[form.stage] || STAGE_HUES.sourced}`}>{stageBadge}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <Info icon={Briefcase} k="Client" v={form.client} />
            <Info icon={MapPin} k="Location" v={form.location} />
            <Info icon={IndianRupee} k="Expected CTC" v={form.expectedCtc} />
            <Info icon={Calendar} k="Source" v={form.source} />
            <Info icon={Mail} k="Email" v={form.email} />
            <Info icon={Phone} k="Phone" v={form.phone} />
          </div>
          <div className="border-t border-navy-700/60 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-accent-blue" /> AI Summary
              </h3>
              <button onClick={onSummarize} disabled={aiBusy} className="btn-secondary text-xs !py-1 disabled:opacity-50">
                {aiBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <RotateCcw className="w-3 h-3" />}
                {summary ? 'Regenerate' : `Summarize with ${AI_MODE_LABEL()}`}
              </button>
            </div>
            {summary ? (
              <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
            ) : (
              <p className="text-xs text-slate-500 italic">Click summarize to generate a 4-sentence brief for the hiring manager.</p>
            )}
            {aiError && <p className="text-xs text-accent-rose mt-2">{aiError}</p>}
          </div>
        </div>
      )}
    </Modal>
  )
}

function Info({ icon: Icon, k, v }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-900/40 border border-navy-700/40">
      <Icon className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{k}</span>
      <span className="ml-auto text-slate-200 truncate">{v || '—'}</span>
    </div>
  )
}

function blank() {
  return { name: '', tech: '', experience: 0, client: '', stage: 'sourced', location: '', expectedCtc: '', source: 'LinkedIn', email: '', phone: '', avatar: '' }
}
