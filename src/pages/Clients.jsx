import { useEffect, useState, useMemo } from 'react'
import { clients as seedClients } from '../data/clients'
import { jobs as seedJobs } from '../data/jobs'
import { usePersistedState, readStored } from '../lib/storage'
import ClientDetail from '../components/ClientDetail'
import { Building2, Mail, Phone, User, ChevronDown, ChevronUp, Award, Search, Plus, Pencil } from 'lucide-react'

const INDUSTRY_HUE = {
  'IT Services': 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  'Consulting': 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  'BFSI': 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  'Manufacturing': 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  'Healthcare': 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
  'Technology': 'bg-slate-400/15 text-slate-300 border-slate-400/30',
}

const TIER_HUE = {
  Platinum: 'text-slate-200',
  Gold: 'text-accent-amber',
  Silver: 'text-slate-400',
}

export default function Clients() {
  const [clients, setClients] = usePersistedState('clients', seedClients)
  const [expanded, setExpanded] = useState(null)
  const [search, setSearch] = useState('')
  const [industryFilter, setIndustryFilter] = useState('')
  const [modal, setModal] = useState({ open: false, mode: 'view', client: null })

  const industries = useMemo(() => [...new Set(clients.map(c => c.industry))], [clients])

  const filtered = useMemo(() => clients.filter(c => {
    if (industryFilter && c.industry !== industryFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  }), [search, industryFilter, clients])

  const openCreate = () => setModal({ open: true, mode: 'create', client: null })
  const openEdit = (c) => setModal({ open: true, mode: 'edit', client: c })

  useEffect(() => {
    const onNew = (e) => { if (e.detail?.entity === 'client' || e.detail?.path === '/clients') openCreate() }
    window.addEventListener('talentflow:new', onNew)
    return () => window.removeEventListener('talentflow:new', onNew)
  }, [])

  const save = (next) => {
    setClients(prev => {
      const i = prev.findIndex(c => c.id === next.id)
      if (i === -1) return [next, ...prev]
      const out = [...prev]; out[i] = next; return out
    })
    setModal({ open: false, mode: 'view', client: null })
  }
  const remove = (id) => setClients(prev => prev.filter(c => c.id !== id))

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 bg-navy-900/40 border border-navy-700 rounded-lg px-3 py-1.5 flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="bg-transparent text-sm outline-none w-full text-slate-200 placeholder-slate-500"
          />
        </div>
        <select className="input !py-1.5 !w-auto" value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}>
          <option value="">All Industries</option>
          {industries.map(i => <option key={i} value={i}>{i}</option>)}
        </select>
        <button onClick={openCreate} className="btn-primary !py-1.5"><Plus className="w-3.5 h-3.5" /> Add Client</button>
        <div className="text-xs text-slate-400">
          <span className="text-white font-semibold">{filtered.length}</span> clients
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(client => {
          const openRoles = readStored('jobs', seedJobs).filter(j => j.client === client.name)
          const isOpen = expanded === client.id
          return (
            <div key={client.id} className="card card-hover overflow-hidden animate-fade-in">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-teal/20 border border-accent-blue/30 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-accent-blue" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-white font-semibold leading-tight truncate">{client.name}</h3>
                      <span className={`badge border mt-1 ${INDUSTRY_HUE[client.industry] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>
                        {client.industry}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(client)} title="Edit client" className="p-1.5 rounded hover:bg-navy-700 text-slate-400 hover:text-accent-blue transition">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <div className={`flex items-center gap-1 text-xs font-semibold ${TIER_HUE[client.tier]}`}>
                      <Award className="w-3.5 h-3.5" />
                      {client.tier}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4">
                  <Metric label="Active Reqs" value={client.activeReqs} accent="blue" />
                  <Metric label="Placements" value={client.placements} accent="teal" />
                  <Metric label="Revenue" value={client.revenue} accent="purple" small />
                </div>

                <div className="mt-4 space-y-1.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-slate-500" /> Account Manager: <span className="text-white font-medium">{client.accountManager}</span></div>
                  <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /> {client.contactEmail}</div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-500" /> {client.contactPhone}</div>
                </div>

                <button
                  onClick={() => setExpanded(isOpen ? null : client.id)}
                  className="mt-4 w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-navy-700/50 hover:bg-navy-700 text-sm text-slate-200 transition"
                >
                  {isOpen ? 'Hide open roles' : `View ${openRoles.length} open role${openRoles.length !== 1 ? 's' : ''}`}
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>
              {isOpen && (
                <div className="border-t border-navy-700/60 bg-navy-900/40 p-4 space-y-2 animate-slide-in">
                  {openRoles.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-2">No open roles right now.</p>
                  ) : openRoles.map(role => (
                    <div key={role.id} className="rounded-lg bg-navy-800/60 border border-navy-700/60 p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div>
                          <p className="text-sm text-white font-medium">{role.role}</p>
                          <p className="text-[11px] text-slate-400">{role.id} · {role.experience} · {role.location}</p>
                        </div>
                        <span className={`badge border text-[10px] ${
                          role.status === 'Open' ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30' :
                          role.status === 'Filled' ? 'bg-accent-teal/15 text-accent-teal border-accent-teal/30' :
                          'bg-accent-amber/15 text-accent-amber border-accent-amber/30'
                        }`}>{role.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <ClientDetail
        open={modal.open}
        mode={modal.mode}
        client={modal.client}
        onClose={() => setModal({ open: false, mode: 'view', client: null })}
        onSave={save}
        onDelete={remove}
      />
    </div>
  )
}

function Metric({ label, value, accent, small }) {
  const map = {
    blue: 'text-accent-blue',
    teal: 'text-accent-teal',
    purple: 'text-accent-purple',
  }
  return (
    <div className="bg-navy-900/40 border border-navy-700/40 rounded-lg p-2 text-center">
      <p className={`${small ? 'text-sm' : 'text-lg'} font-bold ${map[accent]}`}>{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold mt-0.5">{label}</p>
    </div>
  )
}
