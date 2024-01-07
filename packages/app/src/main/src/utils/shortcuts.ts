import { BrowserWindow } from 'electron';
import localShortcut from 'electron-localshortcut';

import { isMacOS } from './constants.js';

export function registerDevShortcuts() {
    localShortcut.register('CommandOrControl+R', () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.webContents.reloadIgnoringCache();
        }
    });

    function toggleDevTools() {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;

        const { webContents } = win;
        if (webContents.isDevToolsOpened()) {
            webContents.closeDevTools();
        } else {
            webContents.openDevTools();
        }
    }

    function openDebugPage() {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;
        win.webContents.send('open-debug-page');
    }

    localShortcut.register(isMacOS ? 'Command+Alt+I' : 'Control+Shift+I', toggleDevTools);
    localShortcut.register(isMacOS ? 'Command+Alt+D' : 'Control+Shift+D', openDebugPage);
    localShortcut.register('F12', toggleDevTools);
}
