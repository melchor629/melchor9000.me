import melchor629Oxlint from '@melchor629/oxlint-config'

export default melchor629Oxlint({
  env: {
    builtin: true,
    browser: true,
    node: true,
  },
  jsx: true,
  ts: true,
  additional: [
    {
      plugins: ['nextjs'],
      options: {
        typeCheck: true,
      },
    },
    {
      overrides: [
        {
          files: ['src/app/**/route.{ts,tsx}'],
          rules: {
            'import/prefer-default-export': 'off',
          },
        }
      ],
    },
  ],
})
