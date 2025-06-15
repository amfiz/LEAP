// src/App.js
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './contexts/AuthContext';

// Components
import Dashboard from './components/Dashboard/Dashboard';
import PracticeQuiz from './components/PracticeQuiz/PracticeQuiz';
import QuizTaker from './components/QuizTaker/QuizTaker';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Home from './components/Home/Home';
import FlashCards from './components/FlashCards/FlashCards';

import './App.css';

// Protected route component to restrict access to authenticated users
const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  
  // Show loading state while checking authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/practice-quiz" 
            element={
              <ProtectedRoute>
                <PracticeQuiz />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/quiz-taker" 
            element={
              <ProtectedRoute>
                <QuizTaker />
              </ProtectedRoute>
            } 
          />
          <Route path="/flash-cards" element={
            <ProtectedRoute>
              <FlashCards />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;