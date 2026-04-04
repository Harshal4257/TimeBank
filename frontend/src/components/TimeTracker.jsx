import React, { useState, useEffect } from 'react';
import { Play, Pause, Clock, CheckCircle, AlertCircle, Upload, FileText, Link, Timer, Calendar } from 'lucide-react';
import API from '../services/api';

const TimeTracker = ({ taskId, jobId, isAssignedSeeker, onTimeUpdate, jobDetails }) => {
  // Add global test function
  window.testTimeTracker = () => {
    console.log('Global test function called!');
    alert('Global test works!');
  };
  
  console.log('TimeTracker component loaded!');
  console.log('TimeTracker props:', { taskId, jobId, isAssignedSeeker, jobDetails });
  
  // Add click test to document
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      console.log('Button clicked:', e.target.textContent);
    }
  });
  
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
      alert('This job deadline has passed. Please contact the poster for an extension.');
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
      const isLate = endTime > new Date(jobDetails.deadline);
      
      // Send to backend
      await API.post(`/tasks/${taskId}/stop-time`, {
        endTime: endTime.toISOString(),
        totalHours: parseFloat(totalHours.toFixed(2)),
        exceededHours,
        isLate,
        jobId
      });
      
      if (onTimeUpdate) {
        onTimeUpdate({ 
          action: 'stop', 
          endTime, 
          totalHours: parseFloat(totalHours.toFixed(2)),
          exceededHours,
          isLate
        });
      }
      
      // Show work proof submission if tracking stopped
      if (totalHours > 0) {
        setShowWorkProof(true);
      }
      
      // Reset state
      setStartTime(null);
      setCurrentTime(null);
      setElapsedTime(0);
    } catch (error) {
      console.error('Error stopping time tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setWorkProof(prev => ({
      ...prev,
      files: [...prev.files, ...files]
    }));
  };

  const addLink = () => {
    const linkInput = document.createElement('input');
    linkInput.type = 'url';
    linkInput.placeholder = 'Enter work link (Google Drive, GitHub, etc.)';
    linkInput.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg';
    
    const linkContainer = document.createElement('div');
    linkContainer.className = 'flex gap-2 mb-2';
    
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.className = 'px-3 py-2 bg-blue-600 text-white rounded-lg';
    addButton.onclick = () => {
      if (linkInput.value.trim()) {
        setWorkProof(prev => ({
          ...prev,
          links: [...prev.links, linkInput.value.trim()]
        }));
        linkContainer.remove();
      }
    };
    
    linkContainer.appendChild(linkInput);
    linkContainer.appendChild(addButton);
    document.getElementById('links-container').appendChild(linkContainer);
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
    if (deadlineStatus.hoursRemaining < 2) return 'text-orange-600 bg-orange-100';
    if (deadlineStatus.hoursRemaining < 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-green-600 bg-green-100';
  };

  const getHourlyLimitColor = () => {
    if (hourlyLimit.remaining <= 0) return 'text-red-600 bg-red-100';
    if (hourlyLimit.remaining < 1) return 'text-orange-600 bg-orange-100';
    return 'text-blue-600 bg-blue-100';
  };

  if (!isAssignedSeeker) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 text-sm">Time tracking is only available for assigned seekers</p>
      </div>
  }
};
  
linkContainer.appendChild(linkInput);
linkContainer.appendChild(addButton);
document.getElementById('links-container').appendChild(linkContainer);
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
          {isTracking ? 'Tracking' : 'Stopped'}
        </div>
      </div>

      {/* Deadline and Hourly Limit Status */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Deadline Status */}
        <div className={`p-3 rounded-lg ${getDeadlineColor()}`}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm font-medium">Deadline</span>
          </div>
          {deadlineStatus.deadline ? (
            <>
              <p className="text-xs">
                {deadlineStatus.deadline.toLocaleDateString()}
              </p>
              <p className="text-xs font-medium">
                {deadlineStatus.isOverdue 
                  ? 'Overdue' 
                  : `${Math.floor(deadlineStatus.hoursRemaining)}h ${Math.floor((deadlineStatus.hoursRemaining % 1) * 60)}m left`
                }
              </p>
            </>
          ) : (
            <p className="text-xs">No deadline set</p>
          )}
        </div>

        {/* Hourly Limit Status */}
        <div className={`p-3 rounded-lg ${getHourlyLimitColor()}`}>
          <div className="flex items-center gap-2 mb-1">
            <Timer className="w-4 h-4" />
            <span className="text-sm font-medium">Hours</span>
          </div>
          {jobDetails.hours ? (
            <>
              <p className="text-xs">
                {elapsedTime.toFixed(1)} / {jobDetails.hours} hrs
              </p>
              <p className="text-xs font-medium">
                {hourlyLimit.remaining.toFixed(1)} hrs remaining
              </p>
            </>
          ) : (
            <p className="text-xs">No hourly limit</p>
          )}
        </div>
      </div>

      {/* Current Session Display */}
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

      {/* Control Buttons */}
      <div className="flex justify-center">
        {/* Test Button */}
        <button
          onClick={() => console.log('Test button clicked!')}
          className="mr-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"
        >
          Test
        </button>
        
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
          ? "Deadline has passed. Contact poster for extension."
          : hourlyLimit.remaining <= 0
          ? "Hourly limit reached. No more time available."
          : isTracking 
          ? "Click 'Stop Timer' when you finish working"
          : "Click 'Start Timer' to begin tracking your work time"
        }
      </div>

      {/* Work Proof Modal */}
      {showWorkProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Upload className="w-6 h-6 text-blue-600" />
                  Submit Work Proof
                </h2>
                <button
                  onClick={() => setShowWorkProof(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <AlertCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Time Summary */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Work Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Total Time:</span>
                      <span className="font-medium ml-2">{formatTime(elapsedTime)}</span>
                    </div>
                    <div>
                      <span className="text-blue-700">Status:</span>
                      <span className="font-medium ml-2">
                        {elapsedTime > jobDetails.hours ? 'Exceeded limit' : 'Within limit'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* File Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Work Files
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drop files here or click to browse
                    </p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label
                      htmlFor="file-upload"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                      Choose Files
                    </label>
                  </div>
                  {workProof.files.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Selected files:</p>
                      <ul className="text-xs text-gray-500">
                        {workProof.files.map((file, index) => (
                          <li key={index}>• {file.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Links */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Links
                  </label>
                  <div id="links-container" className="space-y-2">
                    <button
                      type="button"
                      onClick={addLink}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                    >
                      <Link className="w-4 h-4" />
                      Add Link
                    </button>
                    {workProof.links.map((link, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Link className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 truncate">{link}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Description
                  </label>
                  <textarea
                    value={workProof.description}
                    onChange={(e) => setWorkProof(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe the work completed..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowWorkProof(false)}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitWorkProof}
                    disabled={loading || (workProof.files.length === 0 && workProof.links.length === 0)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Submitting...' : 'Submit Proof'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTracker;
