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
        className="prag-glow-hover flex items-center justify-center gap-2 rounded-full border border-(--ctp-surface1) bg-(--ctp-crust)/70 px-3 py-1 text-xs font-medium text-(--ctp-subtext) transition sm:text-sm"
      >
        <FileIcon className="h-4 w-4" aria-hidden="true" />
        <span>
          {totalFiles} {totalFiles === 1 ? 'file' : 'files'}
        </span>
      </button>

      {isOpen ? (
        <div className="absolute right-0 max-sm:translate-x-6 top-full z-30 mt-2 w-[min(19rem,calc(100vw-1.5rem))] rounded-2xl border border-(--ctp-surface1) bg-(--ctp-mantle)/95 text-(--ctp-subtext) shadow-[0_20px_38px_rgba(0,0,0,0.45)] backdrop-blur-md">
          <div className="max-h-75 overflow-y-auto prag-scrollbar p-2">
            {files.map((file) => (
              (file.file_url ?? file.drive_url) ? (
                <a
                  key={file.filename}
                  href={file.file_url ?? file.drive_url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-(--ctp-surface0)/70 hover:text-(--ctp-text) hover:underline"
                >
                  {/* <FileIcon className="h-4 w-4" /> */}
                  <span className="break-words">{file.filename}</span>
                </a>
              ) : (
                <div
                  key={file.filename}
                  className="flex items-start gap-2 rounded-xl px-3 py-2 text-sm opacity-70"
                >
                  {/* <FileIcon /> */}
                  <span className="break-words">{file.filename}</span>
                </div>
              )
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}