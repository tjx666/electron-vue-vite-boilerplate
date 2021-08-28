import childPrecess from 'child_process';
import dateFormat from 'dateformat';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../.env'),
});
const { DEV_MODE } = process.env;
const isDev = DEV_MODE === 'development';
const isMacOS = process.platform === 'darwin';

if (isDev) {
    const dateTime = dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss.l');
    process.env.PACK_DATE_TIME = dateTime;
    process.env.PACK_GIT_COMMIT = childPrecess
        .execSync('git rev-parse HEAD', { cwd: __dirname })
        .toString()
        .trim();
}

export { DEV_MODE, isDev, isMacOS };
