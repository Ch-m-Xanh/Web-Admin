import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  type: ToastType
  message: string
}

interface GlobalPopupContextValue {
  showSuccess: (message: string) => void
  showError: (message: string) => void
  showInfo: (message: string) => void
}

const GlobalPopupContext = createContext<GlobalPopupContextValue | null>(null)

// Module-level bridge so non-React code (e.g. the axios interceptor) can
// trigger toasts without needing access to the React tree.
type PopupApi = GlobalPopupContextValue
let popupApi: PopupApi | null = null

export function emitGlobalError(message: string) {
  if (popupApi) {
    popupApi.showError(message)
  } else {
    // Provider not mounted yet; fall back to console so errors aren't lost.
    console.error('[GlobalPopup unavailable]', message)
  }
}

let idCounter = 0

export function GlobalPopupProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    const timer = timers.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timers.current.delete(id)
    }
  }, [])

  const pushToast = useCallback(
    (type: ToastType, message: string) => {
      const id = ++idCounter
      setToasts((prev) => [...prev, { id, type, message }])
      const timer = setTimeout(() => removeToast(id), 3000)
      timers.current.set(id, timer)
    },
    [removeToast],
  )

  const showSuccess = useCallback((message: string) => pushToast('success', message), [pushToast])
  const showError = useCallback((message: string) => pushToast('error', message), [pushToast])
  const showInfo = useCallback((message: string) => pushToast('info', message), [pushToast])

  useEffect(() => {
    popupApi = { showSuccess, showError, showInfo }
    return () => {
      popupApi = null
    }
  }, [showSuccess, showError, showInfo])

  useEffect(() => {
    const currentTimers = timers.current
    return () => {
      currentTimers.forEach((timer) => clearTimeout(timer))
      currentTimers.clear()
    }
  }, [])

  return (
    <GlobalPopupContext.Provider value={{ showSuccess, showError, showInfo }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[90vw]">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`rounded-lg shadow-lg px-4 py-3 text-sm text-white flex items-start justify-between gap-2 animate-[fadeIn_0.15s_ease-out] ${
              toast.type === 'success'
                ? 'bg-green-600'
                : toast.type === 'error'
                  ? 'bg-red-600'
                  : 'bg-blue-600'
            }`}
          >
            <span className="flex-1 break-words">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white leading-none text-lg"
              aria-label="Đóng thông báo"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </GlobalPopupContext.Provider>
  )
}

export function useGlobalPopup(): GlobalPopupContextValue {
  const ctx = useContext(GlobalPopupContext)
  if (!ctx) {
    throw new Error('useGlobalPopup must be used within a GlobalPopupProvider')
  }
  return ctx
}
