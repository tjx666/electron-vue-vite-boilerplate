import { message } from 'ant-design-vue';
import { createApp } from 'vue';

import 'ant-design-vue/dist/reset.css';
import App from './App.vue';
import router from './router';
import { key as storeKey, store } from './store';

// import './assets/js/iconfont-symbol';

const app = createApp(App);
app.use(store, storeKey);
app.use(router);

(app.config as any).productionTip = false;
app.config.globalProperties.$message = message;

app.mount('#root');
