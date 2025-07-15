import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const issues = await prisma.issue.findMany({ orderBy: { timestamp: 'desc' } });
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
