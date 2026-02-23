'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import api from '@/lib/api'

export interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: () => void
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchUser(token)
    } else {
      setIsLoading(false)
    }
  }, [])

  async function fetchUser(token: string) {
    try {
      const response = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUser(response.data.user)
    } catch {
      localStorage.removeItem('token')
    } finally {
      setIsLoading(false)
    }
  }

  function signIn() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
    window.location.href = `${apiUrl}/auth/google`
  }

  async function signOut() {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await api.post(
          '/auth/logout',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      }
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
