import React from 'react';
import { Link } from 'react-router-dom';
import Hero from './Hero';
import Features from './Features';
import './Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css';




function Home() {
  return (
    
    <div className="home-container">
      <header className="home-header">
        <div className="logo-container">
          <img src="/logo2.png" alt="LEAP Logo" className="home-logo" />
          <h1>LEAP</h1>
        </div>
        <nav className="home-nav">
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </nav>
        <div className="auth-buttons">
          <Link to="/login" className="login-btn">Login</Link>
          <Link to="/register" className="register-btn">Register</Link>
        </div>
        
      </header>

      <section className="hero-section">
  <div className="hero-content">
    <h1>Online Learning Made Easy for Every Student</h1>
    <p>
      Online learning with LEAP offers accessibility, flexibility, 
      personalization, and collaboration. Students can access course
      materials from anywhere, learn at their own pace, and connect
      with instructors and peers globally, making it a powerful tool for
      enhancing education and skills.
    </p>
    <button className="get-started-btn" onClick={() => window.location.href = "/register"}style={{ marginLeft: '-10px' }} >Get Started</button>
    
  </div>
  <div className="hero-image">
    <div className="floating-elements">
      <div className="element book"></div>
      <div className="element laptop"></div>
      <div className="element graduation-cap"></div>
      <div className="element calculator"></div>
      <div className="element globe"></div>
      <div className="element pencil"></div>
      <div className="element test-paper"></div>
      <div className="element student-card student-1"></div>
      <div className="element student-card student-2"></div>
      <div className="element student-laptop"></div>
    </div>
  </div>
</section>

      <Features />

      <section id="about" className="about-section">
        <div className="about-content">
          <h2>About <span className="highlight">US</span></h2>
          <div className="about-grid">
            <div className="about-text">
              <p>
                LEAP IS A PERSONALIZED LEARNING PLATFORM DESIGNED TO HELP 9TH AND 10TH-GRADE STUDENTS
                EXCEL IN THEIR BOARD EXAMS. OUR MISSION IS TO MAKE EXAM PREPARATION EASY AND ACCESSIBLE, WITH
                INTERACTIVE COURSES IN COMPUTER SCIENCE, MATH, AND ENGLISH, TAILORED TO EACH STUDENT'S UNIQUE
                LEARNING STYLE.
              </p>
            </div>
            <div className="about-images">
              <div className="image-row">
                <div className="about-image books">
                <img src="/images/about1.jpg" alt="LEAP Logo" className="about-image" />
                </div>
                <div className="about-image library">
                <img src="/images/about2.jpg" alt="LEAP Logo" className="about-image" />
                </div>
                <div className="about-image students">
                <img src="/images/about3.jpg" alt="LEAP Logo" className="about-image"  />
                </div>
              </div>
              <div className="image-row">
                <div className="about-image tablet">
                <img src="/images/about4.jpg" alt="LEAP Logo" className="about-image" />
                </div>
                <div className="about-image student-reading">
                <img src="/images/about5.jpg" alt="LEAP Logo" className="about-image" />
                </div>
                <div className="about-image notebook">
                <img src="/images/about6.jpg" alt="LEAP Logo" className="about-image" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-columns">
          <div className="contact-form-container">
            <form className="contact-form">
              <div className="form-group">
                <label>Name</label>
                <input type="text" placeholder="" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" placeholder="" required />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="" required />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <textarea placeholder="" rows="5" required></textarea>
              </div>
              <button type="submit" className="submit-btn">Submit</button>
            </form>
          </div>
          <div className="contact-info">
            <h2>Contact <span className="highlight">Us</span></h2>
            <p>
              For questions, technical assistance,
              or collaboration opportunities via the contact
              information provided.
            </p>
            <div className="contact-details">
            <div className="contact-item">
  <div className="contact-icon">
    <i className="fas fa-phone"></i> 
  </div>
  <p> &nbsp;+92-3134803595</p>
</div>

<div className="contact-item">
  <div className="contact-icon">
    <i className="fas fa-envelope"></i>
  </div>
  <p>&nbsp;leap@gmail.com</p>
</div>

<div className="contact-item">
  <div className="contact-icon">
    <i className="fas fa-map-marker-alt"></i>
  </div>
  <p>&nbsp;Lahore, Pakistan</p>
</div>

          </div>

            </div>
          </div>
        
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <img src="/logo2.png" alt="LEAP Logo" className="footer-logo-img" />
            <h3>LEAP</h3>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Platform</h4>
              <ul>
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </ul>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <ul>
                <li><a href="#">Help Center</a></li>
                <li><a href="#">FAQ</a></li>
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} LEAP. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;