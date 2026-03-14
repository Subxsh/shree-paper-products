import React, { useState, useEffect } from 'react';
import { orderService } from '../services';
import toast from 'react-hot-toast';

export const MyOrdersPage = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      toast.error('Failed to load orders');
      console.error(error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading orders...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          <p className="text-gray-600 mt-2">View and track your product orders</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('Pending')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'Pending'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Pending ({orders.filter(o => o.status === 'Pending').length})
          </button>
          <button
            onClick={() => setFilter('Confirmed')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'Confirmed'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Confirmed ({orders.filter(o => o.status === 'Confirmed').length})
          </button>
          <button
            onClick={() => setFilter('Delivered')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === 'Delivered'
                ? 'bg-blue-900 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            Delivered ({orders.filter(o => o.status === 'Delivered').length})
          </button>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">No orders found</p>
            <p className="text-gray-500 text-sm mt-2">You haven't placed any orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">{order.poNumber}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Ordered on {new Date(order.date).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">₹{order.grandTotal?.toFixed(2)}</p>
                      <p className="text-gray-600 text-sm">{order.items?.length} item(s)</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-600 mb-3">
                      <strong>Items:</strong>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {order.items?.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium text-gray-900">{item.productName}</p>
                          <p className="text-gray-600">
                            {item.quantity} {item.uom} @ ₹{item.rate}
                          </p>
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <p className="text-sm text-gray-600 italic">
                          +{order.items.length - 2} more item(s)
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Customer</p>
                      <p className="text-sm font-medium text-gray-900">{order.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Phone</p>
                      <p className="text-sm font-medium text-gray-900">{order.phone}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900">₹{order.basicTotal?.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 uppercase font-semibold">GST</p>
                      <p className="text-sm font-medium text-gray-900">
                        ₹{(order.cgstTotal + order.sgstTotal)?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
