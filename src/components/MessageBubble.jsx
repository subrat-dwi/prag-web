import SourcePill from './SourcePill.jsx'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isError = message.variant === 'error'

  if (isUser) {
    return (
      <div className="prag-fade-in flex justify-end">
        <div className="max-w-[88%] rounded-[18px_18px_6px_18px] border border-(--ctp-blue)/55 bg-(--ctp-blue)/18 px-4 py-3 text-sm leading-6 text-(--ctp-text) shadow-[0_12px_22px_rgba(8,8,14,0.35)] sm:max-w-[75%] sm:text-[15px]">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="prag-fade-in flex justify-start">
      <div
        className={`max-w-[92%] rounded-[18px_18px_18px_6px] border px-4 py-3 text-sm leading-6 shadow-[0_12px_24px_rgba(0,0,0,0.3)] sm:max-w-[78%] sm:text-[15px] ${
          isError
            ? 'border-(--ctp-red)/65 bg-(--ctp-red)/16 text-(--ctp-text)'
            : 'border-(--ctp-surface1) bg-(--ctp-mantle)/88 text-(--ctp-text)'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.sources?.length ? (
          <div className="mt-3 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--ctp-overlay)">
              Sources:
            </div>

            <div className="flex flex-wrap gap-2">
              {message.sources.map((source) => (
                <SourcePill
                  key={`${source.filename}-${source.relevance_score}`}
                  filename={source.filename}
                  fileUrl={source.file_url}
                  relevanceScore={source.relevance_score}
                />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}