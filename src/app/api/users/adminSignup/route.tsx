import { connectDB } from "@/dbConfig/dbConfig";
import Admin from "@/models/adminSchema";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
// import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();

    const { username, email,password } = reqBody;

    const ExistingUser = await Admin.findOne({ email: email });
    if (ExistingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username: username,
      email: email,
      password: hashedPassword,
    });

    const savedUser = await newAdmin.save();

    // //send verification email
    // await sendEmail({
    //   email: email,
    //   emailType: "VERIFY",
    //   userId: savedUser._id,
    // });

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      savedUser,
      status: 201,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Invalid request body" },
      { status: 500 }
    );
  }
}
