import { contextBridge, ipcRenderer } from 'electron'

export interface Api {
  window: {
    minimize: () => void
    maximize: () => void
    close: () => void
  }
  settings: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<void>
    getAll: () => Promise<Record<string, any>>
  }
  replicate: {
    validateKey: (key: string) => Promise<boolean>
    generate: (params: any) => Promise<string>
    onStatus: (callback: (status: any) => void) => () => void
  }
  history: {
    list: (filter?: 'all' | 'completed' | 'failed') => Promise<any[]>
    get: (id: string) => Promise<any>
    delete: (id: string) => Promise<void>
  }
  files: {
    selectOutputDir: () => Promise<string | null>
    openFolder: (path: string) => Promise<void>
    openFile: (path: string) => Promise<void>
    readAsBase64: (path: string) => Promise<string>
    saveFile: (fileName: string, buffer: Uint8Array, outputFolder: string) => Promise<string>
    ensureFolder: (folderPath: string) => Promise<void>
  }
  app: {
    getVersion: () => Promise<string>
    checkForUpdates: () => Promise<void>
    onUpdateStatus: (callback: (status: any) => void) => () => void
  }
}

const api: Api = {
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close')
  },
  settings: {
    get: (key: string) => ipcRenderer.invoke('settings:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('settings:set', key, value),
    getAll: () => ipcRenderer.invoke('settings:getAll')
  },
  replicate: {
    validateKey: (key: string) => ipcRenderer.invoke('replicate:validate-key', key),
    generate: (params: any) => ipcRenderer.invoke('replicate:generate', params),
    onStatus: (callback: (status: any) => void) => {
      const listener = (_event: any, status: any) => callback(status)
      ipcRenderer.on('generation:status', listener)
      return () => ipcRenderer.off('generation:status', listener)
    }
  },
  history: {
    list: (filter?: 'all' | 'completed' | 'failed') => ipcRenderer.invoke('history:list', filter),
    get: (id: string) => ipcRenderer.invoke('history:get', id),
    delete: (id: string) => ipcRenderer.invoke('history:delete', id)
  },
  files: {
    selectOutputDir: () => ipcRenderer.invoke('files:selectOutputDir'),
    openFolder: (path: string) => ipcRenderer.invoke('files:openFolder', path),
    openFile: (path: string) => ipcRenderer.invoke('files:openFile', path),
    readAsBase64: (path: string) => ipcRenderer.invoke('files:readAsBase64', path),
    saveFile: (fileName: string, buffer: Uint8Array, outputFolder: string) =>
      ipcRenderer.invoke('files:saveFile', fileName, buffer, outputFolder),
    ensureFolder: (folderPath: string) => ipcRenderer.invoke('files:ensureFolder', folderPath)
  },
  app: {
    getVersion: () => ipcRenderer.invoke('app:getVersion'),
    checkForUpdates: () => ipcRenderer.invoke('app:checkForUpdates'),
    onUpdateStatus: (callback: (status: any) => void) => {
      const listener = (_event: any, status: any) => callback(status)
      ipcRenderer.on('app:update-status', listener)
      return () => ipcRenderer.off('app:update-status', listener)
    }
  }
}

contextBridge.exposeInMainWorld('api', api)
