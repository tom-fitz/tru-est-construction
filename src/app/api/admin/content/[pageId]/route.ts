/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import { getPageContent, updatePageContent } from '@/lib/db-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const content = await getPageContent(params.pageId);
    if (!content) {
      return new NextResponse('Content not found', { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching page content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: any }
) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { title, content } = await request.json();
    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }
    
    const updatedContent = await updatePageContent(params.pageId, { title, content });
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating page content:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 