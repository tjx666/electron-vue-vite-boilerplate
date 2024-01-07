import chalk from 'chalk';
import logger from 'electron-log/main';
import { exec } from 'sudo-prompt';

type SudoOptions =
    | ((error?: Error, stdout?: string | Buffer, stderr?: string | Buffer) => void)
    | { name?: string; icns?: string; env?: { [key: string]: string } };

export default function sudo(commandStr: string, options?: SudoOptions) {
    return new Promise((resolve, reject) => {
        logger.warn(`${chalk.yellow.bold('SUDO>')} ${chalk.yellow.underline(commandStr)}`);
        exec(commandStr, { name: 'ElectronTemplet', ...options }, (error, stdout, stderr) => {
            if (stdout) {
                logger.info(stdout);
            }

            if (stderr) {
                logger.error(stderr);
            }

            if (error) {
                reject(error);
            } else {
                // eslint-disable-next-line unicorn/no-useless-undefined
                resolve(undefined);
            }
        });
    });
}
