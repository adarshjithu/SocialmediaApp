// eslint.config.mjs
import { defineConfig } from 'eslint-define-config';
import pkg from '@typescript-eslint/eslint-plugin';

const { recommended } = pkg;

export default defineConfig([
  {
    ...recommended,
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
]);
