// MCQQuestion.jsx
import React, { useState, useEffect } from 'react';
import './MCQQuestion.css';

function MCQQuestion({ question, answerSubmitted, setAnswer }) {
  const [selectedOption, setSelectedOption] = useState('');
  
  const handleOptionChange = (option) => {
    setSelectedOption(option);
    setAnswer(option);
  };
  
  // Reset selected option when question changes
  useEffect(() => {
    setSelectedOption('');
  }, [question]);
  
  if (!question) {
    return <div>Loading question...</div>;
  }
  
  // Handle case where options is undefined or not an object
  if (!question.options || typeof question.options !== 'object') {
    console.error("Invalid question format - options missing or invalid:", question);
    return (
      <div className="mcq-question">
        <div className="question-text">{question.question || "Question not available"}</div>
        <div className="error-message">Error: Question options are not properly formatted.</div>
      </div>
    );
  }
  
  // Convert options to array for rendering if it's not already
  const optionsArray = Array.isArray(question.options)
    ? question.options.map((opt, i) => [String.fromCharCode(65 + i), opt]) // Convert to [letter, text] format
    : Object.entries(question.options);
  
  return (
    <div className="mcq-question">
      <div className="question-text">{question.question}</div>
      <div className="options-container">
        {optionsArray.map(([letter, option]) => (
          <div key={letter} className="option">
            <label className={selectedOption === letter ? 'selected' : ''}>
              <input
                type="radio"
                name="mcq-option"
                value={letter}
                checked={selectedOption === letter}
                onChange={() => handleOptionChange(letter)}
                disabled={answerSubmitted}
              />
              <span className="option-letter">{letter}</span>
              <span className="option-text">{option}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MCQQuestion;