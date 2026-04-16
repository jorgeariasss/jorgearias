import { app, BrowserWindow, ipcMain } from 'electron'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import path from 'path'
import { autoUpdater } from 'electron-updater'
import Store from 'electron-store'
import { initDatabase } from './services/database'
import { registerWindowIPC } from './ipc/window'
import { registerSettingsIPC } from './ipc/settings'
import { registerReplicateIPC } from './ipc/replicate'
import { registerHistoryIPC } from './ipc/database'
import { registerFilesIPC } from './ipc/files'
import { registerAppIPC } from './ipc/app'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

const isProd = process.env.NODE_ENV === 'production'

let mainWindow: BrowserWindow | null

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 720,
    frame: false,
    backgroundColor: '#0a0a0f',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      preload: path.join(__dirname, '../preload/index.js')
    }
  })

  const indexUrl = `file://${path.join(__dirname, '../../renderer/dist/index.html')}`
  mainWindow.loadURL(indexUrl)

  if (!isProd) {
    mainWindow.webContents.openDevTools()
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', () => {
  const store = new Store()
  initDatabase()
  createWindow()

  registerWindowIPC(mainWindow!)
  registerSettingsIPC()
  registerReplicateIPC(mainWindow!)
  registerHistoryIPC()
  registerFilesIPC()
  registerAppIPC(mainWindow!)

  autoUpdater.checkForUpdatesAndNotify()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
