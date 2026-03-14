import React, { useState, useEffect } from 'react';
import { customOrderService } from '../services';
import toast from 'react-hot-toast';

export const CustomOrdersComponent = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    ordersByStatus: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  useEffect(() => {
    fetchCustomOrders();
    fetchStats();
  }, [statusFilter]);

  const fetchCustomOrders = async () => {
    try {
      setLoading(true);
      const response = await customOrderService.getAllCustomOrders(statusFilter);
      setOrders(response.data || []);
    } catch (error) {
      console.error('Error fetching custom orders:', error);
      toast.error('Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await customOrderService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await customOrderService.updateCustomOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      
      // Refresh data
      fetchCustomOrders();
      fetchStats();
      setSelectedOrder(null);
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await customOrderService.deleteCustomOrder(orderId);
        toast.success('Order deleted successfully');
        fetchCustomOrders();
        fetchStats();
      } catch (error) {
        console.error('Error deleting order:', error);
        toast.error('Failed to delete order');
      }
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-yellow-100 text-yellow-800',
      'Reviewed': 'bg-blue-100 text-blue-800',
      'Quoted': 'bg-purple-100 text-purple-800',
      'Accepted': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
      'Completed': 'bg-emerald-100 text-emerald-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md border border-yellow-200">
          <p className="text-yellow-800 font-semibold">Total Custom Orders</p>
          <p className="text-3xl font-bold text-yellow-900 mt-2">{stats.totalOrders || 0}</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md border border-blue-200">
          <p className="text-blue-800 font-semibold">Pending Review</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            {stats.ordersByStatus?.find(s => s._id === 'Pending')?.count || 0}
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-green-800 font-semibold">Completed</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            {stats.ordersByStatus?.find(s => s._id === 'Completed')?.count || 0}
          </p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="font-semibold text-gray-900 mb-4">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter('')}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
              statusFilter === '' ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Orders
          </button>
          {['Pending', 'Reviewed', 'Quoted', 'Accepted', 'Completed'].map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                statusFilter === status ? 'bg-blue-900 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading custom orders...</div>
          ) : orders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No custom orders found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Company</th>
                  <th className="px-6 py-4 text-left">Contact</th>
                  <th className="px-6 py-4 text-left">Specification</th>
                  <th className="px-6 py-4 text-left">Quantity</th>
                  <th className="px-6 py-4 text-left">Delivery Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map(order => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-900">{order.customerName}</p>
                      <p className="text-sm text-gray-500">{order.email}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{order.companyName}</td>
                    <td className="px-6 py-4 text-gray-700">{order.phone}</td>
                    <td className="px-6 py-4 text-sm">
                      <p className="text-gray-900 font-semibold">{order.coneDegree}, {order.material}</p>
                      <p className="text-gray-600">L:{order.length}mm, W:{order.weight}g</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700 font-semibold">
                      {order.quantity.toLocaleString()} NOS
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-600 hover:text-blue-900 font-semibold text-sm"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-900 to-blue-800 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-2xl hover:text-gray-200"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order ID */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Order Reference ID</p>
                <p className="text-xl font-mono font-bold text-gray-900">{selectedOrder._id}</p>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Customer Info</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-700">Name:</span> {selectedOrder.customerName}</p>
                    <p><span className="font-semibold text-gray-700">Company:</span> {selectedOrder.companyName}</p>
                    <p><span className="font-semibold text-gray-700">Email:</span> <a href={`mailto:${selectedOrder.email}`} className="text-blue-600 hover:underline">{selectedOrder.email}</a></p>
                    <p><span className="font-semibold text-gray-700">Phone:</span> <a href={`tel:${selectedOrder.phone}`} className="text-blue-600 hover:underline">{selectedOrder.phone}</a></p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">Order Summary</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold text-gray-700">Quantity:</span> {selectedOrder.quantity.toLocaleString()} NOS</p>
                    <p><span className="font-semibold text-gray-700">Required By:</span> {new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><span className="font-semibold text-gray-700">Submitted:</span> {new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p><span className="font-semibold text-gray-700">Status:</span> <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span></p>
                  </div>
                </div>
              </div>

              {/* Cone Specifications */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Cone Specifications</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-xs text-gray-600">Cone Degree</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.coneDegree}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Material</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.material}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Color</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.color}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Length</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.length} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Top Diameter</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.topDiameter} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Bottom Diameter</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.bottomDiameter} mm</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Weight</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.weight}g</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Thread Compatibility</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.threadCompatibility}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Strength</p>
                    <p className="font-semibold text-gray-900">{selectedOrder.strength}</p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Special Instructions</h3>
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </div>
                </div>
              )}

              {/* Status Change */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">Update Status</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {['Pending', 'Reviewed', 'Quoted', 'Accepted', 'Rejected', 'Completed'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(selectedOrder._id, status)}
                      disabled={updatingOrderId === selectedOrder._id || status === selectedOrder.status}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        status === selectedOrder.status
                          ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                          : 'bg-blue-900 text-white hover:bg-blue-800 disabled:bg-gray-400'
                      }`}
                    >
                      {updatingOrderId === selectedOrder._id ? 'Updating...' : status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Delete Button */}
              <div className="border-t pt-6">
                <button
                  onClick={() => {
                    handleDeleteOrder(selectedOrder._id);
                    setSelectedOrder(null);
                  }}
                  className="w-full bg-red-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
                >
                  Delete Order
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full bg-gray-300 text-gray-900 px-4 py-3 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
