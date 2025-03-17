import React, { useState } from 'react';
import TrackInstrument from './TrackInstrument';


function Tracks({ tracks, addTrack }) {
  return (
    <div className="tracks-container">
      {/* Timeline */}
      <div className="timeline">
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="timeline-marker">
            {i}s
          </div>
        ))}
      </div>

      <div className="tracks-layout">
        {/* Tracks */}
        <div className="tracks">
          {tracks.map((track, index) => (
            <div key={index} className="track">
              <p>Track {index + 1}</p>
            </div>
          ))}

          {/* Add Track Button */}
          <div className="add-track" onClick={addTrack}>
            <p>+ Add Track</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Tracks;