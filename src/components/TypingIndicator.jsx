export default function TypingIndicator() {
  return (
    <div className="prag-fade-in flex items-center gap-2 rounded-[18px_18px_18px_6px] border border-(--ctp-surface1) bg-(--ctp-mantle)/90 px-4 py-3 text-(--ctp-subtext) shadow-[0_10px_20px_rgba(0,0,0,0.34)]">
      <span className="text-sm text-(--ctp-overlay)">Thinking</span>
      <span className="flex items-center gap-1">
        <span className="prag-bounce-dot h-2 w-2 rounded-full bg-(--ctp-mauve)" />
        <span className="prag-bounce-dot h-2 w-2 rounded-full bg-(--ctp-blue)" />
        <span className="prag-bounce-dot h-2 w-2 rounded-full bg-(--ctp-teal)" />
      </span>
    </div>
  )
}