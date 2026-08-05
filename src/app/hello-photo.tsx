import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Image, { type StaticImageData } from 'next/image'
import { useCallback, useMemo, useState } from 'react'
import normal6 from '@/content/home/normal/:o.jpg'
import normal5 from '@/content/home/normal/distorted-fanta.jpg'
import normal3 from '@/content/home/normal/distorted.jpg'
import normal9 from '@/content/home/normal/looking-at-you.png'
import normal7 from '@/content/home/normal/mlady.jpg'
import normal1 from '@/content/home/normal/pixel-art.png'
import normal8 from '@/content/home/normal/sapo-oculos.jpg'
import normal4 from '@/content/home/normal/thumbs-up-sus.jpg'
import normal2 from '@/content/home/normal/too-close.jpg'
import re1 from '@/content/home/re/re.svg'

const images = [
  {
    date: [14, 4],
    mood: 'spanish republican',
    urls: [re1 as typeof normal1],
  },
  {
    mood: 'normal',
    urls: [normal1, normal2, normal3, normal4, normal5, normal6, normal7, normal8, normal9],
  },
] satisfies Array<{ date?: [day: number, month: number]; mood: string; urls: StaticImageData[] }>

const HelloPhotoContainer = styled(Box, { name: 'HelloPhotoContainer' })(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  lineHeight: 0,

  '> img': {
    borderRadius: 9999,
    boxShadow: theme.shadows[2],
    objectFit: 'cover',
  },
}))

export default function HelloPhoto({ random }: { readonly random: number }) {
  const mood = useMemo(() => {
    const today = new Date()
    const month = today.getMonth() + 1
    const day = today.getDate()
    return images.find(({ date }) => !date || (date[0] === day && date[1] === month))!
  }, [])
  const [imageNum, setImageNum] = useState(Math.trunc(random * mood.urls.length))
  const imageUrl = useMemo(() => {
    const { urls } = mood
    const url = urls[imageNum]
    return url
  }, [mood, imageNum])

  const nextPhoto = useCallback(
    (e: React.MouseEvent<HTMLImageElement>) => {
      e.preventDefault()
      setImageNum((v) => (v + 1) % mood.urls.length)
    },
    [mood.urls.length],
  )

  return (
    <HelloPhotoContainer>
      <Image
        alt={`${mood.mood} me`}
        src={imageUrl}
        width={256}
        height={256}
        onContextMenu={nextPhoto}
        priority
      />
    </HelloPhotoContainer>
  )
}
