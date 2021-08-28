import { ipcRenderer } from 'electron';
import type { JsonValue } from 'type-fest';

export const get = async <T extends JsonValue>(key: string): Promise<T> => {
    return ipcRenderer.invoke('common.storageGet', key);
};

export const set = async (key: string, value: JsonValue): Promise<void> => {
    return ipcRenderer.invoke('common.storageSet', key, value);
};
