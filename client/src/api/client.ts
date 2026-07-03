import axios, { AxiosError } from 'axios'
import { emitGlobalError } from '../context/GlobalPopupContext'
import type { ApiErrorPayload } from '../types'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api'

export const apiClient = axios.create({
  baseURL,
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

function extractErrorMessage(error: AxiosError<ApiErrorPayload>): string {
  if (error.response?.data && typeof error.response.data === 'object' && 'error' in error.response.data) {
    const payload = error.response.data as ApiErrorPayload
    if (payload.error?.message) {
      return payload.error.message
    }
  }
  if (error.message === 'Network Error' || !error.response) {
    return 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.'
  }
  return error.message || 'Đã xảy ra lỗi không xác định.'
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    const message = extractErrorMessage(error)
    emitGlobalError(message)
    return Promise.reject(error)
  },
)

export default apiClient
