import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X, Plus, Trash2, Briefcase, DollarSign, Clock, MapPin, Calendar } from 'lucide-react';
import API from '../services/api';

const EditJob = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [job, setJob] = useState({
    title: '',
    description: '',
    category: '',
    type: 'fixed',
    budget: '',
    deadline: '',
    location: '',
    requiredSkills: [],
    status: 'active'
  });
  const [skillInput, setSkillInput] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const response = await API.get(`/jobs/${jobId}`);
      const jobData = response.data;
      
      setJob({
        title: jobData.title || '',
        description: jobData.description || '',
        category: jobData.category || '',
        type: jobData.type || 'fixed',
        budget: jobData.budget || '',
        deadline: jobData.deadline ? new Date(jobData.deadline).toISOString().split('T')[0] : '',
        location: jobData.location || '',
        requiredSkills: jobData.requiredSkills || [],
        status: jobData.status || 'active'
      });
    } catch (error) {
      console.error('Error fetching job details:', error);
      alert('Failed to load job details. Please try again.');
      navigate('/poster/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJob(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !job.requiredSkills.includes(skillInput.trim())) {
      setJob(prev => ({
        ...prev,
        requiredSkills: [...prev.requiredSkills, skillInput.trim()]
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setJob(prev => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!job.title.trim()) newErrors.title = 'Job title is required';
    if (!job.description.trim()) newErrors.description = 'Job description is required';
    if (!job.category) newErrors.category = 'Category is required';
    if (!job.budget) newErrors.budget = 'Budget is required';
    if (!job.deadline) newErrors.deadline = 'Deadline is required';
    if (!job.location.trim()) newErrors.location = 'Location is required';
    if (job.requiredSkills.length === 0) newErrors.skills = 'At least one skill is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      
      const updatedJob = {
        ...job,
        deadline: new Date(job.deadline).toISOString()
      };

      await API.put(`/jobs/${jobId}`, updatedJob);
      
      alert('Job updated successfully!');
      navigate(`/poster/job/${jobId}`);
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate(`/poster/job/${jobId}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Job</h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={job.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Senior React Developer"
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  value={job.description}
                  onChange={handleInputChange}
                  rows={6}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Describe the job responsibilities, requirements, and what you're looking for..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={job.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.category ? 'border-red-300' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select a category</option>
                  <option value="Development & IT">Development & IT</option>
                  <option value="Design & Creative">Design & Creative</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Writing & Translation">Writing & Translation</option>
                  <option value="Finance & Accounting">Finance & Accounting</option>
                  <option value="Education & Training">Education & Training</option>
                  <option value="Healthcare">Healthcare</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="fixed"
                      checked={job.type === 'fixed'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Fixed Price</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="type"
                      value="hourly"
                      checked={job.type === 'hourly'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    <span className="text-sm">Hourly</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (₹) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    name="budget"
                    value={job.budget}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.budget ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="5000"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline *
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={job.deadline}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.deadline ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.deadline && (
                  <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    name="location"
                    value={job.location}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Mumbai, India"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                )}
              </div>

              </div>
          </div>

          {/* Required Skills */}
          <div className="mt-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Required Skills *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {job.requiredSkills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="ml-1 hover:text-primary-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className={`flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                  errors.skills ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Add a required skill"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600">{errors.skills}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate(`/poster/job/${jobId}`)}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
