import React, { useState, useEffect } from 'react';
import { orderService } from '../services';
import toast from 'react-hot-toast';

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // For admin, we need to fetch all orders - this requires updating the backend getAllOrders
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService.updateOrder(orderId, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order status');
      console.error(error);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusBadgeColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Confirmed': 'bg-blue-100 text-blue-800',
      'Shipped': 'bg-purple-100 text-purple-800',
      'Delivered': 'bg-green-100 text-green-800',
      'Cancelled': 'bg-red-100 text-red-800',
      'Draft': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const statusFlow = {
    'Draft': ['Confirmed', 'Cancelled'],
    'Confirmed': ['Shipped', 'Cancelled'],
    'Shipped': ['Delivered'],
    'Delivered': [],
    'Cancelled': []
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Orders</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">{orders.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Draft</p>
            <p className="text-3xl font-bold text-gray-600 mt-2">{orders.filter(o => o.status === 'Draft').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Confirmed</p>
            <p className="text-3xl font-bold text-blue-600 mt-2">{orders.filter(o => o.status === 'Confirmed').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Shipped</p>
            <p className="text-3xl font-bold text-purple-600 mt-2">{orders.filter(o => o.status === 'Shipped').length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm font-medium">Delivered</p>
            <p className="text-3xl font-bold text-green-600 mt-2">{orders.filter(o => o.status === 'Delivered').length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {['all', 'Draft', 'Confirmed', 'Shipped', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === status
                  ? 'bg-blue-900 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {status === 'all' ? 'All' : status} ({status === 'all' ? orders.length : orders.filter(o => o.status === status).length})
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Left side - Order info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{order.poNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-gray-600">Customer</p>
                          <p className="font-medium text-gray-900">{order.customerName}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Company</p>
                          <p className="font-medium text-gray-900">{order.userId?.company || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Phone</p>
                          <p className="font-medium text-gray-900">{order.phone}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium text-gray-900">{new Date(order.date).toLocaleDateString('en-IN')}</p>
                        </div>
                      </div>
                    </div>

                    {/* Right side - Amount and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">₹{order.grandTotal?.toFixed(2)}</p>
                        <p className="text-sm text-gray-600">{order.items?.length} item(s)</p>
                      </div>
                      <button
                        onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                        className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium"
                      >
                        {expandedOrder === order._id ? 'Hide' : 'Details'}
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedOrder === order._id && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Items */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Order Items</h4>
                          <div className="space-y-2">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm border-b border-gray-200 pb-2">
                                <div>
                                  <p className="font-medium text-gray-900">{item.productName}</p>
                                  <p className="text-gray-600">Qty: {item.quantity} {item.uom}</p>
                                </div>
                                <p className="font-medium text-gray-900">₹{item.total?.toFixed(2)}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Status Update */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3">Update Status</h4>
                          {statusFlow[order.status]?.length > 0 ? (
                            <div className="space-y-2">
                              {statusFlow[order.status].map((nextStatus) => (
                                <button
                                  key={nextStatus}
                                  onClick={() => handleStatusUpdate(order._id, nextStatus)}
                                  className={`w-full px-4 py-2 rounded-lg font-medium transition ${
                                    nextStatus === 'Cancelled'
                                      ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                      : 'bg-green-100 text-green-800 hover:bg-green-200'
                                  }`}
                                >
                                  Mark as {nextStatus}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-600 text-sm italic">No status update available</p>
                          )}
                        </div>
                      </div>

                      {/* Payment Summary */}
                      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                        <div>
                          <p className="text-gray-600 text-sm">Subtotal</p>
                          <p className="font-bold text-gray-900">₹{order.basicTotal?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">CGST</p>
                          <p className="font-bold text-gray-900">₹{order.cgstTotal?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm">SGST</p>
                          <p className="font-bold text-gray-900">₹{order.sgstTotal?.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 text-sm font-semibold">Grand Total</p>
                          <p className="font-bold text-gray-900 text-lg">₹{order.grandTotal?.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
