import React, { useState } from "react";
import ExamList from "./ExamList";
import ExamForm from "./ExamForm";
import QuestionList from "./QuestionList";
import QuestionForm from "./QuestionForm";

const ExamManagement = () => {
  const [view, setView] = useState("list");
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  return (
    <div className="p-6">
      {view === "list" && (
        <ExamList setView={setView} setSelectedExam={setSelectedExam} />
      )}
      {view === "addExam" && <ExamForm setView={setView} />}
      {view === "editExam" && (
        <ExamForm exam={selectedExam} setView={setView} />
      )}
      {view === "manageQuestions" && (
        <QuestionList
          exam={selectedExam}
          setView={setView}
          setSelectedQuestion={setSelectedQuestion}
        />
      )}
      {view === "addQuestion" && (
        <QuestionForm exam={selectedExam} setView={setView} />
      )}
      {view === "editQuestion" && (
        <QuestionForm
          exam={selectedExam}
          question={selectedQuestion}
          setView={setView}
        />
      )}
    </div>
  );
};

export default ExamManagement;
