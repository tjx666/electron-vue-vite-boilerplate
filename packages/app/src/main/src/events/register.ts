import chalk from 'chalk';
import type { IpcMainInvokeEvent } from 'electron';
import { ipcMain } from 'electron';
import log from 'electron-log';

const highlight = chalk.magentaBright.italic;

export function handle(
    channel: string,
    listener: (event: IpcMainInvokeEvent, ...args: any[]) => Promise<void> | any,
): void {
    log.info(`register handler ${highlight(channel)}`);
    return ipcMain.handle(channel, async (...sourceArgs: any[]) => {
        log.info(`receive event ${highlight(channel)}`);
        const start = Date.now();
        const result = await listener(sourceArgs[0], ...sourceArgs.slice(1));
        const costMs = Date.now() - start;
        const costMsHighlight = costMs >= 500 ? chalk.yellowBright : chalk.green;
        const costMsStr = costMsHighlight(`${costMs}ms`);
        log.info(`response event ${highlight(channel)} costs ${costMsStr}`);
        return result;
    });
}
