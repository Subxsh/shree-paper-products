import React, { useState, useEffect } from 'react';
import { productService, orderService } from '../services';
import { StatCard, OrdersChart, SalesChart } from '../components/DashboardComponents';
import toast from 'react-hot-toast';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalStock: 0,
    totalOrders: 0,
    totalValue: 0,
    ordersByStatus: [],
    monthlyOrders: [],
    monthlySales: []
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData({ silent: true });
    }, 30000);

    const handleFocus = () => fetchDashboardData({ silent: true });
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDashboardData({ silent: true });
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchDashboardData = async ({ silent = false } = {}) => {
    try {
      if (!silent) {
        setLoading(true);
      }
      const [productStats, orderStats] = await Promise.all([
        productService.getStats(),
        orderService.getStats()
      ]);

      setStats({
        totalProducts: productStats.data.totalProducts,
        totalStock: productStats.data.totalStock,
        totalOrders: orderStats.data.totalOrders,
        totalValue: orderStats.data.totalValue,
        ordersByStatus: orderStats.data.ordersByStatus,
        monthlyOrders: orderStats.data.monthlyOrders,
        monthlySales: orderStats.data.monthlyOrders
      });
      setLastUpdated(new Date());
    } catch (error) {
      if (!silent) {
        toast.error('Failed to load dashboard data');
      }
      console.error(error);
    } finally {
      if (!silent) {
        setLoading(false);
      }
    }
  };

  const getStatusCount = (status) => {
    const item = stats.ordersByStatus.find(s => s._id === status);
    return item?.count || 0;
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 py-8">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-start justify-between gap-4 mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Live refresh every 30s
          </p>
          <p className="text-sm text-gray-500">
            Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Loading...'}
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="#3B82F6"
        />
        <StatCard
          label="Total Stock"
          value={`${stats.totalStock.toLocaleString()} NOS`}
          icon="📊"
          color="#10B981"
        />
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          icon="📋"
          color="#F59E0B"
        />
        <StatCard
          label="Total Value"
          value={`₹${(stats.totalValue / 100000).toFixed(2)}L`}
          icon="💰"
          color="#8B5CF6"
        />
      </div>

      {/* Order Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Draft Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{getStatusCount('Draft')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Confirmed Orders</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{getStatusCount('Confirmed')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Shipped</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{getStatusCount('Shipped')}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-gray-600 text-sm">Delivered</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{getStatusCount('Delivered')}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersChart data={stats.monthlyOrders} />
        <SalesChart data={stats.monthlySales} />
      </div>
    </div>
  );
};
