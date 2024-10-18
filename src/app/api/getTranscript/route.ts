import { NextResponse } from 'next/server'
import { getLatestVideoId } from '@/app/lib/youtube'
import { getTranscript } from '@/app/lib/transcript'
import { sendEmail } from '@/app/lib/email'

export async function POST(request: Request) {
  const { channelUrl } = await request.json()

  try {
    const videoId = await getLatestVideoId(channelUrl)
    const transcript = await getTranscript(videoId)
    sendEmail('aayushgelal4@gmail.com',"hhh", transcript)
    return NextResponse.json({ transcript })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch transcript' }, { status: 500 })
  }
}