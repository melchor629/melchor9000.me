'use client'

import CssBaseline from '@mui/material/CssBaseline'
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript'
import {
  ThemeProvider as CssVarsProvider,
} from '@mui/material/styles'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter'
import theme from './theme'

const ThemeProvider = ({ children }: { readonly children: React.ReactNode }) => (
  <AppRouterCacheProvider options={{ key: 'me', enableCssLayer: true }}>
    <InitColorSchemeScript
      attribute="[data-me-mode-%s]"
      modeStorageKey="me.theme-mode"
      colorSchemeStorageKey="me.color-scheme"
    />
    <CssVarsProvider
      modeStorageKey="me.theme-mode"
      colorSchemeStorageKey="me.color-scheme"
      disableNestedContext
      theme={theme}
    >
      <CssBaseline enableColorScheme />
      {children}
    </CssVarsProvider>
  </AppRouterCacheProvider>
)

export default ThemeProvider
