import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import FacultyUser from "@/models/facultySchema";
import Admin from "@/models/adminSchema";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    // First check in Faculty collection
    let user = await FacultyUser.findOne({ email });
    let userType = "faculty";

    // If not found in Faculty, check in Admin
    if (!user) {
      user = await Admin.findOne({ email });
      userType = "admin";
    }

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const mailResponse = await sendEmail({
      email: user.email,
      emailType: "RESET",
      userId: user._id,
      userType: userType, // Pass the determined userType
    });

    if (!mailResponse) {
      return NextResponse.json(
        { message: "Error sending email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Email sent successfully",
        userType: userType, // Return userType in response
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in POST /api/users/forgotPassMail:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
