import { useMemo } from 'react'
import Modal from './Modal'
import { Mail, Calendar, Briefcase, Users as UsersIcon, Award, TrendingUp } from 'lucide-react'
import { readStored } from '../lib/storage'
import { jobs as seedJobs } from '../data/jobs'
import { candidates as seedCandidates } from '../data/candidates'

export default function RecruiterDetail({ open, recruiter, onClose }) {
  const allJobs = useMemo(() => readStored('jobs', seedJobs), [open])
  const allCandidates = useMemo(() => readStored('candidates', seedCandidates), [open])

  if (!recruiter) return null

  const myJobs = allJobs.filter(j => j.recruiter === recruiter.name)
  const openCount = myJobs.filter(j => j.status === 'Open').length
  const filled = myJobs.filter(j => j.status === 'Filled').length
  const conv = recruiter.pipeline > 0 ? ((recruiter.placements / recruiter.pipeline) * 100).toFixed(1) : '0.0'

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={recruiter.name}
      subtitle={`${recruiter.role} · ${recruiter.email}`}
      size="lg"
    >
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-teal text-white font-bold flex items-center justify-center text-lg shadow-glow-blue">
            {recruiter.avatar}
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Stat icon={Briefcase} label="Active" value={recruiter.activeReqs} accent="blue" />
            <Stat icon={UsersIcon} label="Pipeline" value={recruiter.pipeline} accent="teal" />
            <Stat icon={Award} label="Placed" value={recruiter.placements} accent="purple" />
            <Stat icon={TrendingUp} label="Conv." value={`${conv}%`} accent="amber" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Row icon={Mail} k="Email" v={recruiter.email} />
          <Row icon={Calendar} k="Joined" v={recruiter.joinedOn} />
        </div>

        <div>
          <h3 className="text-white font-semibold mb-2">Assigned Requirements ({myJobs.length})</h3>
          {myJobs.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No requirements assigned right now.</p>
          ) : (
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {myJobs.map(j => (
                <div key={j.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-navy-900/40 border border-navy-700/40">
                  <div className="min-w-0">
                    <p className="text-sm text-white truncate">{j.role}</p>
                    <p className="text-[11px] text-slate-500">{j.id} · {j.client}</p>
                  </div>
                  <span className={`badge border text-[10px] ${
                    j.status === 'Open' ? 'bg-accent-blue/15 text-accent-blue border-accent-blue/30' :
                    j.status === 'Filled' ? 'bg-accent-teal/15 text-accent-teal border-accent-teal/30' :
                    'bg-accent-amber/15 text-accent-amber border-accent-amber/30'
                  }`}>{j.status}</span>
                </div>
              ))}
            </div>
          )}
          <p className="text-[11px] text-slate-500 mt-2">{openCount} open · {filled} filled</p>
        </div>
      </div>
    </Modal>
  )
}

function Stat({ icon: Icon, label, value, accent }) {
  const map = {
    blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/30',
    teal: 'text-accent-teal bg-accent-teal/10 border-accent-teal/30',
    purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/30',
    amber: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
  }
  return (
    <div className="rounded-lg bg-navy-900/40 border border-navy-700/40 p-2 text-center">
      <div className={`mx-auto w-7 h-7 rounded-lg border flex items-center justify-center mb-1 ${map[accent]}`}><Icon className="w-3.5 h-3.5" /></div>
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    </div>
  )
}

function Row({ icon: Icon, k, v }) {
  return (
    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-900/40 border border-navy-700/40">
      <Icon className="w-3.5 h-3.5 text-slate-500" />
      <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">{k}</span>
      <span className="ml-auto text-slate-200 truncate">{v || '—'}</span>
    </div>
  )
}
