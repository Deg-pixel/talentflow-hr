import { useEffect, useState } from 'react'

const KEY = 'talentflow.auth.user'
const EVT = 'talentflow:auth-changed'

export const DEMO_PROFILES = [
  { name: 'Demo Admin', email: 'admin@talentflow.demo', role: 'Admin', avatar: 'DA' },
  { name: 'Anjali Verma', email: 'anjali.v@talentflow.demo', role: 'Recruitment Lead', avatar: 'AV' },
  { name: 'Pradeep Mishra', email: 'pradeep.m@talentflow.demo', role: 'Account Manager', avatar: 'PM' },
  { name: 'Tanya Bhatt', email: 'tanya.b@talentflow.demo', role: 'Recruiter', avatar: 'TB' },
]

function initialsOf(name) {
  return (name || 'NA').split(/\s+/).map(s => s[0]).join('').slice(0, 2).toUpperCase()
}

export function loadUser() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function persist(user) {
  if (user) localStorage.setItem(KEY, JSON.stringify(user))
  else localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent(EVT, { detail: user }))
}

export function signIn({ email, password, remember = true }) {
  // Client-side demo auth: accept any well-formed email + password >= 6 chars.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Please enter a valid email address.')
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters.')
  }
  const namePart = email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').trim() || 'User'
  const name = namePart.split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
  const user = { name, email, role: 'Member', avatar: initialsOf(name), signedInAt: new Date().toISOString(), remember }
  persist(user)
  return user
}

export function signUp({ name, email, password, role }) {
  if (!name || name.trim().length < 2) throw new Error('Enter your full name.')
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Please enter a valid email address.')
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters.')
  const user = { name: name.trim(), email, role: role || 'Member', avatar: initialsOf(name), signedInAt: new Date().toISOString() }
  persist(user)
  return user
}

export function signInAsDemo(profile) {
  const user = { ...profile, signedInAt: new Date().toISOString(), isDemo: true }
  persist(user)
  return user
}

export function signOut() {
  persist(null)
}

export function useAuth() {
  const [user, setUser] = useState(() => loadUser())
  useEffect(() => {
    const sync = () => setUser(loadUser())
    window.addEventListener(EVT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(EVT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])
  return user
}
