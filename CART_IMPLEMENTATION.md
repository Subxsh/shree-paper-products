# Shopping Cart Implementation Guide

## Overview

A complete shopping cart system has been implemented using React and localStorage. Users can add products to their cart, modify quantities, and proceed to checkout.

---

## Features Implemented

### 1. **Cart Helper Functions** (`frontend/src/utils/helpers.js`)

#### `addToCart(product)`
Adds a product to the cart or increments quantity if it already exists.

```javascript
const result = addToCart(product);
// Returns: { success: true, message: 'Product added to cart' }
```

**Parameters:**
- `product` (Object) - Product object with fields: `_id`, `name`, `price`, `image`

**Behavior:**
- Retrieves cart from localStorage
- Checks if product already exists
- If exists: increments quantity
- If new: adds product with quantity = 1
- Saves updated cart to localStorage
- Triggers `cartUpdated` event

---

#### `removeFromCart(productId)`
Removes a product completely from the cart.

```javascript
const result = removeFromCart(productId);
// Returns: { success: true, message: 'Product removed from cart' }
```

---

#### `updateCartQuantity(productId, quantity)`
Updates the quantity of a product in the cart.

```javascript
const result = updateCartQuantity(productId, 5); // Set quantity to 5
const result = updateCartQuantity(productId, 1); // Remove if quantity < 1
```

---

#### `getCart()`
Retrieves the entire cart from localStorage.

```javascript
const cartItems = getCart();
// Returns: Array of cart items
```

---

#### `clearCart()`
Clears the entire cart.

```javascript
const result = clearCart();
// Returns: { success: true, message: 'Cart cleared' }
```

---

#### `getCartTotal(cart)`
Calculates the total price of all items in cart.

```javascript
const total = getCartTotal(cartItems);
// Returns: 50000 (sum of price * quantity for all items)
```

---

#### `getCartItemCount()`
Gets the total number of items (sum of quantities) in cart.

```javascript
const count = getCartItemCount();
// Returns: 5 (if cart has 2 items with qty 3 and 2)
```

---

### 2. **Product Details Page Updates**

**File:** `frontend/src/pages/ProductDetailsPage.jsx`

The "Add to Cart" button now has full functionality:

```jsx
const handleAddToCart = () => {
  const result = addToCart(product);
  if (result.success) {
    toast.success('Product added to cart!');
  } else {
    toast.error(result.message);
  }
};

<button 
  onClick={handleAddToCart}
  className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
>
  Add to Cart
</button>
```

**Features:**
- ✅ Adds product to localStorage
- ✅ Shows success toast notification
- ✅ Updates navbar cart count in real-time
- ✅ Handles errors gracefully

---

### 3. **Shopping Cart Page**

**File:** `frontend/src/pages/CartPage.jsx`
**Route:** `/cart`

Complete shopping cart interface with:

#### Features:
- ✅ Display all cart items with images
- ✅ Show price per item and total cost
- ✅ Quantity controls (+ / -)
- ✅ Remove item button
- ✅ Order summary sidebar
- ✅ Clear cart button
- ✅ Continue shopping button
- ✅ Proceed to checkout button
- ✅ Empty cart message with redirect to products

#### Components:
1. **Cart Items List**
   - Product image
   - Product name
   - Price per unit
   - Quantity controls (increment/decrement)
   - Line total (price × quantity)
   - Remove button

2. **Order Summary Sidebar**
   - Subtotal
   - Shipping calculation notice
   - Tax calculation notice
   - Grand total
   - Proceed to checkout button
   - Continue shopping button
   - Promo code input (optional)

3. **Empty State**
   - Friendly message
   - Link to browse products

---

### 4. **Navbar Updates**

**File:** `frontend/src/components/Navbar.jsx`

Added cart icon with dynamic badge:

```jsx
<li className="navbar-item">
  <Link to="/cart" className="navbar-link relative" onClick={closeMenu}>
    🛒 Cart
    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
        {cartCount > 99 ? '99+' : cartCount}
      </span>
    )}
  </Link>
</li>
```

