import React, { useState, useRef } from 'react';
import { useAudio } from '../context/AudioContext';

function FileUpload() {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const { processAudioFile } = useAudio();
  
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      validateAndProcessFile(file);
    }
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };
  
  const validateAndProcessFile = async (file) => {
    setError(null);
    
    // Check file type
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid audio file (MP3, WAV, OGG)');
      return;
    }
    
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds 10MB limit');
      return;
    }
    
    try {
      await processAudioFile(file);
    } catch (err) {
      setError('Failed to process audio file. Please try again.');
      console.error(err);
    }
  };
  
  return (
    <div 
      className={`file-upload ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current.click()}
    >
      <input 
        type="file"
        ref={fileInputRef}
        className="file-input"
        accept="audio/*"
        onChange={handleFileChange}
      />
      
      <div className="upload-content">
        <div className="upload-icon">
          <i className="fas fa-cloud-upload-alt"></i>
        </div>
        <p>Drag audio file here or click to browse</p>
        <span>Supports MP3, WAV, OGG (max 10MB)</span>
      </div>
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}

export default FileUpload;