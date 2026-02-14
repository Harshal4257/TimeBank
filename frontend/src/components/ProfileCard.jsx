import React from 'react';
import { Star, MapPin } from 'lucide-react';

const ProfileCard = ({ user }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 max-w-sm">
      <div className="flex flex-col items-center">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" 
             className="w-24 h-24 rounded-full bg-slate-100 mb-4" />
        <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
        <p className="text-emerald-600 font-medium mb-2">{user.role}</p>
        
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
          <MapPin size={14} /> <span>Mumbai, India</span>
        </div>

        <div className="flex gap-2 mb-6">
          {user.skills.map(skill => (
            <span key={skill} className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
              {skill}
            </span>
          ))}
        </div>

        <div className="w-full border-t border-slate-50 pt-4 flex justify-between">
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase">Rating</p>
            <div className="flex items-center text-yellow-500 font-bold"><Star size={14} fill="currentColor" /> 4.8</div>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 uppercase">Credits</p>
            <p className="font-bold text-slate-800">12h</p>
          </div>
        </div>
      </div>
    </div>
  );
};