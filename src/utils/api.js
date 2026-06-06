export const PRAG_API_URL = import.meta.env.VITE_API_URL ?? ''

function getApiUrl(path) {
  return `${PRAG_API_URL.replace(/\/$/, '')}${path}`
}

function createApiError(message, kind) {
  const error = new Error(message)
  error.kind = kind
  return error
}

export async function verifyKey(apiKey) {
  const response = await fetch(getApiUrl('/auth'), {
    headers: { 'X-API-Key': apiKey },
  })

  if (response.ok) return true
  if (response.status === 403) return false
  throw new Error('Server unreachable')
}

export async function fetchFiles(apiKey) {
  const response = await fetch(getApiUrl('/files'), {
    headers: { 'X-API-Key': apiKey },
  })

  if (!response.ok) throw new Error('Failed to fetch files')
  return response.json()
}

export async function queryPrag(messageText, accessKey) {
  if (!PRAG_API_URL) {
    throw createApiError('Missing API URL', 'config')
  }

  const response = await fetch(getApiUrl('/query'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': accessKey,
    },
    body: JSON.stringify({
      query: messageText,
      top_k: 5,
    }),
  })

  if (response.ok) {
    return response.json()
  }

  if (response.status === 403) {
    throw createApiError('Session expired. Please re-enter your access key.', 'auth')
  }

  if (response.status >= 500) {
    throw createApiError('Something went wrong on the server. Try again.', 'server')
  }

  throw createApiError('Connection failed. Is the server running?', 'network')
}