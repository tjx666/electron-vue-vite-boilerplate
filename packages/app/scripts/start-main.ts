import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

import electron from 'electron';

import { buildMain } from './build-main';
import { waitOnHttpPage, __dirname } from './utils';

async function main() {
    const rootDir = resolve(__dirname, '../');

    // compile main and preload typescript
    await Promise.all([buildMain(), waitOnHttpPage()]);

    spawn(electron as any, [rootDir], {
        stdio: 'inherit',
    });
}

main();
