import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  Search, 
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  TrendingUp
} from 'lucide-react';
import API from '../services/api';

const PosterDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    totalHours: 0,
    totalEarnings: 0
  });
  const [postedJobs, setPostedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // 1. If you don't have a stats controller yet, comment this next line out!
      // const statsResponse = await API.get('/jobs/stats'); 
      
      // 2. Change this to match your router
      const jobsResponse = await API.get('/jobs/my-jobs'); 
      setPostedJobs(jobsResponse.data);
  
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleJobAction = async (jobId, action) => {
    try {
      switch (action) {
        case 'close':
          await API.patch(`/api/jobs/${jobId}/close`);
          break;
        case 'delete':
          await API.delete(`/api/jobs/${jobId}`);
          break;
        default:
          break;
      }
      fetchDashboardData();
    } catch (err) {
      console.error(`Error ${action} job:`, err);
      alert(`Failed to ${action} job.`);
    }
  };

  const filteredJobs = postedJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const StatCard = ({ icon: Icon, title, value, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={14} className="text-emerald-600" />
              <span className="text-xs text-emerald-600">{trend}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all hover:border-emerald-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1"><DollarSign size={16} /><span>{job.hourlyRate}/hr</span></div>
            <div className="flex items-center gap-1"><MapPin size={16} /><span>{job.location}</span></div>
            <div className="flex items-center gap-1"><Calendar size={16} /><span>{new Date(job.createdAt).toLocaleDateString()}</span></div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>{job.status === 'active' ? 'Active' : 'Closed'}</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">{job.applicantsCount} applicants</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (<span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{skill}</span>))}
      </div>
      <div className="flex gap-2">
        <Link to={`/poster/job/${job._id}`} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium"><Eye size={16} />View</Link>
        <button onClick={() => handleJobAction(job._id, 'delete')} className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"><Trash2 size={16} />Delete</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      {/* NO NAVBAR HERE - IT IS HANDLED BY APP.JS */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">📋 Poster Dashboard</h1>
            <p className="text-slate-600">Manage your jobs and track your hiring progress</p>
          </div>
          <Link to="/poster/post-job" className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium shadow-lg"><Plus size={20} />Post New Job</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={Briefcase} title="Total Jobs Posted" value={dashboardStats.totalJobs} color="bg-blue-600" trend="+12% this month" />
          <StatCard icon={CheckCircle} title="Active Jobs" value={dashboardStats.activeJobs} color="bg-emerald-600" trend="+8% this week" />
          <StatCard icon={Users} title="Total Applicants" value={dashboardStats.totalApplicants} color="bg-purple-600" trend="+25% this month" />
          <StatCard icon={DollarSign} title="Total Earnings" value={`$${dashboardStats.totalEarnings}`} color="bg-orange-600" trend="+18% this month" />
        </div>

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? filteredJobs.map((job) => <JobCard key={job._id} job={job} />) : (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center">
                <Briefcase size={64} className="text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
                <Link to="/poster/post-job" className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium"><Plus size={20} />Post Your First Job</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterDashboard;