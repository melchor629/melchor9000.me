'use client'

import { useEffect } from 'react'

type Props = Readonly<{
  refreshAction: () => Promise<void>
}>

export default function Tricks({ refreshAction }: Props) {
  useEffect(() => {
    const id = setInterval(() => void refreshAction(), 10_000)
    return () => clearInterval(id)
  }, [refreshAction])

  return null
}
