import { app, ipcMain } from 'electron';
import fs from 'fs-extra';
import path from 'path';
import type { JsonValue } from 'type-fest';

export default class Storage {
    static singleton = new Storage();

    public storePath = '';
    public store: Record<string, JsonValue> = {};

    async init(): Promise<void> {
        const userDataDir = app.getPath('userData');
        this.storePath = path.resolve(userDataDir, 'store.json');
        if (await fs.pathExists(this.storePath)) {
            const localStore = (await fs.readJSON(this.storePath, { throws: false })) ?? {};
            Object.assign(this.store, localStore);
        }

        ipcMain.handle('common.storageSet', async (event, key: string, value: JsonValue) => {
            await this.set(key, value);
        });

        ipcMain.handle('common.storageGet', async (event, key: string) => {
            return this.get(key);
        });
    }

    async set(key: string, value: JsonValue): Promise<void> {
        await fs.promises.writeFile(
            this.storePath,
            JSON.stringify({
                ...this.store,
                [key]: value,
            }),
            {
                encoding: 'utf-8',
            },
        );
        Reflect.set(this.store, key, value);
    }

    get<T extends JsonValue>(key: string): T {
        return Reflect.get(this.store, key);
    }
}
