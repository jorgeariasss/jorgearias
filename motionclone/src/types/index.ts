export interface Generation {
  id: string
  user_id: string
  input_image_url: string
  input_video_url: string
  output_video_url: string | null
  replicate_prediction_id: string | null
  status: 'pending' | 'processing' | 'completed' | 'failed'
  model: string
  quality: string
  error_message: string | null
  created_at: string
  updated_at: string
}

export type UploadType = 'image' | 'video'

export interface StepState {
  currentStep: number
  imageFile: File | null
  imagePreview: string | null
  videoFile: File | null
  videoPreview: string | null
  model: string
  quality: string
}
