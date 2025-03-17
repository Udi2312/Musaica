import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import FileUpload from '../src/components/FileUpload';

// Tool components
function Converter() {
  const [outputFormat, setOutputFormat] = useState('mp3');
  
  return (
    <div className="converter-tool">
      <h2>Audio Converter</h2>
      <p>Convert your audio files to different formats</p>
      
      <FileUpload />
      
      <div className="format-options">
        <h3>Output Format</h3>
        <div className="format-selectors">
          {['mp3', 'wav', 'ogg', 'flac'].map(format => (
            <button 
              key={format}
              className={`format-button ${outputFormat === format ? 'active' : ''}`}
              onClick={() => setOutputFormat(format)}
            >
              {format.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      
      <div className="quality-options">
        <h3>Quality</h3>
        <select className="quality-select">
          <option value="high">High Quality</option>
          <option value="medium">Medium Quality</option>
          <option value="low">Low Quality (Smaller File)</option>
        </select>
      </div>
      
      <button className="btn btn-primary btn-convert">
        Convert
      </button>
    </div>
  );
}

function StemSeparator() {
  return (
    <div className="stem-separator-tool">
      <h2>Stem Separator</h2>
      <p>Separate vocals, instruments, drums, and bass</p>
      
      <FileUpload />
      
      <div className="separation-options">
        <h3>Separation Type</h3>
        <div className="option-buttons">
          <button className="option-button active">Vocals / Instruments</button>
          <button className="option-button">Drums / Other</button>
          <button className="option-button">Four Stems</button>
        </div>
      </div>
      
      <button className="btn btn-primary btn-process">
        Process Audio
      </button>
    </div>
  );
}

function SpectrumAnalyzer() {
  return (
    <div className="spectrum-analyzer-tool">
      <h2>Spectrum Analyzer</h2>
      <p>Visualize the frequency content of your audio</p>
      
      <FileUpload />
      
      <div className="analyzer-display">
        <div className="placeholder-display">
          <div className="analyzer-placeholder">
            <p>Upload audio to view spectrum analysis</p>
          </div>
        </div>
      </div>
      
      <div className="analyzer-controls">
        <button className="btn btn-outline">Linear Scale</button>
        <button className="btn btn-outline">Log Scale</button>
        <div className="resolution-control">
          <label>Resolution:</label>
          <input type="range" min="8" max="14" defaultValue="11" />
        </div>
      </div>
    </div>
  );
}

function SampleFinder() {
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <div className="sample-finder-tool">
      <h2>Sample Finder</h2>
      <p>Find and download royalty-free samples for your project</p>
      
      <div className="search-bar">
        <input 
          type="text" 
          placeholder="Search samples..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">
          <i className="fas fa-search"></i>
        </button>
      </div>
      
      <div className="filter-options">
        <div className="filter-group">
          <label>Category:</label>
          <select>
            <option>All</option>
            <option>Drums</option>
            <option>Bass</option>
            <option>FX</option>
            <option>Vocals</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>BPM:</label>
          <input type="number" min="60" max="200" defaultValue="120" />
        </div>
      </div>
      
      <div className="sample-results">
        <p className="results-placeholder">Search for samples to see results</p>
      </div>
    </div>
  );
}

// Main Tools page component
function Tools() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Default to converter if on base tools path
  if (currentPath === '/tools') {
    navigate('/tools/converter');
  }
  
  const isActiveTool = (path) => {
    return currentPath === `/tools/${path}` ? 'active' : '';
  };

  return (
    <div className="tools-page">
      <h1>Audio Tools</h1>
      
      <div className="tools-layout">
        <div className="tools-sidebar">
          <ul className="tools-nav">
            <li className={isActiveTool('converter')}>
              <button onClick={() => navigate('/tools/converter')}>
                <i className="fas fa-exchange-alt"></i>
                Converter
              </button>
            </li>
            <li className={isActiveTool('stem-separator')}>
              <button onClick={() => navigate('/tools/stem-separator')}>
                <i className="fas fa-layer-group"></i>
                Stem Separator
              </button>
            </li>
            <li className={isActiveTool('analyzer')}>
              <button onClick={() => navigate('/tools/analyzer')}>
                <i className="fas fa-chart-bar"></i>
                Spectrum Analyzer
              </button>
            </li>
            <li className={isActiveTool('samples')}>
              <button onClick={() => navigate('/tools/samples')}>
                <i className="fas fa-music"></i>
                Sample Finder
              </button>
            </li>
          </ul>
        </div>
        
        <div className="tool-content">
          <Routes>
            <Route path="converter" element={<Converter />} />
            <Route path="stem-separator" element={<StemSeparator />} />
            <Route path="analyzer" element={<SpectrumAnalyzer />} />
            <Route path="samples" element={<SampleFinder />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default Tools;