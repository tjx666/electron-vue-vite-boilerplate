import message from 'ant-design-vue/es/message';
import { Store } from 'vuex';

import type { State } from '../store';

declare module '@vue/runtime-core' {
    // 为 `this.$store` 提供类型声明
    interface ComponentCustomProperties {
        $store: Store<State>;
        $message: typeof message;
    }
}
