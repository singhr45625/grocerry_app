import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const {
    cart,
    cartMessage,
    addToCart,
    removeFromCart,
    updateQuantity,
    cartTotal, // Corrected: Changed from getCartTotal to cartTotal
    cartCount
  } = useCart();

  const fetchProducts = async (token) => {
    setProductsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:3001/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch products');
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUser(parsedUser);
          await fetchProducts(token);
        }
      } catch (error) {
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleProfileEdit = () => {
    navigate('/profile');
  };

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <div>No user data available. Please login again.</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome back, <span className="user-name">{user.name}!</span></h1>
          <p className="welcome-message">Ready to explore our latest products?</p>
        </div>
        <div className="header-actions">
          <div className="cart-info">
            <span className="cart-count">{cartCount} items</span>
            <span className="cart-total">${cartTotal.toFixed(2)}</span> {/* Corrected: Changed from getCartTotal() to cartTotal */}
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </header>
      
      {cartMessage && (
        <div className="cart-message">
          {cartMessage}
        </div>
      )}

      <main className="dashboard-content">
        <div className="dashboard-grid">
          {/* Profile Card - Now properly spaced */}
          <div className="dashboard-card profile-card">
            <div className="card-header">
              <h3 className="card-title">Your Profile</h3>
            </div>
            <div className="card-content profile-content">
              <div className="profile-info">
                <div className="info-item">
                  <span className="info-label">Name:</span>
                  <span className="info-value">{user.name || 'Not available'}</span>
                </div>
                <div className="info-item email-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value email-value">{user.email || 'Not available'}</span>
                </div>
              </div>
              <button className="btn btn-secondary edit-profile-btn" onClick={handleProfileEdit}>
                Edit Profile
              </button>
            </div>
          </div>

          {/* Products Section - Now properly aligned */}
          <div className="products-section">
            <h3 className="section-title">Available Products</h3>
            {productsLoading ? (
              <div className="loading-spinner">Loading products...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="products-grid">
                {products.length > 0 ? (
                  products.map(product => (
                    <div key={product._id} className="product-card">
                      <div className="product-image-container">
                        {product.image && (
                          <img 
                            src={product.image}
                            alt={product.name}
                            className="product-image"
                          />
                        )}
                      </div>
                      <div className="product-details">
                        <h4 className="product-name">{product.name}</h4>
                        <p className="product-price">${product.price.toFixed(2)}</p>
                        <button 
                          onClick={() => addToCart(product)}
                          className="btn btn-primary add-to-cart-btn"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-products">No products available</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;