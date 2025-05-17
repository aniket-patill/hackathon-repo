import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import TimeTable from "@/models/timeTableSchema";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const facultyId = request.nextUrl.searchParams.get("facultyId");
    const day = request.nextUrl.searchParams.get("day");

    if (!facultyId) {
      return NextResponse.json(
        { error: "Faculty ID is required" },
        { status: 400 }
      );
    }

    const query: { facultyId: string; day?: string } = { facultyId };
    if (day) query.day = day;

    const timetable = await TimeTable.find(query);
    return NextResponse.json(timetable);
  } catch (error: any) {
    console.error("Error fetching timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
