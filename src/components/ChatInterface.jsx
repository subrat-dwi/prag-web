import { useEffect, useRef, useState } from 'react'
import { FiLock, FiRefreshCw, FiSend } from 'react-icons/fi'
import FilesDropdown from './FilesDropdown.jsx'
import MessageBubble from './MessageBubble.jsx'
import TypingIndicator from './TypingIndicator.jsx'
import Spinner from './Spinner.jsx'
import { fetchFiles } from '../utils/api.js'
import { AiOutlineFileSync } from 'react-icons/ai'
import { LoaderIcon } from 'lucide-react'
import PixelBlast from './PixelBlast.jsx'

function SuggestionChip({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="prag-subtle-panel prag-glow-hover rounded-2xl px-4 py-2.5 text-left text-xs text-(--ctp-subtext) sm:text-sm"
    >
      {children}
    </button>
  )
}

const SUGGESTIONS = [
  'What are my technical skills?',
  'Generate my interview intro',
  'What is my latest CGPA?',
  'Duration of my internships?',
]

export default function ChatInterface({ indexedFiles: initialFiles, isLoading, messages, syncing, onSync, onLock, onSendMessage }) {
  const [draft, setDraft] = useState('')
  const [indexedFiles, setIndexedFiles] = useState(initialFiles)
  const [totalFiles, setTotalFiles] = useState(initialFiles.length)
  const textareaRef = useRef(null)
  const scrollAnchorRef = useRef(null)
  const showSuggestions = messages.length === 1 && messages[0]?.role === 'assistant'

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
        // silent fail - dropdown just shows the initial files list
      })
  }, [])

  const handleSend = async (messageText = draft) => {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isLoading) {
      return
    }

    setDraft('')
    await onSendMessage(trimmedMessage)
    // requestAnimationFrame(() => textareaRef.current?.focus())
  }

  return (
    <div className="prag-shell prag-bg-orbs flex h-screen flex-col bg-(--ctp-base) px-3 py-3 text-(--ctp-text) sm:px-4 sm:py-4">
      <div className="prag-panel prag-slide-up flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden opacity-25">
          <PixelBlast classname="relative h-full w-full overflow-hidden" />
        </div>
      

        <header className="flex h-16 items-center justify-between gap-3 border-b border-(--ctp-surface1)/70 px-4 sm:px-5 shrink-0">
          {/* <div className="flex min-w-0 items-center gap-3"> */}
            <div className="prag-heading text-[16px] font-semibold text-(--ctp-subtext) sm:text-base">PRAG</div>
          {/* </div> */}
            <div className="flex items-center gap-2 max-sm:gap-1">
                <FilesDropdown files={indexedFiles} totalFiles={totalFiles} />
                <button
                    type="button"
                    onClick={onSync}
                    disabled={syncing}
                    className="prag-glow-hover inline-flex items-center gap-2 rounded-full border border-(--ctp-surface1) bg-(--ctp-crust)/70 px-3 py-1 max-sm:py-2 text-xs font-medium text-(--ctp-subtext) transition sm:text-sm"
                    aria-label="Lock session"
                    title="Lock session"
                    >
                    {syncing ? <Spinner/> : <FiRefreshCw className="h-4 w-4" />}
                    {/* <FiRefreshCw className="h-4 w-4" aria-hidden="true" /> */}
                    <span className="hidden sm:inline">Sync</span>
                </button>
                <button
                    type="button"
                    onClick={onLock}
                    className="prag-glow-hover inline-flex items-center gap-2 rounded-full border border-(--ctp-surface1) bg-(--ctp-crust)/70 px-3 py-1 max-sm:py-2 text-xs font-medium text-(--ctp-subtext) transition sm:text-sm"
                    aria-label="Lock session"
                    title="Lock session"
                >
                    <FiLock className="h-4 w-4" aria-hidden="true" />
                    <span className="hidden sm:inline">Lock</span>
                </button>
            </div>
        </header>

        <section className="prag-scrollbar flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}

            {isLoading ? <TypingIndicator /> : null}

            {showSuggestions ? (
              <div className="prag-fade-in mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
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

        <footer className="shrink-0 border-t border-(--ctp-surface1)/70 bg-(--ctp-mantle)/80 px-3 py-3 backdrop-blur-md sm:px-5 sm:py-4">
          <div className="mx-auto w-full max-w-5xl">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                handleSend()
              }}
              className="prag-subtle-panel flex items-center justify-center gap-2 rounded-[20px] p-2 sm:gap-3 sm:p-3"
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
                placeholder="Ask PRAG..."
                className="max-h-35 min-h-14 flex-1 resize-none rounded-2xl border border-(--ctp-surface1) bg-(--ctp-crust)/82 px-4 py-3 text-sm leading-6 text-(--ctp-text) outline-none transition placeholder:text-(--ctp-overlay) focus:border-(--ctp-blue) focus:ring-2 focus:ring-(--ctp-blue)/30"
              />

              <button
                type="submit"
                disabled={!draft.trim() || isLoading}
                className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-(--ctp-blue) text-(--ctp-crust) transition hover:bg-[#74a7f6] disabled:cursor-not-allowed disabled:bg-(--ctp-surface2) disabled:text-(--ctp-overlay)"
                aria-label="Send message"
              >
                <FiSend className="h-5 w-5" aria-hidden="true" />
              </button>
            </form>
          </div>
        </footer>
      </div>
    </div>
  )
}
