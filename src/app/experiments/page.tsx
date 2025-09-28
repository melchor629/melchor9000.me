import { Card, CardActionArea, CardHeader, Stack } from '@mui/material'
import Link from 'next/link'
import Container from '@/components/container'
import PageHeader from '@/components/page-header'

export const metadata = {
  title: 'Experiments',
}

export default function Experiments() {
  return (
    <Container>
      <PageHeader
        title="Experiments"
        subtitle="A place where you can find dragons…"
      />

      <Stack gap={2}>
        <Card>
          <CardActionArea LinkComponent={Link} href="/experiments/eugl">
            <CardHeader
              title="Espacio Euclídeo"
              subheader="During focused studies of algebra, the crazy idea of 'Euclideus Space' raised as a 'Star Field' screensaver-based representation. You can put yourself in it!"
            />
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea LinkComponent={Link} href="/experiments/now-listening">
            <CardHeader
              title="What I am listening to?"
              subheader="Show a list of recently played songs, as well as the current one. Presented in a simple design."
            />
          </CardActionArea>
        </Card>

        <Card>
          <CardActionArea LinkComponent={Link} href="/experiments/viz">
            <CardHeader
              title="Viz"
              subheader="Sound visualizer using wave or bars of the selected sound."
            />
          </CardActionArea>
        </Card>
      </Stack>
    </Container>
  )
}
