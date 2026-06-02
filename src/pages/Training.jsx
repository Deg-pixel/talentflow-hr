import { trainings, htdPipeline } from '../data/trainings'
import { GraduationCap, ArrowRight, User, Users as UsersIcon } from 'lucide-react'

const TECH_HUE = {
  SAP: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  AWS: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  Salesforce: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  Java: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  Cybersecurity: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
}

const STATUS_HUE = {
  'In Progress': 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  'Deployment Ready': 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  Deployed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Just Started': 'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

const STAGE_ACCENT = {
  Hire: { hue: 'from-accent-blue/30 to-accent-blue/0 border-accent-blue/40 text-accent-blue', dot: 'bg-accent-blue' },
  Train: { hue: 'from-accent-purple/30 to-accent-purple/0 border-accent-purple/40 text-accent-purple', dot: 'bg-accent-purple' },
  Deploy: { hue: 'from-accent-teal/30 to-accent-teal/0 border-accent-teal/40 text-accent-teal', dot: 'bg-accent-teal' },
}

export default function Training() {
  return (
    <div className="space-y-6">
      <div className="card p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <GraduationCap className="w-5 h-5 text-accent-teal" />
          <h3 className="text-white font-semibold">HTD Pipeline · Hire → Train → Deploy</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {htdPipeline.map((stage, i) => {
            const acc = STAGE_ACCENT[stage.stage]
            return (
              <div key={stage.stage} className="relative">
                <div className={`rounded-xl border bg-gradient-to-br ${acc.hue} p-5 overflow-hidden`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${acc.dot}`} />
                      <p className="text-xs uppercase tracking-widest text-slate-300 font-semibold">{stage.stage}</p>
                    </div>
                    <UsersIcon className={`w-4 h-4 ${acc.hue.split(' ').pop()}`} />
                  </div>
                  <p className="text-4xl font-bold text-white mt-3">{stage.count}</p>
                  <p className="text-[11px] text-slate-400 mt-1">candidates currently</p>
                </div>
                {i < htdPipeline.length - 1 && (
                  <ArrowRight className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 z-10" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="card p-5 animate-fade-in">
        <h3 className="text-white font-semibold mb-4">Active Training Batches</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trainings.map(t => (
            <div key={t.id} className="bg-navy-900/40 border border-navy-700/60 rounded-xl p-4 hover:border-accent-blue/40 transition">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-semibold">{t.batchName}</h4>
                    <span className={`badge border ${TECH_HUE[t.tech]}`}>{t.tech}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5 inline-flex items-center gap-1.5">
                    <User className="w-3 h-3" /> Trainer: <span className="text-slate-200">{t.trainer}</span>
                  </p>
                </div>
                <span className={`badge border ${STATUS_HUE[t.status]}`}>{t.status}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-400 mt-3 mb-3">
                <div>
                  <p className="text-slate-500">Start</p>
                  <p className="text-slate-200">{t.startDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">End</p>
                  <p className="text-slate-200">{t.endDate}</p>
                </div>
                <div>
                  <p className="text-slate-500">Trainees</p>
                  <p className="text-slate-200">{t.trainees} · {t.mode}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Progress</span>
                  <span className="text-white font-semibold">{t.progress}%</span>
                </div>
                <div className="h-2 bg-navy-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-teal transition-all"
                    style={{ width: `${t.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
