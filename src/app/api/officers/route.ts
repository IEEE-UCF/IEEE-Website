import { dbConnect } from '@/lib/mongodb';
import { Officer } from '@/lib/models/Officer'; 
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
  
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch officers' }, { status: 500 });
  }

}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const body = await req.json(); 
    const newOfficer = await Officer.create(body);
    return NextResponse.json({ success: true, data: newOfficer }, { status: 201 });
  
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create officer' }, { status: 400 });
  }

}