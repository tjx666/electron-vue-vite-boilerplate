import { resolve } from 'node:path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.DEV_MODE === 'development' ? '/' : './',
    plugins: [vue()],
    resolve: {
        alias: {
            '@': __dirname,
            'apis': resolve(__dirname, 'apis'),
            'assets': resolve(__dirname, 'assets'),
            'components': resolve(__dirname, 'components'),
            'pages': resolve(__dirname, 'pages'),
            'mock': resolve(__dirname, 'mock'),
            'models': resolve(__dirname, 'models'),
            'store': resolve(__dirname, 'store'),
            'typings': resolve(__dirname, 'typings'),
            'utils': resolve(__dirname, 'utils'),
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
            },
        },
    },
});
