import { resolve } from 'node:path';

import fs, { pathExists } from 'fs-extra';

import { runCommandWithOutput, type Environment, mainDir, preloadDir, envFilePath } from './utils';

const generateDotEevFile = async (env: Environment) => {
    // generate .env
    let envContent = '';

    const defaultEnvPath = resolve(mainDir, '.env');
    const defaultEnvContent = (await fs.pathExists(defaultEnvPath))
        ? await fs.readFile(defaultEnvPath, 'utf8')
        : '';
    envContent += defaultEnvContent;

    const testEnvPath = resolve(mainDir, '.env.test');
    if (env === 'test' && (await pathExists(testEnvPath))) {
        const testEnvContent = await fs.readFile(testEnvPath, 'utf8');
        envContent += testEnvContent;
    }

    const prodEnvPath = resolve(mainDir, '.env.prod');
    if (env === 'production' && (await pathExists(prodEnvPath))) {
        const prodEnvContent = await fs.readFile(prodEnvPath, 'utf8');
        envContent += prodEnvContent;
    }

    await fs.writeFile(envFilePath, envContent, 'utf8');
};

export async function buildMain(debug = false, env: Environment = 'development') {
    const mainDist = resolve(mainDir, 'dist');
    const cleanCommand = `npx rimraf -rf ${mainDist} ${resolve(preloadDir, 'dist')}`;
    await runCommandWithOutput(cleanCommand);
    await fs.mkdir(mainDist);

    const compileMainCommand = `esbuild ./src/main/src/index.ts --bundle --outfile=src/main/dist/index.js --external:electron --format=cjs --platform=node ${
        debug ? '--sourcemap' : ''
    }`;
    const compilePreloadCommand = `esbuild ./src/preload/src/index.ts --bundle --outfile=src/preload/dist/index.js --external:electron --format=cjs --platform=node ${
        debug ? '--sourcemap' : ''
    }`;

    await Promise.all([
        generateDotEevFile(env),
        runCommandWithOutput(compileMainCommand),
        runCommandWithOutput(compilePreloadCommand),
    ]);
}

if (import.meta.url.endsWith(process.argv[1])) {
    buildMain();
}
