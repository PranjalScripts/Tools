import React, { useState } from 'react';
import Clock from './clock'; // Make sure this path is correct
import Timer from './timer';
import Stopwatch from './stopwatch';

const TimerApp = () => {
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      {/* Tabs */}
      <div className="flex space-x-2 mb-6">
        <button
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'timer' ? 'bg-green-600 text-white' : 'border border-gray-300'}`}
          onClick={() => setActiveTab('timer')}
        >
          Timer
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'stopwatch' ? 'bg-green-600 text-white' : 'border border-gray-300'}`}
          onClick={() => setActiveTab('stopwatch')}
        >
          Stopwatch
        </button>
        <button
          className={`px-4 py-2 rounded-t-lg ${activeTab === 'clock' ? 'bg-green-600 text-white' : 'border border-gray-300'}`}
          onClick={() => setActiveTab('clock')}
        >
          Clock
        </button>
      </div>

      {/* Conditional Rendering based on active tab */}
      {activeTab === 'timer' && <Timer />}
      {activeTab === 'stopwatch' && <Stopwatch />}
      {activeTab === 'clock' && <Clock />} {/* Add Clock component here */}
    </div>
  );
};

export default TimerApp;
