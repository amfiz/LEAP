import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Register.css';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    grade: '',
    phone_number: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };
  const goToHome = () => {
    navigate('/');
  };
  
  const validateForm = () => {
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Check if required fields are filled
    if (!formData.username || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password strength (at least 8 characters)
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const { success, message } = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        grade: formData.grade,
        phone_number: formData.phone_number
      });
      
      if (success) {
        navigate('/login', { state: { registrationSuccess: true } });
      } else {
        setError(message || 'Registration failed');
      }
    } catch (error) {
      setError('An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="register-page">
      <button className="back-button" onClick={goToHome}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back to Home
      </button>
      <div className="register-container">
        <div className="left-section">
          <div className="logo">
            <img src="/logo.png" alt="LEAP" className="leap-logo" />
          </div>
          
          <div className="left-content">
            <h1>Create<br />New Account</h1>
            <p className="login-link">Already Registered? <Link to="/login">Login</Link></p>
            
            <div className="divider"></div>
            
            <p className="description">Create an Account today to Learn and Grow with us!</p>
            
           <button
  className="learn-more-btn"
  onClick={() => window.location.href = "/features"}
  style={{ marginLeft: '-10px' }}
>
  Learn More
</button>
          </div>
        </div>
        
        <div className="right-section">
          <div className="signup-form-container">
            <h2>Sign up</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="signup-form">
              <div className="form-group">
                <label htmlFor="username">NAME</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">EMAIL</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">PASSWORD</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">RE-ENTER PASSWORD</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••••"
                  required
                />
              </div>
              
             
              <div className="form-group">
                <label htmlFor="phone_number">Phone Number (Optional)</label>
                <input
                  type="tel"
                  id="phone_number"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
              
              <button 
                type="submit" 
                className="signup-button"
                disabled={loading}
              >
                {loading ? "Registering..." : "Sign Up"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;