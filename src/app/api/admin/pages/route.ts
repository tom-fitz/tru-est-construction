import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { getPageContent, getAllPageContent, updatePageContent } from '@/lib/db-storage';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const page = await getPageContent(id);
      if (!page) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }
      return NextResponse.json(page);
    } else {
      const pages = await getAllPageContent();
      return NextResponse.json(pages);
    }
  } catch (error) {
    console.error('Error fetching page content:', error);
    return NextResponse.json({ error: 'Failed to fetch page content' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Page ID is required' }, { status: 400 });
    }

    const data = await request.json();
    const updatedPage = await updatePageContent(id, {
      title: data.title,
      content: data.content,
    });

    if (!updatedPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(updatedPage);
  } catch (error) {
    console.error('Error updating page content:', error);
    return NextResponse.json({ error: 'Failed to update page content' }, { status: 500 });
  }
} 