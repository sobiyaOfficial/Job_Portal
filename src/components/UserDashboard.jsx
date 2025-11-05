import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const navigate = useNavigate();

  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: [],
    // Professional Information
    degree: '',
    university: '',
    percentage: '',
    passout_year: '',
    backlog: '',
    // 12th Details
    twelfth_school: '',
    twelfth_percentage: '',
    twelfth_passout_year: '',
    // 10th Details
    tenth_school: '',
    tenth_percentage: '',
    tenth_passout_year: '',
    // Professional Details
    internship: '',
    experience_details: '',
    project_description: '',
    project_link: '',
    linkedin_link: '',
    github_link: '',
    resume_path: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    experience: '',
    skills: [],
    // Professional Information
    degree: '',
    university: '',
    percentage: '',
    passout_year: '',
    backlog: '',
    // 12th Details
    twelfth_school: '',
    twelfth_percentage: '',
    twelfth_passout_year: '',
    // 10th Details
    tenth_school: '',
    tenth_percentage: '',
    tenth_passout_year: '',
    // Professional Details
    internship: '',
    experience_details: '',
    project_description: '',
    project_link: '',
    linkedin_link: '',
    github_link: '',
    resume_path: ''
  });
  const [activeTab, setActiveTab] = useState('personal');
  const [user, setUser] = useState(null);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setUser(null);
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/check', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error('Error checking login:', error);
      }
    };
    checkLogin();
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      if (user) {
        const response = await fetch('http://localhost:5000/api/profile', {
          credentials: 'include'
        });
        if (response.ok) {
          const profileData = await response.json();
          setUserProfile(profileData);
          setEditForm(profileData);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  }, [user]);

  useEffect(() => {
    const controller = new AbortController();

    // Clear all state and fetch data when token changes
    const clearState = () => {
      setUserProfile({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: [],
        // Professional Information
        degree: '',
        university: '',
        percentage: '',
        passout_year: '',
        backlog: '',
        // 12th Details
        twelfth_school: '',
        twelfth_percentage: '',
        twelfth_passout_year: '',
        // 10th Details
        tenth_school: '',
        tenth_percentage: '',
        tenth_passout_year: '',
        // Professional Details
        internship: '',
        experience_details: '',
        project_description: '',
        project_link: '',
        linkedin_link: '',
        github_link: '',
        resume_path: ''
      });
      setAppliedJobs([]);
      setSavedJobs([]);
      setEditForm({
        name: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        skills: [],
        // Professional Information
        degree: '',
        university: '',
        percentage: '',
        passout_year: '',
        backlog: '',
        // 12th Details
        twelfth_school: '',
        twelfth_percentage: '',
        twelfth_passout_year: '',
        // 10th Details
        tenth_school: '',
        tenth_percentage: '',
        tenth_passout_year: '',
        // Professional Details
        internship: '',
        experience_details: '',
        project_description: '',
        project_link: '',
        linkedin_link: '',
        github_link: '',
        resume_path: ''
      });
      setIsEditing(false);
    };

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/jobs', { signal: controller.signal });
        if (response.ok) {
          const jobsData = await response.json();
          setAvailableJobs(jobsData);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching jobs:', error);
        }
      }
    };

    const fetchAppliedJobs = async () => {
      try {
        if (user) {
          const response = await fetch('http://localhost:5000/api/applications', {
            credentials: 'include',
            signal: controller.signal
          });
          if (response.ok) {
            const applicationsData = await response.json();
            setAppliedJobs(applicationsData);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching applied jobs:', error);
        }
      }
    };

    const fetchSavedJobs = async () => {
      try {
        if (user) {
          const response = await fetch('http://localhost:5000/api/saved-jobs', {
            credentials: 'include',
            signal: controller.signal
          });
          if (response.ok) {
            const savedJobsData = await response.json();
            setSavedJobs(savedJobsData);
          }
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Error fetching saved jobs:', error);
        }
      }
    };

    clearState();
    fetchJobs();
    if (user) {
      fetchAppliedJobs();
      fetchSavedJobs();
      fetchUserProfile();
    }

    return () => {
      controller.abort();
    };
  }, [user, fetchUserProfile]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <nav className="flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('personal')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'personal'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Personal Details
              </button>
              <button
                onClick={() => setActiveTab('applied')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'applied'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Applied Jobs
              </button>
              <button
                onClick={() => setActiveTab('saved')}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'saved'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Saved Jobs
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'personal' && (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                >
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>

              {isEditing ? (
                <div className="bg-white shadow rounded-lg p-6">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const response = await fetch('http://localhost:5000/api/profile', {
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        credentials: 'include',
                        body: JSON.stringify(editForm),
                      });

                      if (response.ok) {
                        setUserProfile(editForm);
                        setIsEditing(false);
                        alert('Profile updated successfully!');
                        // Refresh the profile data after update
                        fetchUserProfile();
                      } else {
                        let errorMessage = 'Unknown error';
                        try {
                          const errorData = await response.json();
                          errorMessage = errorData.message || errorData.msg || 'Unknown error';
                        } catch (e) {
                          if (response.status === 401) {
                            errorMessage = 'Authentication required. Please log in again.';
                          } else if (response.status === 403) {
                            errorMessage = 'Access denied.';
                          } else {
                            errorMessage = response.statusText || 'Unknown error';
                          }
                        }
                        alert(`Failed to update profile: ${errorMessage}`);
                      }
                    } catch (error) {
                      alert('Error updating profile: Network error');
                    }
                  }}>
                    <div className="space-y-8">
                      {/* Personal Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                              type="text"
                              value={editForm.name}
                              onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Phone</label>
                            <input
                              type="tel"
                              value={editForm.phone}
                              onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Location</label>
                            <input
                              type="text"
                              value={editForm.location}
                              onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Educational Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Degree</label>
                            <input
                              type="text"
                              value={editForm.degree}
                              onChange={(e) => setEditForm({...editForm, degree: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., B.Tech"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">University</label>
                            <input
                              type="text"
                              value={editForm.university}
                              onChange={(e) => setEditForm({...editForm, university: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Percentage</label>
                            <input
                              type="text"
                              value={editForm.percentage}
                              onChange={(e) => setEditForm({...editForm, percentage: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., 85%"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Passout Year</label>
                            <input
                              type="number"
                              value={editForm.passout_year}
                              onChange={(e) => setEditForm({...editForm, passout_year: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., 2023"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Backlog</label>
                            <input
                              type="text"
                              value={editForm.backlog}
                              onChange={(e) => setEditForm({...editForm, backlog: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., 0"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 12th Details */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">12th Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">School</label>
                            <input
                              type="text"
                              value={editForm.twelfth_school}
                              onChange={(e) => setEditForm({...editForm, twelfth_school: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Percentage</label>
                            <input
                              type="text"
                              value={editForm.twelfth_percentage}
                              onChange={(e) => setEditForm({...editForm, twelfth_percentage: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Passout Year</label>
                            <input
                              type="number"
                              value={editForm.twelfth_passout_year}
                              onChange={(e) => setEditForm({...editForm, twelfth_passout_year: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 10th Details */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">10th Details</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">School</label>
                            <input
                              type="text"
                              value={editForm.tenth_school}
                              onChange={(e) => setEditForm({...editForm, tenth_school: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Percentage</label>
                            <input
                              type="text"
                              value={editForm.tenth_percentage}
                              onChange={(e) => setEditForm({...editForm, tenth_percentage: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Passout Year</label>
                            <input
                              type="number"
                              value={editForm.tenth_passout_year}
                              onChange={(e) => setEditForm({...editForm, tenth_passout_year: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Professional Details */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Details</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Experience</label>
                            <input
                              type="text"
                              value={editForm.experience}
                              onChange={(e) => setEditForm({...editForm, experience: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., 3 years"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                            <input
                              type="text"
                              value={editForm.skills.join(', ')}
                              onChange={(e) => setEditForm({...editForm, skills: e.target.value.split(',').map(s => s.trim())})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., JavaScript, React, Node.js"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Internship</label>
                            <input
                              type="text"
                              value={editForm.internship}
                              onChange={(e) => setEditForm({...editForm, internship: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="e.g., Software Engineer Intern at XYZ"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Experience Details</label>
                            <textarea
                              value={editForm.experience_details}
                              onChange={(e) => setEditForm({...editForm, experience_details: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              rows="3"
                              placeholder="Describe your work experience"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Project Description</label>
                            <textarea
                              value={editForm.project_description}
                              onChange={(e) => setEditForm({...editForm, project_description: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              rows="3"
                              placeholder="Describe your projects"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Project Link</label>
                            <input
                              type="url"
                              value={editForm.project_link}
                              onChange={(e) => setEditForm({...editForm, project_link: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://github.com/username/project"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">LinkedIn Link</label>
                            <input
                              type="url"
                              value={editForm.linkedin_link}
                              onChange={(e) => setEditForm({...editForm, linkedin_link: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://linkedin.com/in/username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">GitHub Link</label>
                            <input
                              type="url"
                              value={editForm.github_link}
                              onChange={(e) => setEditForm({...editForm, github_link: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="https://github.com/username"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Resume Path</label>
                            <input
                              type="text"
                              value={editForm.resume_path}
                              onChange={(e) => setEditForm({...editForm, resume_path: e.target.value})}
                              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="/path/to/resume.pdf"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({ ...userProfile });
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white shadow rounded-lg p-6">
                  {userProfile.name || userProfile.email ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Personal Information</h3>
                        <p className="text-sm text-gray-600"><strong>Name:</strong> {userProfile.name || 'Not provided'}</p>
                        <p className="text-sm text-gray-600"><strong>Email:</strong> {userProfile.email || 'Not provided'}</p>
                        <p className="text-sm text-gray-600"><strong>Phone:</strong> {userProfile.phone || 'Not provided'}</p>
                        <p className="text-sm text-gray-600"><strong>Location:</strong> {userProfile.location || 'Not provided'}</p>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Professional Information</h3>
                        <p className="text-sm text-gray-600"><strong>Experience:</strong> {userProfile.experience || 'Not provided'}</p>
                        <p className="text-sm text-gray-600"><strong>Skills:</strong> {userProfile.skills.length > 0 ? userProfile.skills.join(', ') : 'Not provided'}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">No profile information provided yet.</p>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                      >
                        Add Profile Information
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'applied' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Applied Jobs</h2>
              {appliedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {appliedJobs.map(job => (
                    <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                        <p className="text-sm text-gray-500">{job.salary}</p>
                        <p className="text-sm text-gray-500">Status: {job.status}</p>
                        <Link
                          to={`/job/${job.job_id || job.id}`}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No applied jobs yet.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Saved Jobs</h2>
              {savedJobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedJobs.map(job => (
                    <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900">{job.job_title}</h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                        <Link
                          to={`/job/${job.job_id}`}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No saved jobs yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Available Jobs - Always visible at bottom */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Jobs for You</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableJobs.map(job => (
                <div key={job.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.company}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                    <p className="text-sm text-gray-500">{job.salary}</p>
                    <Link
                      to={`/job/${job.id}`}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
