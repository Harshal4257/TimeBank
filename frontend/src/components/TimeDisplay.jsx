import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
//   application  — the application object (has timerStartedAt, submittedAt, status)
//   job          — the job object (has hours)
//   role         — 'seeker' | 'poster'

const TimeDisplay = ({ application, job, role = 'poster' }) => {
  const [now, setNow] = useState(Date.now());

  // Live clock — only ticks when timer is running (accepted + timerStartedAt set + not submitted)
  useEffect(() => {
    const isRunning =
      application?.status === 'accepted' && application?.timerStartedAt;
    if (!isRunning) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [application?.status, application?.timerStartedAt]);

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

  // ── Case 3: Timer is running or job is done ──
  const timerStartedAt = new Date(application.timerStartedAt).getTime();
  const submittedAt = application.submittedAt
    ? new Date(application.submittedAt).getTime()
    : null;
  const allowedMs = (job?.hours || 0) * 3600 * 1000;
  const deadlineMs = timerStartedAt + allowedMs;

  const elapsedMs = submittedAt
    ? submittedAt - timerStartedAt   // fixed once submitted
    : now - timerStartedAt;          // live while running

  const remainingMs = deadlineMs - (submittedAt || now);
  const isOverdue = remainingMs < 0;
  const isRunning = application.status === 'accepted';
  const isSubmitted = application.status === 'submitted' || application.status === 'completed';

  const submittedOnTime = submittedAt ? submittedAt <= deadlineMs : null;
  const progressPct = Math.min((elapsedMs / allowedMs) * 100, 100);

  // ── Status badge ──
  let badge = null;
  if (isRunning) {
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
        {badge && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.bg} ${badge.text}`}>
            {badge.label}
          </span>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-slate-50 rounded-xl p-3 text-center">
          <p className="text-xs text-slate-500 mb-1">Time Allowed</p>
          <p className="text-lg font-black text-slate-800">{job?.hours || 0}h 0m</p>
        </div>

        <div className={`rounded-xl p-3 text-center ${
          isRunning && isOverdue ? 'bg-red-50' :
          isSubmitted && !submittedOnTime ? 'bg-orange-50' : 'bg-blue-50'
        }`}>
          <p className="text-xs text-slate-500 mb-1">
            {isSubmitted ? 'Time Taken' : 'Elapsed'}
          </p>
          <p className={`text-lg font-black ${
            isRunning && isOverdue ? 'text-red-700' :
            isSubmitted && !submittedOnTime ? 'text-orange-700' : 'text-blue-800'
          }`}>
            {formatDuration(elapsedMs)}
          </p>
        </div>

        <div className={`rounded-xl p-3 text-center ${
          isRunning ? (isOverdue ? 'bg-red-50' : 'bg-emerald-50') : 'bg-slate-50'
        }`}>
          <p className="text-xs text-slate-500 mb-1">
            {isRunning ? 'Remaining' : (submittedOnTime ? 'Saved' : 'Over By')}
          </p>
          <p className={`text-lg font-black ${
            isRunning && isOverdue ? 'text-red-700' :
            isRunning ? 'text-emerald-700' :
            submittedOnTime ? 'text-emerald-700' : 'text-orange-700'
          }`}>
            {isRunning
              ? (isOverdue ? `+${formatDuration(-remainingMs)}` : formatDuration(remainingMs))
              : submittedAt
                ? (submittedOnTime
                    ? formatDuration(deadlineMs - submittedAt)
                    : `+${formatDuration(submittedAt - deadlineMs)}`)
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

      {/* Seeker urgency message while running */}
      {role === 'seeker' && isRunning && (
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
