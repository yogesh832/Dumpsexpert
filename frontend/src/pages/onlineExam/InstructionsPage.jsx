import React, { useState } from "react";
import { useNavigate } from "react-router";
import "./InstructionsPage.css";

const InstructionsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const navigate = useNavigate();

  const handleStart = () => {
    if (!agreed) {
      alert("Please agree to the terms and conditions before starting.");
      return;
    }
    navigate("/student/courses-exam/test");
  };

  return (
    <div className="instructions-container">
      <div className="instructions-card">
        <h1 className="title">📝 Test Instructions</h1>
        <ul className="instructions-list">
          <p className="intro-text">
            📋 Here are the instructions for the test. Please
          </p>

          <li>
            ⏱️ The total duration of the test is <strong>60 minutes</strong>
          </li>
          <li>
            ✅ You can mark questions for review if unsure. These will be shown
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
            📘 There is <strong>no negative marking</strong>.
          </li>
          <li>
            🚨 After switching tabs 5 times, the test will be{" "}
            <strong>automatically submitted</strong>.
          </li>
          <li>
            🚫 For security and fairness, copy-paste actions are disabled during
            the test. You are also not allowed to switch tabs; each time you do
            so, a warning will be issued. After 5 warnings, your test will be
            automatically submitted. Please make sure to stay on the test page
            throughout the duration to avoid interruptions.
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
            To proceed, kindly confirm that you agree to the terms and
            conditions below.
          </label>
        </div>

        <button className="start-button" onClick={handleStart}>
          Start Test
        </button>
      </div>
    </div>
  );
};

export default InstructionsPage;
