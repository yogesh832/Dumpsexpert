import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "./InstructionsPage.css";

const InstructionsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [mainInstructions, setMainInstructions] = useState("");
  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams(); // ✅ now expecting exam ID

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/exams/byId/${id}`);
        const exam = res.data;

        if (!exam?.mainInstructions) {
          setMainInstructions("<p>No instructions available.</p>");
        } else {
          setMainInstructions(exam.mainInstructions);
        }
      

        setExam(exam);
        console.log("🔥 exam from API:", exam);
      } catch (err) {
        console.error(err);
        setError("Failed to load instructions.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [id]);

  const handleStart = () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions before starting.");
      return;
    }
    navigate(`/student/courses-exam/test/${id}`);
  };

  return (
    <div className="instructions-container my-16">
      <div className="instructions-card">
        <h1 className="title">📝 Test Instructions</h1>

        {loading ? (
          <p>Loading instructions...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div
            className="instructions-content"
            dangerouslySetInnerHTML={{ __html: mainInstructions }}
          />
        )}

        {!loading && !error && (
          <ul className="instructions-list">
            <p className="intro-text">
              📋 Please read the following test instructions carefully:
            </p>

            <li>⏱️ <strong>Duration:</strong> {exam.duration} minutes</li>
            <li>✍️ <strong>Marks per Question:</strong> {exam.eachQuestionMark} marks</li>
            <li>📉 <strong>Negative Marking:</strong> -1 mark per wrong answer</li>
            <li>🔢 <strong>Total Questions:</strong> {exam.numberOfQuestions}</li>
            <li>🎯 <strong>Passing Score:</strong> {exam.passingScore}%</li>
            <li>✅ You can mark questions for review if unsure (<span className="color purple">purple</span>).</li>
            <li>❌ Skipped questions will appear in <span className="color red">red</span>.</li>
            <li>✔️ Answered questions will appear in <span className="color green">green</span>.</li>
            <li>🚨 Switching tabs more than 5 times will <strong>automatically submit</strong> your test.</li>
            <li>🚫 Copy-paste and tab switching are restricted to ensure fairness.</li>
          </ul>
        )}

        <div className="checkbox-container">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agree">
            I have read and agree to the above instructions.
          </label>
        </div>

        <button
          className="start-button"
          onClick={handleStart}
          disabled={loading || !!error}
        >
          Start Test
        </button>
      </div>
    </div>
  );
};

export default InstructionsPage;
