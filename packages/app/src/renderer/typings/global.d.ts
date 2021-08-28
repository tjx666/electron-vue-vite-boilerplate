import type { Api, ElectronLog, IpcRenderer, PreloadInitialization } from '../../preload/src/index';

declare global {
    const j: (path: string) => void;
    const api: Api;
    const ipcRenderer: IpcRenderer;
    const preloadInitialization: PreloadInitialization;
    const log: ElectronLog;

    interface Window {
        j: (path: string) => void;
        api: Api;
        ipcRenderer: IpcRenderer;
        preloadInitialization: PreloadInitialization;
    }
}
