import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { AboutPage } from './pages/AboutPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { OrderCreationPage } from './pages/OrderCreationPage';
import { OrdersPage } from './pages/OrdersPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { CustomerOrdersPage } from './pages/CustomerOrdersPage';
import { AdminOrdersPage } from './pages/AdminOrdersPage';
import { AdminCustomOrdersPage } from './pages/AdminCustomOrdersPage';
import { AdminProductsPage } from './pages/AdminProductsPage';
import { CustomOrderPage } from './pages/CustomOrderPage';
import { CartPage } from './pages/CartPage';

// Components
import Navbar from './components/Navbar';
import { Footer } from './components/Layout';

// Styles
import './styles/index.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const ProtectedRoute = ({ element }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return element;
  };

  const AdminRoute = ({ element }) => {
    if (!user || user.role !== 'admin') {
      return <Navigate to="/" replace />;
    }
    return element;
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <Toaster position="top-right" />
      
      <Navbar user={user} onLogout={handleLogout} />

      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/register" element={<RegisterPage onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route
            path="/custom-order"
            element={user?.role === 'admin' ? <Navigate to="/dashboard" replace /> : <CustomOrderPage />}
          />

          {/* Protected Customer Routes */}
          <Route path="/orders" element={<ProtectedRoute element={<OrdersPage />} />} />
          <Route path="/orders/create" element={<ProtectedRoute element={<OrderCreationPage />} />} />
          <Route path="/my-orders" element={<ProtectedRoute element={<MyOrdersPage user={user} />} />} />
          <Route path="/customer-orders" element={<ProtectedRoute element={<CustomerOrdersPage />} />} />
          <Route path="/cart" element={<ProtectedRoute element={<CartPage user={user} />} />} />

          {/* Protected Admin Routes */}
          <Route path="/dashboard" element={<AdminRoute element={<DashboardPage />} />} />
          <Route path="/admin/orders" element={<AdminRoute element={<AdminOrdersPage />} />} />
          <Route path="/admin/custom-orders" element={<AdminRoute element={<AdminCustomOrdersPage />} />} />
          <Route path="/admin/products" element={<AdminRoute element={<AdminProductsPage />} />} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </Router>
  );
}

export default App;
