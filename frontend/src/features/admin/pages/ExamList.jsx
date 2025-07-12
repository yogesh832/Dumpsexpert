import React, { useEffect, useState } from "react";
import axios from "axios";

const ExamList = ({ setView, setSelectedExam }) => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/exams")
      .then((res) => setExams(res.data))
      .catch(console.error);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm("Delete this exam?")) return;
    axios
      .delete(`http://localhost:8000/api/exams/${id}`)
      .then(() => setExams(exams.filter((e) => e._id !== id)))
      .catch(console.error);
  };

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
        <table className="w-full table-auto border-collapse shadow-sm rounded-md overflow-hidden text-sm">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="p-3 border-b text-left">Code</th>
              <th className="p-3 border-b text-left">Name</th>
              <th className="p-3 border-b text-left">Each Q Mark</th>
              <th className="p-3 border-b text-left">Duration (min)</th>
              <th className="p-3 border-b text-left">Sample Duration</th>
              <th className="p-3 border-b text-left">Passing Score (%)</th>
              <th className="p-3 border-b text-left"># Questions</th>
              <th className="p-3 border-b text-left">Price ($)</th>
              <th className="p-3 border-b text-left">Price (₹)</th>
              <th className="p-3 border-b text-left">Updated By</th>
              <th className="p-3 border-b text-left">Status</th>
              <th className="p-3 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {exams.map((exam) => (
              <tr
                key={exam._id}
                className="hover:bg-gray-50 border-b transition"
              >
                <td className="p-3">{exam.code}</td>
                <td className="p-3">{exam.name}</td>
                <td className="p-3">{exam.eachQuestionMark}</td>
                <td className="p-3">{exam.duration}</td>
                <td className="p-3">{exam.sampleDuration}</td>
                <td className="p-3">{exam.passingScore}</td>
                <td className="p-3">{exam.numberOfQuestions}</td>
                <td className="p-3">${exam.priceUSD}</td>
                <td className="p-3">₹{exam.priceINR}</td>
                <td className="p-3">{exam.lastUpdatedBy}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      exam.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {exam.status === "published" ? "Published" : "Unpublished"}
                  </span>
                </td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedExam(exam);
                      setView("editExam");
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedExam(exam);
                      setView("manageQuestions");
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                  >
                    Manage Q&A
                  </button>
                  <button
                    onClick={() => handleDelete(exam._id)}
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
