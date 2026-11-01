import { onBeforeUnmount, ref } from 'vue'
import { useAppStore } from '@/stores/votos'

// In Docker the browser will use ws://<host>:3000, in dev ws://localhost:3000.
// Override it at build time with VITE_WS_URL if needed.
const WS_URL =
  import.meta.env.VITE_WS_URL ||
  `ws://${window.location.hostname || 'localhost'}:3000`

const connected = ref(false)
const socketError = ref('')

let socket = null
let reconnectTimer = null
let subscribers = 0
let store = null

function connect() {
  if (
    socket &&
    (socket.readyState === WebSocket.OPEN ||
      socket.readyState === WebSocket.CONNECTING)
  ) {
    return
  }

  socket = new WebSocket(WS_URL)

  socket.addEventListener('open', () => {
    connected.value = true
    socketError.value = ''
  })

  socket.addEventListener('message', (event) => {
    try {
      const votos = JSON.parse(event.data)
      if (Array.isArray(votos)) {
        store.setVotos(votos)
      }
    } catch (error) {
      console.error('Missatge del WebSocket invàlid:', error)
    }
  })

  socket.addEventListener('close', () => {
    connected.value = false
    if (subscribers > 0) {
      reconnectTimer = setTimeout(connect, 2000)
    }
  })

  socket.addEventListener('error', () => {
    socketError.value = `No s'ha pogut connectar a ${WS_URL}`
  })
}

function sendVote(index) {
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    return false
  }

  socket.send(JSON.stringify({ vote: index }))
  return true
}

/**
 * Shared WebSocket connection that keeps `store.votos` in sync with the backend.
 */
export function useVotosSocket() {
  store = useAppStore()
  subscribers++

  if (!socket) {
    connect()
  }

  onBeforeUnmount(() => {
    subscribers--

    if (subscribers === 0) {
      clearTimeout(reconnectTimer)
      socket?.close()
      socket = null
      connected.value = false
    }
  })

  return { connected, socketError, wsUrl: WS_URL, sendVote }
}
