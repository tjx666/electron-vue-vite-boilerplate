import chalk from 'chalk';
import { command, Options as CommandOptions } from 'execa';
import { get } from 'http';

export function waitOnHttpPage(port = 3000, interval = 100) {
    return new Promise((resolve) => {
        const url = `http://localhost:${port}`;
        const timer: NodeJS.Timer = setInterval(() => {
            get(url, (res) => {
                clearInterval(timer);
                resolve(res.statusCode);
                // eslint-disable-next-line @typescript-eslint/no-empty-function
            }).on('error', () => {});
        }, interval);
    });
}

export async function runCommandWithOutput(commandStr: string, options?: CommandOptions) {
    console.log(chalk.magenta`> ${commandStr}`);
    const subprocess = command(commandStr, { ...(options ?? {}), stdio: 'inherit' });
    subprocess.stdout?.pipe(process.stdout);
    await subprocess;
    return subprocess;
}
