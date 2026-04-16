import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Clock, Settings as SettingsIcon } from 'lucide-react'
import { cn } from '../lib/cn'

interface NavItem {
  icon: React.ReactNode
  label: string
  to: string
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(false)

  const items: NavItem[] = [
    { icon: <Home size={20} />, label: 'Gerar', to: '/' },
    { icon: <Clock size={20} />, label: 'Histórico', to: '/history' },
    { icon: <SettingsIcon size={20} />, label: 'Configurações', to: '/settings' }
  ]

  return (
    <div
      className={cn(
        'h-full bg-surface border-r border-border flex flex-col transition-all duration-300',
        expanded ? 'w-60' : 'w-20'
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div className="p-4 border-b border-border">
        <div className="w-8 h-8 bg-primary rounded" />
      </div>

      <nav className="flex-1 flex flex-col gap-2 p-3">
        {items.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors"
          >
            {item.icon}
            {expanded && <span className="text-sm whitespace-nowrap">{item.label}</span>}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <button className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-background font-semibold hover:bg-primary-hover transition-colors">
          👤
        </button>
      </div>
    </div>
  )
}
