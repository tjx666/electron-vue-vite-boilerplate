import { get } from 'http';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function waitOnHttpPage(port = 3000, interval = 100) {
    return new Promise((resolve) => {
        const url = `http://localhost:${port}`;
        const timer: NodeJS.Timer = setInterval(() => {
            get(url, (res) => {
                clearInterval(timer);
                resolve(res.statusCode);
            }).on('error', (error) => {
                // ignore
            });
        }, interval);
    });
}
