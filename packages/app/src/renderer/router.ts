import { createRouter, createWebHashHistory } from 'vue-router';

import DebugPage from './pages/Debug.vue';

const routes = [{ path: '/', component: DebugPage }];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

window.j = (path: string) => router.push(path);

export default router;
