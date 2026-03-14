import React, { useState, useEffect } from 'react';
import { productService } from '../services';
import { useNavigate } from 'react-router-dom';
import { ProductGrid, ProductFilters } from '../components/ProductComponents';
import toast from 'react-hot-toast';

export const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const navigate = useNavigate();

  const fetchProducts = async (activeFilters = {}) => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts(activeFilters);
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(filters);
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSelectProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Product Catalog</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters */}
        <div className="lg:col-span-1">
          <ProductFilters onFilterChange={handleFilterChange} />
        </div>

        {/* Products */}
        <div className="lg:col-span-3">
          {loading && <div className="text-center py-12">Loading products...</div>}
          {error && <div className="text-center py-12 text-red-600">{error}</div>}
          {!loading && products.length === 0 && (
            <div className="text-center py-12 text-gray-600">No products found</div>
          )}
          {!loading && products.length > 0 && (
            <>
              <p className="text-gray-600 mb-4">{products.length} products found</p>
              <ProductGrid
                products={products}
                onSelectProduct={handleSelectProduct}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};
