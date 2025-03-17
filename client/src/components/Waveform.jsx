import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAudio } from '../context/AudioContext';

function Waveform() {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const { 
    audioFile, 
    audioBuffer,
    isPlaying, 
    setIsPlaying,
    setCurrentTime
  } = useAudio();
  
  // Initialize WaveSurfer when component mounts
  useEffect(() => {
    if (!waveformRef.current) return;
    
    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: '#4F4A85',
      progressColor: '#383351',
      cursorColor: '#333',
      height: 120,
      responsive: true,
      barWidth: 2,
      barRadius: 3,
      cursorWidth: 1,
      normalize: true
    });
    
    // Clean up on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);
  
  // Load audio when file changes
  useEffect(() => {
    if (!wavesurferRef.current || !audioFile) return;
    
    const loadAudio = async () => {
      // Create a URL for the audio file
      const fileUrl = URL.createObjectURL(audioFile);
      wavesurferRef.current.load(fileUrl);
      
      // Clean up URL object when done
      wavesurferRef.current.once('ready', () => {
        URL.revokeObjectURL(fileUrl);
      });
    };
    
    loadAudio();
  }, [audioFile]);
  
  // Set up event listeners
  useEffect(() => {
    if (!wavesurferRef.current) return;
    
    const handlePlayPause = () => {
      setIsPlaying(wavesurferRef.current.isPlaying());
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(wavesurferRef.current.getCurrentTime());
    };
    
    wavesurferRef.current.on('play', handlePlayPause);
    wavesurferRef.current.on('pause', handlePlayPause);
    wavesurferRef.current.on('audioprocess', handleTimeUpdate);
    
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.un('play', handlePlayPause);
        wavesurferRef.current.un('pause', handlePlayPause);
        wavesurferRef.current.un('audioprocess', handleTimeUpdate);
      }
    };
  }, [setIsPlaying, setCurrentTime]);
  
  // Control playback based on isPlaying state
  useEffect(() => {
    if (!wavesurferRef.current || !audioFile) return;
    
    if (isPlaying && !wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.play();
    } else if (!isPlaying && wavesurferRef.current.isPlaying()) {
      wavesurferRef.current.pause();
    }
  }, [isPlaying, audioFile]);
  
  return (
    <div className="waveform-container">
      <div ref={waveformRef} className="waveform"></div>
      
      {audioFile && (
        <div className="waveform-controls">
          <button 
            className="zoom-in"
            onClick={() => wavesurferRef.current.zoom(wavesurferRef.current.params.minPxPerSec * 1.5)}
          >
            <i className="fas fa-search-plus"></i>
          </button>
          <button 
            className="zoom-out"
            onClick={() => wavesurferRef.current.zoom(wavesurferRef.current.params.minPxPerSec / 1.5)}
          >
            <i className="fas fa-search-minus"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default Waveform;