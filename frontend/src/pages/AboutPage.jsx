import React from 'react';

export const AboutPage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative text-white bg-gradient-to-r from-blue-900 to-blue-800 py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">About Shree Paper Products</h1>
          <p className="text-xl text-blue-100">Excellence in Paper Cone Manufacturing Since 2020</p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Shree Paper Products was founded in 2020 with a vision to revolutionize the paper cone manufacturing industry. We started with a small facility and have grown into a trusted supplier serving textile manufacturers across India and beyond.
              </p>
              <p className="text-lg text-gray-700 mb-4 leading-relaxed">
                Our commitment to quality, innovation, and customer satisfaction has made us a preferred choice for paper cones in the textile industry. We combine traditional manufacturing expertise with modern technology.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Located in Kangeyam, Tirupur, Tamilnadu, the textile hub of India, we understand the unique needs of textile manufacturers and deliver products that exceed expectations.
              </p>
            </div>
            <div className="bg-gradient-to-r from-blue-100 to-blue-50 p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold text-blue-900 mb-6">Quick Facts</h3>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-900 pl-4">
                  <p className="font-bold text-gray-900">Established</p>
                  <p className="text-gray-700">2020</p>
                </div>
                <div className="border-l-4 border-blue-900 pl-4">
                  <p className="font-bold text-gray-900">Location</p>
                  <p className="text-gray-700">Kangeyam, Tirupur, Tamilnadu, India</p>
                </div>
                <div className="border-l-4 border-blue-900 pl-4">
                  <p className="font-bold text-gray-900">Specialization</p>
                  <p className="text-gray-700">Paper Cone Manufacturing</p>
                </div>
                <div className="border-l-4 border-blue-900 pl-4">
                  <p className="font-bold text-gray-900">Quality Standard</p>
                  <p className="text-gray-700">International Quality Certified</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Quality Excellence</h3>
              <p className="text-gray-700">We maintain the highest standards of quality in every product we manufacture, ensuring reliability and durability.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Customer Focus</h3>
              <p className="text-gray-700">Our customers' success is our success. We listen, understand, and deliver solutions tailored to their needs.</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Innovation</h3>
              <p className="text-gray-700">We constantly innovate and improve our processes to provide cutting-edge paper cone solutions to the textile industry.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specialization */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">What We Manufacture</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Paper Cone Specifications</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Cone Degrees: 3°30, 4°20, 4°30, 5°57</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Materials: Kraft Paper, Sky Blue Solid</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Thread Compatibility: 20S to 61S</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Finishing Options: Plain, Diamond, Smooth</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Customization: Available upon request</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-blue-900 mb-4">Quality Assurance</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Rigorous quality control at every stage</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> International quality standards compliance</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Professional testing and validation</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Consistent product performance</li>
                <li className="flex items-center gap-3"><span className="text-blue-900 font-bold">✓</span> Reliable supply chain management</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Partner With Us?</h2>
          <p className="text-xl mb-8 text-blue-100">Contact us today to discover how Shree Paper Products can meet your manufacturing needs.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a href="/products" className="bg-white text-blue-900 px-8 py-3 rounded-lg font-bold hover:bg-blue-50 transition-colors">
              Explore Products
            </a>
            <a href="/contact" className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors border-2 border-white">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
