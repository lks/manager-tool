'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'

interface User {
  id: string
  email: string
  name: string | null
}

interface Collaborator {
  id: string
  firstName: string
  lastName: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [collaborators, setCollaborators] = useState<Collaborator[]>([])
  const [showForm, setShowForm] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/api/auth/me')
        setUser(response.data.data)
      } catch {
        router.push('/')
      } finally {
        setIsLoading(false)
      }
    }
    fetchUser()
  }, [router])

  const fetchCollaborators = async () => {
    try {
      const response = await api.get('/api/collaborators')
      setCollaborators(response.data.data)
    } catch (error) {
      console.error('Error fetching collaborators:', error)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCollaborators()
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout')
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await api.post('/api/collaborators', { firstName, lastName })
      setFirstName('')
      setLastName('')
      setShowForm(false)
      fetchCollaborators()
    } catch (error) {
      console.error('Error creating collaborator:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Manager Tool</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user?.name || user?.email}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome{user?.name ? `, ${user.name}` : ''}!
            </h2>
            <p className="text-gray-600">
              You have successfully signed in with your Google account.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Your toolbox features will appear here.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Track your recent activity here.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900">Settings</h3>
              <p className="mt-2 text-gray-600 text-sm">
                Manage your preferences here.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Collaborators</h3>
              <button
                onClick={() => setShowForm(!showForm)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {showForm ? 'Cancel' : 'Add Collaborator'}
              </button>
            </div>

            {showForm && (
              <form onSubmit={handleSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                      First name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                      Last name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            )}

            <div data-testid="collaborators-list">
              {collaborators.length === 0 ? (
                <p className="text-gray-500 text-sm">No collaborators yet. Add one to get started.</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {collaborators.map((collaborator) => (
                    <li key={collaborator.id} className="py-3 flex justify-between items-center">
                      <span className="text-gray-900">
                        {collaborator.firstName} {collaborator.lastName}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
