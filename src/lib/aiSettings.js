const STORAGE_KEY = 'talentflow.ai.settings'

export const PROVIDERS = {
  openai: {
    id: 'openai',
    name: 'OpenAI',
    defaultModel: 'gpt-4o-mini',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    defaultBaseUrl: 'https://api.openai.com/v1',
    keyLabel: 'sk-...',
    docs: 'https://platform.openai.com/api-keys',
  },
  anthropic: {
    id: 'anthropic',
    name: 'Anthropic Claude',
    defaultModel: 'claude-opus-4-7',
    models: ['claude-opus-4-8', 'claude-opus-4-7', 'claude-sonnet-4-6', 'claude-haiku-4-5'],
    defaultBaseUrl: 'https://api.anthropic.com/v1',
    keyLabel: 'sk-ant-...',
    docs: 'https://console.anthropic.com/settings/keys',
  },
  google: {
    id: 'google',
    name: 'Google Gemini',
    defaultModel: 'gemini-1.5-flash',
    models: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    keyLabel: 'AIza...',
    docs: 'https://aistudio.google.com/app/apikey',
  },
  custom: {
    id: 'custom',
    name: 'Custom / Proxy',
    defaultModel: '',
    models: [],
    defaultBaseUrl: '',
    keyLabel: 'your-api-key',
    docs: '',
  },
}

export const defaultSettings = {
  mode: 'ollama', // 'api' | 'ollama' | 'off' — default to free local Ollama with template fallback
  api: {
    provider: 'openai',
    apiKey: '',
    baseUrl: PROVIDERS.openai.defaultBaseUrl,
    model: PROVIDERS.openai.defaultModel,
  },
  ollama: {
    baseUrl: 'http://localhost:11434',
    model: 'llama3.2',
  },
}

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultSettings
    const parsed = JSON.parse(raw)
    return {
      ...defaultSettings,
      ...parsed,
      api: { ...defaultSettings.api, ...(parsed.api || {}) },
      ollama: { ...defaultSettings.ollama, ...(parsed.ollama || {}) },
    }
  } catch {
    return defaultSettings
  }
}

export function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  window.dispatchEvent(new CustomEvent('talentflow:ai-settings-changed', { detail: settings }))
}

export function clearSettings() {
  localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new CustomEvent('talentflow:ai-settings-changed', { detail: defaultSettings }))
}

export async function testOllamaConnection(baseUrl) {
  const url = baseUrl.replace(/\/+$/, '')
  const res = await fetch(`${url}/api/tags`)
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data = await res.json()
  return data.models?.map(m => m.name) || []
}

export async function testApiConnection(provider, apiKey, baseUrl, model) {
  if (!apiKey) throw new Error('API key is required')
  const url = baseUrl.replace(/\/+$/, '')

  if (provider === 'openai' || provider === 'custom') {
    const res = await fetch(`${url}/models`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
    return true
  }
  if (provider === 'anthropic') {
    const res = await fetch(`${url}/messages`, {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ model: model || 'claude-haiku-4-5', max_tokens: 4, messages: [{ role: 'user', content: 'ping' }] }),
    })
    if (!res.ok && res.status !== 401) throw new Error(`HTTP ${res.status}`)
    if (res.status === 401) throw new Error('Invalid API key')
    return true
  }
  if (provider === 'google') {
    const res = await fetch(`${url}/models?key=${apiKey}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return true
  }
  throw new Error('Unknown provider')
}

export function statusLabel(settings) {
  if (settings.mode === 'off') return { label: 'AI Off · Templates', tone: 'slate' }
  if (settings.mode === 'api') {
    const ok = !!settings.api.apiKey
    return {
      label: ok ? `${PROVIDERS[settings.api.provider]?.name || 'API'} · ${settings.api.model}` : 'AI · Local Templates',
      tone: ok ? 'teal' : 'blue',
    }
  }
  if (settings.mode === 'ollama') {
    return { label: `Ollama · ${settings.ollama.model || 'local'}`, tone: 'blue' }
  }
  return { label: 'Unknown', tone: 'slate' }
}
