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
        'prettier',
    ],
    parserOptions: {
        ecmaVersion: 12,
        parser: '@typescript-eslint/parser',
        sourceType: 'module',
    },
    plugins: ['@typescript-eslint'],
    rules: {
        indent: [ERROR, 4],
        'linebreak-style': [ERROR, 'unix'],
        quotes: [ERROR, 'single'],
        semi: [ERROR, 'always'],
        'no-undef': OFF,

        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/ban-types': OFF,
    },
};
