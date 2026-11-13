'use client'

import { useEffect } from 'react'
import { useDraftStore } from '@/store/draft-store'

type ProvidersProps = {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  useEffect(() => {
    void useDraftStore.persist.rehydrate()
  }, [])

  return children
}
