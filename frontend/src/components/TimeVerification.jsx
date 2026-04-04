import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle, AlertTriangle, Calendar, Timer, FileText, Link, Download, Eye, DollarSign } from 'lucide-react';
import API from '../services/api';

const TimeVerification = ({ task, seekerTimeData, onClose, onVerificationComplete }) => {
  const [verification, setVerification] = useState({
    confirmed: true,
    adjustedHours: seekerTimeData.totalHours || 0,
    notes: '',
    paymentApproved: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [workProof, setWorkProof] = useState(null);
  const [showWorkProof, setShowWorkProof] = useState(false);
  const [deadlineAnalysis, setDeadlineAnalysis] = useState({
    isOverdue: false,
    hoursLate: 0,
    deadlineMet: true
  });
  const [paymentCalculation, setPaymentCalculation] = useState({
    basePayment: 0,
    overtimePayment: 0,
    totalPayment: 0
  });

  useEffect(() => {
    if (task && seekerTimeData) {
      analyzeDeadline();
      calculatePayment();
      fetchWorkProof();
    }
  }, [task, seekerTimeData]);

  const analyzeDeadline = () => {
    if (!task.deadline) return;
    
    const deadline = new Date(task.deadline);
    const submissionTime = seekerTimeData.endTime ? new Date(seekerTimeData.endTime) : new Date();
    const hoursLate = Math.max(0, (submissionTime - deadline) / (1000 * 60 * 60));
    
    setDeadlineAnalysis({
      isOverdue: submissionTime > deadline,
      hoursLate,
      deadlineMet: submissionTime <= deadline
    });
  };

  const calculatePayment = () => {
    const baseHours = Math.min(verification.adjustedHours, task.estimatedHours || seekerTimeData.totalHours);
    const overtimeHours = Math.max(0, verification.adjustedHours - (task.estimatedHours || seekerTimeData.totalHours));
    const hourlyRate = task.hourlyRate || 0;
    
    const basePayment = baseHours * hourlyRate;
    const overtimePayment = overtimeHours * hourlyRate * 1.5; // 1.5x for overtime
    
    setPaymentCalculation({
      basePayment,
      overtimePayment,
      totalPayment: basePayment + overtimePayment
    });
  };

  const fetchWorkProof = async () => {
    try {
      const response = await API.get(`/tasks/${task._id}/work-proof`);
      setWorkProof(response.data);
    } catch (error) {
      console.error('Error fetching work proof:', error);
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const verificationData = {
        taskId: task._id,
        seekerId: Object.keys(task.actualHours || {})[0],
        originalHours: seekerTimeData.totalHours,
        adjustedHours: parseFloat(verification.adjustedHours),
        confirmed: verification.confirmed,
        notes: verification.notes,
        paymentApproved: verification.paymentApproved,
        verifiedBy: 'poster', // This would come from auth context
        verifiedAt: new Date().toISOString()
      };

      await API.post(`/tasks/${task._id}/verify-time`, verificationData);
      
      if (onVerificationComplete) {
        onVerificationComplete(verificationData);
      }
      
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to verify time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = () => {
    setVerification(prev => ({
      ...prev,
      confirmed: false,
      paymentApproved: false,
      notes: prev.notes || 'Time verification rejected. Please resubmit with correct time.'
    }));
  };

  const timeDifference = verification.adjustedHours - seekerTimeData.totalHours;
  const hasAdjustment = Math.abs(timeDifference) > 0.01; // More than 1 minute difference

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Verify Seeker's Work Time
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Time Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">Reported Time Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Start Time</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(seekerTimeData.startTime)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">End Time</div>
                <div className="text-sm font-medium text-gray-900">
                  {formatDate(seekerTimeData.endTime)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Reported Hours</div>
                <div className="text-lg font-semibold text-blue-600">
                  {formatTime(seekerTimeData.totalHours)}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Estimated Hours</div>
                <div className="text-lg font-semibold text-gray-600">
                  {formatTime(task.estimatedHours)}
                </div>
              </div>
            </div>
          </div>

          {/* Deadline Analysis */}
          {task.deadline && (
            <div className={`rounded-lg p-4 border ${
              deadlineAnalysis.deadlineMet 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}>
              <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Deadline Analysis
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Deadline</div>
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(task.deadline).toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Submission Time</div>
                  <div className="text-sm font-medium text-gray-900">
                    {formatDate(seekerTimeData.endTime)}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className={`text-sm font-medium ${
                    deadlineAnalysis.deadlineMet ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {deadlineAnalysis.deadlineMet ? '✅ Submitted on time' : `❌ ${formatTime(deadlineAnalysis.hoursLate)} late`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Work Proof Section */}
          {workProof && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Work Proof Submitted
                </h3>
                <button
                  type="button"
                  onClick={() => setShowWorkProof(true)}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 text-sm"
                >
                  <Eye className="w-3 h-3" />
                  View Proof
                </button>
              </div>
              <div className="flex gap-4 text-xs text-gray-600">
                <span>📎 {workProof.files?.length || 0} files</span>
                <span>🔗 {workProof.links?.length || 0} links</span>
                <span>📝 {workProof.description ? 'Description provided' : 'No description'}</span>
              </div>
            </div>
          )}

          {/* Payment Calculation */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payment Calculation
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Base Payment:</span>
                <span className="font-medium text-green-900">₹{paymentCalculation.basePayment.toFixed(2)}</span>
              </div>
              {paymentCalculation.overtimePayment > 0 && (
                <div className="flex justify-between">
                  <span className="text-green-700">Overtime (1.5x):</span>
                  <span className="font-medium text-green-900">₹{paymentCalculation.overtimePayment.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-green-200">
                <span className="font-medium text-green-900">Total Payment:</span>
                <span className="font-bold text-green-900 text-lg">₹{paymentCalculation.totalPayment.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Verification Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Hours Worked
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={verification.adjustedHours}
                  onChange={(e) => setVerification(prev => ({
                    ...prev,
                    adjustedHours: parseFloat(e.target.value) || 0
                  }))}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <span className="text-sm text-gray-500">hours</span>
              </div>
              {hasAdjustment && (
                <div className={`mt-2 text-sm flex items-center gap-1 ${
                  timeDifference > 0 ? 'text-red-600' : 'text-blue-600'
                }`}>
                  <AlertTriangle className="w-4 h-4" />
                  {timeDifference > 0 ? 'Increased by' : 'Decreased by'} {formatTime(Math.abs(timeDifference))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Notes (Optional)
              </label>
              <textarea
                value={verification.notes}
                onChange={(e) => setVerification(prev => ({
                  ...prev,
                  notes: e.target.value
                }))}
                placeholder="Add any notes about the verification..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confirmed"
                  checked={verification.confirmed}
                  onChange={(e) => setVerification(prev => ({
                    ...prev,
                    confirmed: e.target.checked
                  }))}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="confirmed" className="ml-2 text-sm text-gray-700">
                  I confirm that the work was completed as reported
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="payment"
                  checked={verification.paymentApproved}
                  onChange={(e) => setVerification(prev => ({
                    ...prev,
                    paymentApproved: e.target.checked
                  }))}
                  disabled={!verification.confirmed}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                />
                <label htmlFor="payment" className="ml-2 text-sm text-gray-700">
                  Approve payment for the verified hours
                </label>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleReject}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reject Time
            </button>
            
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={loading || !verification.confirmed}
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Verify Time
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Work Proof Modal */}
      {showWorkProof && workProof && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  Work Proof Details
                </h2>
                <button
                  onClick={() => setShowWorkProof(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Work Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Work Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Time:</span>
                      <span className="font-medium ml-2">{formatTime(seekerTimeData.totalHours)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Submitted:</span>
                      <span className="font-medium ml-2">
                        {formatDate(seekerTimeData.endTime)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {workProof.description && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Work Description</h3>
                    <p className="text-gray-600 bg-gray-50 rounded-lg p-4">
                      {workProof.description}
                    </p>
                  </div>
                )}

                {/* Files */}
                {workProof.files && workProof.files.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Uploaded Files</h3>
                    <div className="space-y-2">
                      {workProof.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FileText className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{file.name}</span>
                            <span className="text-xs text-gray-500">
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
                            <Download className="w-3 h-3" />
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Links */}
                {workProof.links && workProof.links.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Work Links</h3>
                    <div className="space-y-2">
                      {workProof.links.map((link, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Link className="w-4 h-4 text-gray-400" />
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800 truncate flex-1"
                          >
                            {link}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setShowWorkProof(false)}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                  >
                    Close
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

export default TimeVerification;
