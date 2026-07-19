// @ts-check
const { defineConfig } = require('eslint/config');
const rootConfig = require('../../eslint.config.js');

module.exports = defineConfig([
    ...rootConfig,
    {
        files: ['**/*.ts'],
        rules: {
            '@angular-eslint/directive-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'zyra',
                    style: 'camelCase',
                },
            ],
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'element',
                    prefix: 'zyra',
                    style: 'kebab-case',
                },
            ],
        },
    },
    {
        files: ['**/*.html'],
        rules: {},
    },
    {
        // zyra-sidebar-item deliberately uses an attribute selector
        // (a[zyra-sidebar-item]) so it can decorate a native <a> element
        // while still being a full component — scoped narrowly to just this
        // file rather than allowing attribute-style selectors project-wide.
        files: ['**/components/navigation/zyra-sidebar/zyra-sidebar-item.ts'],
        rules: {
            '@angular-eslint/component-selector': [
                'error',
                {
                    type: 'attribute',
                    prefix: 'zyra',
                    style: 'kebab-case',
                },
            ],
        },
    },
]);
