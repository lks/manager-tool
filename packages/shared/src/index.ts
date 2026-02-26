export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface HealthCheckResponse {
  status: 'ok' | 'error'
  timestamp: string
  message?: string
}

export interface User {
  id: string
  email: string
  name: string | null
  avatar?: string | null
}
