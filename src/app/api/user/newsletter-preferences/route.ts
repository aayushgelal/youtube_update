import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { clerkid: userId },
      select: { newsletterFrequency: true, weeklyNewsletterDays: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      frequency: user.newsletterFrequency,
      weeklyDays: user.weeklyNewsletterDays
    });
  } catch (error) {
    console.error('Error fetching newsletter preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { frequency, weeklyDays } = await request.json();

    if (!['daily', 'weekly'].includes(frequency)) {
      return NextResponse.json({ error: 'Invalid frequency' }, { status: 400 });
    }

    if (frequency === 'weekly' && (!Array.isArray(weeklyDays) || weeklyDays.some(day => !Number.isInteger(day) || day < 0 || day > 6))) {
      return NextResponse.json({ error: 'Invalid weekly days' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { clerkid: userId },
      data: { 
        newsletterFrequency: frequency,
        weeklyNewsletterDays: frequency === 'weekly' ? weeklyDays : []
      },
    });

    return NextResponse.json({
      frequency: user.newsletterFrequency,
      weeklyDays: user.weeklyNewsletterDays
    });
  } catch (error) {
    console.error('Error updating newsletter preferences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}