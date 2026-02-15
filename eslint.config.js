/* eslint-env node */
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');
const playwright = require('eslint-plugin-playwright');

const playwrightRecommended =
  (playwright.configs && playwright.configs['flat/recommended']) ||
  (playwright.configs && playwright.configs.recommended);

const config = tseslint.config(
  {
    files: ['eslint.config.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
  {
    ignores: ['dist/**', 'playwright-report/**', 'test-results/**', 'node_modules/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((entry) => ({
    ...entry,
    files: ['**/*.ts'],
  })),
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
    },
  },
  playwrightRecommended
    ? {
        files: ['tests/**/*.ts'],
        ...playwrightRecommended,
      }
    : null,
  prettier,
);

module.exports = config.filter(Boolean);
