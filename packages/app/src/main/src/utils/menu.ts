import { app, Menu, MenuItem, MenuItemConstructorOptions, shell } from 'electron';

import { isMacOS } from './constants';

type MenuTemplet = Array<MenuItemConstructorOptions | MenuItem>;

const template: MenuTemplet = [
    {
        label: app.name,
        submenu: [{ role: 'hide' }, { role: 'unhide' }, { type: 'separator' }, { role: 'quit' }],
    },
    {
        label: '帮助',
        role: 'help',
        submenu: [
            {
                label: '去提交 bug',
                click: async () => {
                    // FIXME: 对外发布后可能会泄漏公司 Git 内网域名
                    await shell.openExternal(
                        'https://github.com/tjx666/electron-vue-vite-boilerplate',
                    );
                },
            },
        ],
    },
];

export default function setMenu() {
    if (isMacOS) {
        const menu = Menu.buildFromTemplate(template);
        Menu.setApplicationMenu(menu);
    } else {
        Menu.setApplicationMenu(null);
    }
}
