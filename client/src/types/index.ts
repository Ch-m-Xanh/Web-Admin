export type CareLevel = 'easy' | 'medium' | 'hard'

export type UserRole = 'user' | 'admin'

export interface Plant {
  _id: string
  name: string
  scientificName: string
  description: string
  careLevel: CareLevel
  light: string
  water: string
  category: string
  images: string[]
  isMedicinal: boolean
  tags: string[]
  viewCount: number
  createdAt: string
  updatedAt: string
}

export type PlantInput = Omit<Plant, '_id' | 'createdAt' | 'updatedAt' | 'viewCount'>

export interface User {
  _id: string
  name: string
  email: string
  avatarUrl: string
  role: UserRole
  gardenName: string
  gardenDescription?: string
  isLocked: boolean
  createdAt: string
}

export interface Article {
  _id: string
  title: string
  content: string
  coverImage: string
  tags: string[]
  createdAt: string
}

export interface ApiErrorPayload {
  error: {
    message: string
    code: string
  }
}

export interface AuthResponse {
  token: string
  user: User
}

export interface AdminStats {
  totalUsers: number
  totalPlants: number
  totalPostsThisWeek: number
  topViewedPlants: Plant[]
  newUsersLast7Days: number[]
}

export interface CategoryOption {
  value: string
  label: string
}

export type CategoryApiItem = string | CategoryOption

export interface UploadResponse {
  url: string
}
