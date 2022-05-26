// read more https://github.com/vuejs/vue-next/pull/3399
// eslint-disable-next-line vue/prefer-import-from-vue
import type { AllowedComponentProps, Component, ComponentCustomProps } from '@vue/runtime-core';

declare module 'vue' {
    interface DynamicComponent {
        new (): {
            $props: AllowedComponentProps & ComponentCustomProps & { is: string | Component };
        };
    }

    export interface GlobalComponents {
        Component: DynamicComponent;
        RouterView: typeof import('vue-router')['RouterView'];
        GButton: typeof import('ant-design-vue/es')['Button'];
        GDivider: typeof import('ant-design-vue/es')['Divider'];
        GDropdown: typeof import('ant-design-vue/es')['Dropdown'];
        GIcon: typeof import('ant-design-vue/es/icon')['default'];
        GInput: typeof import('ant-design-vue/es')['Input'];
        GMenu: typeof import('ant-design-vue/es')['Menu'];
        GModal: typeof import('ant-design-vue/es')['Modal'];
        GProgress: typeof import('ant-design-vue/es')['Progress'];
        GSpin: typeof import('ant-design-vue/es')['Spin'];
        IconFont: typeof import('../components/iconFont/IconFont.vue')['default'];
    }
}
