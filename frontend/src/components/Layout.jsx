import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = ({ user, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Top Section - Logo and User Info */}
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="text-3xl">📋</div>
            <div>
              <h1 className="text-2xl font-bold">SHREE PAPER PRODUCTS</h1>
              <p className="text-sm text-blue-200">Premium Paper Cone Manufacturing</p>
            </div>
          </Link>
          <div className="flex items-center gap-6">
            {user && (
              <>
                <div className="text-right hidden sm:block">
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-blue-200 capitalize">{user.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 border-t border-blue-700 pt-4">
          <ul className="flex flex-wrap gap-8">
            <li><Link to="/" className="hover:text-blue-200 font-medium transition-colors">🏠 Home</Link></li>
            <li><Link to="/products" className="hover:text-blue-200 font-medium transition-colors">📦 Products</Link></li>
            {user && (
              <>
                <li><Link to="/orders" className="hover:text-blue-200 font-medium transition-colors">📝 Orders</Link></li>
                <li><Link to="/orders/create" className="hover:text-blue-200 font-medium transition-colors">➕ Create Order</Link></li>
              </>
            )}
            {user?.role === 'admin' && (
              <li><Link to="/dashboard" className="hover:text-blue-200 font-medium transition-colors">📊 Dashboard</Link></li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export const Navigation = ({ user }) => {
  return null; // Navigation is now integrated in Header
};

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-white font-bold mb-4">SHREE PAPER PRODUCTS</h3>
          <p className="text-sm">Premium paper cone manufacturing for textile industry</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Contact</h4>
          <p className="text-sm">Kangeyam, Tirupur, Tamilnadu, India</p>
          <p className="text-sm">Phone: 6385309237</p>
          <p className="text-sm">Email: shreepaper@gmail.com</p>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="text-sm space-y-2">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/orders" className="hover:text-white">Orders</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
        <p>&copy; 2024 Shree Paper Products. All rights reserved.</p>
      </div>
    </footer>
  );
};
