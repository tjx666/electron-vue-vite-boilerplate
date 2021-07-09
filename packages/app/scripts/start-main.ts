import chokidar from 'chokidar';
import { resolve } from 'path';
import { yellowBright } from 'chalk';
import { command } from 'execa';

import { waitOnHttpPage } from './utils';

async function main() {
  const mainDir = resolve(__dirname, '../src/main');
  const rootDir = resolve(__dirname, '../');

  const compileTsCommand = `npx tsc -p ${mainDir}`;
  const startupElectronCommand = `npx electron ${rootDir}`;

  // compile main typescript
  await command(compileTsCommand);

  // wait util vite serve the page
  await waitOnHttpPage();

  // startup electron, electron will find entry with package.json main field
  await command(startupElectronCommand);

  // watch main package files change and restart

  const watcher = chokidar.watch(mainDir);
  watcher.on('change', async (path) => {
    console.log(yellowBright`File ${path} change, auto recompile and restart main...`);
    await command(compileTsCommand);
    await command(startupElectronCommand);
  });
}

main();
