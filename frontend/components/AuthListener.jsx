'use client'
import { useEffect } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import { toast } from 'sonner'

export function AuthListener() {
  const { isSignedIn } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    // Store previous auth state
    const wasSignedIn = sessionStorage.getItem('wasSignedIn')
    
    if (isSignedIn && user) {
      // User just signed in
      if (wasSignedIn !== 'true') {
        toast.success('Welcome back!', {
          description: `Successfully signed in as ${user.firstName || user.username || 'User'}`,
          duration: 2000,
          style: {
            background: '#052e16',
            border: '1px solid #166534',
            color: '#dcfce7',
          },
        })
        sessionStorage.setItem('wasSignedIn', 'true')
      }
    } else if (wasSignedIn === 'true' && !isSignedIn) {
      // User just signed out
      toast.error('Signed out successfully', {
        description: 'You have been logged out of your account',
        duration: 2000,
        style: {
          background: '#450a0a',
          border: '1px solid #991b1b',
          color: '#fecaca',
        },
      })
      sessionStorage.removeItem('wasSignedIn')
    }
  }, [isSignedIn, user])

  return null
}