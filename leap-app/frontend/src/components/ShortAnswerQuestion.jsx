// src/components/ShortAnswerQuestion.js
import React from 'react';
import './ShortAnswerQuestion.css';

function ShortAnswerQuestion({ question, answer, setAnswer, answerSubmitted }) {
  return (
    <div className="short-answer-question">
      <h2 className="question-text">{question}</h2>
      
      <textarea
        className="answer-input"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        disabled={answerSubmitted}
        rows={6}
      />
    </div>
  );
}

export default ShortAnswerQuestion;