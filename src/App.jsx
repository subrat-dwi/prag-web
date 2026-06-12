import { useState } from 'react'
import LandingPage from './components/LandingPage.jsx'
import ChatInterface from './components/ChatInterface.jsx'
import { useChat } from './hooks/useChat.js'
import { syncDrive } from './utils/api.js'
import './App.css'

function App() {
  const [apiKey, setApiKey] = useState(() => {
    if (typeof window === 'undefined') {
      return ''
    }

    return sessionStorage.getItem('prag_key') ?? ''
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') {
      return false
    }

    return Boolean(sessionStorage.getItem('prag_key'))
  })
  const [expiredMessage, setExpiredMessage] = useState('')

  const handleSessionExpired = () => {
    sessionStorage.removeItem('prag_key')
    setApiKey('')
    setIsAuthenticated(false)
    setExpiredMessage('Session expired. Please re-enter your access key.')
  }

  const chat = useChat({ onSessionExpired: handleSessionExpired })

  const handleAuthenticated = (enteredKey) => {
    setExpiredMessage('')
    setApiKey(enteredKey)
    chat.resetChat()
    setIsAuthenticated(true)
  }

  const handleLock = () => {
    sessionStorage.removeItem('prag_key')
    setApiKey('')
    chat.resetChat()
    setIsAuthenticated(false)
  }
  const [syncing, setSyncing] = useState(false)
  async function handleSync() {
  setSyncing(true)
  try {
    await syncDrive(apiKey)
    // toast/notify success
  } catch (e) {
    // toast/notify e.message
  } finally {
    setSyncing(false)
  }
}

  const clearExpiredMessage = () => setExpiredMessage('')

  if (!isAuthenticated) {
    return (
      <LandingPage
        expiredMessage={expiredMessage}
        noticeMessage={expiredMessage}
        onClearNotice={clearExpiredMessage}
        onAuthenticated={handleAuthenticated}
      />
    )
  }

  return (
    <ChatInterface
      indexedFiles={chat.indexedFiles}
      isLoading={chat.isLoading}
      messages={chat.messages}
      syncing={syncing}
      onSync={handleSync}
      onLock={handleLock}
      onSendMessage={chat.sendMessage}
    />
  )
}

export default App
