import mongoose from "mongoose";

const workDiarySchema = new mongoose.Schema(
  {
    facultyId: {
      type: String, 
      required: true
    },
    task: { type: String, required: true },
    present: { type: Number, required: true },
    absent: { type: Number, required: true },
    total: { type: Number, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
);

const WorkDiary =
  mongoose.models.workdiary || mongoose.model("workdiary", workDiarySchema);

export default WorkDiary;
