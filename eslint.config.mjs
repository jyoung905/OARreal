import globals from 'globals';

export default [
  { ignores: ['.next/**', 'node_modules/**', 'evidence/**', 'public/**/*.html', 'data/**', 'coverage/**', '**/*.ts', '**/*.tsx', '**/*.d.ts'] },
  {
    files: ['**/*.{js,jsx,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-empty': 'off',
      'no-unused-vars': 'off',
      'no-undef': 'off',
      'no-console': 'off',
    },
  },
];
