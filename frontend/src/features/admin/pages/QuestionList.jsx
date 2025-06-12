import React from "react";

const QuestionList = ({ exam, setView }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-800">
          Questions & Answers List
        </h2>
        <button
          onClick={() => setView("addQuestion")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow"
        >
          + Add Question
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-md rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="p-3 text-left border-b">Sn.No</th>
              <th className="p-3 text-left border-b">Exam Code</th>
              <th className="p-3 text-left border-b">Question</th>
              <th className="p-3 text-left border-b">Answer</th>
              <th className="p-3 text-left border-b">Sample</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {[1, 2, 3].map((q) => (
              <tr key={q} className="hover:bg-gray-50 border-b transition duration-300">
                <td className="p-3">{q}</td>
                <td className="p-3">{exam?.id || "EX-001"}</td>
                <td className="p-3">Sample Question {q}</td>
                <td className="p-3">C</td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                    Active
                  </span>
                </td>
                <td className="p-3">
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                    Published
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setView("editQuestion")}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
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

export default QuestionList;
