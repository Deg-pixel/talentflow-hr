import { useEffect } from 'react'
import { X } from 'lucide-react'

export default function Modal({ open, onClose, title, subtitle, icon: Icon, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  const sizes = { sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' }
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className={`card w-full ${sizes[size] || sizes.md} max-h-[90vh] flex flex-col`}>
        <div className="flex items-start justify-between gap-3 p-5 border-b border-navy-700/60">
          <div className="flex items-start gap-3 min-w-0 flex-1">
            {Icon && <div className="w-9 h-9 rounded-xl bg-accent-blue/15 border border-accent-blue/30 flex items-center justify-center shrink-0"><Icon className="w-4 h-4 text-accent-blue" /></div>}
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-semibold text-base truncate">{title}</h2>
              {subtitle && <p className="text-xs text-slate-400 truncate mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-navy-700 text-slate-400 hover:text-white shrink-0" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
        {footer && <div className="p-4 border-t border-navy-700/60 bg-navy-900/40 flex justify-end gap-2 rounded-b-xl">{footer}</div>}
      </div>
    </div>
  )
}

export function Field({ label, required, full, children }) {
  return (
    <label className={`block ${full ? 'sm:col-span-2' : ''}`}>
      <span className="block text-xs text-slate-400 mb-1 font-medium">{label} {required && <span className="text-accent-rose">*</span>}</span>
      {children}
    </label>
  )
}
