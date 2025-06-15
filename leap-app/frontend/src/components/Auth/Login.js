import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Login.css';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      setError('An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  const goToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="auth-container">
      {/* Decorative elements */}
      <div className="decoration-dots top-right">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="10" cy="10" r="2" fill="white" />
          <circle cx="30" cy="10" r="2" fill="white" />
          <circle cx="50" cy="10" r="2" fill="white" />
          <circle cx="70" cy="10" r="2" fill="white" />
          <circle cx="90" cy="10" r="2" fill="white" />
          <circle cx="110" cy="10" r="2" fill="white" />
          
          <circle cx="10" cy="30" r="2" fill="white" />
          <circle cx="30" cy="30" r="2" fill="white" />
          <circle cx="50" cy="30" r="2" fill="white" />
          <circle cx="70" cy="30" r="2" fill="white" />
          <circle cx="90" cy="30" r="2" fill="white" />
          <circle cx="110" cy="30" r="2" fill="white" />
          
          <circle cx="10" cy="50" r="2" fill="white" />
          <circle cx="30" cy="50" r="2" fill="white" />
          <circle cx="50" cy="50" r="2" fill="white" />
          <circle cx="70" cy="50" r="2" fill="white" />
          <circle cx="90" cy="50" r="2" fill="white" />
          <circle cx="110" cy="50" r="2" fill="white" />
        </svg>
      </div>
      
      <div className="decoration-dots bottom-right">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle cx="10" cy="10" r="2" fill="white" />
          <circle cx="30" cy="10" r="2" fill="white" />
          <circle cx="50" cy="10" r="2" fill="white" />
          <circle cx="70" cy="10" r="2" fill="white" />
          <circle cx="90" cy="10" r="2" fill="white" />
          <circle cx="110" cy="10" r="2" fill="white" />
          
          <circle cx="10" cy="30" r="2" fill="white" />
          <circle cx="30" cy="30" r="2" fill="white" />
          <circle cx="50" cy="30" r="2" fill="white" />
          <circle cx="70" cy="30" r="2" fill="white" />
          <circle cx="90" cy="30" r="2" fill="white" />
          <circle cx="110" cy="30" r="2" fill="white" />
          
          <circle cx="10" cy="50" r="2" fill="white" />
          <circle cx="30" cy="50" r="2" fill="white" />
          <circle cx="50" cy="50" r="2" fill="white" />
          <circle cx="70" cy="50" r="2" fill="white" />
          <circle cx="90" cy="50" r="2" fill="white" />
          <circle cx="110" cy="50" r="2" fill="white" />
        </svg>
      </div>
      
      <button className="back-button" onClick={goToHome}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>

      <div className="auth-content">
        {/* Left side with branding */}
        <div className="auth-branding">
          <div className="logo-container">
            <img src="/logo.png" alt="LEAP Logo" className="logo" />
          </div>
          
          <h1 className="auth-headline">Login</h1>
          <h2 className="auth-subheadline">Sign in to continue</h2>
          
          <div className="divider"></div>
          
          <p className="auth-description">
            Happy to have you! login to see what learning
            opportunities are waiting for you
          </p>
          
          <button
  className="learn-more-btn"
  onClick={() => window.location.href = "/features"}
  style={{ marginLeft: '-10px' }}
>
  Learn More
</button>
        </div>
        
        {/* Right side with form */}
        <div className="auth-form-wrapper">
          <div className="auth-form-container">
            <h2>Sign in</h2>
            
            {error && <div className="auth-error">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        
        <div className="auth-links">
          <p>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
          <p>
            <Link to="/forgot-password">Forgot your password?</Link>
          </p>
        </div>
      </div>
    </div>
      </div>
      
      {/* Footer decoration */}
      <div className="footer-decoration">
        /////////
      </div>
    </div>
  );
}

export default Login;