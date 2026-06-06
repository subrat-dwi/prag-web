export default function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 rounded-[18px_18px_18px_4px] border-l-4 border-l-(--seafoam) bg-(--mist) px-4 py-3 text-(--cocoa) shadow-[0_8px_18px_rgba(74,67,62,0.08)]">
      <span className="text-sm text-(--horizon)">Thinking</span>
      <span className="flex items-center gap-1">
        <span className="prag-bounce-dot h-2 w-2 rounded-full bg-(--horizon)" />
        <span className="prag-bounce-dot h-2 w-2 rounded-full bg-(--horizon)" />
        <span className="prag-bounce-dot h-2 w-2 rounded-full bg-(--horizon)" />
      </span>
    </div>
  )
}