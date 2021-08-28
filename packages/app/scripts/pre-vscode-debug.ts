import { buildMain } from './build-main';
import { waitOnHttpPage } from './utils';

async function main() {
    await Promise.all([buildMain(true), waitOnHttpPage()]);
}

main();
