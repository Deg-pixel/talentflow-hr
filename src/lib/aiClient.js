import { loadSettings, PROVIDERS } from './aiSettings'

export function AI_MODE_LABEL() {
  const s = loadSettings()
  if (s.mode === 'ollama' && s.ollama.baseUrl) return `Ollama (${s.ollama.model || 'local'})`
  if (s.mode === 'api' && s.api.apiKey) return PROVIDERS[s.api.provider]?.name || 'Cloud AI'
  return 'Local Templates'
}

export async function generateText(prompt, { system, maxTokens = 600 } = {}) {
  const s = loadSettings()

  if (s.mode === 'ollama' && s.ollama.baseUrl && s.ollama.model) {
    try {
      return await callOllama(s.ollama.baseUrl, s.ollama.model, prompt, system)
    } catch (err) {
      console.warn('Ollama failed, falling back:', err.message)
    }
  }

  if (s.mode === 'api' && s.api.apiKey) {
    try {
      return await callApi(s.api, prompt, system, maxTokens)
    } catch (err) {
      console.warn('API call failed, falling back:', err.message)
    }
  }

  return null // signal caller to use template fallback
}

async function callOllama(baseUrl, model, prompt, system) {
  const url = baseUrl.replace(/\/+$/, '') + '/api/generate'
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model,
      prompt: system ? `${system}\n\n${prompt}` : prompt,
      stream: false,
    }),
  })
  if (!res.ok) throw new Error(`Ollama HTTP ${res.status}`)
  const data = await res.json()
  return (data.response || '').trim()
}

