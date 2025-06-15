import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ quizHistory }) {
  // State to track which quiz items are expanded
  const [expandedQuizzes, setExpandedQuizzes] = useState({});
  
  // Calculate overall performance metrics
  const averageScore = quizHistory.length > 0
    ? quizHistory.reduce((sum, quiz) => sum + quiz.percentage, 0) / quizHistory.length
    : 0;
    
  const totalQuizzes = quizHistory.length;
  
  // Toggle expanded state for a quiz item
  const toggleQuizExpand = (index) => {
    setExpandedQuizzes(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Helper function to get a property value with fallbacks
  const getQuizProperty = (quiz, keys, defaultValue = "N/A") => {
    for (let key of keys) {
      if (quiz[key] !== undefined && quiz[key] !== null) {
        return quiz[key];
      }
    }
    return defaultValue;
  };
  
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <span role="img" aria-label="chart">📊</span> Quiz History
      </div>
      
      {quizHistory.length > 0 ? (
        <>
          <div className="performance-card">
            <h3 className="section-title">Overall Performance</h3>
            
            <div className="metric">
              <div className="metric-label">Average Score</div>
              <div className="metric-value">{averageScore.toFixed(1)}%</div>
            </div>
            
            <div className="metric">
              <div className="metric-label">Total Quizzes Taken</div>
              <div className="metric-value">{totalQuizzes}</div>
            </div>
          </div>
          
          <h3 className="section-title">Previous Quizzes</h3>
          
          <div className="quiz-history-list">
            {quizHistory.slice().reverse().map((quiz, index) => (
              <div className="quiz-item" key={index}>
                <div
                  className="quiz-item-header"
                  onClick={() => toggleQuizExpand(index)}
                >
                  <span className="expand-icon">
                    {expandedQuizzes[index] ? '▼' : '▶'}
                  </span>
                  Quiz {index + 1}: {getQuizProperty(quiz, ['topic'])}
                </div>
                
                {expandedQuizzes[index] && (
                  <div className="quiz-item-details">
                    <div className="detail-item">Date: {getQuizProperty(quiz, ['date', 'date_taken'])}</div>
                    <div className="detail-item">Type: {getQuizProperty(quiz, ['type', 'questionType', 'question_type'])}</div>
                    <div className="detail-item">Score: {getQuizProperty(quiz, ['score'])}/{getQuizProperty(quiz, ['maxScore', 'max_score'])}</div>
                    <div className="detail-item">Percentage: {getQuizProperty(quiz, ['percentage'], 0).toFixed(1)}%</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="empty-state">
          No quiz history yet. Complete a quiz to see your results here.
        </div>
      )}
    </div>
  );
}

export default Sidebar;