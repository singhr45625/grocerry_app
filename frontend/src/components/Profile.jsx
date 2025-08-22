import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css'; 

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);


  useEffect(() => {
    const fetchUser = () => {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('token'); 
      if (userData && token) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          setName(parsedUser.name || '');
          setEmail(parsedUser.email || '');
        } catch (e) {
          console.error('Failed to parse user data from localStorage', e);
          localStorage.clear();
          navigate('/login');
          return;
        }
      } else {
        // If user data or token is missing, redirect immediately
        navigate('/login');
        return;
      }
      setLoading(false);
    };
    fetchUser();
  }, [navigate]);
  
  // This useEffect hook handles the auto-dismissal of success and error messages.
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 5000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    const token = localStorage.getItem('token');

    // Final critical check
    if (!token || !user || !user._id) {
      setError('User data or authentication token not found. Please log in again.');
      setLoading(false);
      localStorage.clear(); // Clear storage to be safe
      navigate('/login');
      return;
    }

    try {
      const updateData = {};
      if (name !== user.name) updateData.name = name;
      if (email !== user.email) updateData.email = email;

      // Check if both password fields are filled
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      } else if (currentPassword || newPassword) {
        // If only one password field is filled, show an error and stop.
        setError('Please provide both current and new passwords to change your password.');
        setLoading(false);
        return;
      }

      if (Object.keys(updateData).length === 0) {
        setSuccess('No changes to save.');
        setLoading(false);
        return;
      }

      const response = await axios.put(
        `http://localhost:3001/api/auth/update/${user._id}`,
        updateData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedUser = response.data.user;
      const newToken = response.data.token;

      // Update localStorage with new data
      localStorage.setItem('user', JSON.stringify(updatedUser));
      if (newToken) localStorage.setItem('token', newToken);

      setUser(updatedUser);
      setSuccess('Profile updated successfully! 🎉');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || err.message || 'Failed to update profile');
      if (err.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <h1>Edit Profile</h1>
        <button onClick={() => navigate('/dashboard')} className="btn btn-secondary">
          Back to Dashboard
        </button>
      </header>

      <main className="profile-content">
        <form onSubmit={handleProfileUpdate} className="profile-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              required
            />
          </div>
          <div className="password-update-section">
            <h4 className="section-subtitle">Change Password (optional)</h4>
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !user}
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
        </form>
      </main>
    </div>
  );
};

export default Profile;