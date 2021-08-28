import { spawn } from 'child_process';
import electron from 'electron';
import { resolve } from 'path';

import { buildMain } from './build-main';
import { waitOnHttpPage } from './utils';

async function main() {
    const rootDir = resolve(__dirname, '../');

    // compile main and preload typescript
    await Promise.all([buildMain(), waitOnHttpPage()]);

    spawn(electron as any, [rootDir], {
        stdio: 'inherit',
    });
}

main();
