import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import "./ResultPage.css";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [examConfig, setExamConfig] = useState(null);

  useEffect(() => {
    if (!state) {
      navigate("/student/courses-exam");
      return;
    }

    const saveResult = async () => {
      try {
        const studentId = localStorage.getItem("studentId");
        if (!studentId) throw new Error("Missing student ID");

        // ✅ Fetch exam config using examId from URL
        const examRes = await axios.get(
          `http://localhost:8000/api/exams/${state.examCode}`
        );
        const exam = examRes.data;
        setExamConfig(exam);
        console.log(exam);
        const perQ = exam.eachQuestionMark; // Each question marks (4)
        const passingScore = exam.passingScore; // Passing marks (33)
        const totalQs = exam.numberOfQuestions; // Total questions (20)
        const negativeMark = exam.negativeMark || 0; // Optional negative marks (default to 0)
        const code = exam.code; // Exam code
        let correct = 0;
        let wrong = 0;
        let attempted = 0;
        let totalMarks = 0;

        state.questions.forEach((q) => {
          const userAns = state.userAnswers[q._id];
          const correctAns = q.correctAnswers;

          if (userAns) {
            attempted += 1;
            const userKey = Array.isArray(userAns)
              ? userAns.sort().join(",")
              : userAns;
            const correctKey = correctAns.sort().join(",");

            if (userKey === correctKey) {
              correct += 1;
              totalMarks += perQ;
            } else {
              wrong += 1;
              totalMarks -= negativeMark;
            }
          }
        });

        const percentage = Math.max(0, (totalMarks / (totalQs * perQ)) * 100);
        const isPass = totalMarks >= passingScore;

        // 🌟 Save result to DB
        const res = await axios.post("http://localhost:8000/api/results/save", {
          studentId,
          examCode: state.examCode,
          totalQuestions: totalQs,
          attempted,
          code: code,
          wrong,
          correct,
          percentage: percentage.toFixed(2),
          duration: state.duration,
          completedAt: state.completedAt,
          userAnswers: state.userAnswers,
          questions: state.questions,
        });

        setAttempt(res.data.attempt);
        setResultData({
          correct,
          wrong,
          attempted,
          totalMarks,
          percentage: percentage.toFixed(2),
          isPass,
        });

        console.log("✅ Result saved to DB");
      } catch (error) {
        console.error(
          "❌ Failed to save result:",
          error.response?.data || error
        );
      } finally {
        setSaving(false);
      }
    };

    saveResult();
  }, [state, navigate]);

  if (!state) return null;
  if (saving)
    return (
      <p className="saving-msg text-center text-lg">Saving your result...</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">
          Exam Result
        </h1>

        {attempt && (
          <div className="flex justify-center mb-4">
            <span className="text-sm text-gray-600">
              Attempt <strong>#{attempt}</strong>
            </span>
          </div>
        )}

        <div className="flex justify-center mb-6">
          <span
            className={`px-6 py-2 rounded-full text-white font-semibold text-lg ${
              resultData.isPass ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {resultData.isPass ? "Pass ✅" : "Fail ❌"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Total Questions</h3>
            <p className="text-xl font-semibold text-gray-800">
              {state.totalQuestions}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Attempted</h3>
            <p className="text-xl font-semibold text-gray-800">
              {resultData.attempted}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Wrong Answers</h3>
            <p className="text-xl font-semibold text-red-500">
              {resultData.wrong}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Correct</h3>
            <p className="text-xl font-semibold text-green-600">
              {resultData.correct}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Total Marks</h3>
            <p className="text-xl font-semibold text-blue-600">
              {resultData.totalMarks}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Percentage</h3>
            <p className="text-xl font-semibold text-blue-600">
              {resultData.percentage}%
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Duration</h3>
            <p className="text-xl font-semibold text-gray-800">
              {state.duration} sec
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center sm:col-span-2">
            <h3 className="font-medium text-gray-700">Completed At</h3>
            <p className="text-xl font-semibold text-gray-800">
              {new Date(state.completedAt).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center sm:col-span-2">
            <h3 className="font-medium text-gray-700">Exam Code</h3>
            <p className="text-xl font-semibold text-gray-800">
              {examConfig.code}
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() =>
              navigate("/student/courses-exam/result-details", {
                state: {
                  questions: state.questions,
                  userAnswers: state.userAnswers,
                },
              })
            }
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            View Detailed Result
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
