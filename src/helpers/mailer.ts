import nodemailer from "nodemailer";
import FacultyUser from "@/models/facultySchema";
import Admin from "@/models/adminSchema";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({
  email,
  emailType,
  userId,
  userType,
  data,
}: {
  email: string;
  emailType: "VERIFY" | "RESET" | "DIARY_SUBMISSION" | "LEAVE_APPLICATION";
  userId: string;
  userType: "faculty" | "admin";
  data: any;
}) => {
  try {
    // Only hash for VERIFY/RESET
    let hashedToken = "";
    let tokenWithType = "";
    let Model = null;

    if (emailType === "VERIFY" || emailType === "RESET") {
      hashedToken = await bcryptjs.hash(userId.toString(), 10);
      tokenWithType = `${hashedToken}:${userType}`;
      Model = userType === "faculty" ? FacultyUser : Admin;
    }

    if (emailType === "RESET") {
      if (Model) {
        await Model.findByIdAndUpdate(userId, {
          forgotPasswordToken: hashedToken,
          forgotPasswordExpiry: Date.now() + 3600000,
        });
      } else {
        throw new Error("Model is null for RESET emailType");
      }
    }

    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: "hyperpatil151@gmail.com",
      to: email,
      subject: emailType === "DIARY_SUBMISSION"
        ? "Faculty Work Diary Submission"
        : emailType === "LEAVE_APPLICATION"
        ? "Faculty Leave Application"
        : emailType === "VERIFY"
        ? "Verify your email"
        : "Reset your password",
      html: emailType === "DIARY_SUBMISSION"
        ? `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Faculty Work Diary Submission</h2>
            <p><strong>Faculty ID:</strong> ${data.facultyId}</p>
            <p><strong>Date:</strong> ${data.date}</p>
            <p><strong>Task:</strong> ${data.task}</p>
            <p><strong>Present:</strong> ${data.present}</p>
            <p><strong>Absent:</strong> ${data.absent}</p>
            <p><strong>Total Students:</strong> ${data.total}</p>
            <hr>
            <p>This is an automated message. Please do not reply.</p>
          </div>
        `
        : emailType === "LEAVE_APPLICATION"
        ? `
          <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Faculty Leave Application</h2>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Number of Days:</strong> ${data.days}</p>
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
            <hr>
            <p>This is an automated message. Please do not reply.</p>
          </div>
        `
        : emailType === "VERIFY"
        ? `
          <p>
            Click <a href="${process.env.DOMAIN}/verifyEmail?token=${hashedToken}">here</a> to verify your email.
            Or copy and paste this link in your browser:<br>
            ${process.env.DOMAIN}/verifyEmail?token=${hashedToken}
          </p>
        `
        : `
          <p>
            Click <a href="${process.env.DOMAIN}/resetpassword?token=${tokenWithType}">here</a> to reset your password.
            Or copy and paste this link in your browser:<br>
            ${process.env.DOMAIN}/resetpassword?token=${tokenWithType}
          </p>
        `,
    };

    const mailResponse = await transport.sendMail(mailOptions);
    // if (mailResponse) {
    //     console.log("Email sent successfully!");
    // } else {
    //     console.log("Failed to send email.");
    // }
    return mailResponse;
  } catch (error: any) {
    console.log("Error: ", error.message);
  }
};

