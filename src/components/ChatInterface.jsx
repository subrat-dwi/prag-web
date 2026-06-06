import { useEffect, useRef, useState } from 'react'
import FilesDropdown from './FilesDropdown.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import { fetchFiles } from '../utils/api.js'
import { FiLock, FiSend } from 'react-icons/fi'

function SuggestionChip({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-(--horizon) bg-(--mist) px-4 py-2 text-left text-xs text-(--cocoa) transition hover:bg-(--seafoam)/40 sm:text-sm"
    >
      {children}
    </button>
  )
}

const SUGGESTIONS = [
  'What are my technical skills?',
  'Generate my interview intro',
  'What is my latest CGPA?',
  'Summarize my experience',
]

export default function ChatInterface({ indexedFiles: initialFiles, isLoading, messages, onLock, onSendMessage }) {
  const [draft, setDraft] = useState('')
  const [indexedFiles, setIndexedFiles] = useState(initialFiles)
  const [totalFiles, setTotalFiles] = useState(initialFiles.length)
  const textareaRef = useRef(null)
  const scrollAnchorRef = useRef(null)
  const showSuggestions = messages.length === 1 && messages[0].role === 'assistant'

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, isLoading])

  useEffect(() => {
    const textarea = textareaRef.current

    if (!textarea) {
      return
    }

    textarea.style.height = 'auto'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`
  }, [draft])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  useEffect(() => {
    fetchFiles(sessionStorage.getItem('prag_key'))
      .then((data) => {
        setIndexedFiles(data.files)
        setTotalFiles(data.total)
      })
      .catch(() => {
        // silent fail — dropdown just shows the initial files list
      })
  }, [])

  const handleSend = async (messageText = draft) => {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isLoading) {
      return
    }

    setDraft('')
    await onSendMessage(trimmedMessage)
    requestAnimationFrame(() => textareaRef.current?.focus())
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-(--sand) text-(--cocoa)">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-(--cocoa) shadow-[0_10px_24px_rgba(74,67,62,0.25)]">
        <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="prag-heading text-lg font-semibold tracking-[0.35em] text-(--sand)">
              PRAG
            </div>
            <FilesDropdown files={indexedFiles} totalFiles={totalFiles} />
          </div>

          <button
            type="button"
            onClick={onLock}
            className="rounded-full border border-white/10 bg-white/8 p-2 text-(--sand) transition hover:bg-white/14"
            aria-label="Log out"
            title="Log out"
          >
            <FiLock className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </header>

      <main className="flex flex-1 flex-col overflow-hidden pt-16">
        <section className="prag-scrollbar flex-1 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 pb-32 sm:pb-36">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading ? <TypingIndicator /> : null}

            {showSuggestions ? (
              <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {SUGGESTIONS.map((suggestion) => (
                  <SuggestionChip key={suggestion} onClick={() => handleSend(suggestion)}>
                    {suggestion}
                  </SuggestionChip>
                ))}
              </div>
            ) : null}

            <div ref={scrollAnchorRef} />
          </div>
        </section>

        <footer className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-(--cocoa) shadow-[0_-10px_24px_rgba(74,67,62,0.18)]">
          <div className="mx-auto w-full max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSend()
              }}
              className="flex items-end gap-3"
            >
              <textarea
                ref={textareaRef}
                value={draft}
                rows={1}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    handleSend()
                  }
                }}
                placeholder="Ask PRAG about your documents..."
                className="max-h-35 min-h-14 flex-1 resize-none rounded-2xl border border-(--horizon) bg-(--sand) px-4 py-3 font-mono text-sm leading-6 text-(--cocoa) outline-none transition placeholder:text-(--horizon) focus:border-(--orange) focus:ring-2 focus:ring-(--orange)/30"
              />

              <button
                type="submit"
                disabled={!draft.trim() || isLoading}
                className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-(--orange) text-white transition hover:bg-[#b95f22] disabled:cursor-not-allowed disabled:bg-[#a88b73] disabled:text-white/70"
                aria-label="Send message"
              >
                <FiSend className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </footer>
      </main>
    </div>
  )
}