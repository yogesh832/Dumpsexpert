import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import res from './res.json';
// import "../App.css"
import "./TestPage.css"

const TestPage = () => {
 const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
// const [showResult, setShowResult] = useState(false);
const [startTime] = useState(new Date());
// const [endTime, setEndTime] = useState(null);
const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);

// Timer logic: Countdown from 1hr
const [timeLeft, setTimeLeft] = useState(3600); // 1hr in seconds
 const navigate = useNavigate();
useEffect(() => {
  const data = res; // Already imported JSON
  setQuestions(data);
  const initialStatus = {};
  data.forEach((q) => {
    initialStatus[q.id] = "Not Visited";
  });
  setStatusMap(initialStatus);
}, []);

  useEffect(() => {
  if (autoSubmitTriggered && questions.length > 0) {
    handleSubmit();
  }
}, [autoSubmitTriggered, questions]);

  
useEffect(() => {
  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        handleSubmit(); // auto submit on timeout
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  return () => clearInterval(timer);
}, []);


useEffect(() => {
  const disableCopyPaste = (e) => {
    e.preventDefault();
    alert("❌ Copy-Paste is disabled during the test.");
  };

  document.addEventListener('copy', disableCopyPaste);
  document.addEventListener('paste', disableCopyPaste);
  document.addEventListener('cut', disableCopyPaste);

  return () => {
    document.removeEventListener('copy', disableCopyPaste);
    document.removeEventListener('paste', disableCopyPaste);
    document.removeEventListener('cut', disableCopyPaste);
  };
}, []);

useEffect(() => {
  const disableRightClick = (e) => {
    e.preventDefault();
    alert("❌ Right-click is disabled during the test.");
  };

  document.addEventListener('contextmenu', disableRightClick);
  return () => {
    document.removeEventListener('contextmenu', disableRightClick);
  };
}, []);


const handleAnswer = (qId, option) => {
    // setAnswers({ ...answers, [qId]: option });
    // setUserAnswers({ ...answers, [qId]: option });
    // setStatusMap({ ...statusMap, [qId]: 'Answered' });
   
  setAnswers(prev => {
    const updated = { ...prev, [qId]: option };
    setUserAnswers(updated);  // Sync userAnswers directly
    return updated;
  });
  setStatusMap(prev => ({ ...prev, [qId]: 'Answered' }));


  };

const formatTime = (sec) => {
  const min = Math.floor(sec / 60);
  const s = sec % 60;
  return `${min.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};


 const handleSubmit = () => {
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000); // in seconds
    const wrongAnswers = questions.filter(
      q => userAnswers[q.id] && userAnswers[q.id] !== q.correctAnswer
    ).length;

    const resultData = {
      totalQuestions: questions.length,
      attempted: Object.keys(userAnswers).length,
      wrong: wrongAnswers,
      percentage: Math.round(
        ((Object.keys(userAnswers).length - wrongAnswers) / questions.length) * 100
      ),
      duration,
      completedAt: endTime.toLocaleTimeString(),
      examCode: 'EXAM-101',
        questions,            // pass all questions
    userAnswers  
    };

    navigate('/student/courses-exam/result', { state: resultData });
  };

useEffect(() => {
  let blurCount = 0;

  const handleVisibilityChange = () => {
    if (document.hidden) {
      blurCount += 1;

      if (blurCount< 5) {
        const warningsLeft = 5 - blurCount;
        alert(` Do not switch tabs.\nYou have ${warningsLeft} ⚠️warning${warningsLeft === 1 ? '' : 's'} left.`);
      } else {
        alert("❌ Test auto-submitted due to 5 tab switches.");
        setAutoSubmitTriggered(true);

    
    }
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, []);


 

 
  const markReview = (qId) => {
    setStatusMap({ ...statusMap, [qId]: 'Review' });
  };

  const skip = (qId) => {
    setStatusMap({ ...statusMap, [qId]: 'Skipped' });
    setCurrent((prev) => (prev + 1) % questions.length);
  };

  const goToQuestion = (index) => {
    setCurrent(index);
    const qId = questions[index].id;
    if (statusMap[qId] === 'Not Visited') {
      setStatusMap({ ...statusMap, [qId]: 'Visited' });
    }
  };

  if (questions.length === 0) return <div></div>;

  const currentQuestion = questions[current];
  const selected = answers[currentQuestion.id];



  return (
    <div className="app-container">
      <div className="question-area">
        <h3 className='heading'>Question</h3>
        <h3>Q{current + 1}: {currentQuestion.question}</h3>
        <div className="options">
          {currentQuestion.options.map((opt, i) => (
            <label key={i} className="option">
              <input
                type="radio"
                checked={selected === opt}
                onChange={() => handleAnswer(currentQuestion.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
        <div className="btns">
          <button onClick={() => markReview(currentQuestion.id)}>Mark for Review</button>
          <button onClick={() => skip(currentQuestion.id)}>Skip</button>
          <button onClick={() => setCurrent((prev) => (prev + 1) % questions.length)}>Next</button>
        </div>
      </div>
     <div className="sidebar">
  <h2>All Questions</h2>
  <div className="questions-grid">
    {questions.map((q, i) => (
      <div
        key={q.id}
        className={`q-btn ${statusMap[q.id]?.toLowerCase()}`}
        onClick={() => goToQuestion(i)}
      >
        {i + 1}
      </div>
    ))}
  </div>
</div>
<div className="bottom-bar">
  <span>Time Left: {formatTime(timeLeft)}</span>
  <button onClick={handleSubmit} className="submit-btn">Submit Test</button>
</div>

</div>
  );
};

export default TestPage;
