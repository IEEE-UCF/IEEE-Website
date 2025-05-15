import { dbConnect } from '@/lib/mongodb';
import { Event } from '@/lib/models/Event'; 
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
    const events = await db.collection('Events').find({}).toArray();
    return NextResponse.json({ success: true, data: events });
  
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch events' }, { status: 500 });
  }

}