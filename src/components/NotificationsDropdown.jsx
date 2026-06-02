import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { recentActivity } from '../data/interviews'
import { UserPlus, FileCheck2, CalendarCheck, CircleX, UserCheck, Circle } from 'lucide-react'

const ICON = {
  sourced: { Icon: UserPlus, color: 'text-slate-300', bg: 'bg-slate-500/15' },
  interview: { Icon: CalendarCheck, color: 'text-accent-blue', bg: 'bg-accent-blue/15' },
  offer: { Icon: FileCheck2, color: 'text-accent-purple', bg: 'bg-accent-purple/15' },
  joined: { Icon: UserCheck, color: 'text-accent-teal', bg: 'bg-accent-teal/15' },
  rejected: { Icon: CircleX, color: 'text-accent-rose', bg: 'bg-accent-rose/15' },
}

const ROUTE = {
  sourced: '/pipeline',
  interview: '/interviews',
  offer: '/pipeline',
  joined: '/pipeline',
  rejected: '/pipeline',
}

export default function NotificationsDropdown({ open, anchorRef, onClose }) {
  const ref = useRef(null)
  const nav = useNavigate()

  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !anchorRef?.current?.contains(e.target)) {
        onClose?.()
      }
    }
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('mousedown', onClick); window.removeEventListener('keydown', onKey) }
  }, [open, onClose, anchorRef])

  if (!open) return null

  return (
    <div ref={ref} className="absolute top-full right-0 mt-2 w-80 max-h-[28rem] overflow-y-auto card border border-navy-700/80 shadow-2xl z-40 animate-fade-in">
      <div className="px-4 py-3 border-b border-navy-700/60 flex items-center justify-between sticky top-0 bg-navy-800/95 backdrop-blur">
        <h3 className="text-sm font-semibold text-white">Notifications</h3>
        <span className="badge bg-accent-teal/15 text-accent-teal border border-accent-teal/30 text-[10px]">{recentActivity.length} new</span>
      </div>
      <ul>
        {recentActivity.map(act => {
          const cfg = ICON[act.kind] || { Icon: Circle, color: 'text-slate-300', bg: 'bg-slate-500/15' }
          const Icon = cfg.Icon
          return (
            <li key={act.id}>
              <button
                onClick={() => { nav(ROUTE[act.kind] || '/'); onClose() }}
                className="w-full text-left flex items-start gap-3 px-4 py-3 hover:bg-navy-700/30 transition border-b border-navy-700/40 last:border-b-0"
              >
                <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-slate-200 leading-tight"><span className="font-semibold text-white">{act.who}</span> {act.detail}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{act.time}</p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
