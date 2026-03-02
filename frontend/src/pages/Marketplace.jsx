import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import JobCard from '../components/JobCard';

const Marketplace = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // 1. Fetch available jobs
        const jobsRes = await API.get('/jobs');
        setJobs(jobsRes.data);

        // 2. Fetch already applied jobs
        const appsRes = await API.get('/applications/my');
        setAppliedJobs(appsRes.data.map(app => app.jobId?._id));

        // 3. Fetch saved jobs (Ensure backend route exists)
        // const savedRes = await API.get('/jobs/saved');
        // setSavedJobs(savedRes.data.map(j => j._id));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleApply = async (jobId) => {
    try {
      await API.post(`/applications/apply/${jobId}`);
      setAppliedJobs([...appliedJobs, jobId]);
      alert('Application submitted successfully!');
    } catch (err) {
      console.error('Error applying for job:', err);
      if (err.response?.status === 401) navigate('/login');
      alert('Failed to apply. ' + (err.response?.data?.message || 'Please try again.'));
    }
  };

  const handleSaveJob = async (jobId) => {
    try {
      if (savedJobs.includes(jobId)) {
        await API.delete(`/jobs/save/${jobId}`);
        setSavedJobs(savedJobs.filter(id => id !== jobId));
      } else {
        await API.post(`/jobs/save/${jobId}`);
        setSavedJobs([...savedJobs, jobId]);
      }
    } catch (err) {
      console.error('Error saving job:', err);
      if (err.response?.status === 401) navigate('/login');
      alert('Failed to save job. Please try again.');
    }
  };

  if (loading) return <div className="p-10 text-center font-medium">Finding available tasks...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Skill Marketplace</h1>
        <p className="text-slate-500 mb-10 text-lg">Help others to earn Time Credits.</p>

        {jobs.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xl">No tasks available right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
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
      </div>
    </div>
  );
};

export default Marketplace;