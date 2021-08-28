import { ipcRenderer } from 'electron';

async function getEnv() {
    const userDataDir: string = await ipcRenderer.invoke('common.getUserDataDir');
    return {
        userDataDir,
        nodeEnv: { ...process.env },
        platform: (process.platform === 'darwin' ? 'MacOS' : 'Windows') as 'MacOS' | 'Windows',
        isMacOS: process.platform === 'darwin',
    };
}

export default getEnv;
