"use client";
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [reports, setReports] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch work diary reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/faculty/facultyReports");
        setReports(res.data);
      } catch (err) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  // Fetch faculty list and departments
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axios.get("/api/faculty/fetchUsers");
        setFaculty(res.data);
        const uniqueDepartments = [
          ...new Set(res.data.map((f: any) => f.department)),
        ];
        setDepartments(uniqueDepartments as string[]);
      } catch (err) {
        setFaculty([]);
      }
    };
    fetchFaculty();
  }, []);

  // Helper to get faculty name/department from facultyId string
  const getFacultyInfo = (facultyId: string) => {
    const f = faculty.find(
      (f: any) => f._id === facultyId || f.facultyId === facultyId
    );
    return {
      name: f?.username || facultyId || "N/A",
      department: f?.department || "N/A",
    };
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-black via-gray-800 to-gray-700 animate-gradient-x px-4">
      <div className="w-full max-w-6xl rounded-2xl bg-white/10 backdrop-blur-lg p-8 shadow-2xl border border-white">
        <h1 className="text-4xl font-bold text-white text-center mb-10 drop-shadow-lg">
          ADMIN DASHBOARD
        </h1>

        {/* Stats */}
        <div className="mb-10 flex flex-wrap gap-6 justify-center">
          <div className="bg-white/80 shadow rounded-xl p-6 min-w-[180px] text-center">
            <div className="text-lg font-semibold text-gray-800">
              Total Faculty
            </div>
            <div className="text-3xl font-bold text-indigo-700">
              {faculty.length}
            </div>
          </div>
          <div className="bg-white/80 shadow rounded-xl p-6 min-w-[180px] text-center">
            <div className="text-lg font-semibold text-gray-800">
              Departments
            </div>
            <div className="text-3xl font-bold text-indigo-700">
              {departments.length}
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {departments.join(", ")}
            </div>
          </div>
          <div className="bg-white/80 shadow rounded-xl p-6 flex-1 min-w-[220px] text-center">
            <div className="text-lg font-semibold text-gray-800">
              Faculty Names
            </div>
            <div className="text-sm text-gray-700 mt-2 break-words max-h-24 overflow-y-auto">
              {faculty.map((f: any) => f.username).join(", ")}
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="overflow-x-auto">
          <div className="w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              Work Diary Reports
            </h2>
            {loading ? (
              <div className="text-center text-white py-8">Loading...</div>
            ) : reports.length === 0 ? (
              <div className="text-center text-white py-8">
                No reports found.
              </div>
            ) : (
              <table className="min-w-full rounded-lg overflow-hidden bg-white/80">
                <thead>
                  <tr>
                  
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase bg-white/90">
                      Task
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase bg-white/90">
                      Present
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase bg-white/90">
                      Absent
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase bg-white/90">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report: any, idx: number) => {
                    const info = getFacultyInfo(report.facultyId);
                    return (
                      <tr
                        key={report._id || idx}
                        className={
                          idx % 2 === 0 ? "bg-white/70" : "bg-white/40"
                        }
                      >
                        
                        <td className="px-6 py-4 text-gray-900">
                          {report.task || ""}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {report.present}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {report.absent}
                        </td>
                        <td className="px-6 py-4 text-gray-900">
                          {report.total}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
