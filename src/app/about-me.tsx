'use client'

import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
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

const langs = {
  primary: ['JS/TS (react + node.js)', 'C# (.NET 6+)'],
  secondary: ['python', 'C++', 'C', 'Java'],
  forFun: ['rust', 'Haskell', 'Swift'],
}

const sysadminTechs = {
  primary: ['Docker', 'Linux'],
  secondary: ['Kubernetes', 'Ubuntu Server', 'CentOS/Amazon Linux', 'Azure DevOps'],
  forFun: ['Jenkins', 'Ansible'],
}

const TechStack = (
  { techs: { forFun, primary, secondary } }: { readonly techs: typeof langs },
) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 1,
      mt: 1,
      mb: 2,
      pb: '1px',
    }}
  >
    {primary.map((l) => <Chip key={l} label={l} variant="outlined" color="primary" />)}
    {secondary.map((l) => <Chip key={l} label={l} variant="outlined" />)}
    {forFun.map((l) => <Chip key={l} label={l} variant="outlined" sx={{ color: 'text.secondary' }} />)}
  </Box>
)

const KnowledgeCard = ({
  children,
  techs,
  title,
}: React.PropsWithChildren<{ readonly title: string, readonly techs: typeof langs }>) => (
  <Card elevation={2}>
    <CardContent>
      <Typography variant="h4" gutterBottom>
        {title}
      </Typography>
      <TechStack techs={techs} />
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
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(auto-fit, minmax(433px, 1fr))' },
          gap: 2,
          mb: 6,
        }}
      >
        <KnowledgeCard title="Software Engineer (web developer)" techs={langs}>
          <Typography gutterBottom>
            I am a Software Engineer (Computer Science speciallization focused on Software
            development and magament), studied in&nbsp;
            <em>Universidad de Málaga</em>
            . My main attraction is frontend development, but I like to tinker with other languages
            for small game development or system programming.
          </Typography>
        </KnowledgeCard>

        <KnowledgeCard title="Sysadmin/DevOps (?)" techs={sysadminTechs}>
          <Typography gutterBottom>
            Had a past &quot;work&quot;, which consisted in managing a middled-size network for a
            lot of students in University. Learned a lot of stuff of Linux, networks and a small of
            DevOps. Other private projects lead me to learn Docker and Kubernetes after.
          </Typography>
          <Typography gutterBottom>
            Disclaimer: I do not consider a real sysadmin, despite I&apos;m able to do some cool
            stuff. Experiences are valuable anyway. So here it goes.
          </Typography>
        </KnowledgeCard>

        <KnowledgeCard
          title="Photographer"
          techs={{ primary: ['Canon 1300D'], secondary: [], forFun: [] }}
        >
          <Typography gutterBottom>
            One of my hobbies is photography. Take a look at my&nbsp;
            <NextLink href="/gallery">Gallery</NextLink>
            &nbsp;which contain some of my work.
          </Typography>
        </KnowledgeCard>

        <KnowledgeCard
          title="Music connoisieur"
          techs={{
            primary: ['Rock', 'House', 'Melodic Death Metal'],
            secondary: ['Jazz', 'OST', 'Classical Music'],
            forFun: [],
          }}
        >
          <Typography gutterBottom>
            I listen to quite a lot of music, of several genres. I am not a connoisieur thought.
            Look at my last.fm or spotify for more.
          </Typography>
        </KnowledgeCard>
      </Box>

      <Figure>
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
