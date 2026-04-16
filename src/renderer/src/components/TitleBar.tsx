import React from 'react'
import { Minus, Square, X } from 'lucide-react'

export function TitleBar() {
  const handleMinimize = () => window.api.window.minimize()
  const handleMaximize = () => window.api.window.maximize()
  const handleClose = () => window.api.window.close()

  return (
    <div
      className="h-10 bg-surface border-b border-border flex items-center justify-between px-4 select-none"
      style={{ WebkitAppRegion: 'drag' } as any}
    >
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 bg-primary rounded" />
        <span className="text-sm font-semibold text-text-primary">MotionClone</span>
      </div>

      <div className="flex items-center gap-1" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button
          onClick={handleMinimize}
          className="p-1 hover:bg-surface-hover rounded transition-colors"
          title="Minimize"
        >
          <Minus size={16} className="text-text-secondary" />
        </button>
        <button
          onClick={handleMaximize}
          className="p-1 hover:bg-surface-hover rounded transition-colors"
          title="Maximize"
        >
          <Square size={16} className="text-text-secondary" />
        </button>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-surface-hover rounded transition-colors"
          title="Close"
        >
          <X size={16} className="text-text-secondary" />
        </button>
      </div>
    </div>
  )
}
