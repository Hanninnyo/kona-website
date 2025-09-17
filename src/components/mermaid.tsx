"use client"

import React, { useEffect, useRef } from 'react'

type MermaidProps = {
  chart: string
  className?: string
}

export default function Mermaid({ chart, className }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    async function ensureMermaid() {
      const existing = (window as any).mermaid
      if (existing) return existing

      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load mermaid'))
        document.head.appendChild(script)
      })
      return (window as any).mermaid
    }

    ensureMermaid()
      .then((mermaid: any) => {
        if (!isMounted) return
        try {
          mermaid.initialize({ startOnLoad: false, theme: 'default' })
          // Render with a unique id per mount
          const uniqueId = `mermaid-${Math.random().toString(36).slice(2)}`
          if (containerRef.current) {
            containerRef.current.innerHTML = `<div class="mermaid">${chart}</div>`
            containerRef.current.setAttribute('data-mermaid-id', uniqueId)
            mermaid.run({ querySelector: `[data-mermaid-id="${uniqueId}"] .mermaid` })
          }
        } catch (err) {
          console.error('Mermaid render error', err)
        }
      })
      .catch((err) => {
        console.error(err)
      })

    return () => {
      isMounted = false
    }
  }, [chart])

  return <div ref={containerRef} className={className} />
}




