import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

async function main() {
  // Create connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: true
  });

  try {
    const db = drizzle(pool);
    
    console.log('Running migrations...');
    await migrate(db, {
      migrationsFolder: './drizzle'
    });
    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Migration failed:');
    console.error(error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();

// npx drizzle-kit generate
// npx drizzle-kit migrate
// npx drizzle-kit push
// npx drizzle-kit studio
