'use client'

import { useAuth } from '@/context/AuthContext'

export function SignInButton() {
  const { signIn } = useAuth()

  return (
    <button
      onClick={signIn}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
    >
      Sign in with Google
    </button>
  )
}

export function SignOutButton() {
  const { signOut } = useAuth()

  return (
    <button
      onClick={signOut}
      className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
    >
      Sign out
    </button>
  )
}

export function UserMenu() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="flex items-center gap-4">
      {user.avatarUrl && (
        <img src={user.avatarUrl} alt={user.name || 'User'} className="w-10 h-10 rounded-full" />
      )}
      <div>
        <p className="font-medium">{user.name}</p>
        <p className="text-sm text-gray-500">{user.email}</p>
      </div>
    </div>
  )
}
