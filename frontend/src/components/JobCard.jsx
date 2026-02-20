import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Bookmark, ExternalLink } from 'lucide-react';

const JobCard = ({ job, onApply, onSave, isApplied = false, isSaved = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  // Helper to change color based on the match percentage
  const getMatchColor = (score) => {
    if (score >= 75) return 'bg-emerald-500'; // High Match
    if (score >= 40) return 'bg-amber-500';   // Medium Match
    return 'bg-slate-400';                    // Low Match
  };

  const getMatchTextColor = (score) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-slate-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-300 group flex flex-col h-full">
      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-1">
            <Briefcase size={14} />
            {job.poster?.name || 'Community Member'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(job._id)}
            className={`p-2 rounded-xl transition-all ${
              isSaved 
                ? 'bg-amber-100 text-amber-600' 
                : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="flex items-center gap-2 text-slate-700 bg-slate-50 p-2 rounded-lg">
          <DollarSign size={16} className="text-emerald-600" />
          <span className="font-bold text-emerald-700 text-sm">₹{job.hourlyRate}/hr</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 p-2 rounded-lg">
          <Clock size={16} className="text-slate-400" />
          <span className="text-xs font-medium">{job.hours} hrs total</span>
        </div>
      </div>

      {/* Required Skills */}
      <div className="mb-5 flex-grow">
        <div className="flex flex-wrap gap-1.5">
          {job.requiredSkills?.slice(0, 4).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-0.5 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200"
            >
              {skill}
            </span>
          ))}
          {job.requiredSkills?.length > 4 && (
            <span className="text-[10px] text-slate-400 font-bold self-center">
              +{job.requiredSkills.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Match Score Progress Bar */}
      {job.matchScore !== undefined && (
        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Profile Match</span>
            <span className={`text-sm font-black ${getMatchTextColor(job.matchScore)}`}>
              {Math.round(job.matchScore)}%
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`${getMatchColor(job.matchScore)} h-full transition-all duration-700 ease-out`}
              style={{ width: `${Math.max(job.matchScore, 5)}%` }} // Minimum 5% width for visibility
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => onApply(job._id)}
          disabled={isApplied}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            isApplied
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100 hover:shadow-emerald-200'
          }`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </button>
        
        <button
          onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
          className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          title="View full details"
        >
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;