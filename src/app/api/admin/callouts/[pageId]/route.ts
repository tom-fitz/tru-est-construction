import { NextRequest, NextResponse } from 'next/server';
import { getCallout, updateCallout } from '@/lib/db-storage';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const pageId = request.nextUrl.searchParams.get('pageId');
    if (!pageId) {
      return new NextResponse('Missing pageId', { status: 400 });
    }
    const callout = await getCallout(pageId);
    if (!callout) {
      return new NextResponse('Callout not found', { status: 404 });
    }
    return NextResponse.json(callout);
  } catch (error) {
    console.error('Error fetching callout:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const pageId = request.nextUrl.searchParams.get('pageId');
    if (!pageId) {
      return new NextResponse('Missing pageId', { status: 400 });
    }
    const data = await request.json();
    const updatedCallout = await updateCallout(pageId, data);
    if (!updatedCallout) {
      return new NextResponse('Callout not found', { status: 404 });
    }
    return NextResponse.json(updatedCallout);
  } catch (error) {
    console.error('Error updating callout:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 