import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "./InstructionsPage.css";

const SampleInstructionsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exam, setExam] = useState({});
  const navigate = useNavigate();
  const { slug } = useParams();

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/exams/byslug/${slug}`
        );
        const exam = res.data[0];
        setExam(exam);
        console.log("exam:", exam);
      } catch (err) {
        console.error(err);
        setError("Failed to load instructions.");
      } finally {
        setLoading(false);
      }
    };

    fetchInstructions();
  }, [slug]);

  const handleStart = () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions before starting.");
      return;
    }
    navigate(`/courses-exam/sample-test/${slug}`);
  };

  return (
    <div className="instructions-container my-16">
      <div className="instructions-card">
        <h1 className="title">🧪 Sample Test Instructions</h1>

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <ul className="instructions-list">
              <p className="intro-text">
                📋 Please read the following test instructions carefully:
              </p>

              <li>
                🧾 <strong>Exam Name:</strong> {exam.name}
              </li>
              <li>
                🆔 <strong>Exam Code:</strong> {exam.code}
              </li>
           
              <li>
                ⏱️ <strong>Sample Duration:</strong> {exam.sampleDuration} minutes
              </li>
              <li>
                ✍️ <strong>Marks per Question:</strong> {exam.eachQuestionMark} marks
              </li>
            
              <li>
                🎯 <strong>Passing Score:</strong> {exam.passingScore}%
              </li>
              <li>
                ✅ You can mark questions for review if unsure. These will appear
                in <span className="color purple">purple</span>.
              </li>
              <li>
                ❌ Skipped questions will appear in{" "}
                <span className="color red">red</span>.
              </li>
              <li>
                ✔️ Answered questions will appear in{" "}
                <span className="color green">green</span>.
              </li>
              <li>
                🚨 Switching tabs more than 5 times will{" "}
                <strong>automatically submit</strong> your test.
              </li>
              <li>
                🚫 Copy-paste and tab switching are restricted during the test to
                ensure fairness.
              </li>
            </ul>

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
              Start Sample Test
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SampleInstructionsPage;
