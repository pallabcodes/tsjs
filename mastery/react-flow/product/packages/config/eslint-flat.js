import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export const baseConfig = tseslint.config(
  { ignores: ['dist', 'node_modules', '.turbo'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
);

export const reactConfig = tseslint.config(
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': {
        rules: reactHooks.rules,
      },
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
    languageOptions: {
      globals: globals.browser,
    },
  },
  prettier,
);
