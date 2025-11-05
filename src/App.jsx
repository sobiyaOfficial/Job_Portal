import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { NotificationProvider } from './contexts/NotificationContext';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import Home from './components/Home';
import JobDetail from './components/JobDetail';
import './App.css';

function App() {
  const [componentKey, setComponentKey] = useState(0);

  useEffect(() => {
    const handleLoginChange = () => {
      // Force component remount by changing key
      setComponentKey(prev => prev + 1);
    };

    // Listen for login changes
    window.addEventListener('loginChanged', handleLoginChange);
    window.addEventListener('storage', handleLoginChange);

    return () => {
      window.removeEventListener('loginChanged', handleLoginChange);
      window.removeEventListener('storage', handleLoginChange);
    };
  }, []);

  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user-dashboard" element={<UserDashboard key={componentKey} />} />
            <Route path="/user-dashboard/:userId" element={<UserDashboard key={componentKey} />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/job/:id" element={<JobDetail />} />
          </Routes>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;
