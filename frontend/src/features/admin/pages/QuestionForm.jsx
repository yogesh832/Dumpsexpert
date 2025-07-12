import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";

const InputWrapper = ({ label, children }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {children}
  </div>
);

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link"],
    ["clean"],
  ],
};

const QuestionForm = ({ exam = {}, question, setView }) => {
  const [questionText, setQuestionText] = useState("");
  const [questionImage, setQuestionImage] = useState(""); // 🆕
  const [options, setOptions] = useState([
    { text: "", image: "" },
    { text: "", image: "" },
    { text: "", image: "" },
    { text: "", image: "" },
  ]);
  const [correctAnswers, setCorrectAnswers] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [isSample, setIsSample] = useState(false);
  const [type, setType] = useState("radio");
  const [status, setStatus] = useState("publish");
  const [marks, setMarks] = useState(1);
  const [negativeMarks, setNegativeMarks] = useState(0);
  const [difficulty, setDifficulty] = useState("Easy");
  const [explanation, setExplanation] = useState("");
  const [tags, setTags] = useState("");
  const [subject, setSubject] = useState("");
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (question) {
      setQuestionText(question.questionText || "");
      setQuestionImage(question.questionImage || ""); // 🆕
      setOptions(
        question.options?.map((o) => ({
          text: o.text,
          image: o.image || "",
        })) || [
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
          { text: "", image: "" },
        ]
      );
      setCorrectAnswers(
        ["A", "B", "C", "D"].map((label) =>
          question.correctAnswers?.includes(label)
        )
      );
      setIsSample(question.isSample || false);
      setType(question.questionType || "radio");
      setStatus(question.status || "publish");
      setMarks(question.marks || 1);
      setNegativeMarks(question.negativeMarks || 0);
      setDifficulty(question.difficulty || "Easy");
      setExplanation(question.explanation || "");
      setTags(question.tags?.join(", ") || "");
      setSubject(question.subject || "");
      setTopic(question.topic || "");
    }
  }, [question]);

  const toggleCorrectAnswer = (index) => {
    const updated = [...correctAnswers];
    updated[index] = !updated[index];
    setCorrectAnswers(updated);
    const count = updated.filter(Boolean).length;
    setType(count > 1 ? "checkbox" : "radio");
  };

  const uploadImage = async (file, setImageFn) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/questions/upload",
        formData
      );
      setImageFn(res.data.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
    }
  };

  const handleOptionImageUpload = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadImage(file, (url) => {
      const updated = [...options];
      updated[index].image = url;
      setOptions(updated);
    });
  };

  const handleQuestionImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    uploadImage(file, setQuestionImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      examId: exam._id,
      questionText,
      questionImage, // 🆕
      questionType: type,
      difficulty,
      marks,
      negativeMarks,
      subject,
      topic,
      tags: tags.split(",").map((tag) => tag.trim()),
      explanation,
      options: options.map((opt, i) => ({
        label: "ABCD"[i],
        text: opt.text,
        image: opt.image,
      })),
      correctAnswers: correctAnswers
        .map((isCorrect, i) => (isCorrect ? "ABCD"[i] : null))
        .filter(Boolean),
      isSample,
      status,
    };

    try {
      if (question) {
        await axios.put(
          `http://localhost:8000/api/questions/${question._id}`,
          payload
        );
      } else {
        await axios.post("http://localhost:8000/api/questions", payload);
      }
      setView("manageQuestions");
    } catch (err) {
      console.error("Error saving question:", err);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white rounded-md shadow-md border">
      <button
        onClick={() => setView("manageQuestions")}
        className="bg-gray-100 hover:bg-gray-200 px-4 py-2 text-sm rounded shadow"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-semibold text-gray-800">
        {question ? "Edit" : "Add"} Question
      </h2>

      <form onSubmit={handleSubmit} className="grid gap-6">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputWrapper label="Exam Code">
            <input
              type="text"
              value={question?.questionCode || exam.code || ""}
              disabled
            />
          </InputWrapper>

          <InputWrapper label="Question Type (auto)">
            <input className="input-style" type="text" value={type} readOnly />
          </InputWrapper>

          <InputWrapper label="Marks">
            <input
              className="input-style"
              type="number"
              value={marks}
              onChange={(e) => setMarks(+e.target.value)}
            />
          </InputWrapper>

          <InputWrapper label="Negative Marks">
            <input
              className="input-style"
              type="number"
              value={negativeMarks}
              onChange={(e) => setNegativeMarks(+e.target.value)}
            />
          </InputWrapper>

          <InputWrapper label="Difficulty">
            <select
              className="input-style"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Status">
            <select
              className="input-style"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="publish">Publish</option>
              <option value="draft">Draft</option>
            </select>
          </InputWrapper>

          <InputWrapper label="Subject">
            <input
              className="input-style"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper label="Topic">
            <input
              className="input-style"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper label="Tags (comma separated)">
            <input
              className="input-style"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </InputWrapper>

          <InputWrapper label="Add to Sample">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isSample}
                onChange={() => setIsSample(!isSample)}
              />
              Yes
            </label>
          </InputWrapper>
        </section>

        <InputWrapper label="Question Text">
          <ReactQuill
            theme="snow"
            modules={quillModules}
            value={questionText}
            onChange={setQuestionText}
          />
        </InputWrapper>

        <InputWrapper label="Question Image (Optional)">
          <input
            type="file"
            accept="image/*"
            onChange={handleQuestionImageUpload}
          />
          {questionImage && (
            <img
              src={questionImage}
              alt="question"
              className="max-h-32 mt-2 rounded"
            />
          )}
        </InputWrapper>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {options.map((opt, i) => (
            <div key={i} className="space-y-2 border p-3 rounded-md">
              <label className="font-medium text-sm">Option {"ABCD"[i]}</label>
              <ReactQuill
                theme="snow"
                modules={quillModules}
                value={opt.text}
                onChange={(v) => {
                  const updated = [...options];
                  updated[i].text = v;
                  setOptions(updated);
                }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleOptionImageUpload(e, i)}
                className="mt-1"
              />
              {opt.image && (
                <img
                  src={opt.image}
                  alt={`Option ${i + 1}`}
                  className="max-h-24 mt-2 rounded"
                />
              )}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={correctAnswers[i]}
                  onChange={() => toggleCorrectAnswer(i)}
                />
                Correct Answer
              </label>
            </div>
          ))}
        </section>

        <InputWrapper label="Explanation">
          <ReactQuill
            theme="snow"
            modules={quillModules}
            value={explanation}
            onChange={setExplanation}
          />
        </InputWrapper>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-medium shadow"
          >
            {question ? "Update Question" : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
