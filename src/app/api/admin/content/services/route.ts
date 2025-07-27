import { NextRequest, NextResponse } from 'next/server';
import { auth } from '../../../../../../auth';
import { getPageContent, updatePageContent } from '@/lib/db-storage';
import { sql } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    let content = await getPageContent('services');
    
    // If services page doesn't exist, create it
    if (!content) {
      const defaultContent = {
        title: 'Our Services',
        content: '<p>We offer comprehensive construction services including residential and commercial projects. Our team of experienced professionals is dedicated to delivering high-quality results that exceed your expectations.</p><p>From initial planning to final completion, we handle every aspect of your construction project with precision and care. Our commitment to quality craftsmanship and attention to detail ensures that your vision becomes reality.</p>'
      };
      
      await sql`
        INSERT INTO pages (id, title, content, last_updated)
        VALUES ('services', ${defaultContent.title}, ${defaultContent.content}, CURRENT_TIMESTAMP)
        ON CONFLICT (id) DO NOTHING
      `;
      
      content = await getPageContent('services');
    }
    
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching services content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services content' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { title, content } = await request.json();
    if (!content) {
      return new NextResponse('Content is required', { status: 400 });
    }
    
    const updatedContent = await updatePageContent('services', { title, content });
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating services content:', error);
    return NextResponse.json(
      { error: 'Failed to update services content' },
      { status: 500 }
    );
  }
} 