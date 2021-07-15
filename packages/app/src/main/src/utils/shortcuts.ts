import { BrowserWindow } from 'electron';
import localShortcut from 'electron-localshortcut';

export function registerDevShortcuts() {
  // register some useful shortcuts
  localShortcut.register('CommandOrControl+R', () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.webContents.reloadIgnoringCache();
    }
  });

  function openDevTools() {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      const { webContents } = win;
      if (webContents.isDevToolsOpened()) {
        webContents.closeDevTools();
      } else {
        webContents.openDevTools();
      }
    }
  }

  const isMacOS = process.platform === 'darwin';
  localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', openDevTools);
  localShortcut.register('F12', openDevTools);
}
