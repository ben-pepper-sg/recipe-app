#!/usr/bin/env node

const { sql } = require('@vercel/postgres');

async function clearUsers() {
  try {
    console.log('Deleting all users...');
    
    const result = await sql`DELETE FROM users;`;
    
    console.log(`✅ Deleted ${result.rowCount} users`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error deleting users:', error);
    process.exit(1);
  }
}

clearUsers();
