'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Image from 'next/image'
import React, { useMemo } from 'react'
import Container from '@/components/container'
import { Figure, FigureCaption } from '@/components/figure'
import NextLink from '@/components/next-link'
import itsame2 from '@/content/itsame/manu.jpg'
import itsame1 from '@/content/itsame/raul.jpg'
import itsame3 from '@/content/itsame/raul2.jpg'

const images = [
  {
    image: itsame1,
    photographer: 'Raúl',
  },
  {
    image: itsame2,
    photographer: 'Manu',
  },
  {
    image: itsame3,
    photographer: 'Raúl',
  },
]

const KnowledgeCard = ({
  children,
  title,
}: React.PropsWithChildren<{ readonly title: string }>) => (
  <Card elevation={6}>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      {children}
    </CardContent>
  </Card>
)

export default function AboutMe({ random }: { readonly random: number }) {
  const { image, photographer } = useMemo(
    () => images[Math.trunc(random * images.length)],
    [random],
  )

  return (
    <Container>
      <Typography variant="h2" sx={{ textAlign: 'center', mt: 2, mb: 4 }}>
        About me
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(433px, 1fr))' },
          gap: 2,
          mb: 8,
        }}
      >
        <KnowledgeCard title="Software Engineer / Web Developer">
          <Typography gutterBottom>
            I am a Software Engineer (Computer Science speciallization focused on Software
            development and project magament), studied in&nbsp;
            <em>Universidad de Málaga</em> from 2014 to 2018.
          </Typography>
          <Typography gutterBottom>
            My area of specialization is <strong>Frontend</strong> as Web developer. Still
            I find myself trying new technologies every time to time.
          </Typography>
          <Typography>
            Other roles I participate in my work is <strong>Backend</strong> developer and
            <strong>DevOps</strong>.
          </Typography>
        </KnowledgeCard>

        <KnowledgeCard title="Home Lab">
          <Typography gutterBottom>
            Had a past &quot;work&quot;, which consisted in managing a middled-size network for a
            lot of students in University. Learned a lot of stuff of Linux, networks and a small of
            DevOps. Other private projects lead me to learn Docker, Kubernetes and Jenkins after.
          </Typography>
          <Typography>
            As a hobby, I manage a home lab with two servers, multiples services deployed across
            both, as well as NAS and IoT networks (Thread and Zigbee).
          </Typography>
        </KnowledgeCard>

        <KnowledgeCard
          title="Photographer"
        >
          <Typography gutterBottom>
            Another of my hobbies is photography. Take a look at my&nbsp;
            <NextLink href="/gallery">Gallery</NextLink>
            &nbsp;which contain some of my work.
          </Typography>
          <Typography>
            Currently driving a Canon EOS 1300D and OnePlus Nord 4.
          </Typography>
        </KnowledgeCard>

        <KnowledgeCard
          title="Music connoisieur"
        >
          <Typography gutterBottom>
            I listen to quite a lot of music, of several genres. I am not a connoisieur thought.
            Look at my last.fm or Spotify for more.
          </Typography>
        </KnowledgeCard>
      </Box>

      <Figure sx={{ mb: 8 }}>
        <Image src={image} alt="A photography of myself" />
        <FigureCaption sx={{ textAlign: 'end' }}>
          It&apos;s me -&nbsp;
          <span aria-label="Camera emoji">📷</span>
          &nbsp;
          {photographer}
        </FigureCaption>
      </Figure>
    </Container>
  )
}
