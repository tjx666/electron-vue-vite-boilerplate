import chalk from 'chalk';
import log from 'electron-log';
import { exec } from 'sudo-prompt';

type SudoOptions =
    | ((error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => void)
    | { name?: string; icns?: string; env?: { [key: string]: string } };

export default function sudo(commandStr: string, options?: SudoOptions) {
    return new Promise((resolve, reject) => {
        log.warn(`${chalk.yellow.bold('SUDO>')} ${chalk.yellow.underline(commandStr)}`);
        exec(commandStr, { name: 'ElectronTemplet', ...options }, (error, stdout, stderr) => {
            if (stdout) {
                log.info(stdout);
            }

            if (stderr) {
                log.error(stderr);
            }

            if (error) {
                reject(error);
            } else {
                resolve(undefined);
            }
        });
    });
}
