import React from 'react';
import { useLocation,useNavigate } from 'react-router';
import './ResultPage.css';

const ResultPage = () => {
  const { state } = useLocation();
  const navigate= useNavigate();
  if (!state) return <p>No result data found</p>;
  const isPass = state.percentage >= 40;

  return (
    <div className="result-page">
      <div className="result-header">
        <h1>Exam Result</h1>
       
      </div>

      <div className="result-grid">
        <div className='status-box'>
         <span className={`status ${isPass ? 'pass' : 'fail'}`}>
          {isPass ? 'Pass ✅' : 'Fail ❌'}
        </span>
        </div>
        <div className='row'>
        <div className="card">
          <h3>Total Questions</h3>
          <p>{state.totalQuestions}</p>
        </div>
        <div className="card">
          <h3>Exam Code</h3>
          <p>{state.examCode}</p>
        </div>
        <div className="card">
          <h3>Attempted</h3>
          <p>{state.attempted}</p>
        </div>
        </div>
             <div className='row'>
       
        <div className="card">
          <h3>Wrong Answers</h3>
          <p>{state.wrong}</p>
        </div>
        <div className="card">
          <h3>Percentage</h3>
          <p>{state.percentage}%</p>
        </div>
        <div className="card">
          <h3>Test Duration</h3>
          <p>{state.duration} sec</p>
        </div>
        </div>
        <div className='row'>
        <div className="card">
          <h3>Completed At</h3>
          <p>{state.completedAt}</p>
        </div>
        </div>
      </div>

     <div className="btn-container">
        <button className="view-result-btn"
          onClick={() => navigate('/student/courses-exam/result-details', {
            state: {
              questions: state.questions,
              userAnswers: state.userAnswers
            }
          })}
        >
          View Detailed Result
        </button>
      </div>
    </div>

  );
};

export default ResultPage;
