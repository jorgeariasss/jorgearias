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

declare global {
  interface Window {
    api: Api
  }
}
