import { io, type Socket } from 'socket.io-client'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

// Backend REST API lives under `${host}/api`, but Socket.IO is mounted on the
// same underlying HTTP server at the host root. Strip a trailing /api (with
// or without trailing slash) so the socket connects to the correct origin.
const socketBaseUrl = apiBaseUrl.replace(/\/api\/?$/, '')

let socket: Socket | null = null

/**
 * Returns a singleton Socket.IO client connected to the backend host.
 * The connection is created lazily on first use and reused across the app
 * so multiple pages/components share a single websocket connection.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(socketBaseUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      withCredentials: false,
    })
  }
  return socket
}

export default getSocket
