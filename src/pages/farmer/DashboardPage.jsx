import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import apiClient from '../../api/client';
import Spinner from '../../components/common/Spinner';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StatusBadge = ({ status }) => {
  const style = {
    PAID: 'bg-green-100 text-green-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
  }[status];
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${style}`}>{status}</span>;
};

const FarmerDashboardPage = () => {
  const { tokens } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await apiClient.get('/api/dashboard/pro-stats/', tokens.access);
        setData(response);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, [tokens.access]);

  const salesChartData = {
    labels: data?.sales_over_time.labels || [],
    datasets: [{
      label: 'Daily Revenue (Ksh)',
      data: data?.sales_over_time.data || [],
      backgroundColor: 'rgba(34, 197, 94, 0.6)',
      borderColor: 'rgb(22, 163, 74)',
      borderWidth: 1,
    }],
  };
  
  if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;
  if (error) return <div className="p-8 text-center text-red-600 bg-red-50">{error}</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">Your Business Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">Ksh {data.total_revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.total_sales_count}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data.active_listings_count}</p>
        </div>
      </div>

      {/* --- Main Content: Graph and Sales Feed --- */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Revenue (Last 30 Days)</h2>
          <Bar options={{ responsive: true, plugins: { legend: { display: false } } }} data={salesChartData} />
        </div>
        
        <div className="xl:col-span-1 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Sales Activity</h2>
          <div className="space-y-4">
            {data.recent_sales.length > 0 ? data.recent_sales.map(item => (
              <div key={item.order_id} className="flex items-center space-x-4">
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{item.animal_name}</p>
                  <p className="text-sm text-gray-500">Sold to {item.buyer} on {item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">Ksh {item.price.toLocaleString()}</p>
                  <StatusBadge status={item.status} />
                </div>
              </div>
            )) : <p className="text-sm text-gray-500 text-center pt-8">No recent sales to display.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboardPage;
