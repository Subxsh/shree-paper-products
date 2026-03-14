import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartQuantity, getCartTotal, clearCart } from '../utils/helpers';
import { formatCurrency } from '../utils/helpers';
import toast from 'react-hot-toast';
import api from '../services/api';

export const CartPage = ({ user }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    setLoading(true);
    const cartItems = getCart();
    setCart(cartItems);
    setLoading(false);
  };

  const handleRemoveItem = (productId) => {
    const result = removeFromCart(productId);
    if (result.success) {
      loadCart();
      toast.success('Product removed from cart');
    } else {
      toast.error(result.message);
    }
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(productId);
      return;
    }
    
    const result = updateCartQuantity(productId, newQuantity);
    if (result.success) {
      loadCart();
    } else {
      toast.error(result.message);
    }
  };

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      const result = clearCart();
      if (result.success) {
        loadCart();
        toast.success('Cart cleared');
      } else {
        toast.error(result.message);
      }
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please log in to place an order');
      navigate('/login');
      return;
    }
    
    if (cart.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    try {
      // Prepare order items with rate and GST information
      const orderItems = cart.map(item => ({
        productId: item._id,
        quantity: item.quantity,
        rate: item.price, // Use product price as rate
        cgst: 9, // Default CGST 9%
        sgst: 9  // Default SGST 9%
      }));

      // Create order payload
      const orderData = {
        items: orderItems,
        customerName: user.name,
        phone: user.phone || '',
        email: user.email || '',
        gstNumber: user.companyDetails?.gst || '',
        status: 'Draft',
        notes: 'Order placed from online shopping cart'
      };

      // Make API call to create order
      const response = await api.post('/orders', orderData);
      
      if (response.data) {
        // Clear the cart
        clearCart();
        loadCart();
        
        // Show success message
        toast.success(`Order #${response.data.poNumber} placed successfully!`);
        
        // Navigate to orders page
        setTimeout(() => {
          navigate('/my-orders');
        }, 1500);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error.response?.data?.message || 'Failed to create order. Please try again.');
    }
  };

  const total = getCartTotal(cart);
  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading cart...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="text-blue-900 hover:text-blue-700 mb-6 font-semibold"
          >
            ← Back to Shopping
          </button>
          <h1 className="text-4xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {itemCount} item{itemCount !== 1 ? 's' : ''} in cart
          </p>
        </div>

        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some products to your cart to get started!</p>
            <button
              onClick={() => navigate('/products')}
              className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row gap-6">
                      {/* Product Image */}
                      <div className="sm:w-24 sm:h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentElement.innerHTML = '<div class="text-4xl">📦</div>';
                            }}
                          />
                        ) : (
                          <div className="text-4xl">📦</div>
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                              {item.name}
                            </h3>
                            <p className="text-2xl font-bold text-blue-900">
                              {formatCurrency(item.price)}
                            </p>
                            <p className="text-gray-600 text-sm mt-1">per item</p>
                          </div>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2 w-fit">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition font-bold"
                            >
                              −
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQty = parseInt(e.target.value);
                                if (!isNaN(newQty) && newQty >= 1) {
                                  handleQuantityChange(item._id, newQty);
                                }
                              }}
                              className="w-12 text-center font-semibold border border-gray-300 rounded px-2 py-1 bg-white"
                            />
                            <button
                              onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-200 transition font-bold"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Line Total */}
                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                          <div>
                            <p className="text-sm text-gray-600">Line Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                              {formatCurrency(item.price * item.quantity)}
                            </p>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemoveItem(item._id)}
                            className="text-red-600 hover:text-red-800 font-semibold hover:bg-red-50 px-4 py-2 rounded-lg transition"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow sticky top-24 p-6 space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>

                <div className="space-y-3 border-t border-b border-gray-200 py-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">Calculate at checkout</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold text-gray-900">Will be calculated</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-bold text-gray-900">Total</span>
                  <span className="font-bold text-blue-900 text-2xl">
                    {formatCurrency(total)}
                  </span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={() => navigate('/products')}
                  className="w-full border-2 border-blue-900 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                  Continue Shopping
                </button>

                {cart.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="w-full text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition"
                  >
                    Clear Cart
                  </button>
                )}

                {/* Promo Code (Optional) */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Promo Code (optional)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-900"
                    />
                    <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition">
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
