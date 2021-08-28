import fs from 'fs-extra';
import got from 'got';
import path from 'path';
import stream from 'stream';
import { promisify } from 'util';

const pipeline = promisify(stream.pipeline);

export default async function download(url: string, dest: string, timeout = 1 * 60 * 1000) {
    const destExt = path.extname(dest);
    const tempDownloadFile = path.resolve(
        path.dirname(dest),
        `downloading-${path.basename(dest, destExt)}.temp${destExt}`,
    );

    // 可能用户直接关机导致存在临时文件
    if (await fs.pathExists(tempDownloadFile)) {
        await fs.remove(tempDownloadFile);
    }

    try {
        await pipeline(got.stream(url, { timeout }), fs.createWriteStream(tempDownloadFile));
    } catch (error) {
        await fs.remove(tempDownloadFile);
        throw error;
    }

    await fs.rename(tempDownloadFile, dest);
}
