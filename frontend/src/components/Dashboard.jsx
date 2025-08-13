import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async (token) => {
    setProductsLoading(true);
    setError(null);
    try {
      console.log('Attempting to fetch products...');
      const response = await axios.get('http://localhost:3001/api/products', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Products response:', response);
      setProducts(response.data);
    } catch (err) {
      console.error('Detailed fetch error:', {
        message: err.message,
        response: err.response,
        request: err.request,
        config: err.config
      });
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
        console.error('Auth error:', error);
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

  if (loading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  if (!user) {
    return <div>No user data available. Please login again.</div>;
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome back, {user.name}!</h1>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">
        <div className="dashboard-card">
          <h3 className="card-title">Your Profile</h3>
          <div className="card-content">
            <p><strong>Name:</strong> {user.name || 'Not available'}</p>
            <p><strong>Email:</strong> {user.email || 'Not available'}</p>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Available Products</h3>
          {productsLoading ? (
            <div className="loading-spinner">Loading products...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="products-list">
              {products.length > 0 ? (
                <ul className="product-items">
                  {products.map(product => (
                    <li key={product._id} className="product-item">
                      <div className="product-image">
                        {product.image && (
                          <img src={
                            product.image}
                             alt={product.name}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              display: 'block'
                            }} />
                        )}
                      </div>
                      <div className="product-details">
                        <h4>{product.name}</h4>
                        <p>${product.price.toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No products available</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;