import React, { useState } from 'react';
import FileUpload from '../src/components/FileUpload';
import AudioPlayer from '../src/components/AudioPlayer';
import Waveform from '../src/components/Waveform';
import { AudioProvider } from '../src/context/AudioContext';
import { useAudio } from '../src/context/AudioContext';

function Editor() {
  const { audioFile, exportAudio } = useAudio();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    setIsProcessing(true);

    try {
      const processedAudio = await exportAudio();
      if (processedAudio) {
        // Create download link
        const url = URL.createObjectURL(processedAudio);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'processed_audio.mp3';
        document.body.appendChild(a);
        a.click();

        // Clean up
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export audio. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="editor-page">
      <h1>Audio Editor</h1>

      {!audioFile ? (
        <div className="upload-section">
          <h2>Get Started</h2>
          <p>Upload an audio file to begin editing</p>
          <FileUpload />
        </div>
      ) : (
        <div className="editor-workspace">
          <div className="editor-controls">
            <AudioPlayer />
            <div className="action-buttons">
              <button
                className="btn btn-primary"
                onClick={handleExport}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Export Audio'}
              </button>
              <button className="btn btn-outline">Save Project</button>
            </div>
          </div>

          <div className="waveform-section">
            <Waveform />
          </div>

          <div className="effects-section">
            <h3>Audio Effects</h3>
            <AudioProvider />
          </div>
        </div>
      )}
    </div>
  );
}

export default Editor;