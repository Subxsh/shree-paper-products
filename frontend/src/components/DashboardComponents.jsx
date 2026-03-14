import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export const StatCard = ({ label, value, icon, color }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl opacity-20">{icon}</div>
      </div>
    </div>
  );
};

export const OrdersChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No data available</div>;
  }

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        label: 'Orders',
        data: data.map(d => d.count),
        fill: false,
        borderColor: '#1e3a8a',
        tension: 0.4,
        backgroundColor: 'rgba(30, 58, 138, 0.1)'
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Orders per Month</h3>
      <Line data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
};

export const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">No data available</div>;
  }

  const chartData = {
    labels: data.map(d => d._id),
    datasets: [
      {
        label: 'Sales (₹)',
        data: data.map(d => d.total),
        backgroundColor: '#1e3a8a',
        borderColor: '#1e3a8a'
      }
    ]
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-4">Monthly Sales</h3>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
    </div>
  );
};
