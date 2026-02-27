import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Course from '@/src/models/Course';
import Enrollment from '@/src/models/Enrollment'; // 必須引入報名 Model
import '@/src/models/Coach';

export async function GET() {
  try {
    await connectDB();
    
    const courses = await Course.find({}).populate('coachId', 'name').sort({ createdAt: -1 });

    // 關鍵修改：幫每堂課算出目前的報名人數
    const coursesWithCount = await Promise.all(courses.map(async (course) => {
      const count = await Enrollment.countDocuments({ courseId: course._id });
      return {
        ...course.toObject(),
        enrolledCount: count
      };
    }));

    return NextResponse.json({ success: true, data: coursesWithCount });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const newCourse = await Course.create({
      title: body.title,
      capacity: body.capacity,
      coachId: body.coachId || null
    });
    return NextResponse.json({ success: true, data: newCourse }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    await Course.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}