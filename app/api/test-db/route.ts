import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Coach from '@/src/models/Coach';

export async function GET() {
  try {
    await connectDB();
    const coachCount = await Coach.countDocuments();

    return NextResponse.json({
      success: true,
      message: "Successful connect to MongoDB Atlas！",
      dbStatus: "Connected",
      currentCoaches: coachCount
    }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Database connection error:", errorMessage);
    
    return NextResponse.json({
      success: false,
      message: "Connect failed",
      error: errorMessage
    }, { status: 500 });
  }
}
