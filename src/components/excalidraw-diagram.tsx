'use client'

import { useEffect, useState } from 'react'
import { ImageZoom } from 'nextra/components'

interface ExcalidrawDiagramProps {
  src: string
  alt?: string
}

export function ExcalidrawDiagram({ src, alt }: ExcalidrawDiagramProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function render() {
      try {
        const res = await fetch(src)

        if (!res.ok) {
          throw new Error(`Failed to load ${src}`)
        }

        const data = await res.json()

        const { exportToBlob } = await import('@excalidraw/excalidraw')

        const blob = await exportToBlob({
          elements: data.elements,
          appState: {
            ...data.appState,
            exportWithDarkMode: false,
            exportBackground: true,
          },
          files: data.files || {},
        })

        if (cancelled) {
          return
        }

        setDataUrl(URL.createObjectURL(blob))
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to render diagram')
        }
      }
    }

    render()

    return () => {
      cancelled = true

      if (dataUrl) {
        URL.revokeObjectURL(dataUrl)
      }
    }
  }, [src])

  if (error) {
    return <p className="text-red-500 text-sm">{error}</p>
  }

  if (!dataUrl) {
    return null
  }

  return <ImageZoom src={dataUrl} alt={alt || 'Excalidraw diagram'} />
}
