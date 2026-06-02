import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  KanbanSquare,
  Briefcase,
  Building2,
  CalendarDays,
  BarChart3,
  GraduationCap,
  Users,
  ChevronLeft,
  Sparkles,
  Settings as SettingsIcon,
} from 'lucide-react'

const navItems = [
  { to: '/', label: 'Overview', icon: LayoutDashboard },
  { to: '/pipeline', label: 'Candidate Pipeline', icon: KanbanSquare },
  { to: '/jobs', label: 'Job Requisitions', icon: Briefcase },
  { to: '/clients', label: 'Clients', icon: Building2 },
  { to: '/interviews', label: 'Interviews', icon: CalendarDays },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/training', label: 'Training', icon: GraduationCap },
  { to: '/team', label: 'Team', icon: Users },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
]

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } shrink-0 transition-all duration-300 bg-navy-950/80 border-r border-navy-700/60 flex flex-col h-screen sticky top-0 z-30`}
    >
      <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-navy-700/60`}>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue to-accent-teal flex items-center justify-center shadow-glow-blue">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-white font-bold text-base tracking-tight">TalentFlow</div>
              <div className="text-[10px] uppercase tracking-widest text-accent-teal font-semibold">HR Suite</div>
            </div>
          )}
        </div>
        {!collapsed && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-md hover:bg-navy-700/60 text-slate-400 hover:text-white transition"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `group flex items-center ${collapsed ? 'justify-center' : 'gap-3'} px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative ${
                isActive
                  ? 'bg-accent-blue/15 text-white border border-accent-blue/30 shadow-glow-blue'
                  : 'text-slate-400 hover:text-white hover:bg-navy-700/40 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && !collapsed && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r bg-accent-teal" />
                )}
                <Icon className={`w-5 h-5 ${isActive ? 'text-accent-blue' : 'text-slate-500 group-hover:text-accent-teal'} transition`} />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className={`px-3 py-4 border-t border-navy-700/60 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-navy-700/60 text-slate-400 hover:text-white transition rotate-180"
            aria-label="Expand sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        ) : (
          <div className="rounded-lg bg-gradient-to-br from-accent-blue/10 to-accent-teal/10 border border-accent-blue/20 p-3">
            <div className="text-xs font-semibold text-white">Need a boost?</div>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Upgrade to Enterprise for unlimited recruiters & client seats.
            </p>
            <button className="mt-2 w-full text-[11px] font-semibold bg-accent-blue/20 hover:bg-accent-blue/30 text-accent-blue py-1.5 rounded transition">
              Upgrade
            </button>
          </div>
        )}
      </div>
    </aside>
  )
}
