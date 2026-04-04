import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, AlertCircle, CheckCircle, Eye } from 'lucide-react';
import API from '../services/api';

const TimeOverview = ({ posterId }) => {
  const [timeStats, setTimeStats] = useState({
    totalTasks: 0,
    totalEstimatedHours: 0,
    totalActualHours: 0,
    averageEfficiency: 0,
    pendingVerification: 0,
    completedTasks: 0,
    overTimeTasks: 0,
    underTimeTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [detailedTasks, setDetailedTasks] = useState([]);

  useEffect(() => {
    fetchTimeStats();
  }, [posterId]);

  const fetchTimeStats = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/posters/${posterId}/time-stats`);
      setTimeStats(response.data.stats);
      setDetailedTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching time stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (hours) => {
    if (!hours) return '0h 0m';
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const getEfficiencyColor = (efficiency) => {
    if (efficiency >= 95 && efficiency <= 105) return 'text-green-600';
    if (efficiency > 105) return 'text-red-600';
    return 'text-blue-600';
  };

  const getEfficiencyIcon = (efficiency) => {
    if (efficiency >= 95 && efficiency <= 105) return CheckCircle;
    if (efficiency > 105) return TrendingUp;
    return TrendingUp;
  };

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Time Tracking Overview
        </h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-4 h-4 text-gray-600" />
            <span className="text-xs text-gray-500">Total Tasks</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{timeStats.totalTasks}</div>
          <div className="text-xs text-gray-500 mt-1">
            {timeStats.completedTasks} completed
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-500">Total Hours</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">
            {formatTime(timeStats.totalActualHours)}
          </div>
          <div className="text-xs text-blue-500 mt-1">
            {formatTime(timeStats.totalEstimatedHours)} estimated
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            {React.createElement(getEfficiencyIcon(timeStats.averageEfficiency), {
              className: `w-4 h-4 ${getEfficiencyColor(timeStats.averageEfficiency)}`
            })}
            <span className="text-xs text-purple-500">Avg Efficiency</span>
          </div>
          <div className={`text-2xl font-bold ${getEfficiencyColor(timeStats.averageEfficiency)}`}>
            {timeStats.averageEfficiency}%
          </div>
          <div className="text-xs text-purple-500 mt-1">
            {timeStats.overTimeTasks} over, {timeStats.underTimeTasks} under
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-500">Pending</span>
          </div>
          <div className="text-2xl font-bold text-yellow-900">{timeStats.pendingVerification}</div>
          <div className="text-xs text-yellow-500 mt-1">
            Need verification
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="border-t border-gray-100 pt-4">
        <div className="flex flex-wrap gap-2">
          {timeStats.pendingVerification > 0 && (
            <button className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
              Verify {timeStats.pendingVerification} Pending Tasks
            </button>
          )}
          
          <button className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors">
            View All Tasks
          </button>
          
          <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
            Export Time Report
          </button>
        </div>
      </div>

      {/* Detailed Tasks List */}
      {showDetails && (
        <div className="mt-6 border-t border-gray-100 pt-6">
          <h4 className="text-md font-semibold text-gray-900 mb-4">Recent Tasks with Time Tracking</h4>
          
          {detailedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No tasks with time tracking found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {detailedTasks.slice(0, 5).map((task) => {
                const timeData = task.actualHours || {};
                const seekerTimeData = Object.values(timeData)[0] || {};
                const efficiency = task.estimatedHours && seekerTimeData.totalHours 
                  ? ((task.estimatedHours / seekerTimeData.totalHours) * 100).toFixed(1)
                  : 0;

                return (
                  <div key={task._id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-900">{task.title}</h5>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span>Est: {formatTime(task.estimatedHours)}</span>
                          <span>Actual: {formatTime(seekerTimeData.totalHours)}</span>
                          <span className={`font-medium ${getEfficiencyColor(efficiency)}`}>
                            {efficiency}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {seekerTimeData.verifiedBy ? (
                          <span className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-yellow-600">
                            <AlertCircle className="w-3 h-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TimeOverview;
