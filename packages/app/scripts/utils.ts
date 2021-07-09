import { get } from 'http';

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
