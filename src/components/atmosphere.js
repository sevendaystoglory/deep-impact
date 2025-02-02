import React, { useState } from 'react';
import './atmosphere.css';

const EarthAtmosphere = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const earthOrbit = 6387;
  const NUM_STARLINKS = 24; // Easy to change number of satellites

  // Generate array of Starlink satellites
  const starlinkSatellites = Array.from({ length: NUM_STARLINKS }, (_, index) => ({
    id: `starlink-${index + 1}`,
    rotationOffset: (360 / NUM_STARLINKS) * index, // Evenly space satellites
  }));

  const handleZoomChange = (event) => {
    // Apply logarithmic scaling to make zooming smoother
    const value = parseFloat(event.target.value);
    const logZoom = Math.exp(value) / Math.E; // Normalize so zoom level 1 is at value 1
    setZoomLevel(logZoom);
  };

  const getScaleLength = () => {
    // Base scale is 1000km at zoom level 1
    const baseScale = 0.03;
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
    '--earth-size': `${earthOrbit * zoomLevel}vh`,
    '--troposphere-size': `${(earthOrbit+18) * zoomLevel}vh`,
    '--stratosphere-size': `${(earthOrbit+50) * zoomLevel}vh`,
    '--mesophere-size': `${(earthOrbit+80) * zoomLevel}vh`,
    '--thermosphere-size': `${(earthOrbit+700) * zoomLevel}vh`,
    '--exosphere-size': `${(earthOrbit+10000) * zoomLevel}vh`,
    '--moon-distance': `${300000 * zoomLevel}vh`,
    '--iss-distance': `${(earthOrbit+400) * zoomLevel}vh`,
    '--starlink-distance': `${(earthOrbit+550) * zoomLevel}vh`,
    '--geostationary-orbit': `${(earthOrbit+35786) * zoomLevel}vh`,
    '--moon-size': `${1737 * zoomLevel}vh`,
    '--iss-size': `${30 * zoomLevel}vh`,
    '--airplane-orbit': `${((earthOrbit+10) * zoomLevel)}vh`,

    // near earth zone orbit leftshit
    '--airplane-orbit-left-shift': `${getLayerLeftShift(earthOrbit * zoomLevel, (earthOrbit+10) * zoomLevel)}vh`,
    '--mesosphere-left-shift': `${getLayerLeftShift(earthOrbit * zoomLevel, 6458 * zoomLevel)}vh`,
    '--troposphere-left-shift': `${getLayerLeftShift(earthOrbit * zoomLevel, 6390 * zoomLevel)}vh`,
    '--stratosphere-left-shift': `${getLayerLeftShift(earthOrbit * zoomLevel, 6428)}vh`,
    '--saturn-V-left-shift': `${getLayerLeftShift(earthOrbit * zoomLevel, 6443 * zoomLevel)}vh`,
    // opacity
    '--earth-opacity': Math.min(1, Math.max(0.4, 1 - (Math.log(zoomLevel * Math.E) + 6) / 6)),
    '--iss-orbit-opacity': Math.min(0.2, ((Math.log(zoomLevel * Math.E) + 6) / 6)-0.3),
    '--starlink-opacity': Math.min(1, ((Math.log(zoomLevel * Math.E) + 6) / 6)-0.1),
    '--airplane-opacity': Math.min(1, ((Math.log(zoomLevel * Math.E) + 6) / 6)-0.1),
    '--starlink-size': `${16 * zoomLevel}vh`,
    '--num-starlinks': NUM_STARLINKS,
    '--airplane-size': `${10 * zoomLevel}vh`,
    '--hubble-distance': `${(earthOrbit+515) * zoomLevel}vh`,
    '--hubble-size': `${25 * zoomLevel}vh`,
    '--saturnV-distance': `${(earthOrbit+65) * zoomLevel}vh`,
    '--saturnV-size': `${15 * zoomLevel}vh`,
  };

  return (
    <div className="atmosphere-container">
      <input
        type="range" // these ranges have shown to cover the most region when it comes to interesting zones and distances of orbit
        min="-5.8"
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
        <div className="layer moon"/>
        <div className="layer moon-orbit" />
        <div className="layer geostationary-orbit" />
        <div className="layer layer-exosphere" />
        <div className="layer layer-thermosphere" />
        <div className="layer starlink-orbit" />
        <div className="layer airplane-orbit" />
        <div className="layer airplane" />
        {starlinkSatellites.map(({ id, rotationOffset }) => (
          <div 
            key={id} 
            className="layer starlink" 
            style={{ '--starlink-rotation-offset': `${rotationOffset}deg` }}
          />
        ))}
        <div className="layer iss" />
        <div className="layer iss-orbit" />
        <div className="layer layer-mesosphere" />
        <div className="layer layer-stratosphere" />
        <div className="layer layer-troposphere" />
        <div className="layer hubble" />
        <div className="layer hubble-orbit" />
        <div className="layer saturnV-orbit" />
        <div className="earth" />
      </div>
    </div>
  );
};

export default EarthAtmosphere;