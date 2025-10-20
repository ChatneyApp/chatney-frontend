import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import a11y from 'eslint-plugin-jsx-a11y';

export default [
    { ignores: ['dist', 'node_modules'] },

    js.configs.recommended,
    ...tseslint.configs.recommended,

    {
        files: ['src/**/*.{ts,tsx}'],
        plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': a11y },
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
        },
        rules: {
            "no-unused-vars": "off",
            'react/react-in-jsx-scope': 'off',
            'react/jsx-uses-react': 'off',
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
            'rest-spread-spacing': ['error', 'never'],
            '@typescript-eslint/no-unused-vars': [
                "error",
                {
                    "argsIgnorePattern": "^_",
                    "varsIgnorePattern": "^_",
                    "caughtErrorsIgnorePattern": "^_",
                    "destructuredArrayIgnorePattern": "^_",
                    "ignoreRestSiblings": true
                }
            ],
            'quotes': ['error', 'single', { avoidEscape: true }],
            'array-bracket-spacing': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'block-spacing': ['error', 'always'],
            'computed-property-spacing': ['error', 'never'],
            'template-curly-spacing': ['error', 'never'],
            'curly': ['error', 'all'],
            'brace-style': ['error', '1tbs', { allowSingleLine: false }],
        },
        settings: { react: { version: 'detect' } },
    },
];
