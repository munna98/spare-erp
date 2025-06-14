import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
  
  // Window controls (can be extended later)
  minimize: () => ipcRenderer.invoke('window-minimize'),
  maximize: () => ipcRenderer.invoke('window-maximize'),
  close: () => ipcRenderer.invoke('window-close'),
  
  // File operations (can be extended later)
  openFile: () => ipcRenderer.invoke('dialog-open-file'),
  saveFile: (data: any) => ipcRenderer.invoke('dialog-save-file', data),
  
  // Print operations (can be extended later)
  printToPDF: (options: any) => ipcRenderer.invoke('print-to-pdf', options),
})

// Define the API interface for TypeScript
export interface ElectronAPI {
  getAppVersion: () => Promise<string>
  getPlatform: () => Promise<string>
  minimize: () => Promise<void>
  maximize: () => Promise<void>
  close: () => Promise<void>
  openFile: () => Promise<string[]>
  saveFile: (data: any) => Promise<string>
  printToPDF: (options: any) => Promise<Buffer>
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}