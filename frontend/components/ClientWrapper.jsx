// components/ClientWrapper.tsx
'use client'
import { ReactNode } from 'react'
import { useSmoothScroll } from '@/lib/useSmoothScroll'

export default function ClientWrapper({ children }) {
  useSmoothScroll()
  return <>{children}</>
}
