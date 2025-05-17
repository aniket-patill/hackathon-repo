import { NextRequest,NextResponse } from "next/server";
import { connectDB } from "@/dbConfig/dbConfig";
import FacultyUser from "@/models/facultySchema";
import Admin from "@/models/adminSchema";
import bcryptjs from "bcryptjs";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;

    // Split the token to get userType
    const [hashedToken, userType] = token.split(":");

    // Choose the correct model based on userType
    const Model = userType === "faculty" ? FacultyUser : Admin;

    const user = await Model.findOne({
      forgotPasswordToken: hashedToken,
      forgotPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Hash the new password and update user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    user.password = hashedPassword;
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error resetting password" },
      { status: 500 }
    );
  }
}