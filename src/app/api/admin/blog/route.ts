import { NextResponse } from 'next/server';
import { auth } from '../../../../../auth';
import { 
  getBlogPosts, 
  getBlogPostById, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost, 
  toggleBlogPostPublish 
} from '@/lib/db-storage';

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const post = await getBlogPostById(parseInt(id, 10));
      if (!post) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    } else {
      const posts = await getBlogPosts();
      return NextResponse.json(posts);
    }
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const data = await request.json();
    const newPost = await createBlogPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      date: data.date,
      published: data.published,
    });
    return NextResponse.json(newPost);
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
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
    const action = searchParams.get('action');

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    if (action === 'toggle-publish') {
      const data = await request.json();
      const updatedPost = await toggleBlogPostPublish(parseInt(id, 10), data.published);
      if (!updatedPost) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(updatedPost);
    } else {
      const data = await request.json();
      const updatedPost = await updateBlogPost(parseInt(id, 10), {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        date: data.date,
        published: data.published,
      });
      if (!updatedPost) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      return NextResponse.json(updatedPost);
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Blog post ID is required' }, { status: 400 });
    }

    const success = await deleteBlogPost(parseInt(id, 10));
    if (!success) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 