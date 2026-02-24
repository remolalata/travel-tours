import nextVitals from 'eslint-config-next/core-web-vitals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

const config = [
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../../*', '../../../*', '../../../../*', '../../../../../*'],
              message:
                'Use the `@/` alias for cross-directory imports instead of parent-relative paths.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['components/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../../*', '../../../*', '../../../../*', '../../../../../*'],
              message:
                'Use the `@/` alias for cross-directory imports instead of parent-relative paths.',
            },
            {
              group: ['@/features/*'],
              message:
                'Imports from `@/features/*` are not allowed in `components/*`. Keep `components` reusable and feature-agnostic.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'build/**',
      'dist/**',
      'coverage/**',
      'template/**',
    ],
  },
];

export default config;
