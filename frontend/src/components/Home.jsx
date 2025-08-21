import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="app-container">
      <div className="home-container">
        <div className="hero-section">
          <h1>Welcome to Our Platform</h1>
          <p className="hero-subtitle">Get started by creating an account or logging in to access all our amazing features</p>
          <div className="cta-buttons">
            <Link to="/signup" className="btn btn-primary">Sign Up</Link>
            <Link to="/login" className="btn btn-secondary">Login</Link>
          </div>
        </div>
        
        <div className="features-section">
          <div className="container">
            <h2>Why Choose Us?</h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">🚀</div>
                <h3>Fast & Reliable</h3>
                <p>Our platform is built for speed and reliability, ensuring you get the best experience.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3>Secure</h3>
                <p>Your data is protected with industry-leading security measures.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">💼</div>
                <h3>Professional</h3>
                <p>Tools designed by professionals for professionals.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="testimonials-section">
          <div className="container">
            <h2>What Our Users Say</h2>
            <div className="testimonials-grid">
              <div className="testimonial-card">
                <p className="testimonial-content">"This platform has completely transformed how I work. The features are incredible and the interface is so intuitive."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">JD</div>
                  <div className="author-details">
                    <h4>John Doe</h4>
                    <p>Software Engineer</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-content">"I've tried many similar services, but this one stands out for its simplicity and powerful features. Highly recommended!"</p>
                <div className="testimonial-author">
                  <div className="author-avatar">JS</div>
                  <div className="author-details">
                    <h4>Jane Smith</h4>
                    <p>Product Manager</p>
                  </div>
                </div>
              </div>
              <div className="testimonial-card">
                <p className="testimonial-content">"The customer support is exceptional. They helped me set up everything and answered all my questions promptly."</p>
                <div className="testimonial-author">
                  <div className="author-avatar">RJ</div>
                  <div className="author-details">
                    <h4>Robert Johnson</h4>
                    <p>Business Owner</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="cta-section">
          <div className="container">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of satisfied users today and experience the difference for yourself.</p>
            <Link to="/signup" className="btn">Create Your Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;