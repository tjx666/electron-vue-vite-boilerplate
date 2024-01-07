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
    // const compileMainCommand = `npx tsc -p ${mainDir} ${debug ? '--sourceMap' : ''}`;
    // const compilePreloadCommand = `npx tsc -p ${preloadDir}`;
    const compileMainCommand = `esbuild ./src/main/src/index.ts --bundle --outfile=src/main/dist/index.js --external:electron --format=cjs --platform=node ${
        debug ? '--sourceMap' : ''
    }`;
    const compilePreloadCommand = `esbuild ./src/preload/src/index.ts --bundle --outfile=src/preload/dist/index.js --external:electron --format=cjs --platform=node ${
        debug ? '--sourceMap' : ''
    }`;
    await Promise.all([
        runCommandWithOutput(compileMainCommand),
        runCommandWithOutput(compilePreloadCommand),
    ]);
}

if (import.meta.url.endsWith(process.argv[1])) {
    buildMain();
}
