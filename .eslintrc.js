const OFF = 0;
const ERROR = 2;

module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:vue/vue3-recommended',
        'plugin:promise/recommended',
        'prettier',
    ],
    globals: {
        api: 'readonly',
        ipcRenderer: 'readonly',
        log: 'readonly',
        defineProps: 'readonly',
        defineEmits: 'readonly',
        defineExpose: 'readonly',
        withDefaults: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        'vue/script-setup-uses-vars': ERROR,

        indent: [ERROR, 4, { SwitchCase: 1 }],
        quotes: [ERROR, 'single'],
        semi: [ERROR, 'always'],

        '@typescript-eslint/ban-types': OFF,
        '@typescript-eslint/explicit-module-boundary-types': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-non-null-assertion': OFF,

        'promise/catch-or-return': OFF,
        'promise/always-return': OFF,
    },
};
