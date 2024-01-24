/* eslint-disable @typescript-eslint/no-floating-promises */
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import log from 'electron-log'
import ProgressBar from 'electron-progressbar'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import { BACKEND_API_URL, CTYPE_API_KEY } from './const'

let progressBar: ProgressBar

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 960,
    height: 800,
    show: false,

    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

/* APIs ====================================================== */

ipcMain.handle('app-version', () => app.getVersion())
ipcMain.handle('start-server', async () => {
  const res = await axios.put(`${BACKEND_API_URL}/start`,
    undefined,
    {
      headers:{
        'Authorization': `Bearer ${CTYPE_API_KEY}`,
        Host: 'api.cloudtype.io',
        'User-Agent': 'PostmanRuntime/7.26.8',
      },
  })
  return res.status === 200
})

/* Updater ====================================================== */

autoUpdater.autoDownload = false

autoUpdater.on('checking-for-update', () => {
  log.info('업데이트 확인 중...')
})
autoUpdater.on('update-available', () => {
  log.info('업데이트가 가능합니다.')
  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update',
      message: '새로운 버전이 확인되었습니다. 설치 파일을 다운로드 하시겠습니까?',
      buttons: ['지금 설치', '나중에 설치']
    })
    .then((result) => {
      const { response } = result

      if (response === 0) {
        autoUpdater.downloadUpdate()
        progressBar = new ProgressBar({
          text: '업데이트 다운로드 중...'
        })
        progressBar
          .on('completed', () => {
            log.info('설치 완료')
          })
          .on('aborted', () => {
            log.info('aborted')
          })
      }
    })
})
autoUpdater.on('update-not-available', () => {
  log.info('현재 최신버전입니다.')
})
autoUpdater.on('error', (err) => {
  log.error(`에러가 발생하였습니다. 에러내용 : ${err.message}`)
})
autoUpdater.on('download-progress', (progressObj) => {
  let logMessage = `다운로드 속도: ${progressObj.bytesPerSecond}`
  logMessage = `${logMessage} - 현재 ${progressObj.percent}%`
  logMessage = `${logMessage} (${progressObj.transferred}/${progressObj.total})`

  log.info(logMessage)
})
autoUpdater.on('update-downloaded', () => {
  log.info('업데이트가 완료되었습니다.')
  progressBar.setCompleted()

  dialog
    .showMessageBox({
      type: 'info',
      title: 'Update',
      message: '새로운 버전이 다운로드 되었습니다. 다시 시작하시겠습니까?',
      buttons: ['예', '아니오']
    })
    .then((result) => {
      const { response } = result
      if (response === 0) autoUpdater.quitAndInstall(false, true)
    })
})

/* Electron ===================================================== */

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.recruit.crawler.app')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utilsz
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()
  autoUpdater.checkForUpdates()

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
