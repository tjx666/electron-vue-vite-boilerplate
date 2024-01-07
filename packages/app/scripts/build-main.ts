import { resolve } from 'node:path';

import { runCommandWithOutput, __dirname } from './utils';

export async function buildMain(debug = false) {
    const rootDir = resolve(__dirname, '../');
    const mainDir = resolve(rootDir, 'src/main');
    const preloadDir = resolve(rootDir, 'src/preload');

    const cleanCommand = `npx rimraf -rf ${resolve(mainDir, 'dist')} ${resolve(
        preloadDir,
        'dist',
    )}`;
    await runCommandWithOutput(cleanCommand);

    // compile main and preload typescript
    const compileMainCommand = `npx tsc -p ${mainDir} ${debug ? '--sourceMap' : ''}`;
    const compilePreloadCommand = `npx tsc -p ${preloadDir}`;
    await Promise.all([
        runCommandWithOutput(compileMainCommand),
        runCommandWithOutput(compilePreloadCommand),
    ]);
}

if (import.meta.url.endsWith(process.argv[1])) {
    buildMain();
}
