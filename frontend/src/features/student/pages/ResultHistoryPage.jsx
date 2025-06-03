import React from "react";

const resultHistory = [
  {
    attempt: 1,
    examCode: "C_S4H_2025",
    percentage: 78,
    date: "25/05/2025",
    status: "Pass"
  },
  {
    attempt: 2,
    examCode: "C_S4H_2025",
    percentage: 62,
    date: "26/05/2025",
    status: "Pass"
  },
  {
    attempt: 3,
    examCode: "C_S4H_2025",
    percentage: 45,
    date: "27/05/2025",
    status: "Fail"
  }
];

const ResultHistoryPage = () => {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg text-black">
      <h2 className="text-2xl font-bold mb-6">Result History</h2>
      <div className="space-y-4">
        {resultHistory.map((result, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-4 pt-2"
          >
            <div>
              <p className="font-semibold text-blue-700">
                Attempt: {result.attempt}
              </p>
              <p className="text-sm">Exam Code: {result.examCode}</p>
              <p className="text-sm">Percentage: {result.percentage}%</p>
              <p className="text-sm">Date: {result.date}</p>
              <span
                className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${
                  result.status === "Pass"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {result.status}
              </span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
              View Result
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultHistoryPage;
