interface TimeTableProps {
  timetableData: any[];
  selectedDay: string;
  setSelectedDay: (day: string) => void;
  isLoading: boolean;
}

export default function TimeTable({
  timetableData,
  selectedDay,
  setSelectedDay,
  isLoading,
}: TimeTableProps) {
  console.log("TimeTable data:", timetableData);

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Class Schedule</h2>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200 shadow-lg">
          <thead className="bg-indigo-600">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Total Students
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y text-gray-900">
            {timetableData.map((entry, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4 whitespace-nowrap">{entry.period}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.startTime} - {entry.endTime}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.subject}</td>
                <td className="px-6 py-4 whitespace-nowrap">{entry.class}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {entry.totalStudents}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

