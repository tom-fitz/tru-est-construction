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

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  orderIndex: number;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  projectType: string;
  imagePath: string;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CalloutItem {
  title: string;
  description: string;
}

export interface Callout {
  id: number;
  pageId: string;
  title: string;
  items: CalloutItem[];
  createdAt: Date;
  updatedAt: Date;
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

// Service Operations
export async function getServices(): Promise<Service[]> {
  const result = await sql`
    SELECT 
      id, 
      title, 
      description, 
      icon, 
      features, 
      order_index as "orderIndex",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM services 
    ORDER BY order_index ASC
  `;
  return result as Service[];
}

export async function getFeaturedServices(): Promise<Service[]> {
  const result = await sql`
    SELECT 
      id, 
      title, 
      description, 
      icon, 
      features, 
      order_index as "orderIndex",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM services 
    WHERE is_featured = true
    ORDER BY order_index ASC
  `;
  return result as Service[];
}

export async function getService(id: number): Promise<Service | null> {
  const result = await sql`
    SELECT 
      id, 
      title, 
      description, 
      icon, 
      features, 
      order_index as "orderIndex",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM services 
    WHERE id = ${id}
  `;
  return (result[0] as Service) || null;
}

export async function createService(data: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>): Promise<Service> {
  const query = sql`
    INSERT INTO services (
      title,
      description,
      icon,
      features,
      order_index,
      is_featured
    ) VALUES (
      ${data.title},
      ${data.description},
      ${data.icon || ''},
      ${JSON.stringify(data.features)},
      ${data.orderIndex},
      ${data.isFeatured}
    )
    RETURNING 
      id, 
      title, 
      description, 
      icon, 
      features, 
      order_index as "orderIndex",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  const result = await query;
  return result[0] as Service;
}

export async function updateService(
  id: number,
  data: Partial<Omit<Service, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Service | null> {
  const updates = [];
  
  if (data.title !== undefined) {
    updates.push(sql`title = ${data.title}`);
  }
  if (data.description !== undefined) {
    updates.push(sql`description = ${data.description}`);
  }
  if (data.icon !== undefined) {
    updates.push(sql`icon = ${data.icon}`);
  }
  if (data.features !== undefined) {
    updates.push(sql`features = ${JSON.stringify(data.features)}`);
  }
  if (data.orderIndex !== undefined) {
    updates.push(sql`order_index = ${data.orderIndex}`);
  }
  if (data.isFeatured !== undefined) {
    updates.push(sql`is_featured = ${data.isFeatured}`);
  }

  if (updates.length === 0) return null;

  // Combine all updates with commas
  const updateClause = updates.reduce((acc, curr, idx) => 
    idx === 0 ? curr : sql`${acc}, ${curr}`
  );

  const query = sql`
    UPDATE services
    SET ${updateClause}
    WHERE id = ${id}
    RETURNING 
      id, 
      title, 
      description, 
      icon, 
      features, 
      order_index as "orderIndex",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  const result = await query;
  return (result[0] as Service) || null;
}

export async function deleteService(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM services 
    WHERE id = ${id} 
    RETURNING id
  `;
  return result.length > 0;
}

export async function toggleServiceFeatured(id: number, isFeatured: boolean): Promise<Service | null> {
  const result = await sql`
    UPDATE services
    SET is_featured = ${isFeatured}
    WHERE id = ${id}
    RETURNING 
      id, 
      title, 
      description, 
      icon, 
      features, 
      order_index as "orderIndex",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  return (result[0] as Service) || null;
}

// Testimonial Operations
export async function getTestimonials(): Promise<Testimonial[]> {
  const result = await sql`
    SELECT 
      id,
      name,
      role,
      quote,
      rating,
      project_type as "projectType",
      image_path as "imagePath",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM testimonials 
    ORDER BY created_at DESC
  `;
  return result as Testimonial[];
}

export async function getFeaturedTestimonials(): Promise<Testimonial[]> {
  const result = await sql`
    SELECT 
      id,
      name,
      role,
      quote,
      rating,
      project_type as "projectType",
      image_path as "imagePath",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM testimonials 
    WHERE is_featured = true
    ORDER BY created_at DESC
  `;
  return result as Testimonial[];
}

export async function getTestimonial(id: number): Promise<Testimonial | null> {
  const result = await sql`
    SELECT 
      id,
      name,
      role,
      quote,
      rating,
      project_type as "projectType",
      image_path as "imagePath",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM testimonials 
    WHERE id = ${id}
  `;
  return (result[0] as Testimonial) || null;
}

export async function createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> {
  const query = sql`
    INSERT INTO testimonials (
      name,
      role,
      quote,
      rating,
      project_type,
      image_path,
      is_featured
    ) VALUES (
      ${data.name},
      ${data.role},
      ${data.quote},
      ${data.rating},
      ${data.projectType},
      ${data.imagePath || ''},
      ${data.isFeatured}
    )
    RETURNING 
      id,
      name,
      role,
      quote,
      rating,
      project_type as "projectType",
      image_path as "imagePath",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  const result = await query;
  return result[0] as Testimonial;
}

export async function updateTestimonial(
  id: number,
  data: Partial<Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Testimonial | null> {
  const updates = [];
  
  if (data.name !== undefined) {
    updates.push(sql`name = ${data.name}`);
  }
  if (data.role !== undefined) {
    updates.push(sql`role = ${data.role}`);
  }
  if (data.quote !== undefined) {
    updates.push(sql`quote = ${data.quote}`);
  }
  if (data.rating !== undefined) {
    updates.push(sql`rating = ${data.rating}`);
  }
  if (data.projectType !== undefined) {
    updates.push(sql`project_type = ${data.projectType}`);
  }
  if (data.imagePath !== undefined) {
    updates.push(sql`image_path = ${data.imagePath}`);
  }
  if (data.isFeatured !== undefined) {
    updates.push(sql`is_featured = ${data.isFeatured}`);
  }

  if (updates.length === 0) return null;

  // Combine all updates with commas
  const updateClause = updates.reduce((acc, curr, idx) => 
    idx === 0 ? curr : sql`${acc}, ${curr}`
  );

  const query = sql`
    UPDATE testimonials
    SET ${updateClause}
    WHERE id = ${id}
    RETURNING 
      id,
      name,
      role,
      quote,
      rating,
      project_type as "projectType",
      image_path as "imagePath",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;

  const result = await query;
  return (result[0] as Testimonial) || null;
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM testimonials 
    WHERE id = ${id} 
    RETURNING id
  `;
  return result.length > 0;
}

export async function toggleTestimonialFeatured(id: number, isFeatured: boolean): Promise<Testimonial | null> {
  const result = await sql`
    UPDATE testimonials
    SET is_featured = ${isFeatured}
    WHERE id = ${id}
    RETURNING 
      id,
      name,
      role,
      quote,
      rating,
      project_type as "projectType",
      image_path as "imagePath",
      is_featured as "isFeatured",
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  return (result[0] as Testimonial) || null;
}

// Callout Operations
export async function getCallout(pageId: string): Promise<Callout | null> {
  const result = await sql`
    SELECT 
      id,
      page_id as "pageId",
      title,
      items,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM callouts 
    WHERE page_id = ${pageId}
  `;
  return (result[0] as Callout) || null;
}

export async function updateCallout(
  pageId: string,
  data: Pick<Callout, 'title' | 'items'>
): Promise<Callout | null> {
  const result = await sql`
    UPDATE callouts
    SET 
      title = ${data.title},
      items = ${JSON.stringify(data.items)},
      updated_at = CURRENT_TIMESTAMP
    WHERE page_id = ${pageId}
    RETURNING 
      id,
      page_id as "pageId",
      title,
      items,
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  return (result[0] as Callout) || null;
} 