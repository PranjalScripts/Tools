// src/components/Timer.js

import React, { useState, useEffect } from 'react';

const Timer = () => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10); // Example start: 10 minutes
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  
  // Load the sound file
  const alarmSound = new Audio('/notification.mp3'); // Adjust the path as necessary

  // Countdown logic
  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds((prevSeconds) => prevSeconds - 1);
        } else if (minutes > 0) {
          setMinutes((prevMinutes) => prevMinutes - 1);
          setSeconds(59);
        } else if (hours > 0) {
          setHours((prevHours) => prevHours - 1);
          setMinutes(59);
          setSeconds(59);
        } else {
          alarmSound.play(); // Play sound when timer reaches 0
          setIsActive(false); // Stop the timer when it reaches 0
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, hours]);

  // Timer button actions
  const incrementHours = () => setHours((prev) => Math.min(prev + 1, 99));
  const decrementHours = () => setHours((prev) => Math.max(prev - 1, 0));

  const incrementMinutes = () => setMinutes((prev) => Math.min(prev + 1, 59));
  const decrementMinutes = () => setMinutes((prev) => Math.max(prev - 1, 0));

  const incrementSeconds = () => setSeconds((prev) => Math.min(prev + 1, 59));
  const decrementSeconds = () => setSeconds((prev) => Math.max(prev - 1, 0));

  const startTimer = () => setIsActive(true);
  const stopTimer = () => setIsActive(false);
  const resetTimer = () => {
    setIsActive(false);
    setHours(0);
    setMinutes(0);
    setSeconds(0);
  };

  return (
    <div>
      {/* Timer Display */}
      <div className="flex items-center space-x-4 mb-6 text-6xl font-bold">
        <div className="flex flex-col items-center">
          <button onClick={incrementHours} className="text-2xl">+</button>
          <div className="timer-box text-5xl border border-gray-300 p-4">{String(hours).padStart(2, '0')}</div>
          <button onClick={decrementHours} className="text-2xl">-</button>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <button onClick={incrementMinutes} className="text-2xl">+</button>
          <div className="timer-box text-5xl border border-gray-300 p-4">{String(minutes).padStart(2, '0')}</div>
          <button onClick={decrementMinutes} className="text-2xl">-</button>
        </div>
        <span>:</span>
        <div className="flex flex-col items-center">
          <button onClick={incrementSeconds} className="text-2xl">+</button>
          <div className="timer-box text-5xl border border-gray-300 p-4">{String(seconds).padStart(2, '0')}</div>
          <button onClick={decrementSeconds} className="text-2xl">-</button>
        </div>
      </div>

      {/* Start, Stop, Reset Buttons for Timer */}
      <div className="flex space-x-6">
        <button
          onClick={startTimer}
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 ${isActive ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isActive}
        >
          Start Timer
        </button>
        <button
          onClick={stopTimer}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          disabled={!isActive}
        >
          Stop Timer
        </button>
        <button
          onClick={resetTimer}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Reset Timer
        </button>
      </div>
    </div>
  );
};

export default Timer;
