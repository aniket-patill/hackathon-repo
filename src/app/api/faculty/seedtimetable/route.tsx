import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import TimeTable from "@/models/timeTableSchema";

const dummyData = [
  {
    day: "Monday",
    schedule: [
      {
        period: 1,
        subject: "Data Structures",
        class: "CSE-A",
        startTime: "09:00",
        endTime: "10:00",
        totalStudents: 60,
      },
      {
        period: 2,
        subject: "Database Management",
        class: "CSE-B",
        startTime: "10:00",
        endTime: "11:00",
        totalStudents: 55,
      },
      {
        period: 3,
        subject: "Computer Networks",
        class: "CSE-A",
        startTime: "11:15",
        endTime: "12:15",
        totalStudents: 58,
      },
    ],
  },
  {
    day: "Tuesday",
    schedule: [
      {
        period: 1,
        subject: "Operating Systems",
        class: "CSE-B",
        startTime: "09:00",
        endTime: "10:00",
        totalStudents: 57,
      },
      {
        period: 2,
        subject: "Web Development",
        class: "CSE-A",
        startTime: "10:00",
        endTime: "11:00",
        totalStudents: 54,
      },
    ],
  },
];

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { facultyId } = await request.json();

    // Clear existing timetable for this faculty
    await TimeTable.deleteMany({ facultyId });

    // Insert dummy data
    const promises = dummyData.map((daySchedule) =>
      TimeTable.create({
        facultyId,
        day: daySchedule.day,
        schedule: daySchedule.schedule,
      })
    );

    await Promise.all(promises);

    return NextResponse.json({
      message: "Dummy timetable created successfully",
    });
  } catch (error: any) {
    console.error("Error seeding timetable:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
