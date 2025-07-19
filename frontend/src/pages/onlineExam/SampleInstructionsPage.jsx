import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import "./InstructionsPage.css";

const SampleInstructionsPage = () => {
  const [agreed, setAgreed] = useState(false);
  const [sampleInstructions, setSampleInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { slug } = useParams(); // use slug now

  useEffect(() => {
    const fetchInstructions = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/exams/byslug/${slug}`
        );
        const exam = res.data[0];

        if (!exam?.sampleInstructions) {
          setSampleInstructions("<p>No instructions available.</p>");
        } else {
          setSampleInstructions(exam.sampleInstructions); 
        }

        console.log("🔥 sampleInstructions from API:", exam.sampleInstructions);
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
    <div className="instructions-container">
      <div className="instructions-card">
        <h1 className="title">🧪 Sample Test Instructions</h1>

        {loading ? (
          <p>Loading instructions...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <div
            className="instructions-content"
            dangerouslySetInnerHTML={{ __html: sampleInstructions }}
          />
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
          Start Sample Test
        </button>
      </div>
    </div>
  );
};

export default SampleInstructionsPage;
