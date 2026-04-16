import { ipcMain } from 'electron'
import Store from 'electron-store'

const store = new Store({
  defaults: {
    replicateApiKey: '',
    outputFolder: '',
    openFileOnComplete: true,
    enableNotifications: true,
    language: 'en'
  }
})

export function registerSettingsIPC() {
  ipcMain.handle('settings:get', (_event, key: string) => {
    return store.get(key)
  })

  ipcMain.handle('settings:set', (_event, key: string, value: any) => {
    store.set(key, value)
  })

  ipcMain.handle('settings:getAll', () => {
    return store.store
  })
}
