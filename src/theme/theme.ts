import { grey, blue } from '@mui/material/colors'
import { extendTheme } from '@mui/material/styles'
import type {} from '@mui/material/themeCssVarsAugmentation'

const theme = extendTheme({
  colorSchemeSelector: '[data-me-mode-%s]',
  defaultColorScheme: 'dark',
  colorSchemes: {
    light: {
      palette: {
        background: {
          default: grey[50],
          paper: grey[200],
        },
        Tooltip: {
          bg: `color-mix(in srgb, ${grey[300]} 75%, rgb(0 0 0 / 0%))`,
        },
      },
    },
    dark: {
      palette: {
        background: {
          default: grey[900],
          paper: grey[900],
        },
        primary: {
          ...blue,
          main: blue[300],
          dark: blue[500],
          light: blue[100],
        },
        Tooltip: {
          bg: `color-mix(in srgb, ${grey[800]} 75%, rgb(0 0 0 / 0%))`,
        },
      },
    },
  },
  cssVarPrefix: 'me',
  components: {
    MuiIconButton: {
      defaultProps: {
        TouchRippleProps: {
          center: false,
        },
      },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: theme.vars.shape.borderRadius,
        }),
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          wordBreak: 'break-word',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          color: theme.vars.palette.text.primary,
          backdropFilter: 'blur(4px)',
        }),
      },
    },
  },
  typography: {
    fontFamily: 'var(--me-roboto-flex-font)',
  },
  shape: {
    borderRadius: 9,
  },
})

export default theme
