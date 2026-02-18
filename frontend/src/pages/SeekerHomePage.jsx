import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, RefreshCw, Settings, Briefcase } from 'lucide-react';
import SeekerNavbar from '../components/SeekerNavbar';
import JobCard from '../components/JobCard';
import API from '../services/api';

const SeekerHomePage = () => {
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
      
      const response = await API.get('/api/jobs/match');
      setMatchingJobs(response.data);
    } catch (err) {
      console.error('Error fetching matching jobs:', err);
      setError('There are no matching jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await API.post(`/api/applications/apply/${jobId}`);
      setAppliedJobs([...appliedJobs, jobId]);
      // Show success message
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for job:', err);
      alert('Failed to apply. Please try again.');
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        // Remove from saved
        await API.delete(`/api/jobs/save/${jobId}`);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        // Save job
        await API.post(`/api/jobs/save/${jobId}`);
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      alert('Failed to save job. Please try again.');
    }
  };

  const handleUpdateSkills = () => {
    // Navigate to profile page to update skills
    window.location.href = '/profile';
  };

  const handleBrowseAllJobs = () => {
    // Navigate to browse jobs page
    window.location.href = '/browse-jobs';
  };

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      <SeekerNavbar />
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                🔥 Jobs Matching Your Skills
              </h1>
              <p className="text-slate-600">
                Discover opportunities that perfectly match your expertise
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={fetchMatchingJobs}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-slate-600">Finding matching jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <div className="text-red-600 mb-4">
              <Briefcase size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">No Jobs Found</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button
              onClick={fetchMatchingJobs}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Jobs Found State */}
        {!loading && !error && matchingJobs.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
            <div className="text-slate-400 mb-6">
              <Briefcase size={64} className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              😔 No matching jobs found for your skills
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              Try updating your skills or browse all jobs to find more opportunities
            </p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleUpdateSkills}
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
              >
                Update Skills
              </button>
            </div>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && !error && matchingJobs.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matchingJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApply}
                onSave={handleSaveJob}
                isApplied={appliedJobs.includes(job._id)}
                isSaved={savedJobs.includes(job._id)}
              />
            ))}
          </div>
        )}

        {/* Results Summary */}
        {!loading && !error && matchingJobs.length > 0 && (
          <div className="mt-8 text-center text-slate-600">
            <p>Found {matchingJobs.length} matching jobs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeekerHomePage;
