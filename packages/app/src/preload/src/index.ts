import { contextBridge, ipcRenderer } from 'electron';
import log from 'electron-log';

import getEnv from './env';
import * as fs from './fs';
import * as storage from './storage';

async function injectApi() {
    const env = await getEnv();

    const api = {
        fs,
        storage: {
            set: storage.set,
            get: storage.get,
        },
        env,
    };
    contextBridge.exposeInMainWorld('api', api);
    return api;
}

contextBridge.exposeInMainWorld('ipcRenderer', {
    on: ipcRenderer.on.bind(ipcRenderer),
    invoke: ipcRenderer.invoke.bind(ipcRenderer),
});
contextBridge.exposeInMainWorld('log', log.functions);
log.transports.console.format = '{text}';
// log.transports.ipc = null;
// log.transports.file.format = (message: LogMessage) => {
//     const str = message.data
//         .map((item) => {
//             if (item !== null && typeof item === 'object') {
//                 return item.toString();
//             }
//             return String(item);
//         })
//         .join(' ');
//     const dateStr = dateFormat(message.date, 'yyyy-mm-dd HH:MM:ss.l');
//     return `[${dateStr}] [${message.level.toUpperCase()}] ${stripAnsi(str)}`;
// };
const preloadInitialization = injectApi();
contextBridge.exposeInMainWorld('preloadInitialization', preloadInitialization);

type Api = Awaited<ReturnType<typeof injectApi>>;
type PreloadInitialization = ReturnType<typeof injectApi>;
type ElectronLog = typeof log;
export type { Api, ElectronLog, PreloadInitialization };

export { type IpcRenderer } from 'electron';
