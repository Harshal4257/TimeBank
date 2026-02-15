import React, { useEffect, useState } from 'react';
import API from '../services/api';

const Marketplace = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await API.get('/tasks');
        setTasks(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  if (loading) return <div className="p-10 text-center font-medium">Finding available tasks...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Skill Marketplace</h1>
        <p className="text-slate-500 mb-10 text-lg">Help others to earn Time Credits.</p>

        {tasks.length === 0 ? (
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-slate-100">
            <p className="text-slate-400 text-xl">No tasks available right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tasks.map((task) => (
              <div key={task._id} className="bg-white rounded-3xl p-6 shadow-md border border-slate-100 hover:shadow-xl transition-shadow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {task.category}
                    </span>
                    <div className="text-emerald-600 font-black text-xl">
                      {task.hours} Hrs
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{task.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{task.description}</p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Posted by <span className="font-semibold text-slate-600">{task.poster?.name || "User"}</span>
                  </div>
                  <button className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-emerald-600 transition-colors">
                    Volunteer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;