// src/components/QuizSession/index.js
import React, { useState } from 'react';
import './QuizSession.css';

function QuizSession({ currentQuiz, handleSubmitAnswer, handleNextQuestion, resetQuiz }) {
  const [mcqAnswer, setMcqAnswer] = useState('');
  const [shortAnswer, setShortAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const answer = currentQuiz.questionType === 'MCQ' ? mcqAnswer : shortAnswer;
    
    console.log(`Submitting answer for ${currentQuiz.questionType} question:`, answer);
    
    const success = await handleSubmitAnswer(answer);
    
    setIsSubmitting(false);
    
    if (success) {
      // Reset form state after successful submission
      setMcqAnswer('');
      setShortAnswer('');
    }
  };

  // All questions completed
  if (currentQuiz.questions.length === 0 || 
      currentQuiz.currentQuestion >= currentQuiz.questions.length) {
    return (
      <div className="quiz-completed">
        <h2>Quiz Completed!</h2>
        <div className="quiz-results">
          <p>Your final score: {currentQuiz.totalScore} / {currentQuiz.questions.length * 10}</p>
          <p>Topic: {currentQuiz.currentTopic}</p>
          <p>Question Type: {currentQuiz.questionType === 'MCQ' ? 'Multiple Choice' : 'Short Answer'}</p>
        </div>
        <button className="primary-button" onClick={resetQuiz}>
          Start New Quiz
        </button>
      </div>
    );
  }

  // Get current question
  const currQ = currentQuiz.currentQuestion;
  const question = currentQuiz.questions[currQ];
  
  // For debugging
  console.log("Current question:", question);

  // Render MCQ question
  if (currentQuiz.questionType === 'MCQ') {
    // Make sure we have valid options to display
    let options = {};
    
    // Handle different possible formats of options
    if (question && question.options) {
      if (Array.isArray(question.options)) {
        // If options is an array, convert to object with A, B, C, D keys
        options = question.options.reduce((obj, option, index) => {
          const key = String.fromCharCode(65 + index); // A, B, C, D, etc.
          obj[key] = option;
          return obj;
        }, {});
      } else if (typeof question.options === 'object') {
        // If options is already an object, use it directly
        options = question.options;
      }
    } else {
      console.error("Invalid question format - options missing:", question);
    }
    
    return (
      <div className="quiz-session">
        <div className="quiz-progress">
          <p style={{ color: 'black' }} >Question {currQ + 1} of {currentQuiz.questions.length}</p>
          <p  style={{ color: 'black' }}>Score: {currentQuiz.totalScore}</p>
        </div>
        
        <div className="quiz-question">
          <h3  style={{ color: 'black' }}>{question.question || `Question ${currQ + 1}`}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mcq-options">
              {Object.entries(options).map(([key, value]) => (
                <div className="mcq-option" key={key}>
                  <input
                    type="radio"
                    id={`option-${key}`}
                    name="mcq-answer"
                    value={key}
                    checked={mcqAnswer === key}
                    onChange={() => setMcqAnswer(key)}
                    disabled={currentQuiz.answerSubmitted}
                  />
                  <label htmlFor={`option-${key}`}>
                    {key}: {value}
                  </label>
                </div>
              ))}
            </div>
            
            {currentQuiz.answerSubmitted ? (
              <div className="feedback-container">
                <div className={`feedback ${currentQuiz.currentScore > 0 ? 'correct' : 'incorrect'}`}>
                  {currentQuiz.currentFeedback}
                </div>
                <button 
                  type="button" 
                  onClick={handleNextQuestion}
                  className="next-button"
                >
                  {currQ < currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            ) : (
              <button 
                type="submit" 
                disabled={!mcqAnswer || isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Checking...' : 'Submit Answer'}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  } 
  // Render Short Answer question
  else {
    return (
      <div className="quiz-session">
        <div className="quiz-progress">
          <p  style={{ color: 'black' }}>Question {currQ + 1} of {currentQuiz.questions.length}</p>
          <p  style={{ color: 'black' }}>Score: {currentQuiz.totalScore}</p>
        </div>
        
        <div className="quiz-question">
          <h3  style={{ color: 'black' }}>{question || `Question ${currQ + 1}`}</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="short-answer">
              <textarea
                placeholder="Type your answer here..."
                value={shortAnswer}
                onChange={(e) => setShortAnswer(e.target.value)}
                disabled={currentQuiz.answerSubmitted}
                rows={6}
              />
            </div>
            
            {currentQuiz.answerSubmitted ? (
              <div className="feedback-container">
                <div className={`feedback ${currentQuiz.currentScore > 0 ? 'correct' : 'incorrect'}`}>
                  <p>Score: {currentQuiz.currentScore}/10</p>
                  <p>{currentQuiz.currentFeedback}</p>
                  {currentQuiz.modelAnswers && currentQuiz.modelAnswers[currQ] && (
                    <div className="model-answer">
                      <h4>Model Answer:</h4>
                      <p>{currentQuiz.modelAnswers[currQ][1]}</p>
                    </div>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={handleNextQuestion}
                  className="next-button"
                >
                  {currQ < currentQuiz.questions.length - 1 ? 'Next Question' : 'See Results'}
                </button>
              </div>
            ) : (
              <button 
                type="submit" 
                disabled={!shortAnswer.trim() || isSubmitting}
                className="submit-button"
              >
                {isSubmitting ? 'Checking...' : 'Submit Answer'}
              </button>
            )}
          </form>
        </div>
      </div>
    );
  }
}

export default QuizSession;