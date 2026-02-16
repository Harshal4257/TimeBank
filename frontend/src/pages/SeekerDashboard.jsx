import React, { useState } from 'react';
import {
  Bell, User, ChevronDown, FileText, Star,
  Settings, HelpCircle, Shield, Search,
  Bookmark, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SeekerDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  // Get user data
  const userEmail = localStorage.getItem('userEmail') || 'sayalitarle1405@gmail.com';
  const userSkills = localStorage.getItem('userSkills') || 'python,react';
  const userName = localStorage.getItem('userName') || 'Tejal';

  // Convert user skills into array
  const skillArray = userSkills.toLowerCase().split(',').map(skill => skill.trim());

  // Sample jobs
  const availableJobs = [
    { id: 1, title: "Python Automation Task", company: "TechFlow", location: "Remote", salary: "2 Credits/hr", posted: "Just posted", skills: ["python"] },
    { id: 2, title: "Django Backend Fix", company: "CodeBase", location: "Mumbai", salary: "3 Credits/hr", posted: "2 days ago", skills: ["python", "django"] },
    { id: 3, title: "React UI Improvement", company: "DesignHub", location: "Remote", salary: "2 Credits/hr", posted: "1 day ago", skills: ["react"] }
  ];

  // Improved Matching Logic
  const matchedJobs = availableJobs.filter(job =>
    job.skills.some(skill => skillArray.includes(skill.toLowerCase()))
  );

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* --- SEEKER HEADER --- */}
      <nav className="bg-white border-b border-gray-200 px-6 py-3 flex justify-between items-center shadow-sm">
        <h1 
          onClick={() => navigate('/dashboard')}
          className="text-2xl font-bold text-emerald-600 cursor-pointer"
        >
          TimeBank
        </h1>

        <div className="flex items-center gap-6 relative">

          <span onClick={() => navigate('/dashboard')} className="cursor-pointer font-medium text-gray-700 hover:text-emerald-600">
            Find Jobs
          </span>

          <span className="cursor-pointer font-medium text-gray-700 hover:text-emerald-600">
            My Applications
          </span>

          <MessageSquare size={20} className="text-gray-600 cursor-pointer" />
          <Bell size={20} className="text-gray-600 cursor-pointer" />

          {/* Profile */}
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-1"
          >
            <User size={26} className="text-gray-600" />
            <ChevronDown size={14} />
          </button>

          {showProfile && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-xl shadow-xl border py-2 z-50">
              <div className="px-5 py-4 border-b">
                <p className="text-sm font-bold truncate">{userEmail}</p>
              </div>

              <div className="text-gray-700">
                <button onClick={() => navigate('/profile')} className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                  <FileText size={18} /> Profile
                </button>

                <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                  <Star size={18} /> My Reviews
                </button>

                <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                  <Settings size={18} /> Settings
                </button>

                <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                  <HelpCircle size={18} /> Help
                </button>

                <button className="w-full flex items-center gap-3 px-5 py-3 hover:bg-gray-50 text-sm">
                  <Shield size={18} /> Privacy Centre
                </button>
              </div>

              <div className="border-t mt-2 pt-2">
                <button
                  onClick={handleLogout}
                  className="w-full text-center text-emerald-600 font-bold py-2 hover:underline"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-5xl mx-auto mt-10 px-4">

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-1">Recommended for you</h2>
          <p className="text-gray-600 text-sm">
            Based on your skills:
            <span className="ml-2 font-semibold text-emerald-600">
              {userSkills}
            </span>
          </p>
        </div>

        {matchedJobs.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {matchedJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl shadow hover:shadow-md transition cursor-pointer">

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold mb-1 hover:underline">
                      {job.title}
                    </h3>
                    <p className="text-gray-700 font-medium">{job.company}</p>
                    <p className="text-gray-500 text-sm">{job.location}</p>

                    <div className="mt-3 flex gap-2 flex-wrap">
                      {job.skills.map((skill, index) => (
                        <span key={index} className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Bookmark size={20} className="text-gray-400" />
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  {job.posted} •
                  <button className="ml-2 text-emerald-600 font-semibold hover:underline">
                    Apply now
                  </button>
                </div>

              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="text-center bg-white p-12 rounded-3xl shadow border border-dashed">
              <Search size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800">
                No matching jobs found
              </h3>
              <p className="text-gray-500 mt-2">
                Update your skills in profile to see better matches.
              </p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default SeekerDashboard;
