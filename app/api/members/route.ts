import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Member from '@/src/models/Member';

export async function GET() {
  try {
    await connectDB();
    const members = await Member.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: members });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    // 檢查欄位是否與前端發送的一致 (name, phone)
    if (!body.name || !body.phone) {
      return NextResponse.json({ success: false, message: "Missing fields" }, { status: 400 });
    }

    const newMember = await Member.create({
      name: body.name,
      phone: body.phone
    });

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
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

    await Member.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, name, phone } = await req.json();
    const updatedMember = await Member.findByIdAndUpdate(id, { name, phone }, { new: true });
    return NextResponse.json({ success: true, data: updatedMember });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}