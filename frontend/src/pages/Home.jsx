import React from 'react';
import { Search, Users, Laptop, Clock, Star, ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-50 via-white to-primary-50">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <div className="lg:w-1/2 space-y-8 animate-fade-in">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4" />
                New: AI-Powered Job Matching
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-secondary-900 leading-tight">
                Got Talent? <br />
                <span className="text-gradient">Meet Opportunity</span>
              </h1>
              <p className="text-lg sm:text-xl text-secondary-600 max-w-lg">
                Connect with your community, share your skills, and earn time credits. The future of collaborative work is here.
              </p>
            </div>
            
            {/* Enhanced Search Bar */}
            <div className="bg-white p-2 rounded-2xl shadow-strong border border-secondary-100 flex items-center gap-2 max-w-2xl hover:shadow-glow transition-all duration-300">
              <div className="flex items-center gap-3 pl-4">
                <Search className="text-secondary-400 w-5 h-5" />
                <div className="h-8 w-px bg-secondary-200"></div>
              </div>
              <input 
                type="text" 
                placeholder="Search for jobs, skills, or people..." 
                className="flex-1 p-3 outline-none text-secondary-700 placeholder-secondary-400"
              />
              <button className="gradient-primary text-white px-6 sm:px-8 py-3 rounded-xl font-bold hover:shadow-glow transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
                Search
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-6 text-sm text-secondary-600">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-primary-500" />
                <span>5k+ Active Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-accent-500" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-500" />
                <span>Verified Community</span>
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 relative flex justify-center items-center animate-slide-up">
            <div className="relative">
              <img 
                src="https://illustrations.popsy.co/emerald/web-design.svg" 
                alt="Hero" 
                className="w-full max-w-lg animate-float"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { number: '5,000+', label: 'Active Members', icon: Users },
              { number: '10,000+', label: 'Tasks Completed', icon: Clock },
              { number: '50,000+', label: 'Hours Exchanged', icon: TrendingUp },
              { number: '99%', label: 'Satisfaction Rate', icon: Star },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl hover:bg-primary-50 transition-all duration-300 group">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-200 transition-colors">
                  <stat.icon className="w-6 h-6 text-primary-600" />
                </div>
                <div className="text-3xl font-black text-secondary-900 mb-1">{stat.number}</div>
                <div className="text-sm text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">Popular Categories</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Find the perfect opportunity across our most sought-after skill categories
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Development & IT', jobs: '16+', icon: Laptop, color: 'blue' },
              { name: 'Marketing & Sales', jobs: '12+', icon: TrendingUp, color: 'green' },
              { name: 'Design & Creative', jobs: '8+', icon: Star, color: 'purple' },
              { name: 'Customer Service', jobs: '10+', icon: Users, color: 'orange' },
            ].map((category, index) => (
              <div 
                key={category.name} 
                className="card group cursor-pointer hover:scale-105"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className={`bg-${category.color}-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:bg-${category.color}-500 group-hover:text-white transition-all duration-300`}>
                  <category.icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-secondary-800 mb-2">{category.name}</h3>
                <p className="text-secondary-500 text-sm">{category.jobs} jobs available</p>
                <div className="mt-4 text-primary-600 font-medium text-sm flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="gradient-primary rounded-3xl p-8 lg:p-12 text-center text-white shadow-glow">
            <h2 className="text-3xl lg:text-4xl font-black mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-8 opacity-90">Join thousands of community members sharing skills and building connections.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold hover:bg-secondary-50 transition-all duration-300 transform hover:scale-105 shadow-medium">
                Join as Seeker
              </button>
              <button className="bg-secondary-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-secondary-900 transition-all duration-300 transform hover:scale-105 shadow-medium">
                Post a Task
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;