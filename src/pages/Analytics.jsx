import {
  PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts'
import { placementsByIndustry } from '../data/clients'
import { timeToFill } from '../data/jobs'
import { candidateSources } from '../data/candidates'
import { revenueSplit } from '../data/interviews'
import { recruiters } from '../data/trainings'
import { Trophy, TrendingUp, IndianRupee } from 'lucide-react'

const PALETTE_INDUSTRY = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b', '#f43f5e', '#64748b']
const PALETTE_SOURCE = ['#3b82f6', '#14b8a6', '#8b5cf6', '#f59e0b']
const REV_COLORS = { Staffing: '#3b82f6', Consulting: '#14b8a6', Training: '#8b5cf6' }

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

export default function Analytics() {
  const sortedRecruiters = [...recruiters].sort((a, b) => b.placements - a.placements)
  const totalRev = revenueSplit.reduce((s, r) => s + r.value, 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Placements by Industry" subtitle="Year to date breakdown">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={placementsByIndustry} dataKey="value" innerRadius={60} outerRadius={95} paddingAngle={3}>
                  {placementsByIndustry.map((_, i) => <Cell key={i} fill={PALETTE_INDUSTRY[i % PALETTE_INDUSTRY.length]} stroke="none" />)}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {placementsByIndustry.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PALETTE_INDUSTRY[i] }} />
                <span className="flex-1 truncate">{d.name}</span>
                <span className="text-slate-400 font-mono">{d.value}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Time to Fill" subtitle="Average days per technology">
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={timeToFill} margin={{ left: -10, top: 10 }}>
                <CartesianGrid stroke="#1e293b" vertical={false} />
                <XAxis dataKey="role" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} unit="d" />
                <Tooltip content={<TooltipBox />} cursor={{ fill: 'rgba(20,184,166,0.06)' }} />
                <Bar dataKey="days" fill="#14b8a6" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ChartCard title="Source of Candidates" subtitle="Where pipeline comes from">
          <div className="h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={candidateSources} dataKey="value" outerRadius={85} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11} stroke="none">
                  {candidateSources.map((_, i) => <Cell key={i} fill={PALETTE_SOURCE[i % PALETTE_SOURCE.length]} />)}
                </Pie>
                <Tooltip content={<TooltipBox />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 text-xs">
            {candidateSources.map((s, i) => (
              <div key={s.name} className="flex items-center gap-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: PALETTE_SOURCE[i] }} />
                <span className="flex-1">{s.name}</span>
                <span className="text-slate-400 font-mono">{s.value}%</span>
              </div>
            ))}
          </div>
        </ChartCard>

        <div className="card p-5 lg:col-span-2 animate-fade-in">
          <div className="flex items-center gap-2 mb-1">
            <IndianRupee className="w-4 h-4 text-accent-teal" />
            <h3 className="text-white font-semibold">Revenue Tracker</h3>
          </div>
          <p className="text-xs text-slate-400 mb-4">Split across business lines</p>
          <div className="grid grid-cols-3 gap-3 mb-4">
            {revenueSplit.map(r => (
              <div key={r.name} className="rounded-lg bg-navy-900/40 border border-navy-700/60 p-4">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{r.name}</p>
                <p className="text-2xl font-bold text-white mt-1">{r.value}%</p>
                <div className="mt-2 h-1.5 bg-navy-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.value}%`, background: REV_COLORS[r.name] }} />
                </div>
              </div>
            ))}
          </div>
          <div className="flex h-3 rounded-full overflow-hidden border border-navy-700">
            {revenueSplit.map(r => (
              <div key={r.name} style={{ width: `${(r.value / totalRev) * 100}%`, background: REV_COLORS[r.name] }} />
            ))}
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-3">
            <span>Total Quarter Revenue</span>
            <span className="text-white font-semibold">₹ 8.6 Cr</span>
          </div>
        </div>
      </div>

      <div className="card p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-accent-amber" />
            <h3 className="text-white font-semibold">Recruiter Performance</h3>
          </div>
          <span className="text-xs text-slate-400">This month</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-navy-700">
              <tr>
                <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Rank</th>
                <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Recruiter</th>
                <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Role</th>
                <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Active Reqs</th>
                <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Pipeline</th>
                <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Placements</th>
                <th className="px-3 py-2 text-right text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {sortedRecruiters.map((r, i) => {
                const conv = ((r.placements / r.pipeline) * 100).toFixed(1)
                return (
                  <tr key={r.id} className="table-row">
                    <td className="px-3 py-3 text-sm font-mono text-slate-400">#{i + 1}</td>
                    <td className="px-3 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-blue/60 to-accent-teal/60 text-white text-xs font-bold flex items-center justify-center">{r.avatar}</div>
                        <span className="text-white font-medium">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs text-slate-400">{r.role}</td>
                    <td className="px-3 py-3 text-sm text-right text-slate-200 font-mono">{r.activeReqs}</td>
                    <td className="px-3 py-3 text-sm text-right text-slate-200 font-mono">{r.pipeline}</td>
                    <td className="px-3 py-3 text-sm text-right">
                      <span className="badge border bg-accent-teal/15 text-accent-teal border-accent-teal/30 font-bold">{r.placements}</span>
                    </td>
                    <td className="px-3 py-3 text-sm text-right text-accent-blue font-semibold inline-flex items-center gap-1 justify-end w-full">
                      <TrendingUp className="w-3 h-3" /> {conv}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card p-5 animate-fade-in">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-xs text-slate-400 mb-2">{subtitle}</p>
      {children}
    </div>
  )
}
