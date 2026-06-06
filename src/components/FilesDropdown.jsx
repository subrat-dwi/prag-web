import { useEffect, useRef, useState } from 'react'
import { FiFileText } from 'react-icons/fi'

function FileIcon() {
  return <FiFileText className="h-4 w-4" aria-hidden="true" />
}

export default function FilesDropdown({ files, totalFiles }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="flex items-baseline justify-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-medium text-(--sand) transition hover:bg-white/12 sm:text-sm"
      >
        <FileIcon />
        <span>
          {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute left-0 top-full z-30 mt-2 w-[min(18rem,calc(100vw-1.5rem))] rounded-2xl border border-(--horizon) bg-(--mist) text-(--cocoa) shadow-[0_18px_36px_rgba(74,67,62,0.16)]">
          <div className="max-h-75 overflow-y-auto prag-scrollbar p-2">
            {files.map((file) => (
              (file.file_url ?? file.drive_url) ? (
                <a
                  key={file.filename}
                  href={file.file_url ?? file.drive_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-(--seafoam)/40 hover:underline"
                >
                  <FileIcon />
                  <span className="break-words">{file.filename}</span>
                </a>
              ) : (
                <div
                  key={file.filename}
                  className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm opacity-70"
                >
                  <FileIcon />
                  <span className="wrap-break-word">{file.filename}</span>
                </div>
              )
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}