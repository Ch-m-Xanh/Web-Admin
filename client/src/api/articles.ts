import apiClient from './client'
import type { Article } from '../types'

export async function fetchArticles(): Promise<Article[]> {
  const { data } = await apiClient.get<Article[]>('/articles')
  return data
}

export async function fetchArticle(id: string): Promise<Article> {
  const { data } = await apiClient.get<Article>(`/articles/${id}`)
  return data
}
