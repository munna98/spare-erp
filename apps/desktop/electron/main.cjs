// maian.cjs
const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron')
const path = require('path')

let mainWindow = null

const isDev = process.env.NODE_ENV === 'development'
const isPackaged = app.isPackaged

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    titleBarStyle: 'default',
    show: false,
  })

  if (isDev && !isPackaged) {
    mainWindow.loadURL('http://localhost:5173')
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
      if (isDev) {
        mainWindow.focus()
      }
    }
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: 'deny' }
  })
}

// IPC Handlers
function setupIpcHandlers() {
  // App info
  ipcMain.handle('app-version', () => app.getVersion())
  ipcMain.handle('platform', () => process.platform)

  // Window controls
  ipcMain.handle('window-minimize', () => {
    if (mainWindow) {
      mainWindow.minimize()
    }
  })

  ipcMain.handle('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize()
      } else {
        mainWindow.maximize()
      }
    }
  })

  ipcMain.handle('window-close', () => {
    if (mainWindow) {
      mainWindow.close()
    }
  })

  // File operations
  ipcMain.handle('dialog-open-file', async () => {
    if (!mainWindow) return []
    
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openFile', 'multiSelections'],
      filters: [
        { name: 'All Files', extensions: ['*'] },
        { name: 'Documents', extensions: ['pdf', 'doc', 'docx'] },
        { name: 'Images', extensions: ['jpg', 'png', 'gif'] }
      ]
    })
    
    return result.canceled ? [] : result.filePaths
  })

  ipcMain.handle('dialog-save-file', async (event, data) => {
    if (!mainWindow) return null
    
    const result = await dialog.showSaveDialog(mainWindow, {
      filters: [
        { name: 'JSON Files', extensions: ['json'] },
        { name: 'Text Files', extensions: ['txt'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    })
    
    if (result.canceled) return null
    
    try {
      const fs = require('fs').promises
      await fs.writeFile(result.filePath, JSON.stringify(data, null, 2))
      return result.filePath
    } catch (error) {
      console.error('Error saving file:', error)
      throw error
    }
  })

  // Print operations
  ipcMain.handle('print-to-pdf', async (event, options = {}) => {
    if (!mainWindow) return null
    
    try {
      const data = await mainWindow.webContents.printToPDF({
        pageSize: 'A4',
        printBackground: true,
        ...options
      })
      return data
    } catch (error) {
      console.error('Error generating PDF:', error)
      throw error
    }
  })
}

// Main lifecycle
app.whenReady().then(() => {
  createWindow()
  setupIpcHandlers()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('web-contents-created', (_, contents) => {
    contents.on('will-navigate', (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl)
      if (
        parsedUrl.origin !== 'http://localhost:5173' &&
        !navigationUrl.startsWith('file://')
      ) {
        event.preventDefault()
      }
    })
  })
})