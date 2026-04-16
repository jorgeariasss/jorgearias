import { ipcMain, dialog, shell } from 'electron'
import fs from 'fs'
import path from 'path'

export function registerFilesIPC() {
  ipcMain.handle('files:selectOutputDir', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (!result.canceled) {
      return result.filePaths[0]
    }
    return null
  })

  ipcMain.handle('files:openFolder', async (_event, folderPath: string) => {
    try {
      await shell.openPath(folderPath)
    } catch (error) {
      console.error('Failed to open folder:', error)
    }
  })

  ipcMain.handle('files:openFile', async (_event, filePath: string) => {
    try {
      await shell.openPath(filePath)
    } catch (error) {
      console.error('Failed to open file:', error)
    }
  })

  ipcMain.handle('files:readAsBase64', async (_event, filePath: string) => {
    const buffer = fs.readFileSync(filePath)
    return buffer.toString('base64')
  })

  ipcMain.handle('files:saveFile', async (_event, fileName: string, buffer: Buffer, outputFolder: string) => {
    const filePath = path.join(outputFolder, fileName)
    fs.writeFileSync(filePath, buffer)
    return filePath
  })

  ipcMain.handle('files:ensureFolder', async (_event, folderPath: string) => {
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }
  })
}
