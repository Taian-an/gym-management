import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Course from '@/src/models/Course';
import Enrollment from '@/src/models/Enrollment'; 
import '@/src/models/Coach';

export async function GET() {
  try {
    await connectDB();
    
    // 使用 populate 抓取教練名稱
    const courses = await Course.find({})
      .populate('coachId', 'name')
      .sort({ createdAt: -1 });

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
    
    // 確保這裡的欄位名稱與前端 body 內容一致
    const newCourse = await Course.create({
      title: body.title,
      capacity: body.capacity,
      time: body.time,
      coachId: body.coachId || null // 這裡接收前端傳來的 coachId
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

export async function PUT(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { id, title, capacity, coachId, time } = body;

    const updated = await Course.findByIdAndUpdate(
      id, 
      { title, capacity, coachId, time }, 
      { new: true }
    ).populate('coachId', 'name'); // 更新後也順便 populate 教練資料
    
    return NextResponse.json({ success: true, data: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}