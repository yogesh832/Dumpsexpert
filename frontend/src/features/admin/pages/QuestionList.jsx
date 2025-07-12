import React, { useEffect, useState } from "react";
import axios from "axios";

const truncateText = (text, wordLimit = 5) => {
  if (!text) return "";
  const words = text
    .replace(/<[^>]+>/g, "")
    .trim()
    .split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : words.join(" ");
};

const QuestionList = ({ exam, setView, setSelectedQuestion }) => {
  const [questions, setQuestions] = useState([]);
  const [previewQuestion, setPreviewQuestion] = useState(null);

  useEffect(() => {
    if (exam?._id) fetchQuestions();
  }, [exam]);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/questions/byExam/${exam._id}`
      );
      setQuestions(Array.isArray(res.data) ? res.data : []);
      console.log(questions);
    } catch (err) {
      console.error("Failed to fetch questions", err);
      setQuestions([]);
    }
  };

  const deleteQuestion = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/questions/${id}`);
      fetchQuestions();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="space-y-6">
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

      <div className="overflow-x-auto">
        <table className="w-full table-auto border-collapse shadow-md rounded-md overflow-hidden">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="p-3 text-left border-b">Sn.No</th>
              <th className="p-3 text-left border-b">Question Code</th>
              <th className="p-3 text-left border-b">Question</th>
              <th className="p-3 text-left border-b">Answer</th>
              <th className="p-3 text-left border-b">Sample</th>
              <th className="p-3 text-left border-b">Status</th>
              <th className="p-3 text-left border-b">Subject</th>
              <th className="p-3 text-left border-b">Topic</th>
              <th className="p-3 text-left border-b">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {questions.map((q, index) => (
              <tr
                key={q._id}
                className="hover:bg-gray-50 border-b transition duration-300"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{q.questionCode || "N/A"}</td>
                <td className="p-3">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: truncateText(q.questionText),
                    }}
                  />
                </td>
                <td className="p-3">
                  {q.correctAnswers?.length > 0
                    ? q.correctAnswers.join(", ")
                    : "N/A"}
                </td>
                <td className="p-3">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium">
                    {q.isSample ? "Yes" : "No"}
                  </span>
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      q.status === "publish"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {q.status || "draft"}
                  </span>
                </td>
                <td className="p-3">{q.subject || "N/A"}</td>
                <td className="p-3">{q.topic || "N/A"}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedQuestion(q);
                      setView("editQuestion");
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setPreviewQuestion(q)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-4 text-gray-500">
                  No questions found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* INLINE PREVIEW SECTION */}
      {previewQuestion && (
        <div
          className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setPreviewQuestion(null)}
        >
          <div
            className="bg-white rounded-md shadow-lg max-w-3xl w-full p-6 relative overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewQuestion(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
            >
              ✖
            </button>

            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Question Preview
            </h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Question:
              </label>
              <div
                className="prose prose-sm max-w-none border p-3 rounded"
                dangerouslySetInnerHTML={{
                  __html: previewQuestion.questionText,
                }}
              />
              {/* ✅ Question Image (if exists) */}
              {previewQuestion.questionImage && (
                <img
                  src={previewQuestion.questionImage}
                  alt="Question"
                  className="mt-3 max-h-40 rounded border"
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {previewQuestion.options?.map((opt, i) => (
                <div
                  key={i}
                  className={`border p-3 rounded ${
                    previewQuestion.correctAnswers?.includes(opt.label)
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  <strong className="text-sm">Option {opt.label}:</strong>
                  <div
                    className="mt-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: opt.text }}
                  />
                  {/* ✅ Option Image (if exists) */}
                  {opt.image && (
                    <img
                      src={opt.image}
                      alt={`Option ${opt.label}`}
                      className="mt-2 max-h-32 border rounded"
                    />
                  )}
                  {previewQuestion.correctAnswers?.includes(opt.label) && (
                    <div className="text-green-600 text-sm font-medium mt-2">
                      ✓ Correct Answer
                    </div>
                  )}
                </div>
              ))}
            </div>

            {previewQuestion.explanation && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Explanation:
                </label>
                <div
                  className="prose prose-sm max-w-none border p-3 rounded"
                  dangerouslySetInnerHTML={{
                    __html: previewQuestion.explanation,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionList;
