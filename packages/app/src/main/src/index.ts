import { app, BrowserWindow } from 'electron';
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';

import { registerDevShortcuts } from './utils/shortcuts';
import createKeepStateBrowserWindow from './utils/window';

registerDevShortcuts();

function createWindow() {
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  const mainWindow = createKeepStateBrowserWindow('main', {
    width: 800,
    height: 600,
  });
  mainWindow.loadURL('http://localhost:3000');
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(async () => {
  // install vue3 devtools
  try {
    await installExtension(VUEJS3_DEVTOOLS);
  } catch (e) {
    console.error('Vue Devtools failed to install:', e);
  }

  createWindow();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
