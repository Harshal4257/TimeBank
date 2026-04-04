import React, { useState } from 'react';
import { Clock, CheckCircle, AlertCircle, TrendingUp, TrendingDown, Eye, Edit } from 'lucide-react';
import TimeVerification from './TimeVerification';

const TimeDisplay = ({ task, onVerificationUpdate }) => {
  const [showVerification, setShowVerification] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const timeData = task.actualHours || {};
  const seekerTimeData = Object.values(timeData)[0] || {}; // Get first seeker's time data

  const calculateEfficiency = () => {
    if (!task.estimatedHours || !seekerTimeData.totalHours) return 0;
    return ((task.estimatedHours / seekerTimeData.totalHours) * 100).toFixed(1);
  };

  const getTimeStatus = () => {
    if (!seekerTimeData.totalHours) return { status: 'pending', color: 'gray', icon: AlertCircle };
    
    const efficiency = calculateEfficiency();
    if (efficiency >= 95 && efficiency <= 105) {
      return { status: 'on-time', color: 'green', icon: CheckCircle };
    } else if (efficiency > 105) {
      return { status: 'over-time', color: 'red', icon: TrendingUp };
    } else {
      return { status: 'under-time', color: 'blue', icon: TrendingDown };
    }
  };

  const timeStatus = getTimeStatus();
  const efficiency = calculateEfficiency();

  const formatTime = (hours) => {
    if (!hours) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Time Tracking
          </h3>
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-${timeStatus.color}-100 text-${timeStatus.color}-800`}>
            <timeStatus.icon className="w-3 h-3" />
            {timeStatus.status.replace('-', ' ')}
          </div>
        </div>

        {/* Time Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Estimated Time</div>
            <div className="text-lg font-semibold text-gray-900">
              {formatTime(task.estimatedHours)}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-xs text-blue-500 mb-1">Actual Time</div>
            <div className="text-lg font-semibold text-blue-900">
              {formatTime(seekerTimeData.totalHours)}
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-xs text-purple-500 mb-1">Efficiency</div>
            <div className="text-lg font-semibold text-purple-900">
              {efficiency}%
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {seekerTimeData.verifiedBy ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">Verified by Poster</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm text-yellow-600">Pending Verification</span>
                </>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
              >
                <Eye className="w-4 h-4" />
                {showDetails ? 'Hide' : 'Show'} Details
              </button>
              
              {!seekerTimeData.verifiedBy && seekerTimeData.totalHours && (
                <button
                  onClick={() => setShowVerification(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium flex items-center gap-1"
                >
                  <CheckCircle className="w-4 h-4" />
                  Verify Time
                </button>
              )}
            </div>
          </div>

          {/* Detailed Information */}
          {showDetails && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-gray-500 mb-1">Start Time</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(seekerTimeData.startTime)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">End Time</div>
                  <div className="text-sm text-gray-900">
                    {formatDate(seekerTimeData.endTime)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Total Hours Worked</div>
                  <div className="text-sm text-gray-900 font-medium">
                    {formatTime(seekerTimeData.totalHours)}
                  </div>
                </div>
                
                <div>
                  <div className="text-xs text-gray-500 mb-1">Time Difference</div>
                  <div className={`text-sm font-medium ${
                    efficiency >= 95 && efficiency <= 105 
                      ? 'text-green-600'
                      : efficiency > 105 
                        ? 'text-red-600'
                        : 'text-blue-600'
                  }`}>
                    {seekerTimeData.totalHours - task.estimatedHours > 0 ? '+' : ''}
                    {formatTime(seekerTimeData.totalHours - task.estimatedHours)}
                  </div>
                </div>
              </div>
              
              {seekerTimeData.verifiedAt && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="text-xs text-gray-500 mb-1">Verification Details</div>
                  <div className="text-sm text-gray-900">
                    Verified by: {seekerTimeData.verifiedBy} at {formatDate(seekerTimeData.verifiedAt)}
                  </div>
                  {seekerTimeData.verificationNotes && (
                    <div className="text-sm text-gray-600 mt-1">
                      Notes: {seekerTimeData.verificationNotes}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Verification Modal */}
      {showVerification && (
        <TimeVerification
          task={task}
          seekerTimeData={seekerTimeData}
          onClose={() => setShowVerification(false)}
          onVerificationComplete={(verificationData) => {
            setShowVerification(false);
            if (onVerificationUpdate) {
              onVerificationUpdate(verificationData);
            }
          }}
        />
      )}
    </>
  );
};

export default TimeDisplay;
