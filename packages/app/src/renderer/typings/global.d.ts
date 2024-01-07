import type { IpcRenderer } from '../../preload/src/index';

declare global {
    const j: (path: string) => void;
    const ipcRenderer: IpcRenderer;

    interface Window {
        j: (path: string) => void;
        ipcRenderer: IpcRenderer;
    }
}
