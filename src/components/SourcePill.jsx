export default function SourcePill({ filename, fileUrl, driveUrl, relevanceScore }) {
  const confidence = Math.round(relevanceScore * 100)
  const href = fileUrl ?? driveUrl
  const confidenceClass =
    confidence >= 85
      ? 'bg-(--ctp-green)/20 text-(--ctp-green)'
      : confidence >= 70
        ? 'bg-(--ctp-blue)/20 text-(--ctp-blue)'
        : 'bg-(--ctp-yellow)/22 text-(--ctp-yellow)'

  const content = (
    <>
      <span className="line-clamp-1">{filename}</span>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${confidenceClass}`}>
        {confidence}%
      </span>
    </>
  )

  if (!href) {
    return (
      <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-(--ctp-surface1) bg-(--ctp-crust)/80 px-3 py-1 text-[11px] font-medium text-(--ctp-subtext)">
        {content}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center gap-2 rounded-full border border-(--ctp-surface1) bg-(--ctp-crust)/80 px-3 py-1 text-[11px] font-medium text-(--ctp-subtext) transition hover:border-(--ctp-blue)/70 hover:text-(--ctp-text) hover:underline"
    >
      {content}
    </a>
  )
}