import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const CustomOrderPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [formData, setFormData] = useState({
    // Customer Information
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    
    // Cone Specifications
    coneDegree: '4°30',
    length: '',
    topDiameter: '',
    bottomDiameter: '',
    material: 'Brown Kraft',
    color: '',
    threadCompatibility: '30S',
    weight: '',
    strength: 'Medium',
    
    // Order Details
    quantity: '',
    deliveryDate: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/custom-orders', formData);
      
      // Set reference number
      setReferenceNumber(response.data.referenceNumber);
      setSubmitted(true);
      
      toast.success('Custom order request submitted successfully!');
      
      // Reset form
      setFormData({
        customerName: '',
        companyName: '',
        email: '',
        phone: '',
        coneDegree: '4°30',
        length: '',
        topDiameter: '',
        bottomDiameter: '',
        material: 'Brown Kraft',
        color: '',
        threadCompatibility: '30S',
        weight: '',
        strength: 'Medium',
        quantity: '',
        deliveryDate: '',
        notes: ''
      });

      // Show success message with order details
      setTimeout(() => {
        toast.success('A confirmation email has been sent! Check your inbox.', {
          duration: 5000
        });
      }, 1000);

    } catch (error) {
      console.error('Error submitting custom order:', error);
      toast.error(error.response?.data?.message || 'Failed to submit order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Success Message - Show after submission */}
        {submitted && (
          <div className="mb-12 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 rounded-xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-3xl font-bold text-green-700 mb-2">Order Submitted Successfully!</h2>
              <p className="text-green-600">Thank you for your custom order request</p>
            </div>

            <div className="bg-white rounded-lg p-6 mb-6 border-2 border-green-200">
              <p className="text-center text-gray-700 mb-4">Your Order Reference Number:</p>
              <div className="text-center bg-green-100 border-2 border-green-500 rounded-lg p-4">
                <p className="text-4xl font-bold text-green-700 font-mono">#{referenceNumber}</p>
              </div>
              <p className="text-center text-sm text-gray-600 mt-4">Save this number for your records</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="font-bold text-blue-900 mb-4">📧 What happens next?</h3>
              <ul className="space-y-3 text-blue-800">
                <li className="flex items-start">
                  <span className="font-bold mr-3">1.</span>
                  <span>A confirmation email has been sent to <strong>{formData.email}</strong></span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3">2.</span>
                  <span>Our technical team will review your specifications</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3">3.</span>
                  <span>We'll contact you within <strong>24 hours</strong> with a detailed quote</span>
                </li>
                <li className="flex items-start">
                  <span className="font-bold mr-3">4.</span>
                  <span>Production typically takes <strong>7-14 days</strong> after approval</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-bold text-yellow-800 mb-2">📞 Call us</p>
                <p className="text-lg font-bold text-yellow-900">+91 98765 43210</p>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm font-bold text-yellow-800 mb-2">📧 Email us</p>
                <p className="text-lg font-bold text-yellow-900">orders@shreepaper.com</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setSubmitted(false)}
                className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition-colors"
              >
                Submit Another Order
              </button>
              <button
                onClick={() => navigate('/products')}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
              >
                Browse Products
              </button>
            </div>
          </div>
        )}

        {/* Show form only if not submitted */}
        {!submitted && (
          <>
        
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Custom Paper Cone Order
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Need paper cones with specific requirements? Fill out this form and our team 
            will get back to you with a custom quote within 24 hours.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <form onSubmit={handleSubmit}>
            {/* Customer Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
                Customer Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="Enter company name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Cone Specifications Section */}
            <div className="mb-8 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">2</span>
                Cone Specifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Cone Degree <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="coneDegree"
                    value={formData.coneDegree}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="3°30">3°30</option>
                    <option value="4°20">4°20</option>
                    <option value="4°30">4°30</option>
                    <option value="5°57">5°57</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Length (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="e.g., 170"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Top Diameter (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="topDiameter"
                    value={formData.topDiameter}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="e.g., 16"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Bottom Diameter (mm) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="bottomDiameter"
                    value={formData.bottomDiameter}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="e.g., 69"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Material <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="White Kraft">White Kraft</option>
                    <option value="Brown Kraft">Brown Kraft</option>
                    <option value="Sky Blue Solid">Sky Blue Solid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Color <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="e.g., Brown, Blue, White"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Thread Compatibility <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="threadCompatibility"
                    value={formData.threadCompatibility}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="20S">20S</option>
                    <option value="30S">30S</option>
                    <option value="34S">34S</option>
                    <option value="40S">40S</option>
                    <option value="61S">61S</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Weight (grams) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    required
                    min="0.1"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="e.g., 2.8"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Strength <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="strength"
                    value={formData.strength}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  >
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Order Details Section */}
            <div className="mb-8 border-t pt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="bg-blue-900 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">3</span>
                Order Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity (NOS) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    required
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                    placeholder="e.g., 10000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Required Delivery Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    value={formData.deliveryDate}
                    onChange={handleChange}
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Special Instructions / Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-900 focus:border-transparent resize-none"
                    placeholder="Any special requirements, delivery preferences, or additional information..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 border-t">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-900 text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-blue-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit Order Request'
                )}
              </button>
            </div>

            {/* Info Box */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-semibold text-blue-900">What happens next?</h3>
                  <div className="mt-2 text-sm text-blue-800">
                    <ul className="list-disc list-inside space-y-1">
                      <li>Our team will review your custom order requirements</li>
                      <li>We'll contact you within 24 hours with a detailed quote</li>
                      <li>Once approved, production typically takes 7-14 days</li>
                      <li>We'll keep you updated throughout the manufacturing process</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center text-gray-600">
          <p>Need immediate assistance? Call us at <a href="tel:+919876543210" className="text-blue-900 font-semibold hover:underline">+91 98765 43210</a></p>
          <p className="mt-2">Or email us at <a href="mailto:orders@shreepaper.com" className="text-blue-900 font-semibold hover:underline">orders@shreepaper.com</a></p>
        </div>
          </>
        )}
      </div>
    </div>
  );
};
