import {
  Box,
  Button,
  Link,
} from '@mui/material'
import type { Metadata } from 'next'
import PageHeader from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Support me!',
}

export default function SupportMe() {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 'calc(100lvh - 48px)',
        textAlign: 'center',
      }}
    >
      <div>
        <PageHeader
          title="Support me!"
          subtitle="If you like my work, pay me a coffee 😉"
        />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <div>
            <Link
              href="https://ko-fi.com/G2G71SLJU"
              target="_blank"
              rel="noopener noreferrer"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height={36}
                src="https://storage.ko-fi.com/cdn/kofi1.png?v=3"
                alt="Buy Me a Coffee at ko-fi.com"
              />
            </Link>
          </div>

          <div>
            <Button
              component="a"
              variant="contained"
              href="https://paypal.me/melchor9000"
              target="_blank"
              rel="noopener noreferrer"
            >
              PayPal donation
            </Button>
          </div>
        </Box>
      </div>
    </Box>
  )
}
