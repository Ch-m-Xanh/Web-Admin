import apiClient from './client'
import type { Plant, PlantInput } from '../types'

export interface PlantQuery {
  category?: string
  search?: string
}

export async function fetchPlants(query: PlantQuery = {}): Promise<Plant[]> {
  const { data } = await apiClient.get<Plant[]>('/plants', { params: query })
  return data
}

export async function fetchPlant(id: string): Promise<Plant> {
  const { data } = await apiClient.get<Plant>(`/plants/${id}`)
  return data
}

export async function createPlant(input: PlantInput): Promise<Plant> {
  const { data } = await apiClient.post<Plant>('/plants', input)
  return data
}

export async function updatePlant(id: string, input: PlantInput): Promise<Plant> {
  const { data } = await apiClient.put<Plant>(`/plants/${id}`, input)
  return data
}

export async function deletePlant(id: string): Promise<void> {
  await apiClient.delete(`/plants/${id}`)
}
