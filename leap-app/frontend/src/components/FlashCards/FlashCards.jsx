// src/components/FlashCards/FlashCards.js
import React, { useState, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import FlashCardItem from './FlashCardItem';
import logo from '../../assests/logo.png';
import './FlashCards.css';

function FlashCards() {
  const { logout } = useContext(AuthContext);
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [flashCards, setFlashCards] = useState([]);
  const [error, setError] = useState('');
  const [activeCard, setActiveCard] = useState(0);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setError('');
    } else {
      setFile(null);
      setFileName('');
      setError('Please select a PDF file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setFileName(droppedFile.name);
      setError('');
    } else {
      setError('Please drop a PDF file.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a PDF file first.');
      return;
    }
    
    try {
      setUploading(true);
      setError('');
      
      // Create form data
      const formData = new FormData();
      formData.append('pdf', file);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/generate-flashcards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to process PDF');
      }
      
      setUploading(false);
      setProcessing(true);
      
      // Poll for status until processing is complete
      const checkStatus = async (jobId) => {
        const statusResponse = await fetch(`/api/flashcard-status/${jobId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const statusData = await statusResponse.json();
        
        if (statusData.status === 'completed') {
          setProcessing(false);
          setFlashCards(statusData.flashcards);
        } else if (statusData.status === 'failed') {
          setProcessing(false);
          setError(statusData.message || 'Failed to generate flashcards');
        } else {
          // Still processing, check again in 2 seconds
          setTimeout(() => checkStatus(jobId), 2000);
        }
      };
      
      // Start polling
      checkStatus(data.jobId);
      
    } catch (error) {
      setUploading(false);
      setProcessing(false);
      setError(error.message || 'An error occurred while uploading the file');
    }
  };

  const nextCard = () => {
    if (activeCard < flashCards.length - 1) {
      setActiveCard(activeCard + 1);
    }
  };

  const prevCard = () => {
    if (activeCard > 0) {
      setActiveCard(activeCard - 1);
    }
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setFlashCards([]);
    setError('');
    setActiveCard(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flashcards-container">
     
      <header className="app-header">
                            <img src={logo} alt="LEAP Logo" className="app-logo" />
                            <div className="header-content">
                              <h1 style={{ color: 'white' }}> Summarize your PDF's with LEAP! </h1>
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

      <div className="flashcards-content">
        {flashCards.length === 0 ? (
          <div className="upload-section">
            <h2>Create Flash Cards from Your PDF</h2>
            <p>Upload a PDF document to generate summarized flash cards</p>
            
            <form onSubmit={handleSubmit}>
              <div 
                className="drop-area" 
                onDragOver={handleDragOver} 
                onDrop={handleDrop}
                onClick={() => fileInputRef.current && fileInputRef.current.click()}
              >
                <div className="drop-icon">📄</div>
                <p>Drag & drop your PDF here or click to browse</p>
                {fileName && <p className="file-name">Selected: {fileName}</p>}
                <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={handleFileChange} 
                  style={{ display: 'none' }} 
                  ref={fileInputRef}
                />
              </div>
              
              {error && <div className="error-message">{error}</div>}
              
              <button 
                type="submit" 
                className="upload-btn" 
                disabled={!file || uploading || processing}
              >
                {uploading ? 'Uploading...' : processing ? 'Generating Flash Cards...' : 'Create Flash Cards'}
              </button>
            </form>
          </div>
        ) : (
          <div className="flashcards-display">
            <div className="controls">
              <span className="card-counter">{activeCard + 1} / {flashCards.length}</span>
              <button onClick={resetForm} className="new-pdf-btn">Use Another PDF</button>
            </div>
            
                          <div className="card-container">
                <button 
                  className="nav-btn prev-btn" 
                  onClick={prevCard} 
                  disabled={activeCard === 0}
                >
                  ←
                </button>
                
                <div className="cards-wrapper">
                  {flashCards.map((card, index) => (
                    <FlashCardItem 
                      key={index}
                      card={card}
                      index={index}
                      isActive={index === activeCard}
                    />
                  ))}
                </div>
                
                <button 
                  className="nav-btn next-btn" 
                  onClick={nextCard} 
                  disabled={activeCard === flashCards.length - 1}
                >
                  →
                </button>
              </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FlashCards;