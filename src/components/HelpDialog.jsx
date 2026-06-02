import Modal from './Modal'
import { Keyboard, Sparkles, MousePointer2, Move, KanbanSquare, Bell, Cloud } from 'lucide-react'

const shortcuts = [
  { keys: ['⌘', 'K'], alt: ['Ctrl', 'K'], desc: 'Open global search' },
  { keys: ['Esc'], desc: 'Close any modal or dropdown' },
]

const interactions = [
  { icon: MousePointer2, title: 'Click anything', body: 'Cards, table rows, calendar events, and recruiter tiles all open a detail modal. Edit any field and save.' },
  { icon: Move, title: 'Drag candidates', body: 'On the Pipeline, drag any card between the six columns. Movement of less than 5 px is treated as a click.' },
  { icon: KanbanSquare, title: 'Quick-add', body: 'Tap the + on any kanban column header to seed a new candidate directly in that stage.' },
  { icon: Sparkles, title: 'AI everywhere', body: 'Job descriptions, interview feedback, and candidate summaries are one button click each. Works without a key (local templates), with Ollama, or with any cloud API.' },
  { icon: Cloud, title: 'Provider routing', body: 'Settings → choose Ollama, Cloud API, or Off. The active provider name appears as a chip in the top-right.' },
  { icon: Bell, title: 'Notifications', body: 'Bell icon shows recent activity. Click any entry to jump to the relevant page.' },
]

export default function HelpDialog({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} icon={Keyboard} title="Keyboard shortcuts & tips" subtitle="Get around TalentFlow faster" size="lg">
      <div className="space-y-5">
        <section>
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Keyboard</h3>
          <div className="space-y-1.5">
            {shortcuts.map((s, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-navy-900/40 border border-navy-700/40">
                <span className="text-sm text-slate-200">{s.desc}</span>
                <div className="flex items-center gap-2">
                  <KeyCombo keys={s.keys} />
                  {s.alt && (<><span className="text-[10px] text-slate-500">or</span><KeyCombo keys={s.alt} /></>)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">Interactions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {interactions.map((it, i) => {
              const Icon = it.icon
              return (
                <div key={i} className="rounded-lg bg-navy-900/40 border border-navy-700/40 p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-7 h-7 rounded-md bg-accent-blue/15 text-accent-blue border border-accent-blue/30 flex items-center justify-center"><Icon className="w-3.5 h-3.5" /></div>
                    <p className="text-sm font-semibold text-white">{it.title}</p>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{it.body}</p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="text-[11px] text-slate-500 border-t border-navy-700/40 pt-3">
          <strong className="text-slate-400">Heads up:</strong> all changes are saved to your browser's localStorage only. Reset everything at <span className="text-accent-blue">Settings → Reset Demo Data</span>.
        </section>
      </div>
    </Modal>
  )
}

function KeyCombo({ keys }) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {keys.map((k, i) => (
        <kbd key={i} className="text-[10px] font-mono text-slate-300 bg-navy-800 border border-navy-600 rounded px-1.5 py-0.5 min-w-[18px] text-center">{k}</kbd>
      ))}
    </span>
  )
}
