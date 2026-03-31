
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, DollarSign, Plus, Eye, CheckCircle, Star, MessageSquare, TrendingUp, Filter
} from 'lucide-react';
import API from '../services/api';

const PosterDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplicants: 0, totalEarnings: 0 });
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Calculate rating data from localStorage
  const getRatingData = (jobId) => {
    try {
      const jobReviews = JSON.parse(localStorage.getItem('jobReviews') || '{}');
      const reviews = jobReviews[jobId] || [];
      
      if (reviews.length === 0) {
        return { averageRating: 0, reviewCount: 0 };
      }
      
      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;
      
      return { averageRating, reviewCount: reviews.length };
    } catch (error) {
      console.error('Error calculating rating data:', error);
      return { averageRating: 0, reviewCount: 0 };
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // 1. Fetch poster's jobs
      const jobsRes = await API.get('/jobs/my-jobs');
      setPostedJobs(jobsRes.data);

      // 2. Fetch all applications for poster's jobs
      const appsRes = await API.get('/applications/poster');

      // Calculate dashboard stats
      setDashboardStats({
        totalJobs: jobsRes.data.length,
        activeJobs: jobsRes.data.filter(j => j.status === 'active').length,
        totalApplicants: appsRes.data.length,
        totalEarnings: 0 // Could calculate this too later
      });
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };


  // ... before StatCard component ...
  // --- Stat Card Component ---
  const StatCard = ({ icon: Icon, title, value, color }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg ${color}`}><Icon size={24} className="text-white" /></div>
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
      </div>
    </div>
  );

 if (loading) return (
    <div className="min-h-screen bg-[#E6EEF2] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
    </div>
);

  return (
    <div className="min-h-screen bg-[#E6EEF2] pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">📋 Poster Dashboard</h1>
          <Link to="/poster/post-job" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium"><Plus size={20} />Post Job</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <StatCard icon={Briefcase} title="Total Jobs" value={dashboardStats.totalJobs} color="bg-blue-600" />
          <StatCard icon={CheckCircle} title="Active" value={postedJobs.filter(j => j.status === 'active').length} color="bg-emerald-600" />
          <Link to="/poster/applicants" className="block transform hover:scale-[1.02] transition-transform">
            <StatCard icon={Users} title="Applicants" value={dashboardStats.totalApplicants} color="bg-purple-600" />
          </Link>
          <StatCard icon={DollarSign} title="Earnings" value={`₹${dashboardStats.totalEarnings}`} color="bg-orange-600" />
        </div>

        {/* My Jobs Section */}
        {/* <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My Jobs</h2>
            <Link
              to="/poster/post-job"
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              <Plus size={16} /> Post New Job
            </Link>
          </div> */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {postedJobs.map((job) => {
              const ratingData = getRatingData(job._id);
              return (
              <div key={job._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <h3 className="text-lg font-bold text-slate-900 mb-2">{job.title}</h3>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{job.description}</p>
                
                {/* Job Reviews Summary - Always Visible */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={`${
                            star <= ratingData.averageRating
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {ratingData.averageRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">
                      ({ratingData.reviewCount})
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                  <span className="text-emerald-600 font-bold">₹{job.hourlyRate}/hr</span>
                  <Link
                    to={`/poster/job/${job._id}`}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                  >
                    <Eye size={16} /> View Job
                  </Link>
                </div>
              </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default PosterDashboard;