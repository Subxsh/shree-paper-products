import React, { useEffect, useMemo, useState } from 'react';
import { customOrderService } from '../services';
import toast from 'react-hot-toast';

export const CustomerOrdersPage = () => {
  const [customOrders, setCustomOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customStatusFilter, setCustomStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await customOrderService.getMyCustomOrders();
      setCustomOrders(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Unable to load your custom orders');
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomOrders = useMemo(() => {
    if (customStatusFilter === 'all') {
      return customOrders;
    }

    const confirmedStatuses = ['Accepted', 'Completed'];

    if (customStatusFilter === 'confirmed') {
      return customOrders.filter((order) => confirmedStatuses.includes(order.status));
    }

    return customOrders.filter((order) => !confirmedStatuses.includes(order.status));
  }, [customOrders, customStatusFilter]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading custom orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Custom Orders</h1>
        <p className="text-gray-600 mt-1">Track your submitted custom cone requests.</p>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'confirmed', label: 'Confirmed' },
          { key: 'not-confirmed', label: 'Not Confirmed' }
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => setCustomStatusFilter(status.key)}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              customStatusFilter === status.key
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {filteredCustomOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-600">
          No custom orders found for this filter.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCustomOrders.map((order) => {
            const isConfirmed = ['Accepted', 'Completed'].includes(order.status);

            return (
              <div key={order._id} className="bg-white rounded-lg border border-gray-200 p-5">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-gray-900">
                        REF-{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          isConfirmed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {isConfirmed ? 'Confirmed' : 'Not Confirmed'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Status: {order.status} | Requested on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <div className="text-right text-sm text-gray-700">
                    <p className="font-medium">{order.coneDegree} Cone</p>
                    <p>{order.quantity} NOS</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
