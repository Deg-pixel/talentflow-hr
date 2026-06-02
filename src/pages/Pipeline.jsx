import { useMemo, useState } from 'react'
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core'
import { candidates as seedCandidates, STAGES, techStacks } from '../data/candidates'
import CandidateCard from '../components/CandidateCard'
import { usePersistedState } from '../lib/storage'
import { Filter, X } from 'lucide-react'

const STAGE_HUES = {
  sourced: 'border-slate-500/40 text-slate-300 bg-slate-500/10',
  screening: 'border-accent-amber/40 text-accent-amber bg-accent-amber/10',
  interview: 'border-accent-blue/40 text-accent-blue bg-accent-blue/10',
  offer: 'border-accent-purple/40 text-accent-purple bg-accent-purple/10',
  joined: 'border-accent-teal/40 text-accent-teal bg-accent-teal/10',
  rejected: 'border-accent-rose/40 text-accent-rose bg-accent-rose/10',
}

function Column({ stage, candidates }) {
  const { isOver, setNodeRef } = useDroppable({ id: stage.id })
  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 rounded-xl bg-navy-800/40 border ${
        isOver ? 'border-accent-blue/60 shadow-glow-blue' : 'border-navy-700/60'
      } flex flex-col max-h-[calc(100vh-220px)]`}
    >
      <div className="p-3 border-b border-navy-700/60 flex items-center justify-between sticky top-0 bg-navy-800/60 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className={`badge border ${STAGE_HUES[stage.id]}`}>{stage.name}</span>
        </div>
        <span className="text-xs text-slate-400 font-mono">{candidates.length}</span>
      </div>
      <div className="p-2 space-y-2 overflow-y-auto flex-1">
        {candidates.map(c => <CandidateCard key={c.id} candidate={c} />)}
        {candidates.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-navy-700 rounded-lg">
            Drop here
          </div>
        )}
      </div>
    </div>
  )
}

export default function Pipeline() {
  const [items, setItems] = usePersistedState('candidates', seedCandidates)
  const [activeId, setActiveId] = useState(null)
  const [filterTech, setFilterTech] = useState('')
  const [filterExp, setFilterExp] = useState('')
  const [filterClient, setFilterClient] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const clientOptions = useMemo(() => [...new Set(seedCandidates.map(c => c.client))], [])

  const filtered = useMemo(() => items.filter(c => {
    if (filterTech && c.tech !== filterTech) return false
    if (filterClient && c.client !== filterClient) return false
    if (filterExp === '0-3' && !(c.experience <= 3)) return false
    if (filterExp === '4-7' && !(c.experience >= 4 && c.experience <= 7)) return false
    if (filterExp === '8+' && !(c.experience >= 8)) return false
    return true
  }), [items, filterTech, filterExp, filterClient])

  const handleDragEnd = (e) => {
    setActiveId(null)
    const { active, over } = e
    if (!over) return
    const targetStage = over.id
    setItems(prev => prev.map(c => c.id === active.id ? { ...c, stage: targetStage } : c))
  }

  const activeCandidate = items.find(c => c.id === activeId)

  const clearFilters = () => { setFilterTech(''); setFilterExp(''); setFilterClient('') }
  const hasFilters = filterTech || filterExp || filterClient

  return (
    <div className="space-y-4">
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-slate-300">
          <Filter className="w-4 h-4 text-accent-blue" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        <select className="input !py-1.5 !w-auto" value={filterTech} onChange={e => setFilterTech(e.target.value)}>
          <option value="">All Technologies</option>
          {techStacks.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select className="input !py-1.5 !w-auto" value={filterExp} onChange={e => setFilterExp(e.target.value)}>
          <option value="">Any Experience</option>
          <option value="0-3">0 - 3 yrs</option>
          <option value="4-7">4 - 7 yrs</option>
          <option value="8+">8+ yrs</option>
        </select>
        <select className="input !py-1.5 !w-auto" value={filterClient} onChange={e => setFilterClient(e.target.value)}>
          <option value="">All Clients</option>
          {clientOptions.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {hasFilters && (
          <button onClick={clearFilters} className="btn-secondary !py-1.5">
            <X className="w-3.5 h-3.5" /> Clear
          </button>
        )}
        <div className="ml-auto text-xs text-slate-400">
          Showing <span className="text-white font-semibold">{filtered.length}</span> of {items.length}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={(e) => setActiveId(e.active.id)}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => (
            <Column
              key={stage.id}
              stage={stage}
              candidates={filtered.filter(c => c.stage === stage.id)}
            />
          ))}
        </div>
        <DragOverlay>
          {activeCandidate ? <CandidateCard candidate={activeCandidate} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
