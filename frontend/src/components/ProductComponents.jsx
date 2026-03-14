import React, { useState, useEffect } from 'react';
import { productService } from '../services';
import { formatCurrency } from '../utils/helpers';

export const ProductCard = ({ product, onSelect }) => {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden cursor-pointer">
      {/* Image Container */}
      <div className="relative h-48 bg-gray-200 overflow-hidden group">
        {product.image ? (
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-900 to-blue-700 flex items-center justify-center">
            <div className="text-white text-center">
              <p className="text-sm opacity-75">Cone Degree</p>
              <p className="text-3xl font-bold">{product.coneDegree}</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
        <div className="space-y-1 text-sm text-gray-600 mb-3">
          <p><span className="font-semibold">Material:</span> {product.material}</p>
          <p><span className="font-semibold">Color:</span> {product.color}</p>
          <p><span className="font-semibold">Thread:</span> {product.threadCompatibility}</p>
          <p><span className="font-semibold">Weight:</span> {product.weight}g</p>
        </div>
        <div className="border-t pt-3 flex justify-between items-center">
          <span className="text-lg font-bold text-blue-900">{formatCurrency(product.price)}</span>
          <button
            onClick={() => onSelect && onSelect(product)}
            className="bg-blue-900 text-white px-3 py-2 rounded text-sm hover:bg-blue-800"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export const ProductGrid = ({ products, onSelectProduct }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product._id}
          product={product}
          onSelect={onSelectProduct}
        />
      ))}
    </div>
  );
};

export const ProductFilters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    coneDegree: '',
    color: '',
    material: '',
    threadCompatibility: '',
    search: ''
  });

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-lg font-bold text-gray-900">Filters</h3>

      <input
        type="text"
        placeholder="Search products..."
        value={filters.search}
        onChange={(e) => handleChange('search', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
      />

      <select
        value={filters.coneDegree}
        onChange={(e) => handleChange('coneDegree', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
      >
        <option value="">All Cone Degrees</option>
        <option value="3°30">3°30</option>
        <option value="4°20">4°20</option>
        <option value="4°30">4°30</option>
        <option value="5°57">5°57</option>
      </select>

      <select
        value={filters.color}
        onChange={(e) => handleChange('color', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
      >
        <option value="">All Colors</option>
        <option value="Sky Blue Solid">Sky Blue Solid</option>
        <option value="Brown Kraft">Brown Kraft</option>
        <option value="White">White</option>
        <option value="Natural">Natural</option>
      </select>

      <select
        value={filters.material}
        onChange={(e) => handleChange('material', e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
      >
        <option value="">All Materials</option>
        <option value="Sky Blue Solid">Sky Blue Solid</option>
        <option value="Brown Kraft">Brown Kraft</option>
        <option value="White Kraft">White Kraft</option>
      </select>

      <button
        onClick={() => {
          setFilters({
            coneDegree: '',
            color: '',
            material: '',
            threadCompatibility: '',
            search: ''
          });
          onFilterChange({});
        }}
        className="w-full bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
      >
        Clear Filters
      </button>
    </div>
  );
};
