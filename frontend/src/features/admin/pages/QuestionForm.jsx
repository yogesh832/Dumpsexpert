import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const QuestionForm = ({ exam, question, setView }) => {
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([false, false, false, false]);

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCorrectToggle = (index) => {
    const updated = [...correctAnswers];
    updated[index] = !updated[index];
    setCorrectAnswers(updated);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => setView("manageQuestions")}
        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm rounded shadow"
      >
        ← Back
      </button>

      {/* Title */}
      <h2 className="text-2xl font-semibold text-gray-800">
        {question ? "Edit" : "Add"} Question
      </h2>

      {/* Form */}
      <form className="space-y-6 bg-white p-6 rounded shadow border">
        <select className="input-style">
          <option>{exam?.id || "EX-001"}</option>
        </select>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" /> Add to sample
        </label>

        <select className="input-style">
          <option>Checkbox</option>
          <option>Radio</option>
        </select>

        {/* Question Rich Text */}
        <div>
          <label className="block mb-1 font-medium text-sm text-gray-700">Question</label>
          <ReactQuill theme="snow" value={questionText} onChange={setQuestionText} />
        </div>

        {/* Options */}
        {["A", "B", "C", "D"].map((opt, index) => (
          <div key={index} className="space-y-2">
            <label className="block font-medium text-sm">Option {opt}</label>
            <ReactQuill
              theme="snow"
              value={options[index]}
              onChange={(value) => handleOptionChange(index, value)}
            />
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={correctAnswers[index]}
                onChange={() => handleCorrectToggle(index)}
              />
              Correct Answer
            </label>
          </div>
        ))}

        {/* Status */}
        <select className="input-style">
          <option>Publish</option>
          <option>Unpublish</option>
        </select>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium shadow"
          >
            {question ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
