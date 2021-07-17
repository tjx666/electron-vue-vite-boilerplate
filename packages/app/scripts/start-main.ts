import { yellowBright } from 'chalk';
import { ChildProcess, spawn } from 'child_process';
import chokidar from 'chokidar';
import electron from 'electron';
import { command, ExecaChildProcess } from 'execa';
import { resolve } from 'path';

import { debounce } from '../src/main/src/utils/debounce';
import { waitOnHttpPage } from './utils';

async function runCommandWithOutput(
    commandStr: string,
    callback?: (subprocess: ExecaChildProcess) => void,
) {
    const subprocess = command(commandStr);
    if (callback) callback(subprocess);
    subprocess.stdout?.pipe(process.stdout);
    await subprocess;
}

async function main() {
    const rootDir = resolve(__dirname, '../');
    const mainDir = resolve(rootDir, 'src/main');
    const compileTsCommand = `npx tsc -p ${mainDir}`;

    let electronMainProcess: ChildProcess | undefined;
    function startupElectron() {
        electronMainProcess?.kill();
        // startup electron, electron will find entry with package.json main field
        electronMainProcess = spawn(electron as any, [rootDir], {
            stdio: 'inherit',
        });
    }

    // compile main typescript
    await runCommandWithOutput(compileTsCommand);

    // watch main process source files change and restart
    const watcher = chokidar.watch(resolve(mainDir, './src'));
    async function handleChange(path: string) {
        console.log(yellowBright`File ${path} change, auto recompile and restart main...`);
        await runCommandWithOutput(compileTsCommand);
        startupElectron();
    }
    watcher.on('change', debounce(handleChange, 2000));

    // wait util vite serve the page
    await waitOnHttpPage();

    startupElectron();
}

main();
