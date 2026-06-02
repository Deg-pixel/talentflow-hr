import { useState } from 'react'
import { recruiters } from '../data/trainings'
import RecruiterDetail from '../components/RecruiterDetail'
import { Mail, Briefcase, Users as UsersIcon, Award, Calendar } from 'lucide-react'

export default function Team() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {recruiters.map(r => (
          <button key={r.id} onClick={() => setSelected(r)} className="text-left card card-hover p-5 animate-fade-in cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-teal text-white text-sm font-bold flex items-center justify-center shadow-glow-blue">
                {r.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{r.name}</h3>
                <p className="text-xs text-accent-teal font-medium">{r.role}</p>
                <p className="text-[11px] text-slate-400 inline-flex items-center gap-1 mt-0.5"><Mail className="w-3 h-3" /> {r.email}</p>
              </div>
              <Award className="w-4 h-4 text-accent-amber shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4">
              <Stat icon={Briefcase} label="Active" value={r.activeReqs} accent="blue" />
              <Stat icon={UsersIcon} label="Pipeline" value={r.pipeline} accent="teal" />
              <Stat icon={Award} label="Placed" value={r.placements} accent="purple" />
            </div>

            <div className="mt-4 pt-3 border-t border-navy-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> Joined {r.joinedOn}</span>
              <span className="text-accent-blue">View profile →</span>
            </div>
          </button>
        ))}
      </div>
      <RecruiterDetail open={!!selected} recruiter={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

function Stat({ icon: Icon, label, value, accent }) {
  const map = {
    blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/30',
    teal: 'text-accent-teal bg-accent-teal/10 border-accent-teal/30',
    purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/30',
  }
  return (
    <div className="rounded-lg bg-navy-900/40 border border-navy-700/40 p-2.5 text-center">
      <div className={`mx-auto w-7 h-7 rounded-lg border flex items-center justify-center mb-1 ${map[accent]}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="text-base font-bold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{label}</p>
    </div>
  )
}
