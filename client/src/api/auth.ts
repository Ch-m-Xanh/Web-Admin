import apiClient from './client'
import type { AuthResponse, User } from '../types'

export async function login(email: string, password: string): Promise<AuthResponse> {
  const { data } = await apiClient.post<AuthResponse>('/auth/login', { email, password })
  return data
}

export async function fetchMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/auth/me')
  return data
}
