import { useEffect, useState } from 'react'
import { Info, X } from 'lucide-react'

const DISMISS_KEY = 'talentflow.banner-dismissed'

export default function DemoBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem(DISMISS_KEY) === '1' } catch { return false }
  })

  useEffect(() => {
    if (dismissed) {
      try { sessionStorage.setItem(DISMISS_KEY, '1') } catch {}
    }
  }, [dismissed])

  if (dismissed) return null

  return (
    <div className="bg-gradient-to-r from-accent-amber/15 via-accent-blue/10 to-accent-teal/15 border-b border-accent-amber/30 backdrop-blur">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-2 text-[12px] text-slate-200">
        <span className="badge bg-accent-amber/20 text-accent-amber border border-accent-amber/40 uppercase tracking-widest font-bold text-[10px]">
          Demo
        </span>
        <Info className="w-3.5 h-3.5 text-accent-amber shrink-0 hidden sm:block" />
        <span className="flex-1 truncate">
          <strong className="text-white">Mock data only.</strong>
          <span className="hidden md:inline"> All candidates, clients, jobs, and recruiters are fictional. Changes save to your browser's localStorage and are not sent anywhere.</span>
          <span className="md:hidden"> Fictional candidates & clients. Saves to your browser only.</span>
        </span>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded hover:bg-white/10 text-slate-300 hover:text-white shrink-0"
          aria-label="Dismiss demo banner"
          title="Dismiss for this session"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
