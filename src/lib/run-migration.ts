import { sql } from './db';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'src', 'lib', 'migrations.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split the migration file into individual statements
    const statements = migrationSQL
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0);

    // Execute each statement
    for (const statement of statements) {
      await sql.unsafe(statement);
      console.log('Executed:', statement.slice(0, 50) + '...');
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the migration
runMigration(); 