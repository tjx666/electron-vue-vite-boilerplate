// copied from https://github.com/mawie81/electron-window-state/blob/master/index.js

// This helper remembers the size and position of your windows, and restores
// them in that place after app relaunch.
// Can be used for more than one window, just construct many
// instances of it and give each different name.

import path from 'node:path';

import type { BrowserWindowConstructorOptions, Rectangle } from 'electron';
import { app, BrowserWindow, screen } from 'electron';
import fs from 'fs-extra';

import { debounce } from './debounce.js';

interface WindowState {
    x: number;
    y: number;
    width: number;
    height: number;
}

export default async function createWindow(
    name: string,
    options: BrowserWindowConstructorOptions,
): Promise<BrowserWindow> {
    const userDataDir = app.getPath('userData');
    const stateStoreFile = path.resolve(userDataDir, `window-state-${name}.json`);
    const defaultSize = {
        width: options.width ?? 1024,
        height: options.height ?? 670,
    };

    const getSavedState = async () => {
        let savedState: WindowState | undefined;
        try {
            savedState = await fs.readJSON(stateStoreFile);
        } catch (error) {
            console.error(error);
            // For some reason json can't be read (might be corrupted).
            // No worries, we have defaults.
        }
        return Object.assign({}, defaultSize, savedState);
    };

    // eslint-disable-next-line prefer-const
    let win: BrowserWindow;
    const getCurrentPosition = () => {
        const position = win.getPosition();
        const size = win.getSize();
        return {
            x: position[0],
            y: position[1],
            width: size[0],
            height: size[1],
        };
    };

    const windowWithinBounds = (windowState: WindowState, bounds: Rectangle) => {
        return (
            windowState.x >= bounds.x &&
            windowState.y >= bounds.y &&
            windowState.x + windowState.width <= bounds.x + bounds.width &&
            windowState.y + windowState.height <= bounds.y + bounds.height
        );
    };

    const resetToDefaults = () => {
        const bounds = screen.getPrimaryDisplay().bounds;
        return Object.assign({}, defaultSize, {
            x: (bounds.width - defaultSize.width) / 2,
            y: (bounds.height - defaultSize.height) / 2,
        });
    };

    const ensureVisibleOnSomeDisplay = (windowState: WindowState) => {
        const visible = screen.getAllDisplays().some((display) => {
            return windowWithinBounds(windowState, display.bounds);
        });
        if (!visible) {
            // Window is partially or fully not visible now.
            // Reset it to safe defaults.
            return resetToDefaults();
        }
        return windowState;
    };

    const state = ensureVisibleOnSomeDisplay(await getSavedState());
    const mergedOptions: BrowserWindowConstructorOptions = {
        ...options,
        ...state,
    };
    win = new BrowserWindow(mergedOptions);

    const saveState = debounce(() => {
        if (!win.isMinimized() && !win.isMaximized()) {
            Object.assign(state, getCurrentPosition());
        }
        const stateJson = JSON.stringify(state);
        fs.writeFile(stateStoreFile, stateJson, 'utf8', (error) => {
            if (error) {
                console.error('save window state failed!', `state: ${stateJson}`);
            }
        });
    }, 200);

    win.on('resize', saveState);
    win.on('move', saveState);

    return win;
}
