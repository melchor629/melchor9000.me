import type { Metadata } from 'next'
import NowListening from '../page'

export const revalidate = 30000

export async function generateMetadata({ params }: { params: Promise<{ user: string }> }): Promise<Metadata> {
  const { user } = await params
  return {
    title: 'Now Listening',
    description: `List of recent tracks that ${user} listens to`,
  }
}

export default NowListening
