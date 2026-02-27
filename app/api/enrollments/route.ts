import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Enrollment from '@/src/models/Enrollment';
import Course from '@/src/models/Course';

export async function GET() {
  try {
    await connectDB();
    
    const enrollments = await Enrollment.find({})
      .populate('memberId', 'name') // 抓會員名字
      .populate({
        path: 'courseId',         // 抓課程資料
        select: 'title',          // 只要標題
        populate: {               // 【深層關聯】再往內抓教練資料
          path: 'coachId',
          select: 'name'          // 只要教練名字
        }
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: enrollments });
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
    if (!id) return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });

    await Enrollment.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Enrollment cancelled" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { memberId, courseId } = await req.json();

    if (!memberId || !courseId) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    const currentEnrolled = await Enrollment.countDocuments({ courseId });
    if (currentEnrolled >= course.capacity) {
      return NextResponse.json({ success: false, message: "Course is full" }, { status: 400 });
    }

    const newEnrollment = await Enrollment.create({ memberId, courseId });
    return NextResponse.json({ success: true, data: newEnrollment }, { status: 201 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}