import React from "react";

const ExamList = ({ setView, setSelectedExam }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">All Exams</h2>
        <button
          onClick={() => setView("addExam")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow"
        >
          + Add Exam
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-sm rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="p-3 text-left border-b">Name</th>
              <th className="p-3 text-left border-b">Duration (min)</th>
              <th className="p-3 text-left border-b"># Questions</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {[1, 2].map((exam) => (
              <tr
                key={exam}
                className="hover:bg-gray-50 border-b transition duration-300"
              >
                <td className="p-3">Exam {exam}</td>
                <td className="p-3">30</td>
                <td className="p-3">10</td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                    Published
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedExam({ id: exam });
                      setView("editExam");
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExam({ id: exam });
                      setView("manageQuestions");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Manage Q&A
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExamList;
