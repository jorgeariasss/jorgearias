import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './src/renderer/index.html',
    './src/renderer/src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        background: '#0a0a0f',
        surface: '#13131a',
        'surface-hover': '#1a1a24',
        border: '#27272e',
        primary: '#a855f7',
        'primary-hover': '#9333ea',
        'primary-glow': '#c084fc',
        accent: '#06b6d4',
        'text-primary': '#fafafa',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
        success: '#10b981',
        error: '#ef4444'
      },
      backgroundColor: {
        DEFAULT: '#0a0a0f'
      },
      keyframes: {
        blob: {
          '0%, 100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(30px,-50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px,20px) scale(0.9)' }
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        blob: 'blob 20s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite'
      }
    }
  },
  plugins: []
}

export default config
