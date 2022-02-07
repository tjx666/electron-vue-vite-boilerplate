import chalk from 'chalk';
import dateFormat from 'dateformat';
import { app, BrowserWindow } from 'electron';
import log, { LogMessage } from 'electron-log';
import path from 'path';
import stripAnsi from 'strip-ansi';

import registerHandlers from './events';
import { isDev, isMacOS } from './utils/constants';
import setMenu from './utils/menu';
import { registerDevShortcuts } from './utils/shortcuts';
import Storage from './utils/storage';
import createKeepStateBrowserWindow from './utils/window';

let win: BrowserWindow | undefined;

// 防止出现多实例
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
    app.quit();
} else {
    app.on('second-instance', () => {
        if (win) {
            if (win.isMinimized()) win.restore();
            win.focus();
        }
    });
}

async function createWindow() {
    const mainWindow = await createKeepStateBrowserWindow('main', {
        width: 1024,
        height: 670,
        minWidth: 1024,
        minHeight: 670,
        titleBarStyle: 'hidden',
        frame: isMacOS,
        webPreferences: {
            preload: path.resolve(__dirname, '../../preload/dist/index.js'),
        },
    });

    // 需要 renderer 进程调用 common.quit 才能退出应用
    // let shouldQuit = false;
    // mainWindow.on('close', (event) => {
    //     if (!shouldQuit) {
    //         event.preventDefault();
    //         mainWindow.webContents.send('close-window');
    //     }
    // });

    /**
     * 退出应用
     */
    // handle('common.quit', () => {
    //     shouldQuit = true;
    //     app.quit();
    // });

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.resolve(__dirname, '../../renderer/dist/index.html'));
    }

    return mainWindow;
}

function configElectronLog() {
    // 未捕获的异常会弹窗提示
    log.catchErrors();
    log.transports.console.format = '{text}';
    log.transports.ipc = null;
    log.transports.file.format = (message: LogMessage) => {
        const str = message.data
            .map((item) => {
                if (item !== null && typeof item === 'object') {
                    return item.toString();
                }
                return String(item);
            })
            .join(' ');
        const dateStr = dateFormat(message.date, 'yyyy-mm-dd HH:MM:ss.l');
        return `[${dateStr}] [${message.level.toUpperCase()}] ${stripAnsi(str)}`;
    };
}

app.whenReady().then(async () => {
    process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
    configElectronLog();
    const env = process.env.DEV_MODE;
    log.info(`Application running under ${chalk.bold.green(env)} mode!`);

    setMenu();
    registerHandlers();
    // !: 目前打出来的包也能用快捷键
    registerDevShortcuts();
    await Storage.singleton.init();
    win = await createWindow();

    app.on('activate', async () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            win = await createWindow();
        }
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});
