import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import Cart from './components/Cart'
import { CartProvider } from './context/CartContext'; 
import './App.css';

// Auth check component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token');
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      {/* Wrap the entire application with CartProvider */}
      <CartProvider>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
              />
              <Route 
               path="/cart"
               element={
               <ProtectedRoute>
                 <Cart />
               </ProtectedRoute>
               }
              />
          </Routes>
        </div>
      </CartProvider>
    </Router>
  );
}

export default App;