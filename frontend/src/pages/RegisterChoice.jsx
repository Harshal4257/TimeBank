import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Users } from 'lucide-react';

const RegisterChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-3xl font-bold mb-10">How would you like to use TimeBank?</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
        
        {/* Job Seeker Card */}
        <div 
          onClick={() => navigate('/register?role=Seeker')}
          className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-600 hover:shadow-xl transition-all cursor-pointer group text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Users size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">I'm a Job Seeker</h2>
          <p className="text-gray-500">I want to showcase my skills and earn time credits by helping others.</p>
        </div>

        {/* Job Poster Card */}
        <div 
          onClick={() => navigate('/register?role=Poster')}
          className="bg-white p-8 rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-600 hover:shadow-xl transition-all cursor-pointer group text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Briefcase size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">I'm a Job Poster</h2>
          <p className="text-gray-500">I have tasks that need doing and want to find community talent.</p>
        </div>

      </div>
    </div>
  );
};

export default RegisterChoice;