async function callApi({ provider, apiKey, baseUrl, model }, prompt, system, maxTokens) {
  const url = baseUrl.replace(/\/+$/, '')
  if (provider === 'openai' || provider === 'custom') {
    const res = await fetch(`${url}/chat/completions`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        messages: [
          ...(system ? [{ role: 'system', content: system }] : []),
          { role: 'user', content: prompt },
        ],
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const j = await res.json()
    return j.choices?.[0]?.message?.content?.trim() || ''
  }
  if (provider === 'anthropic') {
    const res = await fetch(`${url}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        system,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const j = await res.json()
    return j.content?.[0]?.text?.trim() || ''
  }
  if (provider === 'google') {
    const body = {
      contents: [{ parts: [{ text: system ? `${system}\n\n${prompt}` : prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    }
    const res = await fetch(`${url}/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const j = await res.json()
    return j.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
  }
  throw new Error('Unknown provider')
}

// ---------- High-level helpers (with template fallbacks) ----------

export async function generateJobDescription({ role, skills = [], experience, location, client }) {
  const sys = 'You are an experienced IT staffing recruiter. Write clear, scannable job descriptions in markdown using ## section headings.'
  const prompt = `Draft a professional job description.

Role: ${role || 'Software Engineer'}
Client: ${client || 'a leading enterprise'}
Skills required: ${skills.join(', ') || 'general engineering skills'}
Experience: ${experience || '4-7 yrs'}
Location: ${location || 'India'}

Structure:
## About the Role
## Key Responsibilities
## Required Skills
## Nice to Have
## What We Offer

Keep each section to 3-5 short bullet points. Use professional but warm tone.`

  const ai = await generateText(prompt, { system: sys, maxTokens: 700 })
  if (ai) return ai
  return jdTemplate({ role, skills, experience, location, client })
}

export async function draftInterviewFeedback(interview) {
  const sys = 'You are an experienced technical interviewer writing concise, structured interview feedback.'
  const round = { R1: '1st technical', R2: '2nd technical', FINAL: 'final', HR: 'HR' }[interview.round] || 'technical'
  const prompt = `Draft constructive interview feedback notes that a recruiter can edit.

Candidate: ${interview.candidate}
Role: ${interview.role}
Client: ${interview.client}
Round: ${round}
Mode: ${interview.mode}
Interviewer: ${interview.interviewer}

Output sections (markdown):
## Strengths
## Areas for Improvement
## Technical Depth
## Communication
## Recommendation

Each section 2-3 bullet points. Stay specific to the role.`

  const ai = await generateText(prompt, { system: sys, maxTokens: 500 })
  if (ai) return ai
  return feedbackTemplate(interview, round)
}

export async function summarizeCandidate(candidate) {
  const sys = 'You are an HR recruiter writing crisp candidate summaries.'
  const prompt = `Write a 4-sentence executive summary of this candidate for a hiring manager:

Name: ${candidate.name}
Tech stack: ${candidate.tech}
Experience: ${candidate.experience} years
Location: ${candidate.location}
Applied for client: ${candidate.client}
Expected CTC: ${candidate.expectedCtc}
Source: ${candidate.source}

Cover: 1) seniority & fit, 2) likely strengths, 3) one risk to verify, 4) recommended next step.`

  const ai = await generateText(prompt, { system: sys, maxTokens: 250 })
  if (ai) return ai
  return summaryTemplate(candidate)
}

// ---------- Template fallbacks (no AI needed) ----------

function jdTemplate({ role, skills, experience, location, client }) {
  const roleStr = role || 'Role'
  const skillsList = (skills && skills.length) ? skills : ['Strong fundamentals', 'Problem solving', 'Team collaboration']
  const expStr = experience || '4-7 yrs'
  const locStr = location || 'Hybrid (India)'
  const cliStr = client || 'a leading enterprise client'

  const bullets = (arr) => arr.map(s => `- ${s}`).join('\n')

  return `## About the Role
Our client, ${cliStr}, is hiring a ${roleStr} (${expStr}) based in ${locStr}. You'll join a delivery team building production systems used by enterprise users.

## Key Responsibilities
${bullets([
    `Own delivery of ${roleStr.toLowerCase()} components end to end`,
    'Collaborate with architects, QA, and product owners through agile ceremonies',
    'Write maintainable, well-tested code that meets quality and security standards',
    'Mentor junior team members and contribute to design reviews',
    'Triage production issues and drive long-term fixes',
  ])}

## Required Skills
${bullets(skillsList.map(s => `Hands-on experience with ${s}`))}
- ${expStr} of relevant industry experience
- Excellent written and verbal communication

## Nice to Have
- Exposure to cloud platforms (AWS / Azure / GCP)
- CI/CD pipelines and infrastructure-as-code
- Experience in the ${cliStr.split(' ')[0]} domain

## What We Offer
- Competitive compensation aligned to experience
- Long-term engagement with a stable enterprise client
- Continuous upskilling, certifications, and HTD support`
}

function feedbackTemplate(iv, roundLabel) {
  return `## Strengths
- Communicated clearly throughout the ${roundLabel} discussion
- Demonstrated solid foundational knowledge relevant to ${iv.role}
- Asked thoughtful, scope-clarifying questions before solving

## Areas for Improvement
- Could go deeper on system design trade-offs for ${iv.role.split(' ')[0]} workloads
- Would benefit from more recent hands-on production exposure
- Walk through edge cases before jumping to implementation

## Technical Depth
- Comfortable with core concepts; intermediate command of advanced topics
- Some gaps in ${(iv.role.match(/AWS|SAP|Java|Salesforce|Cyber/gi) || ['the target stack']).join('/')} internals

## Communication
- Concise, structured answers
- Open to feedback; engaged well with follow-up questions

## Recommendation
- ${iv.round === 'FINAL' || iv.round === 'HR' ? 'Proceed to offer pending salary alignment' : `Proceed to ${iv.round === 'R1' ? 'R2' : 'Final'} round`}
- Suggest deeper dive on production troubleshooting in the next round
- Confirm notice period and current CTC before next step`
}

function summaryTemplate(c) {
  const seniority = c.experience >= 8 ? 'senior' : c.experience >= 4 ? 'mid-senior' : 'junior'
  return `${c.name} is a ${seniority} ${c.tech} professional with ${c.experience} years of experience, based in ${c.location}. Strengths likely include hands-on ${c.tech} delivery and applied problem solving relevant to ${c.client}'s stack. One risk to verify: recent production exposure and any niche modules required by the ${c.client} engagement at the expected CTC of ${c.expectedCtc}. Recommended next step: schedule a 30-minute technical screen focused on ${c.tech} fundamentals and a recent project deep-dive.`
}
