import React from 'react';
import './Features.css';
import '@fortawesome/fontawesome-free/css/all.min.css';


function Features() {
  const features = [
    {
      icon: "fas fa-laptop",
      title: "Interactive Learning",
      description: "Engage with dynamic content and interactive exercises that make learning enjoyable and effective."
    },
    {
      icon: "fas fa-chart-line",
      title: "Progress Tracking",
      description: "Monitor your progress with detailed analytics and personalized feedback on your performance."
    },
    {
      icon: "fas fa-users",
      title: "Collaborative Environment",
      description: "Connect with peers and instructors for discussions, group projects, and knowledge sharing."
    },
    {
      icon: "fas fa-clock",
      title: "Learn at Your Pace",
      description: "Access course materials anytime and progress through lessons at a pace that works for you."
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-content">
        <h2>Why Choose <span className="highlight">LEAP</span></h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <i className={feature.icon}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;