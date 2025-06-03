import { neon } from '@neondatabase/serverless';

// Get the connection string from the environment variable
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in environment variables');
}

export const sql = neon(connectionString); 