'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function AuthCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      localStorage.setItem('token', token)
      router.push('/dashboard')
    } else {
      router.push('/?error=auth_failed')
    }
  }, [searchParams, router])

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p>Signing you in...</p>
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
