import React from 'react';

const SidePanel = () => {
  return (
    <div className="side-panel">
      <h3>Editing Tools</h3>
      <button className="btn btn-secondary">Trim</button>
      <button className="btn btn-secondary">Fade In</button>
      <button className="btn btn-secondary">Fade Out</button>
      <button className="btn btn-secondary">Normalize</button>
      {/* Add more editing tools as needed */}
    </div>
  );
};

export default SidePanel;