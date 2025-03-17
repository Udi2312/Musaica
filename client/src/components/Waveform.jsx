import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import { useAudio } from '../context/AudioContext';

function Waveform() {
  const waveformRef = useRef(null);
  const wavesurferRef = useRef(null);
  const audioNodesRef = useRef({
    source: null,
    echoDelay: null,
    echoFeedback: null,
    reverb: null,
    distortion: null
  });
  
  const { 
    audioFile, 
    audioBuffer,
    isPlaying, 
    setIsPlaying,
    setCurrentTime
  } = useAudio();
  
  // Effect states
  const [effects, setEffects] = useState({
    echo: {
      active: false,
      delayTime: 0.5,
      feedback: 0.3
    },
    reverb: {
      active: false,
      decay: 2,
      mix: 0.3
    },
    distortion: {
      active: false,
      amount: 30
    }
  });
  
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
      normalize: true,
      
    });
    
    // Clean up on unmount
    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
      }
    };
  }, []);
  
  // Initialize audio effects
  // const initAudioEffects = () => {
  //   if (!wavesurferRef.current || !wavesurferRef.current.backend.ac) return;
    
  //   const audioContext = wavesurferRef.current.backend.ac;
    
  //   // Get the audio source node
  //   const sourceNode = wavesurferRef.current.backend.source;
    
  //   // Create echo effect (delay)
  //   const echoDelay = audioContext.createDelay(2.0);
  //   echoDelay.delayTime.setValueAtTime(effects.echo.delayTime, audioContext.currentTime);
    
  //   const echoFeedback = audioContext.createGain();
  //   echoFeedback.gain.value = effects.echo.feedback;
    
  //   // Create reverb effect
  //   const reverb = audioContext.createConvolver();
  //   createReverbImpulse(audioContext, reverb, effects.reverb.decay);
    
  //   // Create distortion effect
  //   const distortion = audioContext.createWaveShaper();
  //   distortion.oversample = '4x';
  //   distortion.curve = createDistortionCurve(effects.distortion.amount);
    
  //   // Store nodes for later use
  //   audioNodesRef.current = {
  //     source: sourceNode,
  //     echoDelay,
  //     echoFeedback,
  //     reverb,
  //     distortion
  //   };
    
  //   // Connect echo feedback loop
  //   echoDelay.connect(echoFeedback);
  //   echoFeedback.connect(echoDelay);
    
  //   // Apply current effect settings
  //   applyEffects();
  // };
  const initAudioEffects = () => {
  if (!wavesurferRef.current || !wavesurferRef.current.backend.ac) return;

  const audioContext = wavesurferRef.current.backend.ac;

  // Get the audio source node
  const sourceNode = wavesurferRef.current.backend.source;
  if (!sourceNode) return;

  // Create echo effect (delay)
  const echoDelay = audioContext.createDelay(2.0);
  echoDelay.delayTime.setValueAtTime(effects.echo.delayTime, audioContext.currentTime);

  const echoFeedback = audioContext.createGain();
  echoFeedback.gain.value = effects.echo.feedback;

  // Create reverb effect
  const reverb = audioContext.createConvolver();
  createReverbImpulse(audioContext, reverb, effects.reverb.decay);

  // Create distortion effect
  const distortion = audioContext.createWaveShaper();
  distortion.oversample = '4x';
  distortion.curve = createDistortionCurve(effects.distortion.amount);

  // Store nodes for later use
  audioNodesRef.current = {
    source: sourceNode,
    echoDelay,
    echoFeedback,
    reverb,
    distortion
  };

  // Connect echo feedback loop
  echoDelay.connect(echoFeedback);
  echoFeedback.connect(echoDelay);

  // Apply current effect settings
  // applyEffects();
  const applyEffects = () => {
    if (!wavesurferRef.current || !audioNodesRef.current.source) return;
  
    const audioContext = wavesurferRef.current.backend.ac;
    const { source, echoDelay, echoFeedback, reverb, distortion } = audioNodesRef.current;
  
    // Disconnect everything first
    source.disconnect();
    if (echoDelay) echoDelay.disconnect();
    if (reverb) reverb.disconnect();
    if (distortion) distortion.disconnect();
  
    // Create effect nodes chain
    let currentNode = source;
  
    // Apply distortion if active
    if (effects.distortion.active && distortion) {
      currentNode.connect(distortion);
      currentNode = distortion;
    }
  
    // Apply echo if active
    if (effects.echo.active && echoDelay) {
      currentNode.connect(echoDelay);
      currentNode.connect(audioContext.destination); // Direct sound
      echoDelay.connect(audioContext.destination); // Delayed sound
    } else {
      // Apply reverb if active
      if (effects.reverb.active && reverb) {
        currentNode.connect(reverb);
  
        // Wet/dry mix for reverb
        const dryGain = audioContext.createGain();
        dryGain.gain.value = 1 - effects.reverb.mix;
  
        const wetGain = audioContext.createGain();
        wetGain.gain.value = effects.reverb.mix;
  
        currentNode.connect(dryGain);
        reverb.connect(wetGain);
  
        dryGain.connect(audioContext.destination);
        wetGain.connect(audioContext.destination);
      } else {
        // No effects, direct connection
        currentNode.connect(audioContext.destination);
      }
    }
  };
};
  
  // Create reverb impulse response
  const createReverbImpulse = (audioContext, convolverNode, decay = 2) => {
    const length = audioContext.sampleRate * decay;
    const impulse = audioContext.createBuffer(2, length, audioContext.sampleRate);
    
    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        // Creating a natural sounding reverb with random decay
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
      }
    }
    
    convolverNode.buffer = impulse;
  };
  
  // Create distortion curve
  const createDistortionCurve = (amount = 50) => {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      // Different distortion algorithms can be used
      curve[i] = (3 + amount) * x * 20 * deg / (Math.PI + amount * Math.abs(x));
    }
    
    return curve;
  };
  
  // Apply effects based on current state
  const applyEffects = () => {
    if (!wavesurferRef.current || !audioNodesRef.current.source) return;
    
    const audioContext = wavesurferRef.current.backend.ac;
    const { source, echoDelay, echoFeedback, reverb, distortion } = audioNodesRef.current;
    
    // Disconnect everything first
    source.disconnect();
    echoDelay.disconnect();
    reverb.disconnect();
    distortion.disconnect();
    
    // Create effect nodes chain
    let currentNode = source;
    
    // Apply distortion if active
    if (effects.distortion.active) {
      currentNode.connect(distortion);
      currentNode = distortion;
    }
    
    // Apply echo if active
    if (effects.echo.active) {
      currentNode.connect(echoDelay);
      currentNode.connect(audioContext.destination); // Direct sound
      echoDelay.connect(audioContext.destination); // Delayed sound
    } else {
      // Apply reverb if active
      if (effects.reverb.active) {
        currentNode.connect(reverb);
        
        // Wet/dry mix for reverb
        const dryGain = audioContext.createGain();
        dryGain.gain.value = 1 - effects.reverb.mix;
        
        const wetGain = audioContext.createGain();
        wetGain.gain.value = effects.reverb.mix;
        
        currentNode.connect(dryGain);
        reverb.connect(wetGain);
        
        dryGain.connect(audioContext.destination);
        wetGain.connect(audioContext.destination);
      } else {
        // No effects, direct connection
        currentNode.connect(audioContext.destination);
      }
    }
  };
  
  // Toggle effect on/off
  const toggleEffect = (effectName) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        [effectName]: {
          ...prev[effectName],
          active: !prev[effectName].active
        }
      };
      
      return newEffects;
    });
  };
  
  // Update effect parameters
  // const updateEffectParam = (effectName, paramName, value) => {
  //   setEffects(prev => {
  //     const newEffects = {
  //       ...prev,
  //       [effectName]: {
  //         ...prev[effectName],
  //         [paramName]: value
  //       }
  //     };
      
  //     // Update the actual audio node parameters
  //     if (audioNodesRef.current) {
  //       if (effectName === 'echo') {
  //         if (paramName === 'delayTime') {
  //           audioNodesRef.current.echoDelay.delayTime.setValueAtTime(value, wavesurferRef.current.backend.ac.currentTime);
  //         } else if (paramName === 'feedback') {
  //           audioNodesRef.current.echoFeedback.gain.value = value;
  //         }
  //       } else if (effectName === 'distortion' && paramName === 'amount') {
  //         audioNodesRef.current.distortion.curve = createDistortionCurve(value);
  //       } else if (effectName === 'reverb' && paramName === 'decay') {
  //         // Regenerate impulse response for new decay value
  //         if (wavesurferRef.current && wavesurferRef.current.backend.ac) {
  //           createReverbImpulse(
  //             wavesurferRef.current.backend.ac, 
  //             audioNodesRef.current.reverb, 
  //             value
  //           );
  //         }
  //       }
  //     }
      
  //     return newEffects;
  //   });
  // };
  const updateEffectParam = (effectName, paramName, value) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        [effectName]: {
          ...prev[effectName],
          [paramName]: value
        }
      };
  
      // Update the actual audio node parameters
      if (audioNodesRef.current) {
        if (effectName === 'echo') {
          if (paramName === 'delayTime' && audioNodesRef.current.echoDelay) {
            audioNodesRef.current.echoDelay.delayTime.setValueAtTime(value, wavesurferRef.current.backend.ac.currentTime);
          } else if (paramName === 'feedback' && audioNodesRef.current.echoFeedback) {
            audioNodesRef.current.echoFeedback.gain.value = value;
          }
        } else if (effectName === 'distortion' && paramName === 'amount' && audioNodesRef.current.distortion) {
          audioNodesRef.current.distortion.curve = createDistortionCurve(value);
        } else if (effectName === 'reverb' && paramName === 'decay' && audioNodesRef.current.reverb) {
          // Regenerate impulse response for new decay value
          if (wavesurferRef.current && wavesurferRef.current.backend.ac) {
            createReverbImpulse(
              wavesurferRef.current.backend.ac, 
              audioNodesRef.current.reverb, 
              value
            );
          }
        }
      }
  
      return newEffects;
    });
  };
  
  // Apply effects when their state changes
  useEffect(() => {
    if (wavesurferRef.current && wavesurferRef.current.isReady) {
      applyEffects();
    }
  }, [effects]);
  
  // Load audio when file changes
  useEffect(() => {
    if (!wavesurferRef.current || !audioFile) return;
    
    const loadAudio = async () => {
      // Create a URL for the audio file
      const fileUrl = URL.createObjectURL(audioFile);
      wavesurferRef.current.load(fileUrl);
      
      // Initialize effects when audio is ready
      wavesurferRef.current.once('ready', () => {
        URL.revokeObjectURL(fileUrl);
        initAudioEffects();
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
      <div className="audio-effects-container">
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
        
        <div className="audio-effects">
          <h3>Audio Effects</h3>
          
          {/* Echo Effect Controls */}
          <div className="effect-group">
            <div className="effect-header">
              <label className="effect-toggle " onClick={(e) => e.preventDefault()}>
                <input 
                  type="checkbox" 
                  checked={effects.echo.active}
                  onChange={() => toggleEffect('echo')}
                />
                <span>Echo</span>
              </label>
            </div>
            
            <div className={`effect-controls ${effects.echo.active ? 'active' : ''}`}>
              <div className="effect-param">
                <label>Delay: {effects.echo.delayTime.toFixed(2)}s</label>
                <input id="1"
                  type="range" 
                  min="0.1" 
                  max="1.0" 
                  step="0.05"
                  value={effects.echo.delayTime}
                  onChange={(e) => updateEffectParam('echo', 'delayTime', parseFloat(e.target.value))}
                />
              </div>
              <div className="effect-param">
                <label>Feedback: {(effects.echo.feedback * 100).toFixed(0)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.9" 
                  step="0.05"
                  value={effects.echo.feedback}
                  onChange={(e) => updateEffectParam('echo', 'feedback', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          {/* Reverb Effect Controls */}
          <div className="effect-group">
            <div className="effect-header">
              <label className="effect-toggle" onClick={(e) => e.preventDefault()}>
                <input 
                  type="checkbox" 
                  checked={effects.reverb.active}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleEffect('reverb')}
                />
                <span>Reverb</span>
              </label>
            </div>
            
            <div className={`effect-controls ${effects.reverb.active ? 'active' : ''}`}>
              <div className="effect-param">
                <label>Decay: {effects.reverb.decay.toFixed(1)}s</label>
                <input 
                  type="range" 
                  min="0.5" 
                  max="5.0" 
                  step="0.1"
                  value={effects.reverb.decay}
                  onChange={(e) => updateEffectParam('reverb', 'decay', parseFloat(e.target.value))}
                />
              </div>
              <div className="effect-param">
                <label>Mix: {(effects.reverb.mix * 100).toFixed(0)}%</label>
                <input 
                  type="range" 
                  min="0.1" 
                  max="0.9" 
                  step="0.05"
                  value={effects.reverb.mix}
                  onChange={(e) => updateEffectParam('reverb', 'mix', parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
          
          {/* Distortion Effect Controls */}
          <div className="effect-group">
            <div className="effect-header">
              <label className="effect-toggle" onClick={(e) => e.preventDefault()}>
                <input 
                  type="checkbox" 
                  checked={effects.distortion.active}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleEffect('distortion')}
                />
                <span>Distortion</span>
              </label>
            </div>
            
            <div className={`effect-controls ${effects.distortion.active ? 'active' : ''}`}>
              <div className="effect-param">
                <label>Amount: {effects.distortion.amount.toFixed(0)}</label>
                <input 
                  type="range" 
                  min="1" 
                  max="100" 
                  step="1"
                  value={effects.distortion.amount}
                  onChange={(e) => updateEffectParam('distortion', 'amount', parseInt(e.target.value))}
  />
</div>
</div>
</div>
</div>
</div>
)}
</div>
);
}

export default Waveform;