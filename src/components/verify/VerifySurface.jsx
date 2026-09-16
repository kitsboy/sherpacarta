/**
 * VerifySurface — SherpaCarta's public "Verify this proof" surface.
 *
 * A self-contained section wired to the family verify API. A visitor pastes a
 * 64-char SHA-256 hash (the fingerprint of a document version) and this
 * surface asks Bitcoin directly — via https://api.satohash.io/api/verify —
 * then renders the shared HowProofWorks trust explainer (ported from
 * kitsboy/satohash @5b4c913, src/components/trust/HowProofWorks.jsx).
 *
 * Honesty rules baked in (family spec, do not soften):
 *   - verified:true  -> "Anchored to Bitcoin" + method (bitcoind | esplora) + block
 *   - anything else  -> "Not proven" or "Waiting for Bitcoin" — never confirmed
 *   - registry status is never presented as proof
 *   - the .ots download is offered wherever a verdict is shown
 */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import HowProofWorks, { stateFromVerdict } from '../trust/HowProofWorks'
import { SATOHASH_API } from '../../lib/satohash'

const HASH_RE = /^[a-f0-9]{64}$/

const SURFACE_LABELS = {
  title: 'What this proof means',
  subtitle: 'You do not have to trust us — or this page. Here is what to check, in one minute.',
}

/** POST {hash} to the family verify API. Pure public endpoint, no secrets. */
async function callVerifyApi(hash, signal) {
  const res = await fetch(`${SATOHASH_API}/api/verify`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Satohash-Client': 'sherpacarta',
    },
    body: JSON.stringify({ hash }),
    signal,
  })
  let data
  try {
    data = await res.json()
  } catch {
    // Not JSON at all — treat as an unreachable service.
    throw new Error(`HTTP ${res.status}`)
  }
  // The verify API signals a forged/unresolved proof with a non-200 status
  // (e.g. 404) but still returns a JSON verdict body. A verdict is a verdict:
  // verified:false must render as "Not proven", never as a network error.
  if (data && typeof data.verified === 'boolean') return data
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return data
}

export default function VerifySurface() {
  // Deep-link support: /verify.html?hash=<64hex> prefills the input from the
  // URL once, so a rightsholder can link a claim straight to its check.
  const [input, setInput] = useState(() => {
    const q = new URLSearchParams(window.location.search)
    return (q.get('hash') || q.get('q') || '').trim().toLowerCase()
  })
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState(null)
  const [verdict, setVerdict] = useState(null)
  const [usedHash, setUsedHash] = useState(null)
  const abortRef = useRef(null)

  const normalized = useMemo(() => String(input || '').trim().toLowerCase(), [input])
  const valid = HASH_RE.test(normalized)

  const runVerify = useCallback(async (hash) => {
    const hex = String(hash || '').trim().toLowerCase()
    if (!HASH_RE.test(hex)) {
      setError('Please paste the full 64-character SHA-256 fingerprint (letters and numbers only).')
      return
    }
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setVerifying(true)
    setError(null)
    setVerdict(null)
    setUsedHash(hex)
    try {
      const data = await callVerifyApi(hex, controller.signal)
      // Render what the chain actually returned. Never upgrade a verdict.
      setVerdict(data)
    } catch (e) {
      if (e.name === 'AbortError') return
      setError(
        'The Bitcoin check could not be reached. Nothing was decided — please try again in a moment.'
      )
    } finally {
      if (!controller.signal.aborted) setVerifying(false)
    }
  }, [])

  // Auto-verify the deep-linked hash once on load (deferred so the verify
  // call's setState happens outside the effect body).
  useEffect(() => {
    if (HASH_RE.test(input)) {
      const id = window.setTimeout(() => runVerify(input), 0)
      return () => window.clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => () => abortRef.current?.abort(), [])

  const state = verdict ? stateFromVerdict(verdict) : null
  const showCard = verdict !== null

  return (
    <section
      className="verify-surface p-5 sm:p-6"
      aria-labelledby="verify-surface-title"
      data-testid="verify-surface"
    >
      <div className="verify-kicker">Verify this proof · live against Bitcoin</div>
      <h2
        id="verify-surface-title"
        className="mt-1 text-2xl sm:text-3xl font-bold"
        style={{ color: 'var(--text-primary)', fontFamily: 'var(--serif, serif)' }}
      >
        Does Bitcoin back this fingerprint?
      </h2>
      <p className="mt-1 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
        Paste the SHA-256 fingerprint (hash) of the document you were given. We ask a Bitcoin
        node directly. No account, no upload of your file — and nothing to trust on this page.
      </p>

      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid && !verifying) runVerify(normalized)
        }}
      >
        <label className="sr-only" htmlFor="verify-hash-input">
          SHA-256 fingerprint (64 hex characters)
        </label>
        <input
          id="verify-hash-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste 64-character SHA-256 hash, e.g. 1ce9eb8b…"
          spellCheck="false"
          autoComplete="off"
          aria-describedby={error ? 'verify-error' : undefined}
          className="w-full flex-1 rounded-full border px-4 py-3"
          style={{ borderColor: 'var(--border)', background: 'var(--surface-raised)', color: 'var(--text-primary)' }}
        />
        <button
          type="submit"
          className="btn-verify"
          disabled={!valid || verifying}
        >
          {verifying ? 'Checking Bitcoin…' : 'Verify against Bitcoin'}
        </button>
      </form>

      {error ? (
        <p
          id="verify-error"
          role="status"
          aria-live="polite"
          className="mt-3 text-sm font-semibold"
          style={{ color: 'var(--accent-alert)' }}
        >
          {error}
        </p>
      ) : null}

      {!error && input.trim() && !valid ? (
        <p
          id="verify-hint"
          className="mt-3 text-xs"
          style={{ color: 'var(--text-secondary)' }}
        >
          A SHA-256 fingerprint is exactly 64 characters — letters a–f and numbers 0–9.
          If you have a document, use the “Calculate SHA-256” tool below to get its hash first.
        </p>
      ) : null}

      {showCard ? (
        <div className="mt-5">
          <HowProofWorks
            verdict={verdict}
            state={state}
            hash={usedHash}
            otsUrl={verdict.ots_download_url || null}
            variant="full"
            labels={SURFACE_LABELS}
          />
        </div>
      ) : null}
    </section>
  )
}
