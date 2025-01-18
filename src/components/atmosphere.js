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
    const baseScale = 0.05;
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

  const getLayerLeftShift = (earthSize, layerSize) => {
    // Convert 30vw to vh units for consistent calculations
    const thirtyVwInVh = (window.innerWidth * 30 / window.innerHeight); //This ensures we have 30vW to vH units for comparison below
    
    if (earthSize * -0.5 < earthSize * -1 + thirtyVwInVh) { //if the Earth does not start to touch the 30vW boundary
        console.log(thirtyVwInVh)
        return layerSize * -0.5; //return the troposphere size in vH for leftshift
    }
    return (layerSize * -1) + thirtyVwInVh + (layerSize - earthSize);
  };


  const zoomStyle = {// Values are fetched from data/atmosphere
    '--earth-size': `${6378 * zoomLevel}vh`,
    '--troposphere-size': `${6390 * zoomLevel}vh`,
    '--stratosphere-size': `${6428 * zoomLevel}vh`,
    '--mesophere-size': `${6458 * zoomLevel}vh`,
    '--thermosphere-size': `${7078 * zoomLevel}vh`,
    '--exosphere-size': `${16378 * zoomLevel}vh`,
    '--moon-distance': `${300000 * zoomLevel}vh`,
    '--moon-size': `${1737 * zoomLevel}vh`,
    '--mesosphere-left-shift': `${getLayerLeftShift(6378 * zoomLevel, 6458 * zoomLevel)}vh`,
    '--troposphere-left-shift': `${getLayerLeftShift(6378 * zoomLevel, 6390 * zoomLevel)}vh`,
    '--stratosphere-left-shift': `${getLayerLeftShift(6378 * zoomLevel, 6428)}vh`,
    '--earth-opacity': Math.min(1, Math.max(0.4, 1 - (Math.log(zoomLevel * Math.E) + 6) / 6)),
  };

  return (
    <div className="atmosphere-container">
      <input
        type="range" // these ranges have shown to cover the most region when it comes to interesting zones and distances of orbit
        min="-6"
        max="1.5"
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
        <div className="layer moon" />
        <div className="layer moon-orbit" />
        <div className="layer layer-stratosphere" />
        <div className="layer layer-troposphere" />
        <div className="earth" />
      </div>
    </div>
  );
};

export default EarthAtmosphere;