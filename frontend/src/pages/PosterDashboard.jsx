
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Users, DollarSign, Plus, Trash2, Eye, Calendar, 
  MapPin, CheckCircle, ArrowLeft, Edit, Mail, Tag, Clock
} from 'lucide-react';
import API from '../services/api';

const PosterDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({ totalJobs: 0, activeJobs: 0, totalApplicants: 0, totalEarnings: 0 });
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null); // Logic for View Job

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const jobsResponse = await API.get('/jobs/my-jobs'); 
      setPostedJobs(jobsResponse.data);
      // Optional: Set stats based on the response length
      setDashboardStats(prev => ({...prev, totalJobs: jobsResponse.data.length}));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

// ... after fetchDashboardData ...

  const deleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      // Corrected: Removed the manual '/api' prefix
      await API.delete(`/jobs/${jobId}`);
      
      setSelectedJob(null);      // Returns user to the list view
      fetchDashboardData();      // Updates the list to remove the deleted job
      
      alert("✅ Job deleted successfully.");
    } catch (err) { 
      console.error("Delete Error:", err.response?.data);
      alert("❌ Failed to delete: " + (err.response?.data?.message || "Check console")); 
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

  return (
    <div className="min-h-screen bg-[#E6EEF2] pb-20">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {!selectedJob ? (
          /* --- LIST VIEW --- */
          <>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-slate-900">📋 Poster Dashboard</h1>
              <Link to="/poster/post-job" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium"><Plus size={20} />Post Job</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
              <StatCard icon={Briefcase} title="Total Jobs" value={dashboardStats.totalJobs} color="bg-blue-600" />
              <StatCard icon={CheckCircle} title="Active" value={postedJobs.filter(j => j.status === 'active').length} color="bg-emerald-600" />
              <StatCard icon={Users} title="Applicants" value={dashboardStats.totalApplicants} color="bg-purple-600" />
              <StatCard icon={DollarSign} title="Earnings" value={`$${dashboardStats.totalEarnings}`} color="bg-orange-600" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {postedJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all">
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{job.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 line-clamp-2">{job.description}</p>
                  <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-50">
                    <span className="text-emerald-600 font-bold">${job.hourlyRate}/hr</span>
                    <button 
                      onClick={() => setSelectedJob(job)}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                    >
                      <Eye size={16} /> View Job
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* --- ✅ DETAILED VIEW (SINGLE PAGE LOGIC) --- */
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button onClick={() => setSelectedJob(null)} className="flex items-center gap-2 text-slate-600 font-bold mb-6 hover:text-emerald-600">
              <ArrowLeft size={20} /> Back to Dashboard
            </button>

            <div className="bg-white rounded-[32px] shadow-xl border border-white overflow-hidden">
              {/* Header */}
              <div className="bg-slate-900 p-10 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="bg-emerald-500 text-xs font-black px-3 py-1 rounded-full uppercase mb-4 inline-block">Post ID: {selectedJob._id.slice(-6)}</span>
                    <h1 className="text-4xl font-black">{selectedJob.title}</h1>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-emerald-400">${selectedJob.hourlyRate}/hr</p>
                    <p className="text-slate-400 text-sm">Target Rate</p>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1 p-1 bg-slate-100 border-b border-slate-100">
                <div className="bg-white p-6 text-center">
                  <Tag size={20} className="mx-auto mb-2 text-blue-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Category</p>
                  <p className="font-bold text-slate-800">{selectedJob.category || 'N/A'}</p>
                </div>
                <div className="bg-white p-6 text-center">
                  <MapPin size={20} className="mx-auto mb-2 text-red-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Location</p>
                  <p className="font-bold text-slate-800">{selectedJob.location}</p>
                </div>
                <div className="bg-white p-6 text-center">
                  <Clock size={20} className="mx-auto mb-2 text-emerald-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Hours</p>
                  <p className="font-bold text-slate-800">{selectedJob.totalHours || 0} hrs</p>
                </div>
                <div className="bg-white p-6 text-center">
                  <Calendar size={20} className="mx-auto mb-2 text-purple-500" />
                  <p className="text-xs font-bold text-slate-400 uppercase">Deadline</p>
                  <p className="font-bold text-slate-800">{new Date(selectedJob.deadline).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-10">
                <h4 className="text-xl font-black text-slate-800 mb-4">Detailed Description</h4>
                <p className="text-slate-600 leading-relaxed text-lg mb-8">{selectedJob.description}</p>

                <h4 className="text-xl font-black text-slate-800 mb-4">Skills Required</h4>
                <div className="flex flex-wrap gap-2 mb-12">
                  {selectedJob.skills?.map((skill, i) => (
                    <span key={i} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm">#{skill}</span>
                  ))}
                </div>

                {/* --- ✅ CENTERED ACTION SECTION --- */}
                <div className="flex flex-col items-center gap-6 py-10 border-t border-slate-100 bg-slate-50/50 rounded-b-[32px]">
                   <div className="text-center">
                      <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-4">Poster Management Actions</p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Link 
                          to={`/poster/job/${selectedJob._id}/edit`}
                          className="flex items-center gap-2 px-10 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                        >
                          <Edit size={20} /> Edit Job
                        </Link>
                        <button 
                          onClick={() => deleteJob(selectedJob._id)}
                          className="flex items-center gap-2 px-10 py-4 bg-red-50 text-red-600 rounded-2xl font-black hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={20} /> Delete Post
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        ) }
      </div>
    </div>
  );
};

export default PosterDashboard;