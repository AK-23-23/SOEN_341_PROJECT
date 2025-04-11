import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { 
    ignores: ['dist'] 
  },
  {
    // Global configuration for all JS/JSX files
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { 
      react: { version: '18.3' },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/jsx-no-target-blank': 'off',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      // Customize additional rules here if desired.
    },
  },
  {
    // Override configuration for test files (Jest and Cypress)
    files: ['**/*.{test,spec,cy}.{js,jsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        jest: true,         // Jest globals (describe, test, expect, etc.)
        Cypress: true,      // Cypress global
        cy: true,           // Cypress global
        describe: true,
        it: true,
        beforeEach: true,
        before: true,
        afterEach: true,
        after: true,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Optionally disable no-unused-vars in tests to reduce noise.
      'no-unused-vars': 'off',
    },
  },
];
