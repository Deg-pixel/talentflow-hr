import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts'
import KPICard from '../components/KPICard'
import { kpis } from '../data/overview'
import { candidatesByTech } from '../data/candidates'
import { monthlyPlacements } from '../data/jobs'
import { recentActivity } from '../data/interviews'
import { UserPlus, FileCheck2, CalendarCheck, CircleX, UserCheck, Circle } from 'lucide-react'

const PIE_COLORS = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#f43f5e']

const ACT_ICON = {
  sourced: { Icon: UserPlus, color: 'text-slate-300', bg: 'bg-slate-500/15' },
  interview: { Icon: CalendarCheck, color: 'text-accent-blue', bg: 'bg-accent-blue/15' },
  offer: { Icon: FileCheck2, color: 'text-accent-purple', bg: 'bg-accent-purple/15' },
  joined: { Icon: UserCheck, color: 'text-accent-teal', bg: 'bg-accent-teal/15' },
  rejected: { Icon: CircleX, color: 'text-accent-rose', bg: 'bg-accent-rose/15' },
}

function TooltipBox({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-navy-950/95 border border-navy-700 rounded-lg px-3 py-2 shadow-xl text-xs">
      {label && <div className="text-slate-400 mb-1">{label}</div>}
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2 text-white">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload.fill }} />
          <span>{p.name}: <span className="font-semibold">{p.value}</span></span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map(kpi => <KPICard key={kpi.id} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2 animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-white font-semibold">Monthly Placements</h3>
              <p className="text-xs text-slate-400">Last 6 months trend</p>
            </div>
            <div className="text-xs text-slate-400 inline-flex items-center gap-2">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent-blue" /> Placements</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={monthlyPlacements} margin={{ left: -10, top: 10 }}>
                <defs>
                  <linearGradient id="placementsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                    <stop offset="100%" stopColor="#14b8a6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip content={<TooltipBox />} cursor={{ fill: 'rgba(59,130,246,0.06)' }} />
                <Bar dataKey="placements" fill="url(#placementsGrad)" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-5 animate-fade-in">
          <h3 className="text-white font-semibold">Candidates by Technology</h3>
          <p className="text-xs text-slate-400">Active pipeline distribution</p>
          <div className="h-56 mt-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={candidatesByTech}
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {candidatesByTech.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs mt-2">
            {candidatesByTech.map((t, i) => (
              <div key={t.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                <span className="flex-1 truncate">{t.name}</span>
                <span className="text-slate-400 font-mono">{t.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            <button className="text-xs text-accent-blue hover:underline">View all</button>
          </div>
          <ul className="space-y-3">
            {recentActivity.map(act => {
              const cfg = ACT_ICON[act.kind] || { Icon: Circle, color: 'text-slate-300', bg: 'bg-slate-500/15' }
              const Icon = cfg.Icon
              return (
                <li key={act.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-navy-700/30 transition">
                  <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                    <Icon className={`w-4 h-4 ${cfg.color}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-slate-200"><span className="font-semibold text-white">{act.who}</span> {act.detail}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{act.time}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="card p-5 animate-fade-in">
          <h3 className="text-white font-semibold">Quick Snapshot</h3>
          <p className="text-xs text-slate-400">Today at TalentFlow</p>
          <div className="mt-4 space-y-3">
            <SnapshotRow label="Interviews scheduled today" value="6" color="blue" />
            <SnapshotRow label="Offers pending response" value="4" color="purple" />
            <SnapshotRow label="Candidates joining this week" value="9" color="teal" />
            <SnapshotRow label="Critical open requirements" value="11" color="amber" />
            <SnapshotRow label="Bench resources ready" value="22" color="rose" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SnapshotRow({ label, value, color }) {
  const map = {
    blue: 'text-accent-blue bg-accent-blue/10 border-accent-blue/30',
    purple: 'text-accent-purple bg-accent-purple/10 border-accent-purple/30',
    teal: 'text-accent-teal bg-accent-teal/10 border-accent-teal/30',
    amber: 'text-accent-amber bg-accent-amber/10 border-accent-amber/30',
    rose: 'text-accent-rose bg-accent-rose/10 border-accent-rose/30',
  }
  return (
    <div className="flex items-center justify-between p-2.5 rounded-lg bg-navy-900/40 border border-navy-700/40">
      <span className="text-sm text-slate-300">{label}</span>
      <span className={`badge border font-bold text-sm px-2.5 ${map[color]}`}>{value}</span>
    </div>
  )
}
