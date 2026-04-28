import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase, Users, Plus, Eye, CheckCircle, Star, MessageSquare
} from 'lucide-react';
import API from '../services/api';

const PosterDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplicants: 0, totalEarnings: 0 });
  const [postedJobs, setPostedJobs] = useState([]);
  const [jobRatings, setJobRatings] = useState({}); // { jobId: { avg, count } }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const [jobsRes, appsRes] = await Promise.all([
        API.get('/jobs/my-jobs'),
        API.get('/applications/poster')
      ]);

      setPostedJobs(jobsRes.data);
      setDashboardStats({
        totalJobs: jobsRes.data.length,
        activeJobs: jobsRes.data.filter(j => j.status === 'active').length,
        totalApplicants: appsRes.data.length,
      });



      // Fetch real ratings for all jobs in parallel
      const ratingsMap = {};
      await Promise.all(
        jobsRes.data.map(async (job) => {
          try {
            const res = await API.get(`/reviews/job/${job._id}`);
            const reviews = res.data || [];
            const avg = reviews.length
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : 0;
            ratingsMap[job._id] = { avg: parseFloat(avg), count: reviews.length };
          } catch {
            ratingsMap[job._id] = { avg: 0, count: 0 };
          }
        })
      );
      setJobRatings(ratingsMap);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

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
          <Link to="/poster/post-job" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium">
            <Plus size={20} /> Post Job
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard icon={Briefcase} title="Total Jobs" value={dashboardStats.totalJobs} color="bg-blue-600" />
          <StatCard icon={CheckCircle} title="Active" value={dashboardStats.activeJobs} color="bg-emerald-600" />
          <Link to="/poster/applicants" className="block transform hover:scale-[1.02] transition-transform">
            <StatCard icon={Users} title="Applicants" value={dashboardStats.totalApplicants} color="bg-purple-600" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {postedJobs.map((job) => {
            const rating = jobRatings[job._id] || { avg: 0, count: 0 };
            const isExpired = job.deadline && new Date(job.deadline) < new Date();
            return (
              <div key={job._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-lg font-bold text-slate-900">{job.title}</h3>
                  {isExpired && (
                    <span className="shrink-0 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                      ⌛ Deadline Passed
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-500 mb-4 line-clamp-2">{job.description}</p>

                {/* Rating row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={14}
                          className={star <= Math.round(rating.avg)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{rating.avg.toFixed(1)}</span>
                    <span className="text-xs text-slate-500">({rating.count})</span>
                  </div>

                  {/* ✅ Read Reviews button */}
                  <Link
                    to={`/jobs/${job._id}/reviews`}
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <MessageSquare size={13} /> Read Reviews
                  </Link>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100">
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
