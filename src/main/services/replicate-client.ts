import Replicate from 'replicate'
import Store from 'electron-store'
import { GenerationParams } from '../types'

const store = new Store()

export function getReplicateClient(): Replicate {
  const apiKey = store.get('replicateApiKey') as string
  if (!apiKey) throw new Error('API key not configured')
  return new Replicate({ auth: apiKey })
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    const replicate = new Replicate({ auth: apiKey })
    await replicate.models.get('zsxkib/mimic-motion')
    return true
  } catch {
    return false
  }
}

export async function generateMotionVideo(params: GenerationParams): Promise<string> {
  const replicate = getReplicateClient()

  const output = await replicate.run(
    'zsxkib/mimic-motion:latest',
    {
      input: {
        motion_video: `data:video/mp4;base64,${params.videoBase64}`,
        appearance_image: `data:image/png;base64,${params.imageBase64}`,
        sample_stride: params.quality === 'fast' ? 2 : 1,
        num_frames: params.quality === 'fast' ? 24 : 48,
        guidance_scale: 2.0
      }
    }
  )

  if (Array.isArray(output)) {
    return output[0] as string
  }

  return output as string
}