**Features:**
- ✅ Cart link always visible
- ✅ Red badge showing item count
- ✅ Updates in real-time when items are added
- ✅ Shows "99+" for carts with 100+ items
- ✅ Hides badge when cart is empty

---

### 5. **App Routes**

**File:** `frontend/src/App.js`

Added new route:
```jsx
<Route path="/cart" element={<CartPage user={user} />} />
```

The cart page is public (no login required to view) but checkout requires authentication.

---

## localStorage Structure

### Cart Item Format

Each item in the cart is stored as:

```javascript
{
  _id: "507f1f77bcf86cd799439011",        // MongoDB ObjectId
  name: "Paper Cone 45°",                 // Product name
  price: 50,                              // Price per unit in INR
  image: "https://...",                   // Product image URL
  quantity: 5                             // Quantity in cart
}
```

### Complete Cart Example

```javascript
// localStorage.cart =
[
  {
    _id: "507f1f77bcf86cd799439011",
    name: "Paper Cone 45°",
    price: 50,
    image: "https://example.com/cone1.jpg",
    quantity: 3
  },
  {
    _id: "507f1f77bcf86cd799439012",
    name: "Paper Cone 60°",
    price: 75,
    image: "https://example.com/cone2.jpg",
    quantity: 2
  }
]

// In this example:
// - 3 items of first product
// - 2 items of second product
// - Total items: 5
// - Subtotal: (50*3) + (75*2) = 150 + 150 = 300
```

---

## Event System

The cart system uses custom events to keep UI in sync:

### `cartUpdated` Event

Fired whenever the cart is modified (add, remove, update, clear).

```javascript
// Listen for cart updates
window.addEventListener('cartUpdated', () => {
  const newCount = getCartItemCount();
  console.log('Cart updated! Item count:', newCount);
});
```

**Fired by:**
- `addToCart()`
- `removeFromCart()`
- `updateCartQuantity()`
- `clearCart()`

**Listened by:**
- `Navbar.jsx` - Updates cart badge count
- Any component that needs to react to cart changes

---

## User Flow

### Adding Products to Cart

```
1. User browses products at /products
2. Clicks on a product → /products/:id
3. Sees "Add to Cart" button
4. Clicks button
5. Product added to localStorage
6. Toast notification shows "Product added to cart!"
7. Navbar cart badge updates in real-time
```

### Managing Cart

```
1. User clicks Cart (🛒) icon in navbar
2. Navigates to /cart
3. Sees all items in cart with:
   - Quantity controls (+ / -)
   - Remove button
   - Item totals
4. Can:
   - Increase/decrease quantities
   - Remove items
   - Clear entire cart
   - Continue shopping
   - Proceed to checkout
```

### Checkout Process

```
1. User clicks "Proceed to Checkout"
2. System checks if user is logged in
3. If NOT logged in:
   - Redirects to /login
   - Shows toast: "Please log in to place an order"
4. If logged in:
   - Navigates to /orders/create
   - Cart data available for order creation
5. User fills order details
6. Places order
7. Cart can be cleared after successful order
```

---

## Code Examples

### Example 1: Add Product to Cart with Notification

```jsx
import { addToCart } from '../utils/helpers';
import toast from 'react-hot-toast';

function ProductCard({ product }) {
  const handleAddToCart = () => {
    const result = addToCart(product);
    if (result.success) {
      toast.success('✓ Added to cart');
    } else {
      toast.error('Failed to add to cart');
    }
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

---

### Example 2: Display Cart with Item Management

```jsx
import { getCart, removeFromCart, updateCartQuantity, getCartTotal } from '../utils/helpers';

function ShoppingCart() {
  const [cart, setCart] = useState(getCart());

  const handleRemove = (productId) => {
    removeFromCart(productId);
    setCart(getCart()); // Reload cart
  };

  const handleChangeQty = (productId, newQty) => {
    updateCartQuantity(productId, newQty);
    setCart(getCart()); // Reload cart
  };

  const total = getCartTotal(cart);

  return (
    <div>
      {cart.map(item => (
        <div key={item._id}>
          <h3>{item.name}</h3>
          <p>Price: ₹{item.price}</p>
          <input 
            type="number" 
            value={item.quantity}
            onChange={(e) => handleChangeQty(item._id, parseInt(e.target.value))}
          />
          <button onClick={() => handleRemove(item._id)}>
            Remove
          </button>
          <p>Line Total: ₹{item.price * item.quantity}</p>
        </div>
      ))}
      <h2>Total: ₹{total}</h2>
    </div>
  );
}
```

---

### Example 3: Auto-update Navbar When Cart Changes

```jsx
import { useState, useEffect } from 'react';
import { getCartItemCount } from '../utils/helpers';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Initial count
    setCartCount(getCartItemCount());

    // Update count when cart changes
    const handleCartUpdate = () => {
      setCartCount(getCartItemCount());
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  return (
    <nav>
      <Link to="/cart">
        Cart {cartCount > 0 && <span>{cartCount}</span>}
      </Link>
    </nav>
  );
}
```

---

## Testing Checklist

- [ ] Click "Add to Cart" on a product → Toast shows success
- [ ] Cart badge on navbar updates with correct count
- [ ] Navigate to `/cart` → Shows added products
- [ ] Click + button → Quantity increases
- [ ] Click - button → Quantity decreases
- [ ] Click Remove button → Item removed from cart
- [ ] Refresh page → Cart items still there (localStorage persists)
- [ ] Click "Continue Shopping" → Goes back to /products
- [ ] Click "Proceed to Checkout" (not logged in) → Redirects to /login
- [ ] Click "Proceed to Checkout" (logged in) → Goes to /orders/create
- [ ] Click "Clear Cart" → Shows confirmation, clears cart

---

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

## Persistence

The cart persists **only in the same browser/device** using localStorage:

- ✅ Survives page refresh
- ✅ Survives closing and reopening browser
- ✅ Each browser has separate cart
- ✅ Incognito/Private mode has separate cart
- ✅ No server database needed

---

## Limitations & Future Enhancements

### Current Limitations:
- No backend persistence (cart lost if browser cleared)
- No multi-device sync
- No price updates from server

### Recommended Enhancements:

1. **Save to Database**
   ```javascript
   // When user logs in, sync cart to server
   // PUT /api/users/:id/cart with cart data
   ```

2. **Cart Expiry**
   ```javascript
   // Add timestamp to cart items
   // Remove items older than 30 days
   ```

3. **Product Validation**
   ```javascript
   // Before adding, check if product still exists
   // Verify pricing hasn't changed
   ```

4. **Stock Check**
   ```javascript
   // Validate product has enough stock
   // Show out-of-stock message
   ```

5. **Saved for Later**
   ```javascript
   // Move items to "Saved Items" instead of deleting
   // Restore later with one click
   ```

---

## Debugging

### Check Current Cart

```javascript
// In browser console
JSON.parse(localStorage.getItem('cart'))

// Pretty print
console.table(JSON.parse(localStorage.getItem('cart')))

// Get cart item count
Object.values(JSON.parse(localStorage.getItem('cart'))).reduce((s, i) => s + i.quantity, 0)
```

### Clear Cart Manually

```javascript
localStorage.removeItem('cart')
// Then refresh page
```

### Simulate Cart with Data

```javascript
const mockCart = [
  { _id: '1', name: 'Cone A', price: 50, image: '', quantity: 2 },
  { _id: '2', name: 'Cone B', price: 75, image: '', quantity: 1 }
];
localStorage.setItem('cart', JSON.stringify(mockCart))
```

---

## Summary

The shopping cart is fully functional and ready to use! Users can:

✅ Add products from product pages  
✅ View cart with all items  
✅ Modify quantities  
✅ Remove items  
✅ See real-time updates  
✅ Proceed to checkout  
✅ Cart persists across sessions  

All cart data is stored in browser's localStorage with no backend required.
