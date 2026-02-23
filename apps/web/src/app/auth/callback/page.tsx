'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      localStorage.setItem('token', token)
      setStatus('success')
      setTimeout(() => {
        router.push('/')
      }, 1000)
    } else {
      setStatus('error')
    }
  }, [searchParams, router])

  if (status === 'loading') {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Signing you in...</p>
      </main>
    )
  }

  if (status === 'error') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Authentication Failed</h1>
        <p className="text-gray-600 mb-4">Unable to sign in. Please try again.</p>
        <button
          onClick={() => router.push('/signin')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Back to Sign In
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Signed in successfully! Redirecting...</p>
    </main>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center">
          <p>Loading...</p>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
