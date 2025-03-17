import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page dark-theme">
      <section className="hero">
        <h1>MUSAICA</h1>
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
      
      <section className="advanced-features">
        <h2>Production Tools</h2>
        <div className="advanced-features-grid">
          <div className="advanced-feature">
            <div className="advanced-feature-icon">
              <i className="fas fa-microphone-alt"></i>
            </div>
            <h3>Vocal & mixing tools</h3>
            <p>Reverb, Distortion, EQ, Delay, Compressor, and more.</p>
          </div>
          
          <div className="advanced-feature">
            <div className="advanced-feature-icon">
              <i className="fas fa-guitar"></i>
            </div>
            <h3>Virtual instruments</h3>
            <p>Beatmaker, software synths, drum kits, and 808 with Glide sounds.</p>
          </div>
          
          <div className="advanced-feature">
            <div className="advanced-feature-icon">
              <i className="fas fa-music"></i>
            </div>
            <h3>Royalty-free sounds</h3>
            <p>Thousands of loops, samples, one-shots, and sound effects.</p>
          </div>
          
          <div className="advanced-feature">
            <div className="advanced-feature-icon">
              <i className="fas fa-users"></i>
            </div>
            <h3>Collaborative studio</h3>
            <p>Make music online anytime, with anyone, on any device.</p>
          </div>
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