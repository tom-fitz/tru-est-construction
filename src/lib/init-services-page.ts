import { sql } from './db';

/**
 * Initialize the services page content if it doesn't exist
 * Run this script with: npx tsx src/lib/init-services-page.ts
 */
async function initServicesPage() {
  try {
    console.log('Checking services page content...');
    
    // Check if services page exists
    const existingPage = await sql`
      SELECT id, title, content FROM pages WHERE id = 'services'
    `;

    if (existingPage.length === 0) {
      console.log('Services page not found. Creating...');
      
      await sql`
        INSERT INTO pages (id, title, content, last_updated)
        VALUES (
          'services',
          'Our Services',
          '<p>We offer comprehensive construction services including residential and commercial projects. Our team of experienced professionals is dedicated to delivering high-quality results that exceed your expectations.</p><p>From initial planning to final completion, we handle every aspect of your construction project with precision and care. Our commitment to quality craftsmanship and attention to detail ensures that your vision becomes reality.</p>',
          CURRENT_TIMESTAMP
        )
      `;
      
      console.log('✅ Services page created successfully!');
    } else {
      console.log('✅ Services page already exists');
      console.log('Current content:', existingPage[0].content);
      
      // Check if content is empty
      if (!existingPage[0].content || existingPage[0].content.trim() === '') {
        console.log('Content is empty. Updating with default content...');
        
        await sql`
          UPDATE pages
          SET content = '<p>We offer comprehensive construction services including residential and commercial projects. Our team of experienced professionals is dedicated to delivering high-quality results that exceed your expectations.</p><p>From initial planning to final completion, we handle every aspect of your construction project with precision and care. Our commitment to quality craftsmanship and attention to detail ensures that your vision becomes reality.</p>',
              last_updated = CURRENT_TIMESTAMP
          WHERE id = 'services'
        `;
        
        console.log('✅ Services page content updated!');
      }
    }

    console.log('\n📝 To edit the services page content:');
    console.log('   Visit: /admin/content');
    console.log('   Select "Our Services" page');
    
  } catch (error) {
    console.error('❌ Error initializing services page:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initServicesPage()
    .then(() => {
      console.log('\n✅ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export { initServicesPage };

