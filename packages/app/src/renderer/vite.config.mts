import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
    base: process.env.DEV_MODE === 'development' ? '/' : './',
    plugins: [vue()],
});
