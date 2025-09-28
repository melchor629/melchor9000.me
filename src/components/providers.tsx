'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useMemo } from 'react'
import ThemeProvider from '@/theme'

export default function Providers({ children }: React.PropsWithChildren) {
  return (
    <QueryClientProvider client={useMemo(() => new QueryClient(), [])}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  )
}
