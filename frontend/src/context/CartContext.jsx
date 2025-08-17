// context/CartContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Create axios instance with auth
  const api = axios.create({
    baseURL: 'http://localhost:3001/api/cart',
  });

  // Add auth token to requests
  api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // Load cart on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await api.get('/');
        setCart(data.items ? data : { items: [] });
      } catch (err) {
        console.error("Error loading cart:", err);
      }
    };
    fetchCart();
  }, []);

  // Add item to cart
  const addItem = async (product, quantity = 1) => {
    setLoading(true);
    try {
      const { data } = await api.post('/', { product: product._id, quantity });
      setCart(data);
      setMessage(`${product.name} added to cart`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error adding to cart:", err);
      setMessage(err.response?.data?.message || 'Failed to add item');
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    setLoading(true);
    try {
      const { data } = await api.delete(`/${itemId}`);
      setCart(data.items ? data : { items: [] });
      setMessage('Item removed from cart');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error("Error removing item:", err);
      setMessage(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const getTotal = () => {
    return cart.items.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity;
    }, 0);
  };

  const getCount = () => {
    return cart.items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart: cart.items,
        addToCart: addItem,
        removeFromCart: removeItem,
        cartTotal: getTotal(),
        cartCount: getCount(),
        cartMessage: message,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);