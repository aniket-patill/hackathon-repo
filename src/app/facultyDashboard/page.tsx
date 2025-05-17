"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { toast,Toaster } from "react-hot-toast";
import TimeTable from "@/components/faculty/TimeTable";

export default function FacultyDashboard() {
  // const [activeTab, setActiveTab] = useState("timetable");
  const [isLoading, setIsLoading] = useState(false);
  const [timetableData, setTimetableData] = useState([]);
  const [selectedDay, setSelectedDay] = useState("Monday");
  
  //workdiary
  const [task, setTask] = useState("");
  const [present, setPresent] = useState("");
  const [absent, setAbsent] = useState("");
  const [total, setTotal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const facultyId = "65432"; // Replace with actual faculty ID

  const seedTimetable = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/faculty/seedtimetable", { facultyId });
      toast.success("Timetable created successfully");
      await fetchTimetable(); // Wait for seed before fetching
    } catch (error) {
      toast.error("Failed to create timetable");
    } finally {
      setIsLoading(false);
    }
  };
  // const facultyId = "65432"; // or the actual MongoDB _id

  const handleDiarySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task || !present || !absent || !total) {
      toast.error("Please fill all fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/faculty/workdiary", {
        facultyId,
        task,
        present: Number(present),
        absent: Number(absent),
        total: Number(total),
        date: new Date().toLocaleDateString(),
      });
      if (response.status === 200) {
        toast.success("Work diary submitted and email sent!");
        setTask("");
        setPresent("");
        setAbsent("");
        setTotal("");
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Submission failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/faculty/timeTable?day=${selectedDay}&facultyId=${facultyId}`
      );
      if (Array.isArray(response.data) && response.data.length > 0) {
        const dayTimetable = response.data.find(
          (item: any) => item.day === selectedDay
        );
        setTimetableData(dayTimetable ? dayTimetable.schedule : []);
      } else {
        setTimetableData([]);
      }
    } catch (error) {
      await seedTimetable();
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchTimetable();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x px-4">
      <div className="max-w-4xl mx-auto py-10">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white mb-8 p-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Faculty Dashboard</h1>
          {/* <button
            onClick={seedTimetable}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow hover:bg-indigo-700 transition"
          >
            Create Dummy Timetable
          </button> */}
        <Link className = "text-white border border-white px-4 py-2 rounded-lg font-semibold hover:text-indigo-400 transition" href="/leaveApplication">
        Leave Application</Link>
        </div>

        {/* Timetable */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white mb-8 p-6">
          <TimeTable
            timetableData={timetableData}
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            isLoading={isLoading}
          />
        </div>

        {/* Work Diary Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-lg border border-white p-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Work Diary Submission
          </h2>
          <form onSubmit={handleDiarySubmit} className="space-y-6">
            <div>
              <label className="block font-semibold text-white mb-2">
                Today's Task
              </label>
              <input
                type="text"
                className="w-full rounded-lg px-4 py-2 bg-white/80 text-black placeholder-gray-600 border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
                placeholder="Describe today's work..."
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <div className="flex-1 min-w-[120px]">
                <label className="block font-semibold text-white mb-2">
                  Present
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg px-4 py-2 bg-white/80 text-black border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={present}
                  onChange={(e) => setPresent(e.target.value)}
                  min={0}
                  required
                  placeholder="Present"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block font-semibold text-white mb-2">
                  Absent
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg px-4 py-2 bg-white/80 text-black border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={absent}
                  onChange={(e) => setAbsent(e.target.value)}
                  min={0}
                  required
                  placeholder="Absent"
                />
              </div>
              <div className="flex-1 min-w-[120px]">
                <label className="block font-semibold text-white mb-2">
                  Total Students
                </label>
                <input
                  type="number"
                  className="w-full rounded-lg px-4 py-2 bg-white/80 text-black border border-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={total}
                  onChange={(e) => setTotal(e.target.value)}
                  min={0}
                  required
                  placeholder="Total"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Work Diary"}
            </button>
          </form>
        </div>
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          }}
        />
      </div>
    </div>
  );
}
