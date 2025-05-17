import mongoose from "mongoose";

const timeTableSchema = new mongoose.Schema({
  facultyId: {
    type: String,
    required: true,
  },
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  schedule: [
    {
      period: {
        type: Number,
        required: true,
      },
      subject: {
        type: String,
        required: true,
      },
      class: {
        type: String,
        required: true,
      },
      startTime: String,
      endTime: String,
      totalStudents: {
        type: Number,
        required: true,
      },
    },
  ],
});

const TimeTable =
  mongoose.models.timetable || mongoose.model("timetable", timeTableSchema);
export default TimeTable;
