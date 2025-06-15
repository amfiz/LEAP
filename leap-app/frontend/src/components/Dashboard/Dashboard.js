// src/components/Dashboard/Dashboard.js
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import Sidebar from '../Sidebar';
import logo from '../../assests/logo.png';
import './Dashboard.css';

function Dashboard() {
  const { currentUser, logout } = useContext(AuthContext);
  const [quizHistory, setQuizHistory] = useState([]);
  const [recentScores, setRecentScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topicPerformance, setTopicPerformance] = useState({});
  const [skillBreakdown, setSkillBreakdown] = useState([]);
  const [progressTrend, setProgressTrend] = useState([]);
  const [studyStreak, setStudyStreak] = useState(0);

  // Fetch quiz history from the server when component mounts
  useEffect(() => {
    fetchQuizHistory();
  }, []);

  const fetchQuizHistory = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('/api/quiz-history', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setQuizHistory(data.quizHistory);
        
        // Get the 5 most recent quiz scores for the dashboard display
        const sortedHistory = [...data.quizHistory].sort((a, b) => {
          return new Date(b.date) - new Date(a.date);
        }).slice(0, 5);
        
        setRecentScores(sortedHistory);
        
        // Process data for visualizations
        processPerformanceData(data.quizHistory);
      }
    } catch (error) {
      console.error('Error fetching quiz history:', error);
    } finally {
      setLoading(false);
    }
  };

  const processPerformanceData = (history) => {
    // Calculate performance by topic
    const topicData = {};
    history.forEach(item => {
      if (!topicData[item.topic]) {
        topicData[item.topic] = {
          attempts: 0,
          totalScore: 0,
          averageScore: 0,
        };
      }
      topicData[item.topic].attempts += 1;
      topicData[item.topic].totalScore += item.percentage;
      topicData[item.topic].averageScore = Math.round(topicData[item.topic].totalScore / topicData[item.topic].attempts);
    });
    setTopicPerformance(topicData);

    // Calculate skill breakdown
    const skills = [
      { name: 'Grammar', value: 0 },
      { name: 'Vocabulary', value: 0 },
      { name: 'Reading', value: 0 },
      { name: 'Writing', value: 0 },
      { name: 'Listening', value: 0 }
    ];
    
    // Set skill values based on topic performances
    // This is a simplified approach; in a real app, you'd map topics to skills more precisely
    Object.entries(topicData).forEach(([topic, data]) => {
      if (topic.toLowerCase().includes('grammar')) {
        skills[0].value = data.averageScore;
      } else if (topic.toLowerCase().includes('vocabulary') || topic.toLowerCase().includes('vocab')) {
        skills[1].value = data.averageScore;
      } else if (topic.toLowerCase().includes('reading') || topic.toLowerCase().includes('comprehension')) {
        skills[2].value = data.averageScore;
      } else if (topic.toLowerCase().includes('writing')) {
        skills[3].value = data.averageScore;
      } else if (topic.toLowerCase().includes('listening')) {
        skills[4].value = data.averageScore;
      }
    });
    
    // Fill in missing skill values with reasonable defaults
    skills.forEach(skill => {
      if (skill.value === 0) {
        // If no data for a skill, just set a placeholder value
        // In a real app, you might want to exclude these or mark them as "no data"
        skill.value = Math.floor(Math.random() * 40) + 30;
      }
    });
    
    setSkillBreakdown(skills);

    // Calculate progress trend (last 7 quizzes or less)
    const progressData = history.slice(0, 7).reverse().map((item, index) => {
      return {
        name: `Quiz ${index + 1}`,
        score: item.percentage,
        topic: item.topic
      };
    });
    setProgressTrend(progressData);

    // Calculate study streak (days in a row with at least one quiz)
    // For demo purposes, we'll calculate this based on dummy data
    // In a real app, you'd use actual login/activity data
    setStudyStreak(calculateStreak(history));
  };

  const calculateStreak = (history) => {
    // This is a simplified version for demo purposes
    // In a real app, you'd check for consecutive days with activity
    if (history && history.length > 0) {
      // Return a number between 1 and 14 based on the amount of quiz history
      return Math.min(Math.max(1, Math.floor(history.length / 2)), 14);
    }
    return 0;
  };

  // Colors for charts
  const COLORS = ['#2196F3', '#4CAF50', '#9C27B0', '#FF5722', '#FFC107'];

  return (
    <div className="app-container">
      <div className="main-content">
        <header className="app-header">
                              <img src={logo} alt="LEAP Logo" className="app-logo" />
                              <div className="header-content">
                                <h1 style={{ color: 'white' }}>Welcome to LEAP, {currentUser.username}! 📚</h1>
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
        
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Your Learning Dashboard</h2>
            
            {/* Performance Summary Section */}
            <div className="performance-summary">
              <h3>Performance Overview</h3>
              <div className="summary-charts">
                {/* Streak Counter */}
                <div className="chart-container">
                  <h4>Study Streak</h4>
                  <div className="streak-container">
                    <div className="streak-value">{studyStreak}</div>
                    <div className="streak-label">Days in a row</div>
                  </div>
                 
                </div>
                
              
                {/* Performance by Topic */}
                <div className="chart-container">
                  <h4>Performance by Topic</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={Object.keys(topicPerformance).map(topic => ({
                        name: topic.split(' ')[0],
                        score: topicPerformance[topic].averageScore
                      }))}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" tick={{ fill: '#ffffff' }} />
                      <YAxis tick={{ fill: '#ffffff' }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#2196F3" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Progress Trend Line Chart */}
                <div className="chart-container">
                  <h4>Progress Trend</h4>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={progressTrend}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" tick={{ fill: '#ffffff' }} />
                      <YAxis tick={{ fill: '#ffffff' }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="score" stroke="#9C27B0" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            
            <div className="dashboard-cards">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="card-body">
                   <Link to="/practice-quiz" className="dashboard-btn practice">
                    <span className="btn-icon">📝</span>
                    Start Practice Quiz
                  </Link>
                  <Link to="/quiz-taker" className="dashboard-btn exam">
                    <span className="btn-icon">📋</span>
                    Take an Exam
                  </Link>
                  <Link to="/flash-cards" className="dashboard-btn exam"  style={{ backgroundColor: 'purple' }}>
                    <span className="btn-icon">🗂️</span>
                    Create Flash Cards
                  </Link>
                </div>
              </div>
              
           
            </div>
          </div>
          
          <div className="dashboard-section">
            <div className="dashboard-card recommendations">
              <div className="card-header">
                <h3>Recommended Practice</h3>
              </div>
              <div className="card-body">
                <div className="recommendation-topics">
                  <div className="recommendation-topic">
                    <h4>English Essentials</h4>
                    <p>Strengthen your understanding of verb tenses and sentence structure.</p>
                    <Link to="/practice-quiz" className="topic-link">Practice Now</Link>
                  </div>
                  <div className="recommendation-topic">
                    <h4>Physics Knowledge</h4>
                    <p>Improve your ability to understand the Forces of physics.</p>
                    <Link to="/practice-quiz" className="topic-link">Practice Now</Link>
                  </div>
                  <div className="recommendation-topic">
                    <h4>Computer Skills</h4>
                    <p>Expand your computer skills.</p>
                    <Link to="/practice-quiz" className="topic-link">Practice Now</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;