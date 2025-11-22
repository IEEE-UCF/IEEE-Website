// file: src/app/db/client.ts
// import { neon } from '@neondatabase/serverless';
// //import { drizzle } from 'drizzle-orm/neon-http';
// import { drizzle } from 'drizzle-orm/postgres-js';
// import postgres from 'postgres';
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
	const { neon } = require('@neondatabase/serverless') as typeof import('@neondatabase/serverless');
	const { drizzle } = require('drizzle-orm/neon-http') as typeof import('drizzle-orm/neon-http');

	const sql = neon(connectionString);
	return drizzle(sql, { schema });
}

function createLocalDb() {
	const postgres = require('postgres') as typeof import('postgres');
	const { drizzle } = require('drizzle-orm/postgres-js') as typeof import('drizzle-orm/postgres-js');

	const client = postgres(connectionString);
	return drizzle(client, { schema });
}

export const db =
	provider === 'local'
		? createLocalDb()
		: createNeonDb();
