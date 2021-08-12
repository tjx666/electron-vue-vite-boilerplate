import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
// import ViteComponents from 'vite-plugin-components';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        // ViteComponents({
        //     globalComponentsDeclaration: true,
        //     customComponentResolvers: [],
        // }),
    ],
});
