-- Create pages table
CREATE TABLE IF NOT EXISTS pages (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    date VARCHAR(50) NOT NULL,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date);

-- Insert default pages if they don't exist
INSERT INTO pages (id, title, content, last_updated)
VALUES 
    ('home', 'Home', '<p>Welcome to Tru-Est Construction</p>', CURRENT_TIMESTAMP),
    ('about', 'About Us', '<p>Learn more about Tru-Est Construction</p>', CURRENT_TIMESTAMP),
    ('contact', 'Contact Us', '<p>Get in touch with Tru-Est Construction</p>', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING; 