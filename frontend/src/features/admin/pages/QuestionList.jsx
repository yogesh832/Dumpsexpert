import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionForm = ({ exam, question, setView }) => {
  const isEdit = !!question;

  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswers, setCorrectAnswers] = useState([false, false, false, false]);
  const [difficulty, setDifficulty] = useState("Easy");
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [isSample, setIsSample] = useState(false);
  const [status, setStatus] = useState("draft");

  // Prefill on edit
  useEffect(() => {
    if (isEdit) {
      setQuestionText(question.questionText || "");
      setOptions(question.options?.map((opt) => opt.text) || ["", "", "", ""]);
      setCorrectAnswers(question.correctAnswers || [false, false, false, false]);
      setDifficulty(question.difficulty || "Easy");
      setMarks(question.marks || 1);
      setNegativeMarks(question.negativeMarks || 0);
      setIsSample(question.isSample || false);
      setStatus(question.status || "draft");
    }
  }, [question]);

  // Determine question type dynamically
  const isMultipleCorrect = correctAnswers.filter(Boolean).length > 1;
  const inputType = isMultipleCorrect ? "checkbox" : "radio";

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCorrectAnswerChange = (index) => {
    const updated = [...correctAnswers];
    if (inputType === "radio") {
      updated.fill(false);
    }
    updated[index] = !updated[index];
    setCorrectAnswers(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      examId: exam._id,
      questionText,
      options: options.map((opt, i) => ({ label: String.fromCharCode(65 + i), text: opt })),
      correctAnswers,
      difficulty,
      marks,
      negativeMarks,
      isSample,
      status,
    };

    const request = isEdit
      ? axios.put(`http://localhost:8000/api/questions/${question._id}`, payload)
      : axios.post("http://localhost:8000/api/questions", payload);

    request
      .then(() => {
        alert("Question saved successfully!");
        setView("manageQuestions");
      })
      .catch((err) => {
        console.error(err);
        alert("Error saving question.");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold">{isEdit ? "Edit" : "Add"} Question</h2>

      <div>
        <label className="block font-medium">Question Text:</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
      </div>

      <div>
        <label className="block font-medium mb-1">Options:</label>
        {options.map((opt, index) => (
          <div key={index} className="flex items-center mb-2 gap-2">
            <input
              type={inputType}
              checked={correctAnswers[index]}
              onChange={() => handleCorrectAnswerChange(index)}
              className="mt-1"
            />
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="flex-1 border p-1 rounded"
              placeholder={`Option ${String.fromCharCode(65 + index)}`}
              required
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4">
        <div>
          <label className="block font-medium">Difficulty:</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="border p-1 rounded"
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Marks:</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(+e.target.value)}
            className="border p-1 rounded w-20"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Negative Marks:</label>
          <input
            type="number"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(+e.target.value)}
            className="border p-1 rounded w-20"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-2">
        <label>
          <input
            type="checkbox"
            checked={isSample}
            onChange={(e) => setIsSample(e.target.checked)}
          />
          <span className="ml-2">Is Sample Question</span>
        </label>

        <label>
          Status:
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="ml-2 border p-1 rounded"
          >
            <option value="draft">Draft</option>
            <option value="publish">Publish</option>
          </select>
        </label>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mr-3"
        >
          {isEdit ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={() => setView("manageQuestions")}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default QuestionForm;
