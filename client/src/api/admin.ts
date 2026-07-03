import apiClient from './client'
import type { AdminStats, User } from '../types'

export async function fetchAdminStats(): Promise<AdminStats> {
  const { data } = await apiClient.get<AdminStats>('/admin/stats')
  return data
}

export async function fetchUsers(): Promise<User[]> {
  const { data } = await apiClient.get<User[]>('/admin/users')
  return data
}

export async function updateUser(id: string, patch: Partial<Pick<User, 'role' | 'isLocked'>>): Promise<User> {
  const { data } = await apiClient.put<User>(`/admin/users/${id}`, patch)
  return data
}

export async function deleteUser(id: string): Promise<void> {
  await apiClient.delete(`/admin/users/${id}`)
}
