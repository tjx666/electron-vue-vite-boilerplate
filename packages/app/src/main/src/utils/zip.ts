import AdmZip from 'adm-zip';
import fs from 'fs-extra';
import path from 'path';

export async function unzip(zipPath: string, dest: string) {
    const destExt = path.extname(dest);
    const tempUnzipFile = path.resolve(
        path.dirname(dest),
        `${path.basename(dest, destExt)}.temp${destExt}`,
    );

    if (await fs.pathExists(tempUnzipFile)) {
        await fs.remove(tempUnzipFile);
    }

    const zip = new AdmZip(zipPath);
    const extractTask = new Promise((resolve, reject) => {
        zip.extractAllToAsync(tempUnzipFile, false, (error) => {
            if (error) {
                fs.remove(tempUnzipFile, () => reject(error));
            } else {
                resolve(undefined);
            }
        });
    });

    await extractTask;
    await fs.rename(tempUnzipFile, dest);
}
