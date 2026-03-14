import React, { useState, useEffect } from 'react';
import { orderService } from '../services';
import toast from 'react-hot-toast';
import { formatCurrency, formatDate, downloadPDF } from '../utils/helpers';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async (orderId, poNumber) => {
    try {
      const response = await orderService.exportOrderPDF(orderId);
      downloadPDF(response.data, `${poNumber}.pdf`);
      toast.success('Order exported as PDF');
    } catch (err) {
      toast.error('Failed to export PDF');
      console.error(err);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await orderService.deleteOrder(orderId);
        setOrders(orders.filter(o => o._id !== orderId));
        toast.success('Order deleted successfully');
      } catch (err) {
        toast.error('Failed to delete order');
      }
    }
  };

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-8">Loading orders...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Purchase Orders</h1>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

      {orders.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">No orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">PO Number</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Customer</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Items</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Total</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-semibold text-blue-900">{order.poNumber}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatDate(order.date)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.customerName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="px-6 py-4 font-semibold text-gray-900">{formatCurrency(order.grandTotal)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleExportPDF(order._id, order.poNumber)}
                      className="text-green-600 hover:text-green-800 mr-3"
                    >
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
                <div>
                  <p className="text-gray-600 text-sm">PO Number</p>
                  <p className="font-bold text-gray-900">{selectedOrder.poNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Date</p>
                  <p className="font-bold text-gray-900">{formatDate(selectedOrder.date)}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Customer</p>
                  <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">GST Number</p>
                  <p className="font-bold text-gray-900">{selectedOrder.gstNumber || 'N/A'}</p>
                </div>
              </div>

              <h3 className="font-bold text-gray-900 mb-3">Items</h3>
              <table className="w-full text-sm mb-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left">Qty</th>
                    <th className="px-3 py-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="px-3 py-2">{item.productName}</td>
                      <td className="px-3 py-2">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="space-y-1 mb-6 pb-6 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Basic Total:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.basicTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">CGST:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.cgstTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">SGST:</span>
                  <span className="font-semibold">{formatCurrency(selectedOrder.sgstTotal)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Grand Total:</span>
                  <span className="text-blue-900">{formatCurrency(selectedOrder.grandTotal)}</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleExportPDF(selectedOrder._id, selectedOrder.poNumber)}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
                >
                  Export as PDF
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
