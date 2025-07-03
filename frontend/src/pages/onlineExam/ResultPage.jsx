import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import "./ResultPage.css";

const ResultPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(true);
  const [attempt, setAttempt] = useState(null);

  useEffect(() => {
    if (!state) {
      navigate("/student/courses-exam");
      return;
    }

    const saveResult = async () => {
      try {
        const correct = state.questions.reduce((count, question) => {
          const userAns = state.userAnswers[question._id];
          const correctAns = question.correctAnswers;

          if (!userAns) return count;

          if (Array.isArray(correctAns)) {
            const isCorrect =
              Array.isArray(userAns) &&
              userAns.length === correctAns.length &&
              userAns.every((ans) => correctAns.includes(ans));
            return isCorrect ? count + 1 : count;
          } else {
            return correctAns.includes(userAns) ? count + 1 : count;
          }
        }, 0);

        const totalQuestions = state.questions.length;
        const attempted = Object.keys(state.userAnswers).length;
        const wrong = attempted - correct;
        const percentage = ((correct / totalQuestions) * 100).toFixed(2);

        const resultPayload = {
          studentId: state.studentId, // ⚠️ Required for backend
          examCode: state.examCode,
          totalQuestions,
          attempted,
          wrong,
          correct,
          percentage,
          duration: state.duration || 0,
          completedAt: state.completedAt || new Date().toISOString(),
          userAnswers: state.userAnswers,
          questions: state.questions,
        };

        const res = await axios.post("http://localhost:8000/api/results/save", resultPayload);
        setAttempt(res.data.attempt);
        console.log("✅ Result saved with attempt:", res.data.attempt);
      } catch (error) {
        console.error("❌ Failed to save result:", error.response?.data || error.message);
      } finally {
        setSaving(false);
      }
    };

    saveResult();
  }, [state, navigate]);

  if (!state) return null;
  if (saving) return <p className="saving-msg text-center text-lg">Saving your result...</p>;

  const isPass = parseFloat(state.percentage) >= 33;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-800">Exam Result</h1>

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
              isPass ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {isPass ? "Pass ✅" : "Fail ❌"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Total Questions</h3>
            <p className="text-xl font-semibold text-gray-800">{state.totalQuestions}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Attempted</h3>
            <p className="text-xl font-semibold text-gray-800">{state.attempted}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Wrong Answers</h3>
            <p className="text-xl font-semibold text-red-500">{state.wrong}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Correct</h3>
            <p className="text-xl font-semibold text-green-600">
              {state.totalQuestions - state.wrong}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Percentage</h3>
            <p className="text-xl font-semibold text-blue-600">{state.percentage}%</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center">
            <h3 className="font-medium text-gray-700">Duration</h3>
            <p className="text-xl font-semibold text-gray-800">{state.duration} sec</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center sm:col-span-2">
            <h3 className="font-medium text-gray-700">Completed At</h3>
            <p className="text-xl font-semibold text-gray-800">
              {new Date(state.completedAt).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg text-center sm:col-span-2">
            <h3 className="font-medium text-gray-700">Exam Code</h3>
            <p className="text-xl font-semibold text-gray-800">{state.examCode}</p>
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
