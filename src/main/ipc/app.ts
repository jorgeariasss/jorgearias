import { ipcMain, BrowserWindow, app } from 'electron'
import { autoUpdater } from 'electron-updater'

export function registerAppIPC(mainWindow: BrowserWindow) {
  ipcMain.handle('app:getVersion', () => {
    return app.getVersion()
  })

  ipcMain.handle('app:checkForUpdates', async () => {
    autoUpdater.checkForUpdatesAndNotify()
  })

  autoUpdater.on('checking-for-update', () => {
    mainWindow.webContents.send('app:update-status', {
      status: 'checking',
      message: 'Checking for updates...'
    })
  })

  autoUpdater.on('update-available', () => {
    mainWindow.webContents.send('app:update-status', {
      status: 'update-available',
      message: 'Update available. Downloading...'
    })
  })

  autoUpdater.on('update-not-available', () => {
    mainWindow.webContents.send('app:update-status', {
      status: 'update-not-available',
      message: 'You are on the latest version'
    })
  })

  autoUpdater.on('download-progress', (progress) => {
    mainWindow.webContents.send('app:update-status', {
      status: 'downloading',
      message: `Downloading... ${Math.round(progress.percent)}%`
    })
  })

  autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('app:update-status', {
      status: 'installing',
      message: 'Update downloaded. Restart to install'
    })
  })

  autoUpdater.on('error', (error) => {
    mainWindow.webContents.send('app:update-status', {
      status: 'checking',
      message: `Error: ${error.message}`
    })
  })
}
