/** @type {import('stylelint').Config} */
export default {
    extends: [
        'stylelint-config-standard',
        'stylelint-config-recess-order',
        'stylelint-config-recommended-vue',
    ],
    plugins: ['stylelint-declaration-block-no-ignored-properties'],
    rules: {
        'plugin/declaration-block-no-ignored-properties': true,
    },
    ignoreFiles: ['**/node_modules/**'],
};
