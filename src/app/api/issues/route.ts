import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const today = url.searchParams.get('today');
    let issues;
    if (today === 'true') {
      // Get current date in YYYY-MM-DD
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const dd = String(now.getDate()).padStart(2, '0');
      const startOfDay = new Date(`${yyyy}-${mm}-${dd}T00:00:00.000Z`);
      const endOfDay = new Date(`${yyyy}-${mm}-${dd}T23:59:59.999Z`);
      issues = await prisma.issue.findMany({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } else {
      issues = await prisma.issue.findMany({ orderBy: { createdAt: 'desc' } });
    }
    return NextResponse.json({ issues });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch issues', details: error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const issue = await prisma.issue.create({ data });
    return NextResponse.json({ issue });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create issue', details: error }, { status: 500 });
  }
}
