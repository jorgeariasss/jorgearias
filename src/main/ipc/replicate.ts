import { ipcMain, BrowserWindow } from 'electron'
import { validateApiKey, generateMotionVideo } from '../services/replicate-client'
import { createGeneration, updateGeneration } from '../services/database'
import { GenerationParams } from '../types'
import crypto from 'crypto'

const statusMessages = [
  'Enviando arquivos...',
  'Analisando pose...',
  'Transferindo movimento...',
  'Renderizando frames...',
  'Finalizando...'
]

let messageIndex = 0

export function registerReplicateIPC(mainWindow: BrowserWindow) {
  ipcMain.handle('replicate:validate-key', async (_event, apiKey: string) => {
    return await validateApiKey(apiKey)
  })

  ipcMain.handle('replicate:generate', async (_event, params: GenerationParams & { imagePath: string; videoPath: string }) => {
    const generationId = crypto.randomUUID()
    messageIndex = 0

    try {
      createGeneration({
        id: generationId,
        input_image_path: params.imagePath,
        input_video_path: params.videoPath,
        output_video_path: null,
        status: 'processing',
        quality: params.quality,
        model: 'mimic-motion',
        error_message: null,
        duration_ms: null,
        completed_at: null
      })

      const startTime = Date.now()

      const statusInterval = setInterval(() => {
        messageIndex = (messageIndex + 1) % statusMessages.length
        mainWindow.webContents.send('generation:status', {
          generationId,
          status: 'processing',
          progress: Math.min(messageIndex * 20, 95),
          message: statusMessages[messageIndex]
        })
      }, 8000)

      const videoUrl = await generateMotionVideo({
        imageBase64: params.imageBase64,
        videoBase64: params.videoBase64,
        quality: params.quality
      })

      clearInterval(statusInterval)

      const duration = Date.now() - startTime

      updateGeneration(generationId, {
        status: 'completed',
        output_video_path: videoUrl,
        duration_ms: duration,
        completed_at: Date.now()
      })

      mainWindow.webContents.send('generation:status', {
        generationId,
        status: 'completed',
        progress: 100,
        message: 'Concluído!'
      })

      return generationId
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'

      updateGeneration(generationId, {
        status: 'failed',
        error_message: errorMessage,
        completed_at: Date.now()
      })

      mainWindow.webContents.send('generation:status', {
        generationId,
        status: 'failed',
        progress: 0,
        message: 'Falha na geração',
        error: errorMessage
      })

      throw error
    }
  })
}
