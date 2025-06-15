import React from 'react';
import './Home.css';

function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">Online Learning Made Easy for Every Student</h1>
        <p className="hero-description">
          Online learning with LEAP offers accessibility, flexibility, 
          personalization, and collaboration. Students can access course
          materials from anywhere, learn at their own pace, and connect
          with instructors and peers globally, making it a powerful tool for
          enhancing education and skills.
        </p>
        <button className="hero-button">Get Started</button>
      </div>
      
      <div className="hero-graphics">
        <div className="float-object book"></div>
        <div className="float-object laptop"></div>
        <div className="float-object pencil"></div>
        <div className="float-object graduate-cap"></div>
        <div className="float-object calculator"></div>
      </div>
    </div>
  );
}

export default Hero;