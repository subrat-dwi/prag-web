import { useEffect, useRef, useState } from 'react'
import { verifyKey } from '../utils/api.js'
// import PixelBlast from './PixelBlast.jsx'

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

  // useEffect(() => {
  //   inputRef.current?.focus()
  // }, [])
  useEffect(() => {
  const isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches
  if (!isMobile) inputRef.current?.focus()
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
    <main className="relative prag-shell prag-bg-orbs prag-noise flex min-h-dvh flex-col justify-between bg-(--ctp-base) px-4 py-6 text-(--ctp-text) sm:px-6 lg:px-8">
      {/* <div className="absolute inset-0 z-0 overflow-hidden">
        <PixelBlast classname="relative h-full w-full overflow-hidden" />
      </div> */}
      
      <div className="relative mx-auto z-10 flex w-full max-w-6xl flex-1 flex-col items-center justify-between gap-10 py-4 text-center">
        <div className="pt-4 sm:pt-10">
          <div className="prag-title text-5xl font-semibold tracking-[0.24em] text-(--ctp-text) sm:text-6xl">
            PRAG
          </div>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-(--ctp-subtext) sm:text-base">
            A calm AI workspace for retrieval-augmented conversations with your personal documents.
          </p>
        </div>

        <div className={`w-full max-w-lg ${expiredMessage ? 'space-y-3' : ''}`}>
          {expiredMessage ? (
            <div className="rounded-2xl border border-(--ctp-yellow)/70 bg-(--ctp-yellow)/14 px-4 py-3 text-left text-sm text-(--ctp-yellow) shadow-[0_8px_18px_rgba(0,0,0,0.28)]">
              {expiredMessage}
            </div>
          ) : null}

          <form
            onSubmit={(event) => {
              event.preventDefault()
              handleLogin()
            }}
            className={`prag-card w-full max-w-lg rounded-[28px] border border-(--ctp-surface1)/75 bg-(--ctp-mantle)/88 p-5 text-left backdrop-blur-md sm:p-7 ${shakeCounter ? 'shake-card' : ''}`}
            onAnimationEnd={() => setShakeCounter(0)}
          >
            <label
              htmlFor="access-key"
              className="mb-3 block text-sm font-medium tracking-[0.08em] text-(--ctp-subtext)"
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
              className="w-full rounded-2xl border border-(--ctp-surface1) bg-(--ctp-crust)/85 px-4 py-3 text-sm text-(--ctp-text) outline-none transition placeholder:text-(--ctp-overlay) focus:border-(--ctp-mauve) focus:ring-2 focus:ring-(--ctp-mauve)/30"
              aria-invalid={Boolean(errorMessage)}
              aria-describedby={errorMessage ? 'prag-auth-error' : undefined}
            />

            {errorMessage ? (
              <p id="prag-auth-error" className="text-sm text-(--ctp-red)">
                {errorMessage}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={!enteredKey.trim() || isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-(--ctp-mauve) px-4 py-3 font-medium text-(--ctp-crust) transition hover:bg-[#bea0ee] disabled:cursor-not-allowed disabled:bg-(--ctp-surface2) disabled:text-(--ctp-overlay)"
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
          {['Multi-format support', 'Hybrid Search', 'Privacy by design'].map((pill) => (
            <span key={pill} className="rounded-full border border-(--ctp-surface1) bg-(--ctp-mantle)/72 px-4 py-2 text-xs text-(--ctp-subtext) shadow-[0_8px_16px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:text-sm">
              {pill}
            </span>
          ))}
        </div>
      </div>
    </main>
  )
}