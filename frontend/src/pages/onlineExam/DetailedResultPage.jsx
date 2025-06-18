import React from 'react';
import { useLocation} from 'react-router';
import './ResultPage.css';

const DetailedResultPage = () => {
  const { state } = useLocation();
 console.log(state);
  if (!state) return <p>No question data found</p>;

  const getStatus = (q) => {
    const selected = state.userAnswers[q.id];
    if (!selected) return 'Skipped';
    return selected === q.correctAnswer ? 'Correct ✔' : 'Wrong ✘';
  };

  return (
    <div className="result-page">
      <h1 className="detail-heading">Question Review</h1>
      {state.questions.map((q, index) => {
        const userAns = state.userAnswers[q.id];
        const status = getStatus(q);
        return (
          <div key={q.id} className={`question-card ${status.toLowerCase()}`}>
            <h4>Q{index + 1}. {q.question}</h4>
            <p><strong>Your Answer:</strong> {userAns || "Skipped"}</p>
            <p><strong>Correct Answer:</strong> {q.correctAnswer}</p>
            <p ><strong>Status:</strong> {status}</p>
          </div>
        );
      })}
    </div>
  );
};

export default DetailedResultPage;