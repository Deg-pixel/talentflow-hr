import { useEffect, useState } from 'react'
import Modal, { Field } from './Modal'
import { GraduationCap, Trash2 } from 'lucide-react'
import { techStacks } from '../data/candidates'

const STATUSES = ['Just Started', 'In Progress', 'Deployment Ready', 'Deployed']
const MODES = ['Online', 'Offline', 'Hybrid']

const blank = { batchName: '', tech: 'SAP', trainer: '', startDate: new Date().toISOString().slice(0,10), endDate: '', trainees: 12, progress: 0, status: 'Just Started', mode: 'Hybrid' }

export default function BatchDetail({ open, batch, mode = 'view', onClose, onSave, onDelete }) {
  const [form, setForm] = useState(batch || blank)

  useEffect(() => {
    if (open) setForm(batch || blank)
  }, [open, batch])

  const save = (e) => {
    e?.preventDefault?.()
    const next = { ...form, trainees: Number(form.trainees) || 0, progress: Math.max(0, Math.min(100, Number(form.progress) || 0)) }
    if (!next.id) next.id = `tr-${Date.now()}`
    onSave?.(next)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={GraduationCap}
      title={mode === 'create' ? 'Add Training Batch' : `Edit · ${form.batchName || 'Batch'}`}
      subtitle={mode === 'create' ? 'Add a new HTD batch' : `${form.tech} · ${form.status}`}
      size="lg"
      footer={
        <>
          {mode !== 'create' && onDelete && (
            <button onClick={() => { if (confirm('Delete this batch?')) { onDelete(form.id); onClose() } }} className="btn-secondary text-accent-rose mr-auto">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button form="batch-form" className="btn-primary" type="submit">{mode === 'create' ? 'Add Batch' : 'Save Changes'}</button>
        </>
      }
    >
      <form id="batch-form" onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Batch name" required>
          <input className="input" value={form.batchName} onChange={e => setForm({ ...form, batchName: e.target.value })} placeholder="HTD-AWS-26C" required />
        </Field>
        <Field label="Technology">
          <select className="input" value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })}>
            {techStacks.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Trainer">
          <input className="input" value={form.trainer} onChange={e => setForm({ ...form, trainer: e.target.value })} />
        </Field>
        <Field label="Mode">
          <select className="input" value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}>
            {MODES.map(m => <option key={m}>{m}</option>)}
          </select>
        </Field>
        <Field label="Start date"><input type="date" className="input" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></Field>
        <Field label="End date"><input type="date" className="input" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></Field>
        <Field label="Trainees"><input type="number" min="0" className="input" value={form.trainees} onChange={e => setForm({ ...form, trainees: e.target.value })} /></Field>
        <Field label="Status">
          <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label={`Progress (${form.progress}%)`} full>
          <input type="range" min="0" max="100" className="w-full accent-accent-blue" value={form.progress} onChange={e => setForm({ ...form, progress: Number(e.target.value) })} />
          <div className="mt-2 h-2 bg-navy-800 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-teal transition-all" style={{ width: `${form.progress}%` }} />
          </div>
        </Field>
      </form>
    </Modal>
  )
}
