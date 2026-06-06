import { useEffect, useRef, useState } from 'react'
import { verifyKey } from '../utils/api.js'

function Spinner() {
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" opacity="0.25" />
        <path d="M20 12a8 8 0 0 0-8-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export default function LandingPage({ expiredMessage, noticeMessage, onAuthenticated, onClearNotice }) {
  const [enteredKey, setEnteredKey] = useState('')
  const [localError, setLocalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [shakeCounter, setShakeCounter] = useState(0)
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const errorMessage = localError || noticeMessage

  const clearMessages = () => {
    setLocalError('')
    onClearNotice?.()
  }

  async function handleLogin() {
    const trimmedKey = enteredKey.trim()

    if (!trimmedKey || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setLocalError('')

    try {
      const valid = await verifyKey(trimmedKey)

      if (valid) {
        sessionStorage.setItem('prag_key', trimmedKey)
        setEnteredKey('')
        onAuthenticated(trimmedKey)
      } else {
        setError('Invalid access key.')
        setShakeCounter((count) => count + 1)
      }
    } catch {
      setError('Could not reach server. Is it running?')
    } finally {
      setIsSubmitting(false)
    }
  }

  function setError(message) {
    setLocalError(message)
  }

  return (
    <main className="prag-shell prag-noise flex min-h-screen flex-col justify-between bg-(--sand) px-4 py-6 text-(--cocoa) sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-between gap-8 py-4 text-center">
        <div className="pt-2 sm:pt-8">
          <div className="prag-title text-5xl font-semibold tracking-[0.28em] text-(--cocoa) sm:text-6xl">
            PRAG
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--cocoa)/80 sm:text-base">
            Your personal document assistant. Ask anything about yourself.
          </p>
        </div>

        <div className={`w-full max-w-lg ${expiredMessage ? 'space-y-3' : ''}`}>
          {expiredMessage ? (
            <div className="rounded-2xl border border-[#c4a944] bg-[#efe2aa] px-4 py-3 text-left text-sm text-(--cocoa) shadow-[0_6px_16px_rgba(74,67,62,0.08)]">
              {expiredMessage}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleLogin()
            }}
            className={`prag-card w-full max-w-lg rounded-[28px] border border-(--horizon) bg-(--mist)/95 p-5 text-left backdrop-blur-sm sm:p-7 ${shakeCounter ? 'shake-card' : ''}`}
            onAnimationEnd={() => setShakeCounter(0)}
          >
            <label
              htmlFor="access-key"
              className="mb-3 block text-sm font-medium tracking-[0.08em] text-(--cocoa)"
            >
              Enter your access key
            </label>

          <div className="space-y-3">
            <input
              ref={inputRef}
              id="access-key"
              type="password"
              autoComplete="current-password"
              value={enteredKey}
              onChange={(event) => {
                setEnteredKey(event.target.value)
                clearMessages()
              }}
              disabled={isSubmitting}
              className="w-full rounded-2xl border border-(--horizon) bg-(--sand) px-4 py-3 font-mono text-sm text-(--cocoa) outline-none transition focus:border-(--orange) focus:ring-2 focus:ring-(--orange)/35"
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'prag-auth-error' : undefined}
            />

            {errorMessage ? (
              <p id="prag-auth-error" className="text-sm text-(--coral)">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!enteredKey.trim() || isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--orange) px-4 py-3 font-medium text-white transition hover:bg-[#b85f24] disabled:cursor-not-allowed disabled:bg-(--horizon) disabled:opacity-100"
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Verifying...
                </>
              ) : (
                <>
                  Start Chat <span aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>
        </div>

        <div className="flex w-full max-w-4xl flex-wrap justify-center gap-3 pb-2 sm:gap-4">
          {['🔒 Local-first privacy', '📄 Multi-format documents', '⚡ Instant answers'].map((pill) => (
            <span key={pill} className="rounded-full border border-(--horizon) bg-[#e8e2d6a6] px-4 py-2 text-xs text-(--cocoa) shadow-[0_6px_16px_rgba(74,67,62,0.08)] backdrop-blur-sm sm:text-sm">
              {pill}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}