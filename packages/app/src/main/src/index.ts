import path from 'node:path';

import chalk from 'chalk';
import dateFormat from 'dateformat';
import { app, BrowserWindow } from 'electron';
import type { LogMessage } from 'electron-log';
import logger from 'electron-log/main';
import stripAnsi from 'strip-ansi';

import registerHandlers from './events/index.js';
import { isDev, appRoot } from './utils/constants.js';
import setMenu from './utils/menu.js';
import { registerDevShortcuts } from './utils/shortcuts.js';
import Storage from './utils/storage.js';
import createKeepStateBrowserWindow from './utils/window.js';

let win: BrowserWindow | undefined;

// prevent open multiple apps
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
        webPreferences: {
            preload: path.resolve(appRoot, 'src/preload/dist/index.js'),
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
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.resolve(appRoot, 'src/renderer/dist/index.html'));
    }

    return mainWindow;
}

function configElectronLog() {
    logger.errorHandler.startCatching();
    logger.eventLogger.startLogging();
    // easily to read
    logger.transports.console.format = '{text}';
    logger.transports.file.format = ({ message }: { message: LogMessage }) => {
        const str = message.data
            .map((item) => {
                const isObject = item !== null && typeof item === 'object';
                return isObject ? item.toString() : String(item);
            })
            .join(' ');
        const dateStr = dateFormat(message.date, 'yyyy-mm-dd HH:MM:ss.l');
        return [`[${dateStr}] [${message.level.toUpperCase()}] ${stripAnsi(str)}`];
    };
}

app.whenReady().then(async () => {
    process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';
    configElectronLog();
    logger.info(`Application running under ${chalk.bold.green(process.env.DEV_MODE)} mode!`);

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

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
