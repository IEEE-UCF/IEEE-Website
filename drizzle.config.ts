import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// drizzle-kit runs outside Next, so it doesn't get .env.local automatically.
// Prefer .env.local (local dev), fall back to .env.
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

if (!process.env.DATABASE_URL) {
	throw new Error(
		'DATABASE_URL is not set. Add it to .env.local (see .env.example) or pass it inline.',
	);
}

export default defineConfig({
	dialect: 'postgresql',
	schema: './src/lib/database/schema.ts',
	out: './drizzle',
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},
	// Fail loudly on ambiguous / destructive changes instead of silently applying them.
	strict: true,
	verbose: true,
});
