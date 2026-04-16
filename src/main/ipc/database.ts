import { ipcMain } from 'electron'
import { getGeneration, listGenerations, deleteGeneration } from '../services/database'

export function registerHistoryIPC() {
  ipcMain.handle('history:list', (_event, filter?: 'all' | 'completed' | 'failed') => {
    return listGenerations(filter || 'all')
  })

  ipcMain.handle('history:get', (_event, id: string) => {
    return getGeneration(id)
  })

  ipcMain.handle('history:delete', (_event, id: string) => {
    deleteGeneration(id)
  })
}
