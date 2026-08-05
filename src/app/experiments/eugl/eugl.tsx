'use client'

import { useSearchParams } from 'next/navigation'
import { useCallback, useLayoutEffect, useState } from 'react'
import Capture from './capture'
import createEngine from './engine'

export default function Eugl() {
  const searchParams = useSearchParams()
  const [engine, setEngine] = useState<PromiseResolvedType<ReturnType<typeof createEngine>> | null>(
    null,
  )

  const setContainer = useCallback(
    (container: HTMLDivElement | null) => {
      if (container) {
        const manualMovement = searchParams.get('manual') != null
        createEngine(container, manualMovement)
          .then(setEngine)
          .catch(() => setEngine(null))
      } else {
        setEngine(null)
      }
    },
    [searchParams],
  )

  const onCustomImageChange = useCallback(
    (imageUrl: string) => {
      engine?.setCustomTexture(imageUrl).catch(() => {})
    },
    [engine],
  )

  useLayoutEffect(() => () => engine?.destroy(), [engine])

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '100lvh',
          marginTop: '-48px',
          position: 'relative',
          backgroundColor: '#121212',
        }}
        ref={setContainer}
      />
      <Capture onImageChange={onCustomImageChange} />
    </>
  )
}
