import { neon } from '@neondatabase/serverless';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
	throw new Error('DATABASE_URL must be a Neon postgres connection string');
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error('DATABASE_URL is required');
}

const provider = process.env.DB_PROVIDER ?? 'neon'; // 'neon' | 'local'

function createNeonDb() {
	const sql = neon(connectionString);
	return drizzleNeon(sql, { schema });
}

function createLocalDb() {
	const client = postgres(connectionString);
	return drizzlePostgres(client, { schema });
}

export const db = provider === 'local' ? createLocalDb() : createNeonDb();
