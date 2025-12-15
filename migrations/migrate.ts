import { createPool } from 'mysql2/promise';
import { readFileSync } from 'fs';
import { join } from 'path';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: join(__dirname, '..', '.env.local') });

async function migrate() {
  const pool = createPool({
    uri: process.env.DATABASE_URL!,
    ssl: {
      minVersion: 'TLSv1.2',
    }
  });

  try {
    console.log('Running migration: 001_create_todos_table.sql');

    const sql = readFileSync(join(__dirname, '001_create_todos_table.sql'), 'utf-8');
    await pool.query(sql);

    console.log('✓ Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
