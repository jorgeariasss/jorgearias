export interface Generation {
  id: string
  input_image_path: string
  input_video_path: string
  output_video_path: string | null
  status: 'processing' | 'completed' | 'failed'
  quality: 'fast' | 'high'
  model: string
  error_message: string | null
  duration_ms: number | null
  created_at: number
  completed_at: number | null
}

export interface GenerationParams {
  imageBase64: string
  videoBase64: string
  quality: 'fast' | 'high'
}

export interface GenerationStatus {
  generationId: string
  status: 'processing' | 'completed' | 'failed'
  progress: number
  message: string
  error?: string
}

export interface UpdateStatus {
  status: 'checking' | 'update-available' | 'update-not-available' | 'downloading' | 'installing' | 'installed'
  message: string
}
