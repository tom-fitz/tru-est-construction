#!/usr/bin/env tsx

import { sql } from './db';
import { readFileSync } from 'fs';
import { join } from 'path';

async function runMigration() {
  try {
    console.log('Running migration: Add contact_submissions table...');
    
    const migrationSQL = readFileSync(
      join(__dirname, 'migrations', '004_add_contact_submissions.sql'),
      'utf-8'
    );
    
    // Execute the migration
    await sql.unsafe(migrationSQL);
    
    console.log('✓ Migration completed successfully!');
    console.log('  - Created contact_submissions table');
    console.log('  - Added indexes for performance');
    console.log('\nYou can now:');
    console.log('  - Submit contact forms from /contact page');
    console.log('  - View submissions at /admin/contact-submissions');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

runMigration();

