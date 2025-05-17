import { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

interface WorkDiaryEntry {
  period: number;
  subject: string;
  class: string;
  totalStudents: number;
  presentStudents: number;
  absentStudents: number;
  tasksDone: string;
}

interface WorkDiaryFormProps {
  timetableData: any[];
  selectedDay: string;
}

export default function WorkDiaryForm({
  timetableData,
  selectedDay,
}: WorkDiaryFormProps) {
  const [entries, setEntries] = useState<WorkDiaryEntry[]>(() =>
    timetableData.map((period) => ({
      ...period,
      presentStudents: 0,
      absentStudents: period.totalStudents,
      tasksDone: "",
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePresentStudentsChange = (index: number, value: string) => {
    const present = Math.min(
      parseInt(value) || 0,
      entries[index].totalStudents
    );

    setEntries((prev) =>
      prev.map((entry, i) =>
        i === index
          ? {
              ...entry,
              presentStudents: present,
              absentStudents: entry.totalStudents - present,
            }
          : entry
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("/api/faculty/workdiary", {
        date: new Date(),
        entries,
        department: "YOUR_DEPARTMENT",
      });

      toast.success("Work diary submitted successfully");
    } catch (error) {
      toast.error("Failed to submit work diary");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Daily Work Diary
        </h2>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString()}
        </p>
      </div>

      {entries.map((entry, index) => (
        <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium">Period {entry.period}</h3>
              <p className="text-sm text-gray-600">Subject: {entry.subject}</p>
              <p className="text-sm text-gray-600">Class: {entry.class}</p>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                  Present Students
                  <input
                    type="number"
                    value={entry.presentStudents}
                    onChange={(e) =>
                      handlePresentStudentsChange(index, e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500"
                    min="0"
                    max={entry.totalStudents}
                  />
                </label>
                <div className="mt-1 text-sm text-gray-500">
                  <p>Total Students: {entry.totalStudents}</p>
                  <p>Absent Students: {entry.absentStudents}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tasks Completed
                <textarea
                  value={entry.tasksDone}
                  onChange={(e) => {
                    const newEntries = [...entries];
                    newEntries[index].tasksDone = e.target.value;
                    setEntries(newEntries);
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500"
                  rows={3}
                  placeholder="Enter tasks completed in this period..."
                  required
                />
              </label>
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? "Submitting..." : "Submit Work Diary"}
        </button>
      </div>
    </form>
  );
}
