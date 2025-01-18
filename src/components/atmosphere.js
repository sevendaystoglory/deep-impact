import React, { useState } from 'react';
import './atmosphere.css';

const EarthAtmosphere = () => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomChange = (event) => {
    // Apply logarithmic scaling to make zooming smoother
    const value = parseFloat(event.target.value);
    const logZoom = Math.exp(value) / Math.E; // Normalize so zoom level 1 is at value 1
    setZoomLevel(logZoom);
  };

  const getScaleLength = () => {
    // Base scale is 1000km at zoom level 1
    const baseScale = 19;
    // Calculate actual scale based on zoom level (inverse relationship)
    const scale = baseScale / zoomLevel;
    
    // Format the scale appropriately
    if (scale >= 1000) {
      return `${(scale / 1000).toFixed(0)}M km`;
    } else if (scale >= 100) {
      return `${scale.toFixed(0)}K km`;
    } else {
      return `${scale.toFixed(1)}K km`;
    }
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
        min="-2.5"
        max="1.9"
        step="0.01"
        value={Math.log(zoomLevel * Math.E)} // Inverse of the logZoom calculation
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