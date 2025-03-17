import React from 'react';
import { useAudio } from '../context/AudioContext';

function AudioPlayer() {
  const { audioFile, isPlaying, setIsPlaying, currentTime, setCurrentTime, duration } = useAudio();

  // Format time in mm:ss
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle timeline change
  const handleTimeChange = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    // This would trigger an update in the waveform component through context
  };

  if (!audioFile) return null;

  return (
    <div className="audio-player">
      <div className="playback-controls">
        <button className="play-pause" onClick={togglePlayback}>
          {isPlaying ? <i className="fas fa-pause"></i> : <i className="fas fa-play"></i> }
        </button>
      </div>
      <div className="timeline">
        <span className="current-time">{formatTime(currentTime)}</span>
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          step="0.01"
          onChange={handleTimeChange}
          className="time-slider"
        />
        <span className="duration">{formatTime(duration || 0)}</span>
      </div>
      <div className="volume-controls">
        <button className="volume-button">
          <i className="fas fa-volume-up"></i>
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          defaultValue="0.7"
          className="volume-slider"
        />
      </div>
    </div>
  );
}

export default AudioPlayer;