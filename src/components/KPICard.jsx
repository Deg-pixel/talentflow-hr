import { Briefcase, Users, CheckCircle2, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const icons = {
  briefcase: Briefcase,
  users: Users,
  'check-circle': CheckCircle2,
  'trending-up': TrendingUp,
}

const accents = {
  blue: 'from-accent-blue/20 to-accent-blue/0 text-accent-blue border-accent-blue/30',
  teal: 'from-accent-teal/20 to-accent-teal/0 text-accent-teal border-accent-teal/30',
  purple: 'from-accent-purple/20 to-accent-purple/0 text-accent-purple border-accent-purple/30',
  amber: 'from-accent-amber/20 to-accent-amber/0 text-accent-amber border-accent-amber/30',
}

export default function KPICard({ label, value, change, trend, icon, accent = 'blue' }) {
  const Icon = icons[icon] || Briefcase
  const TrendIcon = trend === 'up' ? ArrowUpRight : ArrowDownRight
  const trendColor = trend === 'up' ? 'text-emerald-400' : 'text-rose-400'

  return (
    <div className="card card-hover p-5 relative overflow-hidden animate-fade-in">
      <div className={`absolute -top-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-br ${accents[accent]} blur-2xl opacity-60 pointer-events-none`} />
      <div className="flex items-start justify-between relative">
        <div>
          <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">{label}</p>
          <p className="mt-2 text-3xl font-bold text-white tracking-tight">{value}</p>
        </div>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${accents[accent]} border flex items-center justify-center`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs relative">
        <span className={`inline-flex items-center gap-0.5 font-semibold ${trendColor}`}>
          <TrendIcon className="w-3.5 h-3.5" />
          {change}
        </span>
        <span className="text-slate-500">vs last month</span>
      </div>
    </div>
  )
}
