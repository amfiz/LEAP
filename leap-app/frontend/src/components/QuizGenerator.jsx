// QuizGenerator.jsx
import React, { useState } from 'react';
import './QuizGenerator.css';

function QuizGenerator({ startQuiz, onError }) {
  const [topic, setTopic] = useState('');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('MCQ'); // Changed to MCQ to match backend
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // More flexible validation that accepts both section numbers and plain text topics
  const validateTopicFormat = (topic) => {
    // Allow either section number format (e.g., "1.2.3") or plain text topics
    const sectionPattern = /^(\d+(\.\d+)*)$/;
    const trimmedTopic = topic.trim();
    return trimmedTopic !== '' && (sectionPattern.test(trimmedTopic) || trimmedTopic.length >= 3);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateTopicFormat(topic)) {
      setError('Please enter a valid topic (section number like "1.2.3" or at least 3 characters of text)');
      return;
    }

    // Parse number of questions and ensure it's within limits
    const numQuestionsInt = parseInt(numQuestions, 10);
    if (isNaN(numQuestionsInt) || numQuestionsInt < 1) {
      setError('Please enter a valid number of questions (minimum 1)');
      return;
    }

    // Set max questions based on question type
    const maxQuestions = questionType === 'MCQ' ? 5 : 3;
    if (numQuestionsInt > maxQuestions) {
      setError(`Maximum ${maxQuestions} questions allowed for ${questionType === 'MCQ' ? 'multiple choice' : 'short answer'} questions`);
      return;
    }

    setIsLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }
      
      console.log('Sending request with data:', {
        topic,
        questionType,
        numQuestions: numQuestionsInt
      });
      
      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          topic: topic,
          questionType: questionType, // Already uppercase now
          numQuestions: numQuestionsInt
        }),
      });
      
      // Log response status and headers for debugging
      console.log('Response status:', response.status);
      console.log('Response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to generate questions: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('Quiz data received:', data);

      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions were generated. Please try a different topic.');
      }

      // Validate questions format for MCQ type
      if (questionType === 'MCQ') {
        data.questions.forEach((question, index) => {
          console.log(`Question ${index + 1}:`, question);
          if (!question.question || !question.options || !question.correct_answer) {
            console.error(`Question ${index + 1} has incorrect format:`, question);
          }
        });
      }

      startQuiz(data.questions, data.modelAnswers, questionType, topic);
    } catch (error) {
      console.error('Error generating quiz:', error);
      setError(error.message || 'Failed to generate questions. Please try again.');
      onError && onError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="quiz-generator">
      <h2>Generate Quiz Questions</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Topic:
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter section number (e.g., 1.2.3) or topic description"
              required
            />
          </label>
          <div className="input-help">
            Enter a specific section number from your textbook (e.g., "1.2.3") or a topic description (minimum 3 characters)
          </div>
        </div>
        
        <div className="form-group">
          <label>
            Question Type:
            <select
              value={questionType}
              onChange={(e) => {
                setQuestionType(e.target.value);
                // Reset number of questions to default based on type
                setNumQuestions(e.target.value === 'MCQ' ? 5 : 3);
              }}
            >
              <option value="MCQ" style={{ color: "#1a1a1a" }}>Multiple Choice</option>
              <option value="SHORT_ANSWER" style={{ color: "#1a1a1a" }}>Short Answer</option>
            </select>
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Number of Questions:
            <input
              type="number"
              value={numQuestions}
              onChange={(e) => setNumQuestions(e.target.value)}
              min="1"
              max={questionType === 'MCQ' ? 5 : 3}
              required
            />
          </label>
          <div className="input-help">
            Maximum {questionType === 'MCQ' ? '5' : '3'} questions for {questionType === 'MCQ' ? 'multiple choice' : 'short answer'} type
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <button 
          type="submit" 
          disabled={isLoading || !topic}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Generating...' : 'Generate Quiz'}
        </button>
      </form>
    </div>
  );
}

export default QuizGenerator;