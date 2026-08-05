'use client'

import MenuIcon from '@mui/icons-material/Menu'
import { Box } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { styled } from '@mui/material/styles'
import Toolbar from '@mui/material/Toolbar'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCallback, useLayoutEffect, useMemo, useState } from 'react'

const StyledMuiAppBar = styled(MuiAppBar, {
  name: 'StyledMuiAppBar',
})<{ component: 'nav' }>(({ theme }) => ({
  '&.chilled': {
    backgroundColor: 'transparent',
    backdropFilter: 'blur(0)',
  },
  boxShadow: 'none',
  backgroundImage: 'none',
  backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.default} 65%, rgb(0 0 0 / 0%))`,
  backdropFilter: 'blur(6px)',
  color: theme.vars.palette.text.primary,
  userSelect: 'none',
  transition: theme.transitions.create(['background-color', 'backdrop-filter'], {
    duration: theme.transitions.duration.short,
    easing: theme.transitions.easing.easeInOut,
  }),

  ...theme.applyStyles('dark', {
    backgroundColor: `color-mix(in srgb, ${theme.vars.palette.background.default} 85%, rgb(0 0 0 / 0%))`,
  }),
}))

const routes = [
  { name: 'About Me', path: '/' },
  { name: 'Blog', path: '/blog' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Projects', path: '/projects' },
  { name: 'Experiments', path: '/experiments' },
  { name: 'Support Me!', path: '/support-me' },
]

export default function AppBar() {
  const currentPath = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [chilled, setChilled] = useState(true)
  const [invisibleToolbarRef, setInvisibleToolbarRef] = useState<HTMLElement | null>(null)
  const currentRoute = useMemo(
    () =>
      routes
        .toSorted((a, b) =>
          a.path.length === b.path.length
            ? a.path.localeCompare(b.path)
            : b.path.length - a.path.length,
        )
        .find((p) => (p.path === '/' ? currentPath === '/' : currentPath.startsWith(p.path))),
    [currentPath],
  )

  const handleDrawerToggle = useCallback(() => setDrawerOpen((v) => !v), [])

  useLayoutEffect(() => {
    if (!invisibleToolbarRef) {
      return () => {}
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        setChilled(entry.isIntersecting)
      },
      { threshold: 0.5 },
    )
    intersectionObserver.observe(invisibleToolbarRef)
    return () => intersectionObserver.disconnect()
  }, [invisibleToolbarRef])

  return (
    <>
      <StyledMuiAppBar component="nav" className={chilled ? 'chilled' : ''}>
        <Toolbar variant="dense">
          <Tooltip
            open={drawerOpen}
            arrow
            placement="bottom-start"
            title={
              <div>
                <List>
                  {routes.map(({ name, path }) => (
                    <ListItem key={name} disablePadding>
                      <ListItemButton
                        LinkComponent={Link}
                        href={path}
                        sx={{ textAlign: 'center' }}
                        selected={path === currentRoute?.path}
                        onClick={handleDrawerToggle}
                      >
                        <ListItemText primary={name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </div>
            }
            slotProps={{
              tooltip: {
                sx: { padding: 0 },
              },
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -16],
                    },
                  },
                ],
              },
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            melchor9000.me
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'inline-flex' }, columnGap: 1 }}>
            {routes.map(({ name, path }) => (
              <Button
                key={name}
                LinkComponent={Link}
                href={path}
                color={!chilled && path === currentRoute?.path ? 'primary' : 'inherit'}
                variant={path === currentRoute?.path ? 'contained' : 'text'}
                sx={{ px: 1 }}
              >
                {name}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </StyledMuiAppBar>

      <Toolbar ref={setInvisibleToolbarRef} variant="dense" />
    </>
  )
}

export const AppBarSkeleton = () => (
  <StyledMuiAppBar component="nav">
    <Toolbar variant="dense" />
  </StyledMuiAppBar>
)
