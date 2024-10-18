import { YoutubeTranscript } from 'youtube-transcript'

export async function getTranscript(videoId: string): Promise<string> {
  try {
    const transcriptResponse = await YoutubeTranscript.fetchTranscript(videoId,{
    })
    return transcriptResponse.map((item) => item.text).join(' ')
  } catch (error) {
    console.error('Error fetching transcript:', error)
    throw new Error('Failed to fetch transcript')
  }
}