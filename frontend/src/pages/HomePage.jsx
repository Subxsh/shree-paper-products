import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage = () => {
  const standardCones = [
    { degree: '4°20', length: '170mm', topDia: '16mm', bottomDia: '69mm' },
    { degree: '4°30', length: '175mm', topDia: '17mm', bottomDia: '69mm' },
    { degree: '5°57', length: '230mm', topDia: '22mm', bottomDia: '69mm' },
    { degree: '3°30', length: '170mm', topDia: '18mm', bottomDia: '62mm' }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Paper Cones */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1760818072388-4604d5cb39ac?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=900&q=60)',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Content Wrapper */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-6xl md:text-7xl font-bold mb-6 drop-shadow-lg">SHREE PAPER PRODUCTS</h2>
          <p className="text-2xl md:text-3xl mb-6 text-gray-100 drop-shadow-md">Premium Paper Cones for Textile Industry</p>
          <p className="text-lg md:text-xl mb-12 text-gray-200 drop-shadow-md">Manufacturing Excellence Since 2020</p>
          <Link to="/products" className="inline-block bg-white text-blue-900 px-10 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg">
            Explore Catalog
          </Link>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">About Us</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Shree Paper Products is a leading manufacturer of high-quality paper cones used by textile thread manufacturers across India and beyond.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                With over a decade of experience, we specialize in producing premium paper cones that meet international quality standards.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li>✓ ISO Certified Manufacturing</li>
                <li>✓ Precision Engineering</li>
                <li>✓ Custom Solutions Available</li>
                <li>✓ Competitive Pricing</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-blue-50 p-8 rounded-lg">
              <p className="text-gray-600 text-center">
                <span className="block text-4xl font-bold text-blue-900">1000+</span>
                <span>Happy Customers</span>
              </p>
              <p className="text-gray-600 text-center mt-6">
                <span className="block text-4xl font-bold text-blue-900">10M+</span>
                <span>Cones Produced Annually</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Standard Cones Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Standard Paper Cone Measurements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standardCones.map((cone, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-blue-900 mb-4">{cone.degree}</div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Length: <span className="font-semibold text-gray-900">{cone.length}</span></p>
                  <p>Top Dia: <span className="font-semibold text-gray-900">{cone.topDia}</span></p>
                  <p>Bottom Dia: <span className="font-semibold text-gray-900">{cone.bottomDia}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Why Choose Us</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-900">⚙️</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Quality Manufacturing</h4>
              <p className="text-gray-600">State-of-the-art manufacturing facilities with strict quality control</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-900">🚚</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Fast Delivery</h4>
              <p className="text-gray-600">Efficient logistics and timely delivery across India</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-900">💼</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Expert Support</h4>
              <p className="text-gray-600">Dedicated customer support and technical assistance</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Ready to Order?</h3>
          <p className="text-xl mb-8">Contact us today for bulk orders and special pricing</p>
          <Link to="/orders" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 inline-block">
            Create Order
          </Link>
        </div>
      </section>
    </div>
  );
};
