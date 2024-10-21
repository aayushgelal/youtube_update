import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getLatestUnprocessedVideoId } from '@/app/lib/youtube';
import { getTranscript } from '@/app/lib/transcript';
import { generateSummaryAndLearnings } from '@/app/lib/gemini';
import { sendEmail } from '@/app/lib/email';
import { google } from 'googleapis';
import { htmlContent } from '@/app/lib/html';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)

    const users = await prisma.user.findMany({
      where: {
        OR: [
          { newsletterFrequency: 'daily' },
          { newsletterFrequency: 'weekly', AND: { 
            weeklyNewsletterDays: { has: dayOfWeek }
           }
          }
        ]
      },
      include: {
        subscriptions: {
          include: {
            channel: true
          }
        }
      }
    });

    const results = []; // To store the results from each user processing

    // Processing all users' newsletters
    for (const user of users) {
      const result = await processUserNewsletter(user);
      results.push(result); // Store result for this user
    }

    // Now, after everything has processed, return the results
    return NextResponse.json({ message: 'All newsletters processed successfully', details: results });

  } catch (error) {
    console.error('Cron job failed:', error);
    return NextResponse.json({ error: 'Cron job failed' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

async function processUserNewsletter(user: any) {
  const shuffledSubscriptions = user.subscriptions.sort(() => 0.5 - Math.random());
  let newsletterSent = false;
  let processedInfo = { email: user.email, sent: false, videoId: '', channelId: null,transcript:'',newsletter:'' }; // Store details of the process

  for (const subscription of shuffledSubscriptions) {
    try {
      const videoId = await getLatestUnprocessedVideoId(subscription.channel.channelId, prisma);
      
      // Update processedInfo to reflect what was sent
   

      if (!videoId) {
        console.log(`No new videos for channel: ${subscription.channel.channelId}`);
        continue;
      }

      // // Check if this video has already been sent to the user
      // const alreadySent = await prisma.sentTranscript.findFirst({
      //   where: {
      //     userId: user.id,
      //     video: {
      //       videoId: videoId
      //     }
      //   }
      // });

      // if (alreadySent) {
      //   console.log(`Video ${videoId} has already been sent to user ${user.email}. Skipping.`);
      //   continue;
      // }

      const transcript = (await getTranscript(videoId)).substring(0, 300);
      const videoDetails = await getVideoDetails(videoId);
      const newsletter = await generateSummaryAndLearnings(transcript, videoDetails);
      const html = htmlContent(videoDetails, newsletter, videoId);

      await sendEmail(
        user.email,
        `${user.newsletterFrequency.charAt(0).toUpperCase() + user.newsletterFrequency.slice(1)} Digest: ${videoDetails.channelTitle} : ${videoDetails.title}`,
        html
      );
      processedInfo = {
        email: user.email,
        sent: true,
        videoId: videoId?videoId:"",
        transcript:transcript,
        newsletter:newsletter,
        channelId: subscription.channel.channelId
      };

      // Create or get the video record
      const video = await prisma.video.upsert({
        where: { videoId },
        update: {},
        create: { 
          videoId, 
          channel: { connect: { id: subscription.channel.id } }
        }
      });

      // Create the sentTranscript record
      await prisma.sentTranscript.create({
        data: { 
          user: { connect: { id: user.id } },
          video: { connect: { id: video.id } }
        }
      });

      console.log(`Processed video ${videoId} for channel: ${subscription.channel.channelId} and sent newsletter to user: ${user.email}`);

      newsletterSent = true;
      break; // Exit the subscription loop after processing one video for this user
    } catch (error) {
      console.error(`Error processing channel ${subscription.channel.channelId} for user ${user.email}:`, error);
    }
  }

  if (!newsletterSent) {
    console.log(`No new newsletters available for user: ${user.email}`);
  }

  return processedInfo; // Return what was processed for this user
}

async function getVideoDetails(videoId: string) {
  const youtube = google.youtube({ version: 'v3', auth: process.env.YOUTUBE_API_KEY });
  const response = await youtube.videos.list({
    part: ['snippet'],
    id: [videoId],
  });

  if (response.data.items && response.data.items.length > 0) {
    const videoDetails = response.data.items[0].snippet;
    return {
      title: videoDetails?.title,
      channelTitle: videoDetails?.channelTitle,
      publishedAt: videoDetails?.publishedAt,
      thumbnailLink: videoDetails?.thumbnails?.standard?.url,
    };
  }

  throw new Error('Video details not found');
}
