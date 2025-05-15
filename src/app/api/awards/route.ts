import { dbConnect } from '@/lib/mongodb';
import { Award } from '@/lib/models/Award'; 
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
    const awards = await db.collection('Awards').find({}).toArray();
    return NextResponse.json({ success: true, data: awards });
  
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch awards' }, { status: 500 });
  }

}