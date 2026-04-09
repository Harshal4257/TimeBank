import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Clock, DollarSign, Bookmark, ExternalLink, Star, MessageSquare } from 'lucide-react';

const JobCard = ({ job, onApply, onSave, isApplied = false, isSaved = false }) => {
  const rawScore = job.matchScore || 0;
  const displayScore = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);

  // Use real rating data from DB (populated by reviewController on User model)
  const avgRating = parseFloat(job.poster?.rating || 0);
  const reviewCount = job.poster?.numReviews || 0;

  const getMatchColor = (score) => {
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 40) return 'bg-amber-500';
    return 'bg-slate-400';
  };

  const getMatchTextColor = (score) => {
    if (score >= 75) return 'text-emerald-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-slate-500';
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-emerald-300 group flex flex-col h-full relative overflow-hidden">

      {displayScore >= 80 && (
        <div className="absolute -right-12 top-6 rotate-45 bg-emerald-600 text-white text-[10px] font-black py-1 w-44 text-center shadow-lg uppercase tracking-tighter">
          Best Fit
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1 pr-8">
            {job.title}
          </h3>
          <p className="text-slate-500 font-medium text-sm flex items-center gap-1">
            <Briefcase size={14} />
            {job.poster?.name || 'Community Member'}
          </p>
        </div>
        <button
          onClick={() => onSave(job._id)}
          className={`p-2 rounded-xl transition-all ${isSaved ? 'bg-amber-100 text-amber-600' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
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

      {/* Skills */}
      <div className="mb-5 flex-grow">
        <div className="flex flex-wrap gap-1.5">
          {job.requiredSkills?.slice(0, 4).map((skill, index) => (
            <span key={index} className="px-2.5 py-0.5 bg-white text-slate-500 text-[10px] font-bold uppercase tracking-wider rounded-md border border-slate-200">
              {skill}
            </span>
          ))}
          {job.requiredSkills?.length > 4 && (
            <span className="text-[10px] text-slate-400 font-bold self-center">+{job.requiredSkills.length - 4} more</span>
          )}
        </div>
      </div>

      {/* ✅ Reviews — real data from DB via poster rating */}
      <div className="mb-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} className={s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-700">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-slate-500">({reviewCount} reviews)</span>
          </div>
          {/* ✅ Links to real JobReviews page */}
          <Link
            to={`/jobs/${job._id}/reviews`}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
          >
            <MessageSquare size={12} />
            Read Reviews
          </Link>
        </div>
      </div>

      {/* Match Score */}
      {job.matchScore !== undefined && (
        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Profile Match</span>
            <span className={`text-sm font-black ${getMatchTextColor(job.matchScore)}`}>{Math.round(job.matchScore)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div className={`${getMatchColor(job.matchScore)} h-full transition-all duration-700 ease-out`}
              style={{ width: `${Math.max(job.matchScore, 5)}%` }} />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onApply(job._id)}
          disabled={isApplied}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-200 ${
            isApplied ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md shadow-emerald-100'
          }`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </button>
        <Link to={`/jobs/${job._id}`}
          className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
          title="View full details">
          <ExternalLink size={18} />
        </Link>
      </div>
    </div>
  );
};

export default JobCard;
