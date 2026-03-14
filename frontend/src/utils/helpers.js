export const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const downloadPDF = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Cart Management Functions
export const addToCart = (product) => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existing = cart.find(item => item._id === product._id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger a custom event to notify components about cart change
    window.dispatchEvent(new Event('cartUpdated'));
    
    return { success: true, message: 'Product added to cart' };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return { success: false, message: 'Failed to add product to cart' };
  }
};

export const removeFromCart = (productId) => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item._id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    return { success: true, message: 'Product removed from cart' };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return { success: false, message: 'Failed to remove product' };
  }
};

export const updateCartQuantity = (productId, quantity) => {
  try {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const item = cart.find(item => item._id === productId);
    
    if (item) {
      if (quantity <= 0) {
        cart = cart.filter(item => item._id !== productId);
      } else {
        item.quantity = quantity;
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      
      window.dispatchEvent(new Event('cartUpdated'));
      
      return { success: true, message: 'Cart updated' };
    }
    return { success: false, message: 'Product not found in cart' };
  } catch (error) {
    console.error('Error updating cart:', error);
    return { success: false, message: 'Failed to update cart' };
  }
};

export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem('cart')) || [];
  } catch (error) {
    console.error('Error getting cart:', error);
    return [];
  }
};

export const clearCart = () => {
  try {
    localStorage.removeItem('cart');
    
    window.dispatchEvent(new Event('cartUpdated'));
    
    return { success: true, message: 'Cart cleared' };
  } catch (error) {
    console.error('Error clearing cart:', error);
    return { success: false, message: 'Failed to clear cart' };
  }
};

export const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const getCartItemCount = () => {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
};
