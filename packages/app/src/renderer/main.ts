import Badge from 'ant-design-vue/es/badge';
import Button from 'ant-design-vue/es/button';
import Divider from 'ant-design-vue/es/divider';
import Dropdown from 'ant-design-vue/es/dropdown';
import Icon from 'ant-design-vue/es/icon';
import Input from 'ant-design-vue/es/input';
import Menu from 'ant-design-vue/es/menu';
import message from 'ant-design-vue/es/message';
import Modal from 'ant-design-vue/es/modal';
import Progress from 'ant-design-vue/es/progress';
import Spin from 'ant-design-vue/es/spin';
import { createApp } from 'vue';

import App from './App.vue';
import IconFont from './components/iconFont/IconFont.vue';
import router from './router';
import { key as storeKey, store } from './store';

import 'ant-design-vue/es/button/style';
import 'ant-design-vue/es/divider/style';
import 'ant-design-vue/es/input/style';
import 'ant-design-vue/es/message/style';
import 'ant-design-vue/es/progress/style';
import 'ant-design-vue/es/dropdown/style';
import 'ant-design-vue/es/menu/style';
import 'ant-design-vue/es/modal/style';
import 'ant-design-vue/es/badge/style';

// import './assets/js/iconfont-symbol';

preloadInitialization.then(() => {
    const app = createApp(App);
    app.use(store, storeKey);
    app.use(router);

    // config antd
    (app.config as any).productionTip = false;
    app.config.globalProperties.$message = message;
    app.config.globalProperties.$storage = api.storage;
    app.use(Button)
        .use(Divider)
        .use(Dropdown)
        .use(Icon)
        .use(Input)
        .use(Menu)
        .use(Modal)
        .use(Progress)
        .use(Badge)
        .use(Spin);
    app.component('IconFont', IconFont);

    app.mount('#root');
});
