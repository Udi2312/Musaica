import React, { useState } from 'react';
import Tracks from '../src/components/Tracks';
import TrackInstrument from '../src/components/TrackInstrument';
import './PersonalWorkstation.css';
const PersonalWorkstation = () => {
  const [tracks, setTracks] = useState([
    { id: 1, instrument: 'Piano' },
    { id: 2, instrument: 'Drums' },
    { id: 3, instrument: 'Guitar' },
  ]);

  const addTrack = () => {
    const instrument = prompt(
      'Enter the instrument for the new track (e.g., Piano, Drums, or import a file):'
    );
    if (instrument) {
      setTracks([...tracks, { id: tracks.length + 1, instrument }]);
    }
  };

  return (
    <div className="personal-workstation-page">
      <h1>Personal Workstation</h1>

      <div className="workstation-layout">
        {/* Track Instruments Section */}
        <div className="track-instruments">
          {tracks.map((track) => (
            <TrackInstrument key={track.id} instrument={track.instrument} />
          ))}
        </div>

        {/* Tracks Section */}
        <div className="tracks-section">
          <Tracks tracks={tracks} addTrack={addTrack} />
        </div>
      </div>
    </div>
  );
};

export default PersonalWorkstation;