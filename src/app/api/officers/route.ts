import { dbConnect } from '@/lib/mongodb';
import { NextResponse } from 'next/server';
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = "IEEE-Website";

export async function GET() {
	await dbConnect();

	await client.connect();
	const db = client.db(dbName);

	try {
		const officers = await db.collection('Officers').find({}).toArray();
		return NextResponse.json({ success: true, data: officers });

	} catch {
		return NextResponse.json({ success: false, error: 'Failed to fetch officers' }, { status: 500 });
	}
}