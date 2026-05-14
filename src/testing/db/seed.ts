import path from 'path';
import fs from 'fs';
import { Client } from 'pg';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const DEFAULT_DB_URL = 'postgres://postgres:postgres@localhost:5432/ieee-website';
const DATA_DIR = path.join(__dirname, 'data');

const SEED_ORDER = [
	'members',
	'sponsorships',
	'committees',
	'projects',
	'committee_members',
	'project_members',
	'events',
	'event_attendees',
	'member_permissions',
];

async function wipeDatabase(client: Client) {
	console.log('Dropping all tables...');
	const res = await client.query(`SELECT tablename FROM pg_tables WHERE schemaname = 'public';`);
	for (const row of res.rows) {
		await client.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE;`);
	}
	console.log('Database fully wiped.');
}

async function seedDatabase(client: Client, tablesToSeed: string[]) {
	for (const tableName of tablesToSeed) {
		console.log(`Seeding ${tableName}...`);
		const filePath = path.join(DATA_DIR, `${tableName}.json`);
		if (!fs.existsSync(filePath)) {
			console.log(`No data file for ${tableName}. Skipping.`);
			continue;
		}
		const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
		if (!Array.isArray(data) || data.length === 0) {
			console.log(`No data found for ${tableName}. Skipping.`);
			continue;
		}
		const columns = Object.keys(data[0]);
		const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
		const sql = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders})`;
		for (const row of data) {
			await client.query(
				sql,
				columns.map((col) => row[col]),
			);
		}
	}
	console.log('\nDatabase seeded successfully!');
}

if (require.main === module) {
	const parser = yargs(hideBin(process.argv))
		.option('wipe', {
			type: 'boolean',
			default: false,
			describe: 'Wipe all tables before seeding.',
		})
		.option('seed', {
			type: 'string',
			describe: 'Seed all tables (default) or only specified tables (comma-separated).',
		})
		.option('dburl', { type: 'string', describe: 'Database URL to use.' })
		.positional('dburl', { type: 'string', describe: 'Database URL to use.' });
	const argv = parser.parseSync();

	const dbUrl = argv.dburl || String(argv._[0]) || DEFAULT_DB_URL;
	const client = new Client({ connectionString: dbUrl });
	client
		.connect()
		.then(async () => {
			if (argv.wipe) {
				await wipeDatabase(client);
				await client.end();
				return;
			}

			let tablesToSeed: string[];
			if (argv.seed) {
				if (argv.seed === '' || argv.seed === 'true' || argv.seed === 'all') {
					tablesToSeed = SEED_ORDER;
				} else {
					tablesToSeed = argv.seed
						.split(',')
						.map((s) => s.trim())
						.filter((s) => SEED_ORDER.includes(s));
					if (tablesToSeed.length === 0) {
						console.log('No valid tables specified for seeding.');
						await client.end();
						return;
					}
				}
			} else {
				tablesToSeed = SEED_ORDER;
			}

			await seedDatabase(client, tablesToSeed);
			await client.end();
		})
		.catch((err) => {
			console.error('DB connection error:', err);
			client.end();
		});
}
