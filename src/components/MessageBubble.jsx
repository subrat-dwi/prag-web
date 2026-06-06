import SourcePill from './SourcePill.jsx'

export default function MessageBubble({ message }) {
  const isUser = message.role === 'user'
  const isError = message.variant === 'error'

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[88%] rounded-[18px_18px_4px_18px] bg-(--cocoa) px-4 py-3 text-sm leading-6 text-(--sand) shadow-[0_10px_20px_rgba(74,67,62,0.12)] sm:max-w-[75%] sm:text-[15px]">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-start">
      <div
        className={`max-w-[92%] rounded-[18px_18px_18px_4px] border-l-4 px-4 py-3 text-sm leading-6 shadow-[0_10px_20px_rgba(74,67,62,0.08)] sm:max-w-[78%] sm:text-[15px] ${
          isError
            ? 'border-l-(--coral) bg-[#f2d9d3] text-(--cocoa)'
            : 'border-l-(--seafoam) bg-(--mist) text-(--cocoa)'
        }`}
      >
        <p>{message.content}</p>

        {message.sources?.length ? (
          <div className="mt-3 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-(--horizon)">
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