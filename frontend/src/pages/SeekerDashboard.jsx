import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, Settings, Briefcase, Zap } from 'lucide-react'; // Added Zap icon
import SeekerNavbar from '../components/SeekerNavbar';
import JobCard from '../components/JobCard';
import API from '../services/api';

const SeekerDashboard = () => {
  const [matchingJobs, setMatchingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchMatchingJobs();
  }, []);

  const fetchMatchingJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Hits your Cosine Similarity endpoint
      const response = await API.get('/jobs/match');
      setMatchingJobs(response.data);
    } catch (err) {
      console.error('Error fetching matching jobs:', err);
      setError('Failed to load matching jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/api/applications/apply/${jobId}`);
      setAppliedJobs([...appliedJobs, jobId]);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for job:', err);
      alert('Failed to apply. Please try again.');
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await API.delete(`/api/jobs/save/${jobId}`);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        await API.post(`/api/jobs/save/${jobId}`);
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <SeekerNavbar />
      
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="text-amber-500 fill-amber-500" size={28} />
                Smart Matches for You
              </h1>
              <p className="text-slate-600">
                Sorted by how well they match your profile skills.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={fetchMatchingJobs}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Recalculate Matches
              </button>
              
              <Link
                to="/browse-jobs"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Search size={18} />
                Explore All
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-slate-600 font-medium">Analyzing skill similarity...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <Settings size={48} className="mx-auto text-red-600 mb-4" />
            <h3 className="text-xl font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button onClick={fetchMatchingJobs} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && matchingJobs.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
            <Briefcase size={64} className="mx-auto text-slate-300 mb-6" />
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No perfect matches yet</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              We couldn't find jobs that match your current skills. Try adding more skills to your profile to improve your match score!
            </p>
            <Link to="/profile" className="px-8 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-100 transition-all">
              Update My Skills
            </Link>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && matchingJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                // job.matchScore is passed here automatically as part of the job object
                onApply={handleApply}
                onSave={handleSaveJob}
                isApplied={appliedJobs.includes(job._id)}
                isSaved={savedJobs.includes(job._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerDashboard;