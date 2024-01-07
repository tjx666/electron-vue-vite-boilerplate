import DebugPage from 'pages/debug/Debug.vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [{ path: '/', component: DebugPage }];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

window.j = (path: string) => router.push(path);

export default router;
