import { get } from 'node:http';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import chalk from 'chalk';
import type { Options as CommandOptions } from 'execa';
import { execaCommand } from 'execa';

export const __dirname = dirname(fileURLToPath(import.meta.url));

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
