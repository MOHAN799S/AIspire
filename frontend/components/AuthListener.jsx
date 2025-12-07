// 'use client'
// import { useEffect } from 'react'
// import { useAuth, useUser } from '@clerk/nextjs'
// import { toast } from 'sonner'

// export function AuthListener() {
//   const { isSignedIn } = useAuth()
//   const { user } = useUser()

//   useEffect(() => {
//     const wasSignedIn = sessionStorage.getItem('wasSignedIn')

//     // Configure default toast priority styles
//     const toastBase = {
//       duration: 2500,
//       position: 'top-right', // appears at top center, more visible
//       style: {
//         zIndex: 9999, // highest priority on screen
//         fontWeight: 600,
//         fontSize: '0.95rem',
//         boxShadow: '0 0 20px rgba(0, 0, 0, 0.4)',
//       },
//     }

//     if (isSignedIn && user) {
//       if (wasSignedIn !== 'true') {
//         toast.success('Welcome back!', {
//           ...toastBase,
//           description: `Signed in as ${user.firstName || user.username || 'User'}`,
//           style: {
//             ...toastBase.style,
//             background: 'linear-gradient(135deg, #064e3b 0%, #166534 100%)',
//             border: '1px solid #22c55e',
//             color: '#dcfce7',
//           },
//         })
//         sessionStorage.setItem('wasSignedIn', 'true')
//       }
//     } else if (wasSignedIn === 'true' && !isSignedIn) {
//       toast.error('Signed out successfully', {
//         ...toastBase,
//         description: 'You have been logged out of your account',
//         style: {
//           ...toastBase.style,
//           background: 'linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)',
//           border: '1px solid #f87171',
//           color: '#fee2e2',
//         },
//       })
//       sessionStorage.removeItem('wasSignedIn')
//     }
//   }, [isSignedIn, user])

//   return null
// }
