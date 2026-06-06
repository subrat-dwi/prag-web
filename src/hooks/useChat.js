import { useState } from 'react'
import { queryPrag } from '../utils/api.js'

const INITIAL_FILES = [
  {
    filename: 'resume.pdf',
    file_url: 'https://drive.google.com/file/d/resume',
  },
  {
    filename: 'certificates.pdf',
    file_url: 'https://drive.google.com/file/d/certificates',
  },
  {
    filename: 'transcript.pdf',
    file_url: 'https://drive.google.com/file/d/transcript',
  },
  {
    filename: 'project-notes.docx',
    file_url: 'https://drive.google.com/file/d/project-notes',
  },
  {
    filename: 'performance-review.txt',
    file_url: '',
  },
]

function createGreetingMessage() {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content: 'Ask me anything from your private document set. I will look for the most relevant context and answer directly.',
    sources: [],
    timestamp: new Date(),
  }
}

function createUserMessage(content) {
  return {
    id: crypto.randomUUID(),
    role: 'user',
    content,
    timestamp: new Date(),
  }
}

function createAssistantMessage(content, sources = [], variant = 'default') {
  return {
    id: crypto.randomUUID(),
    role: 'assistant',
    content,
    sources,
    variant,
    timestamp: new Date(),
  }
}

function normalizeSources(sources = []) {
  return sources.map((source) => ({
    filename: source.filename,
    relevance_score: source.relevance_score,
    file_url: source.file_url ?? source.drive_url,
  }))
}

export function useChat({ onSessionExpired } = {}) {
  const [messages, setMessages] = useState([createGreetingMessage()])
  const [isLoading, setIsLoading] = useState(false)
  const [indexedFiles] = useState(INITIAL_FILES)

  const resetChat = () => {
    setMessages([createGreetingMessage()])
    setIsLoading(false)
  }

  const sendMessage = async (messageText) => {
    const trimmedMessage = messageText.trim()

    if (!trimmedMessage || isLoading) {
      return
    }

    const apiKey = sessionStorage.getItem('prag_key')

    if (!apiKey) {
      onSessionExpired?.('Session expired. Please re-enter your access key.')
      return
    }

    const userMessage = createUserMessage(trimmedMessage)
    setMessages((currentMessages) => [...currentMessages, userMessage])
    setIsLoading(true)

    try {
      const data = await queryPrag(trimmedMessage, apiKey)

      setMessages((currentMessages) => [
        ...currentMessages,
        createAssistantMessage(data.answer, normalizeSources(data.sources)),
      ])
    } catch (error) {
      if (error.kind === 'auth' || error?.status === 403) {
        sessionStorage.removeItem('prag_key')
        onSessionExpired?.()
        return
      }

      const fallbackMessage =
        error.kind === 'server'
          ? 'Something went wrong on the server. Try again.'
          : 'Connection failed. Is the server running?'

      setMessages((currentMessages) => [
        ...currentMessages,
        createAssistantMessage(fallbackMessage, [], 'error'),
      ])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    indexedFiles,
    isLoading,
    messages,
    resetChat,
    sendMessage,
  }
}