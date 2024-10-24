import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';
import { google } from 'googleapis';
import { getChannelId } from '@/app/lib/youtube';

const prisma = new PrismaClient();
const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscriptions = await prisma.subscription.findMany({
      where: { user: { clerkid: userId } },
      include: { channel: true },
    });

    const channelsWithDetails = await Promise.all(
      subscriptions.map(async (sub:any) => {
        const response = await youtube.channels.list({
          part: ['snippet'],
          id: [sub.channel.channelId],
        });

        const channelDetails = response.data.items?.[0]?.snippet;
        console.log(channelDetails?.title,"is the channel name")

        return {
          id: sub.channel.id,
          channelId: sub.channel.channelId,
          name: channelDetails?.title || 'Unknown Channel',
          profilePhotoUrl: channelDetails?.thumbnails?.high?.url || '',
        };
      })
    );

    return NextResponse.json({ channels: channelsWithDetails });
  } catch (error) {
    console.error('Error fetching user channels:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { channelId } = await req.json();
    const realId = await getChannelId(channelId);

    // Find or create the User
    const user = await prisma.user.findUnique({
      where: { clerkid: userId },
    });

    // Check if the channel already exists
    let channel = await prisma.channel.findUnique({
      where: { channelId: realId },
    });

    if (!channel) {
      // If the channel doesn't exist, create it
      channel = await prisma.channel.create({ data: { channelId: realId } });
    }

    // Check if the subscription already exists
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: user!.id,
        channelId: channel.id,
      },
    });

    if (existingSubscription) {
      return NextResponse.json({ error: 'Subscription already exists' }, { status: 400 });
    }

    // Create the subscription
    const subscription = await prisma.subscription.create({
      data: {
        userId: user!.id,
        channelId: channel.id,
      },
    });

    return NextResponse.json({ message: 'Channel subscribed successfully', subscription });
  } catch (error) {
    console.error('Failed to add channel:', error);
    return NextResponse.json({ error: 'Failed to add channel' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
export async function DELETE(
  req: NextRequest,
 
) {
  const { userId } = getAuth(req);
  const { channelId } = await req.json();



  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }


  try {

    if (!channelId) {
      return NextResponse.json({ error: 'Channel ID is required' }, { status: 400 });
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { clerkid: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

   

 
    await prisma.subscription.deleteMany({
      where: {
        userId: user.id,
        channelId: channelId,
      },
    });

    const remainingSubscriptions = await prisma.subscription.count({
      where: { channelId: channelId },
    });

    if (remainingSubscriptions === 0) {
      await prisma.channel.delete({
        where: { id: channelId },
      });
    }

    return NextResponse.json({ message: 'Channel unsubscribed successfully' });
  } catch (error) {
    console.error('Error deleting channel subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}