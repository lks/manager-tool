'use client'

import { useAuth } from '@/context/AuthContext'
import { SignInButton } from '@/components/AuthButton'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Home() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard')
    }
  }, [user, isLoading, router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Manager Tool</h1>
      <p className="text-lg text-gray-600 dark:text-gray-400">Modern web application skeleton</p>

      <div className="mt-8 flex gap-4">
        {isLoading || user ? (
          <p>Loading...</p>
        ) : (
          <>
            <SignInButton />
            <a
              href="/health"
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Check API Health
            </a>
          </>
        )}
      </div>
    </main>
  )
}
