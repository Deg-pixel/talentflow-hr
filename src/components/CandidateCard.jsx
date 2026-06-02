import { useRef } from 'react'
import { useDraggable } from '@dnd-kit/core'
import { Briefcase, MapPin, GripVertical } from 'lucide-react'

const techColors = {
  SAP: 'bg-accent-blue/15 text-accent-blue border-accent-blue/30',
  AWS: 'bg-accent-amber/15 text-accent-amber border-accent-amber/30',
  Salesforce: 'bg-accent-teal/15 text-accent-teal border-accent-teal/30',
  Java: 'bg-accent-purple/15 text-accent-purple border-accent-purple/30',
  Cybersecurity: 'bg-accent-rose/15 text-accent-rose border-accent-rose/30',
}

export default function CandidateCard({ candidate, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: candidate.id,
    data: { stage: candidate.stage },
  })

  const downRef = useRef(null)
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined

  // dnd-kit suppresses synthetic click events. Track pointer down/up positions ourselves
  // and treat a near-stationary release as a "click" to open the detail modal.
  const handlePointerDown = (e) => {
    downRef.current = { x: e.clientX, y: e.clientY, t: Date.now() }
    listeners?.onPointerDown?.(e)
  }
  const handlePointerUp = (e) => {
    const d = downRef.current
    downRef.current = null
    if (d && !isDragging) {
      const dx = Math.abs(e.clientX - d.x)
      const dy = Math.abs(e.clientY - d.y)
      if (dx < 4 && dy < 4 && Date.now() - d.t < 500) {
        onOpen?.(candidate)
      }
    }
    listeners?.onPointerUp?.(e)
  }

  // Spread everything except onPointerDown/Up which we override
  const { onPointerDown, onPointerUp, ...restListeners } = listeners || {}

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...restListeners}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onClick={(e) => { if (!isDragging) onOpen?.(candidate) }}
      className={`group bg-navy-800/80 border border-navy-700/60 rounded-lg p-3 cursor-grab active:cursor-grabbing select-none transition-all ${
        isDragging ? 'opacity-50 scale-105 shadow-glow-blue' : 'hover:border-accent-blue/40'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-blue/60 to-accent-teal/60 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {candidate.avatar}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold text-white truncate">{candidate.name}</p>
            <GripVertical className="w-3.5 h-3.5 text-slate-500 opacity-0 group-hover:opacity-100 transition shrink-0" />
          </div>
          <p className="text-[11px] text-slate-400 truncate">{candidate.experience} yrs · {candidate.location}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 flex-wrap">
        <span className={`badge border ${techColors[candidate.tech] || 'bg-slate-500/15 text-slate-300 border-slate-500/30'}`}>
          {candidate.tech}
        </span>
        <span className="badge bg-navy-700 text-slate-300 border border-navy-600 inline-flex items-center gap-1">
          <Briefcase className="w-3 h-3" />
          {candidate.client}
        </span>
      </div>
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {candidate.source}
        </span>
        <span className="text-accent-teal font-semibold">{candidate.expectedCtc}</span>
      </div>
    </div>
  )
}
