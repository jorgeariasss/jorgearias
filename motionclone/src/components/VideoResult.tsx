import { Download, RefreshCw, Share2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'

interface VideoResultProps {
  videoUrl: string
  onRegenerate: () => void
}

export function VideoResult({ videoUrl, onRegenerate }: VideoResultProps) {
  const handleDownload = () => {
    const a = document.createElement('a')
    a.href = videoUrl
    a.download = 'motionclone-video.mp4'
    a.click()
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl)
      toast.success('Link copiado!')
    } catch {
      toast.error('Não foi possível copiar o link')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center gap-6"
    >
      <div className="w-full rounded-2xl overflow-hidden bg-black border border-border">
        <video src={videoUrl} controls autoPlay loop className="w-full max-h-[28rem] object-contain" />
      </div>

      <div className="flex gap-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDownload}
          className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-[0_0_20px_rgba(168,85,247,0.3)]"
        >
          <Download className="w-4 h-4" />
          Download
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleShare}
          className="flex items-center gap-2 bg-surface hover:bg-surface-hover text-text-secondary px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border border-border"
        >
          <Share2 className="w-4 h-4" />
          Compartilhar
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRegenerate}
          className="flex items-center gap-2 bg-surface hover:bg-surface-hover text-text-secondary px-5 py-2.5 rounded-xl text-sm font-medium transition-colors border border-border"
        >
          <RefreshCw className="w-4 h-4" />
          Gerar outro
        </motion.button>
      </div>
    </motion.div>
  )
}
