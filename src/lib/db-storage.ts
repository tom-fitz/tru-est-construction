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

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
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
  // Use UPSERT to create page if it doesn't exist
  const result = await sql`
    INSERT INTO pages (id, title, content, last_updated)
    VALUES (${id}, ${data.title}, ${data.content}, CURRENT_TIMESTAMP)
    ON CONFLICT (id) 
    DO UPDATE SET 
      title = ${data.title}, 
      content = ${data.content}, 
      last_updated = CURRENT_TIMESTAMP
    RETURNING id, title, content, last_updated as "lastUpdated"
  `;
  return (result[0] as PageContent) || null;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const result = await sql`
    SELECT 
      id, title, slug, excerpt, content, date, published
    FROM blog_posts
    ORDER BY date DESC
  `;
  return result as BlogPost[];
}

// Blog Post Operations
export async function getBlogPosts(): Promise<BlogPost[]> {
  const result = await sql`
    SELECT 
      id, title, slug, excerpt, content, date, published
    FROM blog_posts 
    WHERE published = true
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

export async function getAllServices(): Promise<Service[]> {
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
  // First get the current service
  const current = await getService(id);
  if (!current) return null;

  // Merge current values with new data
  const title = data.title !== undefined ? data.title : current.title;
  const description = data.description !== undefined ? data.description : current.description;
  const icon = data.icon !== undefined ? data.icon : current.icon;
  const features = data.features !== undefined ? JSON.stringify(data.features) : JSON.stringify(current.features);
  const orderIndex = data.orderIndex !== undefined ? data.orderIndex : current.orderIndex;
  const isFeatured = data.isFeatured !== undefined ? data.isFeatured : current.isFeatured;

  // Update all fields
  const result = await sql`
    UPDATE services
    SET 
      title = ${title},
      description = ${description},
      icon = ${icon},
      features = ${features},
      order_index = ${orderIndex},
      is_featured = ${isFeatured},
      updated_at = CURRENT_TIMESTAMP
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
  // First get the current testimonial
  const current = await getTestimonial(id);
  if (!current) return null;

  // Merge current values with new data
  const name = data.name !== undefined ? data.name : current.name;
  const role = data.role !== undefined ? data.role : current.role;
  const quote = data.quote !== undefined ? data.quote : current.quote;
  const rating = data.rating !== undefined ? data.rating : current.rating;
  const projectType = data.projectType !== undefined ? data.projectType : current.projectType;
  const imagePath = data.imagePath !== undefined ? data.imagePath : current.imagePath;
  const isFeatured = data.isFeatured !== undefined ? data.isFeatured : current.isFeatured;

  // Update all fields
  const result = await sql`
    UPDATE testimonials
    SET 
      name = ${name},
      role = ${role},
      quote = ${quote},
      rating = ${rating},
      project_type = ${projectType},
      image_path = ${imagePath},
      is_featured = ${isFeatured},
      updated_at = CURRENT_TIMESTAMP
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

// ============================================
// Contact Submissions
// ============================================

export async function createContactSubmission(
  data: Pick<ContactSubmission, 'name' | 'email' | 'phone' | 'message'>
): Promise<ContactSubmission> {
  const result = await sql`
    INSERT INTO contact_submissions (name, email, phone, message, status)
    VALUES (${data.name}, ${data.email}, ${data.phone || null}, ${data.message}, 'new')
    RETURNING 
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  return result[0] as ContactSubmission;
}

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const result = await sql`
    SELECT 
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM contact_submissions
    ORDER BY created_at DESC
  `;
  return result as ContactSubmission[];
}

export async function getContactSubmission(id: number): Promise<ContactSubmission | null> {
  const result = await sql`
    SELECT 
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at as "createdAt",
      updated_at as "updatedAt"
    FROM contact_submissions
    WHERE id = ${id}
  `;
  return (result[0] as ContactSubmission) || null;
}

export async function updateContactSubmissionStatus(
  id: number,
  status: ContactSubmission['status']
): Promise<ContactSubmission | null> {
  const result = await sql`
    UPDATE contact_submissions
    SET 
      status = ${status},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING 
      id,
      name,
      email,
      phone,
      message,
      status,
      created_at as "createdAt",
      updated_at as "updatedAt"
  `;
  return (result[0] as ContactSubmission) || null;
}

export async function deleteContactSubmission(id: number): Promise<void> {
  await sql`DELETE FROM contact_submissions WHERE id = ${id}`;
} 