// import React, { createContext, useState, useContext } from 'react';

// const AudioContext = createContext();

// export const useAudio = () => useContext(AudioContext);

// export const AudioProvider = ({ children }) => {
//   const [audioFile, setAudioFile] = useState(null);
//   const [audioBuffer, setAudioBuffer] = useState(null);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const [effects, setEffects] = useState({
//     eq: { bass: 0, mid: 0, treble: 0 },
//     reverb: { enabled: false, decay: 2.0, mix: 0.3 },
//     compressor: { enabled: false, threshold: -24, ratio: 4 }
//   });

//   // Process audio file and create AudioBuffer
//   const processAudioFile = async (file) => {
//     const arrayBuffer = await file.arrayBuffer();
//     const audioContext = new (window.AudioContext || window.webkitAudioContext)();
//     const buffer = await audioContext.decodeAudioData(arrayBuffer);
    
//     setAudioFile(file);
//     setAudioBuffer(buffer);
//     setDuration(buffer.duration);
//     setCurrentTime(0);
//     setIsPlaying(false);
    
//     return buffer;
//   };

//   // Apply audio effect
//   const applyEffect = (effectType, settings) => {
//     setEffects(prev => ({
//       ...prev,
//       [effectType]: {
//         ...prev[effectType],
//         ...settings
//       }
//     }));
//   };

//   // Apply preset (combination of effects)
//   const applyPreset = (presetName) => {
//     const presets = {
//       voice: {
//         eq: { bass: -2, mid: 3, treble: 1 },
//         reverb: { enabled: true, decay: 1.2, mix: 0.15 },
//         compressor: { enabled: true, threshold: -18, ratio: 3 }
//       },
//       warmth: {
//         eq: { bass: 3, mid: 1, treble: -1 },
//         reverb: { enabled: true, decay: 1.8, mix: 0.2 },
//         compressor: { enabled: true, threshold: -20, ratio: 2 }
//       }
//     };
    
//     if (presets[presetName]) {
//       setEffects(presets[presetName]);
//     }
//   };

//   // Export processed audio
//   const exportAudio = async () => {
//     // Simplified export function (in reality would apply effects)
//     if (!audioBuffer) return null;
    
//     // In a real implementation, this would process the audio with effects
//     // For hackathon purposes, this is simplified
//     const blob = new Blob([audioFile], { type: audioFile.type });
//     return blob;
//   };

//   const value = {
//     audioFile,
//     audioBuffer,
//     isPlaying,
//     setIsPlaying,
//     currentTime,
//     setCurrentTime,
//     duration,
//     effects,
//     processAudioFile,
//     applyEffect,
//     applyPreset,
//     exportAudio
//   };

//   return (
//     <AudioContext.Provider value={value}>
//       {children}
//     </AudioContext.Provider>
//   );
// };

