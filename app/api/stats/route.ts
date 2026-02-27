import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Coach from '@/src/models/Coach';
import Member from '@/src/models/Member';
import Course from '@/src/models/Course';

export async function GET() {
  try {
    await connectDB();
    
    // 同時執行多個查詢以提高效率
    const [coachCount, memberCount, courses] = await Promise.all([
      Coach.countDocuments(),
      Member.countDocuments(),
      Course.find({}).populate('coachId').limit(10) // 只取前 5 堂課展示
    ]);

    return NextResponse.json({
      success: true,
      data: {
        coachCount,
        memberCount,
        courseCount: courses.length,
        recentCourses: courses
      }
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}