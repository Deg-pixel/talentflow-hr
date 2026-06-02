import { useEffect, useMemo, useState } from 'react'
import { jobs as seedJobs } from '../data/jobs'
import { usePersistedState } from '../lib/storage'
import { generateJobDescription, AI_MODE_LABEL } from '../lib/aiClient'
import Modal, { Field } from '../components/Modal'
import { Search, Plus, AlertTriangle, Clock, ChevronUp, ChevronDown, Sparkles, Loader2, Briefcase, Trash2 } from 'lucide-react'

const STATUS_BADGE = {
  Open: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  Filled: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  'On Hold': 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
}

const PRIORITY_HUE = {
  High: 'text-accent-rose',
  Medium: 'text-accent-amber',
  Low: 'text-slate-400',
}

const blankJob = { client: '', role: '', skills: '', experience: '', location: '', recruiter: '', priority: 'Medium', positions: 1, description: '', status: 'Open' }

export default function JobRequisitions() {
  const [jobs, setJobs] = usePersistedState('jobs', seedJobs)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [clientFilter, setClientFilter] = useState('')
  const [sortKey, setSortKey] = useState('postedOn')
  const [sortDir, setSortDir] = useState('desc')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState(blankJob)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState('')

  const clientOptions = useMemo(() => [...new Set([...seedJobs, ...jobs].map(j => j.client))], [jobs])

  const filtered = useMemo(() => {
    let list = jobs.filter(j => {
      if (statusFilter && j.status !== statusFilter) return false
      if (clientFilter && j.client !== clientFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!j.role.toLowerCase().includes(q) && !(j.skills || []).join(' ').toLowerCase().includes(q) && !j.client.toLowerCase().includes(q) && !j.id.toLowerCase().includes(q)) return false
      }
      return true
    })
    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey]
      if (av < bv) return sortDir === 'asc' ? -1 : 1
      if (av > bv) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [jobs, search, statusFilter, clientFilter, sortKey, sortDir])

  const headerCell = (key, label) => (
    <th
      onClick={() => {
        if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
        else { setSortKey(key); setSortDir('asc') }
      }}
      className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold cursor-pointer hover:text-white"
    >
      <span className="inline-flex items-center gap-1">
        {label}
        {sortKey === key && (sortDir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
      </span>
    </th>
  )

  const openCreate = () => {
    setForm(blankJob); setEditingId(null); setAiError(''); setModalOpen(true)
  }
  const openEdit = (job) => {
    setForm({ ...job, skills: Array.isArray(job.skills) ? job.skills.join(', ') : (job.skills || '') })
    setEditingId(job.id); setAiError(''); setModalOpen(true)
  }

  // Listen for navbar "+ New" event
  useEffect(() => {
    const onNew = (e) => { if (e.detail?.entity === 'job' || e.detail?.path === '/jobs') openCreate() }
    window.addEventListener('talentflow:new', onNew)
    return () => window.removeEventListener('talentflow:new', onNew)
  }, [])

  const submitJob = (e) => {
    e.preventDefault()
    const skillsArr = (form.skills || '').toString().split(',').map(s => s.trim()).filter(Boolean)
    if (editingId) {
      setJobs(prev => prev.map(j => j.id === editingId ? { ...j, ...form, skills: skillsArr, positions: Number(form.positions) } : j))
    } else {
      const id = `JR-${2053 + jobs.length}`
      setJobs([{ ...blankJob, ...form, id, skills: skillsArr, positions: Number(form.positions), postedOn: new Date().toISOString().slice(0, 10) }, ...jobs])
    }
    setForm(blankJob); setEditingId(null); setModalOpen(false)
  }
  const deleteJob = () => {
    if (!editingId) return
    if (!confirm('Delete this requirement?')) return
    setJobs(prev => prev.filter(j => j.id !== editingId))
    setModalOpen(false)
  }

  const cycleStatus = (job) => {
    const order = ['Open', 'Filled', 'On Hold']
    const next = order[(order.indexOf(job.status) + 1) % order.length]
    setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: next } : j))
  }

  const draftWithAI = async () => {
    setAiBusy(true); setAiError('')
    try {
      const text = await generateJobDescription({
        role: form.role, skills: (form.skills || '').toString().split(',').map(s => s.trim()).filter(Boolean),
        experience: form.experience, location: form.location, client: form.client,
      })
      setForm(f => ({ ...f, description: text }))
    } catch (err) { setAiError(err.message || 'AI draft failed') } finally { setAiBusy(false) }
  }

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-navy-900/40 border border-navy-700 rounded-lg px-3 py-1.5 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by role, skill, client, ID…"
            className="bg-transparent text-sm outline-none w-full text-slate-200 placeholder-slate-500"
          />
        </div>
        <select className="input !py-1.5 !w-auto" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Filled">Filled</option>
          <option value="On Hold">On Hold</option>
        </select>
        <select className="input !py-1.5 !w-auto" value={clientFilter} onChange={e => setClientFilter(e.target.value)}>
          <option value="">All Clients</option>
          {clientOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <button className="btn-primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> New Requirement
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-navy-900/60 border-b border-navy-700">
              <tr>
                {headerCell('id', 'Job ID')}
                {headerCell('client', 'Client')}
                {headerCell('role', 'Role')}
                <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Skills</th>
                {headerCell('experience', 'Exp')}
                {headerCell('location', 'Location')}
                {headerCell('postedOn', 'Posted')}
                {headerCell('status', 'Status')}
                {headerCell('recruiter', 'Recruiter')}
              </tr>
            </thead>
            <tbody>
              {filtered.map(job => (
                <tr key={job.id} className="table-row cursor-pointer" onClick={() => openEdit(job)}>
                  <td className="px-4 py-3 text-sm font-mono text-accent-blue">{job.id}</td>
                  <td className="px-4 py-3 text-sm text-white font-medium">{job.client}</td>
                  <td className="px-4 py-3 text-sm text-slate-200">
                    <div className="flex items-center gap-2">
                      <span>{job.role}</span>
                      {job.priority === 'High' && <AlertTriangle className={`w-3.5 h-3.5 ${PRIORITY_HUE.High}`} />}
                    </div>
                    <div className="text-[11px] text-slate-500">{job.positions} position{job.positions > 1 ? 's' : ''}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <div className="flex flex-wrap gap-1">
                      {(job.skills || []).map(s => (
                        <span key={s} className="badge bg-navy-700/60 text-slate-300 border border-navy-600">{s}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{job.experience}</td>
                  <td className="px-4 py-3 text-sm text-slate-300">{job.location}</td>
                  <td className="px-4 py-3 text-xs text-slate-400 inline-flex items-center gap-1">
                    <Clock className="w-3 h-3" />{job.postedOn}
                  </td>
                  <td className="px-4 py-3" onClick={(e) => { e.stopPropagation(); cycleStatus(job) }}>
                    <button title="Click to change status" className={`badge border ${STATUS_BADGE[job.status]} hover:brightness-125 transition`}>{job.status}</button>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">{job.recruiter}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-500">No jobs match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        icon={Briefcase}
        title={editingId ? `Edit ${editingId}` : 'New Job Requirement'}
        subtitle={editingId ? form.role : 'Add a new client requirement to the pipeline'}
        size="lg"
        footer={
          <>
            {editingId && <button type="button" onClick={deleteJob} className="btn-secondary text-accent-rose mr-auto"><Trash2 className="w-4 h-4" /> Delete</button>}
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button form="job-form" className="btn-primary" type="submit">{editingId ? 'Save Changes' : 'Create Requirement'}</button>
          </>
        }
      >
        <form id="job-form" onSubmit={submitJob} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Client" required>
            <select className="input" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} required>
              <option value="">Select…</option>
              {clientOptions.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Role" required>
            <input className="input" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} required placeholder="e.g. SAP MM Consultant" />
          </Field>
          <Field label="Skills (comma separated)" full>
            <input className="input" value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="SAP MM, ABAP, S/4HANA" />
          </Field>
          <Field label="Experience">
            <input className="input" value={form.experience} onChange={e => setForm({ ...form, experience: e.target.value })} placeholder="5-8 yrs" />
          </Field>
          <Field label="Location">
            <input className="input" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Bengaluru" />
          </Field>
          <Field label="Assigned Recruiter">
            <input className="input" value={form.recruiter} onChange={e => setForm({ ...form, recruiter: e.target.value })} placeholder="Anjali Verma" />
          </Field>
          <Field label="Positions">
            <input type="number" min="1" className="input" value={form.positions} onChange={e => setForm({ ...form, positions: e.target.value })} />
          </Field>
          <Field label="Priority">
            <select className="input" value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </Field>
          <Field label="Status">
            <select className="input" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option>Open</option><option>Filled</option><option>On Hold</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-slate-400 font-medium">Job Description</span>
              <button type="button" onClick={draftWithAI} disabled={aiBusy || !form.role} title={!form.role ? 'Enter a role first' : `Draft with ${AI_MODE_LABEL()}`} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue border border-accent-blue/30 disabled:opacity-40 disabled:cursor-not-allowed transition">
                {aiBusy ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Draft with AI
              </button>
            </div>
            <textarea className="input min-h-[140px] font-mono text-xs leading-relaxed" value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Optional. Click 'Draft with AI' or write your own." />
            {aiError && <p className="text-[11px] text-accent-rose mt-1">{aiError}</p>}
          </div>
        </form>
      </Modal>
    </div>
  )
}
