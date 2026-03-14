import React, { useEffect, useMemo, useState } from 'react';
import { customOrderService } from '../services';
import toast from 'react-hot-toast';

export const AdminCustomOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingOrderId, setUpdatingOrderId] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await customOrderService.getAllCustomOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load custom orders');
    } finally {
      setLoading(false);
    }
  };

  const getConfirmationLabel = (status) => {
    if (status === 'Accepted' || status === 'Completed') {
      return 'Confirmed';
    }
    return 'Not Confirmed';
  };

  const filteredOrders = useMemo(() => {
    if (filter === 'all') {
      return orders;
    }
    return orders.filter((order) => getConfirmationLabel(order.status) === filter);
  }, [orders, filter]);

  const handleConfirmationUpdate = async (orderId, isConfirmed) => {
    const mappedStatus = isConfirmed ? 'Accepted' : 'Rejected';

    try {
      setUpdatingOrderId(orderId);
      const response = await customOrderService.updateCustomOrderStatus(orderId, mappedStatus);
      const updatedOrder = response.data;

      setOrders((prev) => prev.map((o) => (o._id === orderId ? updatedOrder : o)));
      setSelectedOrder((prev) => (prev && prev._id === orderId ? updatedOrder : prev));
      toast.success(isConfirmed ? 'Marked as Confirmed' : 'Marked as Not Confirmed');
    } catch (error) {
      console.error(error);
      toast.error('Failed to update confirmation status');
    } finally {
      setUpdatingOrderId('');
    }
  };

  const getPillClass = (label) => {
    return label === 'Confirmed'
      ? 'bg-green-100 text-green-700 border-green-200'
      : 'bg-yellow-100 text-yellow-700 border-yellow-200';
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading custom orders...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Custom Order</h1>
        <p className="text-gray-600 mt-1">Review custom order details and mark as Confirmed or Not Confirmed.</p>
      </div>

      <div className="mb-6 flex gap-2">
        {['all', 'Confirmed', 'Not Confirmed'].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`px-4 py-2 rounded-md border text-sm font-medium ${
              filter === item
                ? 'bg-blue-900 text-white border-blue-900'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-600">
          No custom orders found.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm">Reference</th>
                  <th className="px-4 py-3 text-left text-sm">Customer</th>
                  <th className="px-4 py-3 text-left text-sm">Specification</th>
                  <th className="px-4 py-3 text-left text-sm">Qty</th>
                  <th className="px-4 py-3 text-left text-sm">Delivery</th>
                  <th className="px-4 py-3 text-left text-sm">Status</th>
                  <th className="px-4 py-3 text-center text-sm">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => {
                  const label = getConfirmationLabel(order.status);
                  return (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        REF-{order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <p className="font-semibold text-gray-900">{order.customerName}</p>
                        <p>{order.companyName}</p>
                        <p className="text-xs text-gray-500">{order.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <p>{order.coneDegree} | {order.material}</p>
                        <p>L:{order.length} Top:{order.topDiameter} Bottom:{order.bottomDiameter}</p>
                        <p>Thread:{order.threadCompatibility} | {order.strength}</p>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{order.quantity} NOS</td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {new Date(order.deliveryDate).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2.5 py-1 rounded-full border font-semibold ${getPillClass(label)}`}>
                          {label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1">({order.status})</p>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-700 font-semibold hover:text-blue-900"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="p-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Custom Order Details</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                x
              </button>
            </div>

            <div className="p-5 space-y-5 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-500">Reference</p>
                  <p className="font-semibold text-gray-900">REF-{selectedOrder._id.slice(-8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Current Status</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.status}</p>
                </div>
                <div>
                  <p className="text-gray-500">Customer</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.customerName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Company</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.companyName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.phone}</p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><p className="text-gray-500">Cone Degree</p><p className="font-semibold">{selectedOrder.coneDegree}</p></div>
                <div><p className="text-gray-500">Material</p><p className="font-semibold">{selectedOrder.material}</p></div>
                <div><p className="text-gray-500">Color</p><p className="font-semibold">{selectedOrder.color}</p></div>
                <div><p className="text-gray-500">Length</p><p className="font-semibold">{selectedOrder.length} mm</p></div>
                <div><p className="text-gray-500">Top Diameter</p><p className="font-semibold">{selectedOrder.topDiameter} mm</p></div>
                <div><p className="text-gray-500">Bottom Diameter</p><p className="font-semibold">{selectedOrder.bottomDiameter} mm</p></div>
                <div><p className="text-gray-500">Weight</p><p className="font-semibold">{selectedOrder.weight} g</p></div>
                <div><p className="text-gray-500">Thread</p><p className="font-semibold">{selectedOrder.threadCompatibility}</p></div>
                <div><p className="text-gray-500">Strength</p><p className="font-semibold">{selectedOrder.strength}</p></div>
                <div><p className="text-gray-500">Quantity</p><p className="font-semibold">{selectedOrder.quantity} NOS</p></div>
                <div><p className="text-gray-500">Delivery Date</p><p className="font-semibold">{new Date(selectedOrder.deliveryDate).toLocaleDateString('en-IN')}</p></div>
              </div>

              {selectedOrder.notes && (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-gray-500">Notes</p>
                  <p className="font-semibold text-gray-900">{selectedOrder.notes}</p>
                </div>
              )}

              <div className="border-t border-gray-100 pt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => handleConfirmationUpdate(selectedOrder._id, true)}
                  disabled={updatingOrderId === selectedOrder._id}
                  className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-300"
                >
                  {updatingOrderId === selectedOrder._id ? 'Updating...' : 'Confirmed'}
                </button>
                <button
                  onClick={() => handleConfirmationUpdate(selectedOrder._id, false)}
                  disabled={updatingOrderId === selectedOrder._id}
                  className="w-full bg-yellow-500 text-white py-2.5 rounded-lg font-semibold hover:bg-yellow-600 disabled:bg-yellow-300"
                >
                  {updatingOrderId === selectedOrder._id ? 'Updating...' : 'Not Confirmed'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
