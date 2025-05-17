import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import WorkDiary from "@/models/workDiarySchema";

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    // Fetch all work diary entries without populate
    const reports = await WorkDiary.find().sort({ createdAt: -1 });
    return NextResponse.json(reports);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
