import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';
import './TestPage.css';

// Utility to clean HTML
const stripHtml = (html) => {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
};

const TestPage = () => {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [statusMap, setStatusMap] = useState({});
  const [userAnswers, setUserAnswers] = useState({});
  const [startTime] = useState(new Date());
  const [autoSubmitTriggered, setAutoSubmitTriggered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour

  const navigate = useNavigate();
  const { examId } = useParams();

  // Fetch questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/questions/byExam/${examId}`);
        setQuestions(res.data);

        const initialStatus = {};
        res.data.forEach(q => initialStatus[q._id] = 'Not Visited');
        setStatusMap(initialStatus);
      } catch (err) {
        console.error('❌ Failed to load questions:', err);
      }
    };

    if (examId) fetchQuestions();
  }, [examId]);

  // Auto submit on tab-switches
  useEffect(() => {
    if (autoSubmitTriggered && questions.length > 0) {
      handleSubmit();
    }
  }, [autoSubmitTriggered, questions]);

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Block copy/paste/cut
  useEffect(() => {
    const blockAction = (e) => {
      e.preventDefault();
      alert('❌ Copy, paste, and cut are disabled during the test.');
    };
    document.addEventListener('copy', blockAction);
    document.addEventListener('paste', blockAction);
    document.addEventListener('cut', blockAction);
    return () => {
      document.removeEventListener('copy', blockAction);
      document.removeEventListener('paste', blockAction);
      document.removeEventListener('cut', blockAction);
    };
  }, []);

  // Disable right-click
  useEffect(() => {
    const disableRightClick = (e) => {
      e.preventDefault();
      alert('❌ Right-click is disabled during the test.');
    };
    document.addEventListener('contextmenu', disableRightClick);
    return () => document.removeEventListener('contextmenu', disableRightClick);
  }, []);

  // Detect tab switches
  useEffect(() => {
    let blurCount = 0;
    const handleVisibilityChange = () => {
      if (document.hidden) {
        blurCount++;
        if (blurCount < 5) {
          alert(`⚠️ Do not switch tabs. ${5 - blurCount} warnings left.`);
        } else {
          alert('❌ Test auto-submitted due to tab switches.');
          setAutoSubmitTriggered(true);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleAnswer = (qId, option) => {
    const question = questions.find(q => q._id === qId);
    const isCheckbox = question?.questionType === 'checkbox';

    setAnswers(prev => {
      let updated;
      if (isCheckbox) {
        const current = Array.isArray(prev[qId]) ? prev[qId] : [];
        updated = current.includes(option)
          ? current.filter(o => o !== option)
          : [...current, option];
      } else {
        updated = option;
      }

      setUserAnswers((ua) => ({ ...ua, [qId]: updated }));
      return { ...prev, [qId]: updated };
    });

    setStatusMap(prev => ({ ...prev, [qId]: 'Answered' }));
  };

  const markReview = (qId) => {
    setStatusMap(prev => ({ ...prev, [qId]: 'Review' }));
  };

  const skip = (qId) => {
    setStatusMap(prev => ({ ...prev, [qId]: 'Skipped' }));
    setCurrent(prev => (prev + 1) % questions.length);
  };

  const goToQuestion = (index) => {
    setCurrent(index);
    const qId = questions[index]._id;
    if (statusMap[qId] === 'Not Visited') {
      setStatusMap(prev => ({ ...prev, [qId]: 'Visited' }));
    }
  };

  const formatTime = (sec) => {
    const min = String(Math.floor(sec / 60)).padStart(2, '0');
    const secStr = String(sec % 60).padStart(2, '0');
    return `${min}:${secStr}`;
  };

  const handleSubmit = async () => {
    const endTime = new Date();
    const duration = Math.floor((endTime - startTime) / 1000);
    const studentId = localStorage.getItem("studentId");

    let wrongAnswers = 0;

    questions.forEach((q) => {
      const correct = q.correctAnswers.sort().join(',');
      const user = (Array.isArray(userAnswers[q._id]) ? userAnswers[q._id] : [userAnswers[q._id]])
        .sort().join(',');
      if (correct !== user) {
        wrongAnswers++;
      }
    });

    const resultData = {
      studentId,
      examCode: examId,
      totalQuestions: questions.length,
      attempted: Object.keys(userAnswers).length,
      wrong: wrongAnswers,
      correct: questions.length - wrongAnswers,
      percentage: Math.round(((questions.length - wrongAnswers) / questions.length) * 100),
      duration,
      completedAt: new Date().toISOString(),
      questions,
      userAnswers,
    };

    try {
      const res = await axios.post("http://localhost:8000/api/results/save", resultData);
      navigate('/student/courses-exam/result', {
        state: { ...resultData, attempt: res.data.attempt || 1 },
      });
    } catch (error) {
      console.error("❌ Failed to save result:", error.response?.data || error.message);
      alert("Failed to save result. Try again.");
    }
  };

  if (!questions.length) {
    return <div className="text-center p-6">Loading questions...</div>;
  }

  const currentQuestion = questions[current];
  const selected = answers[currentQuestion._id];

  return (
    <div className="app-container">
      {/* Question Panel */}
      <div className="question-area">
        <h3 className="heading">Question</h3>
        <h3>Q{current + 1}: {stripHtml(currentQuestion.questionText)}</h3>

        <div className="options">
          {currentQuestion.options.map((opt, i) => (
            <label key={i} className="option">
              <input
                type={currentQuestion.questionType === 'checkbox' ? 'checkbox' : 'radio'}
                checked={
                  currentQuestion.questionType === 'checkbox'
                    ? Array.isArray(selected) && selected.includes(opt.label)
                    : selected === opt.label
                }
                onChange={() => handleAnswer(currentQuestion._id, opt.label)}
              />
              {opt.label}. {stripHtml(opt.text)}
            </label>
          ))}
        </div>

        <div className="btns">
          <button onClick={() => markReview(currentQuestion._id)}>Mark for Review</button>
          <button onClick={() => skip(currentQuestion._id)}>Skip</button>
          <button onClick={() => setCurrent((prev) => (prev + 1) % questions.length)}>Next</button>
        </div>
      </div>

      {/* Sidebar Panel */}
      <div className="sidebar">
        <h2>All Questions</h2>
        <div className="questions-grid">
          {questions.map((q, i) => (
            <div
              key={q._id}
              className={`q-btn ${statusMap[q._id]?.toLowerCase()}`}
              onClick={() => goToQuestion(i)}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bottom-bar">
        <span>Time Left: {formatTime(timeLeft)}</span>
        <button onClick={handleSubmit} className="submit-btn">Submit Test</button>
      </div>
    </div>
  );
};

export default TestPage;
