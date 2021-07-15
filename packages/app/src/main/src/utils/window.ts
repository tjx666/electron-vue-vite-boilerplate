// copied from https://github.com/mawie81/electron-window-state/blob/master/index.js
// This helper remembers the size and position of your windows, and restores
// them in that place after app relaunch.
// Can be used for more than one window, just construct many
// instances of it and give each different name.

import { app, BrowserWindow, Rectangle, screen } from 'electron';
import fs from 'fs';
import path from 'path';

import { debounce } from './debounce';

interface CreateWindowOptions {
  width: number;
  height: number;
}

interface WindowState {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function createWindow(name: string, options: CreateWindowOptions): BrowserWindow {
  const userDataDir = path.dirname(app.getPath('userData'));
  const stateStoreFile = path.resolve(userDataDir, `window-state-${name}.json`);
  const defaultSize = {
    width: options.width,
    height: options.height,
  };

  const getSavedState = () => {
    let savedState: WindowState | undefined;
    try {
      savedState = JSON.parse(fs.readFileSync(stateStoreFile, { encoding: 'utf-8' }));
    } catch (err) {
      // For some reason json can't be read (might be corrupted).
      // No worries, we have defaults.
    }
    return Object.assign({}, defaultSize, savedState);
  };

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

  const state = ensureVisibleOnSomeDisplay(getSavedState());
  const win = new BrowserWindow(Object.assign({ nodeIntegration: true }, options, state));

  const saveState = debounce(() => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    const stateJson = JSON.stringify(state);
    fs.writeFile(stateStoreFile, stateJson, 'utf-8', (error) => {
      if (error) {
        console.error('save window state failed!', `state: ${stateJson}`);
      }
    });
  }, 200);

  win.on('resize', saveState);
  win.on('close', saveState);
  win.on('move', saveState);
  win.on('close', saveState);

  return win;
}
