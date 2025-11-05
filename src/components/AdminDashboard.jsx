import React, { useState, useEffect } from 'react';

// User Details Modal Component
const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <div className="space-y-4">
            {/* Basic Information */}
            <div className="border-b pb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Name:</strong> {user.name || 'N/A'}</div>
                <div><strong>Email:</strong> {user.email || 'N/A'}</div>
                <div><strong>Phone:</strong> {user.phone || 'N/A'}</div>
                <div><strong>Location:</strong> {user.location || 'N/A'}</div>
                <div><strong>Experience:</strong> {user.experience || 'N/A'}</div>
                <div><strong>Skills:</strong> {user.skills && user.skills.length > 0 ? user.skills.join(', ') : 'N/A'}</div>
              </div>
            </div>

            {/* Professional Information */}
            <div className="border-b pb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">Professional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>Degree:</strong> {user.degree || 'N/A'}</div>
                <div><strong>University:</strong> {user.university || 'N/A'}</div>
                <div><strong>Percentage:</strong> {user.percentage || 'N/A'}</div>
                <div><strong>Passout Year:</strong> {user.passout_year || 'N/A'}</div>
                <div><strong>Backlog:</strong> {user.backlog || 'N/A'}</div>
              </div>
            </div>

            {/* 12th Details */}
            <div className="border-b pb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">12th Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>School:</strong> {user.twelfth_school || 'N/A'}</div>
                <div><strong>Percentage:</strong> {user.twelfth_percentage || 'N/A'}</div>
                <div><strong>Passout Year:</strong> {user.twelfth_passout_year || 'N/A'}</div>
              </div>
            </div>

            {/* 10th Details */}
            <div className="border-b pb-4">
              <h4 className="text-md font-semibold text-gray-800 mb-2">10th Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><strong>School:</strong> {user.tenth_school || 'N/A'}</div>
                <div><strong>Percentage:</strong> {user.tenth_percentage || 'N/A'}</div>
                <div><strong>Passout Year:</strong> {user.tenth_passout_year || 'N/A'}</div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h4 className="text-md font-semibold text-gray-800 mb-2">Professional Details</h4>
              <div className="space-y-2">
                <div><strong>Internship:</strong> {user.internship || 'N/A'}</div>
                <div><strong>Experience Details:</strong> {user.experience_details || 'N/A'}</div>
                <div><strong>Project Description:</strong> {user.project_description || 'N/A'}</div>
                <div><strong>Project Link:</strong> {user.project_link ? <a href={user.project_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{user.project_link}</a> : 'N/A'}</div>
                <div><strong>LinkedIn:</strong> {user.linkedin_link ? <a href={user.linkedin_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{user.linkedin_link}</a> : 'N/A'}</div>
                <div><strong>GitHub:</strong> {user.github_link ? <a href={user.github_link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">{user.github_link}</a> : 'N/A'}</div>
                <div><strong>Resume:</strong> {user.resume_path ? <a href={user.resume_path} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">View Resume</a> : 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', description: '', requirements: '', benefits: '' });
  const [notifications, setNotifications] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/check', {
          credentials: 'include'
        });
        if (response.ok) {
          const userData = await response.json();
          return userData.id;
        } else {
          console.error('Failed to fetch user');
          return null;
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        return null;
      }
    };

    const fetchJobs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/jobs', {
          credentials: 'include'
        });
        if (response.ok) {
          const jobsData = await response.json();
          setJobs(jobsData);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    const fetchNotifications = async (adminId) => {
      if (!adminId) return;
      try {
        const response = await fetch(`http://localhost:5000/api/admin/${adminId}/notifications`, {
          credentials: 'include'
        });
        if (response.ok) {
          const notificationsData = await response.json();
          setNotifications(notificationsData);
        } else {
          console.error('Failed to fetch notifications');
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    const initializeData = async () => {
      const adminId = await fetchUser();
      fetchJobs();
      fetchNotifications(adminId);
    };

    initializeData();
  }, []);

  const handleAddJob = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(newJob),
      });

      if (response.ok) {
        // Fetch jobs again to update the list with the new job
        const fetchJobsResponse = await fetch('http://localhost:5000/api/admin/jobs', {
          credentials: 'include'
        });
        if (fetchJobsResponse.ok) {
          const jobsData = await fetchJobsResponse.json();
          setJobs(jobsData);
        }
        setNewJob({ title: '', company: '', location: '', salary: '', description: '', requirements: '', benefits: '' });
        alert('Job added successfully!');
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.msg || 'Unknown error';
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = response.statusText || 'Network error';
        }

        if (response.status === 401) {
          alert('Authentication required. Please log in as admin to add jobs.');
        } else if (response.status === 403) {
          alert('Admin access required. Please log in with admin credentials.');
        } else {
          alert(`Failed to add job: ${errorMessage}`);
        }
      }
    } catch (error) {
      alert('Error adding job: Network error');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        // Remove the job from the local state
        setJobs(jobs.filter(job => job.id !== id));
        alert('Job deleted successfully!');
      } else {
        let errorMessage = 'Unknown error';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.msg || 'Unknown error';
        } catch (e) {
          errorMessage = response.statusText || 'Network error';
        }
        alert(`Failed to delete job: ${errorMessage}`);
      }
    } catch (error) {
      alert('Error deleting job: Network error');
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        credentials: 'include'
      });
      if (response.ok) {
        // Update the notifications state to mark as read
        setNotifications(prev => prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        ));
      } else {
        console.error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleViewUserDetails = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        credentials: 'include'
      });
      if (response.ok) {
        const userDetails = await response.json();
        setSelectedUser(userDetails);
        // Modal functionality removed
      } else {
        console.error('Failed to fetch user details');
        alert('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details');
    }
  };

  const handleCloseModal = () => {
    // Modal functionality removed
    setSelectedUser(null);
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/notifications/${notificationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        // Remove the notification from the local state
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
        alert('Notification deleted successfully!');
      } else {
        console.error('Failed to delete notification');
        alert('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Error deleting notification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add New Job</h2>
            <form onSubmit={handleAddJob} className="bg-white shadow rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700">Job Title</label>
                  <input
                    type="text"
                    id="title"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    id="company"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={newJob.location}
                    onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="salary" className="block text-sm font-medium text-gray-700">Salary</label>
                  <input
                    type="text"
                    id="salary"
                    value={newJob.salary}
                    onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  id="description"
                  rows="4"
                  value={newJob.description}
                  onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  required
                ></textarea>
              </div>
              <div className="mt-6">
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">Requirements</label>
                <textarea
                  id="requirements"
                  rows="4"
                  value={newJob.requirements}
                  onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="mt-6">
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-700">Benefits</label>
                <textarea
                  id="benefits"
                  rows="4"
                  value={newJob.benefits}
                  onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                ></textarea>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Job
                </button>
              </div>
            </form>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Notifications</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {notifications.length === 0 ? (
                <p className="p-6 text-gray-500">No new notifications</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {notifications.map(notification => (
                    <li key={notification.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </p>
                          {notification.is_read ? (
                            <p className="text-xs text-green-600">Read</p>
                          ) : (
                            <p className="text-xs text-red-600">Unread</p>
                          )}
                          <button
                            onClick={() => handleViewUserDetails(notification.applicant_id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            View User Details
                          </button>
                        </div>
                        {!notification.is_read && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotification(notification.id)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ml-2"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Manage Jobs</h2>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {jobs.map(job => (
                  <li key={job.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company} - {job.location}</p>
                        <p className="text-sm text-gray-500">Salary: {job.salary}</p>
                        <p className="text-sm text-gray-500">Applicants: {job.applicants}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />
    </div>
  );
};

export default AdminDashboard;
