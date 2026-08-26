import { Card, CardHeader, Stack } from '@mui/material'
import type { Metadata } from 'next'
import CardLinkArea from '@/components/card-link-area'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'

export const metadata: Metadata = {
  title: 'Experiments',
}

export default function Experiments() {
  return (
    <Container>
      <PageHeader
        title="Experiments"
        subtitle="A place where you can find dragons…"
      />
      <Stack
        sx={{
          gap: 2,
        }}
      >
        <Card>
          <CardLinkArea href="/experiments/eugl">
            <CardHeader
              title="Espacio Euclídeo"
              subheader="During focused studies of algebra, the crazy idea of 'Euclideus Space' raised as a 'Star Field' screensaver-based representation. You can put yourself in it!"
            />
          </CardLinkArea>
        </Card>

        <Card>
          <CardLinkArea href="/experiments/now-listening">
            <CardHeader
              title="What I am listening to?"
              subheader="Show a list of recently played songs, as well as the current one. Presented in a simple design."
            />
          </CardLinkArea>
        </Card>

        <Card>
          <CardLinkArea href="/experiments/viz">
            <CardHeader
              title="Viz"
              subheader="Sound visualizer using wave or bars of the selected sound."
            />
          </CardLinkArea>
        </Card>
      </Stack>
    </Container>
  )
}
