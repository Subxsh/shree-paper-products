import React, { useState } from 'react';
import { formatCurrency } from '../utils/helpers';

export const OrderForm = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    gstNumber: '',
    email: '',
    phone: '',
    address: '',
    city: 'Kangeyam',
    state: 'Tamilnadu',
    pinCode: '',
    items: [{ productId: '', quantity: 1, rate: 0, cgst: 9, sgst: 9 }],
    notes: ''
  });

  const [basicTotal, setBasicTotal] = useState(0);
  const [cgstTotal, setCgstTotal] = useState(0);
  const [sgstTotal, setSgstTotal] = useState(0);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', quantity: 1, rate: 0, cgst: 9, sgst: 9 }]
    });
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index)
    });
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = field === 'quantity' || field === 'rate' ? parseFloat(value) || 0 : value;
    setFormData({ ...formData, items: newItems });
    calculateTotals(newItems);
  };

  const calculateTotals = (items) => {
    let basic = 0;
    let cgst = 0;
    let sgst = 0;

    items.forEach(item => {
      const itemBasic = item.quantity * item.rate;
      basic += itemBasic;
      cgst += itemBasic * (item.cgst / 100);
      sgst += itemBasic * (item.sgst / 100);
    });

    setBasicTotal(basic);
    setCgstTotal(cgst);
    setSgstTotal(sgst);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      basicTotal,
      cgstTotal,
      sgstTotal,
      grandTotal: basicTotal + cgstTotal + sgstTotal
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Customer Name *"
          value={formData.customerName}
          onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
          required
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
        <input
          type="text"
          placeholder="GST Number"
          value={formData.gstNumber}
          onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          className="col-span-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
        <input
          type="text"
          placeholder="City"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
        <input
          type="text"
          placeholder="Pin Code"
          value={formData.pinCode}
          onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
        />
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-2 py-2 text-left">Product ID</th>
              <th className="px-2 py-2 text-left">Qty</th>
              <th className="px-2 py-2 text-left">Rate (₹)</th>
              <th className="px-2 py-2 text-left">CGST %</th>
              <th className="px-2 py-2 text-left">SGST %</th>
              <th className="px-2 py-2 text-right">Total</th>
              <th className="px-2 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {formData.items.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-2 py-2">
                  <input
                    type="text"
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                    placeholder="Product ID"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    min="1"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    step="0.01"
                    className="w-24 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    value={item.cgst}
                    onChange={(e) => handleItemChange(index, 'cgst', e.target.value)}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </td>
                <td className="px-2 py-2">
                  <input
                    type="number"
                    value={item.sgst}
                    onChange={(e) => handleItemChange(index, 'sgst', e.target.value)}
                    min="0"
                    max="100"
                    className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                  />
                </td>
                <td className="px-2 py-2 text-right font-semibold">
                  ₹{(item.quantity * item.rate * (1 + (item.cgst + item.sgst) / 100)).toFixed(2)}
                </td>
                <td className="px-2 py-2 text-center">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="text-red-600 hover:text-red-800 font-bold"
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        onClick={handleAddItem}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
      >
        + Add Item
      </button>

      {/* Totals */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-end gap-8">
          <div>
            <p className="text-gray-700">Basic Total:</p>
            <p className="text-gray-700">CGST Total:</p>
            <p className="text-gray-700">SGST Total:</p>
            <p className="text-lg font-bold text-blue-900">Grand Total:</p>
          </div>
          <div className="text-right">
            <p className="text-gray-700 font-semibold">₹{basicTotal.toFixed(2)}</p>
            <p className="text-gray-700 font-semibold">₹{cgstTotal.toFixed(2)}</p>
            <p className="text-gray-700 font-semibold">₹{sgstTotal.toFixed(2)}</p>
            <p className="text-lg font-bold text-blue-900">₹{(basicTotal + cgstTotal + sgstTotal).toFixed(2)}</p>
          </div>
        </div>
      </div>

      <textarea
        placeholder="Notes (optional)"
        value={formData.notes}
        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        rows="3"
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-900"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-lg disabled:opacity-50"
      >
        {isLoading ? 'Creating Order...' : 'Create Purchase Order'}
      </button>
    </form>
  );
};
