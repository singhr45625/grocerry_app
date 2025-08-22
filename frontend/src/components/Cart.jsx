import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../App.css';
import './Cart.css'


const Cart = () => {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    cartCount,
    loading
  } = useCart();

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      await clearCart();
      setOrderPlaced(true);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const continueShopping = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="cart-container">
        <div className="loading-spinner">Loading cart...</div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="cart-container">
        <div className="order-success">
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your purchase. Your order is being processed.</p>
          <button onClick={continueShopping} className="btn btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      
      <div className="cart-container">
        <header className="cart-header">
          <h1>Shopping Cart</h1>
          <button onClick={continueShopping} className="btn btn-secondary">
            Continue Shopping
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some products to your cart to see them here.</p>
            <button onClick={continueShopping} className="btn btn-primary">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="cart-content">
            <div className="cart-items">
              {cart.map(item => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img
                      src={item.product?.image || 'https://placehold.co/100x100/e2e8f0/64748b?text=Product'}
                      alt={item.product?.name || 'Product'}
                    />
                  </div>
                  <div className="item-details">
                    <h3 className="item-name">{item.product?.name || 'Unknown Product'}</h3>
                    <p className="item-price">${item.product?.price?.toFixed(2) || '0.00'}</p>
                  </div>
                  <div className="item-quantity">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="quantity-btn"
                      disabled={loading}
                    >
                      -
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="quantity-btn"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>
                  <div className="item-total">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </div>
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="btn btn-danger remove-btn"
                    disabled={loading}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <div className="summary-card">
                <h3>Order Summary</h3>
                <div className="summary-row">
                  <span>Items ({cartCount})</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary-row">
                  <span>Tax</span>
                <span>${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="summary-row total">
                  <span>Total</span>
                  <span>${(cartTotal * 1.1).toFixed(2)}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  className="btn btn-primary checkout-btn"
                  disabled={checkoutLoading || loading}
                >
                  {checkoutLoading ? 'Processing...' : 'Proceed to Checkout'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
