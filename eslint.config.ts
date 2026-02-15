import nextVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...nextVitals,
  {
    files: ['**/*.{js,jsx,ts,tsx,mjs,cjs}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../*', '../../*', '../../../*', '../../../../*', '../../../../../*'],
              message: 'Use the `@/` alias for cross-directory imports instead of parent-relative paths.',
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
    ignores: ['.next/**', 'node_modules/**', 'out/**', 'build/**', 'dist/**', 'coverage/**'],
  },
];

export default config;
