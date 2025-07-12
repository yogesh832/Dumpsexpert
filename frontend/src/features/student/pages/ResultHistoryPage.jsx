import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const ResultHistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) throw new Error("Missing student ID");

        const res = await axios.get(
          `https://dumpsexpert-2.onrender.com/api/results/history/${studentId}`
        );
        setHistory(res.data);
        console.log(history);
      } catch (err) {
        console.error("Failed to fetch result history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading)
    return <p className="text-center mt-10">Loading result history...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-6">Result History</h2>
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-600">No results found.</p>
        ) : (
          history.map((result, index) => (
            <div
              key={result._id || index}
              className="flex justify-between items-center border-b pb-4 pt-2"
            >
              <div>
                <p className="font-semibold text-blue-700">
                  Attempt: {result.attempt}
                </p>
                <p className="text-sm">Exam Code: {result.code}</p>
                <p className="text-sm">Percentage: {result.percentage}%</p>
                <p className="text-sm">
                  Date: {new Date(result.completedAt).toLocaleDateString()}
                </p>
                <span
                  className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                    result.percentage >= 33
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {result.percentage >= 33 ? "Pass" : "Fail"}
                </span>
              </div>
              <button
                onClick={() =>
                  navigate("/student/courses-exam/result-details", {
                    state: {
                      questions: result.questions,
                      userAnswers: result.userAnswers,
                    },
                  })
                }
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                View Result
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ResultHistoryPage;
