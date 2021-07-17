import { createRouter, createWebHashHistory } from 'vue-router';

import SettingsPage from './pages/Settings.vue';
import HomePage from './pages/Home.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/settings', component: SettingsPage },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
