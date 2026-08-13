const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to DB.');
    
    // Check if column already exists
    const res = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='products' AND column_name='seo_keywords';
    `);

    if (res.rows.length === 0) {
      console.log('Adding seo_keywords column to products table...');
      await client.query('ALTER TABLE products ADD COLUMN seo_keywords TEXT;');
      console.log('seo_keywords column added successfully.');
    } else {
      console.log('seo_keywords column already exists.');
    }
  } catch (err) {
    console.error('Error executing query:', err);
  } finally {
    await client.end();
  }
}

run();
