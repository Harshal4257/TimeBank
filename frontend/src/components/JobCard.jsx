import React from 'react';
import { Briefcase, MapPin, Clock, DollarSign, Bookmark, ExternalLink } from 'lucide-react';

const JobCard = ({ job, onApply, onSave, isApplied = false, isSaved = false }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-emerald-300 group">
      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors">
            {job.title}
          </h3>
          <p className="text-slate-600 font-medium">{job.poster?.name || 'Company'}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onSave(job._id)}
            className={`p-2 rounded-lg transition-colors ${
              isSaved 
                ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' 
                : 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600'
            }`}
            title={isSaved ? 'Remove from saved' : 'Save job'}
          >
            <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-4">
        {/* Hourly Rate */}
        <div className="flex items-center gap-2 text-slate-700">
          <DollarSign size={16} className="text-emerald-600" />
          <span className="font-semibold text-emerald-600">₹{job.hourlyRate}/hr</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-slate-600">
          <MapPin size={16} />
          <span className="text-sm">{job.location || 'Remote'}</span>
        </div>

        {/* Posted Date */}
        <div className="flex items-center gap-2 text-slate-500">
          <Clock size={16} />
          <span className="text-sm">Posted {formatDate(job.createdAt)}</span>
        </div>
      </div>

      {/* Required Skills */}
      <div className="mb-4">
        <p className="text-sm text-slate-600 mb-2">Required Skills:</p>
        <div className="flex flex-wrap gap-2">
          {job.requiredSkills?.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Match Score (if available) */}
      {job.matchScore !== undefined && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-slate-600">Skill Match</span>
            <span className="text-sm font-semibold text-emerald-600">{Math.round(job.matchScore)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${job.matchScore}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => onApply(job._id)}
          disabled={isApplied}
          className={`flex-1 py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
            isApplied
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-lg'
          }`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </button>
        
        <button
          onClick={() => window.open(`/jobs/${job._id}`, '_blank')}
          className="px-4 py-2.5 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors"
          title="View job details"
        >
          <ExternalLink size={18} />
        </button>
      </div>
    </div>
  );
};

export default JobCard;
