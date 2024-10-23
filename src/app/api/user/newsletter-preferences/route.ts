import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getAuth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { userId, } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Find or create the User to prevent 404 errors
    const user = await prisma.user.findUnique({
      where: { clerkid: userId },
    });


   

    return NextResponse.json({
      frequency: user!.newsletterFrequency,
      weeklyDays: user!.weeklyNewsletterDays
    });
  } catch (error) {
    console.error('Error fetching newsletter preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { frequency, weeklyDays } = await req.json();

    if (!['daily', 'weekly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    if (frequency === 'weekly' && (!Array.isArray(weeklyDays) || weeklyDays.some(day => !Number.isInteger(day) || day < 0 || day > 6))) {
      return NextResponse.json({ error: 'Invalid weekly days' }, { status: 400 });
    }

    // Find or create user, then update preferences
    let user = await prisma.user.findUnique({
      where: { clerkid: userId },
    });

  
      user = await prisma.user.update({
        where: { clerkid: userId },
        data: {
          newsletterFrequency: frequency,
          weeklyNewsletterDays: frequency === 'weekly' ? weeklyDays : [],
        },
      });
    

    return NextResponse.json({
      frequency: user.newsletterFrequency,
      weeklyDays: user.weeklyNewsletterDays
    });
  } catch (error) {
    console.error('Error updating newsletter preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}