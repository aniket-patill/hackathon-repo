import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";
import WorkDiary from "@/models/workDiarySchema";
import { connectDB } from "@/dbConfig/dbConfig";

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const { facultyId, task, present, absent, total, date } =
      await request.json();

    // Save to DB
    const diary = new WorkDiary({
      facultyId: facultyId || "",
      task: task || "",
      present: present ?? 0,
      absent: absent ?? 0,
      total: total ?? 0,
      date: date || new Date().toISOString(),
    });
    await diary.save();

    await sendEmail({
      email: "admin@gmail.com",
      emailType: "DIARY_SUBMISSION",
      userId: facultyId || "",
      userType: "faculty",
      data: { facultyId, task, present, absent, total, date },
    });

    return NextResponse.json({
      message: "Work diary submitted and email sent!",
    });
  } catch (error) {
    return NextResponse.json({ message: "Submission failed" }, { status: 500 });
  }
}
