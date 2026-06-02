import { useEffect, useState } from 'react'
import Modal, { Field } from './Modal'
import { Building2, Trash2 } from 'lucide-react'

const INDUSTRIES = ['IT Services', 'Consulting', 'BFSI', 'Manufacturing', 'Healthcare', 'Technology', 'Retail', 'Telecom', 'Energy']
const TIERS = ['Platinum', 'Gold', 'Silver']

const blank = { name: '', industry: 'IT Services', tier: 'Gold', activeReqs: 0, placements: 0, accountManager: '', contactName: '', contactEmail: '', contactPhone: '', revenue: '' }

export default function ClientDetail({ open, client, mode = 'view', onClose, onSave, onDelete }) {
  const [form, setForm] = useState(client || blank)

  useEffect(() => {
    if (open) setForm(client || blank)
  }, [open, client])

  const save = (e) => {
    e?.preventDefault?.()
    const next = { ...form, activeReqs: Number(form.activeReqs) || 0, placements: Number(form.placements) || 0 }
    if (!next.id) next.id = `cli-${Date.now()}`
    onSave?.(next)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      icon={Building2}
      title={mode === 'create' ? 'Add Client' : `Edit · ${form.name || 'Client'}`}
      subtitle={mode === 'create' ? 'Add a new client to your accounts list' : `${form.industry || '—'} · ${form.tier || '—'} tier`}
      size="lg"
      footer={
        <>
          {mode !== 'create' && onDelete && (
            <button onClick={() => { if (confirm('Delete this client?')) { onDelete(form.id); onClose() } }} className="btn-secondary text-accent-rose mr-auto">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          )}
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button form="client-form" className="btn-primary" type="submit">{mode === 'create' ? 'Add Client' : 'Save Changes'}</button>
        </>
      }
    >
      <form id="client-form" onSubmit={save} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Company name" required>
          <input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Industry">
          <select className="input" value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}>
            {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Tier">
          <select className="input" value={form.tier} onChange={e => setForm({ ...form, tier: e.target.value })}>
            {TIERS.map(t => <option key={t}>{t}</option>)}
          </select>
        </Field>
        <Field label="Account Manager">
          <input className="input" value={form.accountManager} onChange={e => setForm({ ...form, accountManager: e.target.value })} placeholder="Anjali Verma" />
        </Field>
        <Field label="Active requirements">
          <input type="number" min="0" className="input" value={form.activeReqs} onChange={e => setForm({ ...form, activeReqs: e.target.value })} />
        </Field>
        <Field label="Total placements">
          <input type="number" min="0" className="input" value={form.placements} onChange={e => setForm({ ...form, placements: e.target.value })} />
        </Field>
        <Field label="Revenue" full>
          <input className="input" value={form.revenue} onChange={e => setForm({ ...form, revenue: e.target.value })} placeholder="₹ 1.2 Cr" />
        </Field>
        <Field label="Contact Name" full>
          <input className="input" value={form.contactName} onChange={e => setForm({ ...form, contactName: e.target.value })} />
        </Field>
        <Field label="Contact Email">
          <input type="email" className="input" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} />
        </Field>
        <Field label="Contact Phone">
          <input className="input" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} />
        </Field>
      </form>
    </Modal>
  )
}
