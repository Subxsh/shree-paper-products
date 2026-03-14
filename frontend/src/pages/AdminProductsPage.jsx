import React, { useEffect, useState } from 'react';
import { productService } from '../services';
import toast from 'react-hot-toast';

const initialForm = {
  name: '',
  coneDegree: '3°30',
  length: '',
  topDiameter: '',
  bottomDiameter: '',
  color: 'Sky Blue Solid',
  material: 'Sky Blue Solid',
  weight: '',
  strength: 'Medium',
  threadCompatibility: '',
  price: '',
  stock: 0,
  description: '',
  finishType: 'Plain',
  tipType: 'Round',
  surfaceFinish: 'Matte',
  image: '',
  specifications: '{}'
};

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === 'image') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Please upload PNG, JPG, JPEG, or WEBP image');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = String(reader.result || '');
      setFormData((prev) => ({ ...prev, image: base64 }));
      setImagePreview(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let parsedSpecifications = {};
    try {
      parsedSpecifications = formData.specifications ? JSON.parse(formData.specifications) : {};
    } catch (error) {
      toast.error('Specifications must be valid JSON');
      return;
    }

    const payload = {
      ...formData,
      length: Number(formData.length),
      topDiameter: Number(formData.topDiameter),
      bottomDiameter: Number(formData.bottomDiameter),
      weight: Number(formData.weight),
      price: Number(formData.price),
      stock: Number(formData.stock || 0),
      specifications: parsedSpecifications
    };

    try {
      setSubmitting(true);
      await productService.createProduct(payload);
      toast.success('Product added successfully');
      setFormData(initialForm);
      setImagePreview('');
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to add product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Delete product \"${product.name}\"?`);
    if (!confirmed) {
      return;
    }

    try {
      setDeletingProductId(product._id);
      await productService.deleteProduct(product._id);
      setProducts((prev) => prev.filter((item) => item._id !== product._id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <p className="text-gray-600 mt-1">Admin can add products with image and complete details.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-lg p-5 h-fit">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Product</h2>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <input className="w-full border rounded-md px-3 py-2" placeholder="Product Name" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />

            <select className="w-full border rounded-md px-3 py-2" value={formData.coneDegree} onChange={(e) => handleChange('coneDegree', e.target.value)}>
              <option value="3°30">3°30</option>
              <option value="4°20">4°20</option>
              <option value="4°30">4°30</option>
              <option value="5°57">5°57</option>
              <option value="Custom">Custom</option>
            </select>

            <div className="grid grid-cols-3 gap-2">
              <input type="number" className="w-full border rounded-md px-3 py-2" placeholder="Length" value={formData.length} onChange={(e) => handleChange('length', e.target.value)} required />
              <input type="number" className="w-full border rounded-md px-3 py-2" placeholder="Top Dia" value={formData.topDiameter} onChange={(e) => handleChange('topDiameter', e.target.value)} required />
              <input type="number" className="w-full border rounded-md px-3 py-2" placeholder="Bottom Dia" value={formData.bottomDiameter} onChange={(e) => handleChange('bottomDiameter', e.target.value)} required />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select className="w-full border rounded-md px-3 py-2" value={formData.color} onChange={(e) => handleChange('color', e.target.value)}>
                <option value="Sky Blue Solid">Sky Blue Solid</option>
                <option value="Brown Kraft">Brown Kraft</option>
                <option value="White">White</option>
                <option value="Natural">Natural</option>
                <option value="Custom">Custom</option>
              </select>
              <select className="w-full border rounded-md px-3 py-2" value={formData.material} onChange={(e) => handleChange('material', e.target.value)}>
                <option value="Sky Blue Solid">Sky Blue Solid</option>
                <option value="Brown Kraft">Brown Kraft</option>
                <option value="White Kraft">White Kraft</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <input type="number" className="w-full border rounded-md px-3 py-2" placeholder="Weight (g)" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} required />
              <input type="number" className="w-full border rounded-md px-3 py-2" placeholder="Price" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} required />
              <input type="number" className="w-full border rounded-md px-3 py-2" placeholder="Stock" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} />
            </div>

            <input className="w-full border rounded-md px-3 py-2" placeholder="Thread Compatibility (e.g., 30S)" value={formData.threadCompatibility} onChange={(e) => handleChange('threadCompatibility', e.target.value)} required />

            <div className="grid grid-cols-3 gap-2">
              <select className="w-full border rounded-md px-3 py-2" value={formData.strength} onChange={(e) => handleChange('strength', e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Extra High">Extra High</option>
              </select>
              <select className="w-full border rounded-md px-3 py-2" value={formData.finishType} onChange={(e) => handleChange('finishType', e.target.value)}>
                <option value="Diamond">Diamond</option>
                <option value="Plain">Plain</option>
                <option value="Smooth">Smooth</option>
              </select>
              <select className="w-full border rounded-md px-3 py-2" value={formData.tipType} onChange={(e) => handleChange('tipType', e.target.value)}>
                <option value="Round">Round</option>
                <option value="Sharp">Sharp</option>
                <option value="Flat">Flat</option>
              </select>
            </div>

            <select className="w-full border rounded-md px-3 py-2" value={formData.surfaceFinish} onChange={(e) => handleChange('surfaceFinish', e.target.value)}>
              <option value="Glossy">Glossy</option>
              <option value="Matte">Matte</option>
              <option value="Textured">Textured</option>
            </select>

            <textarea className="w-full border rounded-md px-3 py-2" rows={2} placeholder="Description" value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />

            <input className="w-full border rounded-md px-3 py-2" placeholder="Image URL (optional if uploading file)" value={formData.image} onChange={(e) => handleChange('image', e.target.value)} />
            <input type="file" accept="image/png,image/jpeg,image/jpg,image/webp" className="w-full border rounded-md px-3 py-2" onChange={handleImageUpload} />

            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-md border border-gray-200" />
            )}

            <textarea
              className="w-full border rounded-md px-3 py-2 font-mono text-xs"
              rows={3}
              placeholder='Specifications JSON, e.g. {"ply": 5, "gsm": 220}'
              value={formData.specifications}
              onChange={(e) => handleChange('specifications', e.target.value)}
            />

            <button type="submit" disabled={submitting} className="w-full bg-blue-900 text-white py-2.5 rounded-md font-semibold hover:bg-blue-800 disabled:bg-blue-400">
              {submitting ? 'Adding Product...' : 'Add Product'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Existing Products</h2>
            <span className="text-sm text-gray-500">{products.length} total</span>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            <div className="space-y-3 max-h-[720px] overflow-y-auto pr-1">
              {products.map((product) => (
                <div key={product._id} className="border border-gray-200 rounded-lg p-3 flex gap-3">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="w-16 h-16 rounded object-cover border border-gray-100" />
                  ) : (
                    <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500">No Image</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      {product.coneDegree} | {product.material} | {product.color}
                    </p>
                    <p className="text-sm text-gray-600">
                      Thread: {product.threadCompatibility} | Weight: {product.weight}g | Stock: {product.stock}
                    </p>
                    <p className="text-sm font-semibold text-blue-900">Rs {Number(product.price || 0).toFixed(2)}</p>
                  </div>
                  <div className="flex items-start">
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deletingProductId === product._id}
                      className="bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-700 disabled:bg-red-300"
                    >
                      {deletingProductId === product._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
