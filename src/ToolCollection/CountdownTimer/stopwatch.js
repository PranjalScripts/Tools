// src/components/Stopwatch.js

import React, { useState, useEffect } from 'react';

const Stopwatch = () => {
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  // Stopwatch logic
  useEffect(() => {
    let stopwatchInterval = null;
    if (isStopwatchRunning) {
      stopwatchInterval = setInterval(() => {
        setStopwatchSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }
    return () => clearInterval(stopwatchInterval);
  }, [isStopwatchRunning]);

  // Convert stopwatch seconds to hours, minutes, seconds
  const formatStopwatchTime = () => {
    const hrs = Math.floor(stopwatchSeconds / 3600);
    const mins = Math.floor((stopwatchSeconds % 3600) / 60);
    const secs = stopwatchSeconds % 60;

    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Stopwatch button actions
  const startStopwatch = () => setIsStopwatchRunning(true);
  const pauseStopwatch = () => setIsStopwatchRunning(false);
  const resetStopwatch = () => {
    setIsStopwatchRunning(false);
    setStopwatchSeconds(0);
  };

  return (
    <div>
      {/* Stopwatch Display */}
      <div className="text-6xl font-bold mb-6" style={{ textAlign: 'center' }}>{formatStopwatchTime()}</div>


      {/* Play, Pause, Reset Buttons for Stopwatch */}
      <div className="flex space-x-6">
        <button
          onClick={startStopwatch}
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 ${isStopwatchRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isStopwatchRunning}
        >
          Play Stopwatch
        </button>
        <button
          onClick={pauseStopwatch}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          disabled={!isStopwatchRunning}
        >
          Pause Stopwatch
        </button>
        <button
          onClick={resetStopwatch}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Reset Stopwatch
        </button>
      </div>
    </div>
  );
};

export default Stopwatch;
