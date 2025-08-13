import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Home = () => {
  return (
    <div className="app-container">
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to Our Platform</h1>
          <p>Get started by creating an account or logging in</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;