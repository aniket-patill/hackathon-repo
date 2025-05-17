import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import FacultyUser from "@/models/facultySchema";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const faculty = await FacultyUser.find({}, "username email department");
    return NextResponse.json(faculty);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}