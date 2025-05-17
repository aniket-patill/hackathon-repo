import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
  try {
    const { email, days, message } = await request.json();

    await sendEmail({
      email: "admin@gmail.com", // admin/principal email
      emailType: "LEAVE_APPLICATION",
      userId: email, // or use a real userId if available
      userType: "faculty",
      data: { email, days, message },
    });

    return NextResponse.json({ message: "Leave application sent!" });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to send leave application" },
      { status: 500 }
    );
  }
}
