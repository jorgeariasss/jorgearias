import React from 'react'

interface BlobProps {
  delay?: number
}

export function Blob({ delay = 0 }: BlobProps) {
  return (
    <div
      className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none"
      style={{
        background: `radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)`,
        animation: `blob 20s ease-in-out infinite`,
        animationDelay: `${delay}s`
      }}
    />
  )
}
