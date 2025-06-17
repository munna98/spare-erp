// apps/desktop/src/types/electron.d.ts

export interface ElectronAPI {
  // App info
  getAppVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  
  // Window controls
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  
  // File operations
  openFile: () => Promise<string[]>
  saveFile: (data: any) => Promise<string>
  
  // Print operations
  printToPDF: (options?: any) => Promise<Buffer>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}