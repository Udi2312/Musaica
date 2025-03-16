const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const ffmpegPath = require('ffmpeg-static');
ffmpeg.setFfmpegPath(ffmpegPath);

// Trim audio (start: seconds, duration: seconds)
exports.trimAudio = (inputPath, outputPath, start, duration) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .setStartTime(start)
      .setDuration(duration)
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
};

// Apply effects (e.g., speed, volume, fade)
exports.applyEffect = (inputPath, outputPath, effectType, value) => {
  return new Promise((resolve, reject) => {
    let command = ffmpeg(inputPath);
    
    switch(effectType.toLowerCase()) {
      case 'speed':
        command = command.audioFilters(`atempo=${value}`); // Speed up/down
        break;
      case 'volume':
        command = command.audioFilters(`volume=${value}`); // Volume (0.5 = half)
        break;
      case 'fade':
        command = command.audioFilters(`afade=t=in:st=0:d=${value}`); // Fade-in
        break;
      default:
        reject(new Error('Unsupported effect'));
    }

    command
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run();
  });
};