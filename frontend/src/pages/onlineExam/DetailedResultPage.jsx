import React from 'react';
import { useLocation } from 'react-router-dom';
import './ResultPage.css';

const DetailedResultPage = () => {
  const { state } = useLocation();

  if (!state || !state.questions || !state.userAnswers) {
    return <p className="text-center mt-10 text-red-500">No question data found</p>;
  }

  // Utility: Strip HTML from strings
  const stripHtml = (html) => {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  };

  // Check correctness
  const isAnswerCorrect = (question) => {
    const userAns = state.userAnswers[question._id];
    if (!userAns) return false;

    const correctLabels = question.correctAnswers.map((a) =>
      typeof a === 'string' ? a : a.label
    ).sort().join(',');

    const userLabels = (Array.isArray(userAns) ? userAns : [userAns])
      .map((a) => (typeof a === 'string' ? a : a.label))
      .sort()
      .join(',');

    return correctLabels === userLabels;
  };

  // Check if selected
  const isSelected = (label, userAns) => {
    if (!userAns) return false;
    if (Array.isArray(userAns)) {
      return userAns.some((ans) =>
        typeof ans === 'string' ? ans === label : ans.label === label
      );
    }
    return typeof userAns === 'string' ? userAns === label : userAns.label === label;
  };

  // Format Answers
  const formatAnswers = (answers, options) => {
    if (!answers) return 'Skipped';

    const ansArray = Array.isArray(answers) ? answers : [answers];

    return ansArray
      .map((ans) => {
        const label = typeof ans === 'string' ? ans : ans.label;
        const option = options.find((opt) => opt.label === label);
        return (
          <span key={label} className="block mb-1">
            <strong>{label}:</strong> {option?.text && <span dangerouslySetInnerHTML={{ __html: option.text }} />}
            {option?.image && <img src={option.image} alt={`Option ${label}`} className="h-24 mt-1 rounded" />}
          </span>
        );
      });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Detailed Result Review</h1>

        {state.questions.map((q, index) => {
          const userAns = state.userAnswers[q._id];
          const correct = isAnswerCorrect(q);

          return (
            <div
              key={q._id}
              className="mb-6 bg-white p-4 shadow rounded-md border border-gray-200"
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-semibold text-gray-800">
                  Q{index + 1}. <span dangerouslySetInnerHTML={{ __html: q.questionText }} />
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    correct
                      ? 'bg-green-100 text-green-700'
                      : userAns
                      ? 'bg-red-100 text-red-600'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {correct ? 'Correct ✔' : userAns ? 'Wrong ✘' : 'Skipped ⚪'}
                </span>
              </div>

              {q.image && (
                <img
                  src={q.image}
                  alt="Question"
                  className="max-w-xs my-2 rounded"
                />
              )}

              {/* Options */}
              <div className="grid gap-2 mb-3">
                {q.options.map((opt, idx) => {
                  const isCorrect = q.correctAnswers.some((a) =>
                    typeof a === 'string' ? a === opt.label : a.label === opt.label
                  );
                  const isUserSelected = isSelected(opt.label, userAns);

                  return (
                    <div
                      key={idx}
                      className={`px-3 py-2 rounded border text-sm ${
                        isCorrect
                          ? 'bg-green-100 border-green-400'
                          : isUserSelected
                          ? 'bg-red-100 border-red-400'
                          : 'bg-gray-50 border-gray-300'
                      }`}
                    >
                      <strong>{opt.label}:</strong>{" "}
                      <span dangerouslySetInnerHTML={{ __html: opt.text }} />
                      {opt.image && (
                        <img
                          src={opt.image}
                          alt={`Option ${opt.label}`}
                          className="h-20 mt-2 rounded"
                        />
                      )}
                      {isCorrect && (
                        <span className="ml-2 text-green-600 font-semibold">
                          ✓ Correct
                        </span>
                      )}
                      {isUserSelected && !isCorrect && (
                        <span className="ml-2 text-red-600 font-semibold">
                          ✗ Your Choice
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Answers */}
              <p className="text-sm text-gray-800 mb-1">
                <strong>Your Answer:</strong>
                <div className="ml-2">{formatAnswers(userAns, q.options)}</div>
              </p>

              <p className="text-sm text-gray-800 mb-2">
                <strong>Correct Answer:</strong>
                <div className="ml-2">{formatAnswers(q.correctAnswers, q.options)}</div>
              </p>

              {/* Explanation */}
              {q.explanation && (
                <div className="mt-2 bg-blue-50 p-3 rounded text-sm text-gray-700">
                  <strong>Explanation:</strong>{" "}
                  <span dangerouslySetInnerHTML={{ __html: q.explanation }} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DetailedResultPage;
