import React from 'react'
import { TitleBar } from './TitleBar'
import { Sidebar } from './Sidebar'
import { Blob } from './Blob'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="h-screen flex flex-col bg-background">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto relative">
          {/* Background blobs */}
          <div className="fixed inset-0 pointer-events-none">
            <Blob delay={0} />
            <Blob delay={7} />
            <Blob delay={14} />
          </div>

          {/* Content */}
          <div className="relative z-10 p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
