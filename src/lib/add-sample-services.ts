import { sql } from './db';

export async function addSampleServices() {
  const sampleServices = [
    {
      title: 'Residential Construction',
      description: 'Complete residential construction services including custom homes, renovations, and additions. We handle everything from foundation to finishing touches.',
      icon: 'home',
      features: [
        'Custom home building',
        'Kitchen and bathroom renovations',
        'Room additions and expansions',
        'Foundation and structural work',
        'Interior and exterior finishing'
      ],
      orderIndex: 1,
      isFeatured: true
    },
    {
      title: 'Commercial Construction',
      description: 'Professional commercial construction services for offices, retail spaces, and industrial facilities. We deliver projects on time and within budget.',
      icon: 'building-office',
      features: [
        'Office buildings and complexes',
        'Retail spaces and storefronts',
        'Industrial facilities',
        'Restaurant and hospitality',
        'Healthcare facilities'
      ],
      orderIndex: 2,
      isFeatured: true
    },
    {
      title: 'Project Management',
      description: 'Comprehensive project management services ensuring your construction project runs smoothly from start to finish with expert oversight.',
      icon: 'clipboard-document-list',
      features: [
        'Project planning and scheduling',
        'Budget management and cost control',
        'Quality assurance and inspections',
        'Permit and regulatory compliance',
        'Stakeholder communication'
      ],
      orderIndex: 3,
      isFeatured: true
    }
  ];

  for (const service of sampleServices) {
    try {
      await sql`
        INSERT INTO services (
          title,
          description,
          icon,
          features,
          order_index,
          is_featured
        ) VALUES (
          ${service.title},
          ${service.description},
          ${service.icon},
          ${JSON.stringify(service.features)},
          ${service.orderIndex},
          ${service.isFeatured}
        )
        ON CONFLICT (title) DO NOTHING
      `;
      console.log(`Added service: ${service.title}`);
    } catch (error) {
      console.error(`Error adding service ${service.title}:`, error);
    }
  }
  
  console.log('Sample services added successfully!');
}

// Run if this file is executed directly
if (require.main === module) {
  addSampleServices()
    .then(() => {
      console.log('Sample services script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error running sample services script:', error);
      process.exit(1);
    });
} 