import { NextResponse } from 'next/server';
import connectDB from '@/src/lib/mongodb';
import Coach from '@/src/models/Coach';

export async function GET() { 
try { 
await connectDB(); 
const coaches = await Coach.find({}).sort({ createdAt: -1 }); 
return NextResponse.json({ success: true, data: coaches }); 
} catch (error: unknown) { 
const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
return NextResponse.json({ success: false, error: errorMessage }, { status: 500 }); 
}
}

export async function POST(req: Request) { 
try { 
await connectDB(); 
const body = await req.json(); 
console.log("Data received:", body); // Check the content of the data passed by the front end 

if (!body.name || !body.expertise) { return NextResponse.json({ success: false, message: "Please fill in your name and expertise" }, { status: 400 });

}

const newCoach = await Coach.create({ name: body.name, expertise: body.expertise

});

return NextResponse.json({ success: true, data: newCoach }, { status: 201 });

} catch (error: unknown) {

// This line will print the actual error reason on the terminal (e.g., database authentication failure)

console.error("POST failure reason:", error);

const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });

}
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing ID" }, { status: 400 });
    }

    await Coach.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Coach deleted" });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}