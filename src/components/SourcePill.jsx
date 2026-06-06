export default function SourcePill({ filename, fileUrl, driveUrl, relevanceScore }) {
  const label = `${filename} (${Math.round(relevanceScore * 100)}%)`
  const href = fileUrl ?? driveUrl

  if (!href) {
    return (
      <span className="inline-flex max-w-full items-center rounded-full bg-(--seafoam) px-3 py-1 text-[11px] font-medium text-(--cocoa)">
        {label}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex max-w-full items-center rounded-full bg-(--seafoam) px-3 py-1 text-[11px] font-medium text-(--cocoa) transition hover:underline"
    >
      {label}
    </a>
  )
}