import apiClient from './client'
import type { UploadResponse } from '../types'

export async function uploadFile(file: File): Promise<UploadResponse> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<UploadResponse>('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
