// src/components/PracticeQuiz/PracticeQuiz.js
import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import QuizGenerator from '../QuizGenerator';
import QuizSession from '../QuizSession';
import Sidebar from '../Sidebar';
import logo from '../../assests/logo.png';
import './PracticeQuiz.css';

function PracticeQuiz() {
  const { currentUser, logout } = useContext(AuthContext);
  const [quizHistory, setQuizHistory] = useState([]);
  const [quizActive, setQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState({
    questions: [],
    modelAnswers: [],
    currentQuestion: 0,
    totalScore: 0,
    questionType: null,
    currentTopic: "",
    currentScore: 0,
    currentFeedback: "",
    answerSubmitted: false
  });

  // Fetch quiz history from the server when component mounts
  React.useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizHistory(data.quizHistory);
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    }
  };

  const resetQuiz = async () => {
    // Save quiz results to server before resetting if quiz was active
    if (quizActive) {
      const maxScore = currentQuiz.questions.length * 10;
      const percentage = (currentQuiz.totalScore / maxScore) * 100;
      
      const quizResult = {
        topic: currentQuiz.currentTopic,
        questionType: currentQuiz.questionType,
        type: currentQuiz.questionType, // Keep this for backward compatibility
        score: currentQuiz.totalScore,
        maxScore: maxScore,
        date: new Date().toLocaleDateString(),
        percentage: percentage || 0
      };
      
      try {
        const token = localStorage.getItem('token');
        await fetch('/api/save-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(quizResult)
        });
        
        // Refresh quiz history after saving
        await fetchQuizHistory();
      } catch (error) {
        console.error('Error saving quiz:', error);
      }
    }
    
    // Reset quiz state
    setQuizActive(false);
    setCurrentQuiz({
      questions: [],
      modelAnswers: [],
      currentQuestion: 0,
      totalScore: 0,
      questionType: null,
      currentTopic: "",
      currentScore: 0,
      currentFeedback: "",
      answerSubmitted: false
    });
  };
  
  const startQuiz = (questions, modelAnswers, questionType, topic) => {
    setCurrentQuiz({
      questions,
      modelAnswers,
      currentQuestion: 0,
      totalScore: 0,
      questionType,
      currentTopic: topic,
      currentScore: 0,
      currentFeedback: "",
      answerSubmitted: false
    });
    setQuizActive(true);
  };

  const handleNextQuestion = () => {
    setCurrentQuiz(prev => ({
      ...prev,
      currentQuestion: prev.currentQuestion + 1,
      answerSubmitted: false,
      currentFeedback: ""
    }));
  };

  const handleSubmitAnswer = async (answer) => {
    try {
      let score, feedback;
      const currentQ = currentQuiz.currentQuestion;
      
      // Send the answer to the backend for evaluation
      const token = localStorage.getItem('token');
      const response = await fetch('/api/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          questionType: currentQuiz.questionType,
          question: currentQuiz.questions[currentQ],
          answer: answer,
          modelAnswer: currentQuiz.questionType === "MCQ" ? null : currentQuiz.modelAnswers[currentQ][1]
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }
      
      const result = await response.json();
      score = result.score;
      feedback = result.feedback;
      
      // Update state with the evaluation results
      setCurrentQuiz(prev => ({
        ...prev,
        totalScore: prev.totalScore + score,
        currentScore: score,
        currentFeedback: feedback,
        answerSubmitted: true
      }));
      
      return true;
    } catch (error) {
      console.error('Error evaluating answer:', error);
      return false;
    }
  };

  return (
    <div className="app-container">
      <Sidebar quizHistory={quizHistory} />
      
      <div className="main-content">
        <header className="app-header">
                              <img src={logo} alt="LEAP Logo" className="app-logo" />
                              <div className="header-content">
                                <h1 style={{ color: 'white' }}> Practice Makes Perfect! </h1>
                                <div className="header-links">
                                <Link to="/dashboard" className="nav-link dashboard-link" style={{ backgroundColor: ' #BA8E23' }}>Dashboard</Link>
                                  <Link to="/practice-quiz" className="nav-link practice-link">Practice Quiz</Link>
                                  <Link to="/quiz-taker" className="nav-link exam-link">Take Exam</Link>
                                  <Link 
                      to="/flash-cards" 
                      className="nav-link exam-link" 
                      style={{ backgroundColor: 'purple' }}
                    >
                      Create Flash Cards
                    </Link>
                                  <button onClick={logout} className="logout-btn">Logout</button>
                                </div>
                              </div>
                            </header>
        
        <hr />
        
        <div className="practice-container">
          {!quizActive ? (
            <>
              <div className="practice-intro">
          
                <p>Select a topic and question type below to start practicing. 
                   Get instant feedback on your answers and track your progress.</p>
              </div>
              <QuizGenerator startQuiz={startQuiz} />
            </>
          ) : (
            <QuizSession 
              currentQuiz={currentQuiz}
              handleSubmitAnswer={handleSubmitAnswer}
              handleNextQuestion={handleNextQuestion}
              resetQuiz={resetQuiz}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default PracticeQuiz;