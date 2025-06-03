import { sql } from './db';

export type PageContent = {
  id: string;
  title: string;
  content: string;
  lastUpdated: string;
};

export type BlogPost = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  slug: string;
  published: boolean;
};

// Page Content Operations
export async function getPageContent(pageId: string): Promise<PageContent | null> {
  const result = await sql`SELECT * FROM pages WHERE id = ${pageId}`;
  if (!result[0]) return null;
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    lastUpdated: row.last_updated?.toISOString?.() || row.last_updated || '',
  };
}

export async function getAllPageContent(): Promise<Record<string, PageContent>> {
  const result = await sql`SELECT * FROM pages`;
  const pages: Record<string, PageContent> = {};
  for (const row of result) {
    pages[row.id] = {
      id: row.id,
      title: row.title,
      content: row.content,
      lastUpdated: row.last_updated?.toISOString?.() || row.last_updated || '',
    };
  }
  return pages;
}

export async function updatePageContent(pageId: string, data: { title: string; content: string }): Promise<PageContent | null> {
  const result = await sql`
    UPDATE pages 
    SET title = ${data.title}, 
        content = ${data.content}, 
        last_updated = CURRENT_TIMESTAMP
    WHERE id = ${pageId}
    RETURNING *
  `;
  
  if (!result[0]) return null;
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    lastUpdated: row.last_updated?.toISOString?.() || row.last_updated || '',
  };
}

// Blog Post Operations
export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await sql`SELECT * FROM blog_posts ORDER BY date DESC`;
  return result.map((row: any) => ({
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    slug: row.slug,
    published: row.published,
  }));
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
    published: row.published,
  };
}

export async function getBlogPostById(id: number): Promise<BlogPost | undefined> {
  const result = await sql`SELECT * FROM blog_posts WHERE id = ${id}`;
  const row = result[0];
  if (!row) return undefined;
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    slug: row.slug,
    published: row.published,
  };
}

export async function createBlogPost(data: Omit<BlogPost, 'id'>): Promise<BlogPost> {
  const result = await sql`
    INSERT INTO blog_posts (title, slug, excerpt, content, date, published)
    VALUES (${data.title}, ${data.slug}, ${data.excerpt}, ${data.content}, ${data.date}, ${data.published})
    RETURNING *
  `;
  
  const row = result[0];
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    slug: row.slug,
    published: row.published,
  };
}

export async function updateBlogPost(id: number, data: Partial<Omit<BlogPost, 'id'>>): Promise<BlogPost | undefined> {
  // Build the update query using SQL template literals
  const updateParts = [];
  
  if (data.title !== undefined) {
    updateParts.push(sql`title = ${data.title}`);
  }
  if (data.slug !== undefined) {
    updateParts.push(sql`slug = ${data.slug}`);
  }
  if (data.excerpt !== undefined) {
    updateParts.push(sql`excerpt = ${data.excerpt}`);
  }
  if (data.content !== undefined) {
    updateParts.push(sql`content = ${data.content}`);
  }
  if (data.date !== undefined) {
    updateParts.push(sql`date = ${data.date}`);
  }
  if (data.published !== undefined) {
    updateParts.push(sql`published = ${data.published}`);
  }
  
  if (updateParts.length === 0) return undefined;
  
  // Add updated_at timestamp
  updateParts.push(sql`updated_at = CURRENT_TIMESTAMP`);
  
  // Combine all update parts with commas
  const updateClause = updateParts.reduce((acc, part, index) => {
    if (index === 0) return part;
    return sql`${acc}, ${part}`;
  });
  
  const result = await sql`
    UPDATE blog_posts 
    SET ${updateClause}
    WHERE id = ${id}
    RETURNING *
  `;
  
  const row = result[0];
  if (!row) return undefined;
  
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    slug: row.slug,
    published: row.published,
  };
}

export async function deleteBlogPost(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM blog_posts 
    WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

export async function toggleBlogPostPublish(id: number, published: boolean): Promise<BlogPost | undefined> {
  const result = await sql`
    UPDATE blog_posts 
    SET published = ${published},
        updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  
  const row = result[0];
  if (!row) return undefined;
  
  return {
    id: row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: row.content,
    date: row.date,
    slug: row.slug,
    published: row.published,
  };
} 