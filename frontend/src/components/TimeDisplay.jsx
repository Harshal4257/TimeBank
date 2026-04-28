import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle, PauseCircle, PlayCircle } from 'lucide-react';
import API from '../services/api';

// ─── Helpers ────────────────────────────────────────────────
const formatDuration = (ms) => {
  if (ms <= 0) return '0h 0m 0s';
  const totalSeconds = Math.floor(ms / 1000);
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${h}h ${m}m ${s}s`;
};

const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
};

// ─── TimeDisplay Component ───────────────────────────────────
// Props:
//   application  — the application object
//   job          — the job object (has hours)
//   role         — 'seeker' | 'poster'
//   onApplicationUpdate — optional callback when app is updated (pause/resume)

const TimeDisplay = ({ application: initialApplication, job, role = 'poster', onApplicationUpdate }) => {
  const [now, setNow] = useState(Date.now());
  const [application, setApplication] = useState(initialApplication);
  const [actionLoading, setActionLoading] = useState(false);

  // Keep local application in sync when prop changes
  useEffect(() => {
    setApplication(initialApplication);
  }, [initialApplication]);

  const timerStatus = application?.timerStatus || 'idle';
  const isPaused = timerStatus === 'paused';
  const isRunning = application?.status === 'accepted' && timerStatus === 'running';

  // Live clock — ticks only when the timer is actively running (not paused)
  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  // ── Pause handler ──
  const handlePause = async () => {
    if (!application) return;
    try {
      setActionLoading(true);
      const res = await API.put(`/applications/${application._id}/pause-timer`);
      setApplication(res.data.application);
      onApplicationUpdate?.(res.data.application);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to pause timer.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Resume handler ──
  const handleResume = async () => {
    if (!application) return;
    try {
      setActionLoading(true);
      const res = await API.put(`/applications/${application._id}/resume-timer`);
      setApplication(res.data.application);
      onApplicationUpdate?.(res.data.application);
      setNow(Date.now()); // kick the live clock immediately
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resume timer.');
    } finally {
      setActionLoading(false);
    }
  };

  // ── Case 1: Not yet accepted ──
  if (!application || !application.acceptedAt) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-5 h-5 text-slate-400" />
          <h3 className="text-base font-bold text-slate-700">Time Tracking</h3>
        </div>
        <p className="text-sm text-slate-400">Timer starts when the seeker begins work.</p>
      </div>
    );
  }

  // ── Case 2: Accepted but seeker hasn't started yet ──
  if (application.status === 'accepted' && !application.timerStartedAt) {
    return (
      <div className="bg-white border border-amber-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-bold text-slate-800">Time Tracking</h3>
          <span className="ml-auto px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
            ⏳ Not Started
          </span>
        </div>
        <p className="text-sm text-slate-500">
          {role === 'poster'
            ? 'Waiting for the seeker to start work. The timer will begin once they click "Start Work".'
            : 'Click "Start Work" below to unlock the files and begin the timer.'}
        </p>
        <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700">
          ⏱ Time allowed: <span className="font-bold">{job?.hours || 0} hour{job?.hours !== 1 ? 's' : ''}</span>
        </div>
      </div>
    );
  }

  // ── Case 3: Timer started (running, paused, or job done) ──
  const timerStartedAt = new Date(application.timerStartedAt).getTime();
  const submittedAt = application.submittedAt
    ? new Date(application.submittedAt).getTime()
    : null;
  const allowedMs = (job?.hours || 0) * 3600 * 1000;
  const deadlineMs = timerStartedAt + allowedMs;

  // Total paused time accumulated in DB + ongoing pause (if currently paused)
  const savedPausedMs = application.totalPausedMs || 0;
  const ongoingPauseMs = isPaused && application.timerPausedAt
    ? now - new Date(application.timerPausedAt).getTime()
    : 0;
  const totalPausedMs = savedPausedMs + ongoingPauseMs;

  // Effective elapsed = wall-clock elapsed minus all paused time
  const wallElapsedMs = submittedAt
    ? submittedAt - timerStartedAt
    : now - timerStartedAt;
  const elapsedMs = Math.max(0, wallElapsedMs - totalPausedMs);

  const remainingMs = allowedMs - (submittedAt ? submittedAt - timerStartedAt - savedPausedMs : elapsedMs);
  const isOverdue = remainingMs < 0;
  const isJobRunning = application.status === 'accepted'; // status-based (not paused check)
  const isSubmitted = application.status === 'submitted' || application.status === 'completed';

  const submittedOnTime = submittedAt ? (submittedAt - timerStartedAt - savedPausedMs) <= allowedMs : null;
  const progressPct = Math.min((elapsedMs / allowedMs) * 100, 100);

  // ── Status badge ──
  let badge = null;
  if (isJobRunning && isPaused) {
    badge = { label: '⏸ Paused', bg: 'bg-yellow-100', text: 'text-yellow-700' };
  } else if (isJobRunning) {
    badge = isOverdue
      ? { label: '⚠️ Overdue', bg: 'bg-red-100', text: 'text-red-700' }
      : { label: '🟢 In Progress', bg: 'bg-emerald-100', text: 'text-emerald-700' };
  } else if (isSubmitted) {
    badge = submittedOnTime
      ? { label: '✅ Submitted On Time', bg: 'bg-emerald-100', text: 'text-emerald-700' }
      : { label: '⚠️ Submitted Late', bg: 'bg-orange-100', text: 'text-orange-700' };
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold text-slate-800">Time Tracking</h3>
        </div>
        <div className="flex items-center gap-2">
          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
              {badge.label}
            </span>
          )}

          {/* ── Pause / Resume button — seeker only, while job is still accepted ── */}
          {role === 'seeker' && isJobRunning && (
            isPaused ? (
              <button
                onClick={handleResume}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 text-white rounded-full text-xs font-bold hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm"
              >
                <PlayCircle size={14} />
                {actionLoading ? 'Resuming...' : 'Resume'}
              </button>
            ) : (
              <button
                onClick={handlePause}
                disabled={actionLoading}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-yellow-500 text-white rounded-full text-xs font-bold hover:bg-yellow-600 disabled:opacity-50 transition-all shadow-sm"
              >
                <PauseCircle size={14} />
                {actionLoading ? 'Pausing...' : 'Pause'}
              </button>
            )
          )}
        </div>
      </div>

      {/* Pause info bar — shown while paused */}
      {isJobRunning && isPaused && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl flex items-center gap-2 text-sm text-yellow-800">
          <PauseCircle size={16} className="shrink-0" />
          <span>
            Timer is <strong>paused</strong>. You can resume anytime to continue working on your remaining time.
            {savedPausedMs > 0 && (
              <span className="ml-1 text-xs text-yellow-600">
                (Total paused so far: {formatDuration(savedPausedMs)})
              </span>
            )}
          </span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Time Allowed</p>
          <p className="text-lg font-black text-slate-800">{job?.hours || 0}h 0m</p>
        </div>

        <div className={`rounded-xl p-3 text-center ${
          isJobRunning && isOverdue ? 'bg-red-50' :
          isSubmitted && !submittedOnTime ? 'bg-orange-50' : 'bg-blue-50'
        }`}>
          <p className="text-xs text-slate-500 mb-1">
            {isSubmitted ? 'Time Taken' : 'Elapsed'}
          </p>
          <p className={`text-lg font-black ${
            isJobRunning && isOverdue ? 'text-red-700' :
            isSubmitted && !submittedOnTime ? 'text-orange-700' : 'text-blue-800'
          }`}>
            {formatDuration(elapsedMs)}
          </p>
        </div>

        <div className={`rounded-xl p-3 text-center ${
          isJobRunning ? (isOverdue ? 'bg-red-50' : 'bg-emerald-50') : 'bg-slate-50'
        }`}>
          <p className="text-xs text-slate-500 mb-1">
            {isJobRunning ? 'Remaining' : (submittedOnTime ? 'Saved' : 'Over By')}
          </p>
          <p className={`text-lg font-black ${
            isJobRunning && isOverdue ? 'text-red-700' :
            isJobRunning ? 'text-emerald-700' :
            submittedOnTime ? 'text-emerald-700' : 'text-orange-700'
          }`}>
            {isJobRunning
              ? (isOverdue ? `+${formatDuration(-remainingMs)}` : formatDuration(remainingMs))
              : submittedAt
                ? (submittedOnTime
                    ? formatDuration(allowedMs - (submittedAt - timerStartedAt - savedPausedMs))
                    : `+${formatDuration((submittedAt - timerStartedAt - savedPausedMs) - allowedMs)}`)
                : '—'
            }
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Start</span>
          <span>{Math.round(progressPct)}% used</span>
          <span>Deadline</span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-1000 ${
              progressPct >= 100 ? 'bg-red-500' :
              progressPct >= 80 ? 'bg-orange-400' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Timestamps */}
      <div className="border-t border-slate-100 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-500">
        <div>
          <p className="font-semibold text-slate-600 mb-0.5">⏱ Work Started</p>
          <p>{formatDateTime(application.timerStartedAt)}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-600 mb-0.5">🏁 Deadline</p>
          <p>{formatDateTime(new Date(deadlineMs))}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-600 mb-0.5">
            {isSubmitted ? '📦 Submitted' : '📦 Not yet submitted'}
          </p>
          <p>{isSubmitted ? formatDateTime(application.submittedAt) : '—'}</p>
        </div>
      </div>

      {/* Seeker urgency message while running (not paused) */}
      {role === 'seeker' && isJobRunning && !isPaused && (
        <div className={`mt-4 p-3 rounded-xl text-sm font-medium ${
          isOverdue
            ? 'bg-red-50 text-red-700 border border-red-200'
            : remainingMs < 30 * 60 * 1000
              ? 'bg-orange-50 text-orange-700 border border-orange-200'
              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {isOverdue
            ? '⚠️ You have exceeded the time limit. Please submit as soon as possible.'
            : remainingMs < 30 * 60 * 1000
              ? '⏰ Less than 30 minutes remaining! Submit your work soon.'
              : '✅ You are within the time limit. Keep going!'}
        </div>
      )}
    </div>
  );
};

export default TimeDisplay;
