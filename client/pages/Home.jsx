// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <section className="hero">
        <h1>SoundCraft Pro</h1>
        <p>Your all-in-one audio engineering platform</p>
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/editor')}>
            Start Editing
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/tools')}>
            Explore Tools
          </button>
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          {[
            {
              title: "AI-Powered Enhancement",
              description: "Intelligent audio processing with one click",
              icon: "magic"
            },
            {
              title: "Professional Editing",
              description: "Edit and process your audio with precision",
              icon: "sliders-h"
            },
            {
              title: "Format Conversion",
              description: "Convert between popular audio formats",
              icon: "exchange-alt"
            },
            {
              title: "Intuitive Interface",
              description: "User-friendly controls for every skill level",
              icon: "user-check"
            }
          ].map((feature, index) => (
            <div className="feature-card" key={index}>
              <div className="feature-icon">
                <i className={`fas fa-${feature.icon}`}></i>
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="quick-start">
        <h2>Ready to get started?</h2>
        <p>Upload your audio file and transform it in seconds</p>
        <button className="btn btn-primary" onClick={() => navigate('/editor')}>
          Go to Editor
        </button>
      </section>
    </div>
  );
}

export default Home;