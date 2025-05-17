
import mongoose from "mongoose";

const facultySchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please provide a username"],
        unique:true,
    },
    email:{
        type:String,
        required:[true,"Please provide an email"],
        unique:true,
    },
    department:{
        type:String,
        required:[true,"Please provide a department"],
        enum:["Computer Science","Electronics","Mechanical","Civil","Electrical"],
    },
    password:{
        type:String,
        required:[true,"Please provide a password"],
        select:false,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    forgotPasswordToken:String,
    forgotPasswordExpiry:Date,
    verifyToken:String,
    verifyTokenExpiry:Date,
})

const FacultyUser = mongoose.models.faculty  || mongoose.model("faculty",facultySchema);

export default FacultyUser;