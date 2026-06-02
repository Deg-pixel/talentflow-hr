import { useState, useEffect, useRef, useCallback } from 'react'

const NS = 'talentflow'
const SCHEMA_VERSION = 1

function key(name) {
  return `${NS}.v${SCHEMA_VERSION}.${name}`
}

export function readStored(name, fallback) {
  try {
    const raw = localStorage.getItem(key(name))
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function writeStored(name, value) {
  try {
    localStorage.setItem(key(name), JSON.stringify(value))
  } catch (e) {
    console.warn('Storage write failed', e)
  }
}

export function clearStored(name) {
  localStorage.removeItem(key(name))
}

export function clearAllStored() {
  Object.keys(localStorage)
    .filter(k => k.startsWith(`${NS}.v${SCHEMA_VERSION}.`))
    .forEach(k => localStorage.removeItem(k))
}

export function usePersistedState(name, seed) {
  const [value, setValue] = useState(() => readStored(name, seed))
  const firstRender = useRef(true)

  useEffect(() => {
    // Skip the very first render: state already came from storage; writing back is a no-op
    // but also avoids any chance of churn.
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    writeStored(name, value)
  }, [name, value])

  const reset = useCallback(() => setValue(seed), [seed])

  return [value, setValue, reset]
}
