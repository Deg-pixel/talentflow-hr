import { useEffect, useState } from 'react'
import {
  Cloud, Server, Eye, EyeOff, Save, RotateCcw, CheckCircle2, AlertTriangle, ExternalLink, Loader2, KeyRound, Cpu, Sparkles, PowerOff, Database, Trash2, Info,
} from 'lucide-react'
import {
  PROVIDERS, defaultSettings, loadSettings, saveSettings, clearSettings, testOllamaConnection, testApiConnection,
} from '../lib/aiSettings'
import { clearAllStored } from '../lib/storage'

export default function Settings() {
  const [settings, setSettings] = useState(loadSettings())
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [ollamaModels, setOllamaModels] = useState([])
  const [savedFlash, setSavedFlash] = useState(false)

  useEffect(() => {
    if (settings.mode === 'ollama' && settings.ollama.baseUrl) {
      testOllamaConnection(settings.ollama.baseUrl).then(setOllamaModels).catch(() => {})
    }
  }, []) // initial load only

  const setMode = (mode) => setSettings(s => ({ ...s, mode }))

  const setApi = (patch) => setSettings(s => ({ ...s, api: { ...s.api, ...patch } }))
  const setOllama = (patch) => setSettings(s => ({ ...s, ollama: { ...s.ollama, ...patch } }))

  const handleProviderChange = (provider) => {
    const p = PROVIDERS[provider]
    setApi({
      provider,
      baseUrl: p.defaultBaseUrl,
      model: p.defaultModel || settings.api.model,
    })
  }

  const onSave = () => {
    saveSettings(settings)
    setSavedFlash(true)
    setTimeout(() => setSavedFlash(false), 1800)
  }

  const onReset = () => {
    if (!confirm('Reset AI settings to defaults? Your API key will be removed.')) return
    clearSettings()
    setSettings(defaultSettings)
    setTestResult(null)
    setOllamaModels([])
  }

  const runTest = async () => {
    setTesting(true)
    setTestResult(null)
    try {
      if (settings.mode === 'ollama') {
        const models = await testOllamaConnection(settings.ollama.baseUrl)
        setOllamaModels(models)
        setTestResult({ ok: true, msg: `Connected. Found ${models.length} model${models.length !== 1 ? 's' : ''}.` })
      } else if (settings.mode === 'api') {
        await testApiConnection(settings.api.provider, settings.api.apiKey, settings.api.baseUrl, settings.api.model)
        setTestResult({ ok: true, msg: 'Provider reachable. Credentials accepted.' })
      } else {
        setTestResult({ ok: false, msg: 'AI is turned off — nothing to test.' })
      }
    } catch (err) {
      setTestResult({ ok: false, msg: err.message || 'Connection failed.' })
    } finally {
      setTesting(false)
    }
  }

  const provider = PROVIDERS[settings.api.provider]

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="card p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-accent-blue/20 to-accent-teal/20 border border-accent-blue/30 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-blue" />
          </div>
          <div className="flex-1">
            <h2 className="text-white font-semibold text-lg">AI Assistant</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Choose how TalentFlow generates job descriptions, screens resumes, and drafts interview feedback. Use a cloud API or run a local Ollama model — keys are stored only in your browser.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
          <ModeCard
            active={settings.mode === 'api'}
            onClick={() => setMode('api')}
            icon={Cloud}
            title="Cloud API Key"
            description="OpenAI, Anthropic, Gemini, or a custom OpenAI-compatible endpoint."
            accent="teal"
          />
          <ModeCard
            active={settings.mode === 'ollama'}
            onClick={() => setMode('ollama')}
            icon={Server}
            title="Ollama (Local)"
            description="Run open-source models on your own machine. Private & free."
            accent="blue"
          />
          <ModeCard
            active={settings.mode === 'off'}
            onClick={() => setMode('off')}
            icon={PowerOff}
            title="Off"
            description="Disable AI features. The dashboard still works without them."
            accent="slate"
          />
        </div>
      </div>

      {settings.mode === 'api' && (
        <div className="card p-5 animate-fade-in space-y-4">
          <div className="flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-accent-teal" />
            <h3 className="text-white font-semibold">API Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Provider">
              <div className="grid grid-cols-2 gap-2">
                {Object.values(PROVIDERS).map(p => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition ${
                      settings.api.provider === p.id
                        ? 'bg-accent-blue/15 text-white border-accent-blue/40 shadow-glow-blue'
                        : 'bg-navy-900/40 text-slate-300 border-navy-700 hover:border-accent-blue/30'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Model">
              {provider.models.length > 0 ? (
                <select
                  className="input"
                  value={settings.api.model}
                  onChange={e => setApi({ model: e.target.value })}
                >
                  {provider.models.map(m => <option key={m} value={m}>{m}</option>)}
                  {!provider.models.includes(settings.api.model) && settings.api.model && (
                    <option value={settings.api.model}>{settings.api.model} (custom)</option>
                  )}
                </select>
              ) : (
                <input
                  className="input font-mono"
                  value={settings.api.model}
                  onChange={e => setApi({ model: e.target.value })}
                  placeholder="model identifier"
                />
              )}
            </Field>

            <Field label="API Key" full>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  className="input font-mono pr-10"
                  value={settings.api.apiKey}
                  onChange={e => setApi({ apiKey: e.target.value })}
                  placeholder={provider.keyLabel}
                  autoComplete="off"
                  spellCheck={false}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(s => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-slate-400 hover:text-white"
                  aria-label={showKey ? 'Hide key' : 'Show key'}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex items-center justify-between mt-1.5 text-[11px]">
                <span className="text-slate-500">Stored in your browser localStorage only.</span>
                {provider.docs && (
                  <a href={provider.docs} target="_blank" rel="noreferrer" className="text-accent-blue hover:underline inline-flex items-center gap-1">
                    Get a key <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </Field>

            <Field label="Base URL (optional)" full>
              <input
                className="input font-mono"
                value={settings.api.baseUrl}
                onChange={e => setApi({ baseUrl: e.target.value })}
                placeholder={provider.defaultBaseUrl || 'https://your-proxy.example.com/v1'}
              />
              <p className="text-[11px] text-slate-500 mt-1">Override for a proxy, gateway, or self-hosted compatible endpoint.</p>
            </Field>
          </div>
        </div>
      )}

      {settings.mode === 'ollama' && (
        <div className="card p-5 animate-fade-in space-y-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-accent-blue" />
            <h3 className="text-white font-semibold">Ollama Configuration</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Field label="Server URL" full>
              <input
                className="input font-mono"
                value={settings.ollama.baseUrl}
                onChange={e => setOllama({ baseUrl: e.target.value })}
                placeholder="http://localhost:11434"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Start Ollama with <code className="text-accent-teal bg-navy-900/60 px-1 py-0.5 rounded">ollama serve</code> and ensure the port is reachable from this browser.
              </p>
            </Field>

            <Field label="Model" full>
              {ollamaModels.length > 0 ? (
                <select
                  className="input"
                  value={settings.ollama.model}
                  onChange={e => setOllama({ model: e.target.value })}
                >
                  {ollamaModels.map(m => <option key={m} value={m}>{m}</option>)}
                  {!ollamaModels.includes(settings.ollama.model) && settings.ollama.model && (
                    <option value={settings.ollama.model}>{settings.ollama.model} (not pulled)</option>
                  )}
                </select>
              ) : (
                <input
                  className="input font-mono"
                  value={settings.ollama.model}
                  onChange={e => setOllama({ model: e.target.value })}
                  placeholder="llama3.2, mistral, qwen2.5, phi3 …"
                />
              )}
              <p className="text-[11px] text-slate-500 mt-1">
                Pull a model with <code className="text-accent-teal bg-navy-900/60 px-1 py-0.5 rounded">ollama pull llama3.2</code>. Test the connection to discover installed models.
              </p>
            </Field>
          </div>

          <div className="rounded-lg bg-navy-900/40 border border-navy-700/40 p-3">
            <p className="text-xs text-slate-300 font-medium mb-1">Recommended models for HR use</p>
            <div className="flex flex-wrap gap-1.5">
              {['llama3.2', 'llama3.1:8b', 'mistral', 'qwen2.5:7b', 'phi3'].map(m => (
                <button
                  key={m}
                  onClick={() => setOllama({ model: m })}
                  className="badge bg-navy-800 text-slate-300 border border-navy-700 hover:border-accent-blue/40 hover:text-white transition"
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {settings.mode === 'off' && (
        <div className="card p-8 text-center text-slate-400 animate-fade-in">
          <PowerOff className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          AI features are disabled. Switch to <button onClick={() => setMode('api')} className="text-accent-blue hover:underline">Cloud API</button> or <button onClick={() => setMode('ollama')} className="text-accent-teal hover:underline">Ollama</button> to enable them.
        </div>
      )}

      <div className="card p-5 animate-fade-in">
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={runTest}
            disabled={testing || settings.mode === 'off'}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Test Connection
          </button>
          <button onClick={onSave} className="btn-primary">
            <Save className="w-4 h-4" />
            {savedFlash ? 'Saved!' : 'Save Settings'}
          </button>
          <button onClick={onReset} className="btn-secondary text-slate-400 hover:text-accent-rose ml-auto">
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>

        {testResult && (
          <div className={`mt-4 rounded-lg border p-3 text-sm flex items-start gap-2 animate-fade-in ${
            testResult.ok
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-accent-rose/10 border-accent-rose/30 text-accent-rose'
          }`}>
            {testResult.ok
              ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
              : <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{testResult.msg}</span>
          </div>
        )}
      </div>

      <div className="card p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-teal/15 border border-accent-teal/30 flex items-center justify-center shrink-0">
            <Info className="w-4 h-4 text-accent-teal" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Zero-config friendly</h3>
            <p className="text-sm text-slate-400 mt-1 leading-relaxed">
              You don't need an API key or Ollama to use TalentFlow. AI features (job descriptions, interview feedback drafts, candidate summaries) automatically fall back to <strong className="text-slate-200">local templates</strong> when no provider is reachable. Connect Ollama for higher-quality output without paying for anything.
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              <strong className="text-slate-300">Quick Ollama setup:</strong> install from <a className="text-accent-blue hover:underline" href="https://ollama.com/download" target="_blank" rel="noreferrer">ollama.com/download</a>, then run <code className="text-accent-teal bg-navy-900/60 px-1 py-0.5 rounded">ollama pull llama3.2</code> and <code className="text-accent-teal bg-navy-900/60 px-1 py-0.5 rounded">ollama serve</code>.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-5 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-amber/15 border border-accent-amber/30 flex items-center justify-center shrink-0">
            <Database className="w-4 h-4 text-accent-amber" />
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold">Demo Data</h3>
            <p className="text-sm text-slate-400 mt-1">
              All changes (kanban moves, new jobs, feedback) are saved to your browser's localStorage. Reset to load the original seed data.
            </p>
            <button
              onClick={() => {
                if (confirm('Reset all candidates, jobs, and interviews to seed data? AI settings will be kept.')) {
                  clearAllStored()
                  alert('Demo data reset. Reloading…')
                  window.location.reload()
                }
              }}
              className="btn-secondary mt-3 text-accent-rose hover:text-accent-rose border-accent-rose/30 hover:border-accent-rose/60"
            >
              <Trash2 className="w-4 h-4" />
              Reset Demo Data
            </button>
          </div>
        </div>
      </div>

      <div className="card p-5 animate-fade-in">
        <h3 className="text-white font-semibold mb-3">Current Configuration</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Row k="Mode" v={settings.mode === 'api' ? 'Cloud API' : settings.mode === 'ollama' ? 'Ollama (Local)' : 'Off'} />
          {settings.mode === 'api' && <>
            <Row k="Provider" v={PROVIDERS[settings.api.provider]?.name || '—'} />
            <Row k="Model" v={settings.api.model || '—'} mono />
            <Row k="API Key" v={settings.api.apiKey ? `••••••${settings.api.apiKey.slice(-4)}` : 'Not set'} mono tone={settings.api.apiKey ? 'ok' : 'warn'} />
            <Row k="Base URL" v={settings.api.baseUrl || '—'} mono />
          </>}
          {settings.mode === 'ollama' && <>
            <Row k="Server" v={settings.ollama.baseUrl || '—'} mono />
            <Row k="Model" v={settings.ollama.model || '—'} mono />
          </>}
        </dl>
      </div>
    </div>
  )
}

function ModeCard({ active, onClick, icon: Icon, title, description, accent }) {
  const map = {
    teal: 'border-accent-teal/50 bg-accent-teal/10 shadow-glow-teal',
    blue: 'border-accent-blue/50 bg-accent-blue/10 shadow-glow-blue',
    slate: 'border-slate-500/50 bg-slate-500/10',
  }
  const iconMap = {
    teal: 'text-accent-teal',
    blue: 'text-accent-blue',
    slate: 'text-slate-300',
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-xl p-4 border transition-all ${
        active ? map[accent] : 'bg-navy-900/40 border-navy-700 hover:border-navy-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${active ? iconMap[accent] : 'text-slate-400'}`} />
        <p className={`font-semibold ${active ? 'text-white' : 'text-slate-200'}`}>{title}</p>
        {active && <span className="ml-auto badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Active</span>}
      </div>
      <p className="text-xs text-slate-400 mt-2 leading-relaxed">{description}</p>
    </button>
  )
}

function Field({ label, full, children }) {
  return (
    <label className={`block ${full ? 'md:col-span-2' : ''}`}>
      <span className="block text-xs text-slate-400 mb-1.5 font-medium">{label}</span>
      {children}
    </label>
  )
}

function Row({ k, v, mono, tone }) {
  const valueClass = tone === 'ok' ? 'text-emerald-400' : tone === 'warn' ? 'text-accent-amber' : 'text-white'
  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-navy-900/40 border border-navy-700/40">
      <dt className="text-xs uppercase tracking-wider text-slate-400 font-semibold">{k}</dt>
      <dd className={`${valueClass} ${mono ? 'font-mono text-xs' : 'text-sm'} truncate text-right`}>{v}</dd>
    </div>
  )
}
