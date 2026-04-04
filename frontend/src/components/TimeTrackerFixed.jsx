import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, CheckCircle, AlertCircle, Upload, FileText, Link, Timer, Calendar } from 'lucide-react';
import API from '../services/api';

const TimeTracker = ({ taskId, jobId, isAssignedSeeker, onTimeUpdate, jobDetails }) => {
  console.log('TimeTracker component loaded!');
  console.log('TimeTracker props:', { taskId, jobId, isAssignedSeeker, jobDetails });
  
  const [isTracking, setIsTracking] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentTime, setCurrentTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showWorkProof, setShowWorkProof] = useState(false);
  const [workProof, setWorkProof] = useState({
    files: [],
    links: [],
    description: ''
  });
  const [deadlineStatus, setDeadlineStatus] = useState({
    isOverdue: false,
    hoursRemaining: 0,
    deadline: null
  });
  const [hourlyLimit, setHourlyLimit] = useState({
    used: 0,
    limit: 0,
    remaining: 0
  });

  // Check deadline and hourly limits
  useEffect(() => {
    if (jobDetails) {
      console.log('TimeTracker - Job details:', jobDetails);
      console.log('TimeTracker - Current elapsed time:', elapsedTime);
      checkDeadlineStatus();
      checkHourlyLimit();
    } else {
      console.log('TimeTracker - No job details available');
    }
  }, [jobDetails, elapsedTime]);

  const checkDeadlineStatus = () => {
    if (!jobDetails.deadline) {
      console.log('TimeTracker - No deadline set');
      return;
    }
    
    const deadline = new Date(jobDetails.deadline);
    const now = new Date();
    const hoursRemaining = (deadline - now) / (1000 * 60 * 60);
    
    console.log('TimeTracker - Deadline check:', {
      deadline: jobDetails.deadline,
      now: now.toISOString(),
      hoursRemaining: hoursRemaining,
      isOverdue: hoursRemaining < 0
    });
    
    setDeadlineStatus({
      isOverdue: hoursRemaining < 0,
      hoursRemaining: Math.max(0, hoursRemaining),
      deadline
    });
  };

  const checkHourlyLimit = () => {
    if (!jobDetails.hours) {
      console.log('TimeTracker - No hours limit set');
      return;
    }
    
    const used = elapsedTime;
    const limit = jobDetails.hours;
    const remaining = Math.max(0, limit - used);
    
    console.log('TimeTracker - Hourly limit check:', {
      used: used,
      limit: limit,
      remaining: remaining,
      limitReached: remaining <= 0
    });
    
    setHourlyLimit({
      used: used,
      limit: limit,
      remaining: remaining
    });
  };

  // Update elapsed time every second when tracking
  useEffect(() => {
    let interval;
    if (isTracking && startTime) {
      interval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        const elapsed = (now - startTime) / (1000 * 60 * 60); // Convert to hours
        setElapsedTime(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTracking, startTime]);

  const startTracking = async () => {
    console.log('TimeTracker - Start tracking clicked!');
    console.log('TimeTracker - Current state:', {
      isTracking: isTracking,
      loading: loading,
      deadlineStatus: deadlineStatus,
      hourlyLimit: hourlyLimit,
      jobDetails: jobDetails
    });
    
    // Check if deadline is overdue
    if (deadlineStatus.isOverdue) {
      console.log('TimeTracker - Deadline is overdue, cannot start');
      alert('This job deadline has passed. Please contact poster for an extension.');
      return;
    }
    
    // Check if hourly limit reached
    if (hourlyLimit.remaining <= 0) {
      console.log('TimeTracker - Hourly limit reached, cannot start');
      alert('You have reached the maximum hours for this job.');
      return;
    }
    
    try {
      console.log('TimeTracker - Starting tracking...');
      setLoading(true);
      
      const now = new Date();
      setStartTime(now);
      setCurrentTime(now);
      setIsTracking(true);
      
      console.log('TimeTracker - Starting tracking at:', now.toISOString());
      
      // Send to backend
      await API.post(`/tasks/${taskId}/start-time`, {
        startTime: now.toISOString(),
        jobId,
        deadline: jobDetails.deadline,
        hourlyLimit: jobDetails.hours
      });
      
      console.log('TimeTracker - Tracking started successfully');
      
    } catch (error) {
      console.error('TimeTracker - Error starting time tracking:', error);
      setIsTracking(false);
      setStartTime(null);
      setCurrentTime(null);
      alert('Failed to start time tracking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stopTracking = async () => {
    try {
      setLoading(true);
      const endTime = new Date();
      const totalHours = (endTime - startTime) / (1000 * 60 * 60);
      
      setIsTracking(false);
      
      // Check if exceeded limits
      const exceededHours = totalHours > jobDetails.hours;
      if (exceededHours) {
        alert(`Warning: You've exceeded the hourly limit by ${(totalHours - jobDetails.hours).toFixed(2)} hours`);
      }
      
      // Send to backend
      await API.post(`/tasks/${taskId}/stop-time`, {
        endTime: endTime.toISOString(),
        totalHours,
        jobId
      });
      
      setElapsedTime(totalHours);
      setShowWorkProof(true);
      
    } catch (error) {
      console.error('Error stopping time tracking:', error);
      alert('Failed to stop time tracking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const submitWorkProof = async () => {
    try {
      setLoading(true);
      
      const formData = new FormData();
      workProof.files.forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('links', JSON.stringify(workProof.links));
      formData.append('description', workProof.description);
      formData.append('taskId', taskId);
      formData.append('jobId', jobId);
      formData.append('totalHours', elapsedTime);
      
      await API.post(`/tasks/${taskId}/submit-proof`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('Work proof submitted successfully!');
      setShowWorkProof(false);
      setWorkProof({ files: [], links: [], description: '' });
      
    } catch (error) {
      console.error('Error submitting work proof:', error);
      alert('Failed to submit work proof. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    const s = Math.floor(((hours - h) * 60 - m) * 60);
    
    if (h > 0) {
      return `${h}h ${m}m ${s}s`;
    } else if (m > 0) {
      return `${m}m ${s}s`;
    } else {
      return `${s}s`;
    }
  };

  const getDeadlineColor = () => {
    if (deadlineStatus.isOverdue) return 'text-red-600 bg-red-100';
    if (deadlineStatus.hoursRemaining < 24) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const getHourlyLimitColor = () => {
    if (hourlyLimit.remaining <= 0) return 'text-red-600 bg-red-100';
    if (hourlyLimit.remaining < 1) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  const addLink = () => {
    setWorkProof(prev => ({
      ...prev,
      links: [...prev.links, '']
    }));
  };

  const removeLink = (index) => {
    setWorkProof(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateLink = (index, value) => {
    setWorkProof(prev => ({
      ...prev,
      links: prev.links.map((link, i) => i === index ? value : link)
    }));
  };

  if (!isAssignedSeeker) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Time tracking is only available for assigned seekers</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
        <Timer className="w-5 h-5 text-emerald-600" />
        Time Tracking
      </h3>

      {/* Time Display */}
      <div className="text-center mb-6">
        <div className="text-3xl font-bold text-gray-900 mb-2">
          {formatTime(elapsedTime)}
        </div>
        {isTracking && (
          <div className="text-sm text-gray-500">
            Started: {startTime && startTime.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* Deadline and Hourly Limit Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Deadline Status */}
        <div className={`p-3 rounded-lg ${getDeadlineColor()}`}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-semibold">Deadline</span>
          </div>
          {deadlineStatus.deadline ? (
            <p className="text-xs">
              {deadlineStatus.isOverdue 
                ? 'Overdue' 
                : `${Math.floor(deadlineStatus.hoursRemaining)}h left`
              }
            </p>
          ) : (
            <p className="text-xs">No deadline</p>
          )}
        </div>

        {/* Hourly Limit Status */}
        <div className={`p-3 rounded-lg ${getHourlyLimitColor()}`}>
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold">Hours</span>
          </div>
          {jobDetails.hours ? (
            <p className="text-xs">
              {hourlyLimit.used.toFixed(1)} / {jobDetails.hours}h
            </p>
          ) : (
            <p className="text-xs">No limit</p>
          )}
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center">
        <button
          onClick={isTracking ? stopTracking : startTracking}
          disabled={loading || deadlineStatus.isOverdue || hourlyLimit.remaining <= 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            loading || deadlineStatus.isOverdue || hourlyLimit.remaining <= 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isTracking 
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Processing...
            </>
          ) : isTracking ? (
            <>
              <Pause className="w-4 h-4" />
              Stop Timer
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Start Timer
            </>
          )}
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        {deadlineStatus.isOverdue 
          ? 'Deadline has passed - Cannot track time'
          : hourlyLimit.remaining <= 0
          ? 'Hourly limit reached - Cannot track more time'
          : 'Click to start tracking your work time'
        }
      </div>

      {/* Work Proof Modal */}
      {showWorkProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Submit Work Proof</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Work Description
              </label>
              <textarea
                value={workProof.description}
                onChange={(e) => setWorkProof(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
                rows={3}
                placeholder="Describe what you worked on..."
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={(e) => setWorkProof(prev => ({ ...prev, files: Array.from(e.target.files) }))}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Links
              </label>
              {workProof.links.map((link, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateLink(index, e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-lg"
                    placeholder="Enter URL (optional)"
                  />
                  {workProof.links.length > 1 && (
                    <button
                      onClick={() => removeLink(index)}
                      className="px-3 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addLink}
                className="mt-2 px-3 py-2 bg-blue-500 text-white rounded-lg text-sm"
              >
                Add Link
              </button>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setShowWorkProof(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={submitWorkProof}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Proof'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
