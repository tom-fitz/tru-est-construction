import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPageContent, updatePageContent } from '@/lib/db-storage';

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
    const content = await getPageContent(pageId);
    if (!content) {
      return new NextResponse('Content not found', { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching page content:', error);
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
    const { content } = await request.json();
    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }
    const updatedContent = await updatePageContent(pageId, content);
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating page content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 