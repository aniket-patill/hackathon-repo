import nodemailer from 'nodemailer';
import FacultyUser from '@/models/facultySchema';
import Admin from '@/models/adminSchema';
import bcryptjs from 'bcryptjs';

export const sendEmail = async ({
  email,
  emailType,
  userId,
  userType,
}: any) => {
  try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // Store userType in the token string
    const tokenWithType = `${hashedToken}:${userType}`;

    const Model = userType === "faculty" ? FacultyUser : Admin;

    if (emailType === "RESET") {
      await Model.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordExpiry: Date.now() + 3600000,
      });
    }

    var transport = nodemailer.createTransport({
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
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType === "VERIFY"
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
