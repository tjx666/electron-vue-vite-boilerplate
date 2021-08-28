import fs from 'fs-extra';

import sudo from './sudo';

export async function pathWritable(path: string) {
    try {
        await fs.access(path, fs.constants.W_OK);
    } catch {
        return false;
    }
    return true;
}

export async function ensureDirWritable(path: string) {
    if (await fs.pathExists(path)) {
        if (!(await pathWritable(path))) {
            await sudo(`chmod -R 777 '${path}'`);
        }
    } else {
        await sudo(`mkdir -p '${path}' && chmod -R 777 '${path}'`);
    }
}
