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

-- Create callouts table
CREATE TABLE IF NOT EXISTS callouts (
    id SERIAL PRIMARY KEY,
    page_id VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    items JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date);
CREATE INDEX IF NOT EXISTS idx_callouts_page_id ON callouts(page_id);

-- Insert default pages if they don't exist
INSERT INTO pages (id, title, content, last_updated)
VALUES 
    ('home', 'Home', '<p>Welcome to Tru-Est Construction</p>', CURRENT_TIMESTAMP),
    ('about', 'About Us', '<p>Learn more about Tru-Est Construction</p>', CURRENT_TIMESTAMP),
    ('services', 'Our Services', '<p>We offer comprehensive construction services including residential and commercial projects. Our team of experienced professionals is dedicated to delivering high-quality results that exceed your expectations.</p><p>From initial planning to final completion, we handle every aspect of your construction project with precision and care. Our commitment to quality craftsmanship and attention to detail ensures that your vision becomes reality.</p>', CURRENT_TIMESTAMP),
    ('contact', 'Contact Us', '<p>Get in touch with Tru-Est Construction</p>', CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Insert default callouts if they don't exist
INSERT INTO callouts (page_id, title, items)
VALUES 
    ('about', 'Our Values', '[
        {
            "title": "Quality",
            "description": "We are committed to delivering the highest quality in every project, using premium materials and expert craftsmanship to ensure lasting results."
        },
        {
            "title": "Integrity",
            "description": "We operate with complete transparency and honesty, building trust through clear communication and ethical business practices."
        },
        {
            "title": "Innovation",
            "description": "We embrace modern construction techniques and technologies while maintaining traditional values of quality and craftsmanship."
        }
    ]'::jsonb),
    ('services', 'Why Choose Our Services', '[
        {
            "title": "Quality Craftsmanship",
            "description": "We take pride in delivering exceptional quality in every project, using the finest materials and skilled craftsmanship to ensure lasting results."
        },
        {
            "title": "Expert Team",
            "description": "Our experienced team of professionals brings decades of combined expertise to every project, ensuring the highest standards of workmanship."
        },
        {
            "title": "Customer Focus",
            "description": "We prioritize your needs and vision, working closely with you throughout the project to ensure complete satisfaction with the results."
        }
    ]'::jsonb)
ON CONFLICT (page_id) DO NOTHING; 