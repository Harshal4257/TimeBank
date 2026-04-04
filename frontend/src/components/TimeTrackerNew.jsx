import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, AlertCircle, Timer, Calendar } from 'lucide-react';
import API from '../services/api';

const TimeTracker = ({ taskId, jobId, isAssignedSeeker, onTimeUpdate, jobDetails }) => {
  console.log('TimeTracker component loaded!');
  console.log('TimeTracker props:', { taskId, jobId, isAssignedSeeker, jobDetails });
  
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [loading, setLoading] = useState(false);

  const startTracking = async () => {
    console.log('Start tracking clicked!');
    alert('Start tracking works!');
  };

  const stopTracking = async () => {
    console.log('Stop tracking clicked!');
    alert('Stop tracking works!');
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Time Tracking</h3>
      
      {/* Debug Tests */}
      <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm font-medium text-yellow-800 mb-2">Debug Tests:</p>
        <div className="flex gap-2">
          <button
            onClick={() => alert('Direct onClick works!')}
            className="px-3 py-1 bg-red-500 text-white rounded text-xs"
          >
            Direct Alert
          </button>
          <button
            onClick={() => console.log('Console log works!')}
            className="px-3 py-1 bg-green-500 text-white rounded text-xs"
          >
            Console Log
          </button>
          <button
            onClick={startTracking}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Start Test
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center">
        <button
          onClick={isTracking ? stopTracking : startTracking}
          className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg"
        >
          {isTracking ? 'Stop' : 'Start'} Timer
        </button>
      </div>
    </div>
  );
};

export default TimeTracker;
