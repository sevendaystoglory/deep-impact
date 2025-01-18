import React, { useState } from 'react';
import './atmosphere.css';

const EarthAtmosphere = () => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomChange = (event) => {
    setZoomLevel(parseFloat(event.target.value));
  };

  const getScaleLength = () => {
    if (zoomLevel <= 0.1) return '1M km';
    if (zoomLevel <= 0.3) return '500K km';
    if (zoomLevel <= 0.5) return '100k km';
    if (zoomLevel <= 0.7) return '50K km';
    return '20K km';
  };

  const zoomStyle = {
    '--earth-size': `${6.4 * zoomLevel}vh`,
    '--troposphere-size': `${18.4 * zoomLevel}vh`,
    '--stratosphere-size': `${56.4 * zoomLevel}vh`,
    '--mesophere-size': `${86.4 * zoomLevel}vh`,
    '--thermosphere-size': `${700 * zoomLevel}vh`,
    '--exosphere-size': `${10000 * zoomLevel}vh`,
  };

  return (
    <div className="atmosphere-container">
      <input
        type="range"
        min="0.03"
        max="1"
        step="0.01"
        value={zoomLevel}
        onChange={handleZoomChange}
        className="zoom-slider"
      />
      <div className="scale-indicator">
        <div className="scale-bar"></div>
        <div className="scale-label">{getScaleLength()}</div>
      </div>
      <div className="atmosphere-layers" style={zoomStyle}>
        <div className="layer layer-exosphere" />
        <div className="layer layer-thermosphere" />
        <div className="layer layer-mesosphere" />
        <div className="layer layer-stratosphere" />
        <div className="layer layer-troposphere" />
        <div className="earth" />
      </div>
    </div>
  );
};

export default EarthAtmosphere;