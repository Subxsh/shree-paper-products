import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productService } from '../services';
import { formatCurrency, addToCart } from '../utils/helpers';
import toast from 'react-hot-toast';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await productService.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError('Failed to load product details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-600">{error}</div>;
  if (!product) return <div className="text-center py-12">Product not found</div>;

  const handleAddToCart = () => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      toast.error('Please login to add products to cart');
      navigate('/login');
      return;
    }

    const result = addToCart(product);
    if (result.success) {
      toast.success('Product added to cart!');
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="product-page-container">
      <button
        onClick={() => navigate(-1)}
        className="back-button"
      >
        ← Back
      </button>

      <div className="product-page">
        {/* Product Image/Diagram */}
        <div className="product-image-container">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.insertAdjacentHTML('afterend', '<div class="text-center"><div style="font-size:4rem">📐</div><p style="color:#6b7280">Cone Degree: ' + product.coneDegree + '</p></div>');
              }}
            />
          ) : (
            <div className="text-center">
              <div className="text-6xl text-blue-900 mb-4">📐</div>
              <p className="text-gray-600">Cone Degree: {product.coneDegree}</p>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <p className="text-4xl font-bold text-blue-900 mb-2">{formatCurrency(product.price)}</p>
            <p className="text-gray-600 mb-4">per cone</p>
            <div className="flex gap-4">
              <button 
                onClick={handleAddToCart}
                className="bg-blue-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
              >
                Add to Cart
              </button>
              <button className="border-2 border-blue-900 text-blue-900 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                Contact Sales
              </button>
            </div>
          </div>

          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-900">Specifications</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y">
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Cone Degree</td>
                  <td className="text-gray-600">{product.coneDegree}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Length</td>
                  <td className="text-gray-600">{product.length} mm</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Top Diameter</td>
                  <td className="text-gray-600">{product.topDiameter} mm</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Bottom Diameter</td>
                  <td className="text-gray-600">{product.bottomDiameter} mm</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Weight</td>
                  <td className="text-gray-600">{product.weight} g</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Material</td>
                  <td className="text-gray-600">{product.material}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Color</td>
                  <td className="text-gray-600">{product.color}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Strength</td>
                  <td className="text-gray-600">{product.strength}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Thread Compatibility</td>
                  <td className="text-gray-600">{product.threadCompatibility}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Surface Finish</td>
                  <td className="text-gray-600">{product.surfaceFinish}</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="font-semibold text-gray-900 py-3 pr-4">Stock Available</td>
                  <td className="text-gray-600">{product.stock} NOS</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Manufacturing Details */}
          <div className="mt-8 bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Manufacturing Details</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Manufactured using premium quality materials with precision engineering. All cones undergo rigorous quality testing to ensure
              they meet international standards for use in textile manufacturing.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
