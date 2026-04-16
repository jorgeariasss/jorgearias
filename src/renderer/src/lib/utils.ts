export function formatDate(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'agora'
  if (diffMins < 60) return `há ${diffMins}m`
  if (diffHours < 24) return `há ${diffHours}h`
  if (diffDays < 7) return `há ${diffDays}d`

  return date.toLocaleDateString('pt-BR')
}

export function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000)
  const mins = Math.floor(secs / 60)

  if (mins > 0) {
    return `${mins}m ${secs % 60}s`
  }
  return `${secs}s`
}

export function getEstimatedCost(quality: 'fast' | 'high'): string {
  return quality === 'fast' ? '$0.05' : '$0.15'
}

export function getVideoThumbnail(videoFile: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.onloadedmetadata = () => {
      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.drawImage(video, 0, 0)
        resolve(canvas.toDataURL('image/jpeg'))
      } else {
        reject(new Error('Failed to get canvas context'))
      }
    }
    video.onerror = () => reject(new Error('Failed to load video'))
    video.src = URL.createObjectURL(videoFile)
  })
}

export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
