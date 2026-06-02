/**
 * Generate screenshots for the README.
 *
 * Prereqs:
 *   - npm run dev  (vite must be listening on http://localhost:5173)
 *
 * Run:
 *   node scripts/screenshots.mjs
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const OUT_DIR = path.resolve(__dirname, '..', 'public', 'screenshots')

const BASE = process.env.SCREENSHOT_BASE || 'http://localhost:5173'

const VIEWPORT = { width: 1440, height: 900 }

const PAGES = [
  { slug: 'dashboard', path: '/', waitFor: 'h3:has-text("Monthly Placements")' },
  { slug: 'pipeline', path: '/pipeline', waitFor: 'span.badge:has-text("Sourced")' },
  { slug: 'jobs', path: '/jobs', waitFor: 'th:has-text("Job ID")' },
  { slug: 'clients', path: '/clients', waitFor: 'h3:has-text("Cognizant")' },
  { slug: 'interviews', path: '/interviews', waitFor: 'th:has-text("Candidate")' },
  { slug: 'analytics', path: '/analytics', waitFor: 'h3:has-text("Placements by Industry")' },
  { slug: 'training', path: '/training', waitFor: 'h3:has-text("HTD Pipeline")' },
  { slug: 'team', path: '/team', waitFor: 'h3:has-text("Anjali Verma")' },
  { slug: 'settings', path: '/settings', waitFor: 'h2:has-text("AI Assistant")' },
]

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function main() {
  await mkdir(OUT_DIR, { recursive: true })

  const browser = await chromium.launch()
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 2, // retina, sharper PNGs
    colorScheme: 'dark',
  })
  const page = await ctx.newPage()

  // Pre-warm: set localStorage so the demo banner is dismissed and AI shows Ollama
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => {
    sessionStorage.setItem('talentflow.banner-dismissed', '1')
    // ensure a clean seed
    Object.keys(localStorage).filter(k => k.startsWith('talentflow.v1.')).forEach(k => localStorage.removeItem(k))
  })

  for (const p of PAGES) {
    const url = BASE + p.path
    console.log(`→ ${url}`)
    await page.goto(url, { waitUntil: 'networkidle' })
    try {
      await page.waitForSelector(p.waitFor, { timeout: 5000 })
    } catch {
      console.warn(`  waitFor selector missed (${p.waitFor}); continuing`)
    }
    await sleep(450) // let animations settle
    const file = path.join(OUT_DIR, `${p.slug}.png`)
    await page.screenshot({ path: file, fullPage: false })
    console.log(`  saved ${path.relative(process.cwd(), file)}`)
  }

  await browser.close()
  console.log(`\n✓ Done. ${PAGES.length} screenshots in ${path.relative(process.cwd(), OUT_DIR)}`)
}

main().catch(err => { console.error(err); process.exit(1) })
