import apiClient from './client'
import type { CategoryApiItem, CategoryOption } from '../types'

export const FALLBACK_CATEGORIES: CategoryOption[] = [
  { value: 'phong-ngu', label: 'Phòng ngủ' },
  { value: 'ban-lam-viec', label: 'Bàn làm việc' },
  { value: 'phong-bep', label: 'Phòng bếp' },
  { value: 'rau-cu-chua-benh', label: 'Rau củ chữa bệnh' },
]

function normalizeCategory(item: CategoryApiItem): CategoryOption {
  if (typeof item === 'string') {
    return { value: item, label: item }
  }
  return item
}

export async function fetchCategories(): Promise<CategoryOption[]> {
  const { data } = await apiClient.get<CategoryApiItem[]>('/categories')
  if (!Array.isArray(data) || data.length === 0) {
    return FALLBACK_CATEGORIES
  }
  return data.map(normalizeCategory)
}
