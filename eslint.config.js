import melchor629 from '@melchor629/eslint-config'
import next from '@next/eslint-plugin-next'

export default [
  ...melchor629({
    dirname: import.meta.dirname,
    moduleResolution: 'bundler',
    semi: false,
    ts: true,
  }),
  {
    name: 'next',
    plugins: { '@next/next': next },
    rules: { ...next.configs.recommended.rules },
  },
  {
    name: 'melchor629:next-tweaks',
    files: ['**/{route,instrumentation,middleware}.{ts,js,tsx}'],
    rules: {
      'import-x/prefer-default-export': 'off',
    },
  },
]
