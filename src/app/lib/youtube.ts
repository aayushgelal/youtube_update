import { google, youtube_v3 } from 'googleapis';
import { PrismaClient } from '@prisma/client';

const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY,
});


export async function getLatestUnprocessedVideoId(channelId: string, prisma: PrismaClient): Promise<string | null> {
  const response = await youtube.search.list({
    channelId: channelId,
    part: ['id'],
    order: 'date',
    type: ['video'],
    maxResults: 50,  // Fetch more results to increase chances of finding an unprocessed video
  });

  if (!response.data.items || response.data.items.length === 0) {
    return null;
  }

  for (const item of response.data.items) {
    if (item.id && item.id.videoId) {
      const existingVideo = await prisma.video.findUnique({
        where: { videoId: item.id.videoId }
      });

      if (!existingVideo) {
        return item.id.videoId;
      }
    }
  }

  return null;  // Return null if all fetched videos have been processed
}


export async function getChannelId(url: string): Promise<string> {
  const channelIdentifier = extractChannelIdentifier(url);
  
  if (!channelIdentifier) {
    throw new Error('Invalid YouTube channel URL');
  }

  if (channelIdentifier.startsWith('UC')) {
    // It's already a channel ID
    return channelIdentifier;
  }

  // It's a custom URL, we need to fetch the channel ID
  const response = await youtube.search.list({
    part: ['id'],
    type: ['channel'],
    q: channelIdentifier,
  });

  if (response.data.items && response.data.items.length > 0 && response.data.items[0].id) {
    return response.data.items[0].id.channelId || '';
  }

  throw new Error('Channel not found');
}

function extractChannelIdentifier(url: string): string | null {
  const patterns = [
    /youtube\.com\/@([\w-]+)/,        // Matches @username
    /youtube\.com\/channel\/([\w-]+)/, // Matches channel ID
    /youtube\.com\/user\/([\w-]+)/,    // Matches old-style username
    /youtube\.com\/(c\/|)([\w-]+)/,    // Matches custom URL
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[match.length - 1]; // Return the last captured group
    }
  }

  return null;
}
