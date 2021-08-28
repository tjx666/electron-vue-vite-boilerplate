import { app, BrowserWindow, dialog } from 'electron';
import isOnline from 'is-online';
import os from 'os';

import { DEV_MODE, isMacOS } from '../utils/constants';
import { handle } from './register';

export default function registerUniversalHandlers() {
    /**
     * 打开只能选择文件夹的文件管理器窗口，返回选择的文件夹路径，没有选择时返回 undefined
     */
    handle('common.selectSingleFolder', async () => {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;

        const dir = await dialog.showOpenDialog(win, {
            properties: ['openDirectory'],
        });

        return dir.filePaths[0];
    });

    /**
     * 获取工具箱 App 的用户数据目录，mac 上是: ~/Library/Application Support/appName/
     */
    handle('common.getUserDataDir', async () => {
        return app.getPath('userData');
    });

    /**
     * 判断当前是否处在全屏状态
     */
    handle('common.getIsFullScreen', async () => {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;
        return win.isFullScreen();
    });

    /**
     * Windows 系统窗口控制
     */
    type WindowControlAction = 'min' | 'max' | 'unMax' | 'close' | 'toggleFull';
    handle('common.windowsControl', async (event, action: WindowControlAction) => {
        const win = BrowserWindow.getFocusedWindow();
        if (!win) return;

        if (action === 'min') {
            win.minimize();
        } else if (action === 'max') {
            win.maximize();
        } else if (action === 'close') {
            win.close();
        } else if (action === 'unMax') {
            win.unmaximize();
        } else if (action === 'toggleFull') {
            win.setFullScreen(!win.isFullScreen());
        }
    });

    /**
     * 判断当前网络是否链接
     */
    handle('common.network.isOnline', async () => {
        return isOnline();
    });

    /**
     * 获取当前版本号
     */
    handle('common.app.about', async () => {
        const appVersion = app.getVersion();
        const devMode = DEV_MODE;
        const packDateTime = process.env.PACK_DATE_TIME;
        const packGitCommit = process.env.PACK_GIT_COMMIT;
        const systemName = isMacOS ? 'MacOS' : 'Windows';
        const kernelVersion = os.version();
        const electronVersion = process.versions.electron;
        const nodeVersion = process.version;
        const chromeVersion = process.versions.chrome;

        return {
            appVersion,
            devMode,
            packDateTime,
            packGitCommit,
            systemName,
            kernelVersion,
            electronVersion,
            nodeVersion,
            chromeVersion,
        };
    });
}
