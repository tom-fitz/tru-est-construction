import { sql } from './db';

export interface PageContent {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  date: string;
  published: boolean;
}

// Page Content Operations
export async function getPageContent(id: string): Promise<PageContent | null> {
  const result = await sql`
    SELECT id, title, content, last_updated as "lastUpdated"
    FROM pages WHERE id = ${id}
  `;
  return (result[0] as PageContent) || null;
}

export async function getAllPageContent(): Promise<Record<string, PageContent>> {
  const result = await sql`
    SELECT id, title, content, last_updated as "lastUpdated"
    FROM pages
  `;
  return (result as PageContent[]).reduce((acc, page) => {
    acc[page.id] = page;
    return acc;
  }, {} as Record<string, PageContent>);
}

export async function updatePageContent(
  id: string,
  data: Pick<PageContent, 'title' | 'content'>
): Promise<PageContent | null> {
  const result = await sql`
    UPDATE pages
    SET title = ${data.title}, content = ${data.content}, last_updated = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, title, content, last_updated as "lastUpdated"
  `;
  return (result[0] as PageContent) || null;
}

// Blog Post Operations
export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await sql`
    SELECT 
      id, title, slug, excerpt, content, date, published
    FROM blog_posts 
    ORDER BY date DESC
  `;
  return result as BlogPost[];
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  const result = await sql`SELECT * FROM blog_posts WHERE slug = ${slug}`;
  const row = result[0];
  if (!row) return undefined;
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    slug: row.slug,
    published: row.published
  };
}

export async function getBlogPostById(id: number): Promise<BlogPost | null> {
  const result = await sql`
    SELECT 
      id, title, slug, excerpt, content, date, published
    FROM blog_posts 
    WHERE id = ${id}
  `;
  return (result[0] as BlogPost) || null;
}

export async function createBlogPost(data: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const result = await sql`
    INSERT INTO blog_posts (title, slug, excerpt, content, date, published)
    VALUES (${data.title}, ${data.slug}, ${data.excerpt}, ${data.content}, ${data.date}, ${data.published})
    RETURNING 
      id, title, slug, excerpt, content, date, published
  `;
  return result[0] as BlogPost;
}

export async function updateBlogPost(
  id: number,
  data: Omit<BlogPost, 'id'>
): Promise<BlogPost | null> {
  const result = await sql`
    UPDATE blog_posts
    SET 
      title = ${data.title},
      slug = ${data.slug},
      excerpt = ${data.excerpt},
      content = ${data.content},
      date = ${data.date},
      published = ${data.published}
    WHERE id = ${id}
    RETURNING 
      id, title, slug, excerpt, content, date, published
  `;
  return (result[0] as BlogPost) || null;
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM blog_posts 
    WHERE id = ${id} 
    RETURNING id
  `;
  return result.length > 0;
}

export async function toggleBlogPostPublish(id: number, published: boolean): Promise<BlogPost | null> {
  const result = await sql`
    UPDATE blog_posts
    SET 
      published = ${published}
    WHERE id = ${id}
    RETURNING 
      id, title, slug, excerpt, content, date, published
  `;
  return (result[0] as BlogPost) || null;
} 