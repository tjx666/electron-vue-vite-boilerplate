import { message } from 'ant-design-vue';

import type { State } from '../store';

declare module '@vue/runtime-core' {
    // 为 `this.$store` 提供类型声明
    interface ComponentCustomProperties {
        $message: typeof message;
    }
}
