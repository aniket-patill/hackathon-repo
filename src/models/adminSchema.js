import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    select: false,
  },
  // isVerified: {
  //   type: Boolean,
  //   default: false,
  // },
  isAdmin: {
    type: Boolean,
    default: true,
  },
  forgotPasswordToken: String,
  forgotPasswordExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const Admin =
  mongoose.models.admin || mongoose.model("admin", adminSchema);

export default Admin;
