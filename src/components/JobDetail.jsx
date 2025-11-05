import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // Check if user is logged in
        const checkLogin = async () => {
          try {
            const response = await fetch('http://localhost:5000/api/auth/check', {
              credentials: 'include'
            });
            if (response.ok) {
              const userData = await response.json();
              setCurrentUser(userData);
            }
          } catch (error) {
            console.error('Error checking login:', error);
          }
        };

        await checkLogin();

        // Fetch job data from backend API
        const response = await fetch(`http://localhost:5000/api/jobs/${id}`);
        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);
        } else {
          console.error('Failed to fetch job details');
        }
      } catch (error) {
        console.error('Error fetching job:', error);
      }
    };

    fetchJob();
  }, [id]);

  const handleApply = async () => {
    if (!currentUser) {
      alert('Please login and then apply for job');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${job.id}/apply`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Application submitted successfully!');
        // Refresh the page to update the job details
        window.location.reload();
      } else {
        let errorMessage = 'Application failed';
        try {
          errorMessage = data.message || data.msg || 'Application failed';
        } catch (e) {
          if (response.status === 401) {
            errorMessage = 'Authentication required. Please log in again.';
          } else if (response.status === 403) {
            errorMessage = 'Access denied.';
          } else {
            errorMessage = response.statusText || 'Application failed';
          }
        }
        alert(errorMessage);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!currentUser) {
      alert('Please log in to save jobs.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/jobs/${job.id}/save`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        alert('Job saved successfully!');
        // Refresh the page to update the job details
        window.location.reload();
      } else {
        let errorMessage = 'Save failed';
        try {
          errorMessage = data.message || data.msg || 'Save failed';
        } catch (e) {
          if (response.status === 401) {
            errorMessage = 'Authentication required. Please log in again.';
          } else if (response.status === 403) {
            errorMessage = 'Access denied.';
          } else {
            errorMessage = response.statusText || 'Save failed';
          }
        }
        alert(errorMessage);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  if (!job) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">{job.company}</h2>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm text-gray-500">{job.salary}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Job Description</h3>
                <p className="text-sm text-gray-700">{job.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                <p className="text-sm text-gray-700">{job.requirements || 'Not specified'}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Benefits</h3>
                <p className="text-sm text-gray-700">{job.benefits || 'Not specified'}</p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleApply}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Apply Now
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetail;
