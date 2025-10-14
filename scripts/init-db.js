#!/usr/bin/env node

const { drizzle } = require('drizzle-orm/vercel-postgres');
const { sql: vercelSql } = require('@vercel/postgres');
const { migrate } = require('drizzle-orm/vercel-postgres/migrator');

async function initDatabase() {
  try {
    console.log('Creating database tables...');
    
    // Create users table
    await vercelSql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    // Create recipes table
    await vercelSql`
      CREATE TABLE IF NOT EXISTS recipes (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        ingredients_text TEXT,
        instructions_text TEXT NOT NULL,
        created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `;
    
    console.log('✅ Database tables created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  }
}

initDatabase();
