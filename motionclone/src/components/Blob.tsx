const positions = {
  'top-left': '-top-32 -left-32',
  'top-right': '-top-32 -right-32',
  'bottom-left': '-bottom-32 -left-32',
  'bottom-right': '-bottom-32 -right-32',
  'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
}

const sizes = {
  sm: 'w-64 h-64',
  md: 'w-96 h-96',
  lg: 'w-[32rem] h-[32rem]',
}

const colors = {
  purple: 'bg-purple-500/30',
  cyan: 'bg-cyan-500/30',
  pink: 'bg-pink-500/30',
}

interface BlobProps {
  color: 'purple' | 'cyan' | 'pink'
  position: keyof typeof positions
  size: 'sm' | 'md' | 'lg'
  delay?: string
}

export function Blob({ color, position, size, delay }: BlobProps) {
  return (
    <div
      className={`absolute rounded-full ${colors[color]} ${positions[position]} ${sizes[size]} blur-[80px] opacity-40 animate-blob pointer-events-none`}
      style={delay ? { animationDelay: delay } : undefined}
    />
  )
}
