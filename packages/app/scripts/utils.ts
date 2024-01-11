import { get } from 'node:http';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import type { Options as CommandOptions } from 'execa';
import { execaCommand } from 'execa';

export type Environment = 'development' | 'test' | 'production';

export const __dirname = dirname(fileURLToPath(import.meta.url));
export const rootDir = resolve(__dirname, '../');
export const mainDir = resolve(rootDir, 'src/main');
export const preloadDir = resolve(rootDir, 'src/preload');
export const envFilePath = resolve(mainDir, './dist/.env');

export function waitOnHttpPage(port = 5173, interval = 100) {
    return new Promise((resolve) => {
        const url = `http://localhost:${port}`;
        const timer: NodeJS.Timeout = setInterval(() => {
            get(url, (res) => {
                clearInterval(timer);
                resolve(res.statusCode);
            }).on('error', () => {});
        }, interval);
    });
}

export async function runCommandWithOutput(commandStr: string, options?: CommandOptions) {
    console.log(chalk.dim(`$ ${commandStr}`));
    const subprocess = execaCommand(commandStr, { ...options, stdio: 'inherit' });
    subprocess.stdout?.pipe(process.stdout);
    await subprocess;
    return subprocess;
}
