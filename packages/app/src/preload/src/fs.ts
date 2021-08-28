import { ipcRenderer } from 'electron';
import fs from 'fs';

export async function getUserDataDir(): Promise<string> {
    return ipcRenderer.invoke('common.getUserDataDir');
}

export async function existsPath(path: string): Promise<boolean> {
    try {
        await fs.promises.access(path, fs.constants.F_OK);
    } catch {
        return false;
    }
    return true;
}
