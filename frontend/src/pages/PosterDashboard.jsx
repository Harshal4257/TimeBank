import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  DollarSign, 
  Clock, 
  Search, 
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  CheckCircle,
  XCircle,
  TrendingUp,
  Bell,
  MessageSquare,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
  User
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
      
      // Fetch dashboard stats
      const statsResponse = await API.get('/api/poster/dashboard/stats');
      setDashboardStats(statsResponse.data);
      
      // Fetch posted jobs
      const jobsResponse = await API.get('/api/poster/jobs');
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
      fetchDashboardData(); // Refresh data
    } catch (err) {
      console.error(`Error ${action} job:`, err);
      alert(`Failed to ${action} job. Please try again.`);
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
      {/* Job Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 mb-2">{job.title}</h3>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <DollarSign size={16} />
              <span>{job.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{new Date(job.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            job.status === 'active' 
              ? 'bg-emerald-100 text-emerald-700' 
              : 'bg-slate-100 text-slate-700'
          }`}>
            {job.status === 'active' ? 'Active' : 'Closed'}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {job.applicantsCount} applicants
          </span>
        </div>
      </div>

      {/* Skills Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Link
          to={`/poster/job/${job._id}`}
          className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
        >
          <Eye size={16} />
          View Details
        </Link>
        <Link
          to={`/poster/job/${job._id}/edit`}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Edit size={16} />
          Edit
        </Link>
        {job.status === 'active' ? (
          <button
            onClick={() => handleJobAction(job._id, 'close')}
            className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
          >
            <XCircle size={16} />
            Close
          </button>
        ) : (
          <button
            onClick={() => handleJobAction(job._id, 'reopen')}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
          >
            <CheckCircle size={16} />
            Reopen
          </button>
        )}
        <button
          onClick={() => handleJobAction(job._id, 'delete')}
          className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#E6EEF2]">
      {/* Poster Navbar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="text-2xl font-black tracking-tight">
              <span className="text-slate-900">Time</span>
              <span className="text-emerald-600">Bank</span>
            </div>
            <span className="text-sm text-slate-500 font-medium">Poster</span>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link to="/poster/dashboard" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
              <BarChart3 size={18} />
              Dashboard
            </Link>
            <Link to="/poster/jobs" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
              <Briefcase size={18} />
              My Jobs
            </Link>
            <Link to="/poster/applicants" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
              <Users size={18} />
              Applicants
            </Link>
            <Link to="/poster/messages" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
              <MessageSquare size={18} />
              Messages
            </Link>
            <Link to="/poster/payments" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
              <CreditCard size={18} />
              Payments
            </Link>
            <Link to="/poster/reports" className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 font-medium">
              <BarChart3 size={18} />
              Reports
            </Link>
            
            <div className="h-8 w-[1px] bg-slate-200"></div>
            
            {/* Notifications */}
            <button className="relative text-slate-400 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-2 text-slate-600 hover:text-slate-800">
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <Link to="/poster/profile" className="block px-4 py-2 text-slate-700 hover:bg-slate-50">
                  Profile Settings
                </Link>
                <button className="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50">
                  <LogOut size={16} className="inline mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              📋 Poster Dashboard
            </h1>
            <p className="text-slate-600">
              Manage your jobs and track your hiring progress
            </p>
          </div>
          <Link
            to="/poster/post-job"
            className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium shadow-lg"
          >
            <Plus size={20} />
            Post New Job
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Briefcase}
            title="Total Jobs Posted"
            value={dashboardStats.totalJobs}
            color="bg-blue-600"
            trend="+12% this month"
          />
          <StatCard
            icon={CheckCircle}
            title="Active Jobs"
            value={dashboardStats.activeJobs}
            color="bg-emerald-600"
            trend="+8% this week"
          />
          <StatCard
            icon={Users}
            title="Total Applicants"
            value={dashboardStats.totalApplicants}
            color="bg-purple-600"
            trend="+25% this month"
          />
          <StatCard
            icon={DollarSign}
            title="Total Earnings"
            value={`$${dashboardStats.totalEarnings}`}
            color="bg-orange-600"
            trend="+18% this month"
          />
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-4">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-64"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-slate-600">Loading dashboard...</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))
            ) : (
              <div className="col-span-full bg-white border border-slate-200 rounded-xl p-12 text-center">
                <Briefcase size={64} className="text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-6">
                  {searchTerm || filterStatus !== 'all' 
                    ? 'Try adjusting your search or filters'
                    : 'Start by posting your first job'
                  }
                </p>
                {!searchTerm && filterStatus === 'all' && (
                  <Link
                    to="/poster/post-job"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
                  >
                    <Plus size={20} />
                    Post Your First Job
                  </Link>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Summary */}
        {!loading && filteredJobs.length > 0 && (
          <div className="mt-8 text-center text-slate-600">
            <p>Showing {filteredJobs.length} of {postedJobs.length} jobs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosterDashboard;
