import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [newJob, setNewJob] = useState({ title: '', company: '', location: '', salary: '', description: '', requirements: '', benefits: '' });
  const [notifications, setNotifications] = useState([]);

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
        alert(`User Details:\nName: ${userDetails.name}\nEmail: ${userDetails.email}\nPhone: ${userDetails.phone}\nLocation: ${userDetails.location}\nExperience: ${userDetails.experience}\nSkills: ${userDetails.skills ? userDetails.skills.join(', ') : 'None'}`);
      } else {
        console.error('Failed to fetch user details');
        alert('Failed to fetch user details');
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      alert('Error fetching user details');
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
    </div>
  );
};

export default AdminDashboard;